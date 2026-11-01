"use client";

import React, { useState } from "react";
import { apiRequest, type Collection } from "./api";
import { useFeedback } from "./ui";

interface CrudOptions<TItem extends { id: string }, TForm> {
  collection: Collection<TItem>;
  /** e.g. "/api/admin/tags" */
  endpoint: string;
  empty: TForm;
  toForm: (item: TItem) => TForm;
  /** Singular noun used in messages, e.g. "Tag" */
  noun: string;
  describe: (item: TItem) => string;
}

/** Shared create/edit/delete state for the simple CMS tabs. */
export function useCrudForm<TItem extends { id: string }, TForm>(options: CrudOptions<TItem, TForm>) {
  const { collection, endpoint, empty, toForm, noun, describe } = options;
  const { notify, confirm } = useFeedback();
  const [form, setForm] = useState<TForm>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof TForm>(key: K, value: TForm[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setForm(empty);
    setEditingId(null);
  };

  const startEdit = (item: TItem) => {
    setEditingId(item.id);
    setForm(toForm(item));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const saved = await apiRequest<TItem>(editingId ? `${endpoint}/${editingId}` : endpoint, {
        method: editingId ? "PUT" : "POST",
        body: form,
      });
      collection.upsert(saved);
      notify("success", `${noun} berhasil ${editingId ? "diperbarui" : "ditambahkan"}.`);
      reset();
    } catch (err) {
      notify("error", err instanceof Error ? err.message : `Gagal menyimpan ${noun.toLowerCase()}.`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: TItem, warning = "") => {
    if (!(await confirm(`Hapus ${noun.toLowerCase()} "${describe(item)}"?${warning ? ` ${warning}` : ""}`))) return;
    try {
      await apiRequest(`${endpoint}/${item.id}`, { method: "DELETE" });
      collection.remove(item.id);
      if (editingId === item.id) reset();
      notify("success", `${noun} dihapus.`);
    } catch (err) {
      notify("error", err instanceof Error ? err.message : `Gagal menghapus ${noun.toLowerCase()}.`);
    }
  };

  return { form, set, editingId, saving, submit, startEdit, reset, remove };
}
