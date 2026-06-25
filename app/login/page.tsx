import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";

type LoginPageProps = {
  searchParams?: {
    redirect?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const redirectTo = searchParams?.redirect;
  const isAdminLogin = redirectTo?.startsWith("/dashboard/admin") ?? false;

  if (isAdminLogin) {
    return (
      <div className="admin-surface grid min-h-screen place-items-center px-4 py-10 text-[color:var(--admin-text)]">
        <div className="w-full max-w-[1040px]">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link
              href="/"
              className="font-tight text-sm font-bold uppercase tracking-[0.18em] text-[color:var(--admin-strong)]"
            >
              Multicontent
            </Link>
            <span className="rounded-full border border-[color:var(--admin-line)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--admin-muted)]">
              Admin Access
            </span>
          </div>

          <div className="grid overflow-hidden rounded-lg border border-[color:var(--admin-line)] bg-[color:var(--admin-panel)] shadow-2xl lg:grid-cols-[1fr_440px]">
            <section className="hidden min-h-[560px] flex-col justify-between border-r border-[color:var(--admin-line)] bg-[color:var(--admin-card)] p-8 lg:flex">
              <div>
                <p className="font-tight text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--admin-accent)]">
                  Editorial Operating System
                </p>
                <h1 className="mt-5 max-w-xl font-tight text-5xl font-semibold leading-none text-[color:var(--admin-strong)]">
                  Newsroom control starts here.
                </h1>
                <p className="mt-5 max-w-md text-sm leading-6 text-[color:var(--admin-muted)]">
                  Sign in with an admin account to manage stories, publishing state, and editorial workflows.
                </p>
              </div>

              <div className="grid gap-3 text-sm text-[color:var(--admin-muted)]">
                {["Admin-only access", "Story workflow protected", "Public site publishing"].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-lg border border-[color:var(--admin-line)] bg-[color:var(--admin-panel)] px-4 py-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--admin-accent)]" />
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="p-6 sm:p-8">
              <div className="mx-auto max-w-md">
                <p className="font-tight text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--admin-accent)]">
                  Welcome back
                </p>
                <h2 className="mt-3 font-tight text-4xl font-semibold text-[color:var(--admin-strong)]">
                  Editorial Login
                </h2>
                <p className="mt-3 text-sm leading-6 text-[color:var(--admin-muted)]">
                  Use your administrator account to continue to the Editorial OS.
                </p>

                <AuthForm mode="login" redirectTo={redirectTo} variant="admin" />

                <p className="mt-6 rounded-lg border border-[color:var(--admin-line)] bg-[color:var(--admin-card)] px-4 py-3 text-xs leading-5 text-[color:var(--admin-muted)]">
                  Need access? Ask an existing administrator to promote your account. Public account registration does not grant admin permissions.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20">
      <Container>
        <div className="mx-auto max-w-md rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-glow sm:p-8">
          <SectionHeading
            eyebrow="Welcome back"
            title="Login"
            description="Access your aggregation workspace."
          />
          <AuthForm mode="login" redirectTo={searchParams?.redirect} />
          <p className="mt-6 text-center text-sm text-slate-400">
            New here?{" "}
            <Link href="/register" className="font-semibold text-cyan-300 hover:text-white">
              Create an account
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
