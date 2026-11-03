"use client";

import React, { useEffect, useState } from "react";
import type { TocItem } from "@/lib/types";

export const TableOfContents = ({ items }: { items: TocItem[] }) => {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headings = items.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "0px 0px -60% 0px" },
    );
    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    e.preventDefault();
    window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav aria-label="Daftar isi" className="border-2 border-black bg-cream-dark p-5 rounded-md shadow-[4px_4px_0px_#0A0A0A]">
      <h3 className="font-mono text-xs font-black uppercase tracking-wider text-black/50 mb-3">Daftar Isi</h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleLinkClick(e, item.id)}
              aria-current={activeId === item.id ? "location" : undefined}
              className={`font-bold text-sm transition-all block ${item.level === 3 ? "pl-4 text-xs font-semibold" : ""} ${
                activeId === item.id ? "text-electric-blue translate-x-1 font-extrabold" : "text-black/70 hover:text-black hover:translate-x-0.5"
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
