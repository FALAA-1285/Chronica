"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { apiRequest, type Collection } from "./api";
import type { AdminComment } from "./types";
import { ListState, Panel, RowActions, useFeedback } from "./ui";

const dateTime = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" });

export function CommentsTab({ comments }: { comments: Collection<AdminComment> }) {
  const { notify, confirm } = useFeedback();

  const toggleApproved = async (comment: AdminComment) => {
    try {
      comments.upsert(
        await apiRequest<AdminComment>(`/api/admin/comments/${comment.id}`, { method: "PATCH", body: { approved: !comment.approved } }),
      );
      notify("success", comment.approved ? "Komentar disembunyikan." : "Komentar ditampilkan.");
    } catch (err) {
      notify("error", err instanceof Error ? err.message : "Gagal memperbarui komentar.");
    }
  };

  const remove = async (comment: AdminComment) => {
    if (!(await confirm(`Hapus komentar dari ${comment.name}?`))) return;
    try {
      await apiRequest(`/api/admin/comments/${comment.id}`, { method: "DELETE" });
      comments.remove(comment.id);
      notify("success", "Komentar dihapus.");
    } catch (err) {
      notify("error", err instanceof Error ? err.message : "Gagal menghapus komentar.");
    }
  };

  const hidden = comments.items.filter((c) => !c.approved).length;

  return (
    <Panel title={`Komentar (${comments.items.length}${hidden ? ` · ${hidden} disembunyikan` : ""})`}>
      {comments.items.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {comments.items.map((c) => (
            <li key={c.id} className={`border-2 border-black rounded-md p-4 ${c.approved ? "bg-white" : "bg-black/5 opacity-75"}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-black text-sm text-black">
                    {c.name}
                    {!c.approved && <span className="ml-2 font-mono text-[10px] uppercase bg-black text-white px-1.5 py-0.5 rounded">Disembunyikan</span>}
                  </h3>
                  <p className="text-xs text-black/70 mt-0.5">
                    <a href={`mailto:${c.email}`} className="underline">
                      {c.email}
                    </a>{" "}
                    · <time dateTime={c.createdAt}>{dateTime.format(new Date(c.createdAt))}</time> · pada{" "}
                    <a href={`/blog/${c.post.slug}`} target="_blank" rel="noreferrer" className="underline font-bold">
                      {c.post.title}
                    </a>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleApproved(c)}
                    className="p-1.5 border-2 border-black bg-white hover:bg-yellow rounded shadow-[1px_1px_0px_#000] text-black"
                    aria-label={c.approved ? "Sembunyikan komentar" : "Tampilkan komentar"}
                    title={c.approved ? "Sembunyikan komentar" : "Tampilkan komentar"}
                  >
                    {c.approved ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                  <RowActions label={`komentar dari ${c.name}`} onDelete={() => remove(c)} />
                </div>
              </div>
              <p className="text-sm text-black/85 mt-3 whitespace-pre-line break-words">{c.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <ListState loading={comments.loading} error={comments.error} onRetry={comments.reload} empty="Belum ada komentar dari pembaca." />
      )}
    </Panel>
  );
}
