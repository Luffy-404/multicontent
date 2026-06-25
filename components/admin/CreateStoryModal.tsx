"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type CreateStoryModalProps = {
  action: (formData: FormData) => Promise<void>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CreateStoryModal({ action }: CreateStoryModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isPending, startTransition] = useTransition();
  const computedSlug = useMemo(() => slug || slugify(title), [slug, title]);

  function submit(formData: FormData) {
    if (!formData.get("slug")) {
      formData.set("slug", computedSlug);
    }

    startTransition(async () => {
      await action(formData);
      setIsOpen(false);
      setTitle("");
      setSlug("");
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="h-10 rounded-full bg-[color:var(--admin-strong)] px-4 text-sm font-semibold text-[color:var(--admin-bg)] transition hover:opacity-90"
      >
        Create Article
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 py-8 backdrop-blur-sm">
          <div className="admin-panel max-h-full w-full max-w-3xl overflow-y-auto rounded-[20px] p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-tight text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--admin-accent)]">
                  Manual Publishing
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-[color:var(--admin-strong)]">
                  Create Article
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full text-[color:var(--admin-muted)] transition hover:bg-[color:var(--admin-hover)] hover:text-[color:var(--admin-strong)]"
                aria-label="Close modal"
              >
                x
              </button>
            </div>

            <form action={submit} className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-[color:var(--admin-strong)]">
                  Title
                  <input
                    name="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                    className="admin-input"
                    placeholder="Story headline"
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-[color:var(--admin-strong)]">
                  Slug
                  <input
                    name="slug"
                    value={computedSlug}
                    onChange={(event) => setSlug(slugify(event.target.value))}
                    className="admin-input"
                    placeholder="story-headline"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-[color:var(--admin-strong)]">
                  Category
                  <input name="category" required className="admin-input" placeholder="World" />
                </label>

                <label className="grid gap-2 text-sm font-medium text-[color:var(--admin-strong)]">
                  Cover
                  <input name="cover" className="admin-input" placeholder="https://..." />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium text-[color:var(--admin-strong)]">
                Excerpt
                <textarea
                  name="excerpt"
                  required
                  rows={3}
                  className="admin-input resize-none py-3"
                  placeholder="Short summary for cards and previews"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-[color:var(--admin-strong)]">
                Body
                <textarea
                  name="content"
                  required
                  rows={9}
                  className="admin-input resize-y py-3"
                  placeholder="Write the story body..."
                />
              </label>

              <div className="flex flex-col gap-3 border-t border-[color:var(--admin-line)] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="submit"
                  name="intent"
                  value="draft"
                  disabled={isPending}
                  className="h-10 rounded-full border border-[color:var(--admin-line)] px-4 text-sm font-semibold text-[color:var(--admin-strong)] transition hover:bg-[color:var(--admin-hover)] disabled:opacity-60"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  name="intent"
                  value="publish"
                  disabled={isPending}
                  className="h-10 rounded-full bg-[color:var(--admin-accent)] px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
