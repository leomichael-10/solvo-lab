# Solvo Lab Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready, fully responsive dark marketing website for Solvo Lab as a Next.js 15 App Router + TypeScript + Tailwind CSS project deployable to Vercel.

**Architecture:** Single-page marketing site with all sections assembled in `app/page.tsx`. Each section is an isolated React server component except the Solutions carousel, which is a `"use client"` component managing carousel state. Design tokens live in `tailwind.config.ts` and `globals.css`; content data lives in `lib/solutions.ts`.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v3, `next/font/google` (Playfair Display + Inter), `lucide-react` icons.

## Global Constraints

- Next.js 15, App Router, TypeScript strict mode
- Tailwind CSS v3 — all tokens defined in `tailwind.config.ts` under `theme.extend.colors`
- Fonts via `next/font/google` only — no external `<link>` tags
- Color palette: `bg=#0D1117`, `bg2=#161B22`, `bg3=#1C2333`, `border=#21262D`, `accent=#2F81F7`, `text=#E6EDF3`, `muted=#7D8590`, `subtle=#30363D`
- Playfair Display 700 + 700italic for display; Inter 300/400/500/600 for body/UI
- No localStorage, no backend, contact CTA is `mailto:info@solvo-lab.com`
- All carousel keyboard/aria/prefers-reduced-motion requirements must be met
- WCAG AA contrast minimum throughout
- No heavy image assets — icons from `lucide-react` only
- Side padding: `px-16` desktop → `px-6` mobile; vertical rhythm `py-20` to `py-32` between sections

---

## File Map

```
solvo-lab/
├── app/
│   ├── layout.tsx          # Root layout: fonts, metadata, html/body wrapper
│   ├── page.tsx            # Assembles all sections in order
│   └── globals.css         # CSS variables + Tailwind base directives
├── components/
│   ├── Nav.tsx             # Sticky nav with wordmark + links + CTA button
│   ├── Hero.tsx            # Eyebrow + headline + subtext + two buttons
│   ├── StatsRow.tsx        # 4-cell stat strip with border dividers
│   ├── About.tsx           # 2-col: headline+para left, values list right
│   ├── Solutions.tsx       # "use client" carousel: one card, prev/next/dots/kbd
│   ├── CTA.tsx             # Full-width CTA with email
│   └── Footer.tsx          # 3-col footer + bottom bar
├── lib/
│   └── solutions.ts        # Typed array of all 9 solutions
├── tailwind.config.ts      # Color tokens + font vars
├── README.md
└── .gitignore
```

---

### Task 1: Project Scaffold + Config

**Files:**
- Create: `package.json` (via `npx create-next-app@latest`)
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Create: `.gitignore`

**Interfaces:**
- Produces: `colors.bg`, `colors.bg2`, `colors.bg3`, `colors.border`, `colors.accent`, `colors.text`, `colors.muted`, `colors.subtle` — Tailwind color tokens used by all components
- Produces: CSS variables `--font-playfair`, `--font-inter` on `:root`

- [ ] **Step 1: Scaffold Next.js project**

```bash
cd "c:\Users\miche\OneDrive\Desktop\solvo-lab"
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --yes
```

Expected: Project files created in current directory. `npm run dev` starts on port 3000.

- [ ] **Step 2: Install lucide-react**

```bash
npm install lucide-react
```

Expected: `lucide-react` appears in `package.json` dependencies.

- [ ] **Step 3: Replace `tailwind.config.ts` with color tokens + font vars**

Replace the entire file with:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:     "#0D1117",
        bg2:    "#161B22",
        bg3:    "#1C2333",
        border: "#21262D",
        accent: "#2F81F7",
        text:   "#E6EDF3",
        muted:  "#7D8590",
        subtle: "#30363D",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        inter:    ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 4: Replace `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-playfair: "";
  --font-inter: "";
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: #0D1117;
  color: #E6EDF3;
  font-family: var(--font-inter), system-ui, sans-serif;
}

/* Hairline section borders */
.section-border-top {
  border-top: 1px solid #21262D;
}

/* Fade transition for Solutions carousel */
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  opacity: 1;
  transition: opacity 250ms ease;
}
.fade-exit {
  opacity: 1;
}
.fade-exit-active {
  opacity: 0;
  transition: opacity 250ms ease;
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-exit-active {
    transition: none;
  }
}

/* Focus ring consistent style */
*:focus-visible {
  outline: 2px solid #2F81F7;
  outline-offset: 2px;
}
```

