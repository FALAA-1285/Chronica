"use client";

import React from "react";
import { cn } from "../../_lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "electric" | "neon" | "coral" | "yellow" | "purple" | "orange";
}

export const Badge = ({
  className,
  children,
  variant = "primary",
  ...props
}: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-block font-mono text-xs font-bold px-2.5 py-1 uppercase tracking-wider border border-black dark:border-cream rounded-sm select-none",
        variant === "primary" && "bg-white text-black dark:bg-dark-surface dark:text-cream",
        variant === "secondary" && "bg-cream-dark text-black dark:bg-dark-surface-2 dark:text-cream",
        variant === "electric" && "bg-electric-blue text-white",
        variant === "neon" && "bg-neon-green text-black",
        variant === "coral" && "bg-coral text-white",
        variant === "yellow" && "bg-yellow text-black",
        variant === "purple" && "bg-purple text-white",
        variant === "orange" && "bg-orange text-black",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
