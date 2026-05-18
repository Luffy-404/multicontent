import { headers } from "next/headers";
import type { NewsResponse } from "@/lib/newsTypes";
import { limitNewsArticles } from "@/lib/newsUtils";
import type { Video } from "@/components/VideoCard";

type VideosResponse = {
  videos?: Video[];
};

function getBaseUrl() {
  const headerStore = headers();
  const host = headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";

  if (host) {
    return `${protocol}://${host}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }

  return response.json() as Promise<T>;
}

export async function getNews(query = "technology", limit?: number) {
  const data = await getJson<NewsResponse>(`/api/aggregate/news?q=${encodeURIComponent(query)}`);
  const articles = data.articles ?? [];
  const scrapedArticles = articles.filter((article) => article.type === "scraped");

  console.log("[getNews] total articles fetched:", articles.length);
  console.log("[getNews] total scraped articles:", scrapedArticles.length);
  console.log("[getNews] first scraped article:", scrapedArticles[0] ?? null);

  return limitNewsArticles(articles, limit);
}

export async function getVideos(query = "technology", limit?: number) {
  const maxResults = limit ? `&maxResults=${limit}` : "";
  const data = await getJson<VideosResponse>(
    `/api/videos?q=${encodeURIComponent(query)}${maxResults}`,
  );
  return data.videos ?? [];
}
