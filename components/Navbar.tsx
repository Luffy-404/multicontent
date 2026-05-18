import Link from "next/link";
import { Container } from "@/components/Container";
import { NavbarAuthLinks } from "@/components/NavbarAuthLinks";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/videos", label: "Videos" },
];

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink-950/85 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-400 text-sm font-black text-ink-950">
            M
          </span>
          <span className="text-base font-semibold tracking-tight text-white">
            MultiContent
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <NavbarAuthLinks isAuthenticated={Boolean(user)} />
      </Container>
    </header>
  );
}
