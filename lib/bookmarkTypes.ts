export type BookmarkType = "article" | "video";

export interface Bookmark {
  id: string;
  userId: string;
  articleSlug: string | null;
  videoId: string | null;
  type: BookmarkType;
  title: string | null;
  image: string | null;
  source: string | null;
  createdAt: string;
}

export type ArticleBookmarkRequest = {
  type: "article";
  articleSlug: string;
  title?: string;
  image?: string | null;
  source?: string | null;
};

export type VideoBookmarkRequest = {
  type: "video";
  videoId: string;
  title?: string;
  image?: string | null;
  source?: string | null;
};

export type BookmarkRequest = ArticleBookmarkRequest | VideoBookmarkRequest;

export interface BookmarkResponse {
  bookmark?: Bookmark;
  bookmarks?: Bookmark[];
  error?: string;
}
