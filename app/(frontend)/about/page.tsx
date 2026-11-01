import React from "react";
import Image from "next/image";
import { BookOpen, MapPin, Film, Book, Music, Heart, Sparkles } from "lucide-react";
import { Github, Twitter, Linkedin } from "../_components/ui/Icons";
import { prisma } from "../_lib/db";
import { authors as staticAuthors } from "../_lib/posts";

export const metadata = {
  title: "Tentang Bambang Utomo | Chronica",
  description: "Mengenal Prof. Bambang Utomo, sejarawan sosial, penulis utama, dan kurator di balik jurnal digital Chronica.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  let author = staticAuthors[0];
  try {
    const dbAuthor = await prisma.author.findUnique({
      where: { id: "1" },
    });
    if (dbAuthor) {
      author = {
        id: dbAuthor.id,
        name: dbAuthor.name,
        avatar: dbAuthor.avatar || author.avatar,
        bio: dbAuthor.bio || author.bio,
        social: {
          twitter: dbAuthor.twitter || undefined,
          github: dbAuthor.github || undefined,
          linkedin: dbAuthor.linkedin || undefined,
        }
      };
    }
  } catch (err) {
    console.error("Failed to load author on about page:", err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-dark-bg transition-colors pb-20 select-none">
      
      {/* Banner / Hero Header */}
      <section className="border-b-3 border-black dark:border-cream bg-coral py-14 lg:py-20 text-white relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:24px_24px] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-3">
            <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
            <h1 className="text-display text-4xl sm:text-6xl lg:text-7xl tracking-tight uppercase">
              TENTANG SAYA
            </h1>
          </div>
          <p className="font-bold text-sm sm:text-lg max-w-2xl mt-4 text-white/95 leading-relaxed">
            Menelusuri sejarah, mengapresiasi karya sastra klasik, dan merayakan keindahan peradaban. Mari berkenalan lebih dekat dengan pendiri Chronica.
          </p>
        </div>
      </section>

      {/* Main Profile & Story Section */}
      <section className="mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Avatar & Quick Info Card */}
            <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
              {/* Profile Card */}
              <div className="border-3 border-black bg-cream rounded-lg p-6 shadow-[8px_8px_0px_#0A0A0A] dark:border-cream dark:bg-dark-surface dark:shadow-[8px_8px_0px_#FFFBF0] transition-all flex flex-col items-center text-center">
                {/* Large Avatar */}
                <div className="relative h-32 w-32 border-3 border-black dark:border-cream rounded-full overflow-hidden bg-yellow mb-6 shadow-[4px_4px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_#FFFBF0]">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Name & Title */}
                <h2 className="text-display text-2xl text-black font-black dark:text-cream leading-tight">
                  {author.name}
                </h2>
                <div className="bg-electric-blue text-white font-mono text-xs font-bold uppercase px-3 py-1 mt-3 border border-black rounded shadow-[2px_2px_0px_#000] dark:border-cream dark:shadow-[2px_2px_0px_#FFF]">
                  Sejarawan & Blogger Utama
                </div>

                {/* Quick Info Badge: Birthplace */}
                <div className="mt-6 flex items-center gap-2 text-black/85 dark:text-cream/85 font-bold text-sm bg-yellow/20 dark:bg-yellow/10 border border-dashed border-black/35 dark:border-cream/35 px-4 py-2.5 rounded-md w-full justify-center">
                  <MapPin className="h-5 w-5 text-coral shrink-0" />
                  <span className="text-left leading-snug">Lahir & Dibesarkan di <strong className="text-black dark:text-cream">Bandung, Jawa Barat</strong></span>
                </div>

                {/* Social links */}
                <div className="flex items-center gap-4 mt-6 border-t border-dashed border-black/25 dark:border-cream/25 pt-5 w-full justify-center">
                  {author.social.github && (
                    <a
                      href={`https://github.com/${author.social.github}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-10 w-10 items-center justify-center border-2 border-black bg-white hover:bg-yellow dark:bg-dark-bg dark:hover:bg-yellow rounded shadow-[2px_2px_0px_#000] dark:border-cream dark:shadow-[2px_2px_0px_#FFF] transition-all text-black dark:text-cream dark:hover:text-black"
                      aria-label="GitHub"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {author.social.twitter && (
                    <a
                      href={`https://twitter.com/${author.social.twitter}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-10 w-10 items-center justify-center border-2 border-black bg-white hover:bg-yellow dark:bg-dark-bg dark:hover:bg-yellow rounded shadow-[2px_2px_0px_#000] dark:border-cream dark:shadow-[2px_2px_0px_#FFF] transition-all text-black dark:text-cream dark:hover:text-black"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {author.social.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${author.social.linkedin}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-10 w-10 items-center justify-center border-2 border-black bg-white hover:bg-yellow dark:bg-dark-bg dark:hover:bg-yellow rounded shadow-[2px_2px_0px_#000] dark:border-cream dark:shadow-[2px_2px_0px_#FFF] transition-all text-black dark:text-cream dark:hover:text-black"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Bio & Curated Favorites */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              
              {/* Detailed Biography Card */}
              <div className="border-3 border-black bg-cream-dark p-6 sm:p-8 rounded-lg shadow-[6px_6px_0px_#0A0A0A] dark:border-cream dark:bg-dark-surface dark:shadow-[6px_6px_0px_#FFFBF0] transition-all">
                <div className="flex items-center gap-2 mb-4 border-b border-black dark:border-cream pb-3">
                  <Sparkles className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  <h3 className="text-display text-xl sm:text-2xl text-black uppercase dark:text-cream">
                    Kisah Hidup & Visi Saya
                  </h3>
                </div>
                <div className="font-semibold text-black/80 dark:text-cream/80 text-base sm:text-lg leading-relaxed whitespace-pre-line select-text">
                  {author.bio}
                </div>
              </div>

              {/* Favorites Title */}
              <div className="text-left mt-4">
                <div className="inline-flex items-center gap-2 border-2 border-black bg-neon-green text-black px-4 py-2 font-mono text-sm font-black uppercase rounded shadow-[3px_3px_0px_#000] dark:border-cream dark:shadow-[3px_3px_0px_#FFF]">
                  <Heart className="h-4 w-4 fill-black text-black shrink-0" />
                  <span>Hal-Hal yang Saya Sukai (Curated Favorites)</span>
                </div>
              </div>

              {/* Grid for Favorites */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Movies Column */}
                <div className="border-2 border-black bg-white rounded-md p-5 shadow-[4px_4px_0px_#000] dark:border-cream dark:bg-dark-surface dark:shadow-[4px_4px_0px_#FFF] transition-all flex flex-col">
                  <div className="flex items-center gap-2 border-b-2 border-black dark:border-cream pb-3 mb-4">
                    <div className="p-1.5 border border-black bg-yellow text-black rounded dark:border-cream">
                      <Film className="h-4 w-4" />
                    </div>
                    <h4 className="font-black text-base text-black dark:text-cream uppercase tracking-wide">
                      Film Favorit
                    </h4>
                  </div>
                  <ul className="flex flex-col gap-4 flex-grow font-semibold text-sm text-black/85 dark:text-cream/85">
                    <li className="border-b border-dashed border-black/20 dark:border-cream/20 pb-2">
                      <strong className="text-black dark:text-cream text-base block font-bold">Interstellar</strong>
                      <span className="text-xs text-black/60 dark:text-cream/60 leading-snug block mt-1">
                        Karya fiksi ilmiah megah yang menyandingkan relativitas waktu fisika dengan kedalaman cinta seorang ayah.
                      </span>
                    </li>
                    <li className="border-b border-dashed border-black/20 dark:border-cream/20 pb-2">
                      <strong className="text-black dark:text-cream text-base block font-bold">Inception</strong>
                      <span className="text-xs text-black/60 dark:text-cream/60 leading-snug block mt-1">
                        Eksplorasi lapisan mimpi yang luar biasa cerdas dengan plot tak terduga dan penyutradaraan brutal.
                      </span>
                    </li>
                    <li className="border-b border-dashed border-black/20 dark:border-cream/20 pb-2">
                      <strong className="text-black dark:text-cream text-base block font-bold">Spirited Away</strong>
                      <span className="text-xs text-black/60 dark:text-cream/60 leading-snug block mt-1">
                        Animasi Studio Ghibli yang memikat, kaya akan cerita rakyat kuno Jepang dan petualangan metamorfosis jiwa.
                      </span>
                    </li>
                    <li>
                      <strong className="text-black dark:text-cream text-base block font-bold">Laskar Pelangi</strong>
                      <span className="text-xs text-black/60 dark:text-cream/60 leading-snug block mt-1">
                        Kisah perjuangan anak-anak Laskar Pelangi meraih pendidikan di Belitung yang penuh ketulusan hati.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 2. Books Column */}
                <div className="border-2 border-black bg-white rounded-md p-5 shadow-[4px_4px_0px_#000] dark:border-cream dark:bg-dark-surface dark:shadow-[4px_4px_0px_#FFF] transition-all flex flex-col">
                  <div className="flex items-center gap-2 border-b-2 border-black dark:border-cream pb-3 mb-4">
                    <div className="p-1.5 border border-black bg-orange text-black rounded dark:border-cream">
                      <Book className="h-4 w-4" />
                    </div>
                    <h4 className="font-black text-base text-black dark:text-cream uppercase tracking-wide">
                      Buku Favorit
                    </h4>
                  </div>
                  <ul className="flex flex-col gap-4 flex-grow font-semibold text-sm text-black/85 dark:text-cream/85">
                    <li className="border-b border-dashed border-black/20 dark:border-cream/20 pb-2">
                      <strong className="text-black dark:text-cream text-base block font-bold">Bumi Manusia</strong>
                      <span className="text-xs text-black/60 dark:text-cream/60 leading-snug block mt-1 font-mono italic">
                        — Pramoedya Ananta Toer
                      </span>
                      <span className="text-xs text-black/60 dark:text-cream/60 leading-snug block mt-1">
                        Karya sastra legendaris yang menangkap penindasan kolonialisme dan gejolak kebangkitan nasionalisme.
                      </span>
                    </li>
                    <li className="border-b border-dashed border-black/20 dark:border-cream/20 pb-2">
                      <strong className="text-black dark:text-cream text-base block font-bold">Dunia Sophie</strong>
                      <span className="text-xs text-black/60 dark:text-cream/60 leading-snug block mt-1 font-mono italic">
                        — Jostein Gaarder
                      </span>
                      <span className="text-xs text-black/60 dark:text-cream/60 leading-snug block mt-1">
                        Novel petualangan misterius yang merangkum rentetan sejarah filsafat Barat dengan kemasan yang sangat asyik.
                      </span>
                    </li>
                    <li>
                      <strong className="text-black dark:text-cream text-base block font-bold">One Hundred Years of Solitude</strong>
                      <span className="text-xs text-black/60 dark:text-cream/60 leading-snug block mt-1 font-mono italic">
                        — Gabriel García Márquez
                      </span>
                      <span className="text-xs text-black/60 dark:text-cream/60 leading-snug block mt-1">
                        Karya realisme magis terindah tentang takdir kesunyian keluarga Buendía di kota legendaris Macondo.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 3. Music Column */}
                <div className="border-2 border-black bg-white rounded-md p-5 shadow-[4px_4px_0px_#000] dark:border-cream dark:bg-dark-surface dark:shadow-[4px_4px_0px_#FFF] transition-all flex flex-col">
                  <div className="flex items-center gap-2 border-b-2 border-black dark:border-cream pb-3 mb-4">
                    <div className="p-1.5 border border-black bg-purple text-white rounded dark:border-cream">
                      <Music className="h-4 w-4" />
                    </div>
                    <h4 className="font-black text-base text-black dark:text-cream uppercase tracking-wide">
                      Musik Favorit
                    </h4>
                  </div>
                  <ul className="flex flex-col gap-4 flex-grow font-semibold text-sm text-black/85 dark:text-cream/85">
                    <li className="border-b border-dashed border-black/20 dark:border-cream/20 pb-2">
                      <strong className="text-black dark:text-cream text-base block font-bold">Classical Piano</strong>
                      <span className="text-xs text-black/60 dark:text-cream/60 leading-snug block mt-1 font-mono italic">
                        — Chopin, Debussy, Beethoven
                      </span>
                      <span className="text-xs text-black/60 dark:text-cream/60 leading-snug block mt-1">
                        Komposisi solo piano klasik yang menenangkan jiwa, sangat ideal untuk fokus menulis ulasan sejarah panjang.
                      </span>
                    </li>
                    <li className="border-b border-dashed border-black/20 dark:border-cream/20 pb-2">
                      <strong className="text-black dark:text-cream text-base block font-bold">Indie Folk Indonesia</strong>
                      <span className="text-xs text-black/60 dark:text-cream/60 leading-snug block mt-1 font-mono italic">
                        — Banda Neira, Float, Fourtwnty
                      </span>
                      <span className="text-xs text-black/60 dark:text-cream/60 leading-snug block mt-1">
                        Musik akustik puitis dengan melodi syahdu yang membawa kedamaian dan perenungan kontemplatif.
                      </span>
                    </li>
                    <li>
                      <strong className="text-black dark:text-cream text-base block font-bold">Lo-Fi / Chillhop Beats</strong>
                      <span className="text-xs text-black/60 dark:text-cream/60 leading-snug block mt-1">
                        Ketukan lo-fi instrumental modern yang santai, sangat cocok diputar di sore hari saat menyeruput kopi sambil membaca.
                      </span>
                    </li>
                  </ul>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