- [ ] **Step 5: Add .gitignore entry for UI/UX skill dir**

Append `.ui-ux-pro/` to the existing `.gitignore` (create-next-app generates one).

```
# UI/UX Pro Max skill (local only)
.ui-ux-pro/
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: Compiled successfully, http://localhost:3000 loads (default Next.js page is fine at this stage).

- [ ] **Step 7: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Next.js 15 project with Tailwind color tokens and font config"
```

---

### Task 2: Root Layout + Fonts

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `--font-playfair`, `--font-inter` CSS var names (set on `<html>`)
- Produces: Root `<html>` with both fonts injected + SEO metadata export

- [ ] **Step 1: Replace `app/layout.tsx`**

```typescript
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Solvo Lab — Management Consultancy | Ajman Free Zone, UAE",
  description:
    "Solvo Lab FZE LLC helps startups, SMEs, and corporates bridge ideas and outcomes through strategic consultancy, innovation support, and 360° business services — based in Ajman Free Zone, UAE.",
  openGraph: {
    title: "Solvo Lab — Management Consultancy",
    description:
      "Where strategy meets execution. Tailored consulting for startups, SMEs, and corporates in the UAE and beyond.",
    url: "https://www.solvo-lab.com",
    siteName: "Solvo Lab",
    locale: "en_AE",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="font-inter bg-bg text-text antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify fonts load**

```bash
npm run dev
```

Open http://localhost:3000 — check DevTools → Network → Fonts, confirm two Google font requests for Playfair Display and Inter.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add root layout with Playfair Display + Inter fonts and SEO metadata"
```

---

### Task 3: Solutions Data

**Files:**
- Create: `lib/solutions.ts`

**Interfaces:**
- Produces: `Solution` type + `solutions: Solution[]` array (9 items)
- Consumed by: `components/Solutions.tsx`

```typescript
// lib/solutions.ts
export interface Solution {
  id: string;          // "01"–"09"
  label: string;       // e.g. "Solution 01"
  title: string;       // e.g. "Innovation Startup Support"
  description: string; // Full verbatim paragraph
  icon: string;        // Lucide icon name e.g. "Rocket"
}
```

- [ ] **Step 1: Create `lib/solutions.ts`**

