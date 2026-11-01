import React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "electric" | "neon" | "coral" | "yellow";
type Size = "sm" | "md" | "lg";

const lift = "shadow-[4px_4px_0px_#0A0A0A] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#0A0A0A]";

const VARIANTS: Record<Variant, string> = {
  primary: `bg-white text-black border-black ${lift}`,
  secondary: `bg-cream-dark text-black border-black ${lift}`,
  electric: `bg-electric-blue text-white border-black ${lift}`,
  neon: `bg-neon-green text-black border-black ${lift}`,
  coral: `bg-coral text-white border-black ${lift}`,
  yellow: `bg-yellow text-black border-black ${lift}`,
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm border-2 rounded",
  md: "px-5 py-2.5 text-base border-2 rounded-md",
  lg: "px-8 py-4 text-lg border-3 rounded-md",
};

/** Button styles, also usable on <Link> so links never wrap a <button>. */
export function buttonClass({ variant = "primary", size = "md", className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(
    "inline-flex items-center justify-center font-bold transition-all duration-100 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
    SIZES[size],
    VARIANTS[variant],
    className,
  );
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClass({ variant, size, className })} {...props} />;
}
