import Link from "next/link";
import { Container } from "@/components/Container";

export function EditorialFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050608]">
      <Container className="grid gap-6 py-8 lg:grid-cols-[1.2fr_1fr_auto] lg:items-center">
        <div className="flex items-center gap-4">
          <div className="grid h-10 w-10 place-items-center border border-white/[0.08] bg-[#0B0F16] text-[#6BE7FF]">
            M
          </div>
          <div>
            <p className="font-tight text-sm font-bold uppercase text-[#F8FAFC]">Newsletter</p>
            <p className="mt-1 text-sm text-[#9AA4B2]">Get the best stories in your inbox.</p>
          </div>
        </div>

        <form className="flex max-w-md border border-white/[0.12] bg-[#0B0F16]">
          <input
            type="email"
            placeholder="Enter your email"
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-[#F8FAFC] outline-none placeholder:text-[#9AA4B2]"
          />
          <button type="submit" className="border-l border-white/[0.12] px-4 font-tight text-xs font-bold uppercase text-[#F8FAFC]">
            Send
          </button>
        </form>

        <nav className="flex flex-wrap gap-5 font-tight text-xs font-bold uppercase text-[#9AA4B2]">
          <Link href="/news" className="hover:text-[#F8FAFC]">News</Link>
          <Link href="/videos" className="hover:text-[#F8FAFC]">Videos</Link>
          <Link href="/search" className="hover:text-[#F8FAFC]">Search</Link>
          <Link href="/dashboard" className="hover:text-[#F8FAFC]">Profile</Link>
        </nav>
      </Container>
    </footer>
  );
}
