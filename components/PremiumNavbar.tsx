"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/components/Container";
import { NavbarSearch } from "@/components/NavbarSearch";

type NavbarUser = {
  name: string;
  email: string;
} | null;

type PremiumNavbarProps = {
  user: NavbarUser;
};

const navItems = [
  { href: "/news", label: "Latest" },
  { href: "/search?q=featured", label: "Featured" },
  { href: "/news", label: "News" },
  { href: "/videos", label: "Videos" },
  { href: "/search?q=Technology", label: "Technology" },
  { href: "/search?q=AI", label: "AI" },
  { href: "/search?q=Gaming", label: "Gaming" },
  { href: "/dashboard#saved", label: "Saved" },
  { href: "/search", label: "More" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  const cleanHref = href.split("?")[0].split("#")[0];
  return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
}

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span className="relative h-4 w-5" aria-hidden="true">
      <span className={`absolute left-0 top-0 h-px w-5 bg-current transition ${isOpen ? "translate-y-[7px] rotate-45" : ""}`} />
      <span className={`absolute left-0 top-[7px] h-px w-5 bg-current transition ${isOpen ? "opacity-0" : ""}`} />
      <span className={`absolute bottom-0 left-0 h-px w-5 bg-current transition ${isOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
    </span>
  );
}

function SocialLinks() {
  return (
    <div className="hidden items-center gap-3 text-xs font-semibold text-[#9AA4B2] lg:flex">
      <span>Follow Us :</span>
      {["f", "X", "ig", "yt"].map((item) => (
        <Link key={item} href="/search" className="font-tight text-sm uppercase text-[#F8FAFC] transition hover:text-[#6BE7FF]">
          {item}
        </Link>
      ))}
    </div>
  );
}

function UserMenu({ user }: { user: Exclude<NavbarUser, null> }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const initial = (user.name || user.email).slice(0, 1).toUpperCase();

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } finally {
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; max-age=0; samesite=lax";
      setIsOpen(false);
      router.replace("/");
      router.refresh();
    }
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.08] bg-[#0B0F16] font-tight text-sm font-bold text-[#F8FAFC] transition hover:border-[#6BE7FF]/40"
      >
        {initial}
      </button>

      <div
        className={`absolute right-0 top-12 z-50 w-64 origin-top-right overflow-hidden border border-white/[0.08] bg-[#050608]/96 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl transition duration-200 ${
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div className="border-b border-white/[0.08] px-4 py-3">
          <p className="truncate text-sm font-semibold text-[#F8FAFC]">{user.name}</p>
          <p className="mt-1 truncate text-xs text-[#9AA4B2]">{user.email}</p>
        </div>
        <div className="p-2">
          {[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/dashboard#saved", label: "Saved" },
            { href: "/dashboard/settings", label: "Settings" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 text-sm font-medium text-[#9AA4B2] transition hover:bg-white/[0.04] hover:text-[#F8FAFC]"
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
            className="mt-1 w-full px-3 py-3 text-left text-sm font-semibold text-red-200 transition hover:bg-red-500/10 disabled:cursor-wait disabled:opacity-70"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}

function HeaderActions({ user }: { user: NavbarUser }) {
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <NavbarSearch className="hidden max-w-none md:block" />
        <UserMenu user={user} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <NavbarSearch className="hidden max-w-none md:block" />
      <Link
        href="/login"
        className="hidden border border-white/[0.12] px-4 py-2 font-tight text-xs font-bold uppercase text-[#F8FAFC] transition hover:border-[#6BE7FF]/40 sm:block"
      >
        Sign In
      </Link>
      <Link
        href="/register"
        className="hidden border border-[#6BE7FF] bg-[#F8FAFC] px-4 py-2 font-tight text-xs font-bold uppercase text-[#050608] transition hover:bg-[#6BE7FF] sm:block"
      >
        Join Now
      </Link>
    </div>
  );
}

function MobileDrawer({
  isOpen,
  pathname,
  user,
  onClose,
}: {
  isOpen: boolean;
  pathname: string;
  user: NavbarUser;
  onClose: () => void;
}) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    }).catch(() => null);
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0; samesite=lax";
    onClose();
    router.replace("/");
    router.refresh();
  }

  return (
    <div
      className={`fixed inset-x-0 top-[128px] z-40 max-h-[calc(100vh-128px)] overflow-y-auto border-b border-white/[0.08] bg-[#050608]/98 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl transition duration-300 md:hidden ${
        isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-6 opacity-0"
      }`}
    >
      <Container className="space-y-5 py-5">
        <NavbarSearch className="block max-w-none" initiallyExpanded />
        <nav aria-label="Mobile navigation" className="grid gap-1">
          {navItems.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`border-b border-white/[0.06] px-1 py-3 font-tight text-sm font-bold uppercase ${
                  isActive ? "text-[#6BE7FF]" : "text-[#F8FAFC]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="grid gap-2 border-t border-white/[0.08] pt-4">
          {user ? (
            <>
              <Link href="/dashboard" onClick={onClose} className="px-1 py-3 font-tight text-sm font-bold uppercase text-[#F8FAFC]">
                Profile
              </Link>
              <button type="button" onClick={() => void handleLogout()} className="px-1 py-3 text-left font-tight text-sm font-bold uppercase text-red-200">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={onClose} className="px-1 py-3 font-tight text-sm font-bold uppercase text-[#F8FAFC]">
                Sign In
              </Link>
              <Link href="/register" onClick={onClose} className="px-1 py-3 font-tight text-sm font-bold uppercase text-[#6BE7FF]">
                Join Now
              </Link>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}

export function EditorialHeader({ user }: PremiumNavbarProps) {
  const memoizedUser = useMemo(() => user, [user]);

  return (
    <div className="border-b border-white/[0.08] bg-[#050608]/88 backdrop-blur-xl">
      <Container className="grid h-[72px] grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="min-w-0">
          <SocialLinks />
        </div>
        <Link href="/" className="text-center">
          <span className="block font-heading text-3xl font-semibold uppercase leading-none tracking-[0.18em] text-[#F8FAFC] sm:text-4xl">
            MultiContent
          </span>
          <span className="mt-1 hidden font-tight text-[10px] font-bold uppercase tracking-[0.38em] text-[#9AA4B2] sm:block">
            Stories That Connect
          </span>
        </Link>
        <div className="flex justify-end">
          <HeaderActions user={memoizedUser} />
        </div>
      </Container>
    </div>
  );
}

export function EditorialNav({
  pathname,
  isMobileOpen,
  onToggleMobile,
}: {
  pathname: string;
  isMobileOpen: boolean;
  onToggleMobile: () => void;
}) {
  return (
    <div className="border-b border-white/[0.08] bg-[#050608]/88 backdrop-blur-xl">
      <Container className="flex h-14 items-center gap-5">
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileOpen}
          onClick={onToggleMobile}
          className="grid h-10 w-10 shrink-0 place-items-center text-[#F8FAFC] transition hover:text-[#6BE7FF]"
        >
          <MenuIcon isOpen={isMobileOpen} />
        </button>

        <nav aria-label="Primary navigation" className="hidden min-w-0 flex-1 items-center justify-between gap-4 md:flex">
          {navItems.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative whitespace-nowrap py-5 font-tight text-xs font-bold uppercase transition ${
                  isActive ? "text-[#F8FAFC]" : "text-[#9AA4B2] hover:text-[#F8FAFC]"
                }`}
              >
                {item.label}
                {isActive ? <span className="absolute inset-x-0 bottom-0 h-px bg-[#6BE7FF]" /> : null}
              </Link>
            );
          })}
        </nav>
      </Container>
    </div>
  );
}

export function PremiumNavbar({ user }: PremiumNavbarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <EditorialHeader user={user} />
      <EditorialNav
        pathname={pathname}
        isMobileOpen={isMobileOpen}
        onToggleMobile={() => setIsMobileOpen((current) => !current)}
      />
      <MobileDrawer
        isOpen={isMobileOpen}
        pathname={pathname}
        user={user}
        onClose={() => setIsMobileOpen(false)}
      />
    </header>
  );
}
