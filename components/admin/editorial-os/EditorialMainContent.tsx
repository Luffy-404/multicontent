import { StoryActions } from "@/components/admin/StoryActions";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  FileText,
  Newspaper,
  PenLine,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type {
  AdminDashboardData,
  StoryAction,
  StoryListItem,
} from "@/lib/editorialTypes";

const toneClass: Record<string, string> = {
  success: "text-emerald-300",
  warning: "text-amber-300",
  danger: "text-red-300",
  neutral: "text-[color:var(--admin-muted)]",
  successCard: "border-emerald-300/20 bg-emerald-400/10 text-emerald-300",
  warningCard: "border-amber-300/20 bg-amber-400/10 text-amber-300",
  dangerCard: "border-red-300/20 bg-red-400/10 text-red-300",
  neutralCard: "border-[color:var(--admin-line)] bg-[color:var(--admin-chip)] text-[color:var(--admin-muted)]",
  cyan: "border-cyan-300/40 bg-cyan-400/10 text-cyan-300",
  purple: "border-purple-300/40 bg-purple-400/10 text-purple-300",
  amber: "border-amber-300/40 bg-amber-400/10 text-amber-300",
  yellow: "border-yellow-300/40 bg-yellow-400/10 text-yellow-300",
  green: "border-emerald-300/40 bg-emerald-400/10 text-emerald-300",
};

const metricIcons: Record<string, LucideIcon> = {
  "Total Stories": Newspaper,
  Published: CheckCircle2,
  Drafts: PenLine,
  "Story Views": BarChart3,
  "Top Category": TrendingUp,
};

type EditorialMainContentProps = {
  stories: StoryListItem[];
  dashboard: AdminDashboardData;
  updateStoryAction: StoryAction;
  publishStoryAction: StoryAction;
  deleteStoryAction: StoryAction;
};

export function Panel({
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

export function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[color:var(--admin-line)] px-4 py-3">
      <h2 className="font-tight text-base font-semibold text-[color:var(--admin-strong)]">{title}</h2>
      {action ? <span className="text-xs text-[color:var(--admin-muted)]">{action}</span> : null}
    </div>
  );
}

export function EditorialMainContentSkeleton() {
  return (
    <main className="min-w-0 flex-1 space-y-4 px-4 py-5 lg:px-5" aria-label="Loading editorial dashboard">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Panel key={index} className="p-4">
            <div className="h-4 w-24 rounded bg-[color:var(--admin-skeleton)]" />
            <div className="mt-5 h-8 w-16 rounded bg-[color:var(--admin-skeleton)]" />
            <div className="mt-3 h-3 w-32 rounded bg-[color:var(--admin-skeleton)]" />
          </Panel>
        ))}
      </div>
      <Panel className="p-4">
        <div className="h-5 w-40 rounded bg-[color:var(--admin-skeleton)]" />
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-28 rounded bg-[color:var(--admin-skeleton)]" />
          ))}
        </div>
      </Panel>
    </main>
  );
}