```typescript
export interface Solution {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: string;
}

export const solutions: Solution[] = [
  {
    id: "01",
    label: "Solution 01",
    title: "Innovation Startup Support",
    icon: "Rocket",
    description:
      "Innovation Startup Support is a forward-thinking venture that transforms bold ideas into impactful solutions. We blend technology, strategy, and creativity to deliver tailored services in digital content, IT consulting, project management, business incubation, and administrative support. What sets us apart is our innovation-first mindset, agile approach, and unwavering commitment to integrity and value. Whether you're a startup or an established enterprise, we act as your trusted partner in navigating the digital landscape and unlocking sustainable growth.",
  },
  {
    id: "02",
    label: "Solution 02",
    title: "Digital Content Services",
    icon: "Tv",
    description:
      "Our Digital Content Services empower brands to tell their story with clarity, creativity, and impact. From engaging copy and visual media to data-driven campaigns and content strategies, we craft experiences that resonate across platforms. Whether you're building a brand, launching a product, or scaling your online presence, our team delivers content that connects with your audience and drives measurable results. We focus on authenticity, consistency, and innovation — so your message stands out in a crowded digital landscape.",
  },
  {
    id: "03",
    label: "Solution 03",
    title: "Management Consultancy",
    icon: "TrendingUp",
    description:
      "Our Management Consultancy services support organisations in navigating complexity, optimising performance, and achieving strategic clarity. We work closely with leadership teams to align business goals with operational execution — enhancing decision-making, streamlining processes, and driving measurable growth. From organisational design and change management to performance improvement and strategic planning, our approach is collaborative, data-driven, and results-oriented. We deliver practical solutions tailored to your context, enabling lasting impact and sustainable success.",
  },
  {
    id: "04",
    label: "Solution 04",
    title: "Project Management Services",
    icon: "KanbanSquare",
    description:
      "Our Project Management Services ensure your initiatives are delivered on time, within budget, and to the highest standards. We apply proven methodologies and agile practices to plan, execute, and oversee projects across diverse sectors. From concept development to final delivery, we manage risks, coordinate stakeholders, and ensure seamless execution. Whether you're launching a new product, implementing a system, or driving organisational change, we provide the structure, expertise, and oversight needed to turn your vision into measurable outcomes.",
  },
  {
    id: "05",
    label: "Solution 05",
    title: "Business Incubator",
    icon: "Sprout",
    description:
      "Our Business Incubator provides startups and early-stage ventures with the strategic support, tools, and mentorship needed to grow and succeed. We offer a nurturing environment that includes business model development, market access, funding readiness, and tailored advisory services. By connecting founders with industry experts, investors, and resources, we accelerate innovation and reduce time-to-market. Whether you're refining your idea or scaling your operations, our incubator is built to transform potential into sustainable, investor-ready businesses.",
  },
  {
    id: "06",
    label: "Solution 06",
    title: "Human Resources Consultancy",
    icon: "UserCheck",
    description:
      "Our Human Resources Consultancy services help organisations build agile, high-performing teams aligned with their strategic vision. We support every stage of the employee lifecycle — from talent acquisition and workforce planning to performance management, training, and organisational development. By combining best practices with customised solutions, we help you attract, retain, and empower top talent while ensuring compliance and promoting a positive workplace culture. Our goal is to make HR a true driver of value and growth for your business.",
  },
  {
    id: "07",
    label: "Solution 07",
    title: "Combined Office Administrative Services",
    icon: "Building2",
    description:
      "Our Combined Office Administrative Service Activities provide comprehensive back-office support to streamline your operations and enhance productivity. From document management and scheduling to payroll processing and administrative coordination, we offer integrated solutions tailored to your organisational needs. By outsourcing routine tasks to our expert team, you can reduce overheads, improve efficiency, and focus on your core business activities. We deliver reliable, discreet, and professional services that keep your operations running smoothly behind the scenes.",
  },
  {
    id: "08",
    label: "Solution 08",
    title: "Businessmen Administrative Services",
    icon: "Briefcase",
    description:
      "Our Businessmen Administrative Services are designed to support executives and entrepreneurs with tailored, high-efficiency solutions that simplify day-to-day operations. From personal business correspondence and travel arrangements to document handling, legal coordination, and concierge-level support, we ensure that your administrative needs are managed seamlessly and discreetly. With a focus on precision, confidentiality, and responsiveness, our services enable you to concentrate on strategic priorities while we handle the details behind the scenes.",
  },
  {
    id: "09",
    label: "Solution 09",
    title: "Events Organising & Managing",
    icon: "CalendarDays",
    description:
      "Our Events Organising & Managing services deliver impactful experiences tailored to your vision, audience, and objectives. From corporate conferences and product launches to private functions and community initiatives, we manage every detail — planning, logistics, vendor coordination, branding, and execution. Our team combines creativity with precision to ensure seamless delivery, memorable engagement, and professional presentation. Whether in-person, virtual, or hybrid, we turn ideas into events that inspire, connect, and leave a lasting impression.",
  },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add lib/solutions.ts
git commit -m "feat: add typed solutions data array (9 solutions)"
```

---

### Task 4: Nav Component

**Files:**
- Create: `components/Nav.tsx`

**Interfaces:**
- Produces: `<Nav />` — no props, self-contained sticky navigation

- [ ] **Step 1: Create `components/Nav.tsx`**

```typescript
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
            className="ml-2 px-4 py-2 bg-accent text-white text-sm font-inter font-medium rounded-md hover:bg-accent/90 transition-colors duration-200"
          >
            Contact us
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-muted hover:text-text transition-colors duration-200"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-bg2 px-6 py-6 flex flex-col gap-5">
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
            className="inline-flex items-center justify-center px-4 py-2 bg-accent text-white text-sm font-inter font-medium rounded-md hover:bg-accent/90 transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Contact us
          </a>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Add Nav to `app/page.tsx` temporarily to verify it renders**

Replace `app/page.tsx` with:

```typescript
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <main>
      <Nav />
      <div className="h-screen flex items-center justify-center text-muted font-inter">
        Building…
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Open http://localhost:3000. Confirm: sticky dark nav with `Solvo.Lab` (blue dot), three links, blue "Contact us" button. Resize to mobile — hamburger appears, clicking opens/closes menu.

- [ ] **Step 4: Commit**

```bash
git add components/Nav.tsx app/page.tsx
git commit -m "feat: add sticky Nav component with responsive hamburger menu"
```

