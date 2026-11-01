import React from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, Eye, Heart } from "lucide-react";
import type { PostSummary } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { CategoryBadge } from "./CategoryBadge";
import { SafeImage } from "./SafeImage";

interface ArticleCardProps {
  post: PostSummary;
  featured?: boolean;
}

function Stats({ post, className }: { post: PostSummary; className: string }) {
  return (
    <div className={className}>
      <span className="flex items-center gap-1" title="Views">
        <Eye className="h-4 w-4" aria-hidden="true" />
        <span>{post.views}</span>
        <span className="sr-only">views</span>
      </span>
      <span className="flex items-center gap-1" title="Likes">
        <Heart className="h-4 w-4 text-coral" aria-hidden="true" />
        <span>{post.likes}</span>
        <span className="sr-only">likes</span>
      </span>
    </div>
  );
}

function AuthorAvatar({ post, size }: { post: PostSummary; size: string }) {
  return (
    <div className={`relative ${size} border-2 border-black rounded-full overflow-hidden bg-yellow shrink-0`}>
      <SafeImage src={post.author.avatar} alt="" fill sizes="40px" className="object-cover" />
    </div>
  );
}

export const ArticleCard = ({ post, featured = false }: ArticleCardProps) => {
  if (featured) {
    return (
      <article className="border-3 border-black bg-white rounded-md shadow-[6px_6px_0px_#0A0A0A] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[10px_10px_0px_#0A0A0A] transition-all duration-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 relative h-[250px] sm:h-[350px] lg:h-full min-h-[300px] border-b-3 lg:border-b-0 lg:border-r-3 border-black overflow-hidden group">
            <SafeImage
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
            <div className="absolute top-4 left-4 bg-yellow text-black border-2 border-black font-black uppercase text-xs tracking-wider px-3 py-1 shadow-[2px_2px_0px_#000] rotate-[-4deg]">
              Featured Post
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={post.category} />
                <span className="flex items-center gap-1 font-mono text-xs text-black/60">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{post.readingTime} min read</span>
                </span>
              </div>

              <Link href={`/blog/${post.slug}`} className="group">
                <h3 className="text-display text-2xl sm:text-3xl lg:text-4xl text-black group-hover:text-electric-blue transition-colors flex items-start gap-1">
                  <span>{post.title}</span>
                  <ArrowUpRight
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0"
                    aria-hidden="true"
                  />
                </h3>
              </Link>

              <p className="font-semibold text-black/75 text-base line-clamp-3">{post.excerpt}</p>
            </div>

            <div className="flex items-center justify-between border-t-2 border-dashed border-black/20 pt-6 mt-8">
              <div className="flex items-center gap-3">
                <AuthorAvatar post={post} size="h-10 w-10" />
                <div>
                  <p className="font-black text-sm text-black">{post.author.name}</p>
                  <p className="font-mono text-xs text-black/60">{formatDate(post.publishedAt)}</p>
                </div>
              </div>
              <Stats post={post} className="flex items-center gap-3 font-mono text-xs text-black/70" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="border-2 border-black bg-white rounded-md shadow-[4px_4px_0px_#0A0A0A] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0px_#0A0A0A] transition-all duration-200 overflow-hidden flex flex-col h-full">
      <div className="relative h-[200px] border-b-2 border-black overflow-hidden group">
        <SafeImage
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <CategoryBadge category={post.category} />
        </div>
      </div>

      <div className="p-5 flex flex-col justify-between flex-grow">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 font-mono text-[11px] text-black/60">
            <Clock className="h-3 w-3" aria-hidden="true" />
            <span>{post.readingTime} MIN READ</span>
            <span aria-hidden="true">•</span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>

          <Link href={`/blog/${post.slug}`} className="group">
            <h3 className="text-display text-xl text-black group-hover:text-electric-blue transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>

          <p className="font-semibold text-black/75 text-sm line-clamp-3">{post.excerpt}</p>
        </div>

        <div className="flex items-center justify-between border-t border-dashed border-black/20 pt-4 mt-6">
          <div className="flex items-center gap-2">
            <AuthorAvatar post={post} size="h-8 w-8" />
            <span className="font-black text-xs text-black/90">{post.author.name}</span>
          </div>
          <Stats post={post} className="flex items-center gap-2 font-mono text-[10px] text-black/60" />
        </div>
      </div>
    </article>
  );
};
