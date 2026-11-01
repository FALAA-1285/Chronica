import React from "react";
import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "./_components/Navbar";
import { Footer } from "./_components/Footer";
import { SearchModal } from "./_components/SearchModal";
import { MusicPlayer } from "./_components/MusicPlayer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Chronica — History, Politics & Letters",
    template: "%s | Chronica",
  },
  description:
    "An editorial Neo-Brutalist blog exploring the archives of world history, political theories, geopolitics, and classical literature critiques.",
  keywords: [
    "history",
    "politics",
    "literature",
    "philosophy",
    "geopolitics",
    "classics",
    "culture",
    "social science",
    "sejarah",
    "politik",
    "literatur",
    "filsafat"
  ],
  authors: [{ name: "Chronica Team" }],
  creator: "Chronica",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chronica.org",
    siteName: "Chronica",
    title: "Chronica — History, Politics & Letters",
    description:
      "An editorial Neo-Brutalist blog exploring the archives of world history, political theories, geopolitics, and classical literature critiques.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chronica — History, Politics & Letters",
    description: "An editorial blog exploring history, geopolitics, philosophy, and classical literature.",
    creator: "@chronica",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <SearchModal />
          <MusicPlayer />
        </Providers>
      </body>
    </html>
  );
}
