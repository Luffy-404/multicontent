export const editor = {
  name: "Editor",
  title: "Newsroom Editor",
};

export const sidebarSections = [
  {
    label: "Content",
    items: [
      { label: "Articles", count: null },
      { label: "Drafts", count: null },
      { label: "Published", count: null },
      { label: "Scheduled", count: null },
    ],
  },
  {
    label: "Curated News",
    items: [
      { label: "Review Queue", count: 23 },
      { label: "Featured Stories", count: null },
      { label: "Approved", count: null },
      { label: "Rejected", count: null },
    ],
  },
  {
    label: "AI Workspace",
    items: [
      { label: "AI Queue", count: 18 },
      { label: "AI Generated", count: null },
      { label: "Human Review", count: null },
    ],
  },
  {
    label: "Aggregation",
    items: [
      { label: "Sources", count: null },
      { label: "RSS Feeds", count: null },
      { label: "Health Monitor", count: null },
    ],
  },
  {
    label: "Homepage",
    items: [
      { label: "Hero Manager", count: null },
      { label: "Featured Sections", count: null },
    ],
  },
  {
    label: "Users",
    items: [
      { label: "User Management", count: null },
      { label: "Roles", count: null },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", count: null },
      { label: "Audit Logs", count: null },
    ],
  },
];

export const kpis = [
  { label: "Articles Published Today", value: "28", trend: "+27% vs yesterday", tone: "success", icon: "A" },
  { label: "Pending Reviews", value: "37", trend: "+8 vs yesterday", tone: "warning", icon: "R" },
  { label: "Active Sources", value: "142", trend: "98% health", tone: "success", icon: "S" },
  { label: "AI Generated Stories", value: "56", trend: "+15% vs yesterday", tone: "success", icon: "AI" },
  { label: "Failed Source Fetches", value: "3", trend: "-2 vs yesterday", tone: "danger", icon: "F" },
];

export const pipeline = [
  { label: "Incoming Stories", value: "142", detail: "+23%", tone: "cyan" },
  { label: "AI Processing", value: "87", detail: "In Progress", tone: "purple" },
  { label: "Human Review", value: "37", detail: "Pending", tone: "amber" },
  { label: "Scheduled", value: "16", detail: "Today", tone: "yellow" },
  { label: "Published", value: "28", detail: "+12%", tone: "green" },
];

export const recentStories = [
  {
    headline: "OpenAI unveils GPT-5 with major reasoning upgrade",
    source: "The Verge",
    status: "Published",
    editor: "Sarah J.",
    time: "2h ago",
    imageTone: "from-purple-500/70 to-cyan-400/30",
  },
  {
    headline: "Apple announces M4 Ultra chip at WWDC 2025",
    source: "TechCrunch",
    status: "Review",
    editor: "Alex M.",
    time: "3h ago",
    imageTone: "from-slate-200/70 to-blue-500/30",
  },
  {
    headline: "Google I/O 2025: AI announcements in 10 minutes",
    source: "Wired",
    status: "Scheduled",
    editor: "Michael C.",
    time: "5h ago",
    imageTone: "from-white/80 to-cyan-400/20",
  },
  {
    headline: "Tesla launches robotaxi service in Austin",
    source: "Reuters",
    status: "Draft",
    editor: "Emma R.",
    time: "7h ago",
    imageTone: "from-red-500/70 to-slate-500/30",
  },
  {
    headline: "Microsoft's new Copilot features transform productivity",
    source: "The Verge",
    status: "Published",
    editor: "Sarah J.",
    time: "8h ago",
    imageTone: "from-blue-500/70 to-emerald-400/30",
  },
];

export const trendingContent = [
  { title: "GPT-5 changes everything: 5 key takeaways", meta: "12.4K views / 1.2K shares", imageTone: "from-slate-100/70 to-cyan-400/30" },
  { title: "Apple M4 Ultra benchmarks leak online", meta: "8.7K views / 932 shares", imageTone: "from-orange-400/70 to-blue-500/30" },
  { title: "Google I/O 2025 highlights: Everything you missed", meta: "6.1K views / 712 shares", imageTone: "from-white/80 to-red-400/30" },
  { title: "The rise of AI coding agents in 2025", meta: "4.8K views / 589 shares", imageTone: "from-blue-200/70 to-purple-400/30" },
  { title: "Robotaxi wars: Tesla vs Waymo vs Cruise", meta: "3.6K views / 412 shares", imageTone: "from-red-500/70 to-cyan-300/30" },
];

export const performanceSeries = [
  { day: "May 8", pageViews: 44, visitors: 18, shares: 2 },
  { day: "May 9", pageViews: 62, visitors: 31, shares: 3 },
  { day: "May 10", pageViews: 80, visitors: 41, shares: 4 },
  { day: "May 11", pageViews: 65, visitors: 37, shares: 7 },
  { day: "May 12", pageViews: 78, visitors: 48, shares: 12 },
  { day: "May 13", pageViews: 68, visitors: 39, shares: 15 },
  { day: "May 14", pageViews: 79, visitors: 43, shares: 13 },
];

export const publishingQueue = [
  "WWDC 2025: Key Announcements and Developer Reactions",
  "AI Breakthrough: New Model Surpasses GPT-4",
  "The Future of Work in the Age of AI Automation",
  "Google I/O 2025: What Developers Need to Know",
  "Apple Vision Pro 2 Rumors: Release Date, Features and More",
];

export const editorialActivity = [
  { person: "Sarah Johnson", action: "published", story: "OpenAI unveils GPT-5...", time: "2m ago" },
  { person: "Alex Morgan", action: "moved story to review", story: "Apple M4 Ultra chip...", time: "5m ago" },
  { person: "Michael Chen", action: "scheduled", story: "Google I/O 2025...", time: "15m ago" },
  { person: "Emma Wilson", action: "created draft", story: "Tesla launches robotaxi...", time: "18m ago" },
  { person: "System", action: "updated source", story: "TechCrunch RSS Feed", time: "20m ago" },
];

export const sourceAlerts = [
  { source: "TechCrunch RSS Feed", detail: "High error rate detected", status: "Error" },
  { source: "The Verge RSS Feed", detail: "Slow response time", status: "Warning" },
  { source: "Reuters Top News", detail: "Connection timeout", status: "Error" },
  { source: "Wired RSS Feed", detail: "All systems operational", status: "Healthy" },
];

export const aiNotifications = [
  { label: "12 stories ready for human review", area: "AI Queue" },
  { label: "3 stories flagged for fact check", area: "AI Review" },
  { label: "8 stories generated overnight", area: "AI Generated" },
];
