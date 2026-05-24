import { Suspense } from "react";
import { Container } from "@/components/Container";
import { ActionGrid } from "@/components/ActionGrid";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { InfiniteFeed } from "@/components/InfiniteDiscoveryFeed";
import { MagazineGrid } from "@/components/MagazineGrid";
import { VideoShelf } from "@/components/VideoShelf";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { MarketHub } from "@/components/dashboard/MarketHub";
import { SportsHub } from "@/components/sports/SportsHub";
import { SportsSkeleton } from "@/components/sports/SportsSkeleton";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getNews, getVideos } from "@/lib/content";
import {
  buildTrendingDiscoveryItems,
  getDiscoveryCategories,
} from "@/services/discovery/personalization";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  const discoveryCategories = getDiscoveryCategories(user?.preferredCategories ?? []);
  const primaryCategory = discoveryCategories[0] ?? "Technology";
  let preferredArticles: Awaited<ReturnType<typeof getNews>> = [];
  let generalArticles: Awaited<ReturnType<typeof getNews>> = [];
  let preferredVideos: Awaited<ReturnType<typeof getVideos>> = [];
  let generalVideos: Awaited<ReturnType<typeof getVideos>> = [];

  try {
    preferredArticles = await getNews(primaryCategory, 12);
  } catch {
    preferredArticles = [];
  }

  try {
    generalArticles = await getNews("technology", 12);
  } catch {
    generalArticles = [];
  }

  try {
    preferredVideos = await getVideos(primaryCategory, 12);
  } catch {
    preferredVideos = [];
  }

  try {
    generalVideos = await getVideos("technology", 12);
  } catch {
    generalVideos = [];
  }

  const allArticles = [...preferredArticles, ...generalArticles];
  const allVideos = [...preferredVideos, ...generalVideos];
  let trendingItems: Awaited<ReturnType<typeof buildTrendingDiscoveryItems>> = [];

  try {
    trendingItems = await buildTrendingDiscoveryItems(
      allArticles,
      allVideos,
      discoveryCategories,
      18,
    );
  } catch {
    trendingItems = [];
  }
  const initialFeedItems = trendingItems.slice(9);
  const personalizedLabel = user?.preferredCategories.length
    ? `Personalized / ${discoveryCategories.join(", ")}`
    : "Balanced discovery mix";

  return (
    <div className="relative overflow-hidden bg-[#050608] pb-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(107,231,255,0.05),transparent_34rem)]" />
      <Container>
        <ActionGrid />

        <FeatureShowcase item={trendingItems[0]} label={personalizedLabel} />
        <MagazineGrid items={trendingItems.slice(1, 10)} />
        <VideoShelf items={trendingItems} />
        <Suspense fallback={<SportsSkeleton />}>
          <SportsHub />
        </Suspense>
        <Suspense fallback={<DashboardSkeleton />}>
          <MarketHub />
        </Suspense>

        <InfiniteFeed
          initialItems={initialFeedItems}
          initialPage={1}
          category={primaryCategory}
        />
      </Container>
    </div>
  );
}
