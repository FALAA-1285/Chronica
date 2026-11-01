import React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type = "text", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-4 py-3 bg-white text-black font-semibold border-2 border-black rounded-md shadow-[2px_2px_0px_#0A0A0A] placeholder-black/50 transition-all focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_#0A0A0A]",
        className,
      )}
      {...props}
    />
  );
}
