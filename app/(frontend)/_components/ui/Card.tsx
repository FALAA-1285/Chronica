"use client";

import React from "react";
import { cn } from "../../_lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  bgColor?: string;
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, bgColor = "bg-white dark:bg-dark-surface", hoverEffect = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border-2 border-black rounded-md p-6 flex flex-col justify-between dark:border-cream",
          bgColor,
          // Custom Neo Brutalist offset shadow
          "shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,251,240,1)]",
          hoverEffect && "transition-all duration-150 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,251,240,1)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
