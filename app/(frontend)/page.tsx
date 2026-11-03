import React from "react";
import { getDailyQuote } from "@/lib/constants";
import { getCategoriesWithCount, getPopularPosts, getPostSummaries, getSiteAuthor, listPosts } from "@/lib/posts";
import { HeroSection } from "./_components/HeroSection";
import { FeaturedPosts } from "./_components/FeaturedPosts";
import { CategoriesSection } from "./_components/CategoriesSection";
import { LatestArticles } from "./_components/LatestArticles";
import { Sidebar } from "./_components/Sidebar";

type Props = { searchParams: Promise<{ category?: string | string[] }> };

export default async function Home({ searchParams }: Props) {
  const { category: rawCategory } = await searchParams;
  const category = typeof rawCategory === "string" ? rawCategory : "";
  const [featured, firstPage, categories, popular, author] = await Promise.all([
    getPostSummaries({ featured: true, limit: 3 }),
    listPosts({ category }),
    getCategoriesWithCount(),
    getPopularPosts(),
    getSiteAuthor(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedPosts posts={featured} />
      <CategoriesSection categories={categories} />

      <section className="py-16 bg-white border-b-3 border-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <LatestArticles key={category} initialPage={firstPage} categories={categories} category={category} />
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
