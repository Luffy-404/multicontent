import { Bot, CircleCheck, Clock3, FileClock, Radio, Rss, type LucideIcon } from "lucide-react";
import type { AdminDashboardData, StoryListItem } from "@/lib/editorialTypes";

type EditorialActivityPanelProps = {
  dashboard: AdminDashboardData;
  stories: StoryListItem[];
};

function Panel({
  title,
  children,
  icon: Icon,
}: {
  title: string;
  children: React.ReactNode;
  icon: LucideIcon;
}) {
  return (
    <section className="admin-panel overflow-hidden rounded-lg">
      <div className="flex items-center justify-between border-b border-[color:var(--admin-line)] px-4 py-3">
        <h2 className="inline-flex items-center gap-2 font-tight text-sm font-semibold text-[color:var(--admin-strong)]">
          <Icon className="h-4 w-4 text-cyan-300" aria-hidden={true} />
          {title}
        </h2>
        <span className="text-xs text-[color:var(--admin-muted)]">Live</span>
      </div>
      {children}
    </section>
  );
}

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-5 text-sm leading-6 text-[color:var(--admin-muted)]">
      {children}
    </div>
  );
}

export function EditorialActivityPanel({ dashboard, stories }: EditorialActivityPanelProps) {
  const publishedCount = stories.filter((story) => story.status === "PUBLISHED").length;

  return (
    <aside className="space-y-4 px-4 pb-5 lg:sticky lg:top-0 lg:h-screen lg:w-[372px] lg:shrink-0 lg:overflow-y-auto lg:border-l lg:border-[color:var(--admin-line)] lg:py-3">
      <Panel title="Publishing Queue" icon={FileClock}>
        {dashboard.publishingQueue.length === 0 ? (
          <Placeholder>No drafts are waiting. Create a story when the desk is ready to move.</Placeholder>
        ) : (
          <div className="divide-y divide-[color:var(--admin-line)]">
            {dashboard.publishingQueue.map((item, index) => (
              <div key={item.id ?? item.title} className="flex gap-3 px-4 py-3">
                <div className="grid h-12 w-14 shrink-0 place-items-center rounded-md bg-cyan-400/10 text-xs font-semibold text-cyan-300 ring-1 ring-cyan-300/10">
                  <Clock3 className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-[color:var(--admin-strong)]">{item.title}</p>
                  <p className="mt-1 text-xs text-[color:var(--admin-muted)]">{item.owner}</p>
                </div>
                <span className="self-center rounded-full border border-[color:var(--admin-line)] px-2 py-1 text-[11px] text-[color:var(--admin-muted)]">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="Recent Editorial Activity" icon={Radio}>
        {dashboard.recentActivity.length === 0 ? (
          <Placeholder>Story edits and publishing activity will appear here.</Placeholder>
        ) : (
          <div className="divide-y divide-[color:var(--admin-line)]">
            {dashboard.recentActivity.map((item) => (
              <div key={`${item.detail}-${item.time}`} className="flex gap-3 px-4 py-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cyan-400/10 text-xs font-semibold text-cyan-300">
                  <CircleCheck className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[color:var(--admin-muted)]">
                    <span className="font-medium text-[color:var(--admin-strong)]">{item.title}</span>
                  </p>
                  <p className="truncate text-xs text-[color:var(--admin-muted)]">{item.detail}</p>
                </div>
                <span className="shrink-0 text-xs text-[color:var(--admin-faint)]">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="Public News Status" icon={CircleCheck}>
        <div className="px-4 py-5">
          <p className="font-tight text-3xl font-semibold text-[color:var(--admin-strong)]">
            {publishedCount}
          </p>
          <p className="mt-2 text-sm leading-6 text-[color:var(--admin-muted)]">
            Published editorial stories currently eligible for /news.
          </p>
        </div>
      </Panel>

      <Panel title="Source Health" icon={Rss}>
        <Placeholder>Source controls are coming soon. Current publishing tools do not modify external feeds.</Placeholder>
      </Panel>

      <Panel title="AI Review Notifications" icon={Bot}>
        <Placeholder>AI review is coming soon. The active workflow is editor-led story creation and publishing.</Placeholder>
      </Panel>
    </aside>
  );
}
