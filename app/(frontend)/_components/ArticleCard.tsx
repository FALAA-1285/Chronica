"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock, Eye, Heart } from "lucide-react";
import { Post } from "../_lib/types";
import { formatDate } from "../_lib/posts";
import { Badge } from "./ui/Badge";

interface ArticleCardProps {
  post: Post;
  featured?: boolean;
}

export const ArticleCard = ({ post, featured = false }: ArticleCardProps) => {
  const badgeVariants: Record<string, "primary" | "secondary" | "electric" | "neon" | "coral" | "yellow" | "purple" | "orange"> = {
    programming: "neon",
    ai: "electric",
    "web-design": "yellow",
    productivity: "coral",
    college: "orange",
    technology: "purple",
  };

  const currentVariant = badgeVariants[post.category.slug] || "primary";

  if (featured) {
    return (
      <article className="border-3 border-black bg-white rounded-md shadow-[6px_6px_0px_#0A0A0A] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[10px_10px_0px_#0A0A0A] transition-all duration-200 dark:border-cream dark:bg-dark-surface dark:shadow-[6px_6px_0px_#FFFBF0] dark:hover:shadow-[10px_10px_0px_#FFFBF0] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Thumbnail */}
          <div className="lg:col-span-7 relative h-[250px] sm:h-[350px] lg:h-full min-h-[300px] border-b-3 lg:border-b-0 lg:border-r-3 border-black dark:border-cream overflow-hidden group">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
            {/* Featured Sticker */}
            <div className="absolute top-4 left-4 bg-yellow text-black border-2 border-black font-black uppercase text-xs tracking-wider px-3 py-1 shadow-[2px_2px_0px_#000] rotate-[-4deg]">
              Featured Post 🔥
            </div>
          </div>

          {/* Info Details */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={currentVariant}>{post.category.name}</Badge>
                <span className="flex items-center gap-1 font-mono text-xs text-black/60 dark:text-cream/60">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{post.readingTime} min read</span>
                </span>
              </div>

              <Link href={`/blog/${post.slug}`} className="group">
                <h3 className="text-display text-2xl sm:text-3xl lg:text-4xl text-black dark:text-cream group-hover:text-electric-blue transition-colors flex items-start gap-1">
                  <span>{post.title}</span>
                  <ArrowUpRight className="h-6 w-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0" />
                </h3>
              </Link>

              <p className="font-semibold text-black/75 dark:text-cream/75 text-base line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            {/* Author and Date Meta */}
            <div className="flex items-center justify-between border-t-2 border-dashed border-black/20 dark:border-cream/20 pt-6 mt-8">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 border-2 border-black dark:border-cream rounded-full overflow-hidden bg-yellow">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-black text-sm text-black dark:text-cream">{post.author.name}</p>
                  <p className="font-mono text-xs text-black/60 dark:text-cream/60">{formatDate(post.publishedAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs text-black/70 dark:text-cream/70">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-coral fill-coral/10" />
                  <span>{post.likes}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard post card style
  return (
    <article className="border-2 border-black bg-white rounded-md shadow-[4px_4px_0px_#0A0A0A] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0px_#0A0A0A] transition-all duration-200 dark:border-cream dark:bg-dark-surface dark:shadow-[4px_4px_0px_#FFFBF0] dark:hover:shadow-[8px_8px_0px_#FFFBF0] overflow-hidden flex flex-col h-full">
      {/* Cover Image */}
      <div className="relative h-[200px] border-b-2 border-black dark:border-cream overflow-hidden group">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Category Label Overlay */}
        <div className="absolute top-3 left-3">
          <Badge variant={currentVariant}>{post.category.name}</Badge>
        </div>
      </div>

      {/* Info Details */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 font-mono text-[11px] text-black/60 dark:text-cream/60">
            <Clock className="h-3 w-3" />
            <span>{post.readingTime} MIN READ</span>
            <span>•</span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>

          <Link href={`/blog/${post.slug}`} className="group">
            <h3 className="text-display text-xl text-black dark:text-cream group-hover:text-electric-blue transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>

          <p className="font-semibold text-black/75 dark:text-cream/75 text-sm line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between border-t border-dashed border-black/20 dark:border-cream/20 pt-4 mt-6">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 border border-black dark:border-cream rounded-full overflow-hidden bg-yellow">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="font-black text-xs text-black/90 dark:text-cream/90">{post.author.name}</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] text-black/60 dark:text-cream/60">
            <span className="flex items-center gap-0.5">
              <Eye className="h-3.5 w-3.5" />
              <span>{post.views}</span>
            </span>
            <span className="flex items-center gap-0.5">
              <Heart className="h-3.5 w-3.5" />
              <span>{post.likes}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
