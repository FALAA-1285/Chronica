import React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { Author } from "@/lib/types";
import { SocialLinks } from "./SocialLinks";

const FOOTER_LINKS = [
  { name: "Beranda", href: "/" },
  { name: "Semua Artikel", href: "/blog" },
  { name: "Tentang", href: "/about" },
  { name: "Kontak", href: "/contact" },
];

export const Footer = ({ author }: { author: Author | null }) => {
  return (
    <footer className="w-full border-t-3 border-black bg-cream-dark pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          <div className="flex flex-col gap-4 max-w-lg">
            <Link href="/" className="flex items-center w-fit">
              <div className="flex h-12 items-center justify-center border-2 border-black bg-yellow px-4 font-mono text-xl font-black uppercase tracking-tight shadow-[3px_3px_0px_#000]">
                <BookOpen className="mr-2 h-5 w-5" aria-hidden="true" />
                <span>Chronica</span>
              </div>
            </Link>
            <p className="max-w-md font-semibold text-black/75 text-base mt-2">
              Ruang kurasi tulisan editorial seputar opini kritis, ulasan musik, bedah buku sastra, dan analisis sinema.
            </p>
            <div className="mt-4">
              <SocialLinks social={author?.social} />
            </div>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-4">
            <h3 className="font-black text-lg uppercase border-b-2 border-black w-fit pb-1 text-black">Navigasi</h3>
            <ul className="flex flex-col gap-2 font-bold text-black/80 text-sm">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-electric-blue hover:underline underline-offset-4">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t-2 border-black pt-8 font-mono text-sm text-black/60">
          <p>
            Dibuat oleh Falaa · © {new Date().getFullYear()} Chronica
            {author ? ` · Ditulis oleh ${author.name}` : ""}
          </p>
        </div>
      </div>
    </footer>
  );
};
