"use client";

import React from "react";
import { cn } from "../../_lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full px-4 py-3 bg-white text-black font-semibold border-2 border-black rounded-md shadow-[2px_2px_0px_#0A0A0A] placeholder-black/50 transition-all focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_#0A0A0A] dark:bg-dark-surface dark:text-cream dark:border-cream dark:shadow-[2px_2px_0px_#FFFBF0] dark:placeholder-cream/50 dark:focus:shadow-[4px_4px_0px_#FFFBF0]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
