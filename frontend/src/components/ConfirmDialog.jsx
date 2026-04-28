import ModalPanel from "./ModalPanel.jsx";

const confirmButtonStyles = {
  danger:
    "border-rose-300/30 bg-rose-400/15 text-rose-50 hover:bg-rose-400/25",
  primary:
    "border-sky-300/30 bg-sky-400/15 text-sky-50 hover:bg-sky-400/25",
};

function ConfirmDialog({
  confirmLabel = "Confirm",
  description,
  eyebrow,
  isLoading = false,
  onClose,
  onConfirm,
  title,
  tone = "danger",
}) {
  const confirmButtonStyle =
    confirmButtonStyles[tone] ?? confirmButtonStyles.danger;

  return (
    <ModalPanel
      eyebrow={eyebrow}
      title={title}
      description={description}
      onClose={onClose}
      width="max-w-xl"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition duration-300 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`w-full rounded-full border px-5 py-3 text-sm font-semibold transition duration-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${confirmButtonStyle}`}
        >
          {isLoading ? "Processing..." : confirmLabel}
        </button>
      </div>
    </ModalPanel>
  );
}

export default ConfirmDialog;
