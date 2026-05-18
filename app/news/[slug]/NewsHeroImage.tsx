"use client";

import Image from "next/image";
import { useState } from "react";
import { isRenderableImageSrc } from "@/lib/imageUtils";

type NewsHeroImageProps = {
  image?: string;
  title: string;
};

export function NewsHeroImage({ image, title }: NewsHeroImageProps) {
  const [hasError, setHasError] = useState(false);
  const imageSrc = image?.trim() ?? "";
  const shouldShowImage = isRenderableImageSrc(imageSrc) && !hasError;

  return (
    <div className="mt-10 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-glow">
      <div className="relative aspect-[16/9] w-full bg-slate-900 sm:aspect-[21/9]">
        {shouldShowImage ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            priority
            sizes="(min-width: 1280px) 1024px, 100vw"
            className="object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 px-6 text-center text-sm font-medium text-slate-500">
            Image unavailable
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950/80 to-transparent" />
      </div>
    </div>
  );
}
