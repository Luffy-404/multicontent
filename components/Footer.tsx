import Link from "next/link";
import { Container } from "@/components/Container";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-950/80">
      <Container className="flex flex-col gap-4 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>MultiContent brings trusted headlines and timely videos into one workspace.</p>
        <div className="flex gap-4">
          <Link href="/news" className="transition hover:text-white">
            News
          </Link>
          <Link href="/videos" className="transition hover:text-white">
            Videos
          </Link>
        </div>
      </Container>
    </footer>
  );
}
