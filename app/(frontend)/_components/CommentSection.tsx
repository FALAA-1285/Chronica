"use client";

import React, { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import type { PublicComment } from "@/lib/comments";
import { formatDate } from "@/lib/format";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

const EMPTY = { name: "", email: "", content: "", website: "" };
const labelClass = "block font-mono text-xs font-black uppercase text-black/60 mb-2";
const AVATAR_COLORS = ["bg-yellow", "bg-neon-green", "bg-coral text-white", "bg-purple text-white", "bg-orange", "bg-electric-blue text-white"];

function avatarColor(name: string) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function CommentSection({ slug, initialComments }: { slug: string; initialComments: PublicComment[] }) {
  const [comments, setComments] = useState(initialComments);
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (field: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(slug)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Komentar gagal dikirim.");
      setComments((prev) => [...prev, data as PublicComment]);
      // Keep name/email so returning commenters don't retype them.
      setForm((prev) => ({ ...prev, content: "", website: "" }));
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Komentar gagal dikirim.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section aria-labelledby="comments-heading" className="mt-16 border-t-3 border-black pt-10">
      <h2 id="comments-heading" className="text-display text-2xl sm:text-3xl uppercase text-black flex items-center gap-3 mb-8">
        <MessageCircle className="h-7 w-7" aria-hidden="true" />
        Komentar ({comments.length})
      </h2>

      {comments.length > 0 ? (
        <ul className="flex flex-col gap-4 mb-10">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3 border-2 border-black bg-white p-4 rounded-md shadow-[3px_3px_0px_#0A0A0A]">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black rounded-full font-black uppercase ${avatarColor(c.name)}`}
                aria-hidden="true"
              >
                {c.name.trim().charAt(0) || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-black text-sm text-black break-words">{c.name}</span>
                  <time dateTime={c.createdAt} className="font-mono text-[10px] text-black/50 uppercase">
                    {formatDate(c.createdAt)}
                  </time>
                </p>
                <p className="text-sm text-black/85 mt-1.5 whitespace-pre-line break-words leading-relaxed">{c.content}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="font-bold text-black/60 text-sm mb-10">Belum ada komentar. Jadilah yang pertama!</p>
      )}

      <div className="border-2 border-black bg-cream p-5 sm:p-6 rounded-md shadow-[4px_4px_0px_#0A0A0A]">
        <h3 className="font-mono text-xs font-black uppercase tracking-wider text-black/60 mb-5">Tulis Komentar</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="comment-name" className={labelClass}>Nama</label>
              <Input id="comment-name" autoComplete="name" maxLength={191} value={form.name} onChange={update("name")} required className="text-sm" />
            </div>
            <div>
              <label htmlFor="comment-email" className={labelClass}>Email (tidak dipublikasikan)</label>
              <Input id="comment-email" type="email" autoComplete="email" maxLength={191} value={form.email} onChange={update("email")} required className="text-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="comment-content" className={labelClass}>Komentar</label>
            <textarea
              id="comment-content"
              value={form.content}
              onChange={update("content")}
              required
              minLength={2}
              maxLength={2000}
              rows={4}
              className="w-full px-4 py-3 bg-white text-black font-semibold border-2 border-black rounded-md shadow-[2px_2px_0px_#0A0A0A] placeholder-black/50 transition-all focus:outline-none focus:shadow-[4px_4px_0px_#0A0A0A] text-sm"
            />
          </div>

          {/* Honeypot: hidden from people, filled in by bots. */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="comment-website">Website</label>
            <input id="comment-website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} />
          </div>

          {error && (
            <p role="alert" className="border-2 border-black bg-coral text-white font-bold text-sm px-4 py-3 rounded">
              {error}
            </p>
          )}
          {success && (
            <p role="status" className="border-2 border-black bg-neon-green text-black font-bold text-sm px-4 py-3 rounded">
              Terima kasih! Komentar Anda sudah terkirim.
            </p>
          )}

          <Button type="submit" variant="neon" size="lg" disabled={sending} className="self-start flex items-center gap-2 disabled:opacity-60">
            <span>{sending ? "Mengirim…" : "Kirim Komentar"}</span>
            <Send className="h-5 w-5" aria-hidden="true" />
          </Button>
        </form>
      </div>
    </section>
  );
}
