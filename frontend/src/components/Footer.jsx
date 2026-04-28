import { NavLink } from "react-router-dom";

const year = new Date().getFullYear().toString();
const quickLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/clients", label: "Clients" },
  { to: "/projects", label: "Projects" },
];
const stackBadges = ["React 19", "React Router 7", "FastAPI", "SQLite"];

function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-slate-950/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.4fr_0.9fr_1fr]">
          <div className="space-y-4">
            <div className="inline-flex w-max items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300 sm:tracking-[0.28em]">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.6)]" />
              Live workspace
            </div>
            <div>
              <p className="wrap-break-word text-2xl font-black tracking-tight text-white">
                Project Tracker
              </p>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                Een centrale plek om clients, gekoppelde projecten en budget
                direct in context te bekijken.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              Navigate
            </p>
            <div className="flex flex-col gap-2 text-sm font-medium text-slate-300">
              {quickLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `transition duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 hover:text-amber-200"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {stackBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 text-center text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <span>&copy; Built by Ben Ameryckx {year}</span>
          <span className="sm:text-right">
            Designed for fast client and project context.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
