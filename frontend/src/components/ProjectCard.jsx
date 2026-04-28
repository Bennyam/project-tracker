import { currencyFormatter } from "../utils/portfolio.js";

const projectStatusStyles = {
  active: "border-sky-300/20 bg-sky-300/10 text-sky-100",
  planned: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  completed: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  default: "border-white/10 bg-white/5 text-slate-100",
};

const actionButtonClassName =
  "rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 disabled:cursor-not-allowed disabled:opacity-60";

function formatStatusLabel(status) {
  if (!status) {
    return "Unknown";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function ProjectCard({ isBusy = false, onDelete, onEdit, project }) {
  const projectStatusKey = project.status?.toLowerCase();
  const projectStatusStyle =
    projectStatusStyles[projectStatusKey] ?? projectStatusStyles.default;

  return (
    <article className="group relative overflow-hidden rounded-4xl border border-white/10 bg-slate-950/70 shadow-[0_24px_70px_rgba(2,6,23,0.34)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.12),transparent_30%)] opacity-80 transition duration-500 group-hover:scale-105"
      />

      <div className="relative p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${projectStatusStyle}`}
              >
                {formatStatusLabel(project.status)}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                {project.company}
              </span>
            </div>

            <h2 className="mt-4 wrap-break-word text-2xl font-black tracking-tight text-white sm:text-3xl">
              {project.name}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
              {project.description ||
                "Nog geen beschrijving toegevoegd voor dit project."}
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => onEdit(project)}
              disabled={isBusy}
              className={`${actionButtonClassName} w-full border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white sm:w-auto`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(project)}
              disabled={isBusy}
              className={`${actionButtonClassName} w-full border-rose-300/25 bg-rose-400/10 text-rose-50 hover:bg-rose-400/18 sm:w-auto`}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Client
            </p>
            <p className="mt-3 text-lg font-semibold text-white">
              {project.clientName}
            </p>
          </div>

          <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Budget
            </p>
            <p className="mt-3 text-lg font-semibold text-white">
              {currencyFormatter.format(Number(project.budget ?? 0))}
            </p>
          </div>

          <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:col-span-2 xl:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Endpoint
            </p>
            <p className="mt-3 break-all text-xs font-medium text-slate-200 sm:text-sm">
              `/clients/{project.clientId}/projects/{project.id}`
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
