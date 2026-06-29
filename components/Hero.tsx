"use client";

import { motion, useReducedMotion } from "framer-motion";

// Typed 4-tuple so framer-motion's Easing type is satisfied
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Renders each word as an independently animated span.
 * Uses `custom` prop + dynamic variant function for per-word delays.
 */
function AnimatedHeadline() {
  const reduced = useReducedMotion();
  const plainWords = ["Where", "strategy", "meets"];
  const accentWord = "execution.";

  return (
    <h1 className="font-playfair text-5xl lg:text-7xl font-bold text-text leading-tight max-w-3xl mb-8 flex flex-wrap gap-x-4">
      {plainWords.map((word, i) => (
        <motion.span
          key={word}
          style={{ display: "inline-block" }}
          initial={{ opacity: 0, y: reduced ? 0 : 28, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: reduced ? 0.1 : 0.7,
            delay: reduced ? 0 : i * 0.12,
            ease: EASE,
          }}
        >
          {word}
        </motion.span>
      ))}
      {/* Accent word — italic blue */}
      <motion.em
        className="text-accent"
        style={{ fontStyle: "italic", display: "inline-block" }}
        initial={{ opacity: 0, y: reduced ? 0 : 28, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: reduced ? 0.1 : 0.7,
          delay: reduced ? 0 : plainWords.length * 0.12,
          ease: EASE,
        }}
      >
        {accentWord}
      </motion.em>
    </h1>
  );
}

export default function Hero() {
  const reduced = useReducedMotion();

  // Shared transition factory
  const t = (delay: number) => ({
    duration: reduced ? 0.1 : 0.6,
    delay: reduced ? 0 : delay,
    ease: EASE,
  });

  return (
    <section className="px-6 lg:px-16 py-28 lg:py-40 max-w-7xl mx-auto">
      {/* Eyebrow */}
      <motion.p
        className="font-inter text-xs font-medium tracking-widest uppercase text-muted mb-8"
        initial={{ opacity: 0, y: reduced ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t(0)}
      >
        Management Consultancy · Ajman Free Zone, UAE
      </motion.p>

      {/* Headline — word-by-word */}
      <AnimatedHeadline />

      {/* Subtext */}
      <motion.p
        className="font-inter font-light text-muted text-lg lg:text-xl leading-relaxed max-w-xl mb-12"
        initial={{ opacity: 0, y: reduced ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t(0.55)}
      >
        We help startups, SMEs, and corporates bridge the gap between bold ideas
        and tangible outcomes — through strategy, structure, and relentless
        execution.
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: reduced ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t(0.7)}
      >
        <motion.a
          href="#solutions"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-inter font-medium text-sm rounded-md"
        >
          Explore solutions
        </motion.a>
        <motion.a
          href="mailto:info@solvo-lab.com"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center justify-center px-6 py-3 border border-border text-text font-inter font-medium text-sm rounded-md hover:bg-bg2 transition-colors duration-200"
        >
          Get in touch
        </motion.a>
      </motion.div>
    </section>
  );
}


