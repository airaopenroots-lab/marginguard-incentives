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
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {/* ✦ Logo */}
          <Link
            href="/"
            style={{
              fontSize: 22,
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              textDecoration: "none",
            }}
          >
            ✦
          </Link>

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
        <h1
          className="serif"
          style={{
            fontSize: "clamp(28px, 3.4vw, 40px)",
            fontWeight: 500,
            lineHeight: 1.2,
            color: "var(--ink)",
            margin: "0 0 8px",
          }}
        >
          Where does each true dollar respond?
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
                fontSize: 13,
                fontStyle: "italic",
                color: "var(--slate)",
                lineHeight: 1.5,
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
          <div className="label-caps" style={{ marginBottom: 20 }}>
            Projected response
          </div>

          {/* KPI grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 20,
            }}
          >
            {/* Incremental units */}
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--slate)",
                  marginBottom: 3,
                }}
              >
                Incremental units/yr
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--ink)",
                  fontFamily: "monospace",
                }}
              >
                {proj.units.toLocaleString()}
              </div>
            </div>

            {/* Delta vs baseline */}
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--slate)",
                  marginBottom: 3,
                }}
              >
                Delta vs baseline
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: proj.deltaColor,
                  fontFamily: "monospace",
                }}
              >
                {proj.deltaLabel}
              </div>
            </div>

            {/* Cost per incremental unit */}
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--slate)",
                  marginBottom: 3,
                }}
              >
                Cost per incremental unit
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--ink)",
                  fontFamily: "monospace",
                }}
              >
                {proj.costPerUnit}
              </div>
            </div>

            {/* Baseline */}
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--slate)",
                  marginBottom: 3,
                }}
              >
                Baseline units/yr
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--slate)",
                  fontFamily: "monospace",
                }}
              >
                {proj.baseline.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Secondary metrics */}
          <div
            style={{
              display: "flex",
              gap: 24,
              marginBottom: 18,
              fontSize: 13,
            }}
          >
            <div>
              <span style={{ color: "var(--slate)", marginRight: 6 }}>
                Rebate attainment
              </span>
              <span style={{ fontWeight: 600, color: "var(--blue)" }}>
                {r}%
              </span>
            </div>
            <div>
              <span style={{ color: "var(--slate)", marginRight: 6 }}>
                Margin-floor breaches
              </span>
              <span style={{ fontWeight: 600, color: "var(--green)" }}>0</span>
            </div>
          </div>

          {/* Scenario insight */}
          <p
            className="serif"
            style={{
              fontSize: 13,
              fontStyle: "italic",
              color: "var(--slate)",
              lineHeight: 1.6,
              margin: 0,
              paddingTop: 14,
              borderTop: "1px solid var(--border-light)",
            }}
          >
            {proj.scenarioInsight}
          </p>
        </div>
      </div>

      {/* ── Monitoring alerts ───────────────────────────── */}
      <section style={{ marginBottom: 32 }}>
        <div className="label-caps" style={{ marginBottom: 14 }}>
          Monitoring
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
            fontSize: 18,
            lineHeight: 1,
            fontWeight: 700,
            color: "var(--blue)",
          }}
        >
          ✦
        </span>
        <div>
          <div
            style={{
              fontWeight: 600,
              fontSize: 13,
              color: "var(--ink)",
              marginBottom: 2,
            }}
          >
            01 · Next Best Incentive
          </div>
          <div style={{ fontSize: 12.5, color: "var(--slate)", lineHeight: 1.45 }}>
            View deal-level incentive recommendations with response-curve
            reasoning, precedent, and counter-proposals.
          </div>
        </div>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 14,
            color: "var(--blue)",
            fontWeight: 600,
          }}
        >
          →
        </span>
      </Link>
    </div>
  );
}
