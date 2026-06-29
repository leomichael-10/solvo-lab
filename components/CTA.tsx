"use client";

import { motion } from "framer-motion";
import { AnimateIn } from "@/components/ui/AnimateIn";

export default function CTA() {
  return (
    <section
      className="section-border-top border-b border-border px-6 lg:px-16 py-24 lg:py-40"
      aria-label="Contact call to action"
    >
      <div className="max-w-7xl mx-auto text-center">
        <AnimateIn>
          <h2 className="font-playfair text-4xl lg:text-6xl font-bold text-text leading-tight mb-6 max-w-2xl mx-auto">
            Ready to start your{" "}
            <em className="text-accent" style={{ fontStyle: "italic" }}>
              next chapter?
            </em>
          </h2>
        </AnimateIn>

        <AnimateIn delay={0.15}>
          <p className="font-inter font-light text-muted text-lg max-w-lg mx-auto mb-10">
            Let&apos;s talk about where you are and where you want to be. Our
            team is ready to help you build the path forward.
          </p>
        </AnimateIn>

        <AnimateIn delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* TODO: Wire to a real contact form (currently mailto fallback) */}
            <motion.a
              href="mailto:info@solvo-lab.com"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-accent text-white font-inter font-medium text-sm rounded-md"
            >
              Start a conversation
            </motion.a>
            <a
              href="mailto:info@solvo-lab.com"
              className="font-inter text-sm text-muted hover:text-text transition-colors duration-200"
            >
              info@solvo-lab.com
            </a>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}

