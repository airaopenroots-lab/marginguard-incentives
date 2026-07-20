"use client";

import { useState } from "react";
import Link from "next/link";
import { recordDecision } from "@/lib/actions";

const VERDICT_LABELS: Record<string, string> = {
  APPROVE: "APPROVE",
  COUNTER: "COUNTER",
  ALTERNATIVE: "ALTERNATIVE",
};

interface UIPlannedDeal {
  id: string;
  customer: string;
  segment: string;
  age: string;
  config: string;
  confidence: string;
  pays: string;
  memos: string;
  adjust: string;
  updated: string;
  similar: string;
  floor: string;
  marginAtRec: string;
  floorPct: string;
  recPct: string;
  requested: string;
  verdict: "APPROVE" | "COUNTER" | "ALTERNATIVE";
  verdictLong: string;
  verdictColor: string;
  summary: string;
  recommendation: string;
  reason: string;
  precedent: string;
}

export default function ApprovalClient({ initialDeals }: { initialDeals: UIPlannedDeal[] }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [decidedIds, setDecidedIds] = useState<Set<string>>(new Set());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const current = initialDeals[selectedIdx];
  const isDecided = decidedIds.has(current?.id ?? "");

  const handleAccept = async () => {
    await recordDecision(current.id, "ACCEPT", "Approved via AI recommendation");
    setDecidedIds((prev) => new Set(prev).add(current.id));
  };

  const handleOverride = async () => {
    await recordDecision(current.id, "OVERRIDE", "Approved as requested by user override");
    setDecidedIds((prev) => new Set(prev).add(current.id));
  };

  const floorNum = parseFloat(current?.floorPct ?? "0");

  if (!current) return <div>No deals in queue.</div>;

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
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="tab-active" style={{ cursor: "default" }}>
              01 · Next Best Incentive
            </button>
            <Link href="/planning">
              <button className="tab-inactive">02 · Incentive Mix by Segment</button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── MAIN GRID: SIDEBAR + CONTENT ──────────────────── */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: sidebarCollapsed ? "60px 1fr" : "320px 1fr", 
          gap: sidebarCollapsed ? "20px" : "36px",
          transition: "grid-template-columns 0.4s cubic-bezier(0.4, 0, 0.2, 1), gap 0.4s"
        }}
      >
        {/* ── LEFT SIDEBAR: Approval Queue ─────────────────── */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "10px", overflow: "hidden" }}>
          <div 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              padding: "0 4px", 
              marginBottom: "2px" 
            }}
          >
            {!sidebarCollapsed && <div className="label-caps">Approval Queue</div>}
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{ 
                background: "transparent", 
                border: "none", 
                cursor: "pointer", 
                color: "var(--blue)",
                fontSize: "14px",
                padding: "4px",
                borderRadius: "3px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              title={sidebarCollapsed ? "Expand Queue" : "Collapse Queue"}
            >
              {sidebarCollapsed ? "→" : "←"}
            </button>
          </div>

          {initialDeals.map((deal, idx) => {
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
                  gap: sidebarCollapsed ? "0px" : "10px",
                  padding: sidebarCollapsed ? "12px 0" : "18px 20px",
                  alignItems: sidebarCollapsed ? "center" : "stretch"
                }}
              >
                {sidebarCollapsed ? (
                  <div 
                    style={{ 
                      width: "12px", 
                      height: "12px", 
                      borderRadius: "50%", 
                      background: deal.verdictColor,
                      boxShadow: active ? `0 0 10px ${deal.verdictColor}66` : "none"
                    }} 
                  />
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <div style={{ fontWeight: 600, fontSize: "14px", lineHeight: 1.3 }}>{deal.customer}</div>
                      <span className="badge-verdict" style={{ background: `${deal.verdictColor}1A`, color: deal.verdictColor, border: `1px solid ${deal.verdictColor}33`, flexShrink: 0 }}>
                        {VERDICT_LABELS[deal.verdict] ?? deal.verdict}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--slate)", lineHeight: 1.5 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{deal.config}</span>
                        <span style={{ fontWeight: 500, color: "var(--ink)" }}>{deal.requested}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                        <span>{deal.segment} · {deal.age}</span>
                      </div>
                    </div>
                  </>
                )}
                {!sidebarCollapsed && done && (
                  <div style={{ fontSize: "11px", fontWeight: 600, color: deal.verdictColor, letterSpacing: "0.06em" }}>Decided →</div>
                )}
              </div>
            );
          })}
        </aside>

        {/* ── RIGHT CONTENT ────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <div className="card-default" style={{ padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="serif" style={{ fontSize: "32px", fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.01em", lineHeight: 1.2 }}>{current.customer}</div>
              <div style={{ fontSize: "14px", color: "var(--slate)", marginTop: "6px", display: "flex", gap: "18px" }}>
                <span>{current.config}</span>
                <span style={{ color: "var(--border-medium)" }}>·</span>
                <span>{current.segment} · {current.age}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--slate)" }}>Requested</div>
              <div className="serif" style={{ fontSize: "28px", fontWeight: 400, color: "var(--ink)", marginTop: "2px" }}>{current.requested}</div>
            </div>
          </div>

          <div className="card-hero animate-rise">
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                <span style={{ color: "var(--blue)", fontSize: "14px", lineHeight: 1 }}>✦</span>
                <span className="label-caps" style={{ marginBottom: 0 }}>AI recommendation</span>
                <span className="badge-verdict" style={{ color: current.verdictColor, border: `1px solid ${current.verdictColor}`, background: "transparent" }}>{current.verdictLong}</span>
              </div>
              <div className="serif" style={{ fontSize: "30px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.25 }}>{current.recommendation}</div>
            </div>
            <div className="serif" style={{ fontSize: "17px", fontStyle: "italic", fontWeight: 400, color: "var(--blue)", lineHeight: 1.6, marginBottom: "20px" }}>{current.reason}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <span className="label-caps" style={{ marginBottom: 0 }}>Confidence</span>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)" }}>{current.confidence}</span>
              <span style={{ fontSize: "12px", color: "var(--slate)" }}>· scored in 1.8s</span>
              <div style={{ width: "100px", height: "4px", borderRadius: "2px", background: "var(--border-light)", overflow: "hidden" }}>
                <div style={{ width: current.confidence, height: "100%", borderRadius: "2px", background: "var(--blue)" }} />
              </div>
            </div>
            {!isDecided ? (
              <div style={{ display: "flex", gap: "12px" }}>
                <button className="btn-primary" onClick={handleAccept}>Accept Recommendation</button>
                <button className="btn-secondary" onClick={handleOverride}>Override — approve as requested</button>
              </div>
            ) : (
              <div style={{ padding: "12px 18px", borderRadius: "var(--radius-md)", background: "var(--wash-green)", border: "1px solid rgba(14,122,95,0.2)", fontSize: "13px", fontWeight: 600, color: "var(--green)", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>✓</span> Decision recorded — this deal has been processed.
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <div className="card-default" style={{ padding: "20px 22px" }}>
              <div className="label-caps" style={{ marginBottom: "14px" }}>Customer Behavior</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--slate)" }}>Pays in</span><span style={{ fontWeight: 600, color: "var(--ink)" }}>{current.pays}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--slate)" }}>Credit memos, 12 mo</span><span style={{ fontWeight: 600, color: "var(--ink)" }}>{current.memos}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--slate)" }}>Post-sale adjustments</span><span style={{ fontWeight: 600, color: "var(--ink)" }}>{current.adjust}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--slate)" }}>Profile updated</span><span style={{ fontWeight: 600, color: "var(--blue)" }}>{current.updated}</span></div>
              </div>
            </div>
            <div className="card-default" style={{ padding: "20px 22px" }}>
              <div className="label-caps" style={{ marginBottom: "14px" }}>Precedent</div>
              <div className="serif" style={{ fontSize: "26px", fontWeight: 400, color: "var(--ink)", marginBottom: "6px" }}>{current.similar}</div>
              <div style={{ fontSize: "12px", color: "var(--slate)", marginBottom: "10px" }}>comparable deals in history</div>
              <div className="serif" style={{ fontSize: "13px", fontStyle: "italic", color: "var(--blue)", lineHeight: 1.5 }}>{current.precedent}</div>
            </div>
            <div className="card-default" style={{ padding: "20px 22px" }}>
              <div className="label-caps" style={{ marginBottom: "14px" }}>Margin Floor</div>
              <div style={{ fontSize: "13px", color: "var(--slate)", marginBottom: "12px" }}>Floor <span style={{ fontWeight: 600, color: "var(--ink)" }}>{current.floor}</span> · margin at rec <span style={{ fontWeight: 600, color: "var(--ink)" }}>{current.marginAtRec}</span></div>
              <div style={{ position: "relative", marginBottom: "10px" }}>
                <div style={{ width: "100%", height: "8px", borderRadius: "4px", background: "rgba(15,42,74,0.10)", position: "relative", overflow: "visible" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, width: `${floorNum}%`, height: "100%", borderRadius: "4px 0 0 4px", background: "rgba(15,42,74,0.12)" }} />
                </div>
                <div style={{ position: "absolute", left: `${floorNum}%`, top: "-4px", width: "2px", height: "16px", background: "var(--blue)", borderRadius: "1px" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
