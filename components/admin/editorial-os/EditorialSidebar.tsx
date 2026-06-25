import Link from "next/link";
import {
  Activity,
  Bot,
  FileText,
  Gauge,
  Home,
  LayoutDashboard,
  Newspaper,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { EditorialUser } from "@/lib/editorialTypes";

const sidebarSections = [
  {
    label: "Content",
    items: [
      { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
      { label: "Stories", href: "/dashboard/admin#articles", icon: Newspaper },
      { label: "Drafts", href: "/dashboard/admin#pipeline", icon: FileText },
      { label: "Published", href: "/dashboard/admin#articles", icon: ShieldCheck },
    ],
  },
  {
    label: "Workspace",
    items: [
      { label: "Homepage Manager", href: "/dashboard/admin/homepage-manager", icon: Home, soon: true },
      { label: "Source Manager", href: "/dashboard/admin/source-manager", icon: Activity, soon: true },
      { label: "AI Queue", href: "/dashboard/admin/ai-queue", icon: Bot, soon: true },
      { label: "User Management", href: "/dashboard/admin/user-management", icon: Users, soon: true },
      { label: "Audit Logs", href: "/dashboard/admin/audit-logs", icon: ShieldCheck, soon: true },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/dashboard/admin/settings", icon: Settings, soon: true },
      { label: "Insights", href: "/dashboard/admin/insights", icon: Gauge },
    ],
  },
];

export function EditorialSidebar({ user }: { user: EditorialUser }) {
  return (
    <aside className="admin-panel flex min-h-screen w-full flex-col border-y-0 border-l-0 px-3 py-4 shadow-none lg:sticky lg:top-0 lg:h-screen lg:w-[268px] lg:shrink-0">
      <div className="flex items-center gap-3 px-2">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-400/15 text-lg font-black text-cyan-300 ring-1 ring-cyan-300/15">
          M
        </div>
        <p className="font-tight text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--admin-strong)]">
          Multicontent
        </p>
      </div>

      <nav className="mt-5 flex-1 overflow-y-auto pr-1" aria-label="Editorial OS navigation">
        <div className="space-y-5">
          {sidebarSections.map((section) => (
            <section key={section.label}>
              <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--admin-faint)]">
                {section.label}
              </p>
              <div className="mt-2 grid gap-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={`${section.label}-${item.label}`}
                      href={item.href}
                      className="group flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm text-[color:var(--admin-muted)] outline-none transition hover:bg-[color:var(--admin-hover)] hover:text-[color:var(--admin-strong)] focus-visible:ring-2 focus-visible:ring-[color:var(--admin-accent-soft)]"
                    >
                      <Icon className="h-4 w-4 shrink-0 transition group-hover:text-cyan-300" aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {item.soon ? (
                        <span className="rounded-full border border-[color:var(--admin-line)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--admin-faint)]">
                          Soon
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </nav>

      <div className="mt-4 rounded-lg border border-[color:var(--admin-line)] bg-[color:var(--admin-card)] p-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-cyan-400/15 text-sm font-bold text-cyan-300">
            {(user.name || user.email).slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[color:var(--admin-strong)]">{user.name}</p>
            <p className="truncate text-xs text-[color:var(--admin-muted)]">{user.role ?? "ADMIN"} / {user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
