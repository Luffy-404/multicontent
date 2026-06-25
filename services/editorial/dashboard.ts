import type { AdminDashboardData, EditorialInsightsMetrics, StoryListItem } from "@/lib/editorialTypes";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value);
}

function formatRelativeTime(value: string) {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.round(diffMs / 60_000));

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours} hr ago`;
  }

  return `${Math.round(hours / 24)} day ago`;
}

function getTrendingCategory(stories: StoryListItem[]) {
  const categoryViews = stories.reduce<Record<string, number>>((acc, story) => {
    acc[story.category] = (acc[story.category] ?? 0) + story.views;
    return acc;
  }, {});

  return Object.entries(categoryViews).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "None";
}

export async function getEditorialDashboardData(
  stories: StoryListItem[],
): Promise<AdminDashboardData> {
  const publishedStories = stories.filter((story) => story.status === "PUBLISHED");
  const draftStories = stories.filter((story) => story.status === "DRAFT");
  const viewsToday = stories.reduce((total, story) => total + story.views, 0);
  const recentlyUpdated = [...stories].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return {
    metrics: [
      {
        label: "Total Stories",
        value: String(stories.length),
        detail: "Editorial stories in the database",
        tone: "neutral",
      },
      {
        label: "Published",
        value: String(publishedStories.length),
        detail: "Visible on the public news feed",
        tone: "success",
      },
      {
        label: "Drafts",
        value: String(draftStories.length),
        detail: "Private editorial work in progress",
        tone: draftStories.length > 0 ? "warning" : "neutral",
      },
      {
        label: "Story Views",
        value: formatNumber(viewsToday),
        detail: "Tracked from the Story model",
        tone: "neutral",
      },
      {
        label: "Top Category",
        value: getTrendingCategory(stories),
        detail: "Highest cumulative story views",
        tone: "success",
      },
    ],
    pipeline: [
      { label: "Incoming Stories", value: String(stories.length), detail: "All manual stories", tone: "cyan" },
      { label: "Drafting", value: String(draftStories.length), detail: "In progress", tone: "purple" },
      { label: "Human Review", value: String(draftStories.length), detail: "Needs publish decision", tone: "amber" },
      { label: "Scheduled", value: "0", detail: "Coming soon", tone: "yellow" },
      { label: "Published", value: String(publishedStories.length), detail: "Live now", tone: "green" },
    ],
    topStories: [...stories]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(({ id, title, category, views }) => ({ id, title, category, views })),
    recentActivity: recentlyUpdated.slice(0, 6).map((story) => ({
      title: story.status === "PUBLISHED" ? "Story published or updated" : "Draft updated",
      detail: story.title,
      time: formatRelativeTime(story.updatedAt),
    })),
    publishingQueue: draftStories.slice(0, 6).map((story) => ({
      id: story.id,
      title: story.title,
      owner: story.source,
      status: "Draft",
    })),
    notes: [
      "Homepage Manager, Source Manager, AI Queue, User Management, and Audit Logs are coming soon.",
      "Published stories are served through the existing public /news experience.",
      "Scheduling is intentionally deferred until a future sprint.",
    ],
  };
}

export function getEditorialInsightsMetrics(stories: StoryListItem[]): EditorialInsightsMetrics {
  const publishedStories = stories.filter((story) => story.status === "PUBLISHED");
  const draftStories = stories.filter((story) => story.status === "DRAFT");
  const totalViews = stories.reduce((total, story) => total + story.views, 0);

  const topStory = [...stories].sort((a, b) => b.views - a.views)[0] ?? null;

  // Story has no author/editor relation yet, so "source" is the closest proxy for attribution.
  const storyCountBySource = stories.reduce<Record<string, number>>((acc, story) => {
    acc[story.source] = (acc[story.source] ?? 0) + 1;
    return acc;
  }, {});
  const topSource = Object.entries(storyCountBySource).sort((a, b) => b[1] - a[1])[0];

  return {
    totalStories: stories.length,
    publishedStories: publishedStories.length,
    drafts: draftStories.length,
    totalViews,
    topStory: topStory ? { id: topStory.id, title: topStory.title, views: topStory.views } : null,
    mostActiveEditor: topSource ? { name: topSource[0], storyCount: topSource[1] } : null,
  };
}
