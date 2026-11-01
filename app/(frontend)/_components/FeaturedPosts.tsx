"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { posts } from "../_lib/posts";
import { ArticleCard } from "./ArticleCard";

export const FeaturedPosts = () => {
  const [featured, setFeatured] = useState<any[]>(() => posts.filter((p) => p.featured).slice(0, 3));

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const data = await res.json();
          const feat = data.filter((p: any) => p.featured).slice(0, 3);
          if (feat.length > 0) setFeatured(feat);
        }
      } catch (err) {
        console.error("Failed to load featured posts:", err);
      }
    }
    loadFeatured();
  }, []);

  if (featured.length === 0) return null;

  return (
    <section className="py-16 bg-white dark:bg-dark-bg border-b-3 border-black dark:border-cream transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-10 select-none">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-coral text-white shadow-[2px_2px_0px_#0A0A0A] dark:border-cream dark:shadow-[2px_2px_0px_#FFFBF0]">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="text-display text-2xl sm:text-4xl uppercase text-black dark:text-cream">
            Featured Stories
          </h2>
        </div>

        {/* Dynamic Grid Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Large Featured Post */}
          <div className="lg:col-span-8">
            <ArticleCard post={featured[0]} featured={true} />
          </div>

          {/* Sibling Featured Posts stacked */}
          <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
            {featured.slice(1, 3).map((post) => (
              <div key={post.id} className="flex-1">
                <ArticleCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
