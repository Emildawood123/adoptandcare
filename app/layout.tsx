"use client";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import './globals.css'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <html lang="en">
        <body><Toaster position="top-center" />{children}</body>
      </html>
    </SessionProvider>
  );
}
