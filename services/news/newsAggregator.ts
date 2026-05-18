import { scrapeAssamTribuneSciTech } from "@/services/scrapers";
import type { ScrapedArticle } from "@/services/scrapers";
import { upsertArticles } from "@/services/articles/articleStorage";
import { categoryMatchesQuery, normalizeCategoryName } from "./categoryUtils";
import { fetchGNewsArticles, getGNewsMetadata } from "./gnewsService";
import type { AggregatedNewsArticle, GNewsArticle } from "./types";

type SourceStatus = {
  gnews: boolean;
  assamTribune: boolean;
};

function normalizeUrl(url: string) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.searchParams.sort();
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return url.trim();
  }
}

function toTimestamp(value?: string) {
  if (!value) return 0;

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function normalizeGNewsArticle(article: GNewsArticle): AggregatedNewsArticle {
  const metadata = getGNewsMetadata();

  return {
    title: article.title,
    description: article.description,
    image: article.image ?? "",
    url: article.url,
    source: metadata.source,
    category: normalizeCategoryName(metadata.category),
    publishedAt: article.publishedAt,
    type: "api",
  };
}

function normalizeScrapedArticle(article: ScrapedArticle): AggregatedNewsArticle {
  return {
    title: article.title,
    description: article.description,
    image: article.image,
    url: article.url,
    source: article.source,
    category: normalizeCategoryName(article.category),
    publishedAt: article.publishedAt,
    type: "scraped",
  };
}

function shouldIncludeScrapedArticle(article: ScrapedArticle, query: string) {
  if (categoryMatchesQuery(article.category, query)) {
    return true;
  }

  const searchableText = `${article.title} ${article.description}`.toLowerCase();
  return searchableText.includes(query.toLowerCase().trim());
}

function dedupeByUrl(articles: AggregatedNewsArticle[]) {
  const seenUrls = new Set<string>();

  return articles.filter((article) => {
    const key = normalizeUrl(article.url);

    if (!key || seenUrls.has(key)) {
      return false;
    }

    seenUrls.add(key);
    return true;
  });
}

function sortNewestFirst(articles: AggregatedNewsArticle[]) {
  return [...articles].sort((a, b) => toTimestamp(b.publishedAt) - toTimestamp(a.publishedAt));
}

function mixArticlesBySource(articles: AggregatedNewsArticle[]) {
  const sourceQueues = new Map<string, AggregatedNewsArticle[]>();

  for (const article of sortNewestFirst(articles)) {
    const source = article.source || "Unknown";
    sourceQueues.set(source, [...(sourceQueues.get(source) ?? []), article]);
  }

  const mixed: AggregatedNewsArticle[] = [];

  while (sourceQueues.size > 0) {
    const lastSource = mixed.at(-1)?.source;
    const candidates = Array.from(sourceQueues.entries())
      .filter(([source]) => source !== lastSource || sourceQueues.size === 1)
      .sort(([, aArticles], [, bArticles]) => {
        const recencyDifference =
          toTimestamp(bArticles[0]?.publishedAt) - toTimestamp(aArticles[0]?.publishedAt);

        if (recencyDifference !== 0) {
          return recencyDifference;
        }

        return bArticles.length - aArticles.length;
      });

    const [source, queue] = candidates[0];
    const nextArticle = queue.shift();

    if (nextArticle) {
      mixed.push(nextArticle);
    }

    if (queue.length === 0) {
      sourceQueues.delete(source);
    }
  }

  return mixed;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function aggregateNews(query = "technology") {
  const [gnewsResult, assamTribuneResult] = await Promise.allSettled([
    fetchGNewsArticles(query),
    scrapeAssamTribuneSciTech(),
  ]);

  const sourceStatus: SourceStatus = {
    gnews: gnewsResult.status === "fulfilled",
    assamTribune: assamTribuneResult.status === "fulfilled",
  };

  if (gnewsResult.status === "fulfilled") {
    console.log("[aggregateNews] GNews source succeeded:", gnewsResult.value.articles.length);
  } else {
    console.error("[aggregateNews] GNews source failed:", getErrorMessage(gnewsResult.reason));
  }

  if (assamTribuneResult.status === "fulfilled") {
    console.log(
      "[aggregateNews] Assam Tribune source succeeded:",
      assamTribuneResult.value.length,
    );
  } else {
    console.error(
      "[aggregateNews] Assam Tribune source failed:",
      getErrorMessage(assamTribuneResult.reason),
    );
  }

  if (!sourceStatus.gnews && !sourceStatus.assamTribune) {
    throw new Error("All news sources failed");
  }

  const gnewsArticles = gnewsResult.status === "fulfilled" ? gnewsResult.value.articles : [];
  const assamTribuneArticles =
    assamTribuneResult.status === "fulfilled" ? assamTribuneResult.value : [];
  const matchingScrapedArticles = assamTribuneArticles.filter((article) =>
    shouldIncludeScrapedArticle(article, query),
  );

  const articles = mixArticlesBySource(dedupeByUrl([
    ...gnewsArticles.map(normalizeGNewsArticle),
    ...matchingScrapedArticles.map(normalizeScrapedArticle),
  ]));
  await upsertArticles(articles);

  console.log("[aggregateNews] final merged article count:", articles.length);

  return {
    articles,
    sourceStatus,
  };
}
