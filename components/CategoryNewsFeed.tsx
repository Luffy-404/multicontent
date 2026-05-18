"use client";

import { useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import type { NewsArticle, NewsResponse } from "@/lib/newsTypes";
import { limitNewsArticles } from "@/lib/newsUtils";

const categories = ["Technology", "AI", "Gaming", "Startups", "Cybersecurity"] as const;

type NewsCategory = (typeof categories)[number];

type CategoryNewsFeedProps = {
  initialArticles: NewsArticle[];
  initialCategory?: NewsCategory;
  className?: string;
  limit?: number;
};

async function fetchCategoryNews(category: NewsCategory) {
  const response = await fetch(`/api/aggregate/news?q=${encodeURIComponent(category)}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch category news");
  }

  const data = (await response.json()) as NewsResponse;
  return data.articles ?? [];
}

export function CategoryNewsFeed({
  initialArticles,
  initialCategory = "Technology",
  className = "mt-10",
  limit,
}: CategoryNewsFeedProps) {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>(initialCategory);
  const [articles, setArticles] = useState(() => limitNewsArticles(initialArticles, limit));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCategoryChange(category: NewsCategory) {
    if (category === activeCategory || isLoading) {
      return;
    }

    setActiveCategory(category);
    setIsLoading(true);
    setErrorMessage("");

    try {
      const nextArticles = await fetchCategoryNews(category);
      setArticles(limitNewsArticles(nextArticles, limit));
    } catch {
      setErrorMessage("Unable to load this category right now.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className={className}>
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-1 sm:inline-flex">
          {categories.map((category) => {
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                disabled={isLoading && !isActive}
                onClick={() => handleCategoryChange(category)}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  isActive
                    ? "bg-cyan-300 text-ink-950 shadow-glow"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 min-h-6">
        {isLoading ? (
          <p className="text-sm font-medium text-cyan-200">Loading {activeCategory} news...</p>
        ) : errorMessage ? (
          <p className="text-sm font-medium text-red-200">{errorMessage}</p>
        ) : null}
      </div>

      <div
        className={`mt-6 grid gap-5 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${
          isLoading ? "opacity-50" : "opacity-100"
        }`}
      >
        {articles.map((article) => (
          <NewsCard key={article.url} article={article} />
        ))}
      </div>
    </section>
  );
}
