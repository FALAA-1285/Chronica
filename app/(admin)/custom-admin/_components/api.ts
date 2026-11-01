"use client";

import { useCallback, useEffect, useState } from "react";

export class RequestError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** fetch() wrapper: JSON in/out, throws RequestError with the API's message. */
export async function apiRequest<T>(url: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const isForm = init.body instanceof FormData;
  const res = await fetch(url, {
    method: init.method ?? "GET",
    headers: init.body && !isForm ? { "Content-Type": "application/json" } : undefined,
    body: init.body === undefined ? undefined : isForm ? (init.body as FormData) : JSON.stringify(init.body),
  });

  if (res.status === 401) {
    // Session expired or revoked: reload to show the login form.
    window.location.reload();
    throw new RequestError(401, "Sesi berakhir. Silakan login ulang.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new RequestError(res.status, data.error || `Permintaan gagal (HTTP ${res.status}).`);
  return data as T;
}

export interface Collection<T extends { id: string }> {
  items: T[];
  loading: boolean;
  error: string;
  reload: () => void;
  upsert: (item: T) => void;
  remove: (id: string) => void;
}

/** Loads a list from an admin endpoint and keeps it in local state. */
export function useCollection<T extends { id: string }>(url: string): Collection<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    apiRequest<T[]>(url)
      .then((data) => {
        if (cancelled) return;
        setItems(data);
        setError("");
      })
      .catch((err: Error) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [url, version]);

  const upsert = useCallback((item: T) => {
    setItems((prev) => (prev.some((p) => p.id === item.id) ? prev.map((p) => (p.id === item.id ? item : p)) : [item, ...prev]));
  }, []);
  const remove = useCallback((id: string) => setItems((prev) => prev.filter((p) => p.id !== id)), []);
  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return { items, loading, error, reload, upsert, remove };
}
