import { Container } from "@/components/Container";

function RelatedCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
      <div className="aspect-[16/10] animate-pulse bg-white/10" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-28 animate-pulse rounded bg-cyan-300/20" />
        <div className="h-5 w-full animate-pulse rounded bg-white/10" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="space-y-2 pt-2">
          <div className="h-3 w-full animate-pulse rounded bg-white/10" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default function NewsDetailsLoading() {
  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <Container className="max-w-6xl">
        <div className="h-4 w-24 animate-pulse rounded bg-cyan-300/20" />

        <header className="mt-8 max-w-4xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-7 w-28 animate-pulse rounded-full bg-cyan-300/20" />
            <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
          </div>

          <div className="space-y-4">
            <div className="h-4 w-32 animate-pulse rounded bg-cyan-300/20" />
            <div className="h-10 w-full max-w-3xl animate-pulse rounded bg-white/10 sm:h-14" />
            <div className="h-10 w-4/5 max-w-2xl animate-pulse rounded bg-white/10 sm:h-14" />
          </div>

          <div className="space-y-3 max-w-3xl">
            <div className="h-5 w-full animate-pulse rounded bg-white/10" />
            <div className="h-5 w-5/6 animate-pulse rounded bg-white/10" />
          </div>
        </header>

        <div className="mt-10 aspect-[16/9] animate-pulse rounded-lg border border-white/10 bg-white/[0.06] sm:aspect-[21/9]" />

        <section className="mx-auto mt-12 max-w-3xl rounded-lg border border-white/10 bg-slate-950/55 p-6 sm:p-8 lg:p-10">
          <div className="mb-6 h-5 w-32 animate-pulse rounded bg-white/10" />
          <div className="space-y-3">
            <div className="h-5 w-full animate-pulse rounded bg-white/10" />
            <div className="h-5 w-full animate-pulse rounded bg-white/10" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
          </div>
          <div className="mt-8 h-11 w-44 animate-pulse rounded-md bg-cyan-300/20" />
        </section>

        <section className="mt-16 border-t border-white/10 pt-10 sm:mt-20 sm:pt-12">
          <div className="h-4 w-32 animate-pulse rounded bg-cyan-300/20" />
          <div className="mt-3 h-8 w-72 max-w-full animate-pulse rounded bg-white/10" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <RelatedCardSkeleton />
            <RelatedCardSkeleton />
            <RelatedCardSkeleton />
          </div>
        </section>
      </Container>
    </div>
  );
}
