"use client";

import React, { useId, useState } from "react";
import { Upload } from "lucide-react";
import { apiRequest } from "./api";
import { useFeedback } from "./ui";

const KINDS = {
  image: { accept: ".jpg,.jpeg,.png,.webp,.gif", hint: "JPG, PNG, WEBP, GIF · maks. 5 MB" },
  audio: { accept: ".mp3,.wav,.ogg,.m4a", hint: "MP3, WAV, OGG, M4A · maks. 25 MB" },
};

export async function uploadFile(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const { url } = await apiRequest<{ url: string }>("/api/admin/upload", { method: "POST", body });
  return url;
}

interface MediaUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  kind: keyof typeof KINDS;
  required?: boolean;
}

export function MediaUploader({ label, value, onChange, kind, required }: MediaUploaderProps) {
  const { notify } = useFeedback();
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileId = useId();
  const urlId = useId();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      onChange(await uploadFile(file));
      notify("success", "Berkas berhasil diunggah.");
    } catch (err) {
      notify("error", err instanceof Error ? err.message : "Gagal mengunggah berkas.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <span className="font-mono text-[10px] font-black uppercase text-black/60">{label}</span>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`border-3 border-dashed rounded-lg p-4 text-center relative flex flex-col items-center justify-center gap-1 ${
          isDragOver ? "border-yellow bg-yellow/10" : "border-black bg-cream/40 hover:bg-cream-dark"
        }`}
      >
        <input
          id={fileId}
          type="file"
          accept={KINDS[kind].accept}
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          disabled={uploading}
          aria-label={`Unggah ${label}`}
        />
        <Upload className="h-5 w-5 text-black/75" aria-hidden="true" />
        <span className="font-mono text-[10px] font-black uppercase text-black">
          {uploading ? "Mengunggah…" : (
            <>
              Seret berkas ke sini atau <span className="text-coral underline">pilih berkas</span>
            </>
          )}
        </span>
        <span className="text-[10px] text-black/50 font-mono">{KINDS[kind].hint}</span>
      </div>

      <label htmlFor={urlId} className="sr-only">
        URL {label}
      </label>
      <input
        id={urlId}
        type="text"
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border-2 border-black rounded bg-white text-black font-mono text-xs w-full"
        placeholder="https://… atau /uploads/…"
      />

      {value && !uploading && (
        <div className="border-2 border-black bg-white rounded p-2 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-black uppercase text-black/60">Pratinjau</span>
            <button type="button" onClick={() => onChange("")} className="font-mono text-[9px] font-black text-coral uppercase hover:underline">
              Kosongkan
            </button>
          </div>
          {kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element -- preview of an arbitrary URL
            <img src={value} alt="" className="h-28 w-full object-cover border border-black/10 rounded bg-cream-dark" />
          ) : (
            <audio src={value} controls preload="none" className="w-full h-8" />
          )}
        </div>
      )}
    </div>
  );
}
