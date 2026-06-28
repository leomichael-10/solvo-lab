"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur-sm border-b border-border">
      <nav
        className="max-w-7xl mx-auto px-6 lg:px-16 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Wordmark */}
        <a
          href="/"
          className="font-playfair text-xl font-bold text-text tracking-tight"
          aria-label="Solvo Lab home"
        >
          Solvo<span className="text-accent">.</span>Lab
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#solutions"
            className="text-sm font-inter font-medium text-muted hover:text-text transition-colors duration-200"
          >
            Solutions
          </a>
          <a
            href="#about"
            className="text-sm font-inter font-medium text-muted hover:text-text transition-colors duration-200"
          >
            Insights
          </a>
          <a
            href="#about"
            className="text-sm font-inter font-medium text-muted hover:text-text transition-colors duration-200"
          >
            About
          </a>
          <a
            href="mailto:info@solvo-lab.com"
            className="ml-2 px-4 py-2 bg-accent text-white text-sm font-inter font-medium rounded-md hover:opacity-90 transition-opacity duration-200"
          >
            Contact us
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-muted hover:text-text transition-colors duration-200 p-1"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-border bg-bg2 px-6 py-6 flex flex-col gap-5"
        >
          <a
            href="#solutions"
            className="text-sm font-inter font-medium text-muted hover:text-text transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Solutions
          </a>
          <a
            href="#about"
            className="text-sm font-inter font-medium text-muted hover:text-text transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Insights
          </a>
          <a
            href="#about"
            className="text-sm font-inter font-medium text-muted hover:text-text transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            About
          </a>
          <a
            href="mailto:info@solvo-lab.com"
            className="inline-flex items-center justify-center px-4 py-2 bg-accent text-white text-sm font-inter font-medium rounded-md hover:opacity-90 transition-opacity duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Contact us
          </a>
        </div>
      )}
    </header>
  );
}
