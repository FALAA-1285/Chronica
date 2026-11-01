"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Command, CornerDownLeft, FileText, Search, X } from "lucide-react";
import type { PostSummary } from "@/lib/types";

export const OPEN_SEARCH_EVENT = "open-search-modal";

export const SearchModal = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PostSummary[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const open = () => setIsOpen(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener(OPEN_SEARCH_EVENT, open);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, open);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Debounced search against the database while the modal is open.
  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setStatus("loading");
      try {
        const limit = query.trim() ? 8 : 3;
        const res = await fetch(`/api/posts?limit=${limit}&q=${encodeURIComponent(query.trim())}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setResults(await res.json());
        setSelectedIndex(0);
        setStatus("idle");
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Search failed:", error);
          setStatus("error");
        }
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length ? (prev + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      router.push(`/blog/${results[selectedIndex].slug}`);
      handleClose();
    }
  };

  const hasQuery = query.trim().length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={(e) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) handleClose();
          }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-[10vh]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            onAnimationStart={() => inputRef.current?.focus()}
            ref={modalRef}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label="Search articles"
            className="w-full max-w-2xl border-3 border-black bg-cream shadow-[8px_8px_0px_#0A0A0A] overflow-hidden"
          >
            <div className="relative flex items-center border-b-3 border-black p-4">
              <Search className="h-6 w-6 text-black/60 mr-3 shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search articles..."
                aria-label="Search articles"
                className="w-full bg-transparent text-xl font-bold text-black outline-none placeholder-black/45"
              />
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close search"
                className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black bg-coral text-white shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="max-h-[350px] overflow-y-auto p-4 flex flex-col gap-2" aria-live="polite">
              {status === "error" ? (
                <p className="py-8 text-center font-bold text-coral">Search is unavailable right now. Please try again.</p>
              ) : results.length > 0 ? (
                <>
                  {!hasQuery && <p className="text-xs font-mono font-bold text-black/50 uppercase">Latest stories</p>}
                  {results.map((post, index) => {
                    const active = hasQuery && index === selectedIndex;
                    return hasQuery ? (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        onClick={handleClose}
                        className={`flex items-center justify-between p-3.5 border-2 border-black rounded transition-all ${
                          active
                            ? "bg-electric-blue text-white translate-x-1 shadow-[2px_2px_0px_#0A0A0A]"
                            : "bg-white text-black hover:bg-yellow"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                          <div className="min-w-0">
                            <p className="font-extrabold text-base truncate">{post.title}</p>
                            <p className={`text-xs truncate ${active ? "text-white/80" : "text-black/60"}`}>{post.excerpt}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-mono font-bold px-1.5 py-0.5 border rounded uppercase ${
                              active ? "bg-white/20 border-white text-white" : "bg-cream border-black text-black"
                            }`}
                          >
                            {post.category.name}
                          </span>
                          {active && <CornerDownLeft className="h-4 w-4 text-white" aria-hidden="true" />}
                        </div>
                      </Link>
                    ) : (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        onClick={handleClose}
                        className="flex items-center justify-between p-3 border border-black bg-white hover:bg-neon-green text-black font-bold transition-all"
                      >
                        <span className="truncate">{post.title}</span>
                        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </Link>
                    );
                  })}
                </>
              ) : status === "loading" ? (
                <p className="py-8 text-center font-bold text-black/50">Searching…</p>
              ) : hasQuery ? (
                <div className="py-8 text-center border-2 border-dashed border-black/40 rounded">
                  <p className="font-bold text-lg text-black/60">No results found for &ldquo;{query}&rdquo;</p>
                  <p className="text-sm font-semibold text-black/40 mt-1">Try searching for another topic.</p>
                </div>
              ) : (
                <p className="py-8 text-center font-bold text-black/50">No articles published yet.</p>
              )}
            </div>

            <div className="border-t-3 border-black bg-cream-dark p-3.5 hidden sm:flex items-center justify-between font-mono text-xs text-black/60">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 border border-black bg-white rounded">↑↓</kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 border border-black bg-white rounded">Enter</kbd>
                  <span>Select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 border border-black bg-white rounded">ESC</kbd>
                  <span>Close</span>
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Command className="h-3.5 w-3.5" aria-hidden="true" />
                <span>K</span>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
