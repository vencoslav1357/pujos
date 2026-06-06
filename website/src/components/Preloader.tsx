"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["Čistota", "Preciznost", "Spolehlivost", "Harmonie"];

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(true);

  // Refs to share state between effects without causing re-renders/dependency issues
  const isDoneRef = useRef(false);
  const progressRef = useRef(0);

  const dismiss = useCallback(() => {
    setActive(false);
    if (onComplete) onComplete();
  }, [onComplete]);

  // Cycle through slogans on a fixed schedule, independent of progress ticks.
  // Check isDoneRef inside the callback rather than as a dependency.
  useEffect(() => {
    if (index >= words.length - 1) return;

    const timeout = setTimeout(() => {
      // If loading already finished, stop cycling — preloader will exit with whatever word is showing
      if (isDoneRef.current) return;
      setIndex((prev) => prev + 1);
    }, index === 0 ? 400 : 360);

    return () => clearTimeout(timeout);
  }, [index]);

  // Non-linear, organic and snappy loading simulation
  useEffect(() => {
    let currentProgress = 0;
    let timeoutId: NodeJS.Timeout;

    const updateProgress = () => {
      if (currentProgress >= 100) {
        setProgress(100);
        progressRef.current = 100;
        isDoneRef.current = true;
        // Short delay before dismissing so 100% is visible
        timeoutId = setTimeout(dismiss, 200);
        return;
      }

      // Snappy progress steps
      const remaining = 100 - currentProgress;
      let increment = 1;

      if (remaining > 60) {
        increment = Math.floor(Math.random() * 15) + 12;
      } else if (remaining > 20) {
        increment = Math.floor(Math.random() * 8) + 6;
      } else {
        increment = Math.floor(Math.random() * 3) + 2;
      }

      currentProgress = Math.min(100, currentProgress + increment);
      setProgress(currentProgress);
      progressRef.current = currentProgress;

      // Fast tick delay
      let nextDelay = Math.floor(Math.random() * 40) + 15;

      // Brief organic stall at midpoint
      if (currentProgress > 45 && currentProgress < 65 && Math.random() > 0.5) {
        nextDelay = Math.floor(Math.random() * 100) + 100;
      }

      timeoutId = setTimeout(updateProgress, nextDelay);
    };

    // Tiny initial delay
    timeoutId = setTimeout(updateProgress, 100);

    return () => clearTimeout(timeoutId);
  }, [dismiss]);

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
                transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
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

