export type EditorialRole = "ADMIN" | "EDITOR";

export type StoryStatus = "DRAFT" | "PUBLISHED";

export type EditorialUser = {
  id: string;
  name: string;
  email: string;
  role?: EditorialRole;
};

export type StoryListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover?: string | null;
  category: string;
  source: string;
  status: StoryStatus;
  views: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceCard = {
  title: string;
  description: string;
  meta: string;
  href?: string;
};

export type AdminMetric = {
  label: string;
  value: string;
  detail: string;
  tone?: "success" | "warning" | "danger" | "neutral";
};

export type PublishingActivity = {
  title: string;
  detail: string;
  time: string;
};

export type PublishingQueueItem = {
  id?: string;
  title: string;
  owner: string;
  status: string;
};

export type AdminDashboardData = {
  metrics: AdminMetric[];
  pipeline: Array<{
    label: string;
    value: string;
    detail: string;
    tone: "cyan" | "purple" | "amber" | "yellow" | "green";
  }>;
  topStories: Array<Pick<StoryListItem, "id" | "title" | "category" | "views">>;
  recentActivity: PublishingActivity[];
  publishingQueue: PublishingQueueItem[];
  notes: string[];
};

export type StoryAction = (formData: FormData) => Promise<void>;

export type EditorialInsightsMetrics = {
  totalStories: number;
  publishedStories: number;
  drafts: number;
  totalViews: number;
  topStory: Pick<StoryListItem, "id" | "title" | "views"> | null;
  mostActiveEditor: { name: string; storyCount: number } | null;
};
