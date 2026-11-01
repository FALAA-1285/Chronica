"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login gagal.");
      }
      // The httpOnly session cookie is set; re-render the server page.
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal.");
      setLoading(false);
    }
  };

  const inputClass = "p-3 border-3 border-black rounded-lg bg-cream font-bold text-sm focus:bg-yellow/10 focus:outline-none text-black";

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <form onSubmit={handleLogin} className="border-4 border-black bg-white p-8 rounded-xl shadow-[8px_8px_0px_#000] max-w-md w-full flex flex-col gap-6">
        <div className="text-center border-b-4 border-black pb-4 mb-2">
          <h1 className="text-2xl font-black tracking-tight uppercase flex items-center justify-center gap-2 text-black">
            <Sparkles className="h-6 w-6 text-coral" aria-hidden="true" />
            <span>Chronica CMS</span>
          </h1>
          <p className="text-xs font-bold text-black/60 uppercase mt-1">Halaman khusus administrator</p>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] font-black uppercase text-black/60">Email</span>
          <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] font-black uppercase text-black/60">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </label>

        {error && (
          <p role="alert" className="border-2 border-black bg-coral text-white font-bold text-sm px-4 py-3 rounded">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 border-3 border-black bg-yellow hover:bg-neon-green text-black font-black uppercase rounded-lg shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-sm disabled:opacity-60"
        >
          {loading ? "Memeriksa…" : "Masuk ke CMS →"}
        </button>
      </form>
    </main>
  );
}
