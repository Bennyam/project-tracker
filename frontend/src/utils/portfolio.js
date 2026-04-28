const currencyFormatter = new Intl.NumberFormat("nl-BE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function flattenProjects(clients = []) {
  return clients.flatMap((client) =>
    (client.projects ?? []).map((project) => ({
      ...project,
      clientId: client.id,
      clientName: client.name,
      company: client.company || client.name,
      clientStatus: client.status,
    })),
  );
}

function summarizePortfolio(clients = []) {
  const projects = flattenProjects(clients);
  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (project) => project.status?.toLowerCase() === "active",
  ).length;
  const inactiveProjects = projects.filter(
    (project) => project.status?.toLowerCase() !== "active",
  ).length;
  const plannedProjects = projects.filter(
    (project) => project.status?.toLowerCase() === "planned",
  ).length;
  const completedProjects = projects.filter(
    (project) => project.status?.toLowerCase() === "completed",
  ).length;
  const totalBudget = projects.reduce(
    (sum, project) => sum + Number(project.budget ?? 0),
    0,
  );
  const activeClients = clients.filter(
    (client) => client.status?.toLowerCase() === "active",
  ).length;
  const averageProjectValue =
    totalProjects > 0 ? totalBudget / totalProjects : 0;
  const topProject = projects.reduce((bestProject, project) => {
    if (!bestProject) {
      return project;
    }

    return Number(project.budget ?? 0) > Number(bestProject.budget ?? 0)
      ? project
      : bestProject;
  }, null);

  return {
    projects,
    totalProjects,
    activeProjects,
    inactiveProjects,
    plannedProjects,
    completedProjects,
    totalBudget,
    activeClients,
    averageProjectValue,
    topProject,
  };
}

export { currencyFormatter, flattenProjects, summarizePortfolio };
