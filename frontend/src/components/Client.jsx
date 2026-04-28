import { currencyFormatter } from "../utils/portfolio.js";

const clientStatusStyles = {
  active: {
    label: "Active",
    badge:
      "rounded-full border border-emerald-300/25 bg-emerald-400/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100",
  },
  inactive: {
    label: "Inactive",
    badge:
      "rounded-full border border-slate-300/20 bg-slate-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200",
  },
  default: {
    label: "Client",
    badge:
      "rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-100",
  },
};

const projectStatusStyles = {
  active: "border-sky-300/25 bg-sky-300/10 text-sky-100",
  planned: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  completed: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  default: "border-white/10 bg-white/5 text-slate-200",
};

function getInitials(value) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

const actionButtonClassName =
  "rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 disabled:cursor-not-allowed disabled:opacity-60";

function Client({ client, isBusy = false, onDelete, onEdit }) {
  const projects = client.projects ?? [];
  const displayName = client.company || client.name;
  const statusKey = client.status?.toLowerCase();
  const statusStyle =
    clientStatusStyles[statusKey] ?? clientStatusStyles.default;
  const activeProjects = projects.filter(
    (project) => project.status?.toLowerCase() === "active",
  ).length;
  const plannedProjects = projects.filter(
    (project) => project.status?.toLowerCase() === "planned",
  ).length;
  const totalBudget = projects.reduce(
    (sum, project) => sum + Number(project.budget ?? 0),
    0,
  );
  const currentFocus = projects[0]?.name || "Nog geen project ingepland";
  const statusNote =
    statusKey === "active"
      ? "Deze relatie loopt live en verdient regelmatige opvolging."
      : "Deze relatie staat klaar voor reactivatie of een nieuw traject.";

  return (
    <article className="group relative overflow-hidden rounded-4xl border border-white/10 bg-slate-950/70 shadow-[0_25px_70px_rgba(2,6,23,0.35)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.16),transparent_34%)] opacity-80 transition duration-500 group-hover:scale-105"
      />
      <div className="relative grid gap-5 p-5 sm:gap-6 sm:p-6 lg:grid-cols-[1.7fr_1fr] lg:p-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-amber-200 via-orange-300 to-rose-400 text-base font-black uppercase tracking-[0.16em] text-slate-950 shadow-[0_16px_36px_rgba(249,115,22,0.25)] sm:h-16 sm:w-16 sm:text-lg">
              {getInitials(displayName)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={statusStyle.badge}>
                      {statusStyle.label}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                      {projects.length}{" "}
                      {projects.length === 1 ? "project" : "projecten"}
                    </span>
                  </div>

                  <h2 className="mt-4 wrap-break-wordword text-2xl font-black tracking-tight text-white sm:text-3xl">
                    {displayName}
                  </h2>
                  <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-300">
                    <span className="wrap-break-wordword">{client.name}</span>
                    <span className="hidden text-slate-600 sm:inline">/</span>
                    <a
                      href={`mailto:${client.email}`}
                      className="break-all transition duration-300 hover:text-white sm:wrap-break-word"
                    >
                      {client.email}
                    </a>
                  </p>
                </div>

                {onEdit || onDelete ? (
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
                    {onEdit ? (
                      <button
                        type="button"
                        onClick={() => onEdit(client)}
                        disabled={isBusy}
                        className={`${actionButtonClassName} w-full border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white sm:w-auto`}
                      >
                        Edit client
                      </button>
                    ) : null}

                    {onDelete ? (
                      <button
                        type="button"
                        onClick={() => onDelete(client)}
                        disabled={isBusy}
                        className={`${actionButtonClassName} w-full border-rose-300/25 bg-rose-400/10 text-rose-50 hover:bg-rose-400/18 sm:w-auto`}
                      >
                        Delete client
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Active now
              </p>
              <p className="mt-3 text-3xl font-black text-white">
                {activeProjects}
              </p>
            </div>

            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Planned
              </p>
              <p className="mt-3 text-3xl font-black text-white">
                {plannedProjects}
              </p>
            </div>

            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Budget
              </p>
              <p className="mt-3 text-2xl font-black text-white">
                {currencyFormatter.format(totalBudget)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              Project pulse
            </p>

            {projects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {projects.map((project) => {
                  const projectStatusKey = project.status?.toLowerCase();
                  const projectStyle =
                    projectStatusStyles[projectStatusKey] ??
                    projectStatusStyles.default;

                  return (
                    <div
                      key={project.id}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm ${projectStyle}`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current opacity-80" />
                      <span className="font-medium">{project.name}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[1.4rem] border border-dashed border-white/15 bg-white/5 px-4 py-5 text-sm text-slate-400">
                Nog geen projecten gekoppeld aan deze client.
              </div>
            )}
          </div>
        </div>

        <aside className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
            Relationship snapshot
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <p className="text-sm text-slate-400">Primary contact</p>
              <p className="mt-1 text-xl font-semibold text-white">
                {client.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Company</p>
              <p className="mt-1 wrap-break-word text-base text-slate-200">
                {client.company || "Freelance / independent"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Current focus</p>
              <p className="mt-1 wrap-break-word text-base text-slate-200">
                {currentFocus}
              </p>
            </div>

            <div className="rounded-[1.4rem] border border-white/10 bg-slate-950/60 px-4 py-4">
              <p className="text-sm text-slate-400">Status note</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                {statusNote}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}

export default Client;
