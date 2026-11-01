import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getDailyQuote } from "@/lib/constants";
import { getCategoriesWithCount, getPopularPosts, getPostSummaries, getSiteAuthor } from "@/lib/posts";
import { LatestArticles, LatestArticlesSkeleton } from "../_components/LatestArticles";
import { Sidebar } from "../_components/Sidebar";

export const metadata: Metadata = {
  title: "The Archives",
  description: "Browse all essays, historical chronicles, geopolitical analyses, and classical literature critiques.",
};

const TICKER = "• EXPLORE HISTORY • ANALYZE POLITICS • CLASSIC LITERATURE • PHILOSOPHY • ANCIENT WISDOM";

export default async function BlogPage() {
  const [posts, categories, popular, author] = await Promise.all([
    getPostSummaries(),
    getCategoriesWithCount(),
    getPopularPosts(),
    getSiteAuthor(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <section className="border-b-3 border-black bg-yellow py-12 lg:py-16 text-black overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-8 border-b-2 border-black bg-black text-white flex items-center overflow-hidden" aria-hidden="true">
          <div className="marquee-track font-mono text-xs font-bold uppercase tracking-wider py-1 flex gap-20">
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i}>{TICKER}</span>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
          <h1 className="text-display text-4xl sm:text-6xl lg:text-7xl tracking-tight uppercase">The Archives</h1>
          <p className="font-extrabold text-sm sm:text-base max-w-xl mt-3 text-black/75">
            Curated historical chronicles, political analyses, critiques of classical literary masterpieces, and deep philosophical reflections.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white border-b-3 border-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <Suspense fallback={<LatestArticlesSkeleton />}>
                <LatestArticles posts={posts} categories={categories} />
              </Suspense>
            </div>
            <div className="lg:col-span-4 lg:border-l-3 lg:border-dashed lg:border-black/25 lg:pl-10">
              <Sidebar popular={popular} author={author} quote={getDailyQuote()} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
