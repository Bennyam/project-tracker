import { useCallback, useEffect, useState } from "react";
import { fetchClientProjects, fetchClients } from "../services/api.service.js";

function useClientsWithProjects() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadClients = useCallback(async (options = {}) => {
    const { silent = false } = options;

    try {
      if (!silent) {
        setError("");
        setIsLoading(true);
      }

      const clientData = await fetchClients();
      const clientsWithProjects = await Promise.all(
        clientData.map(async (client) => {
          const projects = await fetchClientProjects(client.id);
          return {
            ...client,
            projects,
          };
        }),
      );

      setClients(clientsWithProjects);
      return clientsWithProjects;
    } catch (error) {
      const message = `${error.message} Something went wrong.`;

      if (!silent) {
        setError(message);
      }

      throw new Error(message, { cause: error });
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    async function init() {
      try {
        await loadClients();
      } catch {
        // The fetch error is already surfaced via local state.
      }
    }

    init();
  }, [loadClients]);

  return { clients, error, isLoading, refetchClients: loadClients };
}

export default useClientsWithProjects;
