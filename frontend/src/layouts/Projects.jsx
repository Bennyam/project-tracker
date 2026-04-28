import { useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import DashboardMetricCard from "../components/DashboardMetricCard.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import ProjectCreatorDialog from "../components/ProjectCreatorDialog.jsx";
import ProjectEditorDialog from "../components/ProjectEditorDialog.jsx";
import useClientsWithProjects from "../hooks/clients.with.projects.jsx";
import {
  createProject,
  deleteProject,
  updateProject,
} from "../services/api.service.js";
import {
  currencyFormatter,
  flattenProjects,
  summarizePortfolio,
} from "../utils/portfolio.js";

const filterOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "planned", label: "Planned" },
  { value: "completed", label: "Completed" },
  { value: "not-live", label: "Not live" },
];

const filterButtonClassName =
  "w-full rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 sm:w-auto";

const statusOrder = {
  active: 0,
  planned: 1,
  completed: 2,
};

function Projects() {
  const { isLoading, error, clients, refetchClients } =
    useClientsWithProjects();
  const [activeFilter, setActiveFilter] = useState("all");
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectPendingDelete, setProjectPendingDelete] = useState(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [busyProjectId, setBusyProjectId] = useState(null);
  const [projectCreateError, setProjectCreateError] = useState("");
  const [projectEditorError, setProjectEditorError] = useState("");
  const [projectDeleteError, setProjectDeleteError] = useState("");
  const [actionFeedback, setActionFeedback] = useState(null);

  if (isLoading) {
    return (
      <section className="my-6 space-y-5 sm:my-8 sm:space-y-6 lg:my-10">
        <div className="h-60 animate-pulse rounded-4xl border border-white/10 bg-slate-950/70 sm:h-72 sm:rounded-[2.3rem]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-[1.45rem] border border-white/10 bg-white/5 sm:h-44 sm:rounded-[1.7rem]"
            />
          ))}
        </div>
        <div className="grid gap-4 sm:gap-5 xl:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-4xl border border-white/10 bg-white/5 sm:h-80 sm:rounded-4xl"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="my-6 sm:my-8 lg:my-10">
        <div className="rounded-4xl border border-rose-300/25 bg-rose-400/10 p-5 text-rose-100 shadow-[0_20px_60px_rgba(127,29,29,0.25)] sm:rounded-4xl sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-rose-200/80">
            Fetch error
          </p>
          <h1 className="mt-4 text-2xl font-black text-white sm:text-3xl">
            Projects konden niet geladen worden.
          </h1>
          <p className="mt-3 text-sm leading-6 sm:text-base">{error}</p>
        </div>
      </section>
    );
  }

  const portfolio = summarizePortfolio(clients);
  const projects = flattenProjects(clients);
  const filteredProjects = projects
    .filter((project) => {
      const projectStatus = project.status?.toLowerCase();

      if (activeFilter === "all") {
        return true;
      }

      if (activeFilter === "not-live") {
        return projectStatus !== "active";
      }

      return projectStatus === activeFilter;
    })
    .sort((firstProject, secondProject) => {
      const firstStatusOrder =
        statusOrder[firstProject.status?.toLowerCase()] ?? 99;
      const secondStatusOrder =
        statusOrder[secondProject.status?.toLowerCase()] ?? 99;

      return (
        firstStatusOrder - secondStatusOrder ||
        Number(secondProject.budget ?? 0) - Number(firstProject.budget ?? 0)
      );
    });
  const topProject = [...projects].sort(
    (firstProject, secondProject) =>
      Number(secondProject.budget ?? 0) - Number(firstProject.budget ?? 0),
  )[0];
  const projectsValueCopy = topProject
    ? `${topProject.name} is momenteel het zwaarste project met ${currencyFormatter.format(
        Number(topProject.budget ?? 0),
      )}.`
    : "Zodra er projecten zijn, tonen we hier meteen de grootste waarde.";
  const hasClients = clients.length > 0;
  const hasProjects = projects.length > 0;

  async function handleProjectCreate({ clientId, payload }) {
    setProjectCreateError("");
    setIsCreatingProject(true);

    try {
      await createProject(clientId, payload);
      await refetchClients({ silent: true });
      setActionFeedback({
        tone: "success",
        message: `${payload.name} werd succesvol toegevoegd als nieuw project.`,
      });
      setIsCreateProjectOpen(false);
    } catch (error) {
      setProjectCreateError(error.message);
    } finally {
      setIsCreatingProject(false);
    }
  }

  async function handleProjectUpdate(payload) {
    if (!editingProject) {
      return;
    }

    setProjectEditorError("");
    setIsSavingProject(true);
    setBusyProjectId(editingProject.id);

    try {
      await updateProject(editingProject.clientId, editingProject.id, payload);
      await refetchClients({ silent: true });
      setActionFeedback({
        tone: "success",
        message: `${payload.name} werd succesvol bijgewerkt.`,
      });
      setEditingProject(null);
    } catch (error) {
      setProjectEditorError(error.message);
    } finally {
      setIsSavingProject(false);
      setBusyProjectId(null);
    }
  }

  async function handleProjectDelete() {
    if (!projectPendingDelete) {
      return;
    }

    setProjectDeleteError("");
    setIsDeletingProject(true);
    setBusyProjectId(projectPendingDelete.id);

    try {
      await deleteProject(
        projectPendingDelete.clientId,
        projectPendingDelete.id,
      );
      await refetchClients({ silent: true });
      setActionFeedback({
        tone: "success",
        message: `${projectPendingDelete.name} werd verwijderd uit het projectoverzicht.`,
      });
      setProjectPendingDelete(null);
    } catch (error) {
      setProjectDeleteError(error.message);
    } finally {
      setIsDeletingProject(false);
      setBusyProjectId(null);
    }
  }

  return (
    <section className="my-6 space-y-6 sm:my-8 sm:space-y-8 lg:my-10">
      <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-slate-950/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.36)] sm:rounded-[2.4rem] sm:p-8 lg:p-10">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.16),transparent_34%)]"
        />

        <div className="relative flex flex-col gap-6 sm:gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
              Projects command
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Werk projectdata bij zonder de API uit het oog te verliezen.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
              Dit overzicht flattent alle geneste projectrecords uit de
              bestaande client endpoints. Je kan elk project hier rechtstreeks
              updaten of verwijderen via `PUT` en `DELETE` op het juiste nested
              endpoint.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setActionFeedback(null);
                  setProjectCreateError("");
                  setIsCreateProjectOpen(true);
                }}
                disabled={!hasClients}
                className="w-full rounded-full border border-sky-300/25 bg-sky-300/12 px-5 py-3 text-sm font-semibold text-sky-50 transition duration-300 hover:bg-sky-300/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Add project
              </button>
              {!hasClients ? (
                <span className="max-w-sm text-sm leading-6 text-slate-400 sm:self-center">
                  Voeg eerst een klant toe voor je een project kan koppelen.
                </span>
              ) : null}
            </div>
          </div>

          <div className="w-full max-w-xl rounded-[1.6rem] border border-white/10 bg-white/6 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:rounded-[1.9rem] sm:p-5 xl:max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
              Value snapshot
            </p>
            <p className="mt-4 wrap-break-word text-3xl font-black tracking-tight text-white sm:mt-5 sm:text-4xl">
              {currencyFormatter.format(portfolio.totalBudget)}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {projectsValueCopy}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200">
                {portfolio.totalProjects} tracked
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200">
                {portfolio.inactiveProjects} not live
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          eyebrow="All projects"
          value={portfolio.totalProjects}
          label="Totaal aantal projecten"
          detail="Alle records uit de geneste project endpoints samen."
          accent="amber"
        />
        <DashboardMetricCard
          eyebrow="Active"
          value={portfolio.activeProjects}
          label="Live of in uitvoering"
          detail="Projecten die nu effectief actief staan."
          accent="sky"
        />
        <DashboardMetricCard
          eyebrow="Not live"
          value={portfolio.inactiveProjects}
          label="Nog niet live of al afgerond"
          detail="Handig om backlog of nazorg snel te spotten."
          accent="slate"
        />
        <DashboardMetricCard
          eyebrow="Average value"
          value={currencyFormatter.format(portfolio.averageProjectValue)}
          label="Gemiddelde projectwaarde"
          detail="Een snelle indicatie van de gemiddelde projectgrootte."
          accent="amber"
        />
      </div>

      {actionFeedback ? (
        <div
          className={`rounded-[1.4rem] border px-4 py-3 text-sm sm:rounded-[1.6rem] sm:px-5 sm:py-4 ${
            actionFeedback.tone === "success"
              ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-50"
              : "border-rose-300/25 bg-rose-400/10 text-rose-50"
          }`}
        >
          {actionFeedback.message}
        </div>
      ) : null}

      <div className="rounded-4xl border border-white/10 bg-slate-950/70 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.3)] sm:rounded-4xl sm:p-6">
        <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              Filtered projects
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Kies welke projectlaag je nu wil beheren.
            </h2>
          </div>

          <span className="inline-flex w-full justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 sm:w-auto">
            {filteredProjects.length} resultaten
          </span>
        </div>

        <div className="mt-6 grid gap-2 sm:flex sm:flex-wrap">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setActiveFilter(option.value)}
              className={`${filterButtonClassName} ${
                activeFilter === option.value
                  ? "border-white bg-white text-slate-950 shadow-lg shadow-white/10"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:gap-5 xl:grid-cols-2">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard
              key={`${project.clientId}-${project.id}`}
              project={project}
              isBusy={busyProjectId === project.id}
              onEdit={(selectedProject) => {
                setActionFeedback(null);
                setProjectEditorError("");
                setEditingProject(selectedProject);
              }}
              onDelete={(selectedProject) => {
                setActionFeedback(null);
                setProjectDeleteError("");
                setProjectPendingDelete(selectedProject);
              }}
            />
          ))
        ) : hasProjects ? (
          <div className="xl:col-span-2 rounded-4xl border border-dashed border-white/15 bg-white/5 px-5 py-8 text-center text-sm leading-6 text-slate-400 sm:rounded-4xl sm:px-6 sm:py-10">
            Geen projecten gevonden voor deze filter. Kies een andere status om
            meer records te tonen.
          </div>
        ) : hasClients ? (
          <div className="xl:col-span-2 rounded-4xl border border-dashed border-white/15 bg-white/5 px-5 py-10 text-center sm:rounded-4xl sm:px-6 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              Empty state
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Nog geen projecten gekoppeld.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:leading-7">
              Je klanten zijn al aanwezig. Voeg nu het eerste project toe om
              status, budget en pipeline zichtbaar te maken op deze pagina.
            </p>
            <button
              type="button"
              onClick={() => {
                setActionFeedback(null);
                setProjectCreateError("");
                setIsCreateProjectOpen(true);
              }}
              className="mt-6 w-full rounded-full border border-sky-300/25 bg-sky-300/12 px-5 py-3 text-sm font-semibold text-sky-50 transition duration-300 hover:bg-sky-300/20 sm:w-auto"
            >
              Create first project
            </button>
          </div>
        ) : (
          <div className="xl:col-span-2 rounded-4xl border border-dashed border-white/15 bg-white/5 px-5 py-10 text-center sm:rounded-4xl sm:px-6 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              Empty state
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Er zijn nog geen klanten om projecten aan te koppelen.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:leading-7">
              De API verwacht `POST /clients/:id/projects`, dus je hebt eerst
              minstens één klant nodig voordat je een project kan aanmaken.
            </p>
          </div>
        )}
      </div>

      {isCreateProjectOpen ? (
        <ProjectCreatorDialog
          clients={clients}
          error={projectCreateError}
          isSaving={isCreatingProject}
          onClose={() => {
            if (isCreatingProject) {
              return;
            }

            setProjectCreateError("");
            setIsCreateProjectOpen(false);
          }}
          onSubmit={handleProjectCreate}
        />
      ) : null}

      {editingProject ? (
        <ProjectEditorDialog
          key={`${editingProject.clientId}-${editingProject.id}`}
          project={editingProject}
          error={projectEditorError}
          isSaving={isSavingProject}
          onClose={() => {
            if (isSavingProject) {
              return;
            }

            setProjectEditorError("");
            setEditingProject(null);
          }}
          onSubmit={handleProjectUpdate}
        />
      ) : null}

      {projectPendingDelete ? (
        <ConfirmDialog
          key={`${projectPendingDelete.clientId}-${projectPendingDelete.id}`}
          eyebrow="Delete project"
          title={`Verwijder ${projectPendingDelete.name}?`}
          description={`Deze actie gebruikt \`DELETE /clients/${projectPendingDelete.clientId}/projects/${projectPendingDelete.id}\`.${projectDeleteError ? ` ${projectDeleteError}` : ""}`}
          confirmLabel={isDeletingProject ? "Deleting..." : "Delete project"}
          isLoading={isDeletingProject}
          onClose={() => {
            if (isDeletingProject) {
              return;
            }

            setProjectDeleteError("");
            setProjectPendingDelete(null);
          }}
          onConfirm={handleProjectDelete}
        />
      ) : null}
    </section>
  );
}

export default Projects;
