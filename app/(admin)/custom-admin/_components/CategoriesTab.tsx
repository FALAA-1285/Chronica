"use client";

import React, { useState } from "react";
import { slugify } from "@/lib/slug";
import { CATEGORY_ICONS } from "@/lib/constants";
import { CategoryIcon } from "@/app/(frontend)/_components/CategoryIcon";
import type { Collection } from "./api";
import type { AdminCategory } from "./types";
import { useCrudForm } from "./useCrudForm";
import { CancelEditButton, Field, inputClass, ListState, Panel, RowActions, SearchBox, SubmitButton } from "./ui";

const EMPTY = { name: "", slug: "", description: "", color: "#0A0A0A", bgColor: "#FFE500", icon: "BookOpen" };

export function CategoriesTab({ categories }: { categories: Collection<AdminCategory> }) {
  const [query, setQuery] = useState("");
  const crud = useCrudForm({
    collection: categories,
    endpoint: "/api/admin/categories",
    empty: EMPTY,
    noun: "Kategori",
    describe: (c: AdminCategory) => c.name,
    toForm: ({ name, slug, description, color, bgColor, icon }: AdminCategory) => ({ name, slug, description, color, bgColor, icon }),
  });
  const { form, set, editingId } = crud;

  const q = query.trim().toLowerCase();
  const filtered = categories.items.filter((c) => c.name.toLowerCase().includes(q));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <Panel className="lg:col-span-5 bg-cream" title={editingId ? "Edit Kategori" : "Tambah Kategori"} actions={editingId && <CancelEditButton onClick={crud.reset} />}>
        <form onSubmit={crud.submit} className="flex flex-col gap-4">
          <Field label="Nama Kategori">
            <input
              type="text"
              required
              maxLength={191}
              value={form.name}
              onChange={(e) => {
                set("name", e.target.value);
                if (!editingId) set("slug", slugify(e.target.value));
              }}
              className={`${inputClass} font-bold`}
            />
          </Field>
          <Field label="Slug (URL)">
            <input type="text" required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={(e) => set("slug", e.target.value)} className={`${inputClass} font-mono text-xs`} />
          </Field>
          <Field label="Deskripsi">
            <textarea value={form.description} maxLength={1000} onChange={(e) => set("description", e.target.value)} className={`${inputClass} h-20 resize-none text-xs`} />
          </Field>
          <div className="grid grid-cols-3 gap-2">
            <Field label="Warna Teks">
              <input type="color" value={form.color} onChange={(e) => set("color", e.target.value)} className="w-full h-9 border-2 border-black rounded cursor-pointer" />
            </Field>
            <Field label="Warna Latar">
              <input type="color" value={form.bgColor} onChange={(e) => set("bgColor", e.target.value)} className="w-full h-9 border-2 border-black rounded cursor-pointer" />
            </Field>
            <Field label="Ikon">
              <select value={form.icon} onChange={(e) => set("icon", e.target.value)} className="h-9 border-2 border-black rounded font-mono text-[10px] font-bold cursor-pointer bg-white">
                {CATEGORY_ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex items-center gap-3 border-2 border-black rounded p-3" style={{ backgroundColor: form.bgColor, color: form.color }} aria-label="Pratinjau warna">
            <CategoryIcon name={form.icon} className="h-5 w-5" />
            <span className="font-black uppercase text-sm">{form.name || "Pratinjau"}</span>
          </div>

          <SubmitButton saving={crud.saving} className="w-full">
            {editingId ? "Simpan Perubahan" : "Buat Kategori"}
          </SubmitButton>
        </form>
      </Panel>

      <Panel className="lg:col-span-7" title={`Daftar Kategori (${categories.items.length})`} actions={<SearchBox value={query} onChange={setQuery} placeholder="Cari kategori…" />}>
        {filtered.length > 0 ? (
          <ul className="max-h-[32rem] overflow-y-auto flex flex-col gap-3">
            {filtered.map((cat) => (
              <li key={cat.id} className="border-2 border-black bg-cream rounded-md p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-4 w-4 border border-black rounded-full" style={{ backgroundColor: cat.bgColor }} aria-hidden="true" />
                    <h3 className="font-black text-sm text-black uppercase tracking-wide">{cat.name}</h3>
                    <span className="font-mono text-[10px] text-black/60">{cat._count.posts} artikel</span>
                  </div>
                  {cat.description && <p className="text-xs text-black/70 font-semibold mt-1 line-clamp-2">{cat.description}</p>}
                </div>
                <RowActions
                  label={cat.name}
                  onEdit={() => crud.startEdit(cat)}
                  onDelete={() => crud.remove(cat, cat._count.posts > 0 ? `Kategori ini masih dipakai ${cat._count.posts} artikel dan tidak bisa dihapus sebelum artikelnya dipindahkan.` : "")}
                />
              </li>
            ))}
          </ul>
        ) : (
          <ListState loading={categories.loading} error={categories.error} onRetry={categories.reload} empty={q ? "Kategori tidak ditemukan." : "Belum ada kategori."} />
        )}
      </Panel>
    </div>
  );
}
