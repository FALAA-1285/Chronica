import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getDailyQuote } from "@/lib/constants";
import { getCategoriesWithCount, getPopularPosts, getPostSummaries, getSiteAuthor } from "@/lib/posts";
import { LatestArticles, LatestArticlesSkeleton } from "../_components/LatestArticles";
import { Sidebar } from "../_components/Sidebar";
import { PageHero } from "../_components/PageHero";

export const metadata: Metadata = {
  title: "Arsip Blog | Chronica",
  description: "Mengabadikan hidup lewat kata — jelajahi opini, musik, buku, dan movie.",
};

export default async function BlogPage() {
  const [posts, categories, popular, author] = await Promise.all([
    getPostSummaries(),
    getCategoriesWithCount(),
    getPopularPosts(),
    getSiteAuthor(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PageHero
        image="/images/hero-blog.jpg"
        imagePosition="center 35%"
        badge="Arsip & Catatan"
        title={
          <>
            Mengabadikan <br className="hidden sm:inline" />
            hidup lewat
          </>
        }
        highlight="kata."
        description="Kumpulan catatan, esai opini, ulasan buku, apresiasi musik, dan telaah sinema untuk merawat ingatan."
        ticker="• MENGABADIKAN HIDUP LEWAT KATA • OPINI • MUSIK • BUKU • MOVIE • CHRONICA •"
      />

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
