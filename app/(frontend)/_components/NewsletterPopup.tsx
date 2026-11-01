"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send, Mail } from "lucide-react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

export const NewsletterPopup = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname?.startsWith("/custom-admin")) return;
    // Show automatically after 15 seconds
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem("dismissed-subscribe");
      if (!dismissed) {
        setIsOpen(true);
      }
    }, 15000);

    const handleOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener("open-subscribe-popup", handleOpen);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("open-subscribe-popup", handleOpen);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("dismissed-subscribe", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsOpen(false);
      setEmail("");
      localStorage.setItem("dismissed-subscribe", "true");
    }, 2000);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  if (pathname?.startsWith("/custom-admin")) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, rotate: -2, y: 30, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, rotate: 2, y: 30, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            ref={modalRef}
            className="relative w-full max-w-lg border-3 border-black bg-cream p-8 shadow-[8px_8px_0px_#0A0A0A] dark:border-cream dark:bg-dark-surface dark:shadow-[8px_8px_0px_#FFFBF0] overflow-hidden select-none"
          >
            {/* Background stickers / geometric design */}
            <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-yellow border-2 border-black dark:border-cream flex items-center justify-center font-mono font-black text-black select-none pointer-events-none rotate-12">
              NEWS!
            </div>
            
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center border-2 border-black bg-coral text-white shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:shadow-[3px_3px_0px_#0a0a0a] dark:border-cream dark:shadow-[2px_2px_0px_#FFFBF0] transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center border-2 border-black bg-electric-blue text-white shadow-[2px_2px_0px_#0A0A0A] dark:border-cream dark:shadow-[2px_2px_0px_#FFFBF0]">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-display text-2xl uppercase text-black dark:text-cream">
                The Chronica Dispatch
              </h2>
            </div>

            {/* Main message */}
            <p className="font-bold text-black/85 dark:text-cream/85 text-base mb-6">
              Join 5,000+ avid readers, historians, and literary enthusiasts who receive our hand-picked historical chronicles, geopolitical essays, and philosophical reflections every Tuesday.
            </p>

            {/* Form */}
            {!success ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  type="email"
                  placeholder="enter.your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="py-3.5 text-base"
                />
                <Button type="submit" variant="neon" size="lg" className="w-full flex items-center justify-center gap-2">
                  <span>Sign Me Up!</span>
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 border-2 border-black bg-neon-green text-black font-mono font-black text-center text-lg dark:border-cream"
              >
                <Sparkles className="inline-block mr-2 h-5 w-5 animate-spin-slow" />
                <span>WELCOME TO CHRONICA! 🎉</span>
              </motion.div>
            )}

            {/* Footer guarantee */}
            <p className="text-center font-mono text-xs text-black/55 dark:text-cream/55 mt-6">
              No spam. Unsubscribe in 1-click at any time. We promise.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
