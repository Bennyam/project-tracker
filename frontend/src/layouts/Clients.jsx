import { useState } from "react";
import Client from "../components/Client.jsx";
import ClientCreatorDialog from "../components/ClientCreatorDialog.jsx";
import ClientEditorDialog from "../components/ClientEditorDialog.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import useClientsWithProjects from "../hooks/clients.with.projects.jsx";
import {
  createClient,
  deleteClient,
  updateClient,
} from "../services/api.service.js";
import { currencyFormatter, summarizePortfolio } from "../utils/portfolio.js";

function Clients() {
  const { isLoading, error, clients, refetchClients } =
    useClientsWithProjects();
  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientPendingDelete, setClientPendingDelete] = useState(null);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [isSavingClient, setIsSavingClient] = useState(false);
  const [isDeletingClient, setIsDeletingClient] = useState(false);
  const [busyClientId, setBusyClientId] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);
  const [clientCreateError, setClientCreateError] = useState("");
  const [clientEditorError, setClientEditorError] = useState("");
  const [clientDeleteError, setClientDeleteError] = useState("");

  if (isLoading) {
    return (
      <section className="my-6 space-y-5 sm:my-8 sm:space-y-6 lg:my-10">
        <div className="rounded-4xl border border-white/10 bg-slate-950/70 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.32)] sm:p-8">
          <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />
          <div className="mt-5 h-14 max-w-2xl animate-pulse rounded-3xl bg-white/10" />
          <div className="mt-4 h-6 max-w-xl animate-pulse rounded-full bg-white/10" />
        </div>

        <div className="grid gap-5">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-80 animate-pulse rounded-4xl border border-white/10 bg-white/5"
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
            Clients konden niet geladen worden.
          </h1>
          <p className="mt-3 text-sm leading-6">{error}</p>
        </div>
      </section>
    );
  }

  const {
    totalProjects,
    activeClients,
    totalBudget: combinedBudget,
  } = summarizePortfolio(clients);

  async function handleClientCreate(payload) {
    setClientCreateError("");
    setIsCreatingClient(true);

    try {
      await createClient(payload);
      await refetchClients({ silent: true });
      setActionFeedback({
        tone: "success",
        message: `${payload.name} werd succesvol toegevoegd als nieuwe klant.`,
      });
      setIsCreateClientOpen(false);
    } catch (error) {
      setClientCreateError(error.message);
    } finally {
      setIsCreatingClient(false);
    }
  }

  async function handleClientUpdate(payload) {
    if (!editingClient) {
      return;
    }

    setClientEditorError("");
    setIsSavingClient(true);
    setBusyClientId(editingClient.id);

    try {
      await updateClient(editingClient.id, payload);
      await refetchClients({ silent: true });
      setActionFeedback({
        tone: "success",
        message: `${payload.name} werd succesvol bijgewerkt.`,
      });
      setEditingClient(null);
    } catch (error) {
      setClientEditorError(error.message);
    } finally {
      setIsSavingClient(false);
      setBusyClientId(null);
    }
  }

  async function handleClientDelete() {
    if (!clientPendingDelete) {
      return;
    }

    setClientDeleteError("");
    setIsDeletingClient(true);
    setBusyClientId(clientPendingDelete.id);

    try {
      await deleteClient(clientPendingDelete.id);
      await refetchClients({ silent: true });
      setActionFeedback({
        tone: "success",
        message: `${clientPendingDelete.company || clientPendingDelete.name} werd verwijderd, inclusief gekoppelde projecten.`,
      });
      setClientPendingDelete(null);
    } catch (error) {
      setClientDeleteError(error.message);
    } finally {
      setIsDeletingClient(false);
      setBusyClientId(null);
    }
  }

  return (
    <section className="my-6 space-y-6 sm:my-8 sm:space-y-8 lg:my-10">
      <div className="rounded-4xl border border-white/10 bg-slate-950/70 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.32)] sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
              Client portfolio
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Alle klanten, projecten en budgetten in een helder overzicht.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-300 sm:leading-7">
              Deze pagina combineert de clientgegevens met alle gekoppelde
              projecten uit de API, zodat je meteen ziet waar de aandacht en de
              omzet zitten.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400 sm:leading-7">
              Gebruik de actions per client om contactinfo bij te werken of een
              relatie volledig op te ruimen via de bestaande `PUT` en `DELETE`
              endpoints.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setActionFeedback(null);
                  setClientCreateError("");
                  setIsCreateClientOpen(true);
                }}
                className="w-full rounded-full border border-amber-300/25 bg-amber-300/12 px-5 py-3 text-sm font-semibold text-amber-50 transition duration-300 hover:bg-amber-300/20 sm:w-auto"
              >
                Add client
              </button>
            </div>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-md lg:min-w-88">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Clients
              </p>
              <p className="mt-3 text-3xl font-black text-white">
                {clients.length}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Active
              </p>
              <p className="mt-3 text-3xl font-black text-white">
                {activeClients}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Budget
              </p>
              <p className="mt-3 text-2xl font-black text-white">
                {currencyFormatter.format(combinedBudget)}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {totalProjects} {totalProjects === 1 ? "project" : "projecten"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {actionFeedback ? (
        <div
          className={`rounded-[1.6rem] border px-5 py-4 text-sm ${
            actionFeedback.tone === "success"
              ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-50"
              : "border-rose-300/25 bg-rose-400/10 text-rose-50"
          }`}
        >
          {actionFeedback.message}
        </div>
      ) : null}

      {clients.length > 0 ? (
        <div className="flex flex-col gap-5">
          {clients.map((client) => (
            <Client
              key={client.id}
              client={client}
              isBusy={busyClientId === client.id}
              onEdit={(selectedClient) => {
                setActionFeedback(null);
                setClientEditorError("");
                setEditingClient(selectedClient);
              }}
              onDelete={(selectedClient) => {
                setActionFeedback(null);
                setClientDeleteError("");
                setClientPendingDelete(selectedClient);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-4xl border border-dashed border-white/15 bg-white/5 px-5 py-10 text-center sm:px-6 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
            Empty state
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
            Nog geen klanten aanwezig.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            Voeg je eerste klant toe om contactgegevens, gekoppelde projecten en
            budgetten op te bouwen in dit overzicht.
          </p>
          <button
            type="button"
            onClick={() => {
              setActionFeedback(null);
              setClientCreateError("");
              setIsCreateClientOpen(true);
            }}
            className="mt-6 w-full rounded-full border border-amber-300/25 bg-amber-300/12 px-5 py-3 text-sm font-semibold text-amber-50 transition duration-300 hover:bg-amber-300/20 sm:w-auto"
          >
            Create first client
          </button>
        </div>
      )}

      {isCreateClientOpen ? (
        <ClientCreatorDialog
          error={clientCreateError}
          isSaving={isCreatingClient}
          onClose={() => {
            if (isCreatingClient) {
              return;
            }

            setClientCreateError("");
            setIsCreateClientOpen(false);
          }}
          onSubmit={handleClientCreate}
        />
      ) : null}

      {editingClient ? (
        <ClientEditorDialog
          key={editingClient.id}
          client={editingClient}
          error={clientEditorError}
          isSaving={isSavingClient}
          onClose={() => {
            if (isSavingClient) {
              return;
            }

            setClientEditorError("");
            setEditingClient(null);
          }}
          onSubmit={handleClientUpdate}
        />
      ) : null}

      {clientPendingDelete ? (
        <ConfirmDialog
          key={clientPendingDelete.id}
          eyebrow="Delete client"
          title={`Verwijder ${clientPendingDelete.company || clientPendingDelete.name}?`}
          description={`Deze actie gebruikt \`DELETE /clients/${clientPendingDelete.id}\` en verwijdert ook alle gekoppelde projecten.${clientDeleteError ? ` ${clientDeleteError}` : ""}`}
          confirmLabel={isDeletingClient ? "Deleting..." : "Delete client"}
          isLoading={isDeletingClient}
          onClose={() => {
            if (isDeletingClient) {
              return;
            }

            setClientDeleteError("");
            setClientPendingDelete(null);
          }}
          onConfirm={handleClientDelete}
        />
      ) : null}
    </section>
  );
}

export default Clients;
