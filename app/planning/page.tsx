"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  generateSegments,
  generateAlerts,
  computeProjection,
} from "@/lib/seed-engine";

// ── helpers ──────────────────────────────────────────────
const INITIAL_SEED = 42;

export default function PlanningWorkbench() {
  const [seed, setSeed] = useState(INITIAL_SEED);
  const [d, setD] = useState(60);
  const [r, setR] = useState(45);
  const [f, setF] = useState(15);

  const segments = useMemo(() => generateSegments(seed), [seed]);
  const alerts = useMemo(() => generateAlerts(), []);
  const proj = useMemo(() => computeProjection(d, r, f), [d, r, f]);

  const reseed = () => setSeed((s) => s + 1);

  // Tailwind's prefix doesn't include --blue etc, so we reference CSS vars via inline style
  const curveColors = ["#b45309", "#1d5bbf", "#8fa3bb"]; // discount, rebate, financing
  const curveLabels = ["Upfront discount", "Volume rebate", "Financing assistance"];

  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "var(--gutter)" }}>
      {/* ── Header ─────────────────────────────────────── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 44,
        }}
      >
        {/* Logo + tabs */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "32px" }}>
          {/* ✦ Logo */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
            <span style={{ color: "var(--blue)", fontSize: "15px" }}>✦</span>
            <span
              className="serif"
              style={{
                fontSize: "24px",
                letterSpacing: "-0.01em",
                color: "var(--ink)",
                fontWeight: 400,
              }}
            >
              Incentive{" "}
              <em style={{ fontStyle: "italic", color: "var(--blue)" }}>Intelligence</em>
            </span>
            <span
              className="label-caps"
              style={{ fontSize: "11px", letterSpacing: "0.22em", marginBottom: 0 }}
            >
              Truck OEM · Deal Desk &amp; Planning
            </span>
          </div>

          {/* Tabs */}
          <nav style={{ display: "flex", gap: 8 }}>
            <Link href="/deal-approval" className="tab-inactive">
              01 · Next Best Incentive
            </Link>
            <span className="tab-active">02 · Incentive Mix by Segment</span>
          </nav>
        </div>

        {/* Reseed */}
        <button onClick={reseed} className="btn-secondary">
          Reseed
        </button>
      </header>

      {/* ── Title section ──────────────────────────────── */}
      <div style={{ marginBottom: 36 }}>
        <div
          className="label-caps"
          style={{ marginBottom: "8px", color: "var(--blue)", letterSpacing: "0.22em" }}
        >
          Planning workbench · FY27 Q1 cycle
        </div>
        <h1
          className="serif"
          style={{
            fontSize: "clamp(28px, 3.4vw, 40px)",
            fontWeight: 400,
            lineHeight: 1.05,
            color: "var(--ink)",
            margin: "0 0 8px",
          }}
        >
          Where does each{" "}
          <em style={{ fontStyle: "italic", color: "var(--blue)" }}>true dollar</em>{" "}
          respond?
        </h1>
        <p
          className="slate"
          style={{
            fontSize: 15,
            fontWeight: 500,
            margin: 0,
          }}
        >
          Program budget $12.0M
        </p>
      </div>

      {/* ── Segment cards grid ─────────────────────────── */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: 18,
          marginBottom: 32,
        }}
      >
        {segments.map((seg, i) => (
          <div
            key={seg.name}
            className="card-default animate-rise"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {/* Segment name + flag */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    color: "var(--ink)",
                    marginBottom: 2,
                  }}
                >
                  {seg.name}
                </div>
                <div style={{ fontSize: 13, color: "var(--slate)" }}>
                  {seg.desc}
                </div>
              </div>
              <span
                className="badge-verdict"
                style={{
                  color: seg.flagColor === "#b45309" ? "var(--amber)" : "var(--blue)",
                  background:
                    seg.flagColor === "#b45309"
                      ? "var(--wash-amber)"
                      : "var(--wash-blue)",
                }}
              >
                {seg.flag}
              </span>
            </div>

            {/* Response curves SVG */}
            <svg
              viewBox="0 0 200 92"
              style={{ width: "100%", height: "auto", marginBottom: 12 }}
              aria-label={`${seg.name} response curves`}
            >
              {/* Baseline */}
              <line
                x1={0}
                y1={90}
                x2={200}
                y2={90}
                stroke="rgba(15,42,74,0.10)"
                strokeWidth={1}
              />
              {/* Curves */}
              {seg.curves.map((curve, ci) => (
                <polyline
                  key={ci}
                  points={curve.pts}
                  stroke={curve.color}
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity={curve.opacity}
                />
              ))}
            </svg>

            {/* Legend row */}
            <div
              style={{
                display: "flex",
                gap: 14,
                marginBottom: 12,
                fontSize: 11,
                color: "var(--slate)",
              }}
            >
              {curveLabels.map((label, ci) => (
                <div
                  key={ci}
                  style={{ display: "flex", alignItems: "center", gap: 5 }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: curveColors[ci],
                      flexShrink: 0,
                    }}
                  />
                  {label}
                </div>
              ))}
            </div>

            {/* Insight */}
            <p
              className="serif"
              style={{
                fontSize: "14.5px",
                fontStyle: "italic",
                color: "var(--blue)",
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              {seg.insight}
            </p>
          </div>
        ))}
      </section>

      {/* ── Budget scenario + Projection (side-by-side) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 32,
        }}
      >
        {/* Budget scenario panel — card-hero */}
        <div className="card-hero">
          <div className="label-caps" style={{ marginBottom: 20 }}>
            Budget scenario
          </div>

          {/* Discount slider */}
          <div style={{ marginBottom: 22 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 8,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>
                Upfront discount
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "var(--amber)",
                }}
              >
                {proj.dLabel}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={80}
              value={d}
              onChange={(e) => setD(Number(e.target.value))}
              style={{ width: "100%" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                color: "var(--slate)",
                marginTop: 4,
              }}
            >
              <span>$0M</span>
              <span>$8.0M</span>
            </div>
          </div>

          {/* Rebate slider */}
          <div style={{ marginBottom: 22 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 8,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>
                Volume rebate
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "var(--blue)",
                }}
              >
                {proj.rLabel}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={80}
              value={r}
              onChange={(e) => setR(Number(e.target.value))}
              style={{ width: "100%" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                color: "var(--slate)",
                marginTop: 4,
              }}
            >
              <span>$0M</span>
              <span>$8.0M</span>
            </div>
          </div>

          {/* Financing slider */}
          <div style={{ marginBottom: 26 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 8,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>
                Financing assistance
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "var(--slate)",
                }}
              >
                {proj.fLabel}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={80}
              value={f}
              onChange={(e) => setF(Number(e.target.value))}
              style={{ width: "100%" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                color: "var(--slate)",
                marginTop: 4,
              }}
            >
              <span>$0M</span>
              <span>$8.0M</span>
            </div>
          </div>

          {/* Scenario total */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              paddingTop: 16,
              borderTop: "1px solid var(--border-light)",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>
              Scenario total
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize: 16,
                color: proj.totalColor,
              }}
            >
              {proj.totalLabel}
            </span>
          </div>
        </div>

        {/* Projected response panel — card-default */}
        <div className="card-default">
          <div className="label-caps" style={{ marginBottom: "18px" }}>
            Projected response
          </div>

          {/* Big number */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
            <span
              className="serif"
              style={{
                fontSize: "56px",
                lineHeight: 1,
                color: "var(--ink)",
                fontWeight: 400,
              }}
            >
              {proj.units.toLocaleString()}
            </span>
            <span style={{ fontSize: "13px", color: "var(--slate)" }}>
              incremental units / yr
            </span>
          </div>

          {/* Delta */}
          <div
            style={{
              marginTop: "10px",
              fontSize: "14px",
              color: proj.deltaColor,
              fontWeight: 600,
            }}
          >
            {proj.deltaLabel} vs. current allocation
          </div>

          {/* Secondary metrics */}
          <div
            style={{
              marginTop: "22px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontSize: "13px" }}>
              <span style={{ color: "var(--slate)" }}>Cost per incremental unit</span>
              <span style={{ color: "var(--ink)", fontWeight: 600 }}>{proj.costPerUnit}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontSize: "13px" }}>
              <span style={{ color: "var(--slate)" }}>Rebate attainment assumed</span>
              <span style={{ color: "var(--ink)", fontWeight: 600 }}>78%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontSize: "13px" }}>
              <span style={{ color: "var(--slate)" }}>Margin-floor breaches</span>
              <span style={{ color: "var(--ink)", fontWeight: 600 }}>0</span>
            </div>
          </div>

          {/* Scenario insight */}
          <p
            className="serif"
            style={{
              fontSize: "15px",
              fontStyle: "italic",
              color: "var(--blue)",
              lineHeight: 1.55,
              margin: 0,
              paddingTop: "20px",
              marginTop: "auto",
            }}
          >
            {proj.scenarioInsight}
          </p>
        </div>
      </div>

      {/* ── Monitoring alerts ───────────────────────────── */}
      <section style={{ marginBottom: 32 }}>
        <div className="label-caps" style={{ marginBottom: 16 }}>
          Monitoring — plan vs. actual, refreshed monthly
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {alerts.map((a, i) => (
            <div
              key={i}
              className={a.dot === "#b45309" ? "alert-amber" : "alert-blue"}
            >
              {/* Dot indicator */}
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: a.dot,
                  flexShrink: 0,
                  marginTop: 4,
                }}
              />
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: "var(--ink)",
                    marginBottom: 3,
                  }}
                >
                  {a.title}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--slate)", lineHeight: 1.55 }}>
                  {a.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Cross-link to UC1 ───────────────────────────── */}
      <Link
        href="/deal-approval"
        className="callout-crosslink"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <span
          style={{
            fontSize: 14,
            lineHeight: 1,
            color: "var(--blue)",
          }}
        >
          ◍
        </span>
        <p style={{ margin: 0, fontSize: "13.5px", lineHeight: 1.6, color: "var(--slate)" }}>
          This workbench decides{" "}
          <em style={{ color: "var(--blue)", fontStyle: "normal" }}>what is on the menu</em>
          .{" "}
          <span style={{ color: "var(--blue)", fontWeight: 500 }}>Next Best Incentive</span>{" "}
          decides what to serve on each deal — same data foundation, two moments of decision.
        </p>
      </Link>
    </div>
  );
}
