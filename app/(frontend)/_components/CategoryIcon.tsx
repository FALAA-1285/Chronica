import { BookOpen, Compass, Folder, Globe, PenTool, Sparkles, Users, type LucideIcon } from "lucide-react";
import type { CategoryIconName } from "@/lib/constants";

// Explicit map instead of `import * as Icons` so only these icons are bundled.
const ICONS: Record<CategoryIconName, LucideIcon> = { BookOpen, Globe, PenTool, Compass, Sparkles, Users };

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name as CategoryIconName] ?? Folder;
  return <Icon className={className} aria-hidden="true" />;
}
