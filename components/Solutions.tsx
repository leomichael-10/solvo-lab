"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
import {
  Rocket, Tv, TrendingUp, KanbanSquare, Sprout,
  UserCheck, Building2, Briefcase, CalendarDays,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { solutions, type Solution } from "@/lib/solutions";
import { AnimateIn } from "@/components/ui/AnimateIn";
import type { ElementType } from "react";

/* ── Icon map ──────────────────────────────────────────────────────── */
const iconMap: Record<string, ElementType> = {
  Rocket, Tv, TrendingUp, KanbanSquare, Sprout,
  UserCheck, Building2, Briefcase, CalendarDays,
};

function SolutionIcon({ name }: { name: string }) {
  const Icon = iconMap[name] ?? Rocket;
  return <Icon size={28} className="text-accent" aria-hidden="true" />;
}

/* ── Component ─────────────────────────────────────────────────────── */
export default function Solutions() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const reduced = useReducedMotion();
  const total = solutions.length;

  const goTo = useCallback(
    (next: number) => {
      if (next === index || next < 0 || next >= total) return;
      setDirection(next > index ? 1 : -1);
      setIndex(next);
    },
    [index, total]
  );

  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  // Keyboard left/right
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  const current: Solution = solutions[index];

  // Slide + fade variants (disabled when reduced-motion)
  const cardVariants: Variants = {
    enter: (dir: number) => ({
      x: reduced ? 0 : dir * 40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: EASE },
    },
    exit: (dir: number) => ({
      x: reduced ? 0 : dir * -40,
      opacity: 0,
      transition: { duration: 0.25, ease: "easeIn" as const },
    }),
  };

  return (
    <section
      id="solutions"
      className="section-border-top border-b border-border py-24 lg:py-32"
      aria-label="Our solutions"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16">

        {/* Header row — scroll reveal */}
        <AnimateIn className="flex items-center justify-between mb-12">
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-text">
            Our{" "}
            <em className="text-accent" style={{ fontStyle: "italic" }}>
              solutions
            </em>
          </h2>

          <div className="flex items-center gap-4">
            {/* Counter */}
            <span className="font-inter text-sm text-muted hidden sm:block" aria-hidden="true">
              <motion.span
                key={index}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-text font-medium inline-block"
              >
                {String(index + 1).padStart(2, "0")}
              </motion.span>
              {" "}of {String(total).padStart(2, "0")}
            </span>

            {/* Prev */}
            <motion.button
              onClick={prev}
              disabled={index === 0}
              aria-label="Previous solution"
              whileHover={index > 0 ? { scale: 1.1 } : {}}
              whileTap={index > 0 ? { scale: 0.9 } : {}}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-text hover:border-accent/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft size={18} />
            </motion.button>

            {/* Next */}
            <motion.button
              onClick={next}
              disabled={index === total - 1}
              aria-label="Next solution"
              whileHover={index < total - 1 ? { scale: 1.1 } : {}}
              whileTap={index < total - 1 ? { scale: 0.9 } : {}}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-text hover:border-accent/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </AnimateIn>

        {/* Card — AnimatePresence handles enter/exit */}
        <div
          role="region"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Solution ${index + 1} of ${total}: ${current.title}`}
          className="relative overflow-hidden"
          style={{ minHeight: 320 }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="bg-bg2 border border-border rounded-lg p-8 lg:p-12 hover:border-accent/30 hover:shadow-[0_0_40px_-12px_rgba(47,129,247,0.25)] transition-shadow duration-300"
            >
              {/* Icon box with subtle pulse on change */}
              <motion.div
                key={`icon-${index}`}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.15, ease: EASE }}
                className="w-12 h-12 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center mb-6"
              >
                <SolutionIcon name={current.icon} />
              </motion.div>

              <p className="font-inter text-xs font-medium tracking-widest uppercase text-muted mb-3">
                {current.label}
              </p>

              <h3 className="font-playfair text-3xl lg:text-4xl font-bold text-text mb-6">
                {current.title}
              </h3>

              <p className="font-inter font-light text-muted text-base lg:text-lg leading-relaxed max-w-3xl">
                {current.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators — animated with layout */}
        <div
          className="flex items-center justify-center gap-2 mt-8"
          role="tablist"
          aria-label="Solution navigation"
        >
          {solutions.map((s, i) => (
            <motion.button
              key={s.id}
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to ${s.title}`}
              onClick={() => goTo(i)}
              animate={{
                width: i === index ? 24 : 8,
                backgroundColor: i === index ? "#2F81F7" : "#30363D",
              }}
              whileHover={i !== index ? { backgroundColor: "#7D8590" } : {}}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ height: 8, borderRadius: 9999 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

