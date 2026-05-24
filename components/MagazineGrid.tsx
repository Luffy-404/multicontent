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

type MagazineGridProps = {
  items: DiscoveryItem[];
};

function StoryImage({ item, sizes }: { item: DiscoveryItem; sizes: string }) {
  const imageSrc = getRenderableImage(item);

  if (!imageSrc) {
    return <div className="absolute inset-0 bg-[#0B0F16]" />;
  }

  return (
    <Image
      src={imageSrc}
      alt=""
      fill
      sizes={sizes}
      className="object-cover opacity-88 transition duration-500 group-hover:scale-[1.03]"
    />
  );
}

function StoryMeta({ item }: { item: DiscoveryItem }) {
  return (
    <p className="font-tight text-[11px] font-bold uppercase text-[#9AA4B2]">
      {item.category} / {formatEditorialDate(item.publishedAt)}
    </p>
  );
}

function SmallStory({ item }: { item: DiscoveryItem }) {
  return (
    <Link
      href={getDiscoveryHref(item)}
      className="group grid grid-cols-[7rem_1fr] gap-4 border border-white/[0.08] bg-[#0B0F16] p-3 transition duration-300 hover:-translate-y-[3px] hover:border-[#6BE7FF]/35"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#050608]">
        <StoryImage item={item} sizes="8rem" />
      </div>
      <div className="min-w-0">
        <StoryMeta item={item} />
        <h3 className="mt-2 line-clamp-3 font-tight text-base font-semibold leading-5 text-[#F8FAFC]">
          {item.title}
        </h3>
      </div>
    </Link>
  );
}

function PopularCard({ item }: { item: DiscoveryItem }) {
  return (
    <article className="group relative border border-white/[0.08] bg-[#0B0F16] p-4 transition duration-300 hover:-translate-y-[3px] hover:border-[#6BE7FF]/35">
      <BookmarkButton bookmark={getDiscoveryBookmark(item)} className="absolute right-4 top-4 z-20" />
      <Link href={getDiscoveryHref(item)} className="grid gap-5 sm:grid-cols-[13rem_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#050608] sm:aspect-auto">
          <StoryImage item={item} sizes="14rem" />
        </div>
        <div>
          <StoryMeta item={item} />
          <h3 className="mt-3 font-display text-3xl font-semibold leading-none text-[#F8FAFC]">
            {item.title}
          </h3>
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#9AA4B2]">
            {item.description}
          </p>
        </div>
      </Link>
    </article>
  );
}

export function MagazineGrid({ items }: MagazineGridProps) {
  const [large, medium, ...rest] = items;
  const stacked = rest.slice(0, 3);
  const popular = rest.slice(3, 7);

  if (!large) {
    return null;
  }

  return (
    <>
      <section className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.7fr_0.85fr]">
        <article className="group relative min-h-[28rem] overflow-hidden border border-white/[0.08] bg-[#0B0F16] transition duration-300 hover:-translate-y-[3px] hover:border-[#6BE7FF]/35 lg:col-span-1">
          <BookmarkButton bookmark={getDiscoveryBookmark(large)} className="absolute right-4 top-4 z-20" />
          <Link href={getDiscoveryHref(large)} className="block h-full">
            <StoryImage item={large} sizes="(min-width: 1024px) 42vw, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <StoryMeta item={large} />
              <h2 className="mt-3 font-display text-4xl font-semibold leading-none text-[#F8FAFC] sm:text-5xl">
                {large.title}
              </h2>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#9AA4B2]">
                {large.description}
              </p>
            </div>
          </Link>
        </article>

        {medium ? (
          <article className="group border border-white/[0.08] bg-[#0B0F16] p-4 transition duration-300 hover:-translate-y-[3px] hover:border-[#6BE7FF]/35">
            <Link href={getDiscoveryHref(medium)}>
              <div className="relative aspect-[4/3] overflow-hidden bg-[#050608]">
                <StoryImage item={medium} sizes="25rem" />
              </div>
              <StoryMeta item={medium} />
              <h2 className="mt-3 font-display text-4xl font-semibold leading-none text-[#F8FAFC]">
                {medium.title}
              </h2>
              <p className="mt-4 line-clamp-4 text-sm leading-6 text-[#9AA4B2]">
                {medium.description}
              </p>
            </Link>
          </article>
        ) : null}

        <div className="grid gap-4">
          {stacked.map((item) => (
            <SmallStory key={item.id} item={item} />
          ))}
        </div>
      </section>

      {popular.length > 0 ? (
        <section className="mt-12 sm:mt-16">
          <div className="mb-5">
            <p className="font-tight text-xs font-bold uppercase text-[#6BE7FF]">Popular Section</p>
            <h2 className="mt-2 font-display text-4xl font-semibold leading-none text-[#F8FAFC]">
              Most read right now
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {popular.map((item) => (
              <PopularCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
