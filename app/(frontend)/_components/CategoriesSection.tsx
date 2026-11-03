import React from "react";
import { FolderHeart } from "lucide-react";
import type { Category } from "@/lib/types";
import { CategoryCard } from "./CategoryCard";

export const CategoriesSection = ({ categories }: { categories: Category[] }) => {
  if (categories.length === 0) return null;

  return (
    <section className="py-16 bg-cream-dark border-b-3 border-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-yellow text-black shadow-[2px_2px_0px_#0A0A0A]">
            <FolderHeart className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-display text-2xl sm:text-4xl uppercase text-black">Jelajahi Kategori</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};
