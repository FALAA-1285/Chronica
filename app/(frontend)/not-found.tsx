import React from "react";
import Link from "next/link";
import { BookOpen, Home, ArrowLeft } from "lucide-react";
import { Button } from "./_components/ui/Button";

export const metadata = {
  title: "404 - Chronicle Lost",
  description: "This page was lost in the archives of history. Head back to the safe zone.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] bg-cream dark:bg-dark-bg transition-colors py-20 px-4 select-none relative overflow-hidden bg-grid-pattern">
      
      {/* Playful Stickers */}
      <div className="absolute top-1/4 left-10 lg:left-24 hidden sm:flex border-2 border-black bg-coral text-white font-mono text-[10px] font-black uppercase tracking-wider px-3 py-1 shadow-[2px_2px_0px_#000] rotate-[-8deg] dark:border-cream dark:shadow-[2px_2px_0px_#FFF]">
        <span>ERROR 404</span>
      </div>

      <div className="absolute bottom-1/4 right-10 lg:right-24 hidden sm:flex border-2 border-black bg-yellow text-black font-mono text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 shadow-[2px_2px_0px_#000] rotate-[10deg] dark:border-cream dark:shadow-[2px_2px_0px_#FFF]">
        <span>LOST SOUL 🛸</span>
      </div>

      <div className="flex flex-col items-center text-center max-w-lg relative z-10">
        
        {/* BookOpen sticker */}
        <div className="flex h-14 w-14 items-center justify-center border-3 border-black bg-coral text-white shadow-[3px_3px_0px_#0A0A0A] rounded-full mx-auto mb-8 dark:border-cream">
          <BookOpen className="h-6 w-6" />
        </div>

        {/* 404 Large Typo */}
        <h1 className="text-display text-7xl sm:text-9xl text-black dark:text-cream tracking-tighter uppercase leading-none">
          404
        </h1>

        {/* Headline */}
        <h2 className="text-display text-2xl sm:text-4xl text-black dark:text-cream tracking-tight uppercase mt-4">
          PAGE LOST IN THE ARCHIVES
        </h2>

        {/* Subhead */}
        <p className="font-semibold text-black/70 dark:text-cream/70 text-sm sm:text-base mt-4 leading-relaxed max-w-sm">
          The chronicle or literary critique you are trying to read has migrated or ceased to exist. Head back to the secure homepage.
        </p>

        {/* Back home buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-8 w-full sm:w-auto">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="electric" size="md" className="w-full flex items-center justify-center gap-2">
              <Home className="h-4.5 w-4.5" />
              <span>Back Home</span>
            </Button>
          </Link>
          
          <Link href="/blog" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" className="w-full flex items-center justify-center gap-2">
              <ArrowLeft className="h-4.5 w-4.5" />
              <span>Browse Blog</span>
            </Button>
          </Link>
        </div>

      </div>

    </div>
  );
}
