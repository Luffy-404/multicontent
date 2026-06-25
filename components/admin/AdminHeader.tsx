import { CreateStoryModal } from "@/components/admin/CreateStoryModal";
import type { EditorialUser } from "@/lib/editorialTypes";

type AdminHeaderProps = {
  user: EditorialUser;
  createStoryAction: (formData: FormData) => Promise<void>;
};

function greeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function AdminHeader({ user, createStoryAction }: AdminHeaderProps) {
  return (
    <header className="admin-panel rounded-[20px] p-5 sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-tight text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--admin-accent)]">
            Editorial Operating System
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-none text-[color:var(--admin-strong)] sm:text-5xl">
            {greeting()}, {user.name}
          </h1>
          <p className="mt-3 text-base leading-7 text-[color:var(--admin-muted)]">
            Shape ideas.
            <br />
            Publish impact.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[color:var(--admin-line)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--admin-muted)]">
            {user.role ?? "EDITOR"} ready
          </span>
          <CreateStoryModal action={createStoryAction} />
        </div>
      </div>
    </header>
  );
}
