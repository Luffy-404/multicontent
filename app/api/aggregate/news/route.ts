import { NextRequest, NextResponse } from "next/server";
import { aggregateNews } from "@/services/news/newsAggregator";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") ?? "technology";
    const { articles, sourceStatus } = await aggregateNews(query);

    return NextResponse.json({
      success: true,
      total: articles.length,
      articles,
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
