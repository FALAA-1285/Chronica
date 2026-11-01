"use client";

import React from "react";
import { cn } from "../../_lib/utils";

export const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "skeleton rounded-sm border border-black/10 dark:border-cream/10",
        className
      )}
      {...props}
    />
  );
};
