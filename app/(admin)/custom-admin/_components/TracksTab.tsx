"use client";

import React, { useState } from "react";
import { Music } from "lucide-react";
import type { Collection } from "./api";
import { MediaUploader } from "./MediaUploader";
import type { AdminTrack } from "./types";
import { useCrudForm } from "./useCrudForm";
import { CancelEditButton, Field, inputClass, ListState, Panel, RowActions, SearchBox, SubmitButton } from "./ui";

const EMPTY = { title: "", artist: "", audioUrl: "", coverUrl: "", duration: null as number | null };

export function TracksTab({ tracks }: { tracks: Collection<AdminTrack> }) {
  const [query, setQuery] = useState("");
  const crud = useCrudForm({
    collection: tracks,
    endpoint: "/api/admin/tracks",
    empty: EMPTY,
    noun: "Lagu",
    describe: (t: AdminTrack) => t.title,
    toForm: (t: AdminTrack) => ({ title: t.title, artist: t.artist, audioUrl: t.audioUrl, coverUrl: t.coverUrl ?? "", duration: t.duration }),
  });
  const { form, set, editingId } = crud;

  const q = query.trim().toLowerCase();
  const filtered = tracks.items.filter((t) => `${t.title} ${t.artist}`.toLowerCase().includes(q));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <Panel className="lg:col-span-5 bg-cream" title={editingId ? "Edit Lagu" : "Tambah Lagu"} actions={editingId && <CancelEditButton onClick={crud.reset} />}>
        <form onSubmit={crud.submit} className="flex flex-col gap-4">
          <Field label="Judul Lagu">
            <input type="text" required maxLength={191} value={form.title} onChange={(e) => set("title", e.target.value)} className={`${inputClass} font-bold`} />
          </Field>
          <Field label="Artis / Komposer">
            <input type="text" required maxLength={191} value={form.artist} onChange={(e) => set("artist", e.target.value)} className={inputClass} />
          </Field>
          <MediaUploader label="Berkas Audio" kind="audio" required value={form.audioUrl} onChange={(url) => set("audioUrl", url)} />
          <MediaUploader label="Cover Art (opsional)" kind="image" value={form.coverUrl} onChange={(url) => set("coverUrl", url)} />
          <Field label="Durasi (detik, opsional)" hint="Pemutar membaca durasi asli dari berkas audio.">
            <input
              type="number"
              min={1}
              value={form.duration ?? ""}
              onChange={(e) => set("duration", e.target.value ? Number(e.target.value) : null)}
              className={`${inputClass} font-mono text-xs`}
            />
          </Field>
          <SubmitButton saving={crud.saving} className="w-full">
            {editingId ? "Simpan Perubahan" : "Tambahkan ke Playlist"}
          </SubmitButton>
        </form>
      </Panel>

      <Panel className="lg:col-span-7" title={`Playlist (${tracks.items.length})`} actions={<SearchBox value={query} onChange={setQuery} placeholder="Cari lagu…" />}>
        {filtered.length > 0 ? (
          <ul className="max-h-[32rem] overflow-y-auto flex flex-col gap-3">
            {filtered.map((track) => (
              <li key={track.id} className="border-2 border-black bg-cream rounded-md p-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 border border-black bg-yellow rounded overflow-hidden shrink-0 flex items-center justify-center">
                    {track.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- small admin thumbnail of an arbitrary URL
                      <img src={track.coverUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Music className="h-5 w-5 text-black" aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-sm text-black truncate leading-tight">{track.title}</h3>
                    <span className="font-mono text-[10px] font-bold text-electric-blue uppercase mt-0.5 block truncate">{track.artist}</span>
                  </div>
                </div>
                <RowActions label={track.title} onEdit={() => crud.startEdit(track)} onDelete={() => crud.remove(track)} />
              </li>
            ))}
          </ul>
        ) : (
          <ListState loading={tracks.loading} error={tracks.error} onRetry={tracks.reload} empty={q ? "Lagu tidak ditemukan." : "Playlist masih kosong."} />
        )}
      </Panel>
    </div>
  );
}
