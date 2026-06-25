"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Loader2, Send, Trash2 } from "lucide-react";
import { CreateStoryModal } from "@/components/admin/CreateStoryModal";
import type { StoryAction, StoryListItem } from "@/lib/editorialTypes";

type StoryActionsProps = {
  story: StoryListItem;
  updateStoryAction: StoryAction;
  publishStoryAction: StoryAction;
  deleteStoryAction: StoryAction;
};

function actionFormData(story: StoryListItem, status?: StoryListItem["status"]) {
  const formData = new FormData();
  formData.set("id", story.id);

  if (status) {
    formData.set("status", status);
  }

  return formData;
}

export function StoryActions({
  story,
  updateStoryAction,
  publishStoryAction,
  deleteStoryAction,
}: StoryActionsProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [isPending, startTransition] = useTransition();
  const nextStatus = story.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

  function run(action: StoryAction, formData: FormData, confirmation?: string) {
    setError("");
    setToast("");

    if (confirmation && !window.confirm(confirmation)) {
      return;
    }

    startTransition(async () => {
      try {
        await action(formData);
        setToast("Story updated.");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Action failed.");
      }
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <CreateStoryModal
          story={story}
          action={updateStoryAction}
          triggerLabel="Edit"
          intent="edit"
        />
        {story.status === "PUBLISHED" ? (
          <Link
            href={`/news/${story.slug}`}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-[color:var(--admin-muted)] outline-none transition hover:bg-[color:var(--admin-hover)] hover:text-[color:var(--admin-strong)] focus-visible:ring-2 focus-visible:ring-[color:var(--admin-accent-soft)]"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            View
          </Link>
        ) : null}
        <button
          type="button"
          disabled={isPending}
          onClick={() => run(publishStoryAction, actionFormData(story, nextStatus))}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-[color:var(--admin-muted)] outline-none transition hover:bg-[color:var(--admin-hover)] hover:text-[color:var(--admin-strong)] focus-visible:ring-2 focus-visible:ring-[color:var(--admin-accent-soft)] disabled:opacity-60"
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Send className="h-3.5 w-3.5" aria-hidden="true" />}
          {story.status === "PUBLISHED" ? "Unpublish" : "Publish"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            run(
              deleteStoryAction,
              actionFormData(story),
              `Delete "${story.title}"? This cannot be undone.`,
            )
          }
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-red-200 outline-none transition hover:bg-red-400/10 focus-visible:ring-2 focus-visible:ring-red-300/30 disabled:opacity-60"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Delete
        </button>
      </div>
      {toast ? (
        <p className="max-w-xs rounded-md border border-emerald-300/20 bg-emerald-400/10 px-2 py-1 text-xs text-emerald-200" role="status">
          {toast}
        </p>
      ) : null}
      {error ? <p className="max-w-xs text-xs text-red-200">{error}</p> : null}
    </div>
  );
}
