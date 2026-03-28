import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { Header } from "@/components/Header";
import { getUserById } from "@/lib/service";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session_token")?.value;
  const user = userId ? await getUserById(userId) : null;
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-100`}>
        {user && <Header user={user} />}
        {children}
      </body>
    </html>
  );
}