"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { generateDeals } from "@/lib/seed-engine";

export default function Home() {
  const [dealCount, setDealCount] = useState(0);

  useEffect(() => {
    const deals = generateDeals(42);
    setDealCount(deals.length);
  }, []);

  return (
    <div
      className="animate-rise"
      style={{
        maxWidth: "var(--max-width)",
        margin: "0 auto",
        padding: "0 var(--gutter)",
        minHeight: "100vh",
      }}
    >
      {/* ── Ambient orbs ──────────────────────────────── */}
      <div className="ambient-orb ambient-orb-top" />
      <div className="ambient-orb ambient-orb-bottom" />

      {/* ── Header ────────────────────────────────────── */}
      <header
        style={{
          paddingTop: 48,
          paddingBottom: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          {/* ✦ Logo + Title */}
          <span style={{ color: "var(--blue)", fontSize: "15px" }}>✦</span>
          <span
            className="serif"
            style={{
              fontSize: 24,
              fontWeight: 400,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
            }}
          >
            Incentive{" "}
            <em style={{ fontStyle: "italic", color: "var(--blue)" }}>Intelligence</em>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* Label badge */}
          <span
            className="label-caps"
            style={{ fontSize: 12, letterSpacing: "0.16em" }}
          >
            Truck OEM · Deal Desk &amp; Planning
          </span>

          {/* Deal count pill */}
          {dealCount > 0 && (
            <span
              className="serif"
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "var(--ink)",
                background: "var(--wash-blue)",
                border: "1px solid var(--border-blue)",
                borderRadius: "var(--radius-sm)",
                padding: "6px 14px",
              }}
            >
              {dealCount} deals active
            </span>
          )}
        </div>
      </header>

      {/* ── Use-case cards ────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 48,
        }}
      >
        {/* UC1 — Deal Approval */}
        <Link
          href="/deal-approval"
          style={{ display: "block", textDecoration: "none" }}
        >
          <div
            className="card-hero"
            style={{
              cursor: "pointer",
              transition: "border-color 0.25s, box-shadow 0.25s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "rgba(29,91,191,0.5)";
              el.style.boxShadow = "0 22px 52px -26px rgba(15,42,74,0.32)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "rgba(29,91,191,0.35)";
              el.style.boxShadow =
                "0 18px 44px -26px rgba(15,42,74,0.25)";
            }}
          >
            {/* Card label */}
            <span
              className="label-caps"
              style={{ color: "var(--blue)", letterSpacing: "0.18em" }}
            >
              Use Case 1
            </span>

            <h2
              className="serif ink"
              style={{
                fontSize: 26,
                fontWeight: 400,
                margin: "12px 0 8px",
                letterSpacing: "-0.01em",
                lineHeight: 1.25,
              }}
            >
              Next Best Incentive
            </h2>

            <p
              className="slate"
              style={{
                fontSize: 15,
                lineHeight: 1.55,
                marginBottom: 20,
                maxWidth: 440,
              }}
            >
              When a deal requests an incentive, the AI instantly recommends the
              smallest winning offer — approve as requested, counter lower, or switch
              incentive type — with clear, data-backed justification.
            </p>

            {/* CTA bar */}
            <div className="callout-crosslink" style={{ padding: "12px 18px" }}>
              <span
                className="serif blue"
                style={{ fontSize: 15, fontWeight: 500 }}
              >
                Deal Desk · Real-Time
              </span>
              <span style={{ flex: 1 }} />
              <span
                className="btn-primary"
                style={{
                  fontSize: 11,
                  padding: "10px 18px",
                  letterSpacing: "0.14em",
                }}
              >
                Open →
              </span>
            </div>
          </div>
        </Link>

        {/* UC2 — Planning */}
        <Link
          href="/planning"
          style={{ display: "block", textDecoration: "none" }}
        >
          <div
            className="card-hero"
            style={{
              cursor: "pointer",
              transition: "border-color 0.25s, box-shadow 0.25s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "rgba(29,91,191,0.5)";
              el.style.boxShadow = "0 22px 52px -26px rgba(15,42,74,0.32)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "rgba(29,91,191,0.35)";
              el.style.boxShadow =
                "0 18px 44px -26px rgba(15,42,74,0.25)";
            }}
          >
            <span
              className="label-caps"
              style={{ color: "var(--blue)", letterSpacing: "0.18em" }}
            >
              Use Case 2
            </span>

            <h2
              className="serif ink"
              style={{
                fontSize: 26,
                fontWeight: 400,
                margin: "12px 0 8px",
                letterSpacing: "-0.01em",
                lineHeight: 1.25,
              }}
            >
              Incentive Mix by Segment
            </h2>

            <p
              className="slate"
              style={{
                fontSize: 15,
                lineHeight: 1.55,
                marginBottom: 20,
                maxWidth: 440,
              }}
            >
              Discover which incentive types — discount, rebate, or financing —
              drive the strongest response per customer segment, and optimally
              allocate budget across programs with response-curve visualizations.
            </p>

            <div className="callout-crosslink" style={{ padding: "12px 18px" }}>
              <span
                className="serif blue"
                style={{ fontSize: 15, fontWeight: 500 }}
              >
                Planning Workbench · Strategic
              </span>
              <span style={{ flex: 1 }} />
              <span
                className="btn-primary"
                style={{
                  fontSize: 11,
                  padding: "10px 18px",
                  letterSpacing: "0.14em",
                }}
              >
                Open →
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* ── Feature pillars ───────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          marginBottom: 48,
        }}
      >
        {[
          {
            title: "Closed-Loop Learning",
            label: "CONTINUOUS",
            labelColor: "var(--green)",
            body: "Every accepted recommendation and program outcome feeds back to improve future decisions. The system gets smarter with every deal — no static rules, no stale thresholds.",
          },
          {
            title: "Agentic Reasoning",
            label: "REAL-TIME",
            labelColor: "var(--blue)",
            body: "Combines historical patterns with real-time customer behavior — payment scores, returns, adjustments — and hard margin constraints for every recommendation.",
          },
          {
            title: "Response Curves",
            label: "VISUAL",
            labelColor: "var(--amber)",
            body: "Visualize true ROI per incentive type per segment. Continuous model updates flag when segments shift so programs can be corrected mid-cycle, not next year.",
          },
        ].map((item) => (
          <div key={item.title} className="card-default" style={{ padding: "24px 26px" }}>
            <span
              className="label-caps"
              style={{
                color: item.labelColor,
                fontSize: 10,
                letterSpacing: "0.20em",
                marginBottom: 12,
                display: "inline-block",
              }}
            >
              {item.label}
            </span>

            <h3
              className="serif ink"
              style={{
                fontSize: 20,
                fontWeight: 400,
                marginBottom: 10,
                letterSpacing: "-0.01em",
              }}
            >
              {item.title}
            </h3>

            <p
              className="slate"
              style={{
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {item.body}
            </p>
          </div>
        ))}
      </div>

      {/* ── Footer ────────────────────────────────────── */}
      <footer
        style={{
          textAlign: "center",
          paddingBottom: 40,
        }}
      >
        <p
          className="slate"
          style={{ fontSize: 12, letterSpacing: "0.04em" }}
        >
          Marginguard Incentives OS · Sprint 0 Prototype · PostgreSQL +
          pgvector · Version 1
        </p>
      </footer>
    </div>
  );
}
