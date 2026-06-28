const stats = [
  { base: "9", symbol: "+", label: "Core capabilities" },
  { base: "UAE", symbol: "", label: "Licensed FZE LLC" },
  { base: "360", symbol: "°", label: "Business support" },
  { base: "100", symbol: "%", label: "Tailored to you" },
];

export default function StatsRow() {
  return (
    <section
      className="section-border-top border-b border-border"
      aria-label="Key figures"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-border"
        style={{ borderImage: "none" }}
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={[
              "px-6 lg:px-16 py-12 lg:py-16 flex flex-col gap-2",
              // right border on all but last
              i < stats.length - 1 ? "border-r border-border" : "",
              // bottom border on first row items (mobile 2-col)
              i < 2 ? "border-b border-border lg:border-b-0" : "",
            ].join(" ")}
          >
            <span
              className="font-playfair text-4xl lg:text-5xl font-bold text-text"
              aria-label={`${stat.base}${stat.symbol}`}
            >
              {stat.base}
              {stat.symbol && (
                <span className="text-accent">{stat.symbol}</span>
              )}
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
