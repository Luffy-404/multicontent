import type { AdminDashboardData, StoryListItem } from "@/lib/editorialTypes";

function getTrendingCategory(stories: StoryListItem[]) {
  const categoryViews = stories.reduce<Record<string, number>>((acc, story) => {
    acc[story.category] = (acc[story.category] ?? 0) + story.views;
    return acc;
  }, {});

  return Object.entries(categoryViews).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "World";
}

export async function getEditorialDashboardData(
  stories: StoryListItem[],
): Promise<AdminDashboardData> {
  const publishedStories = stories.filter((story) => story.status === "PUBLISHED");
  const draftStories = stories.filter((story) => story.status === "DRAFT");
  const viewsToday = stories.reduce((total, story) => total + story.views, 0);

  return {
    metrics: [
      {
        label: "Views Today",
        value: new Intl.NumberFormat("en", { notation: "compact" }).format(viewsToday),
        detail: "Manual and feed-backed stories",
      },
      {
        label: "Stories Published",
        value: String(publishedStories.length),
        detail: "Ready for homepage placement",
      },
      {
        label: "Draft Count",
        value: String(draftStories.length),
        detail: "Awaiting editor review",
      },
      {
        label: "Trending Category",
        value: getTrendingCategory(stories),
        detail: "Highest current story demand",
      },
    ],
    topStories: [...stories]
      .sort((a, b) => b.views - a.views)
      .slice(0, 4)
      .map(({ id, title, category, views }) => ({ id, title, category, views })),
    recentActivity: [
      {
        title: "Homepage lead reviewed",
        detail: "Feature slot prepared for evening rotation",
        time: "12 min ago",
      },
      {
        title: "Sports module refreshed",
        detail: "Live fixtures promoted to the second band",
        time: "28 min ago",
      },
      {
        title: "Draft saved",
        detail: "Markets explainer moved into editor queue",
        time: "44 min ago",
      },
    ],
    publishingQueue: [
      { title: "Election briefing", owner: "Admin", status: "Needs preview" },
      { title: "Market close", owner: "Markets", status: "Scheduled" },
      { title: "Sports recap", owner: "Sports", status: "Ready" },
    ],
    notes: [
      "Keep the homepage lead package tight until the evening traffic readout.",
      "Review automation feed sources before enabling any ingestion jobs.",
      "Sports and markets modules are prepared for manual ordering controls.",
    ],
  };
}
