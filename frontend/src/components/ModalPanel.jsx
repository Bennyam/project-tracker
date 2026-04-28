import { useEffect } from "react";

function ModalPanel({
  children,
  description,
  eyebrow,
  onClose,
  title,
  width = "max-w-2xl",
}) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative my-4 max-h-[calc(100vh-1.5rem)] w-full ${width} overflow-y-auto rounded-[1.75rem] border border-white/10 bg-slate-950/95 shadow-[0_30px_90px_rgba(2,6,23,0.55)] sm:my-0 sm:max-h-[calc(100vh-3rem)] sm:rounded-4xl`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.16),transparent_34%)]"
        />

        <div className="relative p-5 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
                {eyebrow}
              </p>
              <h2 className="mt-3 wrap-break-word text-2xl font-black tracking-tight text-white sm:text-3xl">
                {title}
              </h2>
              {description ? (
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {description}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition duration-300 hover:bg-white/10 hover:text-white sm:self-auto"
            >
              Close
            </button>
          </div>

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default ModalPanel;
