"use client";

import React, { useState } from "react";
import { Check, Send } from "lucide-react";
import { Button } from "../_components/ui/Button";
import { Input } from "../_components/ui/Input";

const EMPTY = { name: "", email: "", subject: "", message: "", website: "" };
const labelClass = "block font-mono text-xs font-black uppercase text-black/60 mb-2";

export function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const update = (field: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Your message could not be sent.");
      }
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your message could not be sent.");
      setStatus("idle");
    }
  };

  if (status === "sent") {
    return (
      <div className="py-12 text-center flex flex-col items-center" role="status">
        <div className="flex h-16 w-16 items-center justify-center border-2 border-black bg-neon-green text-black shadow-[3px_3px_0px_#0A0A0A] rounded-full mb-6">
          <Check className="h-8 w-8" aria-hidden="true" />
        </div>
        <h3 className="text-display text-2xl uppercase text-black">Message Sent!</h3>
        <p className="font-bold text-black/60 text-sm max-w-xs mx-auto mt-2 leading-relaxed">
          Thank you, {form.name}. Your message has been delivered to the editor&apos;s inbox.
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-6"
          onClick={() => {
            setForm(EMPTY);
            setStatus("idle");
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="contact-name" className={labelClass}>Your Full Name</label>
        <Input id="contact-name" type="text" autoComplete="name" maxLength={191} value={form.name} onChange={update("name")} required className="text-sm" />
      </div>
      <div>
        <label htmlFor="contact-email" className={labelClass}>Your Email Address</label>
        <Input id="contact-email" type="email" autoComplete="email" maxLength={191} value={form.email} onChange={update("email")} required className="text-sm" />
      </div>
      <div>
        <label htmlFor="contact-subject" className={labelClass}>Subject (optional)</label>
        <Input id="contact-subject" type="text" maxLength={191} value={form.subject} onChange={update("subject")} className="text-sm" />
      </div>
      <div>
        <label htmlFor="contact-message" className={labelClass}>Your Message</label>
        <textarea
          id="contact-message"
          value={form.message}
          onChange={update("message")}
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          className="w-full px-4 py-3 bg-white text-black font-semibold border-2 border-black rounded-md shadow-[2px_2px_0px_#0A0A0A] placeholder-black/50 transition-all focus:outline-none focus:shadow-[4px_4px_0px_#0A0A0A] text-sm"
        />
      </div>

      {/* Honeypot: hidden from people, filled in by bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} />
      </div>

      {error && (
        <p role="alert" className="border-2 border-black bg-coral text-white font-bold text-sm px-4 py-3 rounded">
          {error}
        </p>
      )}

      <Button type="submit" variant="neon" size="lg" disabled={status === "sending"} className="w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-60">
        <span>{status === "sending" ? "Sending…" : "Send Message"}</span>
        <Send className="h-5 w-5" aria-hidden="true" />
      </Button>
    </form>
  );
}
