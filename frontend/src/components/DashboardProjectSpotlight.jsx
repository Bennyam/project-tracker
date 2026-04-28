import { currencyFormatter } from "../utils/portfolio.js";

const statusStyles = {
  active: "border-sky-300/20 bg-sky-300/10 text-sky-100",
  inactive: "border-slate-300/20 bg-slate-300/10 text-slate-100",
  planned: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  completed: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  default: "border-white/10 bg-white/5 text-slate-100",
};

function formatStatusLabel(status) {
  if (!status) {
    return "Unknown";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function DashboardProjectSpotlight({ project }) {
  const statusKey = project.status?.toLowerCase();
  const statusStyle = statusStyles[statusKey] ?? statusStyles.default;

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="wrap-break-word text-lg font-semibold text-white">
            {project.name}
          </p>
          <p className="mt-1 text-sm text-slate-400">{project.company}</p>
        </div>

        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusStyle}`}
        >
          {formatStatusLabel(project.status)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2.5 text-sm text-slate-300">
        <span>{project.clientName}</span>
        <span className="text-slate-600">/</span>
        <span>{currencyFormatter.format(Number(project.budget ?? 0))}</span>
      </div>
    </article>
  );
}

export default DashboardProjectSpotlight;
