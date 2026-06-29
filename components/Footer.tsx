"use client";

import { AnimateIn } from "@/components/ui/AnimateIn";

const navLinks = [
  { label: "Solutions", href: "#solutions" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "mailto:info@solvo-lab.com" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="section-border-top bg-bg2" aria-label="Site footer">
      {/* Main footer grid */}
      <AnimateIn>
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand column */}
        <div>
          <a
            href="/"
            className="font-playfair text-xl font-bold text-text tracking-tight mb-4 inline-block"
            aria-label="Solvo Lab home"
          >
            Solvo<span className="text-accent">.</span>Lab
          </a>
          <p className="font-inter font-light text-muted text-sm leading-relaxed max-w-xs mt-3">
            A UAE-licensed management consultancy delivering strategic clarity,
            operational excellence, and 360° business support.
          </p>
        </div>

        {/* Navigate column */}
        <div>
          <p className="font-inter text-xs font-medium tracking-widest uppercase text-subtle mb-6">
            Navigate
          </p>
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="font-inter text-sm text-muted hover:text-text transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact column */}
        <div>
          <p className="font-inter text-xs font-medium tracking-widest uppercase text-subtle mb-6">
            Contact
          </p>
          <ul className="flex flex-col gap-3">
            <li>
              <a
                href="mailto:info@solvo-lab.com"
                className="font-inter text-sm text-muted hover:text-text transition-colors duration-200"
              >
                info@solvo-lab.com
              </a>
            </li>
            <li>
              <address className="not-italic font-inter text-sm text-muted leading-relaxed">
                26th Floor, Amber Gem Tower
                <br />
                Ajman – UAE
              </address>
            </li>
            <li>
              <p className="font-inter text-xs text-subtle">
                Reg. No. 262131905888
              </p>
            </li>
          </ul>
        </div>
      </div>
      </AnimateIn>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-inter text-xs text-subtle">
            © {year} Solvo Lab FZE LLC. All rights reserved.
          </p>
          <p className="font-inter text-xs text-subtle">
            Ajman Free Zone Entity
          </p>
        </div>
      </div>
    </footer>
  );
}
