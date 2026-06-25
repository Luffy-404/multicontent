export interface GNewsArticle {
  title: string;
  description: string;
  image: string | null;
  url: string;
  publishedAt: string;
}

export type AggregatedNewsType = "api" | "scraped" | "editorial";

export interface AggregatedNewsArticle {
  slug?: string;
  title: string;
  description: string;
  content?: string;
  image: string | null;
  url: string;
  source: string;
  category: string;
  publishedAt?: string;
  type: AggregatedNewsType;
}
