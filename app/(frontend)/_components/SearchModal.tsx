"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Command, FileText, ArrowRight, CornerDownLeft } from "lucide-react";
import { posts } from "../_lib/posts";

export const SearchModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Derive search results directly from query state
  const results = query.trim()
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          post.category.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    if (pathname?.startsWith("/custom-admin")) return;
    const handleOpen = () => {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    };

    window.addEventListener("open-search-modal", handleOpen);

    // Ctrl+K key binding
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-search-modal", handleOpen);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pathname]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(0);
  };

  // Navigate on enter or arrow navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        router.push(`/blog/${results[selectedIndex].slug}`);
        setIsOpen(false);
        setQuery("");
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  // Close when clicking overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  if (pathname?.startsWith("/custom-admin")) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-[10vh]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            ref={modalRef}
            onKeyDown={handleKeyDown}
            className="w-full max-w-2xl border-3 border-black bg-cream p-0 shadow-[8px_8px_0px_#0A0A0A] dark:border-cream dark:bg-dark-surface dark:shadow-[8px_8px_0px_#FFFBF0] overflow-hidden"
          >
            {/* Input Header */}
            <div className="relative flex items-center border-b-3 border-black dark:border-cream p-4">
              <Search className="h-6 w-6 text-black/60 dark:text-cream/60 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Type to search articles..."
                className="w-full bg-transparent text-xl font-bold text-black outline-none placeholder-black/45 dark:text-cream dark:placeholder-cream/45"
              />
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center border-2 border-black bg-coral text-white shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:shadow-[3px_3px_0px_#0a0a0a] dark:border-cream dark:shadow-[2px_2px_0px_#FFFBF0] dark:hover:shadow-[3px_3px_0px_#FFFBF0] transition-all"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Results Body */}
            <div className="max-h-[350px] overflow-y-auto p-4 flex flex-col gap-2">
              {results.length > 0 ? (
                results.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    onClick={handleClose}
                    className={`flex items-center justify-between p-3.5 border-2 border-black rounded dark:border-cream transition-all select-none ${
                      index === selectedIndex
                        ? "bg-electric-blue text-white translate-x-1 shadow-[2px_2px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_#FFFBF0]"
                        : "bg-white text-black hover:bg-yellow hover:text-black dark:bg-dark-surface-2 dark:text-cream dark:hover:bg-yellow dark:hover:text-black"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="h-5 w-5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-extrabold text-base truncate">{post.title}</p>
                        <p
                          className={`text-xs truncate ${
                            index === selectedIndex ? "text-white/80" : "text-black/60 dark:text-cream/60"
                          }`}
                        >
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-mono font-bold px-1.5 py-0.5 border rounded uppercase ${
                          index === selectedIndex
                            ? "bg-white/20 border-white text-white"
                            : "bg-cream border-black text-black dark:bg-dark-surface dark:border-cream dark:text-cream"
                        }`}
                      >
                        {post.category.name}
                      </span>
                      {index === selectedIndex && (
                        <CornerDownLeft className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </Link>
                ))
              ) : query.trim() ? (
                <div className="py-8 text-center border-2 border-dashed border-black/40 rounded dark:border-cream/40">
                  <p className="font-bold text-lg text-black/60 dark:text-cream/60">No results found for &ldquo;{query}&rdquo;</p>
                  <p className="text-sm font-semibold text-black/40 dark:text-cream/40 mt-1">Try searching for alternative topics!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-mono font-bold text-black/50 uppercase dark:text-cream/50">Recent & Suggested Topics</p>
                  {posts.slice(0, 3).map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      onClick={handleClose}
                      className="flex items-center justify-between p-3 border border-black bg-white hover:bg-neon-green text-black font-bold dark:border-cream dark:bg-dark-surface-2 dark:text-cream dark:hover:text-black transition-all"
                    >
                      <span className="truncate">{post.title}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Commands bar */}
            <div className="border-t-3 border-black dark:border-cream bg-cream-dark dark:bg-dark-surface-2 p-3.5 flex items-center justify-between font-mono text-xs text-black/60 dark:text-cream/60">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 border border-black bg-white rounded dark:border-cream dark:bg-dark-surface">↑↓</kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 border border-black bg-white rounded dark:border-cream dark:bg-dark-surface">Enter</kbd>
                  <span>Select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 border border-black bg-white rounded dark:border-cream dark:bg-dark-surface">ESC</kbd>
                  <span>Close</span>
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Command className="h-3.5 w-3.5" />
                <span>K</span>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
