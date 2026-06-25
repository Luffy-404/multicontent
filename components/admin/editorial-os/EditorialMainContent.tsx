import {
  kpis,
  performanceSeries,
  pipeline,
  recentStories,
  trendingContent,
} from "./mockData";

const toneClass: Record<string, string> = {
  success: "text-emerald-300",
  warning: "text-amber-300",
  danger: "text-red-300",
  successCard: "border-emerald-300/20 bg-emerald-400/10 text-emerald-300",
  warningCard: "border-amber-300/20 bg-amber-400/10 text-amber-300",
  dangerCard: "border-red-300/20 bg-red-400/10 text-red-300",
  cyan: "border-cyan-300/40 bg-cyan-400/10 text-cyan-300",
  purple: "border-purple-300/40 bg-purple-400/10 text-purple-300",
  amber: "border-amber-300/40 bg-amber-400/10 text-amber-300",
  yellow: "border-yellow-300/40 bg-yellow-400/10 text-yellow-300",
  green: "border-emerald-300/40 bg-emerald-400/10 text-emerald-300",
};

function Panel({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`admin-panel rounded-lg ${className}`}>
      {children}
    </section>
  );
}

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[color:var(--admin-line)] px-4 py-3">
      <h2 className="font-tight text-base font-semibold text-[color:var(--admin-strong)]">{title}</h2>
      {action ? <span className="text-xs text-[color:var(--admin-muted)]">{action}</span> : null}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Published: "bg-emerald-400/12 text-emerald-300",
    Review: "bg-amber-400/12 text-amber-300",
    Scheduled: "bg-cyan-400/12 text-cyan-300",
    Draft: "bg-[color:var(--admin-chip)] text-[color:var(--admin-muted)]",
  };

  return (
    <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${styles[status] ?? styles.Draft}`}>
      {status}
    </span>
  );
}

function Thumbnail({ tone, label }: { tone: string; label: string }) {
  return (
    <div className={`relative h-10 w-16 shrink-0 overflow-hidden rounded-md bg-gradient-to-br ${tone}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.55),transparent_28%),linear-gradient(135deg,transparent,rgba(0,0,0,0.35))]" />
      <span className="absolute bottom-1 left-1 rounded bg-black/35 px-1.5 py-0.5 text-[10px] font-semibold text-white">
        {label.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

function ChartLine({
  points,
  color,
}: {
  points: string;
  color: string;
}) {
  return (
    <polyline
      points={points}
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
  );
}

export function EditorialMainContent() {
  return (
    <main id="dashboard" className="min-w-0 flex-1 space-y-4 px-4 py-5 lg:px-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {kpis.map((item) => (
          <Panel key={item.label} className="overflow-hidden p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="max-w-[9rem] text-xs leading-5 text-[color:var(--admin-muted)]">{item.label}</p>
              <span className={`grid h-9 w-9 place-items-center rounded-full border text-xs font-semibold ${toneClass[`${item.tone}Card`]}`}>
                {item.icon}
              </span>
            </div>
            <p className="mt-3 font-tight text-3xl font-semibold text-[color:var(--admin-strong)]">{item.value}</p>
            <p className={`mt-2 text-xs font-semibold ${toneClass[item.tone]}`}>{item.trend}</p>
          </Panel>
        ))}
      </div>

      <Panel id="pipeline" className="p-4">
        <h2 className="font-tight text-base font-semibold text-[color:var(--admin-strong)]">
          Editorial Pipeline
        </h2>
        <div className="mt-7 grid gap-5 md:grid-cols-5">
          {pipeline.map((step, index) => (
            <div key={step.label} className="relative text-center">
              {index < pipeline.length - 1 ? (
                <div className="pointer-events-none absolute left-[58%] top-10 hidden h-px w-[84%] bg-[color:var(--admin-line)] md:block" />
              ) : null}
              <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full border text-xl font-semibold ${toneClass[step.tone]}`}>
                {index + 1}
              </div>
              <p className="mt-3 text-xs text-[color:var(--admin-muted)]">{step.label}</p>
              <p className="mt-2 font-tight text-2xl font-semibold text-[color:var(--admin-strong)]">{step.value}</p>
              <p className="text-xs text-[color:var(--admin-muted)]">{step.detail}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_0.8fr]">
        <Panel id="articles" className="overflow-hidden">
          <SectionTitle title="Recent Stories" action={`View all articles ->`} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs text-[color:var(--admin-muted)]">
                <tr>
                  {["Headline", "Source", "Status", "Editor", "Published Time"].map((heading) => (
                    <th key={heading} className="px-4 py-3 font-medium">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentStories.map((story) => (
                  <tr key={story.headline} className="border-t border-[color:var(--admin-line)]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Thumbnail tone={story.imageTone} label={story.source} />
                        <span className="max-w-[310px] font-medium text-[color:var(--admin-strong)]">
                          {story.headline}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[color:var(--admin-muted)]">{story.source}</td>
                    <td className="px-4 py-3"><StatusBadge status={story.status} /></td>
                    <td className="px-4 py-3 text-[color:var(--admin-muted)]">{story.editor}</td>
                    <td className="px-4 py-3 text-[color:var(--admin-muted)]">{story.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel id="trending" className="overflow-hidden">
          <SectionTitle title="Trending Content" action={`View all ->`} />
          <div>
            {trendingContent.map((item, index) => (
              <div key={item.title} className="flex gap-3 border-t border-[color:var(--admin-line)] px-4 py-3 first:border-t-0">
                <span className="pt-1 text-sm font-semibold text-cyan-300">{index + 1}</span>
                <Thumbnail tone={item.imageTone} label={item.title} />
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-medium text-[color:var(--admin-strong)]">{item.title}</p>
                  <p className="mt-1 text-xs text-[color:var(--admin-muted)]">{item.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel id="analytics" className="p-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-tight text-base font-semibold text-[color:var(--admin-strong)]">
            Article Performance
          </h2>
          <span className="rounded-lg border border-[color:var(--admin-line)] px-3 py-1.5 text-xs text-[color:var(--admin-muted)]">
            This Week
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-5 text-xs text-[color:var(--admin-muted)]">
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-400" />Page Views</span>
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-300" />Unique Visitors</span>
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-purple-400" />Shares</span>
        </div>
        <div className="relative mt-4 h-64 overflow-hidden rounded-lg border border-[color:var(--admin-line)] bg-[color:var(--admin-card)]">
          <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-[color:var(--admin-line)]" />
          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-[color:var(--admin-line)]" />
          <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-[color:var(--admin-line)]" />
          <svg viewBox="0 0 700 220" className="h-full w-full px-4 py-5" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="viewsFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgb(56 189 248)" stopOpacity="0.24" />
                <stop offset="100%" stopColor="rgb(56 189 248)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points="0,130 110,112 225,84 335,104 450,76 565,98 700,82 700,220 0,220" fill="url(#viewsFill)" />
            <ChartLine points="0,130 110,112 225,84 335,104 450,76 565,98 700,82" color="rgb(56 189 248)" />
            <ChartLine points="0,166 110,146 225,132 335,140 450,116 565,132 700,124" color="rgb(103 232 249)" />
            <ChartLine points="0,204 110,202 225,201 335,194 450,184 565,190 700,186" color="rgb(192 132 252)" />
          </svg>
          <div className="absolute bottom-3 left-4 right-4 flex justify-between text-xs text-[color:var(--admin-muted)]">
            {performanceSeries.map((item) => (
              <span key={item.day}>{item.day}</span>
            ))}
          </div>
        </div>
      </Panel>
    </main>
  );
}
