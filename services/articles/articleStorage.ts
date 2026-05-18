import { prisma } from "@/lib/prisma";
import { createArticleSlug } from "@/lib/newsSlug";
import type { NewsArticle } from "@/lib/newsTypes";

function parsePublishedAt(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeArticleInput(article: NewsArticle) {
  return {
    slug: createArticleSlug(article),
    title: article.title,
    description: article.description,
    image: article.image ?? "",
    url: article.url,
    source: article.source ?? "Unknown",
    category: article.category ?? "General",
    type: article.type ?? "api",
    publishedAt: parsePublishedAt(article.publishedAt),
  };
}

export async function upsertArticle(article: NewsArticle) {
  const data = normalizeArticleInput(article);

  return prisma.article.upsert({
    where: { url: data.url },
    create: data,
    update: data,
  });
}

export async function upsertArticles(articles: NewsArticle[]) {
  const uniqueArticles = new Map<string, NewsArticle>();

  for (const article of articles) {
    if (article.url) {
      uniqueArticles.set(article.url, article);
    }
  }

  return Promise.all(Array.from(uniqueArticles.values()).map(upsertArticle));
}
