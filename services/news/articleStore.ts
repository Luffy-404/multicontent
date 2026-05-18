import { createArticleSlug } from "@/lib/newsSlug";
import type { NewsArticle } from "@/lib/newsTypes";

const ARTICLE_TTL_SECONDS = 30 * 60;

type ArticleCacheEntry = {
  article: NewsArticle;
  expiresAt: number;
};

const globalForArticles = globalThis as unknown as {
  multiContentArticles?: Map<string, ArticleCacheEntry>;
};

const articleStore = globalForArticles.multiContentArticles ?? new Map<string, ArticleCacheEntry>();
globalForArticles.multiContentArticles = articleStore;

export function storeArticle(article: NewsArticle) {
  const slug = createArticleSlug(article);

  articleStore.set(slug, {
    article,
    expiresAt: Date.now() + ARTICLE_TTL_SECONDS * 1000,
  });

  return slug;
}

export function storeArticles(articles: NewsArticle[]) {
  articles.forEach(storeArticle);
}

export function getArticleBySlug(slug: string) {
  const entry = articleStore.get(slug);

  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    articleStore.delete(slug);
    return null;
  }

  return entry.article;
}

