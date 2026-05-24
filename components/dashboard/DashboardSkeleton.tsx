export function DashboardSkeleton() {
  return (
    <section className="relative left-1/2 mt-12 w-screen max-w-[1440px] -translate-x-1/2 px-4 md:px-6 xl:px-8">
      <div className="mb-5">
        <div className="h-3 w-48 animate-pulse bg-white/[0.08]" />
        <div className="mt-3 h-10 w-64 animate-pulse bg-white/[0.08]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr] lg:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-56 animate-pulse border border-white/[0.08] bg-[#0B0F16]" />
        ))}
      </div>
    </section>
  );
}
