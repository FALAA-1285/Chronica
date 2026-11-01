"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Heart, Send } from "lucide-react";
import { Github, Twitter, Linkedin } from "./ui/Icons";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

export const Footer = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  if (pathname?.startsWith("/custom-admin")) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setEmail("");
    }, 3000);
  };

  return (
    <footer className="w-full border-t-3 border-black bg-cream-dark dark:border-cream dark:bg-dark-surface-2 pt-16 pb-8 transition-colors select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo Column */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center w-fit">
              <div className="flex h-12 items-center justify-center border-2 border-black bg-yellow px-4 font-mono text-xl font-black uppercase tracking-tight shadow-[3px_3px_0px_#000] dark:border-cream dark:shadow-[3px_3px_0px_#FFF] dark:text-black">
                <BookOpen className="mr-2 h-5 w-5" />
                <span>Chronica</span>
              </div>
            </Link>
            <p className="max-w-md font-semibold text-black/75 dark:text-cream/75 text-base mt-2">
              An experimental editorial blog exploring world history, geopolitical forces, classical literature, and ancient philosophy. Deeply chronicling human thought.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center border-2 border-black bg-neon-green text-black hover:-translate-y-1 shadow-[2px_2px_0px_#000] dark:border-cream dark:shadow-[2px_2px_0px_#FFF] transition-all"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center border-2 border-black bg-electric-blue text-white hover:-translate-y-1 shadow-[2px_2px_0px_#000] dark:border-cream dark:shadow-[2px_2px_0px_#FFF] transition-all"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center border-2 border-black bg-coral text-white hover:-translate-y-1 shadow-[2px_2px_0px_#000] dark:border-cream dark:shadow-[2px_2px_0px_#FFF] transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-black text-lg uppercase border-b-2 border-black dark:border-cream w-fit pb-1 text-black dark:text-cream">
              Navigation
            </h3>
            <ul className="flex flex-col gap-2 font-bold text-black/80 dark:text-cream/80 text-sm">
              <li>
                <Link href="/" className="hover:text-electric-blue hover:underline underline-offset-4">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-electric-blue hover:underline underline-offset-4">
                  All Articles
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-electric-blue hover:underline underline-offset-4">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-electric-blue hover:underline underline-offset-4">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-black text-lg uppercase border-b-2 border-black dark:border-cream w-fit pb-1 text-black dark:text-cream">
              Weekly Chronicle
            </h3>
            <p className="text-sm font-semibold text-black/70 dark:text-cream/70">
              Get curated intellectual dispatches on history, politics, and literature directly to your inbox. No spam. Only depth.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-1">
              <Input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-sm"
              />
              <Button type="submit" variant="coral" size="sm" className="w-full">
                {success ? (
                  <span>Subscribed! 🎉</span>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send className="ml-1.5 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-black dark:border-cream pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-sm text-black/60 dark:text-cream/60">
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-coral fill-coral animate-pulse" />
            <span>in Neo-Brutalism style © {new Date().getFullYear()} Chronica.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
