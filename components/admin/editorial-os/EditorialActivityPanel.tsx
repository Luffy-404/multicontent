import {
  aiNotifications,
  editorialActivity,
  publishingQueue,
  sourceAlerts,
} from "./mockData";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="admin-panel overflow-hidden rounded-lg">
      <div className="flex items-center justify-between border-b border-[color:var(--admin-line)] px-4 py-3">
        <h2 className="font-tight text-sm font-semibold text-[color:var(--admin-strong)]">{title}</h2>
        <span className="text-xs text-[color:var(--admin-muted)]">View all {"->"}</span>
      </div>
      {children}
    </section>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Error: "bg-red-400/12 text-red-300",
    Warning: "bg-amber-400/12 text-amber-300",
    Healthy: "bg-emerald-400/12 text-emerald-300",
  };

  return <span className={`rounded px-2 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>;
}

export function EditorialActivityPanel() {
  return (
    <aside className="space-y-4 px-4 pb-5 lg:sticky lg:top-0 lg:h-screen lg:w-[372px] lg:shrink-0 lg:overflow-y-auto lg:border-l lg:border-[color:var(--admin-line)] lg:py-3">
      <Panel title="Publishing Queue">
        <div className="divide-y divide-[color:var(--admin-line)]">
          {publishingQueue.map((title, index) => (
            <div key={title} className="flex gap-3 px-4 py-3">
              <div className="h-12 w-14 shrink-0 rounded-md bg-cyan-400/10 ring-1 ring-cyan-300/10" />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium text-[color:var(--admin-strong)]">{title}</p>
                <p className="mt-1 text-xs text-[color:var(--admin-muted)]">
                  {index < 2 ? "Today" : "Tomorrow"}, {index + 9}:00 AM
                </p>
              </div>
              <span className="self-center rounded-full border border-[color:var(--admin-line)] px-2 py-1 text-[11px] text-[color:var(--admin-muted)]">
                Scheduled
              </span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Recent Editorial Activity">
        <div className="divide-y divide-[color:var(--admin-line)]">
          {editorialActivity.map((item) => (
            <div key={`${item.person}-${item.time}`} className="flex gap-3 px-4 py-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cyan-400/10 text-xs font-semibold text-cyan-300">
                {item.person.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[color:var(--admin-muted)]">
                  <span className="font-medium text-[color:var(--admin-strong)]">{item.person}</span>{" "}
                  {item.action}
                </p>
                <p className="truncate text-xs text-[color:var(--admin-muted)]">{item.story}</p>
              </div>
              <span className="shrink-0 text-xs text-[color:var(--admin-faint)]">{item.time}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Source Health Alerts">
        <div className="divide-y divide-[color:var(--admin-line)]">
          {sourceAlerts.map((alert) => (
            <div key={alert.source} className="flex items-center gap-3 px-4 py-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[color:var(--admin-line)] text-xs text-[color:var(--admin-muted)]">
                S
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[color:var(--admin-strong)]">{alert.source}</p>
                <p className="truncate text-xs text-[color:var(--admin-muted)]">{alert.detail}</p>
              </div>
              <StatusPill status={alert.status} />
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="AI Review Notifications">
        <div className="divide-y divide-[color:var(--admin-line)]">
          {aiNotifications.map((item) => (
            <div key={item.label} className="flex items-center gap-3 px-4 py-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-purple-400/10 text-xs font-semibold text-purple-300">
                AI
              </div>
              <p className="min-w-0 flex-1 truncate text-sm text-[color:var(--admin-strong)]">{item.label}</p>
              <span className="text-xs text-[color:var(--admin-muted)]">{item.area}</span>
            </div>
          ))}
        </div>
      </Panel>
    </aside>
  );
}
