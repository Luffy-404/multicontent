# MultiContent — Engineering Context

Version: v0.4
Status: Active Development
Architecture: Modular / Production-Oriented

────────────────────────────────
PROJECT OVERVIEW
────────────────────────────────

MultiContent is a production-grade content aggregation and discovery platform.

Purpose:
Aggregate, personalize, rank, and distribute high-signal content across multiple media formats.

Content Types:
- News
- Videos
- Discovery Feed
- Sports (upcoming)
- AI-enhanced content (future)

Core Stack:

Frontend
- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Server Components

Backend
- Route Handlers
- Prisma ORM
- PostgreSQL

Authentication
- JWT Authentication
- Middleware Protection

Infrastructure
- Cron ingestion (planned)
- Cache layer (planned)
- Background aggregation (planned)

────────────────────────────────
SYSTEM MODULES
────────────────────────────────

AUTH SYSTEM

Features:
- Register
- Login
- JWT Session
- Middleware protection
- Dashboard access
- Guest fallback rendering

Rules:
- Never block homepage for guests
- Logout must never crash content requests

Files:
app/login
app/register
middleware.ts
lib/auth

────────────────────────────────

DATABASE

Current:

User
Article
Bookmark

Extended:

preferredCategories
savedContent
discoverySignals

Future:

SportLeague
Match
Standings
UserSportsPreference
AdminAction
Notification

Rules:
- No duplicate writes
- Preserve persistence
- Maintain Prisma typing
- Use transactions where required

────────────────────────────────

CONTENT PIPELINE

Sources:

News:
- GNews
- Assam Tribune scraper

Videos:
- YouTube ingestion

Future:
- RSS
- Twitter/X
- Manual feeds
- Sports providers

Pipeline:

Source
↓

Normalize
↓

Deduplicate
↓

Persist
↓

Rank
↓

Serve

Route:

/api/aggregate/news

Rules:
- Content survives refresh
- Preserve slug stability
- Avoid repeated insertion

────────────────────────────────

SCRAPER ARCHITECTURE

Location:

services/scrapers/

Current:
- AssamTribuneScraper

Stack:
axios
cheerio

Requirements:
- adapter pattern
- isolated parsers
- resilient selectors

Future:

rss/
youtube/
sports/

────────────────────────────────

ARTICLE SYSTEM

Storage:
PostgreSQL

Routing:
slug-based

Requirements:
- refresh-safe
- SEO-safe
- DB-first rendering

Rules:
- Never fetch article body on client if avoidable

────────────────────────────────

DISCOVERY ENGINE

Current Features:

Personalized Feed
Trending Ranking
Search
Bookmarks
Category Preferences
Video Mixing

Implemented:

Global Search
Discovery Feed
Dashboard Search
Category Tabs
Preference Settings
Bookmark Ranking

Scoring Inputs:

Freshness
Preference Match
Bookmark Momentum
Category Weight

Rules:
- Keep deterministic
- No random ordering

────────────────────────────────

SPORTS MODULE (NEW)

Status:
Phase 4.5

Purpose:
Live sports layer.

Components:

SportsHub
SportsCalendar
SportsStandings
MatchCenter
ScoreTicker

API:

/api/sports/matches
/api/sports/live
/api/sports/standings
/api/sports/preferences

DB:

SportLeague
Match
Standings
UserSportsPreference

Rules:
- Mock-first
- API-ready
- No provider lock

────────────────────────────────

FRONTEND

Pages:

Homepage
News
Videos
Search
Dashboard
Login
Register
Settings

Components:

Navbar
PremiumNavbar
NewsCard
VideoCard
DiscoveryCard
HomeHero
InfiniteDiscoveryFeed
SearchExperience
Footer

Requirements:

SSR preferred
Reusable
Animation-light
Fast

────────────────────────────────

UI DIRECTION

Brand:

Premium Editorial Platform

Avoid:

AI-looking layouts
Generic dashboards
Heavy glassmorphism
Excess shadows
Excess glow

Visual Language:

Deep dark
Strong typography
Editorial spacing
Large hero sections
Card hierarchy

Inspirations:

Apple News
The Athletic
Monocle
Linear
ESPN

Rules:

Spacing > Effects
Typography > Gradients
Hierarchy > Decorations

────────────────────────────────

ENGINEERING RULES

Must:

Maintain TS safety
Preserve modularity
Preserve responsiveness
Preserve aggregation

Never:

Break persistence
Break personalization
Rewrite architecture
Duplicate services
Hardcode providers

Prefer:

Server Components
Caching
Skeleton states
Suspense
Reusable hooks

────────────────────────────────

CURRENT PRIORITIES

P0
- UI Polish
- Sports Module
- Mobile Premium UX

P1
- AI Summaries
- Admin Dashboard
- Recommendation Layer

P2
- Cron ingestion
- Analytics
- Feed Optimization

P3
- Notifications
- Realtime

────────────────────────────────

DELIVERY STANDARD

Production quality.

Every feature must include:

UI
Backend
Loading
Error
Empty state
Responsive behavior
Scalable architecture