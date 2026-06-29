"use client";

/**
 * AnimateIn — scroll-triggered fade + slide-up wrapper.
 * Wraps any content. Respects prefers-reduced-motion.
 */

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

// Bezier curve typed as a 4-tuple so framer-motion's types are satisfied
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function AnimateIn({ children, delay = 0, className }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: reduced ? 0.15 : 0.6,
        delay: reduced ? 0 : delay,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container — children animate in sequence */
export function StaggerIn({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const reduced = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : staggerDelay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

/** Single item inside a StaggerIn container */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASE },
    },
  };

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

