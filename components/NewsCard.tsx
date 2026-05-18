"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BookmarkButton } from "@/components/BookmarkButton";
import { isRenderableImageSrc } from "@/lib/imageUtils";
import { createArticleSlug } from "@/lib/newsSlug";
import type { NewsArticle } from "@/lib/newsTypes";

type NewsCardProps = {
  article: NewsArticle;
};

function formatPublishedAt(value?: string) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(date);
}

function formatSourceName(source?: string) {
  return source === "The Assam Tribune" ? "Assam Tribune" : source;
}

export function NewsCard({ article }: NewsCardProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const publishedAt = formatPublishedAt(article.publishedAt);
  const slug = createArticleSlug(article);
  const sourceType = article.type?.toUpperCase();
  const sourceName = formatSourceName(article.source);
  const imageSrc = article.image?.trim() ?? "";
  const shouldShowImage = isRenderableImageSrc(imageSrc) && !hasImageError;

  return (
    <article className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-glow transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[0.06]">
      <BookmarkButton
        bookmark={{
          type: "article",
          articleSlug: slug,
          title: article.title,
          image: article.image,
          source: sourceName,
        }}
        className="absolute right-3 top-3 z-10"
      />
      <Link
        href={`/news/${slug}`}
        className="block h-full"
      >
        <div className="relative aspect-[16/10] bg-slate-900">
          {shouldShowImage ? (
            <Image
              src={imageSrc}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover opacity-90 transition group-hover:scale-105 group-hover:opacity-100"
              onError={() => setHasImageError(true)}
            />
          ) : (
            <div className="grid h-full place-items-center bg-gradient-to-br from-slate-900 to-slate-800 text-sm text-slate-500">
              No image
            </div>
          )}
        </div>
        <div className="space-y-3 p-5">
          <div className="flex flex-wrap items-center gap-2">
            {sourceName ? (
              <span className="rounded-md border border-cyan-300/25 bg-cyan-300/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200">
                {sourceName}
              </span>
            ) : null}
            {sourceType ? (
              <span className="rounded-md border border-white/10 bg-white/[0.06] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                {sourceType}
              </span>
            ) : null}
          </div>
          <time className="block text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
            {publishedAt}
          </time>
          <h2 className="line-clamp-2 text-lg font-semibold leading-6 text-white">
            {article.title}
          </h2>
          <p className="line-clamp-3 text-sm leading-6 text-slate-300">
            {article.description}
          </p>
        </div>
      </Link>
    </article>
  );
}
