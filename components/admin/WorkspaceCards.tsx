"use client";

import Link from "next/link";
import { memo } from "react";
import type { WorkspaceCard } from "@/lib/editorialTypes";

const cards: WorkspaceCard[] = [
  {
    title: "Today's Stories",
    description: "Review live, draft, and hand-picked stories moving through the desk.",
    meta: "8 active",
    href: "#stories",
  },
  {
    title: "Create Article",
    description: "Start a manual story with title, slug, cover, excerpt, and body.",
    meta: "Manual",
    href: "#create",
  },
  {
    title: "Feature Content",
    description: "Prepare hero, secondary, and edition-level editorial packages.",
    meta: "Homepage",
    href: "#homepage",
  },
  {
    title: "Homepage Layout",
    description: "Shape the front page hierarchy without changing public templates.",
    meta: "Control",
    href: "#homepage",
  },
  {
    title: "Content Scheduler",
    description: "Queue drafts and previews for timed publishing windows.",
    meta: "Ready",
    href: "#publish",
  },
  {
    title: "Trending Topics",
    description: "Track what deserves elevation from feeds into editorial modules.",
    meta: "Live",
    href: "#analytics",
  },
  {
    title: "Sports Module",
    description: "Coordinate fixtures, score surfaces, and sport-led homepage units.",
    meta: "Sports",
    href: "#sports",
  },
  {
    title: "Market Module",
    description: "Prepare market snapshots for the dashboard and homepage rail.",
    meta: "Markets",
    href: "#markets",
  },
];

const WorkspaceCardItem = memo(function WorkspaceCardItem({ card }: { card: WorkspaceCard }) {
  const content = (
    <article className="group flex h-full min-h-[164px] flex-col justify-between rounded-[18px] border border-[color:var(--admin-line)] bg-[color:var(--admin-card)] p-5 transition hover:-translate-y-0.5 hover:border-[color:var(--admin-accent-soft)] hover:bg-[color:var(--admin-hover)]">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-tight text-base font-semibold text-[color:var(--admin-strong)]">
            {card.title}
          </h3>
          <span className="rounded-full bg-[color:var(--admin-chip)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--admin-muted)]">
            {card.meta}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-[color:var(--admin-muted)]">{card.description}</p>
      </div>
      <span className="mt-5 text-sm font-semibold text-[color:var(--admin-accent)]">
        Open
      </span>
    </article>
  );

  if (!card.href) {
    return content;
  }

  return <Link href={card.href}>{content}</Link>;
});

export function WorkspaceCards() {
  return (
    <section id="stories">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="font-tight text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--admin-accent)]">
            Editorial Workspace
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-[color:var(--admin-strong)]">
            Launch controls
          </h2>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <WorkspaceCardItem key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
}
