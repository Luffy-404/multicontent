import Link from "next/link";
import { CategoryNewsFeed } from "@/components/CategoryNewsFeed";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { VideoCard } from "@/components/VideoCard";
import { getNews, getVideos } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [articles, videos] = await Promise.all([
    getNews("technology", 6),
    getVideos("technology", 6),
  ]);

  return (
    <div className="py-10 sm:py-14 lg:py-20">
      <Container>
        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm font-medium text-cyan-200">
              Real-time content intelligence
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              News and video discovery for teams that move fast.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Track fresh headlines and relevant video coverage from live API sources in a focused, responsive workspace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/news"
                className="rounded-lg bg-cyan-300 px-5 py-3 text-center text-sm font-bold text-ink-950 transition hover:bg-white"
              >
                Browse news
              </Link>
              <Link
                href="/videos"
                className="rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 text-center text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/[0.08]"
              >
                Watch videos
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-glow">
            <div className="grid gap-4">
              <div className="rounded-lg border border-white/10 bg-ink-900 p-5">
                <p className="text-sm font-medium text-slate-400">Live news results</p>
                <p className="mt-2 text-4xl font-semibold text-white">{articles.length}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-ink-900 p-5">
                <p className="text-sm font-medium text-slate-400">Video results</p>
                <p className="mt-2 text-4xl font-semibold text-white">{videos.length}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Top headlines"
              title="Latest News"
              description="Fresh articles combined from API and scraped news sources."
            />
            <Link href="/news" className="hidden text-sm font-semibold text-cyan-300 hover:text-white sm:block">
              View all
            </Link>
          </div>
          <CategoryNewsFeed initialArticles={articles} className="mt-0" limit={6} />
        </section>

        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Video stream"
              title="Trending Videos"
              description="Video results fetched directly from /api/videos."
            />
            <Link href="/videos" className="hidden text-sm font-semibold text-cyan-300 hover:text-white sm:block">
              View all
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video.videoId} video={video} />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
