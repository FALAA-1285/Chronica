"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDown, Inbox, Newspaper, Search, X } from "lucide-react";
import type { Category, PostSummary } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Skeleton } from "./ui/Skeleton";

const PAGE_SIZE = 6;

interface LatestArticlesProps {
  posts: PostSummary[];
  categories: Category[];
}

export const LatestArticles = ({ posts, categories }: LatestArticlesProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const selectedCategory = searchParams.get("category") || "all";

  const handleCategorySelect = (slug: string) => {
    setVisibleCount(PAGE_SIZE);
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") params.delete("category");
    else params.set("category", slug);
    const query = params.toString();
    router.push(query ? `?${query}` : "?", { scroll: false });
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some((tag) => tag.name.toLowerCase().includes(q));
    const matchesCategory = selectedCategory === "all" || post.category.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  const pill = (active: boolean) =>
    `font-mono text-[10px] font-black uppercase px-3 py-1.5 border-2 border-black rounded shadow-[2px_2px_0px_#000] transition-all ${
      active ? "bg-electric-blue text-white" : "bg-white text-black hover:bg-yellow"
    }`;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-neon-green text-black shadow-[2px_2px_0px_#0A0A0A]">
            <Newspaper className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-display text-2xl sm:text-3xl uppercase text-black">Latest Articles</h2>
        </div>

        <div className="relative w-full md:max-w-xs">
          <label htmlFor="article-search" className="sr-only">
            Search articles
          </label>
          <Input
            id="article-search"
            type="search"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="pl-11 pr-10 font-bold text-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/50 pointer-events-none" aria-hidden="true" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center border border-black bg-coral text-white rounded shadow-[1px_1px_0px_#000]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-10" role="group" aria-label="Filter by category">
          <button type="button" onClick={() => handleCategorySelect("all")} className={pill(selectedCategory === "all")} aria-pressed={selectedCategory === "all"}>
            All
          </button>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={pill(selectedCategory === cat.slug)}
              aria-pressed={selectedCategory === cat.slug}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {visiblePosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visiblePosts.map((post) => (
            <div key={post.id} className="h-full">
              <ArticleCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 px-6 text-center border-3 border-dashed border-black rounded-lg max-w-md mx-auto mt-10">
          <div className="flex h-16 w-16 items-center justify-center border-2 border-black bg-coral text-white shadow-[3px_3px_0px_#0A0A0A] rounded-full mx-auto mb-6">
            <Inbox className="h-8 w-8" aria-hidden="true" />
          </div>
          <h3 className="text-display text-xl uppercase text-black">No Articles Found</h3>
          <p className="font-bold text-black/60 text-xs max-w-sm mx-auto mt-2 leading-relaxed">
            {posts.length === 0
              ? "Nothing has been published yet. Check back soon."
              : q
                ? <>We couldn&apos;t find any stories matching &ldquo;{searchQuery}&rdquo;.</>
                : "There are no stories in this category yet."}
          </p>
          {posts.length > 0 && (
            <Button
              variant="electric"
              size="sm"
              className="mt-6"
              onClick={() => {
                setSearchQuery("");
                handleCategorySelect("all");
              }}
            >
              Reset Filters
            </Button>
          )}
        </div>
      )}

      {filteredPosts.length > visibleCount && (
        <div className="flex justify-center mt-14">
          <Button variant="primary" size="md" onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)} className="flex items-center gap-2">
            <span>Load More Articles</span>
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  );
};

export const LatestArticlesSkeleton = () => (
  <div className="flex flex-col" aria-hidden="true">
    <div className="flex items-center justify-between gap-6 mb-10">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-10 w-64 hidden md:block" />
    </div>
    <div className="flex gap-2 mb-10">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-8 w-28" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-[350px] border-2 border-black rounded-md" />
      ))}
    </div>
  </div>
);
