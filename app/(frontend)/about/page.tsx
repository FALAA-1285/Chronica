import React from "react";
import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { estimateReadingTime } from "@/lib/format";
import { getSiteAuthor } from "@/lib/posts";
import { MarkdownContent } from "../_components/MarkdownContent";
import { SafeImage } from "../_components/SafeImage";
import { SocialLinks } from "../_components/SocialLinks";
import { PageHero } from "../_components/PageHero";

export async function generateMetadata(): Promise<Metadata> {
  const author = await getSiteAuthor();
  return {
    title: author ? `Tentang ${author.name}` : "Tentang",
    description: author?.bio.slice(0, 160) || "Mengenal penulis di balik jurnal digital Chronica.",
  };
}

export default async function AboutPage() {
  const author = await getSiteAuthor();
  // Fall back to the short bio until a full story is written in the CMS.
  const story = author?.story.trim() || author?.bio.trim() || "";

  return (
    <div lang="id" className="flex flex-col min-h-screen bg-white pb-20">
      <PageHero
        image="/images/hero-about.jpg"
        imagePosition="center 40%"
        badge="Tentang Saya"
        title="Cerita di balik"
        highlight="tulisan."
        highlightClass="bg-coral text-white"
        description="Menelusuri sejarah, mengapresiasi karya sastra klasik, dan merayakan keindahan peradaban."
        ticker="• TENTANG SAYA • CERITA • TINTA • KENANGAN • SASTRA • CHRONICA •"
      />

      {author ? (
        <section className="mt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
                <div className="border-3 border-black bg-cream rounded-lg p-6 shadow-[8px_8px_0px_#0A0A0A] flex flex-col items-center text-center">
                  <div className="relative h-32 w-32 border-3 border-black rounded-full overflow-hidden bg-yellow mb-6 shadow-[4px_4px_0px_#0A0A0A]">
                    <SafeImage src={author.avatar} alt={author.name} fill sizes="128px" className="object-cover" />
                  </div>
                  <h2 className="text-display text-2xl text-black font-black leading-tight">{author.name}</h2>
                  <div className="bg-electric-blue text-white font-mono text-xs font-bold uppercase px-3 py-1 mt-3 border border-black rounded shadow-[2px_2px_0px_#000]">
                    Penulis Utama
                  </div>
                  <div className="mt-6 border-t border-dashed border-black/25 pt-5 w-full flex justify-center">
                    <SocialLinks social={author.social} />
                  </div>
                </div>
              </div>

              <article className="lg:col-span-8">
                {author.bio && author.story.trim() && (
                  <p className="text-lg sm:text-xl font-bold text-black leading-relaxed border-l-4 border-coral pl-5 mb-10 whitespace-pre-line">
                    {author.bio}
                  </p>
                )}

                {story ? (
                  <>
                    <p className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-black/50 mb-8 border-b-2 border-dashed border-black/20 pb-4">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {estimateReadingTime(story)} menit membaca
                    </p>
                    <MarkdownContent content={story} />
                  </>
                ) : (
                  <p className="font-bold text-black/60">Cerita belum ditulis.</p>
                )}
              </article>
            </div>
          </div>
        </section>
      ) : (
        <p className="mx-auto max-w-xl mt-16 px-4 text-center font-bold text-black/60">Profil penulis belum tersedia.</p>
      )}
    </div>
  );
}
