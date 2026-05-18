import Link from "next/link";
import { BookmarkButton } from "@/components/BookmarkButton";
import { Container } from "@/components/Container";
import { NewsCard } from "@/components/NewsCard";
import { getNews } from "@/lib/content";
import type { NewsArticle } from "@/lib/newsTypes";
import { getArticleBySlug } from "@/services/articles/getArticleBySlug";
import { NewsHeroImage } from "./NewsHeroImage";

export const dynamic = "force-dynamic";

type NewsDetailsPageProps = {
  params: {
    slug: string;
  };
};

function formatPublishedAt(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatSourceName(source?: string) {
  return source === "The Assam Tribune" ? "Assam Tribune" : source;
}

function getArticleBody(article: NewsArticle) {
  if (article.type === "scraped") {
    return {
      heading: "Story Summary",
      paragraphs: [
        article.description ||
          "This scraped article did not include a description in the source listing.",
      ],
      note: "This article was collected from a public source listing. Open the original source for any expanded reporting or updates.",
    };
  }

  return {
    heading: "Summary",
    paragraphs: [
      article.description ||
        "This API article did not include a summary in the source response.",
    ],
    note: "API articles provide a summary preview here. Use the source link to read the full story from the publisher.",
  };
}

function ArticleNotFound({ relatedArticles }: { relatedArticles: NewsArticle[] }) {
  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <Container className="max-w-6xl">
        <section className="mx-auto max-w-3xl rounded-lg border border-white/10 bg-slate-950/55 p-6 shadow-glow backdrop-blur sm:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Article not found
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            This article could not be found.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            The article may have moved, expired at the source, or not been saved in the news archive yet. Return to the feed to browse the latest saved stories.
          </p>
          <Link
            href="/news"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
          >
            Back to news
          </Link>
        </section>

        <section className="mt-16 border-t border-white/10 pt-10 sm:mt-20 sm:pt-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Related News
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              More stories to read next
            </h2>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((relatedArticle) => (
              <NewsCard key={relatedArticle.url} article={relatedArticle} />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}

export default async function NewsDetailsPage({ params }: NewsDetailsPageProps) {
  let article = await getArticleBySlug(params.slug);
  const relatedArticles = await getNews("technology", 3);
  article = article ?? (await getArticleBySlug(params.slug));

  if (!article) {
    return <ArticleNotFound relatedArticles={relatedArticles} />;
  }

  const publishedAt = formatPublishedAt(article.publishedAt);
  const sourceName = formatSourceName(article.source);
  const articleBody = getArticleBody(article);

  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <Container className="max-w-6xl">
        <article className="mx-auto">
          <Link
            href="/news"
            className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
          >
            Back to news
          </Link>

          <header className="mt-8 max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
              {sourceName ? (
                <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                  {sourceName}
                </span>
              ) : null}

              {article.category ? (
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
                  {article.category}
                </span>
              ) : null}

              {article.type ? (
                <span className="rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                  {article.type}
                </span>
              ) : null}

              {publishedAt ? (
                <time
                  dateTime={article.publishedAt}
                  className="font-medium text-slate-300"
                >
                  {publishedAt}
                </time>
              ) : null}
            </div>

            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
                News Article
              </p>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {article.title}
                </h1>
                <BookmarkButton
                  bookmark={{
                    type: "article",
                    articleSlug: params.slug,
                    title: article.title,
                    image: article.image,
                    source: sourceName,
                  }}
                  className="shrink-0"
                />
              </div>
            </div>

            {article.description ? (
              <p className="max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl sm:leading-9">
                {article.description}
              </p>
            ) : null}
          </header>

          <NewsHeroImage image={article.image ?? undefined} title={article.title} />

          <section className="mx-auto mt-12 max-w-3xl rounded-lg border border-white/10 bg-slate-950/55 p-6 shadow-glow backdrop-blur sm:p-8 lg:p-10">
            <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5">
              <span className="h-px w-8 bg-cyan-300" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                {articleBody.heading}
              </h2>
            </div>

            <div className="space-y-6 text-lg leading-8 text-slate-200">
              {articleBody.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              <p className="text-base leading-7 text-slate-400">
                {articleBody.note}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-400">
                {article.source ? (
                  <span>
                    Source:{" "}
                    <span className="font-medium text-slate-200">
                      {sourceName}
                    </span>
                  </span>
                ) : (
                  <span>Source details unavailable</span>
                )}
              </div>

              {article.url ? (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
                >
                  Read original source
                </a>
              ) : null}
            </div>
          </section>
        </article>

        <section className="mt-16 border-t border-white/10 pt-10 sm:mt-20 sm:pt-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Related News
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              More stories to read next
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-300">
              Explore the latest technology headlines from the news feed.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((relatedArticle) => (
              <NewsCard key={relatedArticle.url} article={relatedArticle} />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
