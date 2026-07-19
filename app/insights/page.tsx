"use client";

import { useState } from "react";
import Link from "next/link";

const insights = [
  {
    id: "INS-001",
    category: "opportunity" as const,
    title: "Regional haul response to upfront discount is strongest curve in the book",
    body: "At the current median of 6.4%, every additional point of discount in this segment returns 2.3× the unit volume of the same dollar in rebates. This is where the budget works hardest.",
    date: "2026-07-19",
  },
  {
    id: "INS-002",
    category: "risk" as const,
    title: "Vocational rebate attainment running hot — true cost rising",
    body: "Attainment tracking at 71% vs. 61% planned. The program is costing 16% more in true dollars than the budget assumes. Curves have been updated; the planning workbench reflects the new rates.",
    date: "2026-07-18",
  },
  {
    id: "INS-003",
    category: "anomaly" as const,
    title: "Owner-operator discount response dropped 18% below curve",
    body: "Two consecutive months of under-response in owner-operator discount sensitivity. The segment is shifting toward financing sensitivity. Recommend reallocating 30% of owner-operator discount budget to interest assistance.",
    date: "2026-07-17",
  },
  {
    id: "INS-004",
    category: "opportunity" as const,
    title: "LTL national accounts — volume rebate tiers are the commitment engine",
    body: "Accounts that reach tier 3 rebates (50+ units) have a 94% retention rate vs. 71% for tier 1. The curve confirms: back-end rebates drive behavior here, not front-end discounts.",
    date: "2026-07-16",
  },
  {
    id: "INS-005",
    category: "risk" as const,
    title: "Spend pacing slightly ahead — but volume justifies it",
    body: "Q1 spend at 24.6% of annual plan vs. 25% expected. Heavy Equipment is the driver, but unit volume is +8.6% above plan. No corrective action needed this quarter.",
    date: "2026-07-15",
  },
  {
    id: "INS-006",
    category: "anomaly" as const,
    title: "Margin-floor breaches: zero in the last 90 days",
    body: "Every recommendation issued by the model in the last quarter respected the unit-cost margin floor. This is the system working as designed — the floor is a hard constraint, never a suggestion.",
    date: "2026-07-14",
  },
];

const catStyle = {
  opportunity: { dot: "#0e7a5f", border: "rgba(14,122,95,.3)", bg: "rgba(14,122,95,.05)", label: "Opportunity" },
  risk: { dot: "#b45309", border: "rgba(180,83,9,.3)", bg: "rgba(180,83,9,.05)", label: "Risk alert" },
  anomaly: { dot: "#1d5bbf", border: "rgba(29,91,191,.35)", bg: "rgba(29,91,191,.05)", label: "Anomaly" },
};

export default function InsightsPage() {
  const [selected, setSelected] = useState(0);

  const cur = insights[selected];
  const st = catStyle[cur.category];

  return (
    <div className="animate-rise" style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "34px var(--gutter) 60px" }}>
      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "22px", marginBottom: "34px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
          <span style={{ color: "var(--blue)", fontSize: "15px" }}>✦</span>
          <span className="serif" style={{ fontSize: "24px", letterSpacing: "-.01em" }}>
            Incentive <em style={{ fontStyle: "italic", color: "var(--blue)" }}>Intelligence</em>
          </span>
          <span className="label-caps" style={{ fontSize: "11px", letterSpacing: ".22em" }}>Truck OEM · Insights</span>
        </div>
        <nav style={{ display: "flex", gap: "6px" }}>
          <Link href="/deal-approval" className="tab-inactive" style={{ textDecoration: "none" }}>01 · Next Best Incentive</Link>
          <Link href="/planning" className="tab-inactive" style={{ textDecoration: "none" }}>02 · Incentive Mix by Segment</Link>
        </nav>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: "32px" }}>
        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h1 className="serif" style={{ fontSize: "40px", fontWeight: 400, margin: "0 0 6px", lineHeight: 1.05 }}>
            Intelligence <em style={{ fontStyle: "italic", color: "var(--blue)" }}>feed</em>
          </h1>
          <p style={{ fontSize: "14px", color: "var(--slate)", margin: "0 0 16px" }}>Continuous monitoring across all segments, updated as behavior changes.</p>

          {insights.map((ins, i) => {
            const s = catStyle[ins.category];
            const isSel = i === selected;
            return (
              <button
                key={ins.id}
                onClick={() => setSelected(i)}
                style={{
                  display: "block", width: "100%", textAlign: "left", cursor: "pointer",
                  padding: "18px 20px", borderRadius: "var(--radius-lg)", fontFamily: "'Hanken Grotesk', sans-serif",
                  transition: "all .25s",
                  background: isSel ? "var(--wash-blue)" : "#ffffff",
                  border: isSel ? "1px solid var(--border-blue-strong)" : "1px solid var(--border-light)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 600, fontSize: "14px", color: "var(--ink)" }}>{ins.title}</span>
                  <span style={{ fontSize: "10.5px", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "var(--radius-sm)", border: `1px solid ${s.border}`, color: s.dot, whiteSpace: "nowrap", flexShrink: 0 }}>
                    {s.label}
                  </span>
                </div>
                <div style={{ fontSize: "12.5px", color: "var(--slate)", marginBottom: "6px", lineHeight: 1.5 }}>{ins.body.slice(0, 140)}…</div>
                <div style={{ fontSize: "11px", color: "var(--slate)" }}>{ins.date}</div>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div style={{ position: "sticky", top: "24px" }}>
          <div className="card-hero">
            <div style={{ marginBottom: "14px" }}>
              <span style={{ fontSize: "10.5px", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "var(--radius-sm)", border: `1px solid ${st.border}`, color: st.dot }}>
                {st.label}
              </span>
            </div>
            <h2 style={{ fontFamily: "'Newsreader', serif", fontWeight: 400, fontSize: "22px", lineHeight: 1.3, color: "var(--ink)", margin: "0 0 14px" }}>
              {cur.title}
            </h2>
            <p style={{ fontSize: "13.5px", lineHeight: 1.65, color: "var(--slate)", margin: "0 0 20px" }}>
              {cur.body}
            </p>
            <div style={{ paddingTop: "16px", borderTop: "1px solid var(--border-light)", fontSize: "12px", color: "var(--slate)" }}>
              Detected {cur.date} · Refreshed continuously
            </div>
          </div>
          <p style={{ marginTop: "20px", fontFamily: "'Newsreader', serif", fontStyle: "italic", fontSize: "14px", color: "var(--blue)", lineHeight: 1.5 }}>
            Every insight here feeds the same data foundation used by both the deal desk and the planning workbench.
          </p>
        </div>
      </div>
    </div>
  );
}
