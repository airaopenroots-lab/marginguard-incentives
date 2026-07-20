# Marginguard Incentives OS - Developer Guide

## Core Commands
- `npm run dev`: Start dev server (Tailscale-ready on 0.0.0.0:3000)
- `npm run build`: Production build (verifies types and Turbopack)
- `npm run db:push`: Sync Drizzle schema to PostgreSQL
- `npm run db:seed`: Wipe and re-seed the database with 100+ deals
- `docker compose up -d`: Ensure PostgreSQL + pgvector is running

## Tech Stack
- **Frontend**: Next.js 15, Tailwind v4
- **Database**: PostgreSQL 16, pgvector, Drizzle ORM
- **Design**: Serif (Newsreader) headlines, Sans (Hanken Grotesk) UI

## Architecture
- **Server Components**: Initial data fetching via `lib/actions.ts`
- **Repository Pattern**: `lib/db/repo.ts` for data access logic
- **Vector Search**: L2 Distance similarity search for deal precedents

## Sprint History
- **Sprint 0**: Project Foundation
- **Sprint 1A**: Design System Rebase
- **Sprint 1**: Persistence & Vector Intelligence (Current)
