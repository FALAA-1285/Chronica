import React from "react";
import type { Metadata } from "next";
import { Book, BookOpen, Film, Heart, Music, Sparkles, type LucideIcon } from "lucide-react";
import { getSiteAuthor } from "@/lib/posts";
import { SafeImage } from "../_components/SafeImage";
import { SocialLinks } from "../_components/SocialLinks";

export async function generateMetadata(): Promise<Metadata> {
  const author = await getSiteAuthor();
  return {
    title: author ? `Tentang ${author.name}` : "Tentang",
    description: author?.bio.slice(0, 160) || "Mengenal penulis di balik jurnal digital Chronica.",
  };
}

interface Favorite {
  title: string;
  by?: string;
  note: string;
}

const FAVORITES: { heading: string; Icon: LucideIcon; iconClass: string; items: Favorite[] }[] = [
  {
    heading: "Film Favorit",
    Icon: Film,
    iconClass: "bg-yellow text-black",
    items: [
      { title: "Interstellar", note: "Karya fiksi ilmiah megah yang menyandingkan relativitas waktu fisika dengan kedalaman cinta seorang ayah." },
      { title: "Inception", note: "Eksplorasi lapisan mimpi yang luar biasa cerdas dengan plot tak terduga dan penyutradaraan brutal." },
      { title: "Spirited Away", note: "Animasi Studio Ghibli yang memikat, kaya akan cerita rakyat kuno Jepang dan petualangan metamorfosis jiwa." },
      { title: "Laskar Pelangi", note: "Kisah perjuangan anak-anak Laskar Pelangi meraih pendidikan di Belitung yang penuh ketulusan hati." },
    ],
  },
  {
    heading: "Buku Favorit",
    Icon: Book,
    iconClass: "bg-orange text-black",
    items: [
      { title: "Bumi Manusia", by: "Pramoedya Ananta Toer", note: "Karya sastra legendaris yang menangkap penindasan kolonialisme dan gejolak kebangkitan nasionalisme." },
      { title: "Dunia Sophie", by: "Jostein Gaarder", note: "Novel petualangan misterius yang merangkum rentetan sejarah filsafat Barat dengan kemasan yang sangat asyik." },
      { title: "One Hundred Years of Solitude", by: "Gabriel García Márquez", note: "Karya realisme magis terindah tentang takdir kesunyian keluarga Buendía di kota legendaris Macondo." },
    ],
  },
  {
    heading: "Musik Favorit",
    Icon: Music,
    iconClass: "bg-purple text-white",
    items: [
      { title: "Classical Piano", by: "Chopin, Debussy, Beethoven", note: "Komposisi solo piano klasik yang menenangkan jiwa, ideal untuk fokus menulis ulasan sejarah panjang." },
      { title: "Indie Folk Indonesia", by: "Banda Neira, Float, Fourtwnty", note: "Musik akustik puitis dengan melodi syahdu yang membawa kedamaian dan perenungan." },
      { title: "Lo-Fi / Chillhop Beats", note: "Ketukan lo-fi instrumental yang santai, cocok diputar di sore hari sambil membaca." },
    ],
  },
];

export default async function AboutPage() {
  const author = await getSiteAuthor();

  return (
    <div lang="id" className="flex flex-col min-h-screen bg-white pb-20">
      <section className="border-b-3 border-black bg-coral py-14 lg:py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:24px_24px] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-3">
            <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-white" aria-hidden="true" />
            <h1 className="text-display text-4xl sm:text-6xl lg:text-7xl tracking-tight uppercase">Tentang Saya</h1>
          </div>
          <p className="font-bold text-sm sm:text-lg max-w-2xl mt-4 text-white/95 leading-relaxed">
            Menelusuri sejarah, mengapresiasi karya sastra klasik, dan merayakan keindahan peradaban.
          </p>
        </div>
      </section>

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

              <div className="lg:col-span-8 flex flex-col gap-10">
                <div className="border-3 border-black bg-cream-dark p-6 sm:p-8 rounded-lg shadow-[6px_6px_0px_#0A0A0A]">
                  <div className="flex items-center gap-2 mb-4 border-b border-black pb-3">
                    <Sparkles className="h-6 w-6 text-yellow-500 fill-yellow-500" aria-hidden="true" />
                    <h3 className="text-display text-xl sm:text-2xl text-black uppercase">Kisah Hidup &amp; Visi Saya</h3>
                  </div>
                  <div className="font-semibold text-black/80 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                    {author.bio || "Biografi belum diisi."}
                  </div>
                </div>

                <div className="inline-flex w-fit items-center gap-2 border-2 border-black bg-neon-green text-black px-4 py-2 font-mono text-sm font-black uppercase rounded shadow-[3px_3px_0px_#000]">
                  <Heart className="h-4 w-4 fill-black shrink-0" aria-hidden="true" />
                  <h3>Hal-Hal yang Saya Sukai</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {FAVORITES.map(({ heading, Icon, iconClass, items }) => (
                    <div key={heading} className="border-2 border-black bg-white rounded-md p-5 shadow-[4px_4px_0px_#000] flex flex-col">
                      <div className="flex items-center gap-2 border-b-2 border-black pb-3 mb-4">
                        <div className={`p-1.5 border border-black rounded ${iconClass}`}>
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <h4 className="font-black text-base text-black uppercase tracking-wide">{heading}</h4>
                      </div>
                      <ul className="flex flex-col gap-4 flex-grow font-semibold text-sm text-black/85">
                        {items.map((item) => (
                          <li key={item.title} className="border-b border-dashed border-black/20 pb-2 last:border-b-0">
                            <strong className="text-black text-base block font-bold">{item.title}</strong>
                            {item.by && <span className="text-xs text-black/60 block mt-1 font-mono italic">— {item.by}</span>}
                            <span className="text-xs text-black/60 leading-snug block mt-1">{item.note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <p className="mx-auto max-w-xl mt-16 px-4 text-center font-bold text-black/60">Profil penulis belum tersedia.</p>
      )}
    </div>
  );
}
