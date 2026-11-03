"use client";

import React, { useEffect, useState } from "react";
import { Check, Copy, Heart, Share2 } from "lucide-react";
import { Button } from "./ui/Button";

const likedKey = (slug: string) => `liked:${slug}`;

/** Real like counter backed by Post.likes; one like per browser. */
export const LikeButton = ({ slug, initialLikes }: { slug: string; initialLikes: number }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
      setLiked(localStorage.getItem(likedKey(slug)) === "1");
    } catch {
      // storage unavailable (private mode): the server-side limit still applies
    }
  }, [slug]);

  const handleLike = async () => {
    if (liked || pending) return;
    setPending(true);
    setError("");
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(slug)}/like`, { method: "POST" });
      const data = await res.json();
      if (res.ok) setLikes(data.likes);
      else if (res.status !== 429) throw new Error(data.error);
      setLiked(true);
      try {
        localStorage.setItem(likedKey(slug), "1");
      } catch {
        // storage unavailable: the button just won't remember across visits
      }
    } catch {
      setError("Suka gagal disimpan. Silakan coba lagi.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="border-2 border-black bg-white p-5 rounded-md shadow-[4px_4px_0px_#0A0A0A]">
      <h4 className="font-mono text-xs font-black uppercase text-black/50 mb-3">Suka tulisan ini?</h4>
      <button
        type="button"
        onClick={handleLike}
        disabled={liked || pending}
        aria-pressed={liked}
        className={`flex items-center gap-2 px-4 py-2 border-2 border-black rounded font-mono text-sm font-black transition-all ${
          liked ? "bg-coral text-white" : "bg-white hover:bg-cream-dark text-black"
        } disabled:cursor-default`}
      >
        <Heart className={`h-4.5 w-4.5 ${liked ? "fill-white" : ""}`} aria-hidden="true" />
        <span>{liked ? "Disukai" : "Suka"}</span>
        <span className="opacity-80">· {likes}</span>
      </button>
      {error && (
        <p role="alert" className="mt-2 text-xs font-bold text-coral">
          {error}
        </p>
      )}
    </div>
  );
};

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (insecure context); nothing sensible to do.
    }
  };
  return { copied, copy };
}

export const ShareButtons = () => {
  const { copied, copy } = useCopy();

  return (
    <div className="border-2 border-black bg-white p-5 rounded-md shadow-[4px_4px_0px_#0A0A0A]">
      <h4 className="font-mono text-xs font-black uppercase text-black/50 mb-3">Bagikan Artikel</h4>
      <Button variant="primary" size="sm" onClick={() => copy(window.location.href)} className="w-full flex items-center justify-center gap-2">
        {copied ? <Check className="h-4.5 w-4.5" aria-hidden="true" /> : <Share2 className="h-4.5 w-4.5" aria-hidden="true" />}
        <span aria-live="polite">{copied ? "Tautan Tersalin!" : "Salin Tautan"}</span>
      </Button>
    </div>
  );
};

export const CopyCodeButton = ({ code }: { code: string }) => {
  const { copied, copy } = useCopy();

  return (
    <button
      type="button"
      onClick={() => copy(code)}
      className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center border border-black bg-white text-black rounded shadow-[1px_1px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-yellow transition-all"
      aria-label={copied ? "Tersalin" : "Salin kode"}
      title="Salin kode"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
};
