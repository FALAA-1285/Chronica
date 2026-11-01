"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Quote } from "lucide-react";
import { Github, Twitter, Linkedin } from "./ui/Icons";
import { posts, quotes } from "../_lib/posts";

export const Sidebar = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [livePosts, setLivePosts] = useState<any[]>(posts);

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * quotes.length));
    
    async function loadLivePosts() {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) setLivePosts(data);
        }
      } catch (err) {
        console.error("Failed to load live posts in Sidebar:", err);
      }
    }
    loadLivePosts();
  }, []);

  const popular = [...livePosts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  return (
    <aside className="flex flex-col gap-10">
      {/* Popular Posts Widget */}
      <div className="border-2 border-black bg-white rounded-md p-5 shadow-[4px_4px_0px_#0A0A0A] dark:border-cream dark:bg-dark-surface dark:shadow-[4px_4px_0px_#FFFBF0] transition-colors">
        <h3 className="text-display text-lg uppercase text-black border-b-2 border-black pb-2 mb-4 font-black dark:text-cream dark:border-cream select-none">
          Popular Reads
        </h3>
        <div className="flex flex-col gap-4">
          {popular.map((post, idx) => (
            <div key={post.id} className="flex gap-3 group items-start select-none">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center border border-black bg-neon-green font-mono text-xs font-black text-black dark:border-cream">
                0{idx + 1}
              </div>
              <div className="min-w-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-bold text-sm text-black dark:text-cream hover:text-electric-blue transition-colors line-clamp-2"
                >
                  {post.title}
                </Link>
                <span className="font-mono text-[10px] text-black/50 dark:text-cream/50 mt-1 block">
                  {post.views} VIEWS • {post.likes} LIKES
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quote Widget */}
      <div className="border-2 border-black bg-white rounded-md p-5 shadow-[4px_4px_0px_#0A0A0A] dark:border-cream dark:bg-dark-surface dark:shadow-[4px_4px_0px_#FFFBF0] transition-colors">
        <Quote className="h-8 w-8 text-electric-blue mb-3" />
        <p className="font-bold text-black/85 dark:text-cream/85 text-base italic leading-relaxed">
          &ldquo;{quotes[quoteIndex].text}&rdquo;
        </p>
        <p className="font-mono text-xs text-black/60 dark:text-cream/60 mt-3 font-bold text-right">
          — {quotes[quoteIndex].author}
        </p>
      </div>

      {/* Social Links Panel */}
      <div className="border-2 border-black bg-white rounded-md p-5 shadow-[4px_4px_0px_#0A0A0A] dark:border-cream dark:bg-dark-surface dark:shadow-[4px_4px_0px_#FFFBF0] transition-colors select-none">
        <h3 className="text-display text-lg uppercase text-black border-b-2 border-black pb-2 mb-4 font-black dark:text-cream dark:border-cream">
          Stay Connected
        </h3>
        <div className="flex flex-col gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3 border-2 border-black bg-neon-green hover:-translate-y-0.5 text-black font-extrabold text-sm shadow-[2px_2px_0px_#0A0A0A] dark:border-cream dark:shadow-[2px_2px_0px_#FFFBF0] transition-all"
          >
            <span className="flex items-center gap-2">
              <Github className="h-4.5 w-4.5" />
              <span>GITHUB</span>
            </span>
            <span className="font-mono text-xs text-black/60 font-bold">12.5k followers</span>
          </a>
          
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3 border-2 border-black bg-electric-blue hover:-translate-y-0.5 text-white font-extrabold text-sm shadow-[2px_2px_0px_#0A0A0A] dark:border-cream dark:shadow-[2px_2px_0px_#FFFBF0] transition-all"
          >
            <span className="flex items-center gap-2">
              <Twitter className="h-4.5 w-4.5" />
              <span>TWITTER</span>
            </span>
            <span className="font-mono text-xs text-white/80 font-bold">8.4k followers</span>
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3 border-2 border-black bg-coral hover:-translate-y-0.5 text-white font-extrabold text-sm shadow-[2px_2px_0px_#0A0A0A] dark:border-cream dark:shadow-[2px_2px_0px_#FFFBF0] transition-all"
          >
            <span className="flex items-center gap-2">
              <Linkedin className="h-4.5 w-4.5" />
              <span>LINKEDIN</span>
            </span>
            <span className="font-mono text-xs text-white/80 font-bold">15.9k connection</span>
          </a>
        </div>
      </div>
    </aside>
  );
};
