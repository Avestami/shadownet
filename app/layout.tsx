import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import AuthProvider from "./context/AuthProvider";
import SocketProvider from "./components/SocketProvider";
import { LanguageProvider } from './contexts/LanguageContext'
import SignOutButtonWrapper from "./components/SignOutButtonWrapper";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "ShadowNet: Hidden Truths of Mankind",
  description: "A futuristic hacker-themed decryption game with Persian influences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className="antialiased overflow-hidden m-0 p-0"
      >
        <AuthProvider>
          <SocketProvider>
            <LanguageProvider>
              <SignOutButtonWrapper />
              {children}
            </LanguageProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
