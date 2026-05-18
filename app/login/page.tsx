import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";

export default function LoginPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container>
        <div className="mx-auto max-w-md rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-glow sm:p-8">
          <SectionHeading
            eyebrow="Welcome back"
            title="Login"
            description="Access your aggregation workspace."
          />
          <AuthForm mode="login" />
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
