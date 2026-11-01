"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, BookOpen } from "lucide-react";

export const Navbar = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (pathname?.startsWith("/custom-admin")) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent("open-search-modal"));
  };

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-cream/90 backdrop-blur-md dark:border-cream dark:bg-dark-bg/90 py-3 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2 select-none">
            <div className="flex h-10 items-center justify-center border-2 border-black bg-yellow px-3 font-mono text-lg font-black uppercase tracking-tight shadow-[2px_2px_0px_#000] dark:border-cream dark:shadow-[2px_2px_0px_#FFF] dark:text-black group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-hover:shadow-[4px_4px_0px_#000] dark:group-hover:shadow-[4px_4px_0px_#FFF] transition-all">
              <BookOpen className="mr-1.5 h-4 w-4 animate-wiggle" />
              <span>Chronica</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-bold border-2 border-transparent transition-all duration-100 ${
                  isActive(link.href)
                    ? "bg-electric-blue text-white border-black dark:border-cream shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#FFF]"
                    : "hover:bg-yellow hover:text-black hover:border-black hover:shadow-[2px_2px_0px_#000] dark:hover:border-cream dark:hover:shadow-[2px_2px_0px_#FFF] dark:text-cream dark:hover:text-black"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side items */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search Trigger */}
            <button
              onClick={handleOpenSearch}
              className="flex h-10 w-10 items-center justify-center border-2 border-black bg-white text-black hover:bg-yellow shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all dark:border-cream dark:bg-dark-surface dark:text-cream dark:hover:bg-yellow dark:hover:text-black dark:shadow-[2px_2px_0px_#FFF]"
              aria-label="Search posts (Ctrl+K)"
              title="Search posts (Ctrl+K)"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={handleOpenSearch}
              className="flex h-9 w-9 items-center justify-center border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none dark:border-cream dark:bg-dark-surface dark:text-cream dark:shadow-[2px_2px_0px_#FFF]"
              aria-label="Search"
            >
              <Search className="h-4.5 w-4.5" />
            </button>



            <button
              onClick={toggleMobileMenu}
              className="flex h-9 w-9 items-center justify-center border-2 border-black bg-yellow text-black shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none dark:border-cream dark:shadow-[2px_2px_0px_#FFF]"
              aria-label="Menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden border-t-2 border-black bg-cream dark:border-cream dark:bg-dark-bg absolute left-0 right-0 py-6 px-4 shadow-xl z-40 flex flex-col gap-4"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`w-full text-center py-3 text-lg font-black border-2 border-black shadow-[2px_2px_0px_#000] dark:border-cream dark:shadow-[2px_2px_0px_#FFF] transition-all ${
                    isActive(link.href)
                      ? "bg-electric-blue text-white"
                      : "bg-white text-black hover:bg-yellow dark:bg-dark-surface dark:text-cream"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
