import { useState } from "react";
import ModalPanel from "./ModalPanel.jsx";

const inputClassName =
  "w-full rounded-[1.15rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-sky-200/45 focus:bg-white/10";
const labelClassName =
  "text-xs font-semibold uppercase tracking-[0.24em] text-slate-400";
const projectStatusOptions = [
  { value: "planned", label: "Planned" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

function getInitialClientId(clients) {
  return clients[0]?.id?.toString() ?? "";
}

function ProjectCreatorDialog({ clients, error, isSaving, onClose, onSubmit }) {
  const [formState, setFormState] = useState({
    clientId: getInitialClientId(clients),
    name: "",
    description: "",
    budget: "",
    status: "planned",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      clientId: Number(formState.clientId),
      payload: {
        name: formState.name.trim(),
        description: formState.description.trim() || null,
        budget: Number.parseFloat(formState.budget),
        status: formState.status,
      },
    });
  }

  return (
    <ModalPanel
      eyebrow="New project"
      title="Voeg een nieuw project toe"
      description="Deze flow gebruikt `POST /clients/{id}/projects` en koppelt het project direct aan de gekozen klant."
      onClose={onClose}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className={labelClassName}>Client</span>
            <select
              required
              name="clientId"
              value={formState.clientId}
              onChange={handleChange}
              className={inputClassName}
            >
              {clients.map((client) => (
                <option
                  key={client.id}
                  value={client.id}
                  className="bg-slate-950 text-white"
                >
                  {client.company || client.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className={labelClassName}>Status</span>
            <select
              name="status"
              value={formState.status}
              onChange={handleChange}
              className={inputClassName}
            >
              {projectStatusOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-slate-950 text-white"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_0.45fr]">
          <label className="space-y-2">
            <span className={labelClassName}>Project name</span>
            <input
              required
              minLength={3}
              name="name"
              value={formState.name}
              onChange={handleChange}
              className={inputClassName}
              placeholder="Landing page redesign"
            />
          </label>

          <label className="space-y-2">
            <span className={labelClassName}>Budget</span>
            <input
              required
              min={0.01}
              step="0.01"
              type="number"
              name="budget"
              value={formState.budget}
              onChange={handleChange}
              className={inputClassName}
              placeholder="2500"
            />
          </label>
        </div>

        <label className="space-y-2">
          <span className={labelClassName}>Description</span>
          <textarea
            rows={4}
            name="description"
            value={formState.description}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Kort projectdoel of scope."
          />
        </label>

        {error ? (
          <div className="rounded-[1.2rem] border border-rose-300/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition duration-300 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-full border border-sky-300/25 bg-sky-300/12 px-5 py-3 text-sm font-semibold text-sky-50 transition duration-300 hover:bg-sky-300/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSaving ? "Creating..." : "Create project"}
          </button>
        </div>
      </form>
    </ModalPanel>
  );
}

export default ProjectCreatorDialog;
