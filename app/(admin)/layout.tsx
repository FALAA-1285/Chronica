import React from "react";
import type { Metadata } from "next";
import "../globals.css";
import { fontVariables } from "../fonts";

export const metadata: Metadata = {
  title: "Chronica CMS",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={fontVariables}>
      <body className="min-h-screen bg-[#f4f4f0] text-black">{children}</body>
    </html>
  );
}
