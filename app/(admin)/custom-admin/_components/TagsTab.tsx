"use client";

import React, { useState } from "react";
import { slugify } from "@/lib/slug";
import type { Collection } from "./api";
import type { AdminTag } from "./types";
import { useCrudForm } from "./useCrudForm";
import { CancelEditButton, Field, inputClass, ListState, Panel, RowActions, SearchBox, SubmitButton } from "./ui";

const EMPTY = { name: "", slug: "", color: "#7B2FBE" };

export function TagsTab({ tags }: { tags: Collection<AdminTag> }) {
  const [query, setQuery] = useState("");
  const crud = useCrudForm({
    collection: tags,
    endpoint: "/api/admin/tags",
    empty: EMPTY,
    noun: "Tag",
    describe: (t: AdminTag) => t.name,
    toForm: ({ name, slug, color }: AdminTag) => ({ name, slug, color }),
  });
  const { form, set, editingId } = crud;

  const q = query.trim().toLowerCase();
  const filtered = tags.items.filter((t) => t.name.toLowerCase().includes(q));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <Panel className="lg:col-span-5 bg-cream" title={editingId ? "Edit Tag" : "Tambah Tag"} actions={editingId && <CancelEditButton onClick={crud.reset} />}>
        <form onSubmit={crud.submit} className="flex flex-col gap-4">
          <Field label="Nama Tag">
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
          <Field label="Warna Tag">
            <input type="color" value={form.color} onChange={(e) => set("color", e.target.value)} className="w-full h-10 border-2 border-black rounded cursor-pointer bg-white" />
          </Field>
          <SubmitButton saving={crud.saving} className="w-full">
            {editingId ? "Simpan Perubahan" : "Buat Tag"}
          </SubmitButton>
        </form>
      </Panel>

      <Panel className="lg:col-span-7" title={`Daftar Tag (${tags.items.length})`} actions={<SearchBox value={query} onChange={setQuery} placeholder="Cari tag…" />}>
        {filtered.length > 0 ? (
          <ul className="flex flex-wrap gap-3 max-h-[28rem] overflow-y-auto p-1">
            {filtered.map((tag) => (
              <li key={tag.id} className="border-2 border-black bg-cream p-2.5 rounded-md flex items-center gap-3 shadow-[2px_2px_0px_#000]">
                <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black rounded text-white" style={{ backgroundColor: tag.color }}>
                  {tag.name}
                </span>
                <RowActions label={tag.name} onEdit={() => crud.startEdit(tag)} onDelete={() => crud.remove(tag, "Tag akan dilepas dari semua artikel, artikelnya tetap ada.")} />
              </li>
            ))}
          </ul>
        ) : (
          <ListState loading={tags.loading} error={tags.error} onRetry={tags.reload} empty={q ? "Tag tidak ditemukan." : "Belum ada tag."} />
        )}
      </Panel>
    </div>
  );
}
