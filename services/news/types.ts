export interface GNewsArticle {
  title: string;
  description: string;
  image: string | null;
  url: string;
  publishedAt: string;
}

export type AggregatedNewsType = "api" | "scraped";

export interface AggregatedNewsArticle {
  title: string;
  description: string;
  image: string;
  url: string;
  source: string;
  category: string;
  publishedAt?: string;
  type: AggregatedNewsType;
}

