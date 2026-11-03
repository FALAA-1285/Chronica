"use client";

import React, { useRef, useState } from "react";
import { Bold, Code, Eye, EyeOff, Heading2, Heading3, Image as ImageIcon, Italic, Link as LinkIcon, List, ListOrdered } from "lucide-react";
import { slugify } from "@/lib/slug";
import { estimateReadingTime } from "@/lib/format";
import { MarkdownContent } from "@/app/(frontend)/_components/MarkdownContent";
import { apiRequest, type Collection } from "./api";
import { MediaUploader, uploadFile } from "./MediaUploader";
import type { AdminCategory, AdminPost, AdminPostDetail, AdminTag } from "./types";
import { CancelEditButton, Field, inputClass, ListState, Panel, RowActions, SearchBox, SubmitButton, useFeedback } from "./ui";

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  categoryId: "",
  readingTime: 0,
  featured: false,
  published: true,
  tags: [] as string[],
};

interface PostsTabProps {
  posts: Collection<AdminPost>;
  categories: AdminCategory[];
  tags: AdminTag[];
}

export function PostsTab({ posts, categories, tags }: PostsTabProps) {
  const { notify, confirm } = useFeedback();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [query, setQuery] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const set = <K extends keyof typeof EMPTY_FORM>(key: K, value: (typeof EMPTY_FORM)[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setSlugTouched(false);
    setPreview(false);
  };

  const startEdit = async (summary: AdminPost) => {
    if (loadingId) return;
    setLoadingId(summary.id);
    let post: AdminPostDetail;
    try {
      // The list omits the article body; load it only when editing.
      post = await apiRequest<AdminPostDetail>(`/api/admin/posts/${summary.id}`);
    } catch (err) {
      notify("error", err instanceof Error ? err.message : "Gagal memuat artikel.");
      return;
    } finally {
      setLoadingId(null);
    }
    setEditingId(post.id);
    setSlugTouched(true);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      categoryId: post.categoryId,
      readingTime: post.readingTime,
      featured: post.featured,
      published: post.published,
      tags: post.tags.map((t) => t.id),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const saved = await apiRequest<AdminPost>(editingId ? `/api/admin/posts/${editingId}` : "/api/admin/posts", {
        method: editingId ? "PUT" : "POST",
        body: form,
      });
      posts.upsert(saved);
      notify("success", editingId ? "Artikel berhasil diperbarui." : form.published ? "Artikel diterbitkan." : "Draf disimpan.");
      reset();
    } catch (err) {
      notify("error", err instanceof Error ? err.message : "Gagal menyimpan artikel.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post: AdminPost) => {
    if (!(await confirm(`Hapus artikel "${post.title}"? Tindakan ini tidak bisa dibatalkan.`))) return;
    try {
      await apiRequest(`/api/admin/posts/${post.id}`, { method: "DELETE" });
      posts.remove(post.id);
      if (editingId === post.id) reset();
      notify("success", "Artikel dihapus.");
    } catch (err) {
      notify("error", err instanceof Error ? err.message : "Gagal menghapus artikel.");
    }
  };

  /** Wraps the current selection (or inserts at the caret) and restores focus. */
  const insert = (before: string, after = "", placeholder = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end, value } = textarea;
    const selected = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    set("content", next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  /** Prefixes each selected line (lists, headings). */
  const prefixLines = (prefix: (index: number) => string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end, value } = textarea;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const block = value.slice(lineStart, end) || "";
    const replaced = block.split("\n").map((line, i) => prefix(i) + line).join("\n");
    set("content", value.slice(0, lineStart) + replaced + value.slice(end));
    requestAnimationFrame(() => textarea.focus());
  };

  const handleContentImage = async (file: File | undefined) => {
    if (!file) return;
    setImageUploading(true);
    try {
      const url = await uploadFile(file);
      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
      insert(`\n![${alt}](${url})\n`);
      notify("success", "Gambar disisipkan. Ubah teks di dalam [ ] untuk keterangan gambar.");
    } catch (err) {
      notify("error", err instanceof Error ? err.message : "Gagal mengunggah gambar.");
    } finally {
      setImageUploading(false);
    }
  };

  const tool = "p-1 px-2 border border-black rounded bg-white hover:bg-yellow text-black cursor-pointer shadow-[1px_1px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none";
  const q = query.trim().toLowerCase();
  const filtered = posts.items.filter((p) => p.title.toLowerCase().includes(q));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      <form onSubmit={handleSubmit} className="xl:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Panel
          className="lg:col-span-5 bg-cream"
          title={editingId ? "Edit Artikel" : "Tulis Artikel Baru"}
          actions={editingId && <CancelEditButton onClick={reset} />}
        >
          <div className="flex flex-col gap-4">
            <Field label="Judul Artikel">
              <input
                type="text"
                required
                maxLength={191}
                value={form.title}
                onChange={(e) => {
                  set("title", e.target.value);
                  if (!slugTouched) set("slug", slugify(e.target.value));
                }}
                className={`${inputClass} font-bold`}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Slug (URL)" hint="Huruf kecil, angka, tanda hubung">
                <input
                  type="text"
                  required
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  maxLength={191}
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", e.target.value);
                  }}
                  className={`${inputClass} font-mono text-xs`}
                />
              </Field>
              <Field label="Waktu Baca (menit)" hint={`Kosong/0 = otomatis (~${estimateReadingTime(form.content)} mnt)`}>
                <input
                  type="number"
                  min={0}
                  max={600}
                  value={form.readingTime || ""}
                  onChange={(e) => set("readingTime", Number(e.target.value) || 0)}
                  className={`${inputClass} font-mono text-xs`}
                />
              </Field>
            </div>

            <Field label="Ringkasan (Excerpt)">
              <textarea value={form.excerpt} maxLength={1000} onChange={(e) => set("excerpt", e.target.value)} className={`${inputClass} h-20 resize-none text-xs`} />
            </Field>

            <MediaUploader label="Cover Image" kind="image" value={form.coverImage} onChange={(url) => set("coverImage", url)} />

            <Field label="Kategori">
              <select required value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={`${inputClass} font-bold text-xs cursor-pointer`}>
                <option value="">— Pilih kategori —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <fieldset className="flex flex-col gap-1">
              <legend className="font-mono text-[10px] font-black uppercase text-black/60 mb-1">Tag</legend>
              <div className="border-2 border-black bg-white rounded p-3 max-h-28 overflow-y-auto flex flex-wrap gap-2">
                {tags.length === 0 && <span className="text-xs text-black/50">Belum ada tag.</span>}
                {tags.map((tag) => {
                  const selected = form.tags.includes(tag.id);
                  return (
                    <button
                      type="button"
                      key={tag.id}
                      aria-pressed={selected}
                      onClick={() => set("tags", selected ? form.tags.filter((id) => id !== tag.id) : [...form.tags, tag.id])}
                      className={`font-mono text-[10px] font-black uppercase px-2 py-1 border rounded transition-all cursor-pointer ${
                        selected ? "bg-electric-blue text-white border-black" : "bg-cream-dark text-black border-black/20"
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-mono text-[10px] font-black uppercase">
                <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="h-4 w-4 accent-electric-blue" />
                Terbitkan
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-mono text-[10px] font-black uppercase">
                <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-yellow" />
                Featured
              </label>
            </div>

            <SubmitButton saving={saving} className="w-full">
              {editingId ? "Simpan Perubahan" : form.published ? "Terbitkan Artikel" : "Simpan Draf"}
            </SubmitButton>
          </div>
        </Panel>

        <Panel
          className="lg:col-span-7"
          title="Konten (Markdown)"
          actions={
            <button
              type="button"
              onClick={() => setPreview((v) => !v)}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] font-black uppercase px-2 py-1 border border-black bg-cream rounded shadow-[1px_1px_0px_#000] text-black hover:bg-yellow"
            >
              {preview ? <EyeOff className="h-3 w-3" aria-hidden="true" /> : <Eye className="h-3 w-3" aria-hidden="true" />}
              {preview ? "Kembali ke Editor" : "Pratinjau"}
            </button>
          }
        >
          {preview ? (
            <div className="border-2 border-dashed border-black bg-cream p-4 rounded max-h-[32rem] overflow-y-auto">
              {form.content ? <MarkdownContent content={form.content} /> : <p className="text-black/50 italic">Belum ada konten.</p>}
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#f4f4f0] border-2 border-black border-b-0 rounded-t" role="toolbar" aria-label="Format markdown">
                <button type="button" className={tool} onClick={() => prefixLines(() => "## ")} aria-label="Heading 2" title="Heading 2">
                  <Heading2 className="h-3.5 w-3.5" />
                </button>
                <button type="button" className={tool} onClick={() => prefixLines(() => "### ")} aria-label="Heading 3" title="Heading 3">
                  <Heading3 className="h-3.5 w-3.5" />
                </button>
                <button type="button" className={tool} onClick={() => insert("**", "**", "teks tebal")} aria-label="Tebal" title="Tebal">
                  <Bold className="h-3.5 w-3.5" />
                </button>
                <button type="button" className={tool} onClick={() => insert("*", "*", "teks miring")} aria-label="Miring" title="Miring">
                  <Italic className="h-3.5 w-3.5" />
                </button>
                <button type="button" className={tool} onClick={() => prefixLines(() => "- ")} aria-label="Daftar berpoin" title="Daftar berpoin">
                  <List className="h-3.5 w-3.5" />
                </button>
                <button type="button" className={tool} onClick={() => prefixLines((i) => `${i + 1}. `)} aria-label="Daftar bernomor" title="Daftar bernomor">
                  <ListOrdered className="h-3.5 w-3.5" />
                </button>
                <button type="button" className={tool} onClick={() => insert("[", "](https://)", "teks tautan")} aria-label="Tautan" title="Tautan">
                  <LinkIcon className="h-3.5 w-3.5" />
                </button>
                <button type="button" className={tool} onClick={() => insert("\n```\n", "\n```\n", "kode")} aria-label="Blok kode" title="Blok kode">
                  <Code className="h-3.5 w-3.5" />
                </button>

                <span className="w-px h-5 bg-black/20 mx-1" aria-hidden="true" />

                <label className={`${tool} relative flex items-center gap-1 text-[10px] font-mono font-black uppercase bg-yellow ${imageUploading ? "opacity-60" : ""}`}>
                  <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  {imageUploading ? "Mengunggah…" : "Unggah Gambar"}
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.gif"
                    disabled={imageUploading}
                    onChange={(e) => {
                      handleContentImage(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                    className="sr-only"
                  />
                </label>
                <button type="button" className={`${tool} text-[10px] font-mono font-black uppercase`} onClick={() => setImageUrlInput("")}>
                  Gambar via URL
                </button>
              </div>

              {imageUrlInput !== null && (
                <div className="flex gap-2 p-2 border-2 border-black border-b-0 bg-cream">
                  <input
                    type="url"
                    autoFocus
                    aria-label="URL gambar"
                    placeholder="https://…"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className={`${inputClass} text-xs font-mono`}
                  />
                  <button
                    type="button"
                    disabled={!imageUrlInput.startsWith("https://")}
                    onClick={() => {
                      insert(`\n![Keterangan gambar](${imageUrlInput})\n`);
                      setImageUrlInput(null);
                    }}
                    className="px-3 border-2 border-black bg-neon-green rounded font-mono text-[10px] font-black uppercase disabled:opacity-50"
                  >
                    Sisipkan
                  </button>
                  <button type="button" onClick={() => setImageUrlInput(null)} className="px-3 border-2 border-black bg-white rounded font-mono text-[10px] font-black uppercase">
                    Batal
                  </button>
                </div>
              )}

              <textarea
                required
                ref={textareaRef}
                aria-label="Konten artikel"
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                className="w-full border-2 border-black bg-cream-dark p-3 rounded-b font-mono text-xs h-[28rem] text-black focus:outline-none"
                placeholder={"## Judul Bagian\n\nTulis paragraf di sini. **Tebal**, *miring*, [tautan](https://…).\n\n- poin satu\n- poin dua"}
              />
            </div>
          )}
        </Panel>
      </form>

      <Panel className="xl:col-span-12" title={`Daftar Artikel (${posts.items.length})`} actions={<SearchBox value={query} onChange={setQuery} placeholder="Cari artikel…" />}>
        {filtered.length > 0 ? (
          <ul className="max-h-[28rem] overflow-y-auto flex flex-col gap-3">
            {filtered.map((post) => (
              <li key={post.id} className="border-2 border-black bg-cream rounded-md p-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-black text-sm text-black truncate">{post.title}</h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className="font-mono text-[9px] font-black uppercase px-1.5 py-0.5 border border-black bg-yellow rounded text-black">{post.category.name}</span>
                    {!post.published && (
                      <span className="font-mono text-[9px] font-black uppercase px-1.5 py-0.5 border border-black bg-white rounded text-black">Draf</span>
                    )}
                    {post.featured && <span className="font-mono text-[9px] font-black uppercase px-1.5 py-0.5 border border-black bg-coral text-white rounded">Featured</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {post.published && (
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] font-black underline mr-2">
                      Lihat
                    </a>
                  )}
                  <RowActions label={post.title} onEdit={() => startEdit(post)} onDelete={() => handleDelete(post)} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ListState loading={posts.loading} error={posts.error} onRetry={posts.reload} empty={q ? "Artikel tidak ditemukan." : "Belum ada artikel."} />
        )}
      </Panel>
    </div>
  );
}
