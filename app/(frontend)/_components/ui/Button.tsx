"use client";

import React from "react";
import { cn } from "../../_lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "electric" | "neon" | "coral" | "yellow" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-bold transition-all duration-100 cursor-pointer select-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
          // Sizes
          size === "sm" && "px-3 py-1.5 text-sm border-2 rounded",
          size === "md" && "px-5 py-2.5 text-base border-2 rounded-md",
          size === "lg" && "px-8 py-4 text-lg border-3 rounded-md",
          // Variants with Neo Brutalism styling (thick borders & hard offset shadow)
          variant === "primary" && 
            "bg-white text-black border-black shadow-[4px_4px_0px_#0A0A0A] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#0A0A0A] dark:bg-dark-surface dark:text-cream dark:border-cream dark:shadow-[4px_4px_0px_#FFFBF0] dark:hover:shadow-[6px_6px_0px_#FFFBF0]",
          variant === "secondary" && 
            "bg-cream-dark text-black border-black shadow-[4px_4px_0px_#0A0A0A] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#0A0A0A] dark:bg-dark-surface-2 dark:text-cream dark:border-cream dark:shadow-[4px_4px_0px_#FFFBF0] dark:hover:shadow-[6px_6px_0px_#FFFBF0]",
          variant === "electric" && 
            "bg-electric-blue text-white border-black shadow-[4px_4px_0px_#0A0A0A] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#0A0A0A] dark:border-cream dark:shadow-[4px_4px_0px_#FFFBF0] dark:hover:shadow-[6px_6px_0px_#FFFBF0]",
          variant === "neon" && 
            "bg-neon-green text-black border-black shadow-[4px_4px_0px_#0A0A0A] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#0A0A0A] dark:border-cream dark:shadow-[4px_4px_0px_#FFFBF0] dark:hover:shadow-[6px_6px_0px_#FFFBF0]",
          variant === "coral" && 
            "bg-coral text-white border-black shadow-[4px_4px_0px_#0A0A0A] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#0A0A0A] dark:border-cream dark:shadow-[4px_4px_0px_#FFFBF0] dark:hover:shadow-[6px_6px_0px_#FFFBF0]",
          variant === "yellow" && 
            "bg-yellow text-black border-black shadow-[4px_4px_0px_#0A0A0A] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#0A0A0A] dark:border-cream dark:shadow-[4px_4px_0px_#FFFBF0] dark:hover:shadow-[6px_6px_0px_#FFFBF0]",
          variant === "outline" && 
            "bg-transparent text-black border-black hover:bg-black/5 dark:text-cream dark:border-cream dark:hover:bg-white/5",
          variant === "ghost" && 
            "bg-transparent text-black border-transparent hover:bg-black/5 dark:text-cream dark:hover:bg-white/5",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
