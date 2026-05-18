import { prisma } from "@/lib/prisma";
import type { NewsArticle } from "@/lib/newsTypes";

function toNewsArticle(article: {
  title: string;
  description: string;
  image: string;
  url: string;
  source: string;
  category: string;
  type: string;
  publishedAt: Date | null;
}): NewsArticle {
  return {
    title: article.title,
    description: article.description,
    image: article.image,
    url: article.url,
    source: article.source,
    category: article.category,
    type: article.type === "scraped" ? "scraped" : "api",
    publishedAt: article.publishedAt?.toISOString(),
  };
}

export async function getArticleBySlug(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
  });

  return article ? toNewsArticle(article) : null;
}
