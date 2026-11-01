"use client";

import React from "react";

// React 19 / next-themes dev server error overlay suppression
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Encountered a script tag while rendering React component") ||
       args[0].includes("Scripts inside React components are never executed"))
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
