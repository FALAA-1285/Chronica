"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Check, Edit2, Search, Trash2, X } from "lucide-react";

export const inputClass =
  "w-full p-2 border-2 border-black rounded bg-white text-black text-sm focus:bg-yellow/10 focus:outline-none focus-visible:outline-electric-blue";

/** Label wrapping its control, so the association never depends on ids. */
export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[10px] font-black uppercase text-black/60">{label}</span>
      {children}
      {hint && <span className="text-[10px] text-black/50">{hint}</span>}
    </label>
  );
}

export function Panel({ title, actions, children, className = "" }: { title?: string; actions?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`border-3 border-black bg-white p-5 rounded-lg shadow-[6px_6px_0px_#000] ${className}`}>
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/20 pb-3 mb-4">
          {title && <h2 className="text-display text-lg uppercase text-black">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function SubmitButton({ saving, children, className = "" }: { saving: boolean; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className={`px-4 py-2.5 border-2 border-black bg-yellow hover:bg-neon-green rounded shadow-[3px_3px_0px_#000] font-mono text-xs font-black uppercase cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-60 disabled:cursor-wait text-black ${className}`}
    >
      {saving ? "Menyimpan…" : children}
    </button>
  );
}

export function CancelEditButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="font-mono text-[10px] font-black uppercase px-2 py-1 bg-coral text-white rounded border border-black">
      Batal Edit
    </button>
  );
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <input
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-1.5 pl-8 border-2 border-black rounded font-mono text-xs font-bold text-black"
      />
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/55" aria-hidden="true" />
    </div>
  );
}

export function RowActions({ label, onEdit, onDelete }: { label: string; onEdit?: () => void; onDelete: () => void }) {
  const base = "p-1.5 border-2 border-black bg-white rounded shadow-[1px_1px_0px_#000] cursor-pointer text-black";
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {onEdit && (
        <button type="button" onClick={onEdit} className={`${base} hover:bg-yellow`} aria-label={`Edit ${label}`} title="Edit">
          <Edit2 className="h-3.5 w-3.5" />
        </button>
      )}
      <button type="button" onClick={onDelete} className={`${base} hover:bg-coral hover:text-white`} aria-label={`Hapus ${label}`} title="Hapus">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ListState({ loading, error, empty, onRetry }: { loading: boolean; error: string; empty: string; onRetry: () => void }) {
  if (loading) return <p className="text-xs font-bold text-black/60 text-center py-6">Memuat…</p>;
  if (error)
    return (
      <div className="text-center py-6">
        <p className="text-xs font-bold text-coral">{error}</p>
        <button type="button" onClick={onRetry} className="mt-2 text-xs font-black underline">
          Coba lagi
        </button>
      </div>
    );
  return <p className="text-xs font-bold text-black/60 italic text-center py-6">{empty}</p>;
}

// ---------- Toasts & confirmation dialog ----------

type Toast = { type: "success" | "error"; message: string };

interface FeedbackApi {
  notify: (type: Toast["type"], message: string) => void;
  confirm: (message: string, confirmLabel?: string) => Promise<boolean>;
}

const FeedbackContext = createContext<FeedbackApi | null>(null);

export function useFeedback(): FeedbackApi {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback must be used inside <FeedbackProvider>");
  return ctx;
}

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const [dialog, setDialog] = useState<{ message: string; confirmLabel: string; resolve: (ok: boolean) => void } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const confirmButton = useRef<HTMLButtonElement>(null);

  const notify = useCallback((type: Toast["type"], message: string) => {
    clearTimeout(timer.current);
    setToast({ type, message });
    timer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const confirm = useCallback(
    (message: string, confirmLabel = "Hapus") => new Promise<boolean>((resolve) => setDialog({ message, confirmLabel, resolve })),
    [],
  );

  const close = (ok: boolean) => {
    dialog?.resolve(ok);
    setDialog(null);
  };

  useEffect(() => {
    if (!dialog) return;
    confirmButton.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dialog.resolve(false);
        setDialog(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dialog]);

  return (
    <FeedbackContext.Provider value={{ notify, confirm }}>
      {children}

      <div aria-live="polite" className="fixed top-4 right-4 left-4 sm:left-auto z-[200] pointer-events-none">
        {toast && (
          <div
            role={toast.type === "error" ? "alert" : "status"}
            className={`ml-auto max-w-sm border-3 border-black p-4 rounded shadow-[4px_4px_0px_#000] font-bold text-sm flex items-center gap-2 ${
              toast.type === "success" ? "bg-neon-green text-black" : "bg-coral text-white"
            }`}
          >
            {toast.type === "success" ? <Check className="h-5 w-5 shrink-0" aria-hidden="true" /> : <X className="h-5 w-5 shrink-0" aria-hidden="true" />}
            <span>{toast.message}</span>
          </div>
        )}
      </div>

      {dialog && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4" onClick={() => close(false)}>
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-message"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md border-3 border-black bg-cream p-6 rounded-lg shadow-[8px_8px_0px_#000]"
          >
            <p id="confirm-message" className="font-bold text-black">
              {dialog.message}
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => close(false)} className="px-4 py-2 border-2 border-black bg-white rounded font-mono text-xs font-black uppercase">
                Batal
              </button>
              <button
                ref={confirmButton}
                type="button"
                onClick={() => close(true)}
                className="px-4 py-2 border-2 border-black bg-coral text-white rounded font-mono text-xs font-black uppercase shadow-[2px_2px_0px_#000]"
              >
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}
