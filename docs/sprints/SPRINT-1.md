# Sprint 1: Persistence & Vector Intelligence

**Project**: marginguard-incentives  
**Date**: July 19, 2026  
**Status**: COMPLETE  
**Owner**: Marginguard (AI Co-Pilot)  
**Reference**: SPRINT-1A.md, docker-compose.yml

## Objective
Establish the stateful foundation of Marginguard by integrating PostgreSQL, Drizzle ORM, and pgvector. Move from transient seeded data to a persistent database that supports vector-based similarity searches for deal precedents.

## Workstreams

### WS-1: Database Infrastructure
- [ ] Install `drizzle-orm`, `drizzle-kit`, `pg`
- [ ] Configure `drizzle.config.ts`
- [ ] Initialize `lib/db/index.ts` with connection pooling
- [ ] Verify Docker container `marginguard-db` is healthy and accessible

### WS-2: Schema & Migrations
- [ ] Define core schema in `lib/db/schema.ts`:
    - `customers`: Name, segment, location, risk profile
    - `deals`: Customer link, request date, requested discount, status, vector embedding
    - `segments`: Response curve parameters (alpha, beta, floor)
    - `feedback`: User overrides and justification logs
- [ ] Generate migrations and apply to local DB

### WS-3: Seeding Engine
- [ ] Create `lib/db/seed.ts`
- [ ] Adapt `lib/seed-engine.ts` to insert 100+ realistic records into the DB
- [ ] Generate mock embeddings (pgvector) for deals based on attributes (discount, margin, segment)
- [ ] Add `npm run db:seed` script

### WS-4: Repository Layer
- [ ] Implement `getDeals()`, `getDealById()`, `getPrecedents(dealId)`
- [ ] Vector similarity search using Drizzle's `cosineDistance` or `l2Distance`
- [ ] Integration of DB calls into Server Components

### WS-5: UI Integration
- [ ] Update **Deal Approval** (UC1) to fetch live data
- [ ] Update **Planning Workbench** (UC2) to fetch segment parameters
- [ ] Add "DB Status" indicator in Settings

### WS-6: Verification
- [ ] Verify vector search returns "similar" deals correctly
- [ ] Zero hydration/console errors
- [ ] Build passes clean

## Sprint Tasks
- [x] Create Sprint 1 plan
- [x] Install Drizzle + PG dependencies
- [x] Configure Drizzle & Schema
- [x] Run Migrations
- [x] Seed Database
- [x] Implement Repository layer
- [x] Integrate into UC1 & UC2
- [x] Final verification

---

**End of Sprint 1 Document**
