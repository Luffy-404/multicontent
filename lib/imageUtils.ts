export function isRenderableImageSrc(src?: string | null) {
  if (!src) {
    return false;
  }

  const trimmed = src.trim();

  if (!trimmed || trimmed === "null" || trimmed === "undefined") {
    return false;
  }

  if (trimmed.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