function StatusBadge({ status }: { status: StoryListItem["status"] }) {
  const styles: Record<StoryListItem["status"], string> = {
    PUBLISHED: "bg-emerald-400/12 text-emerald-300",
    DRAFT: "bg-[color:var(--admin-chip)] text-[color:var(--admin-muted)]",
  };

  return (
    <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {status === "PUBLISHED" ? "Published" : "Draft"}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function Thumbnail({ story }: { story: StoryListItem }) {
  if (story.cover) {
    return (
      <div
        className="h-10 w-16 shrink-0 rounded-md bg-cover bg-center"
        style={{ backgroundImage: `url(${story.cover})` }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-slate-700/70 to-cyan-400/20">
      <span className="absolute bottom-1 left-1 rounded bg-black/35 px-1.5 py-0.5 text-[10px] font-semibold text-white">
        {story.category.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

function EmptyStories() {
  return (
    <div className="px-4 py-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-cyan-400/10 text-cyan-300">
        <FileText className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="font-tight text-lg font-semibold text-[color:var(--admin-strong)]">
        Start the editorial queue
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[color:var(--admin-muted)]">
        Create a draft, refine it with the desk, then publish when it is ready for the public news feed.
      </p>
    </div>
  );
}

export function EditorialMainContent({
  stories,
  dashboard,
  updateStoryAction,
  publishStoryAction,
  deleteStoryAction,
}: EditorialMainContentProps) {
  return (
    <main id="dashboard" className="min-w-0 flex-1 space-y-4 px-4 py-5 lg:px-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {dashboard.metrics.map((item) => {
          const tone = item.tone ?? "neutral";

          return (
            <Panel key={item.label} className="overflow-hidden p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="max-w-[9rem] text-xs leading-5 text-[color:var(--admin-muted)]">{item.label}</p>
                <span className={`grid h-9 w-9 place-items-center rounded-full border text-xs font-semibold ${toneClass[`${tone}Card`]}`}>
                  {(() => {
                    const Icon = metricIcons[item.label] ?? BarChart3;
                    return <Icon className="h-4 w-4" aria-hidden={true} />;
                  })()}
                </span>
              </div>
              <p className="mt-3 font-tight text-3xl font-semibold text-[color:var(--admin-strong)]">{item.value}</p>
              <p className={`mt-2 text-xs font-semibold ${toneClass[tone]}`}>{item.detail}</p>
            </Panel>
          );
        })}
      </div>

      <Panel id="pipeline" className="p-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-tight text-base font-semibold text-[color:var(--admin-strong)]">
              Editorial Pipeline
            </h2>
            <p className="mt-1 text-xs text-[color:var(--admin-muted)]">Current story movement across the desk.</p>
          </div>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-5">
          {dashboard.pipeline.map((step, index) => (
            <div key={step.label} className="relative text-center">
              {index < dashboard.pipeline.length - 1 ? (
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
          <SectionTitle title="Recent Stories" action={`${stories.length} total`} />
          {stories.length === 0 ? (
            <EmptyStories />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-[color:var(--admin-card)] text-xs text-[color:var(--admin-muted)]">
                  <tr>
                    {["Headline", "Source", "Status", "Category", "Updated", "Actions"].map((heading) => (
                      <th key={heading} className="px-4 py-3 font-semibold uppercase tracking-[0.12em]">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stories.map((story) => (
                    <tr key={story.id} className="border-t border-[color:var(--admin-line)] transition hover:bg-[color:var(--admin-hover)]/60">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Thumbnail story={story} />
                          <div className="min-w-0">
                            <span className="block max-w-[310px] truncate font-medium text-[color:var(--admin-strong)]">
                              {story.title}
                            </span>
                            <span className="mt-1 block max-w-[310px] truncate text-xs text-[color:var(--admin-muted)]">
                              /{story.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[color:var(--admin-muted)]">{story.source}</td>
                      <td className="px-4 py-4"><StatusBadge status={story.status} /></td>
                      <td className="px-4 py-4 text-[color:var(--admin-muted)]">{story.category}</td>
                      <td className="px-4 py-4 text-[color:var(--admin-muted)]">{formatDate(story.updatedAt)}</td>
                      <td className="px-4 py-4">
                        <StoryActions
                          story={story}
                          updateStoryAction={updateStoryAction}
                          publishStoryAction={publishStoryAction}
                          deleteStoryAction={deleteStoryAction}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel id="trending" className="overflow-hidden">
          <SectionTitle title="Top Stories" action="By views" />
          {dashboard.topStories.length === 0 ? (
            <p className="px-4 py-8 text-sm text-[color:var(--admin-muted)]">
              Publish stories to build a performance list.
            </p>
          ) : (
            <div>
              {dashboard.topStories.map((item, index) => (
                <div key={item.id} className="flex gap-3 border-t border-[color:var(--admin-line)] px-4 py-3 first:border-t-0">
                  <span className="pt-1 text-sm font-semibold text-cyan-300">{index + 1}</span>
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-medium text-[color:var(--admin-strong)]">{item.title}</p>
                    <p className="mt-1 text-xs text-[color:var(--admin-muted)]">{item.category} / {item.views.toLocaleString("en")} views</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </main>
  );
}
