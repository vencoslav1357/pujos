"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["Čistota", "Preciznost", "Detailing", "Dokonalost"];

export default function Preloader() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(true);

  // Cycle through slogans
  useEffect(() => {
    if (index === words.length - 1) return;
    const timeout = setTimeout(
      () => {
        setIndex(index + 1);
      },
      index === 0 ? 900 : 650
    );
    return () => clearTimeout(timeout);
  }, [index]);

  // Linear progression loader
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setActive(false), 400);
          return 100;
        }
        // Increment speed increases near completion for smooth flow
        const increment = Math.max(1, Math.floor((100 - prev) * 0.15));
        return Math.min(100, prev + increment);
      });
    }, 45);

    return () => clearInterval(timer);
  }, []);

  // Disable body scroll while loading
  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <AnimatePresence mode="wait">
      {active && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-50 bg-zinc-950 flex flex-col justify-between p-10 md:p-16 pointer-events-auto"
        >
          {/* Logo Brand Header */}
          <div className="flex justify-between items-center w-full z-10">
            <span className="font-serif text-lg tracking-widest text-gold-400 font-bold">
              JOSEF PUFR
            </span>
            <div className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
          </div>

          {/* Slogan Reveal Text */}
          <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
            <div className="overflow-hidden">
              <motion.p
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                key={index}
                className="font-serif text-5xl sm:text-7xl md:text-8xl italic text-zinc-100 font-medium py-2 text-center"
              >
                <span className="text-gold-gradient text-glow-gold">{words[index]}</span>.
              </motion.p>
            </div>
          </div>

          {/* Progress Indicator Footer */}
          <div className="flex justify-between items-end w-full border-t border-zinc-900 pt-8 z-10">
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-sans">
              Načítání exkluzivního zážitku
            </p>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-7xl sm:text-9xl font-bold tracking-tighter text-zinc-800">
                {progress.toString().padStart(3, "0")}
              </span>
              <span className="text-lg text-gold-500 font-light font-sans">%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
