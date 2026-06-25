import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export const dynamic = "force-dynamic";

const placeholderCopy: Record<string, { title: string; description: string }> = {
  "homepage-manager": {
    title: "Homepage Manager",
    description: "Homepage placement, pinning, and section controls are coming soon.",
  },
  "source-manager": {
    title: "Source Manager",
    description: "Source configuration and health controls are coming soon.",
  },
  "ai-queue": {
    title: "AI Queue",
    description: "AI generation and human review queues are coming soon.",
  },
  "user-management": {
    title: "User Management",
    description: "User administration and role editing will be added after the Story workflow is stable.",
  },
  "audit-logs": {
    title: "Audit Logs",
    description: "Audit history is planned for future editorial operations.",
  },
  settings: {
    title: "Admin Settings",
    description: "Editorial settings are coming soon. Story management remains available from the main desk.",
  },
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

type AdminPlaceholderPageProps = {
  params: {
    section: string;
  };
};

export default async function AdminPlaceholderPage({ params }: AdminPlaceholderPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?redirect=/dashboard/admin/${params.section}`);
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const copy = placeholderCopy[params.section] ?? {
    title: titleFromSlug(params.section),
    description: "This admin module is coming soon.",
  };

  return (
    <div className="admin-surface min-h-screen px-4 py-6 text-[color:var(--admin-text)]">
      <main className="mx-auto max-w-4xl">
        <Link
          href="/dashboard/admin"
          className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
        >
          Back to Editorial OS
        </Link>

        <section className="admin-panel mt-6 rounded-lg p-6 sm:p-8">
          <p className="font-tight text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--admin-accent)]">
            Coming Soon
          </p>
          <h1 className="mt-3 font-tight text-3xl font-semibold text-[color:var(--admin-strong)] sm:text-4xl">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[color:var(--admin-muted)]">
            {copy.description}
          </p>
          <div className="mt-6 rounded-lg border border-[color:var(--admin-line)] bg-[color:var(--admin-card)] p-4 text-sm leading-6 text-[color:var(--admin-muted)]">
            This page is read-only. No data is created, edited, deleted, queued, generated, or synced here yet.
          </div>
        </section>
      </main>
    </div>
  );
}
