export function SportsSkeleton() {
  return (
    <section className="mt-12 sm:mt-16">
      <div className="mb-5">
        <div className="h-4 w-32 animate-pulse rounded bg-white/[0.08]" />
        <div className="mt-3 h-10 w-64 animate-pulse rounded bg-white/[0.08]" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.1fr_0.95fr]">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-[20px] border border-white/[0.08] bg-[#0B0F16]" />
        ))}
      </div>
    </section>
  );
}
