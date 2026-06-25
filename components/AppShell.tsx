"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";

function AppShellContent({
  children,
  footer,
  navbar,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
  navbar: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "";
  const isAdmin = pathname === "/dashboard/admin" || pathname.startsWith("/dashboard/admin/");
  const isAdminLogin = pathname === "/login" && redirect.startsWith("/dashboard/admin");

  if (isAdmin || isAdminLogin) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="app-atmosphere flex min-h-screen flex-col">
      {navbar}
      <main className="flex-1">{children}</main>
      {footer}
    </div>
  );
}

export function AppShell(props: {
  children: React.ReactNode;
  footer: React.ReactNode;
  navbar: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="app-atmosphere flex min-h-screen flex-col">
          {props.navbar}
          <main className="flex-1">{props.children}</main>
          {props.footer}
        </div>
      }
    >
      <AppShellContent {...props} />
    </Suspense>
  );
}
