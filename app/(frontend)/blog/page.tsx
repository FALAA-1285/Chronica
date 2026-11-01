import React, { Suspense } from "react";
import { LatestArticles, LatestArticlesSkeleton } from "../_components/LatestArticles";
import { Sidebar } from "../_components/Sidebar";

export const metadata = {
  title: "The Archives",
  description: "Browse all essays, historical chronicles, geopolitical analyses, and classical literature critiques.",
};

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-dark-bg transition-colors">
      
      {/* Editorial Page Header banner */}
      <section className="border-b-3 border-black dark:border-cream bg-yellow py-12 lg:py-16 text-black select-none overflow-hidden relative">
        {/* Animated Marquee Ticker */}
        <div className="absolute top-0 left-0 right-0 h-8 border-b-2 border-black bg-black text-white flex items-center overflow-hidden">
          <div className="marquee-track font-mono text-xs font-bold uppercase tracking-wider py-1 flex gap-20">
            <span>• EXPLORE HISTORY • ANALYZE POLITICS • CLASSIC LITERATURE • PHILOSOPHY • ANCIENT WISDOM</span>
            <span>• EXPLORE HISTORY • ANALYZE POLITICS • CLASSIC LITERATURE • PHILOSOPHY • ANCIENT WISDOM</span>
            <span>• EXPLORE HISTORY • ANALYZE POLITICS • CLASSIC LITERATURE • PHILOSOPHY • ANCIENT WISDOM</span>
            <span>• EXPLORE HISTORY • ANALYZE POLITICS • CLASSIC LITERATURE • PHILOSOPHY • ANCIENT WISDOM</span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
          <h1 className="text-display text-4xl sm:text-6xl lg:text-7xl tracking-tight uppercase">
            THE ARCHIVES
          </h1>
          <p className="font-extrabold text-sm sm:text-base max-w-xl mt-3 text-black/75">
            Curated historical chronicles, political analyses, critiques of classical literary masterpieces, and deep philosophical reflections.
          </p>
        </div>
      </section>

      {/* Main Grid Articles + Sidebar */}
      <section className="py-16 bg-white dark:bg-dark-bg border-b-3 border-black dark:border-cream transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left side list */}
            <div className="lg:col-span-8">
              <Suspense fallback={<LatestArticlesSkeleton />}>
                <LatestArticles />
              </Suspense>
            </div>

            {/* Right side widgets */}
            <div className="lg:col-span-4 lg:border-l-3 lg:border-dashed lg:border-black/25 lg:pl-10 dark:lg:border-cream/25">
              <Sidebar />
            </div>
            
          </div>
        </div>
      </section>
      
    </div>
  );
}
