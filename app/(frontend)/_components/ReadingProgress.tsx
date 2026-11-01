"use client";

import React, { useEffect, useState } from "react";

export const ReadingProgress = () => {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setCompletion(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 h-1.5 bg-electric-blue z-[9999] transition-all duration-75 pointer-events-none"
      style={{ width: `${completion}%` }}
    />
  );
};
