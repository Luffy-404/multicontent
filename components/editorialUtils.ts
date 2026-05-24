import type { DiscoveryItem } from "@/lib/discoveryTypes";
import { isRenderableImageSrc } from "@/lib/imageUtils";
import { createArticleSlug } from "@/lib/newsSlug";

export function getDiscoveryHref(item: DiscoveryItem) {
  if (item.kind === "article") {
    return `/news/${createArticleSlug(item.article)}`;
  }

  return `/videos/${item.video.videoId}`;
}

export function getDiscoveryBookmark(item: DiscoveryItem) {
  if (item.kind === "article") {
    return {
      type: "article" as const,
      articleSlug: createArticleSlug(item.article),
      title: item.title,
      image: item.image,
      source: item.source,
    };
  }

  return {
    type: "video" as const,
    videoId: item.video.videoId,
    title: item.title,
    image: item.image,
    source: item.source,
  };
}

export function getRenderableImage(item: DiscoveryItem) {
  const imageSrc = item.image?.trim() ?? "";
  return isRenderableImageSrc(imageSrc) ? imageSrc : "";
}

export function formatEditorialDate(value?: string) {
  if (!value) {
    return "Live";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Live";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}
