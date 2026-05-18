import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "MultiContent",
  description: "A modern content aggregation platform for news and videos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink-950 text-slate-50 antialiased">
        <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_32rem),radial-gradient(circle_at_top_right,rgba(99,102,241,0.10),transparent_30rem)]">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
