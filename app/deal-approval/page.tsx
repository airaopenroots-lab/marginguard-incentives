"use client";

import { useState, useMemo } from "react";
import { generateDeals, type Deal } from "@/lib/seed-engine";
import Link from "next/link";

const VERDICT_LABELS: Record<string, string> = {
  APPROVE: "APPROVE",
  COUNTER: "COUNTER",
  ALTERNATIVE: "ALTERNATIVE",
};

export default function DealApprovalPage() {
  const [seed, setSeed] = useState(42);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [decidedIds, setDecidedIds] = useState<Set<string>>(new Set());

  const deals = useMemo(() => generateDeals(seed), [seed]);
  const current = deals[selectedIdx];
  const isDecided = decidedIds.has(current?.id ?? "");

  const handleReseed = () => {
    const newSeed = Math.floor(Math.random() * 100000);
    setSeed(newSeed);
    setSelectedIdx(0);
    setDecidedIds(new Set());
  };

  const handleAccept = () => {
    setDecidedIds((prev) => new Set(prev).add(current.id));
  };

  const handleOverride = () => {
    setDecidedIds((prev) => new Set(prev).add(current.id));
  };

  const floorNum = parseFloat(current.floorPct ?? "0");
  const recNum = parseFloat(current.recPct ?? "0");

  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 var(--gutter)" }}>
      {/* ── TOP HEADER BAR ─────────────────────────────────── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 0 28px 0",
          borderBottom: "1px solid var(--border-light)",
          marginBottom: "28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {/* Logo + brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontSize: "20px",
                color: "var(--blue)",
                lineHeight: 1,
              }}
            >
              ✦
            </span>
            <span
              className="serif"
              style={{
                fontSize: "22px",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
              }}
            >
              Incentive Intelligence
            </span>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="tab-active" style={{ cursor: "default" }}>
              01 · Next Best Incentive
            </button>
            <Link href="/planning">
              <button className="tab-inactive">02 · Incentive Mix by Segment</button>
            </Link>
          </div>
        </div>

        {/* Reseed button */}
        <button
          onClick={handleReseed}
          className="btn-secondary"
          style={{ padding: "10px 18px", fontSize: "11px", letterSpacing: "0.12em" }}
        >
          Reseed
        </button>
      </header>

      {/* ── MAIN GRID: SIDEBAR + CONTENT ──────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "36px" }}>
        {/* ── LEFT SIDEBAR: Approval Queue ─────────────────── */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div className="label-caps" style={{ padding: "0 4px", marginBottom: "2px" }}>
            Approval Queue
          </div>

          {deals.map((deal, idx) => {
            const active = selectedIdx === idx;
            const done = decidedIds.has(deal.id);
            return (
              <div
                key={deal.id}
                onClick={() => setSelectedIdx(idx)}
                className={active ? "card-default card-selected" : "card-default"}
                style={{
                  cursor: "pointer",
                  opacity: done ? 0.55 : 1,
                  transition: "all 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {/* Top row: customer + verdict badge */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "8px",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: "14px", lineHeight: 1.3 }}>
                    {deal.customer}
                  </div>
                  <span
                    className="badge-verdict"
                    style={{
                      background:
                        deal.verdict === "APPROVE"
                          ? "rgba(14,122,95,0.1)"
                          : deal.verdict === "COUNTER"
                            ? "rgba(29,91,191,0.1)"
                            : "rgba(100,116,139,0.1)",
                      color: deal.verdictColor,
                      border: `1px solid ${deal.verdictColor}33`,
                      flexShrink: 0,
                    }}
                  >
                    {VERDICT_LABELS[deal.verdict] ?? deal.verdict}
                  </span>
                </div>

                {/* Config + requested */}
                <div style={{ fontSize: "12px", color: "var(--slate)", lineHeight: 1.5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{deal.config}</span>
                    <span style={{ fontWeight: 500, color: "var(--ink)" }}>
                      {deal.requested}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                    <span>
                      {deal.segment} · {deal.age}
                    </span>
                  </div>
                </div>

                {/* Decided indicator */}
                {done && (
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: deal.verdictColor,
                      letterSpacing: "0.06em",
                    }}
                  >
                    Decided →
                  </div>
                )}
              </div>
            );
          })}
        </aside>

        {/* ── RIGHT CONTENT ────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {/* Deal Header */}
          <div
            className="card-default"
            style={{ padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <div
                className="serif"
                style={{
                  fontSize: "32px",
                  fontWeight: 500,
                  color: "var(--ink)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}
              >
                {current.customer}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "var(--slate)",
                  marginTop: "6px",
                  display: "flex",
                  gap: "18px",
                }}
              >
                <span>{current.config}</span>
                <span style={{ color: "var(--border-medium)" }}>·</span>
                <span>
                  {current.segment} · {current.age}
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--slate)" }}>
                Requested
              </div>
              <div
                className="serif"
                style={{
                  fontSize: "28px",
                  fontWeight: 500,
                  color: "var(--ink)",
                  marginTop: "2px",
                }}
              >
                {current.requested}
              </div>
            </div>
          </div>

          {/* AI Recommendation Card (hero) */}
          <div className="card-hero animate-rise">
            <div style={{ marginBottom: "16px" }}>
              <div className="label-caps" style={{ marginBottom: "4px" }}>
                AI Recommendation
              </div>
              <div
                className="serif"
                style={{
                  fontSize: "30px",
                  fontWeight: 500,
                  color: "var(--ink)",
                  lineHeight: 1.35,
                }}
              >
                {current.recommendation}
              </div>
            </div>

            <div
              className="serif"
              style={{
                fontSize: "17px",
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--blue)",
                lineHeight: 1.6,
                marginBottom: "20px",
              }}
            >
              {current.reason}
            </div>

            {/* Confidence */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <span className="label-caps">Confidence</span>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)" }}>
                {current.confidence}
              </span>
              <div
                style={{
                  width: "100px",
                  height: "4px",
                  borderRadius: "2px",
                  background: "var(--border-light)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: current.confidence,
                    height: "100%",
                    borderRadius: "2px",
                    background: "var(--blue)",
                  }}
                />
              </div>
            </div>

            {/* Action buttons */}
            {!isDecided ? (
              <div style={{ display: "flex", gap: "12px" }}>
                <button className="btn-primary" onClick={handleAccept}>
                  Accept Recommendation
                </button>
                <button className="btn-secondary" onClick={handleOverride}>
                  Override
                </button>
              </div>
            ) : (
              <div
                style={{
                  padding: "12px 18px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--wash-green)",
                  border: "1px solid rgba(14,122,95,0.2)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--green)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>✓</span> Decision recorded — this deal has been processed.
              </div>
            )}
          </div>

          {/* ── THREE INFO CARDS ────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            {/* Customer Behavior Panel */}
            <div className="card-default" style={{ padding: "20px 22px" }}>
              <div className="label-caps" style={{ marginBottom: "14px" }}>
                Customer Behavior
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--slate)" }}>Payment record</span>
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>{current.pays}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--slate)" }}>Credit memos</span>
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>{current.memos}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--slate)" }}>Adjustments</span>
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>{current.adjust}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--slate)" }}>Last updated</span>
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>{current.updated}</span>
                </div>
              </div>
            </div>

            {/* Precedent Panel */}
            <div className="card-default" style={{ padding: "20px 22px" }}>
              <div className="label-caps" style={{ marginBottom: "14px" }}>
                Precedent
              </div>
              <div
                className="serif"
                style={{
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--ink)",
                  marginBottom: "6px",
                }}
              >
                {current.similar}
              </div>
              <div style={{ fontSize: "12px", color: "var(--slate)", marginBottom: "10px" }}>
                comparable deals
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--blue)",
                  lineHeight: 1.5,
                  fontWeight: 500,
                }}
              >
                {current.precedent}
              </div>
            </div>

            {/* Margin Floor Gauge */}
            <div className="card-default" style={{ padding: "20px 22px" }}>
              <div className="label-caps" style={{ marginBottom: "14px" }}>
                Margin Floor
              </div>

              <div style={{ fontSize: "13px", color: "var(--slate)", marginBottom: "12px" }}>
                Floor <span style={{ fontWeight: 600, color: "var(--ink)" }}>{current.floor}</span> · margin at
                rec <span style={{ fontWeight: 600, color: "var(--ink)" }}>{current.marginAtRec}</span>
              </div>

              {/* Visual gauge bar */}
              <div style={{ position: "relative", marginBottom: "10px" }}>
                {/* Track */}
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    borderRadius: "3px",
                    background: "var(--border-light)",
                    position: "relative",
                  }}
                >
                  {/* Green zone (below floor) */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: `${floorNum}%`,
                      height: "100%",
                      borderRadius: "3px 0 0 3px",
                      background: "var(--green)",
                      opacity: 0.3,
                    }}
                  />
                  {/* Above-floor zone */}
                  <div
                    style={{
                      position: "absolute",
                      left: `${floorNum}%`,
                      top: 0,
                      width: `${100 - floorNum}%`,
                      height: "100%",
                      borderRadius: "0 3px 3px 0",
                      background: "var(--amber)",
                      opacity: 0.25,
                    }}
                  />
                </div>

                {/* Floor marker (vertical line) */}
                <div
                  style={{
                    position: "absolute",
                    left: `${floorNum}%`,
                    top: "-4px",
                    width: "2px",
                    height: "14px",
                    background: "var(--amber)",
                    borderRadius: "1px",
                  }}
                />

                {/* Recommendation dot */}
                <div
                  style={{
                    position: "absolute",
                    left: `${recNum}%`,
                    top: "-5px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "var(--blue)",
                    border: "2px solid #ffffff",
                    boxShadow: "0 2px 8px rgba(29,91,191,0.35)",
                    transform: "translateX(-50%)",
                  }}
                />
              </div>

              {/* Labels */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                }}
              >
                <span style={{ color: "var(--green)" }}>Floor {current.floorPct}</span>
                <span style={{ color: "var(--blue)" }}>Rec {current.recPct}</span>
              </div>
            </div>
          </div>

          {/* ── CROSS-LINK CALLOUT TO UC2 ──────────────────── */}
          <Link href="/planning" style={{ textDecoration: "none", display: "block" }}>
            <div className="callout-crosslink">
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--ink)",
                    marginBottom: "4px",
                  }}
                >
                  See how this deal&apos;s segment responds across incentive types →
                </div>
                <div style={{ fontSize: "12px", color: "var(--slate)" }}>
                  Open Incentive Mix by Segment to explore response curves and budget allocation for the{" "}
                  {current.segment.toLowerCase()} segment.
                </div>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--blue)",
                  flexShrink: 0,
                }}
              >
                UC2
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom spacing */}
      <div style={{ height: "60px" }} />
    </div>
  );
}
