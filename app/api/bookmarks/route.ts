import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import type { Bookmark } from "@/lib/bookmarkTypes";
import { prisma } from "@/lib/prisma";

const bookmarkSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("article"),
    articleSlug: z.string().min(1),
    title: z.string().optional(),
    image: z.string().nullable().optional(),
    source: z.string().nullable().optional(),
  }),
  z.object({
    type: z.literal("video"),
    videoId: z.string().min(1),
    title: z.string().optional(),
    image: z.string().nullable().optional(),
    source: z.string().nullable().optional(),
  }),
]);

function toBookmark(bookmark: {
  id: string;
  userId: string;
  articleSlug: string | null;
  videoId: string | null;
  type: string;
  title: string | null;
  image: string | null;
  source: string | null;
  createdAt: Date;
}): Bookmark {
  return {
    id: bookmark.id,
    userId: bookmark.userId,
    articleSlug: bookmark.articleSlug,
    videoId: bookmark.videoId,
    type: bookmark.type === "video" ? "video" : "article",
    title: bookmark.title,
    image: bookmark.image,
    source: bookmark.source,
    createdAt: bookmark.createdAt.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookmarks: bookmarks.map(toBookmark) });
  } catch (error) {
    console.error("[GET /api/bookmarks]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = bookmarkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid bookmark payload" },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const commonData = {
      userId: user.id,
      type: payload.type,
      title: payload.title ?? null,
      image: payload.image ?? null,
      source: payload.source ?? null,
    };

    const bookmark =
      payload.type === "article"
        ? await prisma.bookmark.upsert({
            where: {
              userId_articleSlug: {
                userId: user.id,
                articleSlug: payload.articleSlug,
              },
            },
            create: {
              ...commonData,
              articleSlug: payload.articleSlug,
            },
            update: commonData,
          })
        : await prisma.bookmark.upsert({
            where: {
              userId_videoId: {
                userId: user.id,
                videoId: payload.videoId,
              },
            },
            create: {
              ...commonData,
              videoId: payload.videoId,
            },
            update: commonData,
          });

    return NextResponse.json({ bookmark: toBookmark(bookmark) }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/bookmarks]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
