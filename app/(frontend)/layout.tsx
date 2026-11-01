import React from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import "../globals.css";
import { fontVariables } from "../fonts";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getSiteAuthor, getTracks } from "@/lib/posts";
import { Navbar } from "./_components/Navbar";
import { Footer } from "./_components/Footer";
import { SearchModal } from "./_components/SearchModal";
import { MusicPlayer } from "./_components/MusicPlayer";

const description =
  "An editorial blog exploring the archives of world history, political theories, geopolitics, and classical literature critiques.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — History, Politics & Letters`,
    template: `%s | ${SITE_NAME}`,
  },
  description,
  keywords: ["history", "politics", "literature", "philosophy", "geopolitics", "sejarah", "politik", "sastra", "filsafat"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — History, Politics & Letters`,
    description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default async function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // All public pages read live data from the database on each request.
  await connection();
  const [author, tracks] = await Promise.all([getSiteAuthor(), getTracks()]);

  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer author={author} />
        <SearchModal />
        <MusicPlayer tracks={tracks} />
      </body>
    </html>
  );
}
