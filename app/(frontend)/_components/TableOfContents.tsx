"use client";

import React, { useEffect, useState } from "react";
import { TocItem } from "../_lib/types";

interface TableOfContentsProps {
  items: TocItem[];
}

export const TableOfContents = ({ items }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headingElements = items.map((item) => document.getElementById(item.id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeading = entries.find((entry) => entry.isIntersecting);
        if (visibleHeading) {
          setActiveId(visibleHeading.target.id);
        }
      },
      { rootMargin: "0px 0px -60% 0px" }
    );

    headingElements.forEach((el) => observer.observe(el!));

    return () => {
      headingElements.forEach((el) => observer.unobserve(el!));
    };
  }, [items]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return (
    <div className="border-2 border-black bg-cream-dark p-5 rounded-md shadow-[4px_4px_0px_#0A0A0A] dark:border-cream dark:bg-dark-surface-2 dark:shadow-[4px_4px_0px_#FFFBF0] transition-colors select-none">
      <h3 className="font-mono text-xs font-black uppercase tracking-wider text-black/50 dark:text-cream/50 mb-3">
        Table of Contents
      </h3>
      <nav className="flex flex-col gap-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleLinkClick(e, item.id)}
            className={`font-bold text-sm transition-all block ${
              item.level === 3 ? "pl-4 text-xs font-semibold" : ""
            } ${
              activeId === item.id
                ? "text-electric-blue translate-x-1 font-extrabold"
                : "text-black/70 hover:text-black hover:translate-x-0.5 dark:text-cream/70 dark:hover:text-cream"
            }`}
          >
            {item.title}
          </a>
        ))}
      </nav>
    </div>
  );
};
