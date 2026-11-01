import React, { Suspense } from "react";
import { HeroSection } from "./_components/HeroSection";
import { FeaturedPosts } from "./_components/FeaturedPosts";
import { CategoriesSection } from "./_components/CategoriesSection";
import { LatestArticles, LatestArticlesSkeleton } from "./_components/LatestArticles";
import { Sidebar } from "./_components/Sidebar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Featured Posts Editorial */}
      <FeaturedPosts />

      {/* 3. Categories Cards */}
      <CategoriesSection />

      {/* 4. Bottom Grid (Latest Articles + Sidebar Widgets) */}
      <section className="py-16 bg-white dark:bg-dark-bg border-b-3 border-black dark:border-cream transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left side latest list (8 columns) */}
            <div className="lg:col-span-8">
              <Suspense fallback={<LatestArticlesSkeleton />}>
                <LatestArticles />
              </Suspense>
            </div>

            {/* Right side widgets (4 columns) */}
            <div className="lg:col-span-4 lg:border-l-3 lg:border-dashed lg:border-black/25 lg:pl-10 dark:lg:border-cream/25">
              <Sidebar />
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
