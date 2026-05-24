import Image from "next/image";
import Link from "next/link";
import {
  formatEditorialDate,
  getDiscoveryHref,
  getRenderableImage,
} from "@/components/editorialUtils";
import type { DiscoveryItem } from "@/lib/discoveryTypes";

type VideoShelfProps = {
  items: DiscoveryItem[];
};

export function VideoShelf({ items }: VideoShelfProps) {
  const videos = items.filter((item) => item.kind === "video");

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-y border-white/[0.08] py-8 sm:mt-16">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="font-tight text-xs font-bold uppercase text-[#6BE7FF]">Video Shelf</p>
          <h2 className="mt-2 font-display text-4xl font-semibold leading-none text-[#F8FAFC]">
            Watch & enjoy
          </h2>
        </div>
        <Link href="/videos" className="font-tight text-xs font-bold uppercase text-[#6BE7FF] hover:text-[#F8FAFC]">
          All Videos
        </Link>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-4">
          {videos.slice(0, 8).map((item) => {
            const imageSrc = getRenderableImage(item);

            return (
              <Link
                key={item.id}
                href={getDiscoveryHref(item)}
                className="group w-[20rem] shrink-0 border border-white/[0.08] bg-[#0B0F16] transition duration-300 hover:-translate-y-[3px] hover:border-[#6BE7FF]/35"
              >
                <div className="relative aspect-video overflow-hidden bg-[#050608]">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt=""
                      fill
                      sizes="20rem"
                      className="object-cover opacity-88 transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-[#F8FAFC] font-tight text-xs font-black text-[#050608]">
                    Play
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-tight text-[11px] font-bold uppercase text-[#9AA4B2]">
                    {item.source} / {formatEditorialDate(item.publishedAt)}
                  </p>
                  <h3 className="mt-2 line-clamp-2 font-tight text-lg font-semibold leading-6 text-[#F8FAFC]">
                    {item.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
