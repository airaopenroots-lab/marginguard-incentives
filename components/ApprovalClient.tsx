"use client";

import { useState, useEffect } from "react";
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

  const current = initialDeals[selectedIdx];
  const isDecided = decidedIds.has(current?.id ?? "");

  const handleAccept = async () => {
    await recordDecision(current.id, "ACCEPT", "Approved via AI recommendation");
    setDecidedIds((prev) => new Set(prev).add(current.id));
    // Auto-advance if not at end
    if (selectedIdx < initialDeals.length - 1) {
      setTimeout(() => setSelectedIdx(prev => prev + 1), 600);
    }
  };

  const handleOverride = async () => {
    await recordDecision(current.id, "OVERRIDE", "Approved as requested by user override");
    setDecidedIds((prev) => new Set(prev).add(current.id));
    if (selectedIdx < initialDeals.length - 1) {
      setTimeout(() => setSelectedIdx(prev => prev + 1), 600);
    }
  };

  const floorNum = parseFloat(current?.floorPct ?? "0");

  if (!current) return <div>No deals in queue.</div>;

  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 var(--gutter) 60px" }}>
      {/* ── TOP HEADER BAR ─────────────────────────────────── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 0 28px 0",
          borderBottom: "1px solid var(--border-light)",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
            <span style={{ color: "var(--blue)", fontSize: "15px" }}>✦</span>
            <span className="serif" style={{ fontSize: "24px", letterSpacing: "-0.01em", color: "var(--ink)", fontWeight: 400 }}>
              Incentive <em style={{ fontStyle: "italic", color: "var(--blue)" }}>Intelligence</em>
            </span>
            <span className="label-caps" style={{ fontSize: "11px", letterSpacing: "0.22em", marginBottom: 0 }}>Truck OEM · Deal Desk</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span className="tab-active">01 · Next Best Incentive</span>
            <Link href="/planning" className="tab-inactive" style={{ textDecoration: "none" }}>02 · Incentive Mix by Segment</Link>
          </div>
        </div>
      </header>

      {/* ── QUEUE NAVIGATION STRIP ────────────────────────── */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
          <div className="label-caps">Approval Queue · {initialDeals.length} active deals</div>
          <div style={{ fontSize: "12px", color: "var(--slate)" }}>
            <span style={{ fontWeight: 600, color: "var(--blue)" }}>{decidedIds.size}</span> / {initialDeals.length} processed
          </div>
        </div>
        
        <div 
          style={{ 
            display: "flex", 
            gap: "8px", 
            overflowX: "auto", 
            padding: "4px 0 12px 0",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
          className="queue-scroll"
        >
          {initialDeals.map((deal, idx) => {
            const active = selectedIdx === idx;
            const done = decidedIds.has(deal.id);
            return (
              <button
                key={deal.id}
                onClick={() => setSelectedIdx(idx)}
                style={{
                  minWidth: "140px",
                  padding: "12px 14px",
                  borderRadius: "var(--radius-lg)",
                  border: active ? "1px solid var(--border-blue-strong)" : "1px solid var(--border-light)",
                  background: active ? "var(--wash-blue)" : "#ffffff",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  opacity: done ? 0.5 : 1,
                  flexShrink: 0,
                  boxShadow: active ? "0 4px 12px rgba(29,91,191,0.08)" : "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: deal.verdictColor }} />
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--slate)", letterSpacing: "0.02em" }}>{deal.id}</span>
                  {done && <span style={{ marginLeft: "auto", color: "var(--green)", fontSize: "10px" }}>✓</span>}
                </div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {deal.customer}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── DETAIL VIEW ──────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
        {/* Deal Summary Bar */}
        <div className="card-default" style={{ padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
             <button 
               onClick={() => setSelectedIdx(Math.max(0, selectedIdx - 1))}
               disabled={selectedIdx === 0}
               style={{ border: "none", background: "none", cursor: "pointer", fontSize: "20px", color: selectedIdx === 0 ? "var(--border-medium)" : "var(--blue)" }}
             >←</button>
            <div>
              <div className="serif" style={{ fontSize: "36px", fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.01em", lineHeight: 1.1 }}>{current.customer}</div>
              <div style={{ fontSize: "14px", color: "var(--slate)", marginTop: "6px", display: "flex", gap: "18px" }}>
                <span>{current.config}</span>
                <span style={{ color: "var(--border-medium)" }}>·</span>
                <span>{current.segment} · {current.age}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--slate)" }}>Requested</div>
              <div className="serif" style={{ fontSize: "30px", fontWeight: 400, color: "var(--ink)", marginTop: "2px" }}>{current.requested}</div>
            </div>
            <button 
               onClick={() => setSelectedIdx(Math.min(initialDeals.length - 1, selectedIdx + 1))}
               disabled={selectedIdx === initialDeals.length - 1}
               style={{ border: "none", background: "none", cursor: "pointer", fontSize: "20px", color: selectedIdx === initialDeals.length - 1 ? "var(--border-medium)" : "var(--blue)" }}
             >→</button>
          </div>
        </div>

        {/* AI Recommendation Hero */}
        <div className="card-hero animate-rise" style={{ padding: "32px 40px" }}>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <span style={{ color: "var(--blue)", fontSize: "14px", lineHeight: 1 }}>✦</span>
              <span className="label-caps" style={{ marginBottom: 0 }}>AI recommendation</span>
              <span className="badge-verdict" style={{ color: current.verdictColor, border: `1px solid ${current.verdictColor}`, background: "transparent" }}>{current.verdictLong}</span>
            </div>
            <div className="serif" style={{ fontSize: "34px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.2 }}>{current.recommendation}</div>
          </div>
          <div className="serif" style={{ fontSize: "18px", fontStyle: "italic", fontWeight: 400, color: "var(--blue)", lineHeight: 1.6, marginBottom: "24px", maxWidth: "800px" }}>{current.reason}</div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
            <span className="label-caps" style={{ marginBottom: 0 }}>Confidence</span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)" }}>{current.confidence}</span>
            <span style={{ fontSize: "12px", color: "var(--slate)" }}>· scored in 1.8s</span>
            <div style={{ width: "120px", height: "4px", borderRadius: "2px", background: "var(--border-light)", overflow: "hidden", marginLeft: "10px" }}>
              <div style={{ width: current.confidence, height: "100%", borderRadius: "2px", background: "var(--blue)" }} />
            </div>
          </div>

          {!isDecided ? (
            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn-primary" style={{ padding: "14px 28px" }} onClick={handleAccept}>Accept Recommendation</button>
              <button className="btn-secondary" style={{ padding: "14px 28px" }} onClick={handleOverride}>Override — approve as requested</button>
            </div>
          ) : (
            <div style={{ padding: "16px 22px", borderRadius: "var(--radius-md)", background: "var(--wash-green)", border: "1px solid rgba(14,122,95,0.2)", fontSize: "14px", fontWeight: 600, color: "var(--green)", display: "flex", alignItems: "center", gap: "10px", width: "fit-content" }}>
              <span style={{ fontSize: "18px" }}>✓</span> Decision recorded — this deal has been processed.
            </div>
          )}
        </div>

        {/* Data Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "18px" }}>
          <div className="card-default" style={{ padding: "22px 26px" }}>
            <div className="label-caps" style={{ marginBottom: "16px" }}>Customer Behavior</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13.5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--slate)" }}>Pays in</span><span style={{ fontWeight: 600, color: "var(--ink)" }}>{current.pays}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--slate)" }}>Credit memos, 12 mo</span><span style={{ fontWeight: 600, color: "var(--ink)" }}>{current.memos}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--slate)" }}>Post-sale adjustments</span><span style={{ fontWeight: 600, color: "var(--ink)" }}>{current.adjust}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--slate)" }}>Profile updated</span><span style={{ fontWeight: 600, color: "var(--blue)" }}>{current.updated}</span></div>
            </div>
          </div>
          
          <div className="card-default" style={{ padding: "22px 26px" }}>
            <div className="label-caps" style={{ marginBottom: "16px" }}>Precedent</div>
            <div className="serif" style={{ fontSize: "28px", fontWeight: 400, color: "var(--ink)", marginBottom: "4px" }}>{current.similar}</div>
            <div style={{ fontSize: "12px", color: "var(--slate)", marginBottom: "12px" }}>comparable deals in history</div>
            <div className="serif" style={{ fontSize: "14px", fontStyle: "italic", color: "var(--blue)", lineHeight: 1.5 }}>{current.precedent}</div>
          </div>

          <div className="card-default" style={{ padding: "22px 26px" }}>
            <div className="label-caps" style={{ marginBottom: "16px" }}>Margin Floor</div>
            <div style={{ fontSize: "13px", color: "var(--slate)", marginBottom: "14px" }}>Floor <span style={{ fontWeight: 600, color: "var(--ink)" }}>{current.floor}</span> · margin at rec <span style={{ fontWeight: 600, color: "var(--ink)" }}>{current.marginAtRec}</span></div>
            <div style={{ position: "relative", marginBottom: "12px", paddingTop: "8px" }}>
              <div style={{ width: "100%", height: "8px", borderRadius: "4px", background: "rgba(15,42,74,0.10)", position: "relative", overflow: "visible" }}>
                <div style={{ position: "absolute", left: 0, top: 0, width: `${floorNum}%`, height: "100%", borderRadius: "4px 0 0 4px", background: "rgba(15,42,74,0.12)" }} />
              </div>
              <div style={{ position: "absolute", left: `${floorNum}%`, top: "4px", width: "2px", height: "16px", background: "var(--blue)", borderRadius: "1px" }} />
            </div>
            <div style={{ fontSize: "11px", fontStyle: "italic", color: "var(--slate)", marginTop: "16px" }}>
              Model respects a hard {current.floor} floor for {current.segment}.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
