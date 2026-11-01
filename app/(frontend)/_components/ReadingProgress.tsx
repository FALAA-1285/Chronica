"use client";

import React, { useEffect, useState } from "react";

export const ReadingProgress = () => {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setCompletion(
          Number((window.scrollY / scrollHeight).toFixed(2)) * 100
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-1.5 bg-electric-blue z-[9999] transition-all duration-75 select-none pointer-events-none"
      style={{ width: `${completion}%` }}
    />
  );
};
