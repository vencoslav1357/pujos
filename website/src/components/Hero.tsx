"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom scroll tracking for parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950"
    >
      {/* Parallax Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 w-full h-[120%] -top-[10%] z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/hero_bg.png')",
          }}
        />
        {/* Dark Luxury Gradients Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/70 to-zinc-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent" />
      </motion.div>

      {/* Grid Pattern overlay for depth */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 z-0 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-20">
        <motion.div
          style={{ y: textY, opacity }}
          className="max-w-3xl flex flex-col items-start text-left"
        >
          {/* Accent Gold Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-2 px-3 py-1 bg-gold-950/40 border border-gold-500/20 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-xs uppercase tracking-widest text-gold-300 font-medium font-sans">
              Umění čistoty & detailu
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight leading-none text-zinc-100 mb-6"
          >
            Dokonalost v <br />
            <span className="text-gold-gradient font-semibold italic text-glow-gold">
              každém detailu
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-zinc-400 text-lg md:text-xl font-light leading-relaxed max-w-xl mb-10 font-sans"
          >
            Josef Pufr přináší exkluzivní péči pro vaše vozy a prémiové úklidové služby pro rezidence i komerční prostory. Vracíme lesk tam, kde na detailech záleží.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <a
              href="#sluzby"
              className="px-8 py-4 bg-gold-gradient rounded-sm text-sm uppercase tracking-widest font-semibold text-zinc-950 hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10 hover:shadow-gold-500/25 cursor-pointer"
            >
              <span>Objevte naše služby</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#kontakt"
              className="px-8 py-4 bg-transparent border border-zinc-700 hover:border-gold-400 rounded-sm text-sm uppercase tracking-widest text-zinc-300 hover:text-gold-300 transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              Nezávazná poptávka
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-sans">
          Přejít dolů
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-700 via-gold-400 to-transparent animate-bounce" />
      </motion.div>
    </section>
  );
}
