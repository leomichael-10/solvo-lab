"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

/** Nav link with animated underline that grows from left on hover */
function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative text-sm font-inter font-medium text-muted hover:text-text transition-colors duration-200"
    >
      {children}
      <motion.span
        className="absolute left-0 -bottom-0.5 h-px bg-accent"
        animate={{ width: hovered ? "100%" : "0%" }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{ display: "block" }}
        aria-hidden="true"
      />
    </a>
  );
}

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur-sm border-b border-border">
      <nav
        className="max-w-7xl mx-auto px-6 lg:px-16 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Wordmark */}
        <motion.a
          href="/"
          className="font-playfair text-xl font-bold text-text tracking-tight"
          aria-label="Solvo Lab home"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          Solvo<span className="text-accent">.</span>Lab
        </motion.a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="#solutions">Solutions</NavLink>
          <NavLink href="#about">Insights</NavLink>
          <NavLink href="#about">About</NavLink>
          <motion.a
            href="mailto:info@solvo-lab.com"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="ml-2 px-4 py-2 bg-accent text-white text-sm font-inter font-medium rounded-md"
          >
            Contact us
          </motion.a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-muted hover:text-text transition-colors duration-200 p-1"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={menuOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ display: "block" }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </nav>

      {/* Mobile menu — slide down */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-border bg-bg2"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              <NavLink href="#solutions" onClick={() => setMenuOpen(false)}>Solutions</NavLink>
              <NavLink href="#about" onClick={() => setMenuOpen(false)}>Insights</NavLink>
              <NavLink href="#about" onClick={() => setMenuOpen(false)}>About</NavLink>
              <a
                href="mailto:info@solvo-lab.com"
                className="inline-flex items-center justify-center px-4 py-2 bg-accent text-white text-sm font-inter font-medium rounded-md"
                onClick={() => setMenuOpen(false)}
              >
                Contact us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

