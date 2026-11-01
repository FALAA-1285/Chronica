"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Compass, Globe, Mail, Scroll } from "lucide-react";
import { buttonClass } from "./ui/Button";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 15, stiffness: 100 } },
};

const sticker = "absolute cursor-grab items-center gap-1.5 border-2 border-black px-3.5 py-1.5 font-mono text-xs font-black uppercase shadow-[3px_3px_0px_#000] z-20 select-none active:cursor-grabbing";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden border-b-3 border-black bg-cream py-20 lg:py-28 bg-grid-pattern">
      {/* Decorative draggable stickers (desktop only) */}
      <motion.div
        drag
        dragConstraints={{ left: -10, right: 300, top: -10, bottom: 400 }}
        whileDrag={{ scale: 1.1, rotate: 10 }}
        aria-hidden="true"
        className={`${sticker} top-12 left-[8%] hidden xl:flex bg-neon-green text-black rotate-[-6deg]`}
      >
        <Scroll className="h-4 w-4" />
        <span>History</span>
      </motion.div>
      <motion.div
        drag
        dragConstraints={{ left: -10, right: 300, top: -10, bottom: 400 }}
        whileDrag={{ scale: 1.1, rotate: -10 }}
        aria-hidden="true"
        className={`${sticker} top-[45%] right-[10%] hidden xl:flex bg-yellow text-black rotate-[8deg]`}
      >
        <Globe className="h-4 w-4" />
        <span>Geopolitics</span>
      </motion.div>
      <motion.div
        drag
        dragConstraints={{ left: -200, right: 200, top: -10, bottom: 400 }}
        whileDrag={{ scale: 1.1 }}
        aria-hidden="true"
        className={`${sticker} bottom-12 left-[15%] hidden lg:flex bg-coral text-white rotate-[4deg]`}
      >
        <Compass className="h-4 w-4" />
        <span>Philosophy</span>
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.h1 variants={itemVariants} className="text-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-black tracking-tight uppercase">
            History, Power <br className="hidden sm:inline" />
            &amp; <span className="underline decoration-wavy decoration-yellow decoration-3 sm:decoration-6">Classic</span>{" "}
            <span className="inline-block bg-electric-blue text-white px-4 border-2 sm:border-3 border-black shadow-[4px_4px_0px_#0A0A0A] rotate-[-2deg]">
              Letters.
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="font-semibold text-lg sm:text-xl lg:text-2xl text-black/80 max-w-2xl mt-8 leading-relaxed">
            An editorial blog dissecting geopolitical shifts, historical turning points, classical literature, and the philosophical underpinnings of society.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto">
            <Link href="/blog" className={buttonClass({ variant: "electric", size: "lg", className: "w-full sm:w-auto gap-2" })}>
              <span>Explore Articles</span>
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link href="/contact" className={buttonClass({ variant: "yellow", size: "lg", className: "w-full sm:w-auto gap-2" })}>
              <Mail className="h-5 w-5" aria-hidden="true" />
              <span>Get in Touch</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-2 bg-black pointer-events-none" aria-hidden="true" />
    </section>
  );
};
