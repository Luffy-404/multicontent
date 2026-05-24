import Link from "next/link";

const actions = [
  { href: "/search?q=top", title: "Top 100", subtitle: "Editor's Picks", icon: "🏆" },
  { href: "/news", title: "Recent", subtitle: "What's New", icon: "🕒" },
  { href: "/search?q=popular", title: "Popular", subtitle: "Most Loved", icon: "❤" },
  { href: "/search?q=trending", title: "Trending", subtitle: "Hot Right Now", icon: "🔥" },
  { href: "/search?q=upcoming", title: "Upcoming", subtitle: "Coming Soon", icon: "📅" },
  { href: "/search?q=reviews", title: "Reviews", subtitle: "Expert Takes", icon: "⭐" },
  { href: "/videos", title: "Videos", subtitle: "Watch & Enjoy", icon: "▶" },
  { href: "/dashboard#saved", title: "Collections", subtitle: "Saved Stories", icon: "🖼" },
];

export function ActionGrid() {
  return (
    <section className="-mx-4 overflow-x-auto px-4 py-3 sm:mx-0 sm:px-0">
      <div className="grid min-w-[62rem] grid-cols-8 gap-3 md:min-w-0 md:grid-cols-4 lg:grid-cols-8">
        {actions.map((action, index) => (
          <Link
            key={action.title}
            href={action.href}
            className={`group flex h-[72px] items-center gap-3 rounded-[10px] border bg-transparent px-5 py-3 transition duration-200 hover:bg-white/[0.03] ${
              index === 0 ? "border-[#6BE7FF]/45" : "border-white/[0.08] hover:border-white/[0.16]"
            }`}
          >
            <span className="shrink-0 text-lg leading-none" aria-hidden="true">
              {action.icon}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-tight text-[12px] font-semibold uppercase leading-4 text-[#F8FAFC] sm:text-[13px]">
                {action.title}
              </span>
              <span className="mt-0.5 block truncate text-[11px] leading-4 text-[#9AA4B2]">
                {action.subtitle}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
