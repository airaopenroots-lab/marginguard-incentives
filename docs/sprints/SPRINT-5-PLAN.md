# Sprint 5 Implementation Plan: Intelligence Ingestion & Protocol Verification

**Goal:** Transform Marginguard from a static configuration tool into a live intelligence engine by implementing automated ingestion workers and robust mapping verification.

**Architecture:** Background ingestion workers, schema validation, and bulk data reconciliation using Drizzle ORM and pgvector.

**Tech Stack:** Next.js 16 (App Router), Drizzle ORM, PostgreSQL + pgvector, node-cron (simulated).

---

### Task 1: Ingestion Worker Scaffolding
**Objective:** Create the core engine that polls mapped data sources and prepares them for intelligence processing.

**Files:**
- Create: `lib/ingestion/worker.ts` (Worker logic)
- Create: `lib/ingestion/schema-validator.ts` (Type-safety for external data)
- Modify: `lib/actions.ts` (Add trigger actions)

**Steps:**
1. Implement a `runIngestion` function that iterates through all `Connected` data sources.
2. Build a transformation pipeline that applies the `mapping` JSON to incoming raw records.
3. Add basic error logging for mapping failures.

---

### Task 2: Robust Mapping Verification (Action B)
**Objective:** Enhance the mapping UI with real-world validation tools.

**Files:**
- Modify: `components/MappingClient.tsx`
- Modify: `lib/actions.ts`

**Steps:**
1. Implement a "Fetch Live Sample" feature that attempts to connect to the source (simulated for now).
2. Add a "Conflict Detector" that flags when multiple source fields are mapped to the same target.
3. Implement a "Dry Run" report showing how many records would be successfully ingested vs. rejected.

---

### Task 3: Bulk Data Reconciliation & Patching (Action C)
**Objective:** Enable retrospective logic application to existing deal history.

**Files:**
- Create: `lib/reconciliation/patcher.ts`
- Modify: `app/settings/page.tsx`

**Steps:**
1. Create a utility to "Re-map" existing deals if the data source protocol changes.
2. Add a "Maintenance Action" in the Settings UI to "Recalculate Intelligence" for all historical deals.
3. Ensure vector embeddings are updated during the patching process.

---

### Task 4: UI/UX Intelligence Layer
**Objective:** Surface ingestion status and health in the main cockpit.

**Files:**
- Modify: `components/InsightsClient.tsx`
- Modify: `components/SettingsClient.tsx`

**Steps:**
1. Add an "Ingestion Pulse" indicator to the Insights page.
2. Display "Last Success" and "Records Processed" in the Connected Data Sources card.
3. Create a "Health Dashboard" for admins to monitor ingestion errors.

---

## Verification Steps
1. Run `npm run build` to ensure type safety across the new ingestion layer.
2. Add a new data source, map its fields, and run a "Test Protocol" simulation.
3. Verify that the "Simulation Results" correctly identify missing fields.
4. Run a mock ingestion cycle and verify deal counts in the Approval Queue.
