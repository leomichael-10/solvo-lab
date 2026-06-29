"use client";

/**
 * useCountUp — animates a number from 0 to `target` when `trigger` becomes true.
 * Returns the current display value as a string.
 * Respects prefers-reduced-motion (returns final value immediately).
 */

import { useState, useEffect, useRef } from "react";

export function useCountUp(
  target: number,
  trigger: boolean,
  duration = 1400
): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const reduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    if (!trigger) return;
    if (reduced) {
      setValue(target);
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [trigger, target, duration, reduced]);

  return value;
}
