import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ChevronLeft } from "lucide-react";
import { getPostBySlug, getRelatedPosts } from "../../_lib/dbPosts";
import { formatDate } from "../../_lib/posts";
import { ReadingProgress } from "../../_components/ReadingProgress";
import { TableOfContents } from "../../_components/TableOfContents";
import { Badge } from "../../_components/ui/Badge";
import { EmojiReactions, ShareButtons, CommentSection, CopyCodeButton } from "../../_components/BlogDetailClients";

// Next.js metadata generation
export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
    },
  };
}

// Simple slugify for headings anchor ID match
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

// Clean Custom Editorial Markdown Parser
const renderMarkdown = (content: string) => {
  const lines = content.split("\n");
  let isCodeBlock = false;
  let codeContent = "";
  let codeLanguage = "";
  const renderedElements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. Code block toggles
    if (line.startsWith("```")) {
      if (isCodeBlock) {
        // Close code block
        const currentCode = codeContent;
        renderedElements.push(
          <div key={`code-${i}`} className="relative group my-6 overflow-hidden">
            <CopyCodeButton code={currentCode} />
            <pre className="p-4 sm:p-5 bg-dark-bg text-cream border-2 border-black text-xs sm:text-sm font-mono dark:border-cream rounded-md overflow-x-auto">
              <code className={codeLanguage ? `language-${codeLanguage}` : ""}>
                {currentCode.trim()}
              </code>
            </pre>
          </div>
        );
        codeContent = "";
        isCodeBlock = false;
      } else {
        // Open code block
        isCodeBlock = true;
        codeLanguage = line.slice(3).trim();
      }
      continue;
    }

    if (isCodeBlock) {
      codeContent += line + "\n";
      continue;
    }

    // 2. Heading Level 2 (##)
    if (line.startsWith("## ")) {
      const title = line.slice(3).trim();
      const id = slugify(title);
      renderedElements.push(
        <h2 key={`h2-${i}`} id={id} className="text-display text-2xl sm:text-3xl font-black uppercase text-black dark:text-cream mt-8 mb-4 border-b-2 border-black dark:border-cream pb-2 select-none scroll-mt-24">
          {title}
        </h2>
      );
      continue;
    }

    // 2.5. Markdown Image Element (![alt](url))
    const imageMatch = line.trim().match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch) {
      const alt = imageMatch[1];
      const src = imageMatch[2];
      renderedElements.push(
        <div key={`img-${i}`} className="my-8 flex flex-col gap-2 select-none">
          <div className="relative w-full h-[250px] sm:h-[450px] border-3 border-black dark:border-cream rounded-lg shadow-[6px_6px_0px_#0A0A0A] dark:shadow-[6px_6px_0px_#FFFBF0] overflow-hidden bg-cream-dark transition-all hover:scale-[1.01]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt || "Article Image"}
              className="w-full h-full object-cover"
            />
          </div>
          {alt && (
            <span className="font-mono text-[10px] sm:text-xs text-black/60 dark:text-cream/60 uppercase text-center mt-1 font-bold">
              {alt}
            </span>
          )}
        </div>
      );
      continue;
    }

    // 3. Heading Level 3 (###)
    if (line.startsWith("### ")) {
      const title = line.slice(4).trim();
      const id = slugify(title);
      renderedElements.push(
        <h3 key={`h3-${i}`} id={id} className="text-display text-xl sm:text-2xl font-black uppercase text-black dark:text-cream mt-6 mb-3 scroll-mt-24">
          {title}
        </h3>
      );
      continue;
    }

    // 4. Empty line spacing
    if (!line.trim()) {
      continue;
    }

    // 5. Unordered List Items (- )
    if (line.startsWith("- ")) {
      renderedElements.push(
        <li key={`li-${i}`} className="ml-5 list-disc font-semibold text-black/85 dark:text-cream/85 text-sm sm:text-base mb-1.5 leading-relaxed">
          {line.slice(2).trim()}
        </li>
      );
      continue;
    }

    // Default Paragraphs
    renderedElements.push(
      <p key={`p-${i}`} className="font-semibold text-black/85 dark:text-cream/85 text-sm sm:text-base mb-4 leading-relaxed">
        {line.trim()}
      </p>
    );
  }

  return <div className="prose-brutal">{renderedElements}</div>;
};

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = await getRelatedPosts(post);

  const badgeVariants: Record<string, "primary" | "secondary" | "electric" | "neon" | "coral" | "yellow" | "purple" | "orange"> = {
    history: "yellow",
    politics: "coral",
    literature: "neon",
    philosophy: "electric",
    culture: "orange",
    "social-science": "purple",
  };

  const currentVariant = badgeVariants[post.category.slug] || "primary";

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors pb-20">
      {/* Scroll indicator */}
      <ReadingProgress />

      {/* Hero cover header block */}
      <div className="border-b-3 border-black dark:border-cream bg-cream py-10 lg:py-16 transition-colors select-none">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs font-mono font-black uppercase text-black/60 dark:text-cream/60 hover:text-black dark:hover:text-cream mb-6 hover:-translate-x-0.5 transition-all"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
            <span>BACK TO ARCHIVES</span>
          </Link>

          {/* Tag Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant={currentVariant}>{post.category.name}</Badge>
            <span className="flex items-center gap-1 font-mono text-[10px] sm:text-xs text-black/60 dark:text-cream/60">
              <Clock className="h-3.5 w-3.5" />
              <span>{post.readingTime} MIN READ</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-display text-3xl sm:text-5xl lg:text-6xl text-black dark:text-cream tracking-tight uppercase leading-tight mb-6">
            {post.title}
          </h1>

          {/* Author meta cards info */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 border-t-2 border-dashed border-black/25 dark:border-cream/25 pt-6 mt-6">
            <div className="flex items-center gap-2.5">
              <div className="relative h-10 w-10 border border-black dark:border-cream rounded-full overflow-hidden bg-yellow">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-mono text-[10px] text-black/50 dark:text-cream/50 uppercase">Written By</p>
                <p className="font-black text-sm text-black dark:text-cream">{post.author.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center border border-black bg-cream-dark text-black rounded dark:border-cream">
                <Calendar className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="font-mono text-[10px] text-black/50 dark:text-cream/50 uppercase">Published On</p>
                <p className="font-black text-xs text-black dark:text-cream">{formatDate(post.publishedAt)}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main post columns layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main article content column (8cols) */}
          <article className="lg:col-span-8">
            {/* Big cover img */}
            <div className="relative h-[250px] sm:h-[400px] border-3 border-black dark:border-cream rounded-md shadow-[6px_6px_0px_#0A0A0A] dark:shadow-[6px_6px_0px_#FFFBF0] overflow-hidden mb-10 select-none">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Rendered post article content */}
            <div className="prose-brutal select-text">
              {renderMarkdown(post.content)}
            </div>

            {/* Reactions, Share panel details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
              <EmojiReactions />
              <ShareButtons />
            </div>

            {/* Discussion comment sections */}
            <CommentSection />
          </article>

          {/* Sticky Side bar widget details (4cols) */}
          <div className="lg:col-span-4 lg:border-l-3 lg:border-dashed lg:border-black/20 lg:pl-10 dark:lg:border-cream/20">
            <div className="sticky top-24 flex flex-col gap-8">
              
              {/* 1. Table of Contents */}
              <TableOfContents items={post.tableOfContents} />

              {/* 2. Related Posts stacked */}
              {related.length > 0 && (
                <div className="border-2 border-black bg-white p-5 rounded-md shadow-[4px_4px_0px_#0A0A0A] dark:border-cream dark:bg-dark-surface dark:shadow-[4px_4px_0px_#FFFBF0] transition-colors select-none">
                  <h3 className="font-mono text-xs font-black uppercase tracking-wider text-black/50 dark:text-cream/50 mb-4 border-b border-black dark:border-cream pb-1.5">
                    Related Stories
                  </h3>
                  <div className="flex flex-col gap-4">
                    {related.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/blog/${rel.slug}`}
                        className="group flex flex-col gap-1 transition-all"
                      >
                        <h4 className="font-bold text-sm text-black dark:text-cream group-hover:text-electric-blue transition-colors leading-snug line-clamp-2">
                          {rel.title}
                        </h4>
                        <span className="font-mono text-[10px] text-black/50 dark:text-cream/50">
                          {formatDate(rel.publishedAt)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
