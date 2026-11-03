import React from "react";
import Link from "next/link";
import type { Category } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcon";

export const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <Link
      href={`/blog?category=${category.slug}`}
      className="group block border-2 border-black rounded-md p-6 shadow-[4px_4px_0px_#0A0A0A] transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px]"
      style={{ backgroundColor: category.bgColor, color: category.color }}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center border-2 border-black bg-white text-black shadow-[2px_2px_0px_#0A0A0A] rounded-sm group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[4px_4px_0px_#0A0A0A] transition-all">
          <CategoryIcon name={category.icon} className="h-8 w-8" />
        </div>
        <span className="font-mono text-xs font-black uppercase bg-black text-white px-2 py-0.5 border border-black rounded-sm">
          {category.count} Artikel
        </span>
      </div>

      <div className="mt-8">
        <h3 className="text-display text-xl font-extrabold uppercase tracking-tight group-hover:underline decoration-3 underline-offset-4">
          {category.name}
        </h3>
        {category.description && <p className="font-bold opacity-80 text-sm mt-2 line-clamp-2">{category.description}</p>}
      </div>
    </Link>
  );
};
