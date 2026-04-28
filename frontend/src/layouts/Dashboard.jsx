import DashboardMetricCard from "../components/DashboardMetricCard.jsx";
import DashboardProjectSpotlight from "../components/DashboardProjectSpotlight.jsx";
import useClientsWithProjects from "../hooks/clients.with.projects.jsx";
import { currencyFormatter, summarizePortfolio } from "../utils/portfolio.js";

function DashBoard() {
  const { isLoading, error, clients } = useClientsWithProjects();

  if (isLoading) {
    return (
      <section className="my-6 space-y-5 sm:my-8 sm:space-y-6 lg:my-10">
        <div className="h-56 animate-pulse rounded-4xl border border-white/10 bg-slate-950/70 sm:h-72" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-52 animate-pulse rounded-[1.8rem] border border-white/10 bg-white/5"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="my-6 sm:my-8 lg:my-10">
        <div className="rounded-4xl border border-rose-300/25 bg-rose-400/10 p-5 text-rose-100 shadow-[0_20px_60px_rgba(127,29,29,0.25)] sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-rose-200/80">
            Fetch error
          </p>
          <h1 className="mt-4 text-3xl font-black text-white">
            Dashboard kon niet geladen worden.
          </h1>
          <p className="mt-3 text-sm leading-6">{error}</p>
        </div>
      </section>
    );
  }

  const portfolio = summarizePortfolio(clients);
  const focusProjects = [...portfolio.projects]
    .sort((a, b) => Number(b.budget ?? 0) - Number(a.budget ?? 0))
    .slice(0, 4);
  const clientLeaderboard = clients
    .map((client) => ({
      id: client.id,
      name: client.company || client.name,
      contact: client.name,
      projectCount: client.projects?.length ?? 0,
      totalBudget: (client.projects ?? []).reduce(
        (sum, project) => sum + Number(project.budget ?? 0),
        0,
      ),
    }))
    .sort(
      (firstClient, secondClient) =>
        secondClient.projectCount - firstClient.projectCount ||
        secondClient.totalBudget - firstClient.totalBudget,
    )
    .slice(0, 3);
  const statusDistribution = [
    {
      label: "Active",
      helper: "Live",
      value: portfolio.activeProjects,
      barClassName: "bg-sky-400",
    },
    {
      label: "Inactive",
      helper: "Niet live",
      value: portfolio.inactiveProjects,
      barClassName: "bg-slate-300",
    },
    {
      label: "Planned",
      helper: "Voorbereiding",
      value: portfolio.plannedProjects,
      barClassName: "bg-amber-400",
    },
    {
      label: "Completed",
      helper: "Afgerond",
      value: portfolio.completedProjects,
      barClassName: "bg-emerald-400",
    },
  ];
  const totalProjectsForBar = Math.max(portfolio.totalProjects, 1);
  const executionSegments = statusDistribution.slice(0, 2);
  const activeRate =
    portfolio.totalProjects === 0
      ? 0
      : Math.round((portfolio.activeProjects / portfolio.totalProjects) * 100);
  const inactiveProjectCopy =
    portfolio.inactiveProjects === 1
      ? "1 project staat momenteel nog niet live."
      : `${portfolio.inactiveProjects} projecten staan momenteel nog niet live.`;
  const topProjectCopy = portfolio.topProject
    ? `${portfolio.topProject.name} is momenteel de grootste focus met een budget van ${currencyFormatter.format(
        Number(portfolio.topProject.budget ?? 0),
      )}.`
    : "Zodra er projecten zijn, verschijnt hier meteen de grootste focus.";

  return (
    <section className="my-6 space-y-6 sm:my-8 sm:space-y-8 lg:my-10">
      <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-slate-950/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.36)] sm:p-8 lg:p-10">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.18),transparent_36%)]"
        />

        <div className="relative flex flex-col gap-6 sm:gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
              Dashboard
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Je projectportfolio in een sterke cockpit.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
              Alle gekoppelde clients en projecten worden hier samengebracht in
              een heldere cockpit, zodat je meteen ziet wat live staat, wat nog
              aandacht vraagt en waar het meeste budget zit.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200">
                {clients.length} {clients.length === 1 ? "client" : "clients"}{" "}
                connected
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200">
                {portfolio.totalProjects}{" "}
                {portfolio.totalProjects === 1 ? "project" : "projecten"}{" "}
                tracked
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200">
                {currencyFormatter.format(portfolio.totalBudget)} totaal budget
              </span>
            </div>
          </div>

          <div className="w-full max-w-xl rounded-[1.9rem] border border-white/10 bg-white/6 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:max-w-md sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
              Portfolio pulse
            </p>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-slate-400">Active ratio</p>
                <p className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
                  {activeRate}%
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-sm text-slate-400">Average value</p>
                <p className="mt-2 text-xl font-semibold text-white">
                  {currencyFormatter.format(portfolio.averageProjectValue)}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              {topProjectCopy}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardMetricCard
          eyebrow="Total projects"
          value={portfolio.totalProjects}
          label="Projecten over alle clients"
          detail={`${clients.length} gekoppelde clients vormen samen dit overzicht.`}
          accent="amber"
        />
        <DashboardMetricCard
          eyebrow="Active projects"
          value={portfolio.activeProjects}
          label="Staan live of in actieve uitvoering"
          detail={`${portfolio.activeClients} actieve clients dragen het huidige momentum.`}
          accent="sky"
        />
        <DashboardMetricCard
          eyebrow="Inactive projects"
          value={portfolio.inactiveProjects}
          label="Nog niet live of al afgerond"
          detail={inactiveProjectCopy}
          accent="slate"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.95fr]">
        <div className="rounded-4xl border border-white/10 bg-slate-950/70 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.3)] sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                Project spotlight
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Waar zit nu de meeste energie en waarde?
              </h2>
            </div>

            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300">
              {focusProjects.length} focus items
            </span>
          </div>

          <div className="mt-6 grid gap-3">
            {focusProjects.length > 0 ? (
              focusProjects.map((project) => (
                <DashboardProjectSpotlight key={project.id} project={project} />
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 px-4 py-6 text-sm text-slate-400">
                Nog geen projecten beschikbaar voor het spotlight-overzicht.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-4xl border border-white/10 bg-slate-950/70 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.3)] sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              Status balance
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Verdeling van je projectpipeline.
            </h2>

            <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-white/10">
              {executionSegments
                .filter((item) => item.value > 0)
                .map((item) => (
                  <div
                    key={item.label}
                    className={item.barClassName}
                    style={{
                      width: `${(item.value / totalProjectsForBar) * 100}%`,
                    }}
                  />
                ))}
            </div>

            <div className="mt-5 space-y-3">
              {statusDistribution.map((item) => {
                const percentage =
                  portfolio.totalProjects === 0
                    ? 0
                    : Math.round((item.value / portfolio.totalProjects) * 100);

                return (
                  <div
                    key={item.label}
                    className="flex flex-col gap-3 rounded-[1.3rem] border border-white/10 bg-white/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-3 w-3 rounded-full ${item.barClassName}`}
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {item.label}
                        </p>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          {item.helper}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm font-semibold text-white">
                        {item.value}
                      </p>
                      <p className="text-xs text-slate-500">{percentage}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-4xl border border-white/10 bg-slate-950/70 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.3)] sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              Client leaderboard
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Wie draagt nu het meeste werk?
            </h2>

            <div className="mt-5 space-y-3">
              {clientLeaderboard.length > 0 ? (
                clientLeaderboard.map((client, index) => (
                  <div
                    key={client.id}
                    className="flex flex-col gap-4 rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-black text-white">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="wrap-break-wordword font-semibold text-white">
                          {client.name}
                        </p>
                        <p className="text-sm text-slate-400">
                          {client.contact}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm font-semibold text-white">
                        {client.projectCount}{" "}
                        {client.projectCount === 1 ? "project" : "projecten"}
                      </p>
                      <p className="text-sm text-slate-400">
                        {currencyFormatter.format(client.totalBudget)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.4rem] border border-dashed border-white/15 bg-white/5 px-4 py-6 text-sm text-slate-400">
                  Zodra clients projecten hebben, verschijnt hier de ranking.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashBoard;
