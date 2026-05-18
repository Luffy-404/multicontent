import { cache } from "@/lib/cache";
import type { GNewsArticle } from "./types";

const CACHE_TTL = 10 * 60;
const CACHE_KEY = "news:top-headlines";
const GNEWS_SOURCE = "GNews";
const GNEWS_CATEGORY = "Technology";

interface GNewsApiArticle {
  title?: string;
  description?: string | null;
  image?: string | null;
  url?: string;
  publishedAt?: string;
}

interface GNewsApiResponse {
  articles?: GNewsApiArticle[];
}

export interface GNewsResult {
  articles: GNewsArticle[];
  cached: boolean;
}

export class GNewsFetchError extends Error {
  constructor(public readonly status: number) {
    super("Failed to fetch news");
  }
}

export function getGNewsMetadata() {
  return {
    source: GNEWS_SOURCE,
    category: GNEWS_CATEGORY,
  };
}

export async function fetchGNewsArticles(query = "technology"): Promise<GNewsResult> {
  const cacheKey = `${CACHE_KEY}:${query}`;
  const cached = cache.get<GNewsArticle[]>(cacheKey);

  if (cached) {
    console.log("[GNews] cache hit:", { query, count: cached.length });
    return { articles: cached, cached: true };
  }

  console.log("[GNews] cache miss:", { query });

  const url = new URL("https://gnews.io/api/v4/top-headlines");
  url.searchParams.set("q", query);
  url.searchParams.set("country", "in");
  url.searchParams.set("max", "10");
  url.searchParams.set("token", process.env.NEWS_API_KEY ?? "");

  const response = await fetch(url.toString(), { next: { revalidate: 0 } });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.error("[GNews] API error:", error);
    throw new GNewsFetchError(response.status);
  }

  const data = (await response.json()) as GNewsApiResponse;
  const articles = (data.articles ?? [])
    .filter((article) => article.title && article.url)
    .map((article) => ({
      title: article.title ?? "",
      description: article.description ?? "",
      image: article.image ?? null,
      url: article.url ?? "",
      publishedAt: article.publishedAt ?? "",
    }));

  cache.set(cacheKey, articles, CACHE_TTL);
  console.log("[GNews] cache refresh:", {
    query,
    count: articles.length,
    ttlSeconds: CACHE_TTL,
  });

  return { articles, cached: false };
}
