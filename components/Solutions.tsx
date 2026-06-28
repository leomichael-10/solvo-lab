"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Rocket,
  Tv,
  TrendingUp,
  KanbanSquare,
  Sprout,
  UserCheck,
  Building2,
  Briefcase,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { solutions, type Solution } from "@/lib/solutions";
import type { ElementType } from "react";

/* ── Icon map ──────────────────────────────────────────────────────── */
const iconMap: Record<string, ElementType> = {
  Rocket,
  Tv,
  TrendingUp,
  KanbanSquare,
  Sprout,
  UserCheck,
  Building2,
  Briefcase,
  CalendarDays,
};

function SolutionIcon({ name }: { name: string }) {
  const Icon = iconMap[name] ?? Rocket;
  return <Icon size={28} className="text-accent" aria-hidden="true" />;
}

/* ── Component ─────────────────────────────────────────────────────── */
export default function Solutions() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const total = solutions.length;

  // Detect reduced-motion preference once on mount
  const reducedMotion = useRef(false);
  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (next === index || next < 0 || next >= total) return;
      if (reducedMotion.current) {
        setIndex(next);
        return;
      }
      setFading(true);
      setTimeout(() => {
        setIndex(next);
        setFading(false);
      }, 200);
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

  return (
    <section
      id="solutions"
      className="section-border-top border-b border-border py-24 lg:py-32"
      aria-label="Our solutions"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Header row */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-text">
            Our{" "}
            <em className="text-accent" style={{ fontStyle: "italic" }}>
              solutions
            </em>
          </h2>

          <div className="flex items-center gap-4">
            {/* Counter */}
            <span className="font-inter text-sm text-muted hidden sm:block" aria-hidden="true">
              <span className="text-text font-medium">
                {String(index + 1).padStart(2, "0")}
              </span>{" "}
              of {String(total).padStart(2, "0")}
            </span>

            {/* Prev */}
            <button
              onClick={prev}
              disabled={index === 0}
              aria-label="Previous solution"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-text hover:border-accent/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Next */}
            <button
              onClick={next}
              disabled={index === total - 1}
              aria-label="Next solution"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-text hover:border-accent/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Card */}
        <div
          role="region"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Solution ${index + 1} of ${total}: ${current.title}`}
          className={`bg-bg2 border border-border rounded-lg p-8 lg:p-12 ${
            fading ? "card-hidden" : "card-visible"
          }`}
        >
          {/* Icon box */}
          <div className="w-12 h-12 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
            <SolutionIcon name={current.icon} />
          </div>

          <p className="font-inter text-xs font-medium tracking-widest uppercase text-muted mb-3">
            {current.label}
          </p>

          <h3 className="font-playfair text-3xl lg:text-4xl font-bold text-text mb-6">
            {current.title}
          </h3>

          <p className="font-inter font-light text-muted text-base lg:text-lg leading-relaxed max-w-3xl">
            {current.description}
          </p>
        </div>

        {/* Dot indicators */}
        <div
          className="flex items-center justify-center gap-2 mt-8"
          role="tablist"
          aria-label="Solution navigation"
        >
          {solutions.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to ${s.title}`}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-200 ${
                i === index
                  ? "w-6 h-2 bg-accent"
                  : "w-2 h-2 bg-subtle hover:bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
