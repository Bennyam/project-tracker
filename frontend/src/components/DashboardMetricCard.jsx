const accentStyles = {
  amber: {
    glow:
      "bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_38%)]",
    badge:
      "border-amber-300/20 bg-amber-300/10 text-amber-100 shadow-[0_0_24px_rgba(251,191,36,0.16)]",
  },
  sky: {
    glow:
      "bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_38%)]",
    badge:
      "border-sky-300/20 bg-sky-300/10 text-sky-100 shadow-[0_0_24px_rgba(56,189,248,0.16)]",
  },
  slate: {
    glow:
      "bg-[radial-gradient(circle_at_top_right,_rgba(148,163,184,0.18),_transparent_38%)]",
    badge:
      "border-slate-300/20 bg-slate-300/10 text-slate-100 shadow-[0_0_24px_rgba(148,163,184,0.14)]",
  },
};

function DashboardMetricCard({
  eyebrow,
  value,
  label,
  detail,
  accent = "amber",
}) {
  const accentStyle = accentStyles[accent] ?? accentStyles.amber;

  return (
    <article className="relative h-full overflow-hidden rounded-[1.8rem] border border-white/10 bg-slate-950/70 p-4 shadow-[0_20px_60px_rgba(2,6,23,0.28)] sm:p-5">
      <div aria-hidden="true" className={`absolute inset-0 ${accentStyle.glow}`} />
      <div className="relative">
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] sm:tracking-[0.26em] ${accentStyle.badge}`}
        >
          {eyebrow}
        </span>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="break-words text-4xl font-black tracking-tight text-white sm:text-5xl">
              {value}
            </p>
            <p className="mt-3 text-sm font-medium text-slate-200 sm:text-base">
              {label}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-400">{detail}</p>
      </div>
    </article>
  );
}

export default DashboardMetricCard;
