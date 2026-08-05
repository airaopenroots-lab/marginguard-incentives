# Sprint 4 Implementation Plan: Hardening & Production Readiness

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Transition Marginguard Incentives OS from a prototype to a secure, high-performance production platform.

**Architecture:** Integrating Auth.js for session management, implementing Role-Based Access Control (RBAC), and optimizing high-cardinality UI rendering.

**Tech Stack:** Next.js 15, Auth.js (NextAuth), Drizzle ORM, Tailwind v4.

---

### Task 1: Authentication & Role-Based Access (RBAC)

**Objective:** Implement a secure login and define `ADMIN` vs `OPERATOR` roles.

**Files:**
- Create: `lib/auth.ts` (Auth configuration)
- Create: `app/api/auth/[...nextauth]/route.ts` (Auth API)
- Modify: `middleware.ts` (Protect routes)
- Modify: `components/OnboardingTour.tsx` (Role-specific training)

**Step 1: Setup Auth.js**
Implement a simple Credentials provider for testing. 
- Admin: `admin/admin`
- Operator: `user/user`

**Step 2: Define Roles in Session**
Extend the session object to include a `role` field.

**Step 3: Secure the UI**
- `ADMIN`: Full access to Settings and Scenario Saving.
- `OPERATOR`: Access to Deal Approval and Read-Only Planning.

---

### Task 2: High-Cardinality Performance Tuning

**Objective:** Ensure sub-second interactivity when handling 100+ segments in the Workbench.

**Files:**
- Modify: `components/PlanningClient.tsx`
- Modify: `lib/seed-engine.ts` (Memoization)

**Step 1: Virtualized Rendering**
Implement a simplified "Viewport Only" rendering logic for the List View to handle large datasets without DOM bloat.

**Step 2: Memoize Sparklines**
Ensure SVG path strings are not recalculated on every slider move, only when segment budgets change.

---

### Task 3: API Rate Limiting & Safety

**Objective:** Protect Server Actions from automated abuse.

**Files:**
- Create: `middleware.ts` (Rate limit logic)
- Modify: `lib/actions.ts`

**Step 1: Implement Middleware Rate Limiter**
Add a simple memory-based rate limiter to protect `/api` and Server Actions (limit: 60 requests/minute).

**Step 2: Action Confirmation**
Add "Strict Mode" for Scenario Saving—ensure a name is always unique and within character limits.

---

### Task 4: UI/UX Final Polish (Boardroom Ready)

**Objective:** Clean up any remaining visual artifacts.

**Files:**
- Modify: `app/globals.css`
- Modify: `components/SettingsClient.tsx`

**Step 1: Refined Loading States**
Add skeleton loaders for the history and insights tables.

**Step 2: Audit Snapshots**
When saving a scenario, capture a `snapshot_id` representing the current model version to ensure data integrity during retrospective audits.

---

## Verification Steps
1. Run `npm run build` to ensure type safety.
2. Logout/Login as `user` and verify that "Save Scenario" and "Reseed DB" are hidden/disabled.
3. Login as `admin` and verify full control.
4. Verify the UI remains responsive when 50+ segments are active in List View.
