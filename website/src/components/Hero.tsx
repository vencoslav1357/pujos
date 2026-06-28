"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Vstupní parallax: pozadí se cinematicky odzoomuje, text najíždí v jiné
  // hloubce, závoj se rozplyne. Při prefers-reduced-motion vše vynulujeme.
  const delay = (s: number) => (prefersReduced ? 0 : s);
  const lineY = prefersReduced ? "0%" : "110%";
  const easeRise: [number, number, number, number] = [0.16, 1, 0.3, 1];

  // Custom scroll tracking for parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen lg:h-screen w-full flex items-center justify-center overflow-hidden bg-white py-24 lg:py-0"
    >
      {/* Parallax Background (vnější vrstva = scroll parallax) */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 w-full h-[120%] -top-[10%] z-0"
      >
        {/* Vnitřní vrstva = cinematický vstupní pull-back (zoom + drift) */}
        <motion.div
          initial={{ scale: prefersReduced ? 1 : 1.2, y: prefersReduced ? "0%" : "-3%" }}
          animate={{ scale: 1, y: "0%" }}
          transition={{ duration: 1.9, ease: easeRise }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/cleaning_hero.png')",
          }}
        />
        {/* Light Luxury Gradients Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/80 to-white" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/98 via-white/85 to-transparent" />
      </motion.div>

      {/* Grid Pattern overlay for depth — najíždí v jiné hloubce */}
      <motion.div
        initial={{ opacity: 0, scale: prefersReduced ? 1 : 1.12 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 2.2, ease: easeRise }}
        className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none"
      />

      {/* Rozplývající se závoj — fotka se „vyvolá" do ostrosti */}
      <motion.div
        initial={{ opacity: prefersReduced ? 0 : 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.1, delay: delay(0.1), ease: "easeInOut" }}
        className="absolute inset-0 z-[5] bg-white pointer-events-none"
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pb-16 lg:pb-0">
        <motion.div
          style={{ y: textY, opacity }}
          className="max-w-3xl flex flex-col items-start text-left"
        >


          {/* Main Title — řádky nabíhají zdola, přes nadpis přejede lesk */}
          <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight leading-[1.15] text-slate-900 mb-6">
            <span className="block overflow-hidden pb-[0.18em]">
              <motion.span
                initial={{ y: lineY }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, delay: delay(0.5), ease: easeRise }}
                className="block"
              >
                Péče o komerční
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.2em] pr-[0.18em]">
              <motion.span
                initial={{ y: lineY }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, delay: delay(0.65), ease: easeRise }}
                className="block text-blue-gradient font-bold italic text-glow-blue"
              >
                i rezidenční prostory
              </motion.span>
            </span>

            {/* Lesk přejíždějící přes titulek */}
            {!prefersReduced && (
              <motion.span
                aria-hidden
                initial={{ x: "-160%" }}
                animate={{ x: "260%" }}
                transition={{ delay: 1.5, duration: 1, ease: "easeInOut" }}
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-[18deg] bg-gradient-to-r from-transparent via-white/70 to-transparent mix-blend-overlay"
              />
            )}
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: delay(0.95) }}
            className="text-slate-900 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-xl mb-10 font-sans"
          >
            Zajišťujeme špičkový, spolehlivý a precizní úklid kanceláří, firemních prostor, rodinných domů a mytí oken na klíč. Naší vizitkou je čistota bez kompromisů.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: delay(1.15) }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <a
              href="#sluzby"
              className="px-8 py-4 bg-blue-royal rounded-sm text-sm uppercase tracking-widest font-semibold text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 cursor-pointer"
            >
              <span>Naše služby</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#kontakt"
              className="px-8 py-4 bg-transparent border border-slate-200 hover:border-blue-600 rounded-sm text-sm uppercase tracking-widest text-slate-700 hover:text-blue-600 transition-all duration-300 flex items-center justify-center cursor-pointer font-medium"
            >
              Nezávazná poptávka
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator - Hidden on smaller screens to prevent overlaps */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: delay(1.7), duration: 1 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-sans font-semibold">
          Přejít dolů
        </span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-slate-200 via-blue-500 to-transparent animate-bounce" />
      </motion.div>
    </section>
  );
}
