# Sprint 1A: Design System Rebase

**Project**: marginguard-incentives  
**Date**: July 19, 2026  
**Status**: COMPLETE  
**Owner**: Marginguard (AI Co-Pilot)  
**Reference**: Style Guide.dc.html, Incentive Intelligence.dc.html, Build Plan.dc.html

## Objective
Hard-fork the entire visual layer from the Sprint 0 dark-theme prototype to the design-spec light-theme business-formal aesthetic defined in the Style Guide. Nothing carries over visually — this is a rebase, not a refresh.

## Source Documents
- **Style Guide.dc.html**: 9 color tokens, 2-typeface system, strict spacing, single animation
- **Incentive Intelligence.dc.html**: Working interactive prototype — both UC1 and UC2
- **Build Plan.dc.html**: 6-sprint master plan, S1 foundation phase scope

## Key Design Decisions

| Dimension | Sprint 0 (old) | Sprint 1A (target) |
|---|---|---|
| Theme | Dark (oklch) | **Light** — #f4f6f9 page, #ffffff cards |
| Headline font | Geist Sans | **Newsreader** (serif, 400 weight) |
| UI font | Geist Sans | **Hanken Grotesk** (sans, 400-700) |
| Accent | Violet→Fuchsia gradient | **Blue-only** — #1d5bbf / #174a9c |
| Radii | lg/xl/2xl (0.625rem+) | **3px** (buttons), **5-6px** (cards) |
| Charts | Recharts (BarChart, LineChart) | **SVG polylines** — 2px, no fills |
| Data | Static arrays | **Seeded PRNG** — deterministic, reseedable |
| Motion | None | **riseIn** — 14px / 0.5s ease |
| Layout | shadcn sidebar | **Top tab nav** — 01/02 toggle |

## Workstreams

### WS-1: Design Tokens & Theme
- [ ] Replace globals.css with light theme + 9 color tokens
- [ ] Add Newsreader + Hanken Grotesk fonts (Google Fonts)
- [ ] New spacing: 3px/5px/6px radii, 44px gutters, 1440px max-width
- [ ] riseIn animation
- [ ] New layout: top nav header with 01/02 tabs (no sidebar)
- [ ] Ambient glow orbs (fixed background, pointer-events: none)

### WS-2: Seeded Data Engine
- [ ] Create lib/seed-engine.ts with mulberry32 PRNG
- [ ] Segment-true distributions (4 segments, named customers, realistic medians)
- [ ] Generates: deals, invoices, behavior profiles, unit costs
- [ ] Reseed button in header
- [ ] Deterministic output from seed integer

### WS-3: UC1 — Deal Approval (rebuild)
- [ ] Approval queue sidebar with verdict pre-badges
- [ ] Deal header (customer, config, request)
- [ ] AI Recommendation card (blue glow border, gradient bg)
- [ ] Margin floor gauge (visual slider with markers)
- [ ] Customer behavior panel (pays in, memos, adjustments)
- [ ] Precedent panel (X comparable deals)
- [ ] Accept / Override buttons + feedback log
- [ ] Cross-link callout to UC2

### WS-4: UC2 — Planning Workbench (rebuild)
- [ ] 4 segment cards with SVG polyline response curves
- [ ] 3-form budget scenario sliders (discount / rebate / financing)
- [ ] Projected units + cost-per-unit + delta vs baseline
- [ ] Plan-vs-actual monitoring alerts
- [ ] Cross-link callout to UC1

### WS-5: Landing Page (rebuild)
- [ ] Style-compliant landing with UC1/UC2 cards
- [ ] Feature pillars with style tokens

### WS-6: Polish & Sweep
- [ ] Empty/edge states
- [ ] Responsive pass 900–1600px
- [ ] Zero console errors
- [ ] Build passes clean
- [ ] Commit + push

## Sprint Tasks
- [x] Create Sprint 1A plan
- [x] WS-1: Design tokens + theme + layout
- [x] WS-2: Seeded data engine
- [x] WS-3: UC1 Deal Approval rebuild
- [x] WS-4: UC2 Planning Workbench rebuild
- [x] WS-5: Landing page rebuild
- [x] WS-6: Insights, History, Settings pages (style pass)
- [x] Bug sweep + error fixes
- [x] Build verification
- [x] Commit + push

---

**End of Sprint 1A Document**
