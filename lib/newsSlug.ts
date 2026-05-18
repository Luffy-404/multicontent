import type { NewsArticle } from "@/lib/newsTypes";

function createStableHash(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash.toString(36).slice(0, 6);
}

export function createSlugFromTitle(title: string) {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return slug || "article";
}

export function createArticleSlug(article: Pick<NewsArticle, "title" | "url">) {
  const baseSlug = createSlugFromTitle(article.title);
  const hash = createStableHash(article.url || article.title);

  return `${baseSlug}-${hash}`;
}

