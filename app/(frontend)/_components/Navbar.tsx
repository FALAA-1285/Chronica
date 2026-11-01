"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Menu, Search, X } from "lucide-react";
import { OPEN_SEARCH_EVENT } from "./SearchModal";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const openSearch = () => window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT));
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-cream/90 backdrop-blur-md py-3">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          <Link href="/" className="group flex items-center gap-2" aria-label="Chronica home">
            <div className="flex h-10 items-center justify-center border-2 border-black bg-yellow px-3 font-mono text-lg font-black uppercase tracking-tight shadow-[2px_2px_0px_#000] group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-hover:shadow-[4px_4px_0px_#000] transition-all">
              <BookOpen className="mr-1.5 h-4 w-4" aria-hidden="true" />
              <span>Chronica</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`relative px-4 py-2 text-sm font-bold border-2 transition-all duration-100 ${
                  isActive(link.href)
                    ? "bg-electric-blue text-white border-black shadow-[2px_2px_0px_#000]"
                    : "border-transparent hover:bg-yellow hover:text-black hover:border-black hover:shadow-[2px_2px_0px_#000]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openSearch}
              className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center border-2 border-black bg-white text-black hover:bg-yellow shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              aria-label="Search posts (Ctrl+K)"
              title="Search posts (Ctrl+K)"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="flex md:hidden h-9 w-9 items-center justify-center border-2 border-black bg-yellow text-black shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden border-t-2 border-black bg-cream absolute left-0 right-0 py-6 px-4 shadow-xl z-40 flex flex-col gap-2"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`w-full text-center py-3 text-lg font-black border-2 border-black shadow-[2px_2px_0px_#000] transition-all ${
                  isActive(link.href) ? "bg-electric-blue text-white" : "bg-white text-black hover:bg-yellow"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
