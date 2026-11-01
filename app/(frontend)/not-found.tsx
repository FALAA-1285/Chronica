import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Home } from "lucide-react";
import { buttonClass } from "./_components/ui/Button";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "This page was lost in the archives of history.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] bg-cream py-20 px-4 relative overflow-hidden bg-grid-pattern">
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-10 lg:left-24 hidden sm:flex border-2 border-black bg-coral text-white font-mono text-[10px] font-black uppercase tracking-wider px-3 py-1 shadow-[2px_2px_0px_#000] rotate-[-8deg]"
      >
        Error 404
      </div>

      <div className="flex flex-col items-center text-center max-w-lg relative z-10">
        <div className="flex h-14 w-14 items-center justify-center border-3 border-black bg-coral text-white shadow-[3px_3px_0px_#0A0A0A] rounded-full mx-auto mb-8">
          <BookOpen className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="text-display text-7xl sm:text-9xl text-black tracking-tighter uppercase leading-none" aria-hidden="true">
          404
        </p>
        <h1 className="text-display text-2xl sm:text-4xl text-black tracking-tight uppercase mt-4">Page Lost in the Archives</h1>
        <p className="font-semibold text-black/70 text-sm sm:text-base mt-4 leading-relaxed max-w-sm">
          The page you are looking for has moved or no longer exists.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-8 w-full sm:w-auto">
          <Link href="/" className={buttonClass({ variant: "electric", className: "w-full sm:w-auto gap-2" })}>
            <Home className="h-4.5 w-4.5" aria-hidden="true" />
            <span>Back Home</span>
          </Link>
          <Link href="/blog" className={buttonClass({ variant: "secondary", className: "w-full sm:w-auto gap-2" })}>
            <ArrowLeft className="h-4.5 w-4.5" aria-hidden="true" />
            <span>Browse Blog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
