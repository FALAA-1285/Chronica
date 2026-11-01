"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Newspaper, Search, X, Inbox, ArrowDown } from "lucide-react";
import { posts, categories } from "../_lib/posts";
import { ArticleCard } from "./ArticleCard";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export const LatestArticles = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // States
  const [livePosts, setLivePosts] = useState<any[]>(posts);
  const [liveCategories, setLiveCategories] = useState<any[]>(categories);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    async function loadLiveData() {
      try {
        const [postsRes, catsRes] = await Promise.all([
          fetch("/api/posts"),
          fetch("/api/categories")
        ]);
        if (postsRes.ok) {
          const data = await postsRes.json();
          if (data && data.length > 0) setLivePosts(data);
        }
        if (catsRes.ok) {
          const data = await catsRes.json();
          if (data && data.length > 0) setLiveCategories(data);
        }
      } catch (err) {
        console.error("Failed to load live data in LatestArticles:", err);
      }
    }
    loadLiveData();
  }, []);

  // Derive category directly from URL search params
  const selectedCategory = searchParams.get("category") || "all";

  // Handle category change
  const handleCategorySelect = (slug: string) => {
    setVisibleCount(6);
    
    const params = new URLSearchParams(window.location.search);
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    
    // Update path smoothly
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Filter posts
  const filteredPosts = livePosts.filter((post) => {
    // 1. Search Query filter
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Category filter
    const matchesCategory =
      selectedCategory === "all" || post.category.slug === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  return (
    <div className="flex flex-col">
      {/* Header Title with Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 select-none">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-neon-green text-black shadow-[2px_2px_0px_#0A0A0A] dark:border-cream dark:shadow-[2px_2px_0px_#FFFBF0]">
            <Newspaper className="h-5 w-5" />
          </div>
          <h2 className="text-display text-2xl sm:text-3xl uppercase text-black dark:text-cream">
            Latest Articles
          </h2>
        </div>

        {/* Search Input Widget */}
        <div className="relative w-full md:max-w-xs">
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-10 border-black dark:border-cream font-bold text-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/50 dark:text-cream/50 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center border border-black bg-coral text-white rounded shadow-[1px_1px_0px_#000] dark:border-cream dark:shadow-[1px_1px_0px_#FFF]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories / Tags filter pills */}
      <div className="flex flex-wrap items-center gap-2 mb-10 select-none">
        <button
          onClick={() => handleCategorySelect("all")}
          className={`font-mono text-[10px] font-black uppercase px-3 py-1.5 border-2 border-black rounded shadow-[2px_2px_0px_#000] transition-all dark:border-cream dark:shadow-[2px_2px_0px_#FFF] ${
            selectedCategory === "all"
              ? "bg-electric-blue text-white"
              : "bg-white text-black hover:bg-yellow dark:bg-dark-surface dark:text-cream dark:hover:bg-yellow dark:hover:text-black"
          }`}
        >
          All
        </button>
        
        {liveCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.slug)}
            className={`font-mono text-[10px] font-black uppercase px-3 py-1.5 border-2 border-black rounded shadow-[2px_2px_0px_#000] transition-all dark:border-cream dark:shadow-[2px_2px_0px_#FFF] ${
              selectedCategory === cat.slug
                ? "bg-electric-blue text-white"
                : "bg-white text-black hover:bg-yellow dark:bg-dark-surface dark:text-cream dark:hover:bg-yellow dark:hover:text-black"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Articles List */}
      {visiblePosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visiblePosts.map((post) => (
            <div key={post.id} className="h-full">
              <ArticleCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State UI */
        <div className="py-16 text-center border-3 border-dashed border-black rounded-lg dark:border-cream/40 max-w-md mx-auto select-none mt-10">
          <div className="flex h-16 w-16 items-center justify-center border-2 border-black bg-coral text-white shadow-[3px_3px_0px_#0A0A0A] rounded-full mx-auto mb-6 dark:border-cream">
            <Inbox className="h-8 w-8" />
          </div>
          <h3 className="text-display text-xl uppercase text-black dark:text-cream">No Articles Found</h3>
          <p className="font-bold text-black/60 dark:text-cream/60 text-xs max-w-sm mx-auto mt-2 leading-relaxed">
            We couldn&apos;t find any stories matching &ldquo;{searchQuery}&rdquo;. Try clearing filters.
          </p>
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
        </div>
      )}

      {/* Load More Pagination */}
      {filteredPosts.length > visibleCount && (
        <div className="flex justify-center mt-14 select-none">
          <Button
            variant="primary"
            size="md"
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="flex items-center gap-2"
          >
            <span>Load More Articles</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </Button>
        </div>
      )}
    </div>
  );
};

// High-fidelity Brutalist loading skeleton fallback
import { Skeleton } from "./ui/Skeleton";

export const LatestArticlesSkeleton = () => {
  return (
    <div className="flex flex-col select-none">
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
        <Skeleton className="h-[350px] border-2 border-black rounded-md" />
        <Skeleton className="h-[350px] border-2 border-black rounded-md" />
        <Skeleton className="h-[350px] border-2 border-black rounded-md" />
        <Skeleton className="h-[350px] border-2 border-black rounded-md" />
      </div>
    </div>
  );
};
