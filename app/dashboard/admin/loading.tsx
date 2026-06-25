import { EditorialMainContentSkeleton } from "@/components/admin/editorial-os/EditorialMainContent";

export default function AdminLoading() {
  return (
    <div className="admin-surface min-h-screen text-[color:var(--admin-text)]">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col lg:flex-row">
        <aside className="admin-panel min-h-screen w-full border-y-0 border-l-0 px-3 py-4 lg:w-[268px] lg:shrink-0">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-lg bg-[color:var(--admin-skeleton)]" />
            <div className="h-4 w-32 rounded bg-[color:var(--admin-skeleton)]" />
          </div>
          <div className="mt-8 space-y-6 px-2">
            {Array.from({ length: 3 }).map((_, sectionIndex) => (
              <div key={sectionIndex} className="space-y-3">
                <div className="h-3 w-20 rounded bg-[color:var(--admin-skeleton)]" />
                {Array.from({ length: 4 }).map((__, itemIndex) => (
                  <div key={itemIndex} className="h-9 rounded-lg bg-[color:var(--admin-skeleton)]" />
                ))}
              </div>
            ))}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="px-4 pt-5 lg:px-5">
            <div className="admin-panel rounded-lg p-4">
              <div className="h-8 w-48 rounded bg-[color:var(--admin-skeleton)]" />
              <div className="mt-3 h-4 w-80 max-w-full rounded bg-[color:var(--admin-skeleton)]" />
            </div>
          </div>
          <EditorialMainContentSkeleton />
        </div>
      </div>
    </div>
  );
}
