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
};

export type PublishingActivity = {
  title: string;
  detail: string;
  time: string;
};

export type PublishingQueueItem = {
  title: string;
  owner: string;
  status: string;
};

export type AdminDashboardData = {
  metrics: AdminMetric[];
  topStories: Array<Pick<StoryListItem, "id" | "title" | "category" | "views">>;
  recentActivity: PublishingActivity[];
  publishingQueue: PublishingQueueItem[];
  notes: string[];
};
