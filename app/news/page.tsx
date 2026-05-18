import { Container } from "@/components/Container";
import { CategoryNewsFeed } from "@/components/CategoryNewsFeed";
import { SectionHeading } from "@/components/SectionHeading";
import { getNews } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const articles = await getNews("technology", 10);

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <SectionHeading
          eyebrow="News"
          title="Technology headlines"
          description="A responsive feed of current articles from aggregated news sources."
        />

        <CategoryNewsFeed initialArticles={articles} limit={10} />
      </Container>
    </div>
  );
}
