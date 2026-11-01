"use client";

import React from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { Category } from "../_lib/types";

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  // Safe dynamic lucide icon rendering
  const getIcon = (iconName: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="h-8 w-8 text-black" />;
    }
    return <Icons.Folder className="h-8 w-8 text-black" />;
  };

  return (
    <Link
      href={`/blog?category=${category.slug}`}
      className="group block border-2 border-black rounded-md p-6 transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px]"
      style={{
        backgroundColor: category.bgColor,
        boxShadow: "4px 4px 0px 0px #0A0A0A",
      }}
    >
      <div className="flex items-start justify-between">
        {/* Icon Wrapper */}
        <div className="flex h-14 w-14 items-center justify-center border-2 border-black bg-white shadow-[2px_2px_0px_#0A0A0A] rounded-sm group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[4px_4px_0px_#0A0A0A] transition-all">
          {getIcon(category.icon)}
        </div>
        
        {/* Post Count Badge */}
        <span className="font-mono text-xs font-black uppercase bg-black text-white px-2 py-0.5 border border-black rounded-sm shadow-[1px_1px_0px_rgba(255,255,255,0.8)]">
          {category.count} Posts
        </span>
      </div>

      <div className="mt-8 select-none">
        <h3 className="text-display text-xl text-black font-extrabold uppercase tracking-tight group-hover:underline decoration-3 decoration-black underline-offset-4">
          {category.name}
        </h3>
        <p className="font-bold text-black/75 text-sm mt-2 line-clamp-2">
          {category.description}
        </p>
      </div>
    </Link>
  );
};
