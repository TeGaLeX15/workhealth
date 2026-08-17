// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/app/providers/theme-provider";

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

  manifest: "/icons/site.webmanifest",

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/icons/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16",
      },
      {
        url: "/icons/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/icons/android-chrome-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/icons/android-chrome-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],

    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "contain",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />

        <meta
          name="theme-color"
          content="#09090b"
          media="(prefers-color-scheme: dark)"
        />

        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>

      <body
        className="min-h-dvh"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
