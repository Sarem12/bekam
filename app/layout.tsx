import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ❌ Removed AuthGuard - The Middleware now handles the "Gatekeeping"
// import AuthGuard from "@/components/AuthGuard"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bekam AI | Admin",
  description: "Curriculum Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950`}>
        {/* Since Middleware protects /admin, we don't need a wrapper here.
            The children will only render if the Middleware allows it.
        */}
        {children}
      </body>
    </html>
  );
}