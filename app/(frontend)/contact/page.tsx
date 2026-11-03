import React from "react";
import type { Metadata } from "next";
import { getSiteAuthor } from "@/lib/posts";
import { getSocialLinks, SocialLinks } from "../_components/SocialLinks";
import { PageHero } from "../_components/PageHero";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Kirim pesan, koreksi, atau ide cerita kepada redaksi Chronica.",
};

export default async function ContactPage() {
  const author = await getSiteAuthor();

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20">
      <PageHero
        image="/images/hero-contact.jpg"
        imagePosition="center 45%"
        badge="Kontak"
        title="Mari ngobrol,"
        highlight="kirim kabar."
        highlightClass="bg-neon-green text-black"
        description="Punya pertanyaan, koreksi, atau ide cerita? Kirim pesan dan langsung sampai ke meja redaksi."
        ticker="• KIRIM KABAR • SURAT • KOLABORASI • IDE CERITA • NGOPI • CHRONICA •"
      />

      <section className="mt-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="border-2 border-black bg-cream-dark p-6 rounded-md shadow-[4px_4px_0px_#0A0A0A]">
                <h2 className="text-display text-xl uppercase text-black mb-4 font-black">Cara Kerjanya</h2>
                <p className="font-bold text-sm text-black/75 leading-relaxed">
                  Pesan disimpan dengan aman dan dibaca langsung oleh {author?.name ?? "redaksi"}. Cantumkan email yang aktif agar balasan bisa sampai.
                </p>
              </div>

              {getSocialLinks(author?.social).length > 0 && (
                <div className="border-2 border-black bg-white p-6 rounded-md shadow-[4px_4px_0px_#0A0A0A]">
                  <h2 className="text-display text-xl uppercase text-black mb-4 font-black">Temukan Saya</h2>
                  <SocialLinks social={author?.social} />
                </div>
              )}
            </div>

            <div className="md:col-span-7">
              <div className="border-3 border-black bg-white p-6 sm:p-8 rounded-md shadow-[6px_6px_0px_#0A0A0A]">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
