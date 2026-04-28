const API_BASE_URL = "http://127.0.0.1:8000";

function getErrorMessage(payload, fallbackMessage) {
  if (!payload) {
    return fallbackMessage;
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (typeof payload.detail === "string") {
    return payload.detail;
  }

  if (Array.isArray(payload.detail)) {
    return payload.detail
      .map((issue) => issue.msg || "Validation error.")
      .join(" ");
  }

  return fallbackMessage;
}

async function request(
  path,
  options = {},
  fallbackMessage = "Request failed.",
) {
  const headers =
    options.body !== undefined
      ? {
          "Content-Type": "application/json",
          ...(options.headers ?? {}),
        }
      : options.headers;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const contentType = response.headers.get("content-type") || "";
  const isEmptyResponse =
    response.status === 204 ||
    response.status === 205 ||
    options.method === "HEAD";
  const rawPayload = isEmptyResponse ? "" : await response.text();
  const payload = rawPayload
    ? contentType.includes("application/json")
      ? JSON.parse(rawPayload)
      : rawPayload
    : null;

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, fallbackMessage));
  }

  if (isEmptyResponse) {
    return null;
  }

  return payload;
}

async function fetchClients() {
  return request("/clients/", {}, "Failed to fetch clients.");
}

async function createClient(payload) {
  return request(
    "/clients/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    "Failed to create client.",
  );
}

async function fetchClientProjects(clientId) {
  return request(
    `/clients/${clientId}/projects`,
    {},
    "Failed to fetch projects.",
  );
}

async function createProject(clientId, payload) {
  return request(
    `/clients/${clientId}/projects`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    "Failed to create project.",
  );
}

async function updateClient(clientId, payload) {
  return request(
    `/clients/${clientId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    "Failed to update client.",
  );
}

async function deleteClient(clientId) {
  return request(
    `/clients/${clientId}`,
    {
      method: "DELETE",
    },
    "Failed to delete client.",
  );
}

async function updateProject(clientId, projectId, payload) {
  return request(
    `/clients/${clientId}/projects/${projectId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    "Failed to update project.",
  );
}

async function deleteProject(clientId, projectId) {
  return request(
    `/clients/${clientId}/projects/${projectId}`,
    {
      method: "DELETE",
    },
    "Failed to delete project.",
  );
}

export {
  createClient,
  createProject,
  deleteClient,
  deleteProject,
  fetchClientProjects,
  fetchClients,
  updateClient,
  updateProject,
};
