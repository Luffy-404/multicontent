import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, LineChart, Link2 } from "lucide-react";
import { Panel, SectionTitle } from "@/components/admin/editorial-os/EditorialMainContent";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getProductAnalyticsCards, getPostHogDashboardUrl, isPostHogConnected } from "@/lib/posthog";
import { getEditorialInsightsMetrics } from "@/services/editorial/dashboard";
import { getStories } from "@/services/editorial/stories";

export const dynamic = "force-dynamic";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value);
}

export default async function InsightsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/admin/insights");
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const stories = await getStories();
  const metrics = getEditorialInsightsMetrics(stories);
  const connected = isPostHogConnected();
  const productCards = getProductAnalyticsCards();

  return (
    <main className="min-w-0 flex-1 space-y-4 px-4 py-5 lg:px-5">
      <Panel className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-tight text-2xl font-semibold text-[color:var(--admin-strong)]">Insights</h1>
            <p className="mt-1 text-sm text-[color:var(--admin-muted)]">
              Editorial performance from the Story desk, alongside product analytics from PostHog.
            </p>
          </div>
          <Link
            href="/dashboard/admin"
            className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            Back to Editorial OS
          </Link>
        </div>
      </Panel>

      <section>
        <h2 className="px-1 font-tight text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--admin-faint)]">
          Editorial Metrics
        </h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Panel className="p-4">
            <p className="text-xs text-[color:var(--admin-muted)]">Total Stories</p>
            <p className="mt-3 font-tight text-3xl font-semibold text-[color:var(--admin-strong)]">{metrics.totalStories}</p>
          </Panel>
          <Panel className="p-4">
            <p className="text-xs text-[color:var(--admin-muted)]">Published Stories</p>
            <p className="mt-3 font-tight text-3xl font-semibold text-[color:var(--admin-strong)]">{metrics.publishedStories}</p>
          </Panel>
          <Panel className="p-4">
            <p className="text-xs text-[color:var(--admin-muted)]">Drafts</p>
            <p className="mt-3 font-tight text-3xl font-semibold text-[color:var(--admin-strong)]">{metrics.drafts}</p>
          </Panel>
          <Panel className="p-4">
            <p className="text-xs text-[color:var(--admin-muted)]">Total Views</p>
            <p className="mt-3 font-tight text-3xl font-semibold text-[color:var(--admin-strong)]">{formatNumber(metrics.totalViews)}</p>
          </Panel>
          <Panel className="p-4">
            <p className="text-xs text-[color:var(--admin-muted)]">Top Story</p>
            {metrics.topStory ? (
              <>
                <p className="mt-3 line-clamp-2 text-sm font-semibold text-[color:var(--admin-strong)]">{metrics.topStory.title}</p>
                <p className="mt-1 text-xs text-[color:var(--admin-muted)]">{metrics.topStory.views.toLocaleString("en")} views</p>
              </>
            ) : (
              <p className="mt-3 text-sm text-[color:var(--admin-muted)]">No stories yet</p>
            )}
          </Panel>
          <Panel className="p-4">
            <p className="text-xs text-[color:var(--admin-muted)]">Most Active Editor</p>
            {metrics.mostActiveEditor ? (
              <>
                <p className="mt-3 text-sm font-semibold text-[color:var(--admin-strong)]">{metrics.mostActiveEditor.name}</p>
                <p className="mt-1 text-xs text-[color:var(--admin-muted)]">{metrics.mostActiveEditor.storyCount} stories</p>
              </>
            ) : (
              <p className="mt-3 text-sm text-[color:var(--admin-muted)]">No stories yet</p>
            )}
          </Panel>
        </div>
      </section>

      <Panel className="overflow-hidden">
        <SectionTitle title="Product Analytics" action="Powered by PostHog" />
        <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-5">
          {productCards.map((card) => (
            <div
              key={card.label}
              className="rounded-lg border border-[color:var(--admin-line)] bg-[color:var(--admin-card)] p-4"
            >
              <p className="text-xs text-[color:var(--admin-muted)]">{card.label}</p>
              {connected && card.value ? (
                <p className="mt-3 font-tight text-2xl font-semibold text-[color:var(--admin-strong)]">{card.value}</p>
              ) : (
                <>
                  <p className="mt-3 font-tight text-2xl font-semibold text-[color:var(--admin-faint)]">&mdash;</p>
                  <Link
                    href="https://posthog.com/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-cyan-300/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/15"
                  >
                    <Link2 className="h-3 w-3" aria-hidden="true" />
                    Connect PostHog
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-cyan-300/40 bg-cyan-400/10 text-cyan-300">
              <LineChart className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-tight text-base font-semibold text-[color:var(--admin-strong)]">Traffic</h2>
              <p className="mt-1 text-xs text-[color:var(--admin-muted)]">
                Full traffic breakdowns, funnels, and session replays live in PostHog.
              </p>
            </div>
          </div>
          <Link
            href={getPostHogDashboardUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[color:var(--admin-accent)] px-4 text-sm font-semibold text-white outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[color:var(--admin-accent-soft)]"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Open PostHog Dashboard
          </Link>
        </div>
      </Panel>
    </main>
  );
}
