"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BookmarkButton } from "@/components/BookmarkButton";
import { isRenderableImageSrc } from "@/lib/imageUtils";
import { createArticleSlug } from "@/lib/newsSlug";
import type { DiscoveryItem } from "@/lib/discoveryTypes";

type DiscoveryCardProps = {
  item: DiscoveryItem;
  featured?: boolean;
};

function formatPublishedAt(value?: string) {
  if (!value) {
    return "Live";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Live";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(date);
}

export function DiscoveryCard({ item, featured = false }: DiscoveryCardProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const articleSlug = item.kind === "article" ? createArticleSlug(item.article) : "";
  const href = item.kind === "article" ? `/news/${articleSlug}` : `/videos/${item.video.videoId}`;
  const imageSrc = item.image?.trim() ?? "";
  const shouldShowImage = isRenderableImageSrc(imageSrc) && !hasImageError;

  return (
    <article
      className={`cinematic-hover group relative overflow-hidden rounded-[20px] border border-white/[0.06] bg-[#0C1018] hover:border-[#64E6FF]/30 ${
        featured ? "lg:grid lg:grid-cols-[1.08fr_0.92fr]" : ""
      }`}
    >
      <BookmarkButton
        bookmark={
          item.kind === "article"
            ? {
                type: "article",
                articleSlug,
                title: item.title,
                image: item.image,
                source: item.source,
              }
            : {
                type: "video",
                videoId: item.video.videoId,
                title: item.title,
                image: item.image,
                source: item.source,
              }
        }
        className="absolute right-3 top-3 z-20"
      />

      <Link href={href} className={featured ? "contents" : "block h-full"}>
        <div className={`relative bg-[#05070A] ${featured ? "min-h-72 lg:min-h-full" : "aspect-[16/10]"}`}>
          {shouldShowImage ? (
            <Image
              src={imageSrc}
              alt=""
              fill
              sizes={featured ? "(min-width: 1024px) 45vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
              className="object-cover opacity-86 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
              onError={() => setHasImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-[#0C1018]" />
          )}
          <div className="absolute inset-0 bg-black/15" />
          {item.kind === "video" ? (
            <span className="absolute bottom-4 left-4 grid h-11 w-11 place-items-center rounded-full bg-[#F7F8FA] text-xs font-black text-[#05070A] transition duration-300 group-hover:scale-105">
              Play
            </span>
          ) : null}
        </div>

        <div className={`space-y-4 p-5 sm:p-6 ${featured ? "sm:p-8" : ""}`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-[#64E6FF]/25 bg-[#64E6FF]/10 px-2.5 py-1 text-[11px] font-bold uppercase text-[#64E6FF]">
              {item.kind}
            </span>
            <span className="border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-[11px] font-bold uppercase text-[#8B97A8]">
              {item.category}
            </span>
            <span className="border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-[11px] font-bold uppercase text-[#8B97A8]">
              {item.popularityScore} score
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-[#8B97A8]">
              {item.source} / {formatPublishedAt(item.publishedAt)}
            </p>
            <h3
              className={`mt-3 font-tight font-semibold leading-tight text-[#F7F8FA] ${
                featured ? "text-3xl sm:text-4xl lg:text-5xl" : "line-clamp-2 text-xl"
              }`}
            >
              {item.title}
            </h3>
          </div>

          <p className={`text-sm leading-6 text-[#8B97A8] ${featured ? "sm:text-base sm:leading-7" : "line-clamp-3"}`}>
            {item.description || "A fast-moving signal from the MultiContent discovery graph."}
          </p>
        </div>
      </Link>
    </article>
  );
}
