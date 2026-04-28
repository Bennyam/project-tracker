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

function getProjectFormState(project) {
  return {
    name: project?.name ?? "",
    description: project?.description ?? "",
    budget: project?.budget?.toString() ?? "",
    status: project?.status ?? "planned",
  };
}

function ProjectEditorDialog({ error, isSaving, onClose, onSubmit, project }) {
  const [formState, setFormState] = useState(() => getProjectFormState(project));

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
      description: formState.description.trim() || null,
      budget: Number.parseFloat(formState.budget),
      status: formState.status,
    });
  }

  return (
    <ModalPanel
      eyebrow="Project editor"
      title={`Werk ${project.name} bij`}
      description="De update wordt doorgestuurd naar het geneste project endpoint van deze client."
      onClose={onClose}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
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
            {isSaving ? "Saving..." : "Save project"}
          </button>
        </div>
      </form>
    </ModalPanel>
  );
}

export default ProjectEditorDialog;
