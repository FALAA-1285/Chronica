"use client";

import React from "react";
import { Mail, MailOpen } from "lucide-react";
import { apiRequest, type Collection } from "./api";
import type { AdminMessage } from "./types";
import { ListState, Panel, RowActions, useFeedback } from "./ui";

const dateTime = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" });

export function MessagesTab({ messages }: { messages: Collection<AdminMessage> }) {
  const { notify, confirm } = useFeedback();

  const toggleRead = async (message: AdminMessage) => {
    try {
      messages.upsert(await apiRequest<AdminMessage>(`/api/admin/messages/${message.id}`, { method: "PATCH", body: { read: !message.read } }));
    } catch (err) {
      notify("error", err instanceof Error ? err.message : "Gagal memperbarui pesan.");
    }
  };

  const remove = async (message: AdminMessage) => {
    if (!(await confirm(`Hapus pesan dari ${message.name}?`))) return;
    try {
      await apiRequest(`/api/admin/messages/${message.id}`, { method: "DELETE" });
      messages.remove(message.id);
      notify("success", "Pesan dihapus.");
    } catch (err) {
      notify("error", err instanceof Error ? err.message : "Gagal menghapus pesan.");
    }
  };

  const unread = messages.items.filter((m) => !m.read).length;

  return (
    <Panel title={`Pesan Masuk (${messages.items.length}${unread ? ` · ${unread} belum dibaca` : ""})`}>
      {messages.items.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {messages.items.map((m) => (
            <li key={m.id} className={`border-2 border-black rounded-md p-4 ${m.read ? "bg-white" : "bg-yellow/20"}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-black text-sm text-black">
                    {!m.read && <span className="sr-only">Belum dibaca: </span>}
                    {m.subject || "(tanpa subjek)"}
                  </h3>
                  <p className="text-xs text-black/70 mt-0.5">
                    {m.name} ·{" "}
                    <a href={`mailto:${m.email}`} className="underline">
                      {m.email}
                    </a>{" "}
                    · <time dateTime={m.createdAt}>{dateTime.format(new Date(m.createdAt))}</time>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleRead(m)}
                    className="p-1.5 border-2 border-black bg-white hover:bg-yellow rounded shadow-[1px_1px_0px_#000] text-black"
                    aria-label={m.read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                    title={m.read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                  >
                    {m.read ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                  </button>
                  <RowActions label={`pesan dari ${m.name}`} onDelete={() => remove(m)} />
                </div>
              </div>
              <p className="text-sm text-black/85 mt-3 whitespace-pre-line">{m.message}</p>
            </li>
          ))}
        </ul>
      ) : (
        <ListState loading={messages.loading} error={messages.error} onRetry={messages.reload} empty="Belum ada pesan dari pengunjung." />
      )}
    </Panel>
  );
}
