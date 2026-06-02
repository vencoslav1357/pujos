"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollRevealProps {
  text: string;
  className?: string;
}

export default function ScrollReveal({ text, className = "" }: ScrollRevealProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  
  // Track scroll progress of this container relative to the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.4"], // Starts when entering screen, completes in middle
  });

  const words = text.split(" ");

  return (
    <p ref={containerRef} className={`flex flex-wrap ${className}`}>
      {words.map((word, index) => {
        // Distribute activation thresholds evenly across words
        const start = index / words.length;
        const end = Math.min(1, (index + 2) / words.length); // slight overlap for smooth reading flow
        
        // Map scroll progress to opacity (0.15 to 1)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);

        return (
          <span key={index} className="relative mr-[0.28em] mb-[0.15em] inline-block select-none">
            <motion.span style={{ opacity }} className="text-zinc-100">
              {word}
            </motion.span>
          </span>
        );
      })}
    </p>
  );
}
