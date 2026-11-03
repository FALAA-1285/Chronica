import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  /** Local image under /public. Decorative: the heading carries the meaning. */
  image: string;
  /** CSS object-position for the photo, e.g. "center 30%". */
  imagePosition?: string;
  badge: string;
  /** Plain part of the title, rendered before the highlighted word. */
  title: React.ReactNode;
  /** Word(s) shown in the tilted highlight box. */
  highlight: string;
  highlightClass?: string;
  description: string;
  ticker: string;
}

/** Full-bleed photo hero with a dark overlay, marquee ticker and neo-brutalist title. */
export function PageHero({
  image,
  imagePosition = "center",
  badge,
  title,
  highlight,
  highlightClass = "bg-electric-blue text-white",
  description,
  ticker,
}: PageHeroProps) {
  return (
    <section className="border-b-3 border-black py-16 lg:py-24 text-white overflow-hidden relative min-h-[380px] sm:min-h-[460px] flex items-center">
      <div className="absolute inset-0 z-0">
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" style={{ objectPosition: imagePosition }} />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/60" />
        {/* Film-grain dots for a zine / print texture */}
        <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-8 border-b-2 border-black bg-yellow text-black flex items-center overflow-hidden z-10" aria-hidden="true">
        <div className="marquee-track font-mono text-xs font-black uppercase tracking-wider py-1 flex gap-20 whitespace-nowrap">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className="shrink-0">
              {ticker}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 relative z-10 w-full">
        <div className="inline-block bg-yellow text-black px-3.5 py-1 border-2 border-black font-mono text-xs font-black uppercase tracking-wider mb-4 shadow-[3px_3px_0px_#000]">
          {badge}
        </div>
        <h1 className="text-display text-4xl sm:text-6xl lg:text-7xl tracking-tight uppercase text-white drop-shadow-[4px_4px_0px_#000]">
          {title}{" "}
          <span className={cn("inline-block px-3 sm:px-4 py-0.5 border-2 sm:border-3 border-black shadow-[4px_4px_0px_#000] rotate-[-1.5deg]", highlightClass)}>
            {highlight}
          </span>
        </h1>
        <p className="font-bold text-sm sm:text-base lg:text-lg max-w-2xl mt-5 text-cream leading-relaxed drop-shadow-[2px_2px_0px_#000]">{description}</p>
      </div>
    </section>
  );
}
