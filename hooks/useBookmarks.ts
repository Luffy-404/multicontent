"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Bookmark, BookmarkRequest, BookmarkResponse } from "@/lib/bookmarkTypes";

type BookmarkListener = (bookmarks: Bookmark[] | null) => void;

let bookmarksCache: Bookmark[] | null = null;
let bookmarksCacheToken: string | null = null;
let bookmarksRequest: Promise<Bookmark[]> | null = null;
const listeners = new Set<BookmarkListener>();

function emitBookmarks(bookmarks: Bookmark[] | null, token = getCurrentToken()) {
  bookmarksCache = bookmarks;
  bookmarksCacheToken = token;
  listeners.forEach((listener) => listener(bookmarks));
}

function subscribe(listener: BookmarkListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getBookmarkKey(bookmark: BookmarkRequest | Bookmark) {
  return bookmark.type === "article"
    ? `article:${bookmark.articleSlug}`
    : `video:${bookmark.videoId}`;
}

function getCurrentToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("token");
}

function getAuthHeaders(): Record<string, string> {
  const token = getCurrentToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function ensureAuthenticated(router: ReturnType<typeof useRouter>) {
  if (typeof window === "undefined") {
    return true;
  }

  const token = window.localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return false;
  }

  return true;
}

async function parseBookmarkResponse(response: Response) {
  return response.json().catch(() => null) as Promise<BookmarkResponse | null>;
}

async function requestBookmarks() {
  const token = getCurrentToken();

  if (bookmarksCache && bookmarksCacheToken === token) {
    return bookmarksCache;
  }

  if (!bookmarksRequest) {
    bookmarksRequest = fetch("/api/bookmarks", {
      headers: getAuthHeaders(),
      credentials: "same-origin",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(response.status === 401 ? "Unauthorized" : "Failed to fetch bookmarks");
        }

        const data = await parseBookmarkResponse(response);
        return data?.bookmarks ?? [];
      })
      .finally(() => {
        bookmarksRequest = null;
      });
  }

  const bookmarks = await bookmarksRequest;
  emitBookmarks(bookmarks, token);
  return bookmarks;
}

export function useBookmarks() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[] | null>(() =>
    bookmarksCacheToken === getCurrentToken() ? bookmarksCache : null,
  );
  const [isLoading, setIsLoading] = useState(
    bookmarksCache === null || bookmarksCacheToken !== getCurrentToken(),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => subscribe(setBookmarks), []);

  useEffect(() => {
    if (bookmarksCache !== null && bookmarksCacheToken === getCurrentToken()) {
      setIsLoading(false);
      return;
    }

    requestBookmarks()
      .catch((requestError) => {
        if (requestError instanceof Error && requestError.message === "Unauthorized") {
          emitBookmarks([], getCurrentToken());
        } else {
          setError("Unable to load saved items.");
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const bookmarkMap = useMemo(() => {
    const map = new Map<string, Bookmark>();

    for (const bookmark of bookmarks ?? []) {
      map.set(getBookmarkKey(bookmark), bookmark);
    }

    return map;
  }, [bookmarks]);

  const getBookmark = useCallback(
    (payload: BookmarkRequest) => bookmarkMap.get(getBookmarkKey(payload)) ?? null,
    [bookmarkMap],
  );

  const isBookmarked = useCallback(
    (payload: BookmarkRequest) => Boolean(getBookmark(payload)),
    [getBookmark],
  );

  const saveBookmark = useCallback(
    async (payload: BookmarkRequest) => {
      if (!ensureAuthenticated(router)) {
        return null;
      }

      const previousBookmarks = bookmarksCache ?? [];
      const optimisticBookmark: Bookmark = {
        id: `optimistic-${getBookmarkKey(payload)}`,
        userId: "",
        articleSlug: payload.type === "article" ? payload.articleSlug : null,
        videoId: payload.type === "video" ? payload.videoId : null,
        type: payload.type,
        title: payload.title ?? null,
        image: payload.image ?? null,
        source: payload.source ?? null,
        createdAt: new Date().toISOString(),
      };
      const key = getBookmarkKey(payload);

      emitBookmarks([
        optimisticBookmark,
        ...previousBookmarks.filter((bookmark) => getBookmarkKey(bookmark) !== key),
      ]);
      setError(null);

      try {
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          credentials: "same-origin",
          body: JSON.stringify(payload),
        });

        if (response.status === 401) {
          router.push("/login");
          throw new Error("Unauthorized");
        }

        if (!response.ok) {
          throw new Error("Failed to save bookmark");
        }

        const data = await parseBookmarkResponse(response);
        const savedBookmark = data?.bookmark;

        if (!savedBookmark) {
          throw new Error("Bookmark response was empty");
        }

        emitBookmarks([
          savedBookmark,
          ...previousBookmarks.filter((bookmark) => getBookmarkKey(bookmark) !== key),
        ]);
        return savedBookmark;
      } catch (requestError) {
        emitBookmarks(previousBookmarks);
        setError("Unable to save this item.");
        throw requestError;
      }
    },
    [router],
  );

  const removeBookmark = useCallback(
    async (id: string) => {
      if (!ensureAuthenticated(router)) {
        return;
      }

      const previousBookmarks = bookmarksCache ?? [];
      emitBookmarks(previousBookmarks.filter((bookmark) => bookmark.id !== id));
      setError(null);

      try {
        const response = await fetch(`/api/bookmarks/${encodeURIComponent(id)}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
          credentials: "same-origin",
        });

        if (response.status === 401) {
          router.push("/login");
          throw new Error("Unauthorized");
        }

        if (!response.ok) {
          throw new Error("Failed to remove bookmark");
        }
      } catch (requestError) {
        emitBookmarks(previousBookmarks);
        setError("Unable to remove this item.");
        throw requestError;
      }
    },
    [router],
  );

  return {
    bookmarks: bookmarks ?? [],
    getBookmark,
    isBookmarked,
    isLoading,
    error,
    saveBookmark,
    removeBookmark,
  };
}
