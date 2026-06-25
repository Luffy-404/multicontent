import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { StoryListItem, StoryStatus } from "@/lib/editorialTypes";

const fallbackStories: StoryListItem[] = [
  {
    id: "story-briefing",
    title: "Morning brief: policy, markets, and sport shape the day",
    slug: "morning-brief-policy-markets-sport",
    excerpt: "A compact editorial briefing for the homepage lead package.",
    cover: "",
    category: "Briefing",
    source: "Editorial Desk",
    status: "PUBLISHED",
    views: 24810,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
  },
  {
    id: "story-climate",
    title: "Cities prepare new heat response plans before summer",
    slug: "cities-heat-response-plans",
    excerpt: "An operations-led story moving from feeds into the features queue.",
    cover: "",
    category: "World",
    source: "Wire Review",
    status: "DRAFT",
    views: 9320,
    publishedAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "story-sports",
    title: "Weekend fixtures lift sports traffic across live modules",
    slug: "weekend-fixtures-sports-traffic",
    excerpt: "Sports Center candidates for the next homepage rotation.",
    cover: "",
    category: "Sports",
    source: "Sports Desk",
    status: "PUBLISHED",
    views: 18440,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 66).toISOString(),
  },
];

function toStoryListItem(story: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover: string | null;
  category: string;
  source: string;
  status: StoryStatus;
  views: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): StoryListItem {
  return {
    ...story,
    publishedAt: story.publishedAt?.toISOString() ?? null,
    createdAt: story.createdAt.toISOString(),
    updatedAt: story.updatedAt.toISOString(),
  };
}

function createSlug(title: string, fallback = "untitled-story") {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || fallback;
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function getRecentStories(limit = 8): Promise<StoryListItem[]> {
  try {
    const stories = await prisma.story.findMany({
      take: limit,
      orderBy: { updatedAt: "desc" },
    });

    if (stories.length === 0) {
      return fallbackStories.slice(0, limit);
    }

    return stories.map(toStoryListItem);
  } catch (error) {
    console.error("[editorial/stories] using fallback stories", error);
    return fallbackStories.slice(0, limit);
  }
}

export async function createStoryAction(formData: FormData) {
  "use server";

  const intent = getString(formData, "intent");
  const title = getString(formData, "title");
  const slug = createSlug(getString(formData, "slug") || title);
  const category = getString(formData, "category") || "General";
  const cover = getString(formData, "cover");
  const excerpt = getString(formData, "excerpt");
  const content = getString(formData, "content");
  const status: StoryStatus = intent === "publish" ? "PUBLISHED" : "DRAFT";

  if (!title || !excerpt || !content) {
    return;
  }

  try {
    await prisma.story.upsert({
      where: { slug },
      create: {
        title,
        slug,
        category,
        cover,
        excerpt,
        content,
        source: "Manual",
        status,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
      update: {
        title,
        category,
        cover,
        excerpt,
        content,
        source: "Manual",
        status,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    revalidatePath("/dashboard/admin");
  } catch (error) {
    console.error("[editorial/stories] create failed", error);
  }
}
