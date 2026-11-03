"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FolderHeart, Inbox, LayoutDashboard, LogOut, MessageCircle, Music, Newspaper, Sparkles, Tag as TagIcon, User } from "lucide-react";
import type { SessionUser } from "@/lib/auth/session";
import { useCollection } from "./api";
import { AuthorTab } from "./AuthorTab";
import { CategoriesTab } from "./CategoriesTab";
import { CommentsTab } from "./CommentsTab";
import { MessagesTab } from "./MessagesTab";
import { PostsTab } from "./PostsTab";
import { TagsTab } from "./TagsTab";
import { TracksTab } from "./TracksTab";
import type { AdminCategory, AdminComment, AdminMessage, AdminPost, AdminTag, AdminTrack } from "./types";
import { FeedbackProvider, Panel } from "./ui";

const TABS = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "posts", label: "Artikel", Icon: Newspaper },
  { id: "categories", label: "Kategori", Icon: FolderHeart },
  { id: "tags", label: "Tag", Icon: TagIcon },
  { id: "tracks", label: "Musik", Icon: Music },
  { id: "comments", label: "Komentar", Icon: MessageCircle },
  { id: "messages", label: "Pesan", Icon: Inbox },
  { id: "author", label: "Profil", Icon: User },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminShell({ user: initialUser }: { user: SessionUser }) {
  return (
    <FeedbackProvider>
      <Shell initialUser={initialUser} />
    </FeedbackProvider>
  );
}

function Shell({ initialUser }: { initialUser: SessionUser }) {
  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [loggingOut, setLoggingOut] = useState(false);

  const posts = useCollection<AdminPost>("/api/admin/posts");
  const categories = useCollection<AdminCategory>("/api/admin/categories");
  const tags = useCollection<AdminTag>("/api/admin/tags");
  const tracks = useCollection<AdminTrack>("/api/admin/tracks");
  const messages = useCollection<AdminMessage>("/api/admin/messages");
  const comments = useCollection<AdminComment>("/api/admin/comments");

  const unread = messages.items.filter((m) => !m.read).length;

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
    window.location.reload();
  };

  const stats = [
    { label: "Artikel terbit", value: posts.items.filter((p) => p.published).length, className: "bg-coral text-white", Icon: Newspaper },
    { label: "Draf", value: posts.items.filter((p) => !p.published).length, className: "bg-white text-black", Icon: Newspaper },
    { label: "Kategori", value: categories.items.length, className: "bg-yellow text-black", Icon: FolderHeart },
    { label: "Tag", value: tags.items.length, className: "bg-purple text-white", Icon: TagIcon },
    { label: "Lagu", value: tracks.items.length, className: "bg-orange text-black", Icon: Music },
    { label: "Komentar", value: comments.items.length, className: "bg-electric-blue text-white", Icon: MessageCircle },
    { label: "Pesan belum dibaca", value: unread, className: "bg-neon-green text-black", Icon: Inbox },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <aside className="lg:w-64 shrink-0 bg-white border-b-3 lg:border-b-0 lg:border-r-3 border-black flex flex-col justify-between p-4 lg:p-6 lg:h-screen lg:sticky lg:top-0">
        <div>
          <Link href="/" className="inline-flex items-center gap-1 text-[10px] font-mono font-black uppercase text-black/55 hover:text-black mb-2">
            <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Kembali ke Blog
          </Link>
          <p className="text-display text-lg font-black uppercase flex items-center gap-2 border-b-2 border-black pb-3 mt-1 text-black">
            <Sparkles className="h-5 w-5 text-coral shrink-0" aria-hidden="true" />
            Chronica CMS
          </p>

          <nav aria-label="Menu CMS" className="flex lg:flex-col gap-2 mt-4 lg:mt-6 overflow-x-auto pb-1">
            {TABS.map(({ id, label, Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 lg:gap-3 shrink-0 lg:w-full px-3 lg:px-4 py-2 lg:py-3 border-2 border-black rounded-lg text-xs font-black uppercase transition-all shadow-[2px_2px_0px_#000] cursor-pointer ${
                    active ? "bg-yellow text-black" : "bg-white text-black hover:bg-yellow/20"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                  {id === "messages" && unread > 0 && (
                    <span className="ml-auto bg-coral text-white rounded-full px-1.5 text-[10px]" aria-label={`${unread} belum dibaca`}>
                      {unread}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t-2 border-black pt-4 mt-4 flex lg:flex-col items-center lg:items-stretch gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element -- avatar may be any https host */}
            <img src={user.avatar} alt="" className="h-9 w-9 border-2 border-black rounded-full object-cover shrink-0" />
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-black truncate uppercase text-black">{user.name}</p>
              <p className="text-[10px] text-black/55 truncate">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center justify-center gap-1.5 py-2 px-3 border-2 border-black bg-coral text-white font-mono text-[10px] font-black uppercase rounded-lg shadow-[2px_2px_0px_#000] cursor-pointer disabled:opacity-60"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            {loggingOut ? "Keluar…" : "Keluar"}
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 sm:p-8">
        <h1 className="sr-only">{TABS.find((t) => t.id === activeTab)?.label}</h1>

        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4">
              {stats.map(({ label, value, className, Icon }) => (
                <div key={label} className={`border-3 border-black p-4 rounded-lg shadow-[4px_4px_0px_#000] flex flex-col justify-between h-32 ${className}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                  <div>
                    <p className="font-mono text-[10px] font-black uppercase tracking-wider opacity-90">{label}</p>
                    <p className="text-display text-3xl mt-1">{posts.loading ? "…" : value}</p>
                  </div>
                </div>
              ))}
            </div>
            <Panel title={`Selamat datang, ${user.name}`} className="bg-cream">
              <p className="font-semibold text-black/85 text-sm sm:text-base leading-relaxed max-w-3xl">
                Kelola artikel, kategori, tag, playlist musik, komentar, dan pesan dari pengunjung di sini. Artikel yang ditandai &ldquo;Terbitkan&rdquo; langsung tampil di
                situs; artikel draf hanya terlihat di CMS.
              </p>
            </Panel>
          </div>
        )}

        {activeTab === "posts" && <PostsTab posts={posts} categories={categories.items} tags={tags.items} />}
        {activeTab === "categories" && <CategoriesTab categories={categories} />}
        {activeTab === "tags" && <TagsTab tags={tags} />}
        {activeTab === "tracks" && <TracksTab tracks={tracks} />}
        {activeTab === "comments" && <CommentsTab comments={comments} />}
        {activeTab === "messages" && <MessagesTab messages={messages} />}
        {activeTab === "author" && <AuthorTab onProfileSaved={setUser} />}
      </main>
    </div>
  );
}
