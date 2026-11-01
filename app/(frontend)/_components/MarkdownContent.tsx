import React from "react";
import Markdown, { type Components } from "react-markdown";
import { createSlugger } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { CopyCodeButton } from "./BlogDetailClients";

interface HastNode {
  type: string;
  value?: string;
  children?: HastNode[];
}

function textOf(node: HastNode | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

/**
 * Renders article markdown. Raw HTML is ignored and unsafe URLs are stripped
 * by react-markdown. Heading ids come from the same slugger as parseToc(), so
 * table-of-contents links always match.
 */
export function MarkdownContent({ content, className }: { content: string; className?: string }) {
  const slug = createSlugger();

  const components: Components = {
    h1: ({ children }) => <h2 className="text-display text-2xl sm:text-3xl font-black uppercase text-black">{children}</h2>,
    h2: ({ node, children }) => (
      <h2 id={slug(textOf(node))} className="text-display text-2xl sm:text-3xl font-black uppercase text-black scroll-mt-24">
        {children}
      </h2>
    ),
    h3: ({ node, children }) => (
      <h3 id={slug(textOf(node))} className="text-display text-xl sm:text-2xl font-black uppercase text-black scroll-mt-24">
        {children}
      </h3>
    ),
    a: ({ href, children }) => {
      const external = !!href && /^https?:\/\//.test(href);
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    },
    img: ({ src, alt }) =>
      typeof src === "string" && src ? (
        <span className="my-8 flex flex-col gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary author-supplied hosts */}
          <img src={src} alt={alt ?? ""} loading="lazy" className="w-full max-h-[450px] object-cover rounded-lg" />
          {alt && <span className="font-mono text-[10px] sm:text-xs text-black/60 uppercase text-center font-bold">{alt}</span>}
        </span>
      ) : null,
    pre: ({ node, children }) => (
      <div className="relative my-6">
        <CopyCodeButton code={textOf(node).replace(/\n$/, "")} />
        <pre className="p-4 sm:p-5 bg-dark-bg text-cream text-xs sm:text-sm">{children}</pre>
      </div>
    ),
  };

  return (
    <div className={cn("prose-brutal", className)}>
      <Markdown components={components}>{content}</Markdown>
    </div>
  );
}
