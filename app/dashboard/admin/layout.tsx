import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Admin / MultiContent",
  description: "MultiContent editorial operating system.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
