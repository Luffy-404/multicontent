import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { captureServerEvent } from "@/lib/analytics/server";
import type { StoryListItem, StoryStatus } from "@/lib/editorialTypes";
import type { NewsArticle } from "@/lib/newsTypes";

function toStoryListItem(story: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
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

function storyToNewsArticle(story: StoryListItem): NewsArticle {
  return {
    slug: story.slug,
    title: story.title,
    description: story.excerpt,
    content: story.content,
    image: story.cover ?? null,
    url: `/news/${story.slug}`,
    source: story.source,
    category: story.category,
    type: "editorial",
    publishedAt: story.publishedAt ?? story.updatedAt,
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

function getStoryInput(formData: FormData) {
  const title = getString(formData, "title");
  const slug = createSlug(getString(formData, "slug") || title);
  const category = getString(formData, "category") || "General";
  const cover = getString(formData, "cover");
  const excerpt = getString(formData, "excerpt");
  const content = getString(formData, "content");

  if (!title || !slug || !excerpt || !content) {
    throw new Error("Title, slug, excerpt, and body are required.");
  }

  return {
    title,
    slug,
    category,
    cover: cover || null,
    excerpt,
    content,
  };
}

async function assertAdmin() {
  const user = await getCurrentUser();

  if (user?.role !== "ADMIN") {
    throw new Error("Admin access required.");
  }

  return user;
}

function revalidateStoryPaths(slug?: string) {
  revalidatePath("/dashboard/admin");
  revalidatePath("/news");

  if (slug) {
    revalidatePath(`/news/${slug}`);
  }
}

export async function getStories(limit = 24): Promise<StoryListItem[]> {
  const stories = await prisma.story.findMany({
    take: limit,
    orderBy: [{ updatedAt: "desc" }],
  });

  return stories.map(toStoryListItem);
}

export async function getPublishedStoryArticles(limit = 12): Promise<NewsArticle[]> {
  const stories = await prisma.story.findMany({
    where: { status: "PUBLISHED" },
    take: limit,
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
  });

  return stories.map(toStoryListItem).map(storyToNewsArticle);
}

export async function getPublishedStoryBySlug(slug: string): Promise<NewsArticle | null> {
  const story = await prisma.story.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
  });

  return story ? storyToNewsArticle(toStoryListItem(story)) : null;
}

export async function createStoryAction(formData: FormData) {
  "use server";

  const user = await assertAdmin();
  const intent = getString(formData, "intent");
  const status: StoryStatus = intent === "publish" ? "PUBLISHED" : "DRAFT";
  const input = getStoryInput(formData);
  const existing = await prisma.story.findUnique({
    where: { slug: input.slug },
    select: { id: true },
  });

  if (existing) {
    throw new Error("A story with this slug already exists.");
  }

  const story = await prisma.story.create({
    data: {
      ...input,
      source: "Editorial Desk",
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });

  captureServerEvent("story_created", user.id, {
    story_id: story.id,
    story_slug: story.slug,
    story_status: story.status,
    category: story.category,
  });

  if (story.status === "PUBLISHED") {
    captureServerEvent("story_published", user.id, {
      story_id: story.id,
      story_slug: story.slug,
      category: story.category,
    });
  }

  revalidateStoryPaths(input.slug);
}

export async function updateStoryAction(formData: FormData) {
  "use server";

  await assertAdmin();
  const id = getString(formData, "id");
  const input = getStoryInput(formData);

  if (!id) {
    throw new Error("Story id is required.");
  }

  const current = await prisma.story.findUnique({
    where: { id },
    select: { slug: true, status: true, publishedAt: true },
  });

  if (!current) {
    throw new Error("Story not found.");
  }

  const slugOwner = await prisma.story.findUnique({
    where: { slug: input.slug },
    select: { id: true },
  });

  if (slugOwner && slugOwner.id !== id) {
    throw new Error("A story with this slug already exists.");
  }

  await prisma.story.update({
    where: { id },
    data: {
      ...input,
      publishedAt:
        current.status === "PUBLISHED" && !current.publishedAt
          ? new Date()
          : current.publishedAt,
    },
  });

  revalidateStoryPaths(current.slug);
  revalidateStoryPaths(input.slug);
}

export async function publishStoryAction(formData: FormData) {
  "use server";

  const user = await assertAdmin();
  const id = getString(formData, "id");
  const nextStatus = getString(formData, "status") === "DRAFT" ? "DRAFT" : "PUBLISHED";

  if (!id) {
    throw new Error("Story id is required.");
  }

  const story = await prisma.story.update({
    where: { id },
    data: {
      status: nextStatus,
      publishedAt: nextStatus === "PUBLISHED" ? new Date() : null,
    },
    select: { id: true, slug: true, category: true, status: true },
  });

  if (story.status === "PUBLISHED") {
    captureServerEvent("story_published", user.id, {
      story_id: story.id,
      story_slug: story.slug,
      category: story.category,
    });
  }

  revalidateStoryPaths(story.slug);
}

export async function deleteStoryAction(formData: FormData) {
  "use server";

  await assertAdmin();
  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Story id is required.");
  }

  const story = await prisma.story.delete({
    where: { id },
    select: { slug: true },
  });

  revalidateStoryPaths(story.slug);
}
