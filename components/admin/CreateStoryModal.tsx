"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FilePenLine, Loader2, Plus, X } from "lucide-react";
import type { StoryAction, StoryListItem } from "@/lib/editorialTypes";

type CreateStoryModalProps = {
  action: StoryAction;
  story?: StoryListItem;
  triggerLabel?: string;
  intent?: "create" | "edit";
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CreateStoryModal({
  action,
  story,
  triggerLabel,
  intent = story ? "edit" : "create",
}: CreateStoryModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(story?.title ?? "");
  const [slug, setSlug] = useState(story?.slug ?? "");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const computedSlug = useMemo(() => slug || slugify(title), [slug, title]);
  const isEdit = intent === "edit";
  const TriggerIcon = isEdit ? FilePenLine : Plus;

  function close() {
    if (isPending) {
      return;
    }

    setIsOpen(false);
    setError("");

    if (!isEdit) {
      setTitle("");
      setSlug("");
    }
  }

  function submit(formData: FormData) {
    setError("");

    if (!formData.get("slug")) {
      formData.set("slug", computedSlug);
    }

    if (story?.id) {
      formData.set("id", story.id);
    }

    startTransition(async () => {
      try {
        await action(formData);
        setIsOpen(false);
        if (!isEdit) {
          setTitle("");
          setSlug("");
        }
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to save story.");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          isEdit
            ? "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-[color:var(--admin-muted)] outline-none transition hover:bg-[color:var(--admin-hover)] hover:text-[color:var(--admin-strong)] focus-visible:ring-2 focus-visible:ring-[color:var(--admin-accent-soft)]"
            : "inline-flex h-10 items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-400/10 px-4 text-sm font-semibold text-cyan-300 outline-none transition hover:bg-cyan-400/15 focus-visible:ring-2 focus-visible:ring-cyan-300/30"
        }
      >
        <TriggerIcon className="h-4 w-4" aria-hidden="true" />
        {triggerLabel ?? (isEdit ? "Edit" : "Create Story")}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-8 backdrop-blur-sm">
          <div className="admin-panel max-h-full w-full max-w-3xl overflow-y-auto rounded-lg p-5 shadow-2xl sm:p-6" role="dialog" aria-modal="true" aria-labelledby="story-modal-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-tight text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--admin-accent)]">
                  Manual Publishing
                </p>
                <h2 id="story-modal-title" className="mt-2 font-tight text-2xl font-semibold text-[color:var(--admin-strong)]">
                  {isEdit ? "Edit Story" : "Create Story"}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[color:var(--admin-muted)]">
                  {isEdit ? "Update headline, metadata, and body copy before publishing changes." : "Prepare a story for the editorial desk. Save as draft or publish when ready."}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="grid h-9 w-9 place-items-center rounded-full text-[color:var(--admin-muted)] outline-none transition hover:bg-[color:var(--admin-hover)] hover:text-[color:var(--admin-strong)] focus-visible:ring-2 focus-visible:ring-[color:var(--admin-accent-soft)]"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form action={submit} className="mt-6 grid gap-4">
              {story?.id ? <input type="hidden" name="id" value={story.id} /> : null}

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
                  <input
                    name="category"
                    required
                    defaultValue={story?.category ?? ""}
                    className="admin-input"
                    placeholder="World"
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-[color:var(--admin-strong)]">
                  Cover
                  <input
                    name="cover"
                    defaultValue={story?.cover ?? ""}
                    className="admin-input"
                    placeholder="https://..."
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium text-[color:var(--admin-strong)]">
                Excerpt
                <textarea
                  name="excerpt"
                  required
                  rows={3}
                  defaultValue={story?.excerpt ?? ""}
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
                  defaultValue={story?.content ?? ""}
                  className="admin-input resize-y py-3"
                  placeholder="Write the story body..."
                />
              </label>

              {error ? (
                <p className="rounded-lg border border-red-400/25 bg-red-400/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 border-t border-[color:var(--admin-line)] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="submit"
                  name="intent"
                  value="draft"
                  disabled={isPending}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[color:var(--admin-line)] px-4 text-sm font-semibold text-[color:var(--admin-strong)] outline-none transition hover:bg-[color:var(--admin-hover)] focus-visible:ring-2 focus-visible:ring-[color:var(--admin-accent-soft)] disabled:opacity-60"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                  {isPending ? "Saving..." : isEdit ? "Save Changes" : "Save Draft"}
                </button>
                {!isEdit ? (
                  <button
                    type="submit"
                    name="intent"
                    value="publish"
                    disabled={isPending}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[color:var(--admin-accent)] px-4 text-sm font-semibold text-white outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[color:var(--admin-accent-soft)] disabled:opacity-60"
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                    Publish
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
