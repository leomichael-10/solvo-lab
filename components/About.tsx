"use client";

import { motion } from "framer-motion";
import { AnimateIn, StaggerIn, StaggerItem } from "@/components/ui/AnimateIn";

const values = [
  {
    number: "01",
    title: "Integrity",
    desc: "We act with transparency, honesty, and accountability in everything we do.",
  },
  {
    number: "02",
    title: "Innovation",
    desc: "We embrace change and think creatively to deliver forward-thinking solutions.",
  },
  {
    number: "03",
    title: "Collaboration",
    desc: "We build lasting partnerships, working as an extension of your team.",
  },
  {
    number: "04",
    title: "Excellence",
    desc: "We hold ourselves to the highest standards in every engagement we take on.",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="section-border-top border-b border-border px-6 lg:px-16 py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left column — fade up */}
        <AnimateIn className="flex flex-col justify-center">
          <span className="font-inter text-xs font-medium tracking-widest uppercase text-muted mb-6">
            Who we are
          </span>
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-text leading-tight mb-8">
            Insight that{" "}
            <em className="text-accent" style={{ fontStyle: "italic" }}>
              moves things forward.
            </em>
          </h2>
          <p className="font-inter font-light text-muted text-base lg:text-lg leading-relaxed">
            Solvo Lab is a UAE-licensed management consultancy committed to
            delivering strategic clarity and operational excellence. We work
            across industries — from early-stage startups to established
            corporates — combining deep expertise with a results-first approach
            to help organisations grow, adapt, and thrive.
          </p>
        </AnimateIn>

        {/* Right column — staggered values list */}
        <StaggerIn
          className="flex flex-col border-t border-border divide-y divide-border"
          staggerDelay={0.12}
        >
          {values.map((v) => (
            <StaggerItem key={v.number}>
              <motion.div
                className="py-6 flex gap-6 items-start group"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <span className="font-inter text-xs font-medium text-subtle pt-1 w-6 shrink-0 group-hover:text-accent transition-colors duration-200">
                  {v.number}
                </span>
                <div>
                  <p className="font-inter font-semibold text-text text-sm mb-1">
                    {v.title}
                  </p>
                  <p className="font-inter font-light text-muted text-sm leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerIn>
      </div>
    </section>
  );
}

