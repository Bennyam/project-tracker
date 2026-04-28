import { useState } from "react";
import ModalPanel from "./ModalPanel.jsx";

const inputClassName =
  "w-full rounded-[1.15rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-amber-200/45 focus:bg-white/10";
const labelClassName =
  "text-xs font-semibold uppercase tracking-[0.24em] text-slate-400";
const clientStatusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

function getClientFormState(client) {
  return {
    name: client?.name ?? "",
    email: client?.email ?? "",
    company: client?.company ?? "",
    status: client?.status ?? "active",
  };
}

function ClientEditorDialog({ client, error, isSaving, onClose, onSubmit }) {
  const [formState, setFormState] = useState(() => getClientFormState(client));

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
      name: formState.name.trim(),
      email: formState.email.trim(),
      company: formState.company.trim() || null,
      status: formState.status,
    });
  }

  return (
    <ModalPanel
      eyebrow="Client editor"
      title={`Werk ${client.company || client.name} bij`}
      description="Pas de contactgegevens of status aan. De wijzigingen worden rechtstreeks via de client endpoint doorgestuurd."
      onClose={onClose}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className={labelClassName}>Contact name</span>
            <input
              required
              minLength={3}
              name="name"
              value={formState.name}
              onChange={handleChange}
              className={inputClassName}
              placeholder="John Doe"
            />
          </label>

          <label className="space-y-2">
            <span className={labelClassName}>Status</span>
            <select
              name="status"
              value={formState.status}
              onChange={handleChange}
              className={inputClassName}
            >
              {clientStatusOptions.map((option) => (
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

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className={labelClassName}>Email</span>
            <input
              required
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              className={inputClassName}
              placeholder="client@example.com"
            />
          </label>

          <label className="space-y-2">
            <span className={labelClassName}>Company</span>
            <input
              name="company"
              value={formState.company}
              onChange={handleChange}
              className={inputClassName}
              placeholder="Studio or agency"
            />
          </label>
        </div>

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
            className="w-full rounded-full border border-amber-300/25 bg-amber-300/12 px-5 py-3 text-sm font-semibold text-amber-50 transition duration-300 hover:bg-amber-300/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSaving ? "Saving..." : "Save client"}
          </button>
        </div>
      </form>
    </ModalPanel>
  );
}

export default ClientEditorDialog;
