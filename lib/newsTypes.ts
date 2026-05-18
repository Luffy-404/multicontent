export type NewsSourceType = "api" | "scraped";

export interface NewsArticle {
  title: string;
  description: string;
  image: string | null;
  url: string;
  source?: string;
  category?: string;
  publishedAt?: string;
  type?: NewsSourceType;
}

export interface NewsResponse {
  success?: boolean;
  total?: number;
  sourceStatus?: {
    gnews: boolean;
    assamTribune: boolean;
  };
  articles?: NewsArticle[];
}

