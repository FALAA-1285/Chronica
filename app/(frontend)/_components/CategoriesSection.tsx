"use client";

import React from "react";
import { FolderHeart } from "lucide-react";
import { categories } from "../_lib/posts";
import { CategoryCard } from "./CategoryCard";

export const CategoriesSection = () => {
  return (
    <section className="py-16 bg-cream-dark dark:bg-dark-surface-2 border-b-3 border-black dark:border-cream transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-10 select-none">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-yellow text-black shadow-[2px_2px_0px_#0A0A0A] dark:border-cream dark:shadow-[2px_2px_0px_#FFFBF0] dark:text-black">
            <FolderHeart className="h-5 w-5" />
          </div>
          <h2 className="text-display text-2xl sm:text-4xl uppercase text-black dark:text-cream">
            Explore Categories
          </h2>
        </div>

        {/* Categories Cards Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};
