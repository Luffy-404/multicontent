import type { StoryListItem } from "@/lib/editorialTypes";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusClass(status: StoryListItem["status"]) {
  return status === "PUBLISHED"
    ? "bg-[color:var(--admin-success-soft)] text-[color:var(--admin-success)]"
    : "bg-[color:var(--admin-chip)] text-[color:var(--admin-muted)]";
}

export function RecentStories({ stories }: { stories: StoryListItem[] }) {
  return (
    <section className="admin-panel rounded-[20px] p-4 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-tight text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--admin-accent)]">
            Recent Stories
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-[color:var(--admin-strong)]">
            Editorial queue
          </h2>
        </div>
        <span className="text-sm text-[color:var(--admin-muted)]">Pagination ready</span>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-[900px] w-full border-separate border-spacing-0 text-left">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--admin-muted)]">
              <th className="border-b border-[color:var(--admin-line)] px-3 py-3">Title</th>
              <th className="border-b border-[color:var(--admin-line)] px-3 py-3">Category</th>
              <th className="border-b border-[color:var(--admin-line)] px-3 py-3">Status</th>
              <th className="border-b border-[color:var(--admin-line)] px-3 py-3">Source</th>
              <th className="border-b border-[color:var(--admin-line)] px-3 py-3">Views</th>
              <th className="border-b border-[color:var(--admin-line)] px-3 py-3">Updated</th>
              <th className="border-b border-[color:var(--admin-line)] px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story) => (
              <tr key={story.id} className="group">
                <td className="border-b border-[color:var(--admin-line)] px-3 py-4">
                  <p className="max-w-[320px] truncate text-sm font-semibold text-[color:var(--admin-strong)]">
                    {story.title}
                  </p>
                  <p className="mt-1 max-w-[320px] truncate text-xs text-[color:var(--admin-muted)]">
                    /{story.slug}
                  </p>
                </td>
                <td className="border-b border-[color:var(--admin-line)] px-3 py-4 text-sm text-[color:var(--admin-muted)]">
                  {story.category}
                </td>
                <td className="border-b border-[color:var(--admin-line)] px-3 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(story.status)}`}>
                    {story.status}
                  </span>
                </td>
                <td className="border-b border-[color:var(--admin-line)] px-3 py-4 text-sm text-[color:var(--admin-muted)]">
                  {story.source}
                </td>
                <td className="border-b border-[color:var(--admin-line)] px-3 py-4 text-sm text-[color:var(--admin-strong)]">
                  {story.views.toLocaleString("en")}
                </td>
                <td className="border-b border-[color:var(--admin-line)] px-3 py-4 text-sm text-[color:var(--admin-muted)]">
                  {formatDate(story.updatedAt)}
                </td>
                <td className="border-b border-[color:var(--admin-line)] px-3 py-4">
                  <div className="flex items-center gap-2">
                    {["Edit", "Preview", "Publish", "Delete"].map((action) => (
                      <button
                        key={action}
                        type="button"
                        className="rounded-full px-2.5 py-1 text-xs font-semibold text-[color:var(--admin-muted)] transition hover:bg-[color:var(--admin-hover)] hover:text-[color:var(--admin-strong)]"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function RecentStoriesSkeleton() {
  return (
    <section className="admin-panel rounded-[20px] p-5">
      <div className="h-8 w-48 rounded-full bg-[color:var(--admin-skeleton)]" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-14 rounded-2xl bg-[color:var(--admin-skeleton)]" />
        ))}
      </div>
    </section>
  );
}
