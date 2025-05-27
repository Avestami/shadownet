import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "../../../../lib/prisma";

// NextAuth handler
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize attempting with credentials:", { 
          username: credentials?.username 
        });

        if (!credentials?.username || !credentials?.password) {
          console.log("Missing username or password");
          throw new Error("Please enter username and password");
        }

        try {
          // Find user by username
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
          });

          // If user doesn't exist
          if (!user) {
            console.log("User not found:", credentials.username);
            throw new Error("User not found");
          }
          
          console.log("User found, comparing password");
          
          // Compare the input password with stored hash
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) {
            console.log("Invalid password for user:", credentials.username);
            throw new Error("Invalid password");
          }

          console.log("Password matched, creating session");

          // Create and store a new session
          await prisma.session.create({
            data: {
              userId: user.id,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
          });

          console.log("Session created, returning user");

          // Return the user data (excluding password)
          return {
            id: user.id,
            username: user.username,
            email: user.email || "",
          };
        } catch (error) {
          console.error("Error in authorize function:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as any;
        const customToken = token as any;
        console.log("JWT callback - user found:", customUser.username);
        customToken.id = customUser.id;
        customToken.username = customUser.username;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback called");
      if (session?.user) {
        const customSession = session as any;
        const customToken = token as any;
        customSession.user.id = customToken.id;
        customSession.user.username = customToken.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  debug: true, // Always enable debug mode to help troubleshoot
});

export { handler as GET, handler as POST }; 