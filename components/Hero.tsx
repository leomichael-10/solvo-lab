export default function Hero() {
  return (
    <section className="px-6 lg:px-16 py-28 lg:py-40 max-w-7xl mx-auto">
      {/* Eyebrow */}
      <p className="font-inter text-xs font-medium tracking-widest uppercase text-muted mb-8">
        Management Consultancy · Ajman Free Zone, UAE
      </p>

      {/* Headline */}
      <h1 className="font-playfair text-5xl lg:text-7xl font-bold text-text leading-tight max-w-3xl mb-8">
        Where strategy meets{" "}
        <em className="text-accent not-italic" style={{ fontStyle: "italic" }}>
          execution.
        </em>
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
          className="inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-inter font-medium text-sm rounded-md hover:opacity-90 transition-opacity duration-200"
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
