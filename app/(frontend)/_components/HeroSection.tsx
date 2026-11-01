"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Compass, Globe, Mail, Scroll } from "lucide-react";
import { Button } from "./ui/Button";

export const HeroSection = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative overflow-hidden border-b-3 border-black bg-cream py-20 lg:py-28 dark:border-cream dark:bg-dark-bg bg-grid-pattern transition-colors">
      
      {/* Draggable stickers / floating stamps */}
      <motion.div
        drag
        dragConstraints={{ left: -10, right: 300, top: -10, bottom: 400 }}
        whileDrag={{ scale: 1.1, rotate: 10 }}
        className="absolute top-12 left-[8%] hidden xl:flex cursor-grab items-center gap-1.5 border-2 border-black bg-neon-green px-3.5 py-1.5 font-mono text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000] rotate-[-6deg] z-20 select-none active:cursor-grabbing"
      >
        <Scroll className="h-4 w-4" />
        <span>HISTORY 📜</span>
      </motion.div>

      <motion.div
        drag
        dragConstraints={{ left: -10, right: 300, top: -10, bottom: 400 }}
        whileDrag={{ scale: 1.1, rotate: -10 }}
        className="absolute top-[45%] right-[10%] hidden xl:flex cursor-grab items-center gap-1.5 border-2 border-black bg-yellow px-4 py-2 font-mono text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000] rotate-[8deg] z-20 select-none active:cursor-grabbing"
      >
        <Globe className="h-4 w-4" />
        <span>GEOPOLITICS 🌐</span>
      </motion.div>

      <motion.div
        drag
        dragConstraints={{ left: -200, right: 200, top: -10, bottom: 400 }}
        whileDrag={{ scale: 1.1 }}
        className="absolute bottom-12 left-[15%] hidden lg:flex cursor-grab items-center gap-1.5 border-2 border-black bg-coral px-3.5 py-1.5 font-mono text-xs font-black uppercase text-white shadow-[3px_3px_0px_#000] rotate-[4deg] z-20 select-none active:cursor-grabbing"
      >
        <Compass className="h-4 w-4 text-white" />
        <span>PHILOSOPHY 🏛️</span>
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          {/* Headline Title */}
          <motion.h1
            variants={itemVariants}
            className="text-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-black dark:text-cream tracking-tight uppercase"
          >
            History, Power <br className="hidden sm:inline" />
            &amp; <span className="underline decoration-wavy decoration-yellow decoration-3 sm:decoration-6">Classic</span>{" "}
            <span className="inline-block bg-electric-blue text-white px-4 border-2 sm:border-3 border-black dark:border-cream shadow-[4px_4px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_#FFFBF0] rotate-[-2deg]">
              Letters.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="font-semibold text-lg sm:text-xl lg:text-2xl text-black/80 dark:text-cream/80 max-w-2xl mt-8 leading-relaxed"
          >
            A high-voltage editorial blog dissecting geopolitical shifts, historical turning points, classical literature, and the philosophical underpinnings of society.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto"
          >
            <Link href="/blog" className="w-full sm:w-auto">
              <Button
                variant="electric"
                size="lg"
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <span>Explore Articles</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                variant="yellow"
                size="lg"
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Mail className="h-5 w-5 text-black" />
                <span>Get in Touch</span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative background bottom wave border */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-black dark:bg-cream select-none pointer-events-none"></div>
    </section>
  );
};
