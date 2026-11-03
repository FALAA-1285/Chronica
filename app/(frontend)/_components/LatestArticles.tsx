"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, Inbox, Newspaper, Search, X } from "lucide-react";
import { POSTS_PAGE_SIZE as PAGE_SIZE } from "@/lib/constants";
import type { Category, PostSummary } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

interface PostPage {
  posts: PostSummary[];
  hasMore: boolean;
}

interface LatestArticlesProps {
  /** First page, rendered on the server for the active category. */
  initialPage: PostPage;
  categories: Category[];
  /** Active category slug ("" = all). Changing it re-renders the page on the server. */
  category: string;
}

async function fetchPosts(params: { q: string; category: string; offset: number }, signal?: AbortSignal): Promise<PostPage> {
  const query = new URLSearchParams({ q: params.q, category: params.category, offset: String(params.offset), limit: String(PAGE_SIZE) });
  const res = await fetch(`/api/posts?${query}`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * Article grid with category filter, search and "load more". Only one page of
 * posts is ever sent at a time; filtering happens in the database.
 */
export const LatestArticles = ({ initialPage, categories, category }: LatestArticlesProps) => {
  const router = useRouter();
  const [navigating, startNavigation] = useTransition();
  const [query, setQuery] = useState("");
  const [browse, setBrowse] = useState(initialPage);
  const [search, setSearch] = useState<PostPage | null>(null);
  const [status, setStatus] = useState<"idle" | "searching" | "loadingMore" | "error">("idle");

  const q = query.trim();
  const page = q ? search : browse;
  const totalPublished = categories.reduce((sum, c) => sum + c.count, 0);

  // Debounced database search within the active category.
  useEffect(() => {
    if (!q) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setStatus("searching");
      try {
        setSearch(await fetchPosts({ q, category, offset: 0 }, controller.signal));
        setStatus("idle");
      } catch {
        if (!controller.signal.aborted) setStatus("error");
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q, category]);

  const loadMore = async () => {
    if (!page || status === "loadingMore") return;
    setStatus("loadingMore");
    try {
      const next = await fetchPosts({ q, category, offset: page.posts.length });
      const merged = { posts: [...page.posts, ...next.posts], hasMore: next.hasMore };
      if (q) setSearch(merged);
      else setBrowse(merged);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  const selectCategory = (slug: string) => {
    const target = slug === "all" ? "?" : `?category=${encodeURIComponent(slug)}`;
    startNavigation(() => router.push(target, { scroll: false }));
  };

  const resetFilters = () => {
    setQuery("");
    if (category) selectCategory("all");
  };

  const active = category || "all";
  const pill = (isActive: boolean) =>
    `font-mono text-[10px] font-black uppercase px-3 py-1.5 border-2 border-black rounded shadow-[2px_2px_0px_#000] transition-all ${
      isActive ? "bg-electric-blue text-white" : "bg-white text-black hover:bg-yellow"
    }`;

  const busy = navigating || status === "searching" || (q && !search);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-neon-green text-black shadow-[2px_2px_0px_#0A0A0A]">
            <Newspaper className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-display text-2xl sm:text-3xl uppercase text-black">Artikel Terbaru</h2>
        </div>

        <div className="relative w-full md:max-w-xs">
          <label htmlFor="article-search" className="sr-only">
            Cari artikel
          </label>
          <Input
            id="article-search"
            type="search"
            placeholder="Cari artikel..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-11 pr-10 font-bold text-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/50 pointer-events-none" aria-hidden="true" />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Hapus pencarian"
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center border border-black bg-coral text-white rounded shadow-[1px_1px_0px_#000]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-10" role="group" aria-label="Saring berdasarkan kategori">
          <button type="button" onClick={() => selectCategory("all")} className={pill(active === "all")} aria-pressed={active === "all"}>
            Semua
          </button>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => selectCategory(cat.slug)}
              className={pill(active === cat.slug)}
              aria-pressed={active === cat.slug}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <div aria-live="polite" aria-busy={busy ? true : undefined} className={busy ? "opacity-50 transition-opacity" : "transition-opacity"}>
        {status === "error" && (
          <p role="alert" className="mb-6 border-2 border-black bg-coral text-white font-bold text-sm px-4 py-3 rounded">
            Artikel gagal dimuat. Periksa koneksi lalu coba lagi.
          </p>
        )}

        {page && page.posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {page.posts.map((post) => (
              <div key={post.id} className="h-full">
                <ArticleCard post={post} />
              </div>
            ))}
          </div>
        ) : q && !search ? (
          <p className="py-16 text-center font-bold text-black/50">Mencari…</p>
        ) : (
          <div className="py-16 px-6 text-center border-3 border-dashed border-black rounded-lg max-w-md mx-auto mt-10">
            <div className="flex h-16 w-16 items-center justify-center border-2 border-black bg-coral text-white shadow-[3px_3px_0px_#0A0A0A] rounded-full mx-auto mb-6">
              <Inbox className="h-8 w-8" aria-hidden="true" />
            </div>
            <h3 className="text-display text-xl uppercase text-black">Artikel Tidak Ditemukan</h3>
            <p className="font-bold text-black/60 text-xs max-w-sm mx-auto mt-2 leading-relaxed">
              {totalPublished === 0
                ? "Belum ada artikel yang terbit. Nantikan tulisan pertama!"
                : q
                  ? <>Tidak ada tulisan yang cocok dengan &ldquo;{q}&rdquo;.</>
                  : "Belum ada tulisan di kategori ini."}
            </p>
            {totalPublished > 0 && (
              <Button variant="electric" size="sm" className="mt-6" onClick={resetFilters}>
                Atur Ulang Filter
              </Button>
            )}
          </div>
        )}
      </div>

      {page?.hasMore && (
        <div className="flex justify-center mt-14">
          <Button variant="primary" size="md" onClick={loadMore} disabled={status === "loadingMore"} className="flex items-center gap-2 disabled:opacity-60">
            <span>{status === "loadingMore" ? "Memuat…" : "Muat Lebih Banyak"}</span>
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  );
};
