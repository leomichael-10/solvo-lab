"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { useCountUp } from "@/hooks/useCountUp";

const stats = [
  { numeric: 9,   base: "9",   symbol: "+",  label: "Core capabilities" },
  { numeric: null, base: "UAE", symbol: "",   label: "Licensed FZE LLC" },
  { numeric: 360, base: "360", symbol: "°",  label: "Business support" },
  { numeric: 100, base: "100", symbol: "%",  label: "Tailored to you" },
];

/** Individual stat cell with optional count-up */
function StatCell({
  stat,
  index,
  triggered,
}: {
  stat: typeof stats[0];
  index: number;
  triggered: boolean;
}) {
  const count = useCountUp(stat.numeric ?? 0, triggered && stat.numeric !== null, 1200);
  const display = stat.numeric !== null ? String(count) : stat.base;

  return (
    <div
      className={[
        "px-6 lg:px-16 py-12 lg:py-16 flex flex-col gap-2",
        index < stats.length - 1 ? "border-r border-border" : "",
        index < 2 ? "border-b border-border lg:border-b-0" : "",
      ].join(" ")}
    >
      <span
        className="font-playfair text-4xl lg:text-5xl font-bold text-text tabular-nums"
        aria-label={`${stat.base}${stat.symbol}`}
      >
        {display}
        {stat.symbol && <span className="text-accent">{stat.symbol}</span>}
      </span>
      <span className="font-inter text-sm font-medium text-muted tracking-wide">
        {stat.label}
      </span>
    </div>
  );
}

export default function StatsRow() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="section-border-top border-b border-border"
      aria-label="Key figures"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCell key={stat.label} stat={stat} index={i} triggered={inView} />
        ))}
      </div>
    </section>
  );
}

