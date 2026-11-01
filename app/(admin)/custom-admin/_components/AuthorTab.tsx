"use client";

import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { SessionUser } from "@/lib/auth/session";
import { apiRequest } from "./api";
import { MediaUploader } from "./MediaUploader";
import { Field, inputClass, Panel, SubmitButton, useFeedback } from "./ui";

const EMPTY = { name: "", email: "", avatar: "", bio: "", twitter: "", github: "", linkedin: "", currentPassword: "", newPassword: "" };
type Profile = Omit<typeof EMPTY, "currentPassword" | "newPassword">;

export function AuthorTab({ onProfileSaved }: { onProfileSaved: (user: SessionUser) => void }) {
  const { notify } = useFeedback();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    apiRequest<Profile & { id: string }>("/api/admin/author")
      .then((author) =>
        setForm({
          ...EMPTY,
          name: author.name,
          email: author.email,
          avatar: author.avatar,
          bio: author.bio,
          twitter: author.twitter ?? "",
          github: author.github ?? "",
          linkedin: author.linkedin ?? "",
        }),
      )
      .catch((err: Error) => notify("error", err.message))
      .finally(() => setLoading(false));
  }, [notify]);

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const updated = await apiRequest<SessionUser>("/api/admin/author", { method: "PUT", body: form });
      onProfileSaved({ id: updated.id, name: updated.name, email: updated.email, avatar: updated.avatar });
      setForm((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
      notify("success", form.newPassword ? "Profil dan password diperbarui." : "Profil diperbarui.");
    } catch (err) {
      notify("error", err instanceof Error ? err.message : "Gagal memperbarui profil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="font-mono text-sm font-bold">Memuat profil…</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl flex flex-col gap-6">
      <Panel title="Profil Penulis" className="bg-cream">
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nama Lengkap">
              <input type="text" required maxLength={191} value={form.name} onChange={set("name")} className={`${inputClass} font-bold`} />
            </Field>
            <Field label="Email (untuk login)">
              <input type="email" required maxLength={191} autoComplete="username" value={form.email} onChange={set("email")} className={inputClass} />
            </Field>
          </div>

          <MediaUploader label="Foto Profil" kind="image" required value={form.avatar} onChange={(url) => setForm((prev) => ({ ...prev, avatar: url }))} />

          <Field label="Biografi">
            <textarea value={form.bio} maxLength={5000} onChange={set("bio")} className={`${inputClass} h-32 resize-y text-sm`} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Twitter (username)">
              <input type="text" value={form.twitter} onChange={set("twitter")} className={`${inputClass} font-mono text-xs`} />
            </Field>
            <Field label="GitHub (username)">
              <input type="text" value={form.github} onChange={set("github")} className={`${inputClass} font-mono text-xs`} />
            </Field>
            <Field label="LinkedIn (username)">
              <input type="text" value={form.linkedin} onChange={set("linkedin")} className={`${inputClass} font-mono text-xs`} />
            </Field>
          </div>
        </div>
      </Panel>

      <Panel title="Ganti Password (opsional)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Password Saat Ini">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={set("currentPassword")}
              required={!!form.newPassword}
              className={`${inputClass} font-mono`}
            />
          </Field>
          <Field label="Password Baru" hint="Minimal 8 karakter. Sesi di perangkat lain akan keluar.">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              minLength={8}
              value={form.newPassword}
              onChange={set("newPassword")}
              className={`${inputClass} font-mono`}
            />
          </Field>
        </div>
        <button type="button" onClick={() => setShowPassword((v) => !v)} className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] font-black uppercase underline">
          {showPassword ? <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
          {showPassword ? "Sembunyikan" : "Tampilkan"} password
        </button>
      </Panel>

      <SubmitButton saving={saving} className="w-full py-3.5 text-sm">
        Simpan Profil
      </SubmitButton>
    </form>
  );
}
