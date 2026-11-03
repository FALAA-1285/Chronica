import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { Calendar, ChevronLeft, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { getApprovedComments } from "@/lib/comments";
import { ReadingProgress } from "../../_components/ReadingProgress";
import { TableOfContents } from "../../_components/TableOfContents";
import { CategoryBadge } from "../../_components/CategoryBadge";
import { MarkdownContent } from "../../_components/MarkdownContent";
import { SafeImage } from "../../_components/SafeImage";
import { LikeButton, ShareButtons } from "../../_components/BlogDetailClients";
import { CommentSection } from "../../_components/CommentSection";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [{ url: post.coverImage }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [related, comments] = await Promise.all([getRelatedPosts(post), getApprovedComments(post.id)]);

  // Count the view after the response is sent so it never slows the page down.
  after(() =>
    prisma.post
      .update({ where: { id: post.id }, data: { views: { increment: 1 } } })
      .catch((error) => console.error("Failed to record view:", error)),
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      <ReadingProgress />

      <div className="border-b-3 border-black bg-cream py-10 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs font-mono font-black uppercase text-black/60 hover:text-black mb-6 hover:-translate-x-0.5 transition-all"
          >
            <ChevronLeft className="h-4.5 w-4.5" aria-hidden="true" />
            <span>Back to Archives</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <CategoryBadge category={post.category} />
            <span className="flex items-center gap-1 font-mono text-[10px] sm:text-xs text-black/60">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{post.readingTime} MIN READ</span>
            </span>
          </div>

          <h1 className="text-display text-3xl sm:text-5xl lg:text-6xl text-black tracking-tight uppercase leading-tight mb-6">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 border-t-2 border-dashed border-black/25 pt-6 mt-6">
            <div className="flex items-center gap-2.5">
              <div className="relative h-10 w-10 border border-black rounded-full overflow-hidden bg-yellow">
                <SafeImage src={post.author.avatar} alt="" fill sizes="40px" className="object-cover" />
              </div>
              <div>
                <p className="font-mono text-[10px] text-black/50 uppercase">Written By</p>
                <p className="font-black text-sm text-black">{post.author.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center border border-black bg-cream-dark text-black rounded">
                <Calendar className="h-4.5 w-4.5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-mono text-[10px] text-black/50 uppercase">Published On</p>
                <time dateTime={post.publishedAt} className="font-black text-xs text-black">
                  {formatDate(post.publishedAt)}
                </time>
              </div>
            </div>
          </div>

          {post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2 mt-6" aria-label="Tags">
              {post.tags.map((tag) => (
                <li
                  key={tag.id}
                  className="font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black rounded text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  #{tag.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <article className="lg:col-span-8">
            <div className="relative h-[250px] sm:h-[400px] border-3 border-black rounded-md shadow-[6px_6px_0px_#0A0A0A] overflow-hidden mb-10">
              <SafeImage src={post.coverImage} alt={post.title} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" priority />
            </div>

            <MarkdownContent content={post.content} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
              <LikeButton slug={post.slug} initialLikes={post.likes} />
              <ShareButtons />
            </div>

            <CommentSection slug={post.slug} initialComments={comments} />
          </article>

          <aside className="lg:col-span-4 lg:border-l-3 lg:border-dashed lg:border-black/20 lg:pl-10">
            <div className="sticky top-24 flex flex-col gap-8">
              <TableOfContents items={post.tableOfContents} />

              {related.length > 0 && (
                <div className="border-2 border-black bg-white p-5 rounded-md shadow-[4px_4px_0px_#0A0A0A]">
                  <h3 className="font-mono text-xs font-black uppercase tracking-wider text-black/50 mb-4 border-b border-black pb-1.5">Related Stories</h3>
                  <ul className="flex flex-col gap-4">
                    {related.map((rel) => (
                      <li key={rel.id}>
                        <Link href={`/blog/${rel.slug}`} className="group flex flex-col gap-1 transition-all">
                          <span className="font-bold text-sm text-black group-hover:text-electric-blue transition-colors leading-snug line-clamp-2">
                            {rel.title}
                          </span>
                          <span className="font-mono text-[10px] text-black/50">{formatDate(rel.publishedAt)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
