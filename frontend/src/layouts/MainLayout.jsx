import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const navigationItems = [
  { to: "/", label: "Dashboard" },
  { to: "/clients", label: "Clients" },
  { to: "/projects", label: "Projects" },
];

function MainLayout() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-20 -z-10 h-48 w-48 rounded-full bg-amber-300/10 blur-3xl sm:top-24 sm:h-72 sm:w-72"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-72 -z-10 h-56 w-56 rounded-full bg-sky-300/10 blur-3xl sm:top-80 sm:h-80 sm:w-80"
      />
      <Navbar brand="Project Tracker">
        {navigationItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `inline-flex w-full min-w-0 items-center justify-center rounded-full px-4 py-2.5 text-center text-sm font-semibold tracking-[0.02em] transition duration-300 sm:w-auto ${
                isActive
                  ? "bg-white text-slate-900! shadow-lg shadow-amber-200/30"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </Navbar>
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-3 pb-12 pt-6 sm:px-6 sm:pb-14 sm:pt-8 lg:px-8 lg:pb-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
