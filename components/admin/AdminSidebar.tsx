"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { EditorialUser } from "@/lib/editorialTypes";

const navItems = [
  "Overview",
  "Stories",
  "Publish",
  "Media",
  "Homepage",
  "Sports",
  "Markets",
  "Feeds",
  "Automation",
  "Analytics",
  "Settings",
];

function navHref(label: string) {
  return label === "Overview" ? "/dashboard/admin" : `/dashboard/admin#${label.toLowerCase()}`;
}

export function AdminSidebar({ user }: { user: EditorialUser }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("admin-theme");
    const nextIsLight = savedTheme === "light";
    setIsLight(nextIsLight);
    document.documentElement.classList.toggle("admin-light", nextIsLight);
  }, []);

  function toggleTheme() {
    const nextIsLight = !isLight;
    setIsLight(nextIsLight);
    document.documentElement.classList.toggle("admin-light", nextIsLight);
    window.localStorage.setItem("admin-theme", nextIsLight ? "light" : "dark");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    window.localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <aside
      className={`admin-panel sticky top-4 h-[calc(100vh-2rem)] overflow-hidden rounded-[18px] transition-all duration-300 ${
        isCollapsed ? "lg:w-[88px]" : "lg:w-[248px]"
      }`}
    >
      <div className="flex h-full flex-col p-3">
        <div className="flex items-center justify-between gap-2 px-2 py-3">
          <Link
            href="/dashboard/admin"
            className="truncate font-tight text-sm font-bold uppercase tracking-[0.18em] text-[color:var(--admin-strong)]"
          >
            {isCollapsed ? "MC" : "MULTICONTENT"}
          </Link>
          <button
            type="button"
            onClick={() => setIsCollapsed((value) => !value)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm text-[color:var(--admin-muted)] transition hover:bg-[color:var(--admin-hover)] hover:text-[color:var(--admin-strong)]"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? ">" : "<"}
          </button>
        </div>

        <nav className="mt-4 grid gap-1" aria-label="Admin sections">
          {navItems.map((item) => (
            <Link
              key={item}
              href={navHref(item)}
              className="group flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-[color:var(--admin-muted)] transition hover:bg-[color:var(--admin-hover)] hover:text-[color:var(--admin-strong)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--admin-faint)] transition group-hover:bg-[color:var(--admin-accent)]" />
              <span className={isCollapsed ? "sr-only" : "truncate"}>{item}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-2 border-t border-[color:var(--admin-line)] pt-3">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-[color:var(--admin-strong)]">
              {isCollapsed ? user.name.slice(0, 1) : user.name}
            </p>
            <p className={isCollapsed ? "sr-only" : "truncate text-xs text-[color:var(--admin-muted)]"}>
              {user.role ?? "EDITOR"} / {user.email}
            </p>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-[color:var(--admin-muted)] transition hover:bg-[color:var(--admin-hover)] hover:text-[color:var(--admin-strong)]"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full border border-[color:var(--admin-line)] text-[10px]">
              {isLight ? "L" : "D"}
            </span>
            <span className={isCollapsed ? "sr-only" : ""}>Theme Toggle</span>
          </button>

          <button
            type="button"
            onClick={() => void logout()}
            className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-[color:var(--admin-muted)] transition hover:bg-[color:var(--admin-danger-soft)] hover:text-[color:var(--admin-danger)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            <span className={isCollapsed ? "sr-only" : ""}>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
