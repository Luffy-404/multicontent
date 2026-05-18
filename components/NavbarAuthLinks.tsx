import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

type NavbarAuthLinksProps = {
  isAuthenticated: boolean;
};

export function NavbarAuthLinks({ isAuthenticated }: NavbarAuthLinksProps) {
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
        >
          Dashboard
        </Link>
        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-ink-950 transition hover:bg-cyan-200"
      >
        Register
      </Link>
    </div>
  );
}
