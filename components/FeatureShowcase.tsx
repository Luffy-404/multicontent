import Image from "next/image";
import Link from "next/link";
import { BookmarkButton } from "@/components/BookmarkButton";
import {
  formatEditorialDate,
  getDiscoveryBookmark,
  getDiscoveryHref,
  getRenderableImage,
} from "@/components/editorialUtils";
import type { DiscoveryItem } from "@/lib/discoveryTypes";

type FeatureShowcaseProps = {
  item?: DiscoveryItem;
  label: string;
};

export function FeatureShowcase({ item, label }: FeatureShowcaseProps) {
  if (!item) {
    return null;
  }

  const href = getDiscoveryHref(item);
  const imageSrc = getRenderableImage(item);

  return (
    <section className="relative min-h-[34rem] overflow-hidden border border-white/[0.08] bg-[#0B0F16] p-5 sm:p-8 lg:h-[560px] lg:p-12">
      <BookmarkButton bookmark={getDiscoveryBookmark(item)} className="absolute right-5 top-5 z-20" />
      <div className="grid h-full gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="relative z-10 max-w-2xl">
          <p className="font-tight text-xs font-bold uppercase tracking-[0.28em] text-[#6BE7FF]">
            {label}
          </p>
          <p className="mt-6 text-xs font-bold uppercase text-[#9AA4B2]">
            {item.category} / {item.source} / {formatEditorialDate(item.publishedAt)}
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.9] text-[#F8FAFC] sm:text-6xl lg:text-7xl">
            {item.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#9AA4B2]">
            {item.description || "A top signal from your personalized discovery engine."}
          </p>
          <Link
            href={href}
            className="mt-8 inline-flex border border-[#F8FAFC]/50 px-6 py-3 font-tight text-xs font-bold uppercase text-[#F8FAFC] transition hover:border-[#6BE7FF] hover:text-[#6BE7FF]"
          >
            Know More
          </Link>
        </div>

        <Link href={href} className="group relative min-h-[18rem] overflow-hidden lg:h-full">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt=""
              fill
              sizes="(min-width: 1024px) 54vw, 100vw"
              className="object-cover object-center opacity-90 transition duration-700 group-hover:scale-[1.03]"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-[#050608]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0B0F16]/25" />
        </Link>
      </div>

      <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 lg:flex">
        <span className="h-2 w-7 rounded-full bg-[#F8FAFC]" />
        <span className="h-2 w-2 rounded-full bg-[#F8FAFC]/30" />
        <span className="h-2 w-2 rounded-full bg-[#F8FAFC]/30" />
        <span className="h-2 w-2 rounded-full bg-[#F8FAFC]/30" />
      </div>
    </section>
  );
}
