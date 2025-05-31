import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";

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
        if (!credentials?.username || !credentials?.password) {
          console.log("Missing username or password");
          return null;
        }

        try {
          // Find user by username
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
          });

          // If user doesn't exist
          if (!user) {
            console.log("User not found:", credentials.username);
            return null;
          }
          
          // Compare the input password with stored hash
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) {
            console.log("Invalid password for user:", credentials.username);
            return null;
          }

          // Create and store a new session
          await prisma.session.create({
            data: {
              userId: user.id,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
          });

          console.log("Login successful for user:", user.username);
          
          // Return the user data (excluding password)
          return {
            id: user.id,
            name: user.username,
            email: user.email || undefined,
          };
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      console.log("[NextAuth] JWT callback triggered:", { trigger, tokenId: token?.id });
      
      // Initial sign in
      if (user) {
        console.log("[NextAuth] JWT callback: User signed in", { userId: user.id });
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      
      // Handle token updates if needed
      if (trigger === "update" && session) {
        console.log("[NextAuth] JWT update triggered with session:", session);
        // If you have session data to update the token with
        if (session.user) {
          token = { ...token, ...session.user };
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      console.log("[NextAuth] Session callback triggered", { 
        hasToken: !!token, 
        hasUser: !!session?.user,
        tokenId: token?.id
      });
      
      if (session?.user && token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      
      return session;
    },
  },
  debug: process.env.NODE_ENV !== "production",
  logger: {
    error(code, metadata) {
      console.error(`[NextAuth] [Error] ${code}:`, metadata);
    },
    warn(code) {
      console.warn(`[NextAuth] [Warning] ${code}`);
    },
    debug(code, metadata) {
      console.log(`[NextAuth] ${code}:`, metadata);
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
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" 
        ? "__Secure-next-auth.session-token" 
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
});

export { handler as GET, handler as POST }; 