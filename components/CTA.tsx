"use client";

import { AnimateIn } from "@/components/ui/AnimateIn";
import ContactForm from "@/components/ContactForm";

export default function CTA() {
  return (
    <section
      id="contact"
      className="section-border-top border-b border-border px-6 lg:px-16 py-24 lg:py-40"
      aria-label="Contact"
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
          <p className="font-inter font-light text-muted text-lg max-w-lg mx-auto">
            Let&apos;s talk about where you are and where you want to be. Our
            team is ready to help you build the path forward.
          </p>
        </AnimateIn>

        <ContactForm />
      </div>
    </section>
  );
}
