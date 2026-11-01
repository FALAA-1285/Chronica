import React from "react";
import Link from "next/link";
import { Quote } from "lucide-react";
import type { Quote as QuoteData } from "@/lib/constants";
import type { Author, PostSummary } from "@/lib/types";
import { getSocialLinks } from "./SocialLinks";

interface SidebarProps {
  popular: PostSummary[];
  author: Author | null;
  quote: QuoteData;
}

export const Sidebar = ({ popular, author, quote }: SidebarProps) => {
  const socialLinks = getSocialLinks(author?.social);

  return (
    <aside className="flex flex-col gap-10">
      {popular.length > 0 && (
        <div className="border-2 border-black bg-white rounded-md p-5 shadow-[4px_4px_0px_#0A0A0A]">
          <h3 className="text-display text-lg uppercase text-black border-b-2 border-black pb-2 mb-4 font-black">Popular Reads</h3>
          <ol className="flex flex-col gap-4">
            {popular.map((post, idx) => (
              <li key={post.id} className="flex gap-3 items-start">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center border border-black bg-neon-green font-mono text-xs font-black text-black">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <Link href={`/blog/${post.slug}`} className="font-bold text-sm text-black hover:text-electric-blue transition-colors line-clamp-2">
                    {post.title}
                  </Link>
                  <span className="font-mono text-[10px] text-black/50 mt-1 block">
                    {post.views} VIEWS • {post.likes} LIKES
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      <figure className="border-2 border-black bg-white rounded-md p-5 shadow-[4px_4px_0px_#0A0A0A]">
        <Quote className="h-8 w-8 text-electric-blue mb-3" aria-hidden="true" />
        <blockquote className="font-bold text-black/85 text-base italic leading-relaxed">&ldquo;{quote.text}&rdquo;</blockquote>
        <figcaption className="font-mono text-xs text-black/60 mt-3 font-bold text-right">— {quote.author}</figcaption>
      </figure>

      {socialLinks.length > 0 && (
        <div className="border-2 border-black bg-white rounded-md p-5 shadow-[4px_4px_0px_#0A0A0A]">
          <h3 className="text-display text-lg uppercase text-black border-b-2 border-black pb-2 mb-4 font-black">Stay Connected</h3>
          <div className="flex flex-col gap-2">
            {socialLinks.map(({ label, href, Icon, bg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 p-3 border-2 border-black ${bg} hover:-translate-y-0.5 font-extrabold text-sm shadow-[2px_2px_0px_#0A0A0A] transition-all uppercase`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
