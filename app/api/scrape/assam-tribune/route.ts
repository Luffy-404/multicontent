import { NextResponse } from "next/server";
import { scrapeAssamTribuneSciTech } from "@/services/scrapers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const articles = await scrapeAssamTribuneSciTech();

    return NextResponse.json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error("[GET /api/scrape/assam-tribune]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to scrape Assam Tribune sci-tech articles",
      },
      { status: 502 },
    );
  }
}

