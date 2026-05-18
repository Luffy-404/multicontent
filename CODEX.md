# MultiContent Engineering Context

## Project Overview

MultiContent is a production-grade content aggregation platform built with:

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- JWT Authentication

The platform aggregates:
- technology news
- scraped news
- YouTube videos

using:
- GNews API
- custom scrapers
- future RSS integrations

---

# Existing Systems

## Authentication
- JWT-based authentication
- Login/Register system
- Protected dashboard routes
- Middleware auth

## Database
Prisma + PostgreSQL

Existing models include:
- User
- Article
- Bookmark

## Content Aggregation
- `/api/aggregate/news`
- merges:
  - GNews API
  - Assam Tribune scraper

## Scraping Architecture

/services/scrapers/

Current scraper:
- Assam Tribune

Uses:
- axios
- cheerio

Architecture supports future scrapers.

## Article Persistence
Articles are persisted in PostgreSQL using Prisma.

Article detail pages:
- use slug-based routing
- fetch from DB
- survive refreshes/restarts

## Frontend
Responsive dark futuristic UI.

Pages:
- homepage
- news
- videos
- login
- register
- dashboard

Components:
- Navbar
- NewsCard
- VideoCard
- Footer

## Engineering Rules

- Keep modular architecture
- Preserve TypeScript safety
- Preserve responsive layouts
- Do not break aggregation system
- Do not break article persistence
- Use production-quality code
- Prefer reusable services/hooks/components
- Avoid duplicate database writes
- Use graceful fallback/error states

## Current Priorities

- personalization
- bookmarks
- search
- trending
- AI summaries
- admin dashboard
- caching
- cron ingestion
- scalability

## UI Direction

- modern dark UI
- futuristic aesthetic
- smooth UX
- responsive
- premium feel