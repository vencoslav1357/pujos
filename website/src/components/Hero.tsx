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

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen lg:h-screen w-full flex items-center justify-center overflow-hidden bg-white py-24 lg:py-0"
    >
      {/* Parallax Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 w-full h-[120%] -top-[10%] z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/cleaning_hero.png')",
          }}
        />
        {/* Light Luxury Gradients Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/10 via-white/75 to-white" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
      </motion.div>

      {/* Grid Pattern overlay for depth */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 z-0 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pb-16 lg:pb-0">
        <motion.div
          style={{ y: textY, opacity }}
          className="max-w-3xl flex flex-col items-start text-left"
        >
          {/* Accent Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs uppercase tracking-widest text-blue-700 font-semibold font-sans">
              J. PUFR a spol.
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight leading-[1.15] text-slate-900 mb-6"
          >
            Péče o komerční <br />
            <span className="text-blue-gradient font-bold italic text-glow-blue">
              i rezidenční prostory
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-slate-650 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-xl mb-10 font-sans"
          >
            Zajišťujeme špičkový, spolehlivý a precizní úklid kanceláří, firemních prostor, rodinných domů a mytí oken na klíč. Naší vizitkou je čistota bez kompromisů.
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
        transition={{ delay: 1.2, duration: 1 }}
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
