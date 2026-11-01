import type { PostSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Badge coloured with the category's own colours from the CMS. */
export function CategoryBadge({ category, className }: { category: PostSummary["category"]; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block font-mono text-xs font-bold px-2.5 py-1 uppercase tracking-wider border border-black rounded-sm",
        className,
      )}
      style={{ backgroundColor: category.bgColor, color: category.color }}
    >
      {category.name}
    </span>
  );
}
