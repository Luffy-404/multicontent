import Image from "next/image";
import Link from "next/link";
import { BookmarkButton } from "@/components/BookmarkButton";

export type Video = {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channel: string;
};

type VideoCardProps = {
  video: Video;
};

export function VideoCard({ video }: VideoCardProps) {
  const url = `/videos/${video.videoId}`;
  const publishedAt = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(video.publishedAt));

  return (
    <article className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-glow transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[0.06]">
      <BookmarkButton
        bookmark={{
          type: "video",
          videoId: video.videoId,
          title: video.title,
          image: video.thumbnail,
          source: video.channel,
        }}
        className="absolute right-3 top-3 z-10"
      />
      <Link href={url} className="block h-full">
        <div className="relative aspect-video bg-slate-900">
          <Image
            src={video.thumbnail}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-90 transition group-hover:scale-105 group-hover:opacity-100"
          />
          <div className="absolute inset-0 grid place-items-center bg-black/20">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-sm font-black text-ink-950 shadow-xl transition group-hover:scale-110">
              ▶
            </span>
          </div>
        </div>
        <div className="space-y-3 p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-cyan-300">
            <span>{video.channel}</span>
            <span className="text-slate-600">/</span>
            <time>{publishedAt}</time>
          </div>
          <h2 className="line-clamp-2 text-lg font-semibold leading-6 text-white">
            {video.title}
          </h2>
          <p className="line-clamp-3 text-sm leading-6 text-slate-300">
            {video.description}
          </p>
        </div>
      </Link>
    </article>
  );
}