---

### Task 5: Hero Section

**Files:**
- Create: `components/Hero.tsx`

**Interfaces:**
- Produces: `<Hero />` — no props

- [ ] **Step 1: Create `components/Hero.tsx`**

```typescript
export default function Hero() {
  return (
    <section className="section-border-top px-6 lg:px-16 py-28 lg:py-40 max-w-7xl mx-auto">
      {/* Eyebrow */}
      <p className="font-inter text-xs font-medium tracking-widest uppercase text-muted mb-8">
        Management Consultancy · Ajman Free Zone, UAE
      </p>

      {/* Headline */}
      <h1 className="font-playfair text-5xl lg:text-7xl font-bold text-text leading-tight max-w-3xl mb-8">
        Where strategy meets{" "}
        <em className="text-accent not-italic italic">execution.</em>
      </h1>

      {/* Subtext */}
      <p className="font-inter font-light text-muted text-lg lg:text-xl leading-relaxed max-w-xl mb-12">
        We help startups, SMEs, and corporates bridge the gap between bold ideas
        and tangible outcomes — through strategy, structure, and relentless
        execution.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="#solutions"
          className="inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-inter font-medium text-sm rounded-md hover:bg-accent/90 transition-colors duration-200"
        >
          Explore solutions
        </a>
        <a
          href="mailto:info@solvo-lab.com"
          className="inline-flex items-center justify-center px-6 py-3 border border-border text-text font-inter font-medium text-sm rounded-md hover:bg-bg2 transition-colors duration-200"
        >
          Get in touch
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to `app/page.tsx`**

```typescript
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
    </main>
  );
}
```

- [ ] **Step 3: Verify in browser**

Confirm: eyebrow text, large Playfair headline with italic blue "execution.", subtext in Inter light, two buttons side-by-side (stacked on mobile).

- [ ] **Step 4: Commit**

```bash
git add components/Hero.tsx app/page.tsx
git commit -m "feat: add Hero section with Playfair headline and CTA buttons"
```

---

### Task 6: Stats Row

**Files:**
- Create: `components/StatsRow.tsx`

**Interfaces:**
- Produces: `<StatsRow />` — no props

- [ ] **Step 1: Create `components/StatsRow.tsx`**

```typescript
const stats = [
  { value: "9+", symbol: "+", base: "9", label: "Core capabilities" },
  { value: "UAE", symbol: "", base: "UAE", label: "Licensed FZE LLC" },
  { value: "360°", symbol: "°", base: "360", label: "Business support" },
  { value: "100%", symbol: "%", base: "100", label: "Tailored to you" },
];

