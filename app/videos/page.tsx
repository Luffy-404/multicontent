import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { VideoCard } from "@/components/VideoCard";
import { getVideos } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const videos = await getVideos("technology", 12);

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <SectionHeading
          eyebrow="Videos"
          title="Curated technology videos"
          description="A live video grid powered by /api/videos."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video.videoId} video={video} />
          ))}
        </div>
      </Container>
    </div>
  );
}
