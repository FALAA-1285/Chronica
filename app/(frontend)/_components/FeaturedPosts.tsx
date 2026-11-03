import React from "react";
import { Sparkles } from "lucide-react";
import type { PostSummary } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";

export const FeaturedPosts = ({ posts }: { posts: PostSummary[] }) => {
  if (posts.length === 0) return null;
  const [main, ...rest] = posts;

  return (
    <section className="py-16 bg-white border-b-3 border-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-coral text-white shadow-[2px_2px_0px_#0A0A0A]">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-display text-2xl sm:text-4xl uppercase text-black">Tulisan Pilihan</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className={rest.length > 0 ? "lg:col-span-8" : "lg:col-span-12"}>
            <ArticleCard post={main} featured />
          </div>
          {rest.length > 0 && (
            <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
              {rest.map((post) => (
                <div key={post.id} className="flex-1">
                  <ArticleCard post={post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
