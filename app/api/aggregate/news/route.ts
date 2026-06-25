import { NextRequest, NextResponse } from "next/server";
import { getPublishedStoryArticles } from "@/services/editorial/stories";
import { aggregateNews } from "@/services/news/newsAggregator";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") ?? "technology";
    const [{ articles, sourceStatus }, editorialStories] = await Promise.all([
      aggregateNews(query),
      getPublishedStoryArticles(12),
    ]);
    const normalizedQuery = query.toLowerCase().trim();
    const matchingEditorialStories = editorialStories.filter((story) => {
      if (!normalizedQuery || normalizedQuery === "technology") {
        return true;
      }

      return [story.title, story.description, story.category, story.source]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery));
    });
    const mergedArticles = [...matchingEditorialStories, ...articles];

    return NextResponse.json({
      success: true,
      total: mergedArticles.length,
      articles: mergedArticles,
      sourceStatus,
    });
  } catch (error) {
    console.error("[GET /api/aggregate/news]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to aggregate news articles",
      },
      { status: 502 },
    );
  }
}
