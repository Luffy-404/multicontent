export type NewsSourceType = "api" | "scraped" | "editorial";

export interface NewsArticle {
  slug?: string;
  title: string;
  description: string;
  content?: string;
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
