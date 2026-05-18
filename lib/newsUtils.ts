import type { NewsArticle } from "@/lib/newsTypes";

export function limitNewsArticles(articles: NewsArticle[], limit?: number) {
  if (!limit || articles.length <= limit) {
    return articles;
  }

  const selected = articles.slice(0, limit);
  const selectedTypes = new Set(selected.map((article) => article.type).filter(Boolean));
  const missingTypeArticle = articles.find(
    (article) => article.type && !selectedTypes.has(article.type),
  );

  if (!missingTypeArticle) {
    return selected;
  }

  return [...selected.slice(0, Math.max(limit - 1, 0)), missingTypeArticle];
}

