import { CreateStoryModal } from "@/components/admin/CreateStoryModal";
import { Bell, Search } from "lucide-react";
import type { EditorialUser, StoryAction } from "@/lib/editorialTypes";

type EditorialTopHeaderProps = {
  user: EditorialUser;
  createStoryAction: StoryAction;
};

export function EditorialTopHeader({ user, createStoryAction }: EditorialTopHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-lg border border-[color:var(--admin-line)] bg-[color:var(--admin-panel)] p-4 xl:flex-row xl:items-start xl:justify-between">
      <div>
        <h1 className="font-tight text-2xl font-semibold text-[color:var(--admin-strong)] sm:text-3xl">
          Editorial OS
        </h1>
        <p className="mt-1 text-sm text-[color:var(--admin-muted)]">
          Welcome back, {user.name}. Shape today&apos;s story desk with confidence.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block sm:w-[420px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--admin-faint)]" aria-hidden="true" />
          <input
            className="admin-input h-11 rounded-lg pl-10 pr-4 text-sm disabled:cursor-not-allowed disabled:opacity-80"
            placeholder="Search is coming soon"
            disabled
            aria-label="Search stories"
          />
        </label>

        <div className="flex items-center gap-2">
          <span
            className="grid h-10 w-10 place-items-center rounded-lg border border-[color:var(--admin-line)] text-[color:var(--admin-muted)]"
            title="Notifications coming soon"
            aria-label="Notifications coming soon"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
          </span>
          <CreateStoryModal action={createStoryAction} />
        </div>
      </div>
    </header>
  );
}
