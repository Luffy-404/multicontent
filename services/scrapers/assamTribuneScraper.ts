import axios from "axios";
import * as cheerio from "cheerio";
import type { Cheerio } from "cheerio";
import type { Element } from "domhandler";
import type { ScrapedArticle } from "./types";

const ASSAM_TRIBUNE_BASE_URL = "https://assamtribune.com";
const ASSAM_TRIBUNE_SCI_TECH_URL = `${ASSAM_TRIBUNE_BASE_URL}/sci-and-tech`;
const ASSAM_TRIBUNE_SOURCE = "The Assam Tribune";
const ASSAM_TRIBUNE_CATEGORY = "Sci - Tech";
const MAX_ARTICLES = 10;

function cleanText(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function normalizeUrl(value?: string | null) {
  const cleaned = cleanText(value);

  if (!cleaned || cleaned.startsWith("#") || cleaned.startsWith("javascript:")) {
    return "";
  }

  try {
    return new URL(cleaned, ASSAM_TRIBUNE_BASE_URL).toString();
  } catch {
    return "";
  }
}

function getSrcFromSrcset(value?: string | null) {
  const firstCandidate = cleanText(value).split(",")[0]?.trim();
  return firstCandidate?.split(/\s+/)[0] ?? "";
}

function getImageUrl($image: Cheerio<Element>) {
  const rawImage =
    $image.attr("src") ??
    $image.attr("data-src") ??
    $image.attr("data-lazy-src") ??
    getSrcFromSrcset($image.attr("srcset") ?? $image.attr("data-srcset"));

  return normalizeUrl(rawImage);
}

function isLikelyArticleUrl(url: string) {
  if (!url.startsWith(`${ASSAM_TRIBUNE_BASE_URL}/`)) {
    return false;
  }

  const pathname = new URL(url).pathname;

  return /^\/sci-and-tech\/[a-z0-9-]+-\d+\/?$/.test(pathname);
}

function getBestTitle($container: Cheerio<Element>, $link: Cheerio<Element>) {
  const titleCandidates = [
    $container.find("img").first().attr("alt"),
    $container.find("img").first().attr("title"),
    $link.attr("title"),
    $link.text(),
  ]
    .map(cleanText)
    .filter(Boolean);

  return titleCandidates.reduce((best, candidate) => {
    if (!best) return candidate;
    if (best.endsWith("...") && candidate.length > best.length) return candidate;
    return candidate.length > best.length && !candidate.endsWith("...") ? candidate : best;
  }, "");
}

function getDescription($container: Cheerio<Element>, title: string) {
  const description = cleanText($container.find(".hocal-excerpt a").first().text());

  return description && description !== title ? description : "";
}

function getPublishedAt($container: Cheerio<Element>) {
  const $date = $container.find(".hocal-date").first();
  const datetime = cleanText($date.find("[data-datestring]").first().attr("data-datestring"));
  if (datetime) return datetime;

  return cleanText($date.text()) || undefined;
}

function parseArticles(html: string) {
  const $ = cheerio.load(html);
  const seenUrls = new Set<string>();
  const articles: ScrapedArticle[] = [];

  $(".hocal-post-item").each((_, element) => {
    if (articles.length >= MAX_ARTICLES) {
      return false;
    }

    const $container = $(element);
    const $titleLink = $container.find(".hocal-title a[href]").first();
    const url = normalizeUrl($titleLink.attr("href"));

    if (!url || seenUrls.has(url) || !isLikelyArticleUrl(url)) {
      return;
    }

    const title = getBestTitle($container, $titleLink);

    if (!title || title.length < 8) {
      return;
    }

    const image = getImageUrl($container.find(".hocal-featured-image img").first());
    const description = getDescription($container, title);

    if (!description && !image) {
      return;
    }

    seenUrls.add(url);
    articles.push({
      title,
      description,
      image,
      url,
      category: ASSAM_TRIBUNE_CATEGORY,
      source: ASSAM_TRIBUNE_SOURCE,
      publishedAt: getPublishedAt($container),
    });
  });

  return articles;
}

export async function scrapeAssamTribuneSciTech(): Promise<ScrapedArticle[]> {
  const response = await axios.get<string>(ASSAM_TRIBUNE_SCI_TECH_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "https://www.google.com/",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    },
    responseType: "text",
    timeout: 15000,
  });

  return parseArticles(response.data).slice(0, MAX_ARTICLES);
}
