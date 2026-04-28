function Navbar({ brand, children }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/65 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-3 py-3 sm:px-6 sm:py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-amber-300 via-orange-400 to-rose-500 text-sm font-black uppercase tracking-[0.18em] text-slate-950 shadow-[0_16px_40px_rgba(249,115,22,0.28)] sm:h-12 sm:w-12">
            PT
          </div>
          <div className="min-w-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-400 sm:tracking-[0.36em]">
              Client operations
            </p>
            <p className="wrap-break-word text-2xl font-black tracking-tight text-white sm:text-4xl">
              {brand}
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 rounded-3xl border border-white/10 bg-white/5 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:rounded-full">
          {children}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
