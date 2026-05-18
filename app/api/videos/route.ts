import { NextRequest, NextResponse } from "next/server";
import { cache } from "@/lib/cache";

const CACHE_TTL = 60;

interface YouTubeItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: { high: { url: string } };
    publishedAt: string;
    channelTitle: string;
  };
}

interface NormalizedVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channel: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") ?? "technology";
    const maxResults = Math.min(Number(searchParams.get("maxResults") ?? "10"), 50);

    const cacheKey = `videos:${query}:${maxResults}`;
    const cached = cache.get<NormalizedVideo[]>(cacheKey);
    if (cached) {
      return NextResponse.json({ videos: cached, cached: true });
    }

    const url = new URL(`${process.env.YOUTUBE_API_BASE_URL}/search`);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("q", query);
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", String(maxResults));
    url.searchParams.set("order", "relevance");
    url.searchParams.set("key", process.env.YOUTUBE_API_KEY!);

    const res = await fetch(url.toString(), { next: { revalidate: 0 } });

    if (!res.ok) {
      const err = await res.json();
      console.error("[GET /api/videos] YouTube API error:", err);
      return NextResponse.json(
        { error: "Failed to fetch videos" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const videos: NormalizedVideo[] = (data.items as YouTubeItem[]).map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
      channel: item.snippet.channelTitle,
    }));

    cache.set(cacheKey, videos, CACHE_TTL);

    return NextResponse.json({ videos, cached: false });
  } catch (err) {
    console.error("[GET /api/videos]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