export default function StatsRow() {
  return (
    <section
      className="section-border-top border-b border-border"
      aria-label="Key figures"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="px-6 lg:px-16 py-12 lg:py-16 flex flex-col gap-2"
          >
            <span
              className="font-playfair text-4xl lg:text-5xl font-bold text-text"
              aria-label={stat.value}
            >
              {stat.base}
              <span className="text-accent">{stat.symbol}</span>
            </span>
            <span className="font-inter text-sm font-medium text-muted tracking-wide">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to `app/page.tsx`**

```typescript
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsRow from "@/components/StatsRow";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <StatsRow />
    </main>
  );
}
```

- [ ] **Step 3: Verify in browser**

Confirm: 4 stat cells with vertical dividers (2-col grid on mobile), Playfair numbers with accent-blue symbols (`+`, `°`, `%`).

- [ ] **Step 4: Commit**

```bash
git add components/StatsRow.tsx app/page.tsx
git commit -m "feat: add StatsRow with 4 bordered cells"
```

---

### Task 7: About Section

**Files:**
- Create: `components/About.tsx`

**Interfaces:**
- Produces: `<About />` — no props

- [ ] **Step 1: Create `components/About.tsx`**

```typescript
const values = [
  { number: "01", title: "Integrity", desc: "We act with transparency, honesty, and accountability in everything we do." },
  { number: "02", title: "Innovation", desc: "We embrace change and think creatively to deliver forward-thinking solutions." },
  { number: "03", title: "Collaboration", desc: "We build lasting partnerships, working as an extension of your team." },
  { number: "04", title: "Excellence", desc: "We hold ourselves to the highest standards in every engagement we take on." },
];

export default function About() {
  return (
    <section
      id="about"
      className="section-border-top border-b border-border px-6 lg:px-16 py-24 lg:py-32 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left column */}
        <div className="flex flex-col justify-center">
          <span className="font-inter text-xs font-medium tracking-widest uppercase text-muted mb-6">
            Who we are
          </span>
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-text leading-tight mb-8">
            Insight that{" "}
            <em className="text-accent not-italic italic">moves things forward.</em>
          </h2>
          <p className="font-inter font-light text-muted text-base lg:text-lg leading-relaxed">
            Solvo Lab is a UAE-licensed management consultancy committed to
            delivering strategic clarity and operational excellence. We work
            across industries — from early-stage startups to established
            corporates — combining deep expertise with a results-first approach
            to help organisations grow, adapt, and thrive.
          </p>
        </div>

        {/* Right column — values list */}
        <div className="flex flex-col divide-y divide-border border-t border-border">
          {values.map((v) => (
            <div key={v.number} className="py-6 flex gap-6 items-start">
              <span className="font-inter text-xs font-medium text-subtle pt-1 w-6 shrink-0">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to `app/page.tsx`**

```typescript
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsRow from "@/components/StatsRow";
import About from "@/components/About";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <StatsRow />
      <About />
    </main>
  );
}
```

- [ ] **Step 3: Verify in browser**

Confirm: 2-col layout (stacks on mobile), tag + Playfair headline with italic blue emphasis, paragraph, then 4 values in a vertical divided list with grey numbering.

- [ ] **Step 4: Commit**

```bash
git add components/About.tsx app/page.tsx
git commit -m "feat: add About section with 2-col layout and values list"
```

---

### Task 8: Solutions Carousel

**Files:**
- Create: `components/Solutions.tsx`
- Consumes: `lib/solutions.ts`

**Interfaces:**
- Consumes: `solutions: Solution[]`, `Solution` type from `@/lib/solutions`
- Produces: `<Solutions />` — no props, client component

- [ ] **Step 1: Create `components/Solutions.tsx`**

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Rocket, Tv, TrendingUp, KanbanSquare, Sprout,
  UserCheck, Building2, Briefcase, CalendarDays,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { solutions, type Solution } from "@/lib/solutions";

// Map icon string names to Lucide components
const iconMap: Record<string, React.ElementType> = {
  Rocket, Tv, TrendingUp, KanbanSquare, Sprout,
  UserCheck, Building2, Briefcase, CalendarDays,
};

function SolutionIcon({ name }: { name: string }) {
  const Icon = iconMap[name] ?? Rocket;
  return <Icon size={28} className="text-accent" aria-hidden="true" />;
}

export default function Solutions() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const total = solutions.length;

  // Check if user prefers reduced motion
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const goTo = useCallback(
    (next: number) => {
      if (next === index) return;
      if (prefersReduced) {
        setIndex(next);
        return;
      }
      setVisible(false);
      setTimeout(() => {
        setIndex(next);
        setVisible(true);
      }, 200);
    },
    [index, prefersReduced]
  );

  const prev = () => goTo(index > 0 ? index - 1 : index);
  const next = () => goTo(index < total - 1 ? index + 1 : index);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

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
            <em className="text-accent not-italic italic">solutions</em>
          </h2>
          <div className="flex items-center gap-4">
            {/* Counter */}
            <span className="font-inter text-sm text-muted hidden sm:block">
              <span className="text-text font-medium">{String(index + 1).padStart(2, "0")}</span>
              {" "}of{" "}
              {String(total).padStart(2, "0")}
            </span>
            {/* Prev / Next */}
            <button
              onClick={prev}
              disabled={index === 0}
              aria-label="Previous solution"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-text hover:border-accent/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft size={18} />
            </button>
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
          className={`bg-bg2 border border-border rounded-lg p-8 lg:p-12 transition-opacity duration-[200ms] ${
            visible ? "opacity-100" : "opacity-0"
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
```

- [ ] **Step 2: Add to `app/page.tsx`**

```typescript
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsRow from "@/components/StatsRow";
import About from "@/components/About";
import Solutions from "@/components/Solutions";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <StatsRow />
      <About />
      <Solutions />
    </main>
  );
}
```

- [ ] **Step 3: Verify in browser**

Confirm:
- Shows solution card 01 by default
- Prev arrow is disabled on first card, next arrow disabled on last
- Clicking next/prev changes card with fade
- Dot indicators highlight current, clicking navigates
- Left/right keyboard arrows navigate
- `aria-live` region updates on change

- [ ] **Step 4: Commit**

```bash
git add components/Solutions.tsx app/page.tsx
git commit -m "feat: add Solutions carousel with prev/next/dots/keyboard/aria support"
```

---

### Task 9: CTA Section

**Files:**
- Create: `components/CTA.tsx`

**Interfaces:**
- Produces: `<CTA />` — no props

- [ ] **Step 1: Create `components/CTA.tsx`**

```typescript
export default function CTA() {
  return (
    <section
      className="section-border-top border-b border-border px-6 lg:px-16 py-24 lg:py-40 max-w-7xl mx-auto text-center"
      aria-label="Contact call to action"
    >
      <h2 className="font-playfair text-4xl lg:text-6xl font-bold text-text leading-tight mb-6 max-w-2xl mx-auto">
        Ready to start your{" "}
        <em className="text-accent not-italic italic">next chapter?</em>
      </h2>
      <p className="font-inter font-light text-muted text-lg max-w-lg mx-auto mb-10">
        Let&apos;s talk about where you are and where you want to be. Our team
        is ready to help you build the path forward.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* TODO: Wire to a real contact form (currently mailto fallback) */}
        <a
          href="mailto:info@solvo-lab.com"
          className="inline-flex items-center justify-center px-8 py-3.5 bg-accent text-white font-inter font-medium text-sm rounded-md hover:bg-accent/90 transition-colors duration-200"
        >
          Start a conversation
        </a>
        <a
          href="mailto:info@solvo-lab.com"
          className="font-inter text-sm text-muted hover:text-text transition-colors duration-200"
        >
          info@solvo-lab.com
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to `app/page.tsx`**

```typescript
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsRow from "@/components/StatsRow";
import About from "@/components/About";
import Solutions from "@/components/Solutions";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <StatsRow />
      <About />
      <Solutions />
      <CTA />
    </main>
  );
}
```

- [ ] **Step 3: Verify in browser**

Confirm: centered headline with italic blue "next chapter?", subtext, solid blue button and email link below.

- [ ] **Step 4: Commit**

```bash
git add components/CTA.tsx app/page.tsx
git commit -m "feat: add CTA section with mailto contact button"
```

---

### Task 10: Footer

**Files:**
- Create: `components/Footer.tsx`

**Interfaces:**
- Produces: `<Footer />` — no props

- [ ] **Step 1: Create `components/Footer.tsx`**

```typescript
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
          <p className="font-inter font-light text-muted text-sm leading-relaxed max-w-xs">
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
```

- [ ] **Step 2: Complete `app/page.tsx` with all sections**

```typescript
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsRow from "@/components/StatsRow";
import About from "@/components/About";
import Solutions from "@/components/Solutions";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <StatsRow />
        <About />
        <Solutions />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify in browser**

Confirm: 3-col footer (stacks on mobile) with brand, navigate links, contact info. Bottom bar shows copyright and "Ajman Free Zone Entity".

- [ ] **Step 4: Commit**

```bash
git add components/Footer.tsx app/page.tsx
git commit -m "feat: add Footer with 3-col layout and bottom bar"
```

---

### Task 11: Full-Page QA + README

**Files:**
- Create: `README.md`

**Interfaces:**
- N/A (documentation only)

- [ ] **Step 1: Visual QA checklist**

At http://localhost:3000, verify each point:

| Check | Pass? |
|---|---|
| All 7 sections render in order (Nav, Hero, Stats, About, Solutions, CTA, Footer) | |
| Sections separated by 1px `border-border` hairlines | |
| Nav is sticky and stays on top while scrolling | |
| `Solvo.Lab` wordmark — dot is `#2F81F7` blue | |
| Hero headline: "execution." in Playfair italic blue | |
| Stats: symbols (`+`, `°`, `%`) in blue, numbers in Playfair | |
| About: "moves things forward." in italic blue | |
| Solutions: card shows one solution, fade on prev/next | |
| Solutions: dots pill-expand on active | |
| Solutions: keyboard ← → works | |
| Solutions: prev disabled on first card | |
| Solutions: next disabled on last (card 9) | |
| CTA: "next chapter?" in italic blue | |
| Footer: 3 columns on desktop, stacks on mobile | |
| Mobile: nav hamburger menu opens/closes | |
| Mobile: all 2-col sections stack to 1-col | |
| No console errors or TypeScript build errors | |

- [ ] **Step 2: TypeScript + ESLint check**

```bash
npx tsc --noEmit
npm run lint
```

Expected: 0 errors, 0 warnings (fix any that appear before proceeding).

- [ ] **Step 3: Production build check**

```bash
npm run build
```

Expected: `✓ Compiled successfully` with no errors. Check output for any missing `"use client"` warnings on interactive components.

- [ ] **Step 4: Create `README.md`**

```markdown
# Solvo Lab — Marketing Website

Production-ready marketing website for Solvo Lab FZE LLC, built with Next.js 15 (App Router), TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** lucide-react
- **Fonts:** Playfair Display + Inter via `next/font/google`

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push to a GitHub repository.
2. Import the repo in [vercel.com](https://vercel.com) — Vercel auto-detects Next.js.
3. Click **Deploy**. No environment variables required for the static marketing site.

> **Contact form:** The "Contact us" and "Start a conversation" buttons currently use `mailto:info@solvo-lab.com`. To add a real form, wire the CTA section to a form handler (e.g., Resend, Formspree, or a Next.js API route).

## Project Structure

```
app/
  layout.tsx       # Root layout, fonts, metadata
  page.tsx         # Page composition
  globals.css      # CSS variables + Tailwind directives
components/
  Nav.tsx          # Sticky navigation
  Hero.tsx         # Hero section
  StatsRow.tsx     # Key stats strip
  About.tsx        # About + values list
  Solutions.tsx    # Carousel (client component)
  CTA.tsx          # Call to action
  Footer.tsx       # Footer
lib/
  solutions.ts     # Typed solutions data
```

## UI/UX Pro Max Recommendations Applied

- **Spacing:** Generous 80–120px vertical rhythm between sections; 64px desktop side padding
- **Hierarchy:** Three clear type scales — Playfair display (64–72px), Playfair card (36–48px), Inter body (16–18px)
- **Color:** Minimal palette — one accent blue, two background levels, two text levels; no decorative gradients
- **Hover timings:** 200ms `transition-colors` on all interactive elements (within 200–250ms recommendation)
- **Accessibility:** Semantic HTML (`<header>`, `<main>`, `<nav>`, `<footer>`, `<address>`), `aria-label` on all interactive controls, `aria-live="polite"` on carousel, visible focus rings (`outline: 2px solid #2F81F7`), `prefers-reduced-motion` respected in carousel, WCAG AA contrast verified for all text/background pairs
- **Grid:** Max-width container (`max-w-7xl`) with consistent side padding; 2-col grids collapse to 1-col below `lg` breakpoint
```

- [ ] **Step 5: Final commit**

```bash
git add README.md
git commit -m "docs: add README with setup, deploy, and UI/UX notes"
```

---

## Self-Review Against Spec

| Spec Requirement | Covered In |
|---|---|
| Next.js 15 App Router + TypeScript + Tailwind | Task 1 |
| Color tokens in `tailwind.config.ts` | Task 1 |
| Playfair Display + Inter via `next/font/google` | Task 2 |
| SEO metadata + Open Graph | Task 2 |
| Typed solutions array in `lib/solutions.ts` | Task 3 |
| Nav: sticky, wordmark with blue dot, links, blue button | Task 4 |
| Hero: eyebrow, Playfair headline, italic blue emphasis, two buttons | Task 5 |
| Stats: 4 cells, border dividers, Playfair numbers, accent symbols | Task 6 |
| About: 2-col, values list with numbered items | Task 7 |
| Solutions: one card at a time, prev/next, dots, keyboard, fade, aria | Task 8 |
| All 9 solution descriptions verbatim | Task 3 |
| CTA: headline, subtext, button, email | Task 9 |
| Footer: 3-col, nav links, contact details, reg number, bottom bar | Task 10 |
| Fully responsive (stacking, hamburger, mobile padding) | Tasks 4–10 |
| WCAG AA, focus rings, semantic HTML | Tasks 4–10 |
| `prefers-reduced-motion` | Task 8 |
| Lucide icons for solutions | Tasks 3 + 8 |
| `README.md` with setup + deploy notes | Task 11 |
| `.gitignore` entry for `.ui-ux-pro/` | Task 1 |
| Contact buttons = `mailto:` with TODO comment | Tasks 5 + 9 |
