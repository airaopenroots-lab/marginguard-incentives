# Sprint 0: Project Foundation & Version 1 UI Prototype

**Project**: marginguard-incentives  
**Date**: July 18, 2026  
**Status**: In Progress  
**Owner**: Marginguard (AI Co-Pilot)

## Objectives
- Create professional GitHub repository with full version control
- Establish clean, scalable architecture for an agentic incentive intelligence platform
- Deliver Version 1: Professional web UI with mock data for both Use Cases
- Set up documentation standard for all future sprints

## Use Case Summary (from Use_Cases_1_and_2_Simple.docx)
- **Use Case 1 – Next Best Incentive**: Real-time recommendation during deal approval (Approve as-is, Counter with lower amount, or Alternative incentive type + justification).
- **Use Case 2 – Incentive Mix by Segment**: Strategic planning workbench showing response curves per segment, budget allocation scenarios, and performance monitoring.

## Tech Stack
- **Frontend**: Next.js 15 (App Router) + TypeScript + TailwindCSS v4 + shadcn/ui + Recharts
- **Database**: PostgreSQL 16 + pgvector (chosen for vector similarity on deals, strong analytics, JSONB, ACID compliance)
- **Styling**: Dark professional enterprise theme
- **Mock Data**: Realistic sample deals, segments, response curves
- **Local Run**: `docker compose up --build` (Dockerfile + Postgres planned for Sprint 1+)

## Project Structure
(See root folder after this sprint)

## Version 1 Scope (Delivered at end of this sprint)
- Professional landing page
- Sidebar navigation (Deal Approval | Planning Workbench | History | Settings)
- **Deal Approval Dashboard** (UC1): Live deal cards, AI Recommendation panel with confidence, reason, action buttons
- **Incentive Planning Workbench** (UC2): Segment filters, interactive response curves, budget sliders, scenario comparison table
- Fully responsive, dark mode, polished UI components

## Sprint Tasks
- [x] Initialize Git repository + Next.js 15 project
- [x] Install shadcn/ui, lucide-react, recharts
- [ ] Create professional layout + navigation
- [ ] Build Deal Approval UI (Use Case 1)
- [ ] Build Planning Workbench UI (Use Case 2)
- [ ] Create mock data service
- [ ] Add Sprint documentation system
- [ ] Commit all changes with clear history
- [ ] Create docker-compose.yml (basic)

**Next Sprint (Sprint 1)**: Add real PostgreSQL + Drizzle, basic AI recommendation logic using embeddings, persist mock data, Version 2 prototype.

This document will be updated and committed as we progress.

---
**End of Sprint 0 Document**
