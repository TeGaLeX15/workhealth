import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import AppHeader from "@/app/components/AppHeader";
import BottomNavigation from "@/app/components/BottomNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Body OS",
  description: "Твоя система тренировок",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="overflow-x-hidden bg-white text-zinc-950">
        <AppHeader />

        <main className="mx-auto w-full max-w-xl px-5 pb-28">
          {children}
        </main>

        <BottomNavigation />
      </body>
    </html>
  );
}