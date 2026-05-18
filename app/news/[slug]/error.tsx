"use client";

import Link from "next/link";
import { Container } from "@/components/Container";

type NewsDetailsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function NewsDetailsError({
  error,
  reset,
}: NewsDetailsErrorProps) {
  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <Container className="max-w-3xl">
        <div className="rounded-lg border border-white/10 bg-slate-950/70 p-6 shadow-glow sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            News unavailable
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            We could not load this article.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            The article details or related stories could not be fetched right
            now. Please try again in a moment.
          </p>
          {error.message ? (
            <p className="mt-4 rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-400">
              {error.message}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center rounded-md bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              Try again
            </button>
            <Link
              href="/news"
              className="inline-flex items-center justify-center rounded-md border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:text-white"
            >
              Back to news
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
