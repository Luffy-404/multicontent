import { editor } from "./mockData";

export function EditorialTopHeader() {
  return (
    <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div>
        <h1 className="font-tight text-2xl font-semibold text-[color:var(--admin-strong)] sm:text-3xl">
          Welcome back, {editor.name}
        </h1>
        <p className="mt-1 text-sm text-[color:var(--admin-muted)]">
          Here's what's happening in your newsroom today.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block sm:w-[420px]">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[color:var(--admin-faint)]">
            Search
          </span>
          <input
            className="admin-input h-11 rounded-lg pl-16 pr-16 text-sm"
            placeholder="stories, sources, keywords..."
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-[color:var(--admin-line)] px-2 py-0.5 text-xs text-[color:var(--admin-muted)]">
            Cmd K
          </span>
        </label>

        <div className="flex items-center gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-[color:var(--admin-line)] text-[color:var(--admin-muted)] transition hover:bg-[color:var(--admin-hover)]">
            N
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-[color:var(--admin-line)] text-[color:var(--admin-muted)] transition hover:bg-[color:var(--admin-hover)]">
            T
          </button>
          <button className="h-10 rounded-lg border border-cyan-300/20 bg-cyan-400/10 px-4 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/15">
            Quick Actions
          </button>
        </div>
      </div>
    </header>
  );
}
