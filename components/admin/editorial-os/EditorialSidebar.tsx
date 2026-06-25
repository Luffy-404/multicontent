import { editor, sidebarSections } from "./mockData";

function AdminGlyph({ label }: { label: string }) {
  return (
    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md border border-[color:var(--admin-line)] text-[10px] font-semibold text-[color:var(--admin-muted)]">
      {label.slice(0, 1)}
    </span>
  );
}

export function EditorialSidebar() {
  return (
    <aside className="admin-panel flex min-h-screen w-full flex-col border-y-0 border-l-0 px-3 py-4 lg:sticky lg:top-0 lg:h-screen lg:w-[252px] lg:shrink-0">
      <div className="flex items-center gap-3 px-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/15 text-lg font-black text-cyan-300">
          M
        </div>
        <p className="font-tight text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--admin-strong)]">
          Multicontent
        </p>
      </div>

      <nav className="mt-5 flex-1 overflow-y-auto pr-1" aria-label="Editorial OS navigation">
        <a
          href="#dashboard"
          className="flex h-11 items-center gap-3 rounded-lg bg-cyan-400/10 px-3 text-sm font-semibold text-cyan-300 ring-1 ring-cyan-300/10"
        >
          <AdminGlyph label="Dashboard" />
          Dashboard
        </a>

        <div className="mt-5 space-y-5">
          {sidebarSections.map((section) => (
            <section key={section.label}>
              <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--admin-faint)]">
                {section.label}
              </p>
              <div className="mt-2 grid gap-1">
                {section.items.map((item) => (
                  <a
                    key={item.label}
                    href={`#${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex h-9 items-center gap-3 rounded-lg px-3 text-sm text-[color:var(--admin-muted)] transition hover:bg-[color:var(--admin-hover)] hover:text-[color:var(--admin-strong)]"
                  >
                    <AdminGlyph label={item.label} />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.count ? (
                      <span className="rounded-full bg-[color:var(--admin-chip)] px-2 py-0.5 text-xs font-semibold text-[color:var(--admin-strong)]">
                        {item.count}
                      </span>
                    ) : null}
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </nav>

      <div className="mt-4 rounded-xl border border-[color:var(--admin-line)] bg-[color:var(--admin-card)] p-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-cyan-400/15 text-sm font-bold text-cyan-300">
            E
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[color:var(--admin-strong)]">{editor.name}</p>
            <p className="truncate text-xs text-[color:var(--admin-muted)]">{editor.title}</p>
          </div>
          <span className="text-[color:var(--admin-muted)]">v</span>
        </div>
      </div>
    </aside>
  );
}
