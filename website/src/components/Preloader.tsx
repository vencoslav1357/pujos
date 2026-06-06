"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["Čistota", "Preciznost", "Spolehlivost", "Harmonie"];

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
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

  // Non-linear, organic loading simulation
  useEffect(() => {
    let currentProgress = 0;
    let timeoutId: NodeJS.Timeout;

    const updateProgress = () => {
      if (currentProgress >= 100) {
        setProgress(100);
        timeoutId = setTimeout(() => {
          setActive(false);
          if (onComplete) onComplete();
        }, 400);
        return;
      }

      // Random increments based on current progress
      const remaining = 100 - currentProgress;
      let increment = 1;

      if (remaining > 75) {
        increment = Math.floor(Math.random() * 12) + 4; // Fast start: +4 to +15
      } else if (remaining > 35) {
        increment = Math.floor(Math.random() * 8) + 2;  // Medium progress: +2 to +9
      } else {
        increment = Math.floor(Math.random() * 3) + 1;  // Slow finish: +1 to +3
      }

      currentProgress = Math.min(100, currentProgress + increment);
      setProgress(currentProgress);

      // Random delay between ticks to feel natural (non-constant updates)
      let nextDelay = Math.floor(Math.random() * 120) + 35; // 35ms to 155ms

      // Introduce random organic stalls (asset loading simulation)
      if (currentProgress > 30 && currentProgress < 40 && Math.random() > 0.45) {
        nextDelay = Math.floor(Math.random() * 250) + 200; // pause for 200-450ms
      }
      if (currentProgress > 72 && currentProgress < 82 && Math.random() > 0.45) {
        nextDelay = Math.floor(Math.random() * 350) + 250; // pause for 250-600ms
      }

      timeoutId = setTimeout(updateProgress, nextDelay);
    };

    // Initial delay before start
    timeoutId = setTimeout(updateProgress, 150);

    return () => clearTimeout(timeoutId);
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
          className="fixed inset-0 z-50 bg-white flex flex-col justify-between p-10 md:p-16 pointer-events-auto"
        >
          {/* Logo Brand Header */}
          <div className="flex justify-between items-center w-full z-10">
            <span className="font-serif text-lg tracking-widest text-blue-600 font-bold">
              J. PUFR
            </span>
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
          </div>

          {/* Slogan Reveal Text */}
          <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
            <div className="overflow-hidden">
              <motion.p
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                key={index}
                className="font-serif text-5xl sm:text-7xl md:text-8xl italic text-slate-900 font-medium py-2 text-center"
              >
                <span className="text-blue-gradient text-glow-blue">{words[index]}</span>.
              </motion.p>
            </div>
          </div>

          {/* Progress Indicator Footer */}
          <div className="flex justify-between items-end w-full border-t border-slate-100 pt-8 z-10">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-sans">
              Načítání exkluzivního zážitku
            </p>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-7xl sm:text-9xl font-bold tracking-tighter text-slate-800">
                {progress.toString().padStart(3, "0")}
              </span>
              <span className="text-lg text-blue-600 font-semibold font-sans">%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
