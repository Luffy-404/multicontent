import { AdminStats } from "@/components/admin/AdminStats";
import type { AdminDashboardData } from "@/lib/editorialTypes";

function formatViews(views: number) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(views);
}

export function PublishingPanel({ data }: { data: AdminDashboardData }) {
  return (
    <aside className="space-y-4">
      <section className="admin-panel rounded-[20px] p-5">
        <p className="font-tight text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--admin-accent)]">
          Publishing Intelligence
        </p>
        <div className="mt-4">
          <AdminStats metrics={data.metrics} />
        </div>
      </section>

      <section className="admin-panel rounded-[20px] p-5">
        <h3 className="font-tight text-sm font-semibold text-[color:var(--admin-strong)]">
          Top Stories
        </h3>
        <div className="mt-4 space-y-3">
          {data.topStories.map((story) => (
            <div key={story.id} className="rounded-2xl bg-[color:var(--admin-card)] p-3">
              <p className="line-clamp-2 text-sm font-semibold leading-5 text-[color:var(--admin-strong)]">
                {story.title}
              </p>
              <p className="mt-2 text-xs text-[color:var(--admin-muted)]">
                {story.category} / {formatViews(story.views)} views
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-panel rounded-[20px] p-5">
        <h3 className="font-tight text-sm font-semibold text-[color:var(--admin-strong)]">
          Recent Activity
        </h3>
        <div className="mt-4 space-y-4">
          {data.recentActivity.map((activity) => (
            <div key={activity.title} className="border-b border-[color:var(--admin-line)] pb-3 last:border-b-0 last:pb-0">
              <p className="text-sm font-medium text-[color:var(--admin-strong)]">{activity.title}</p>
              <p className="mt-1 text-xs leading-5 text-[color:var(--admin-muted)]">{activity.detail}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[color:var(--admin-faint)]">
                {activity.time}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-panel rounded-[20px] p-5">
        <h3 className="font-tight text-sm font-semibold text-[color:var(--admin-strong)]">
          Publishing Queue
        </h3>
        <div className="mt-4 space-y-2">
          {data.publishingQueue.map((item) => (
            <div key={item.title} className="flex items-center justify-between gap-3 rounded-2xl bg-[color:var(--admin-card)] px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[color:var(--admin-strong)]">{item.title}</p>
                <p className="text-xs text-[color:var(--admin-muted)]">{item.owner}</p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-[color:var(--admin-accent)]">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-panel rounded-[20px] p-5">
        <h3 className="font-tight text-sm font-semibold text-[color:var(--admin-strong)]">
          Editorial Notes
        </h3>
        <div className="mt-4 space-y-3">
          {data.notes.map((note) => (
            <p key={note} className="rounded-2xl bg-[color:var(--admin-card)] p-3 text-sm leading-6 text-[color:var(--admin-muted)]">
              {note}
            </p>
          ))}
        </div>
      </section>
    </aside>
  );
}
