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

const description = "Ruang kurasi tulisan editorial seputar opini kritis, ulasan musik, bedah buku sastra, dan analisis sinema.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Opini, Musik, Buku & Movie`,
    template: `%s | ${SITE_NAME}`,
  },
  description,
  keywords: ["opini", "esai", "musik", "buku", "sastra", "film", "ulasan", "blog"],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Opini, Musik, Buku & Movie`,
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
    <html lang="id" className={fontVariables}>
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
