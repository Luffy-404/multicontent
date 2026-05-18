import { notFound } from "next/navigation";
import { BookmarkButton } from "@/components/BookmarkButton";
import { Container } from "@/components/Container";

type VideoDetailsPageProps = {
  params: {
    id: string;
  };
};

type YouTubeVideoResponse = {
  items?: Array<{
    snippet?: {
      title?: string;
      description?: string;
      channelTitle?: string;
      publishedAt?: string;
      thumbnails?: {
        maxres?: { url?: string };
        high?: { url?: string };
        medium?: { url?: string };
        default?: { url?: string };
      };
    };
  }>;
};

async function getVideoDetails(id: string) {
  if (!process.env.YOUTUBE_API_BASE_URL || !process.env.YOUTUBE_API_KEY) {
    return null;
  }

  const url = new URL(`${process.env.YOUTUBE_API_BASE_URL}/videos`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("id", id);
  url.searchParams.set("key", process.env.YOUTUBE_API_KEY);

  const response = await fetch(url.toString(), { cache: "no-store" });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as YouTubeVideoResponse;
  const snippet = data.items?.[0]?.snippet;

  if (!snippet?.title) {
    return null;
  }

  return {
    title: snippet.title,
    description: snippet.description ?? "",
    channel: snippet.channelTitle ?? "YouTube",
    publishedAt: snippet.publishedAt,
    thumbnail:
      snippet.thumbnails?.maxres?.url ??
      snippet.thumbnails?.high?.url ??
      snippet.thumbnails?.medium?.url ??
      snippet.thumbnails?.default?.url ??
      `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`,
  };
}

export default async function VideoDetailsPage({ params }: VideoDetailsPageProps) {
  const video = await getVideoDetails(params.id);

  if (!video) {
    notFound();
  }

  const embedUrl = `https://www.youtube.com/embed/${encodeURIComponent(params.id)}`;
  const publishedAt = video.publishedAt
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
        new Date(video.publishedAt),
      )
    : null;

  return (
    <div className="py-8 sm:py-10 lg:py-14">
      <Container>
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-black shadow-glow">
            <div className="relative aspect-video w-full">
              <iframe
                src={embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>

          <section className="mt-8 rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-glow sm:p-8">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              <span>{video.channel}</span>
              {publishedAt ? (
                <>
                  <span className="text-slate-600">/</span>
                  <time>{publishedAt}</time>
                </>
              ) : null}
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {video.title}
              </h1>
              <BookmarkButton
                bookmark={{
                  type: "video",
                  videoId: params.id,
                  title: video.title,
                  image: video.thumbnail,
                  source: video.channel,
                }}
                className="shrink-0"
              />
            </div>

            {video.description ? (
              <p className="mt-5 whitespace-pre-line text-base leading-7 text-slate-300">
                {video.description}
              </p>
            ) : (
              <p className="mt-5 text-base leading-7 text-slate-400">
                No description was provided for this video.
              </p>
            )}
          </section>
        </div>
      </Container>
    </div>
  );
}
