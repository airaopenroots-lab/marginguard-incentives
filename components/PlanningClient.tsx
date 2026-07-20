"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { computeProjection } from "@/lib/seed-engine";

interface DBUIPlannedSegment {
  id: number;
  name: string;
  description: string | null;
  model: string | null;
  qmin: number | null;
  qspan: number | null;
  median: string | null;
  k: string[];
  m: string[];
  insight: string | null;
}

interface UICurve {
  pts: string;
  color: string;
  opacity: number;
}

export default function PlanningClient({ initialSegments }: { initialSegments: DBUIPlannedSegment[] }) {
  const [configMode, setConfigMode] = useState<"quick" | "guided">("quick");
  const [d, setD] = useState(60);
  const [r, setR] = useState(45);
  const [f, setF] = useState(15);

  const proj = useMemo(() => computeProjection(d, r, f), [d, r, f]);

  const curveColors = ["#b45309", "#1d5bbf", "#8fa3bb"]; // discount, rebate, financing
  const curveLabels = ["Upfront discount", "Volume rebate", "Financing assistance"];

  // Prepare curves for rendering
  const segmentsWithCurves = initialSegments.map(s => {
    const k = (s.k || []).map(parseFloat);
    const m = (s.m || []).map(parseFloat);
    
    const curves: UICurve[] = k.map((ki: number, ci: number) => {
      const pts: string[] = [];
      for (let i = 0; i <= 20; i++) {
        const x = i / 20;
        const resVal = m[ci] * (1 - Math.exp(-x / ki));
        pts.push((x * 200).toFixed(0) + "," + (90 - resVal * 82).toFixed(1));
      }
      return { pts: pts.join(" "), color: curveColors[ci], opacity: 1 };
    });

    return { ...s, curves };
  });

  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "var(--gutter)" }}>
      {/* ── Header ─────────────────────────────────────── */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 44 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "32px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
            <span style={{ color: "var(--blue)", fontSize: "15px" }}>✦</span>
            <span className="serif" style={{ fontSize: "24px", letterSpacing: "-0.01em", color: "var(--ink)", fontWeight: 400 }}>
              Incentive <em style={{ fontStyle: "italic", color: "var(--blue)" }}>Intelligence</em>
            </span>
            <span className="label-caps" style={{ fontSize: "11px", letterSpacing: "0.22em", marginBottom: 0 }}>Truck OEM · Deal Desk &amp; Planning</span>
          </div>
          <nav style={{ display: "flex", gap: 8 }}>
            <Link href="/deal-approval" className="tab-inactive">01 · Next Best Incentive</Link>
            <span className="tab-active">02 · Incentive Mix by Segment</span>
          </nav>
        </div>
      </header>

      {/* ── Title section ──────────────────────────────── */}
      <div style={{ marginBottom: 36 }}>
        <div className="label-caps" style={{ marginBottom: "8px", color: "var(--blue)", letterSpacing: "0.22em" }}>Planning workbench · FY27 Q1 cycle</div>
        <h1 className="serif" style={{ fontSize: "clamp(28px, 3.4vw, 40px)", fontWeight: 400, lineHeight: 1.05, color: "var(--ink)", margin: "0 0 8px" }}>
          Where does each <em style={{ fontStyle: "italic", color: "var(--blue)" }}>true dollar</em> respond?
        </h1>
        <p className="slate" style={{ fontSize: 15, fontWeight: 500, margin: 0 }}>Program budget $12.0M</p>
      </div>

      {/* ── Segment cards grid ─────────────────────────── */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 18, marginBottom: 32 }}>
        {segmentsWithCurves.map((seg, i) => (
          <div key={seg.name} className="card-default animate-rise" style={{ animationDelay: `${i * 0.08}s` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)", marginBottom: 2 }}>{seg.name}</div>
                <div style={{ fontSize: 13, color: "var(--slate)" }}>{seg.description}</div>
              </div>
              <span className="badge-verdict" style={{ color: "var(--blue)", background: "var(--wash-blue)" }}>On Plan</span>
            </div>

            <svg viewBox="0 0 200 92" style={{ width: "100%", height: "auto", marginBottom: 12 }}>
              <line x1={0} y1={90} x2={200} y2={90} stroke="rgba(15,42,74,0.10)" strokeWidth={1} />
              {seg.curves.map((curve: UICurve, ci: number) => (
                <polyline key={ci} points={curve.pts} stroke={curve.color} fill="none" strokeWidth="2" strokeLinecap="round" opacity={curve.opacity} />
              ))}
            </svg>

            <div style={{ display: "flex", gap: 14, marginBottom: 12, fontSize: 11, color: "var(--slate)" }}>
              {curveLabels.map((label, ci) => (
                <div key={ci} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: curveColors[ci], flexShrink: 0 }} />
                  {label}
                </div>
              ))}
            </div>
            <p className="serif" style={{ fontSize: "14.5px", fontStyle: "italic", color: "var(--blue)", lineHeight: 1.45, margin: 0 }}>{seg.insight}</p>
          </div>
        ))}
      </section>

      {/* ── Budget scenario + Projection ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        <div className="card-hero" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div className="label-caps">Budget scenario</div>
            <div style={{ display: "flex", gap: "4px", background: "rgba(15,42,74,0.05)", padding: "3px", borderRadius: "4px" }}>
              <button onClick={() => setConfigMode("quick")} style={{ fontSize: "10px", fontWeight: 600, padding: "4px 8px", borderRadius: "3px", border: "none", cursor: "pointer", background: configMode === "quick" ? "var(--card)" : "transparent", color: configMode === "quick" ? "var(--blue)" : "var(--slate)" }}>Quick</button>
              <button onClick={() => setConfigMode("guided")} style={{ fontSize: "10px", fontWeight: 600, padding: "4px 8px", borderRadius: "3px", border: "none", cursor: "pointer", background: configMode === "guided" ? "var(--card)" : "transparent", color: configMode === "guided" ? "var(--blue)" : "var(--slate)" }}>Guided</button>
            </div>
          </div>

          <div className="animate-rise">
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>Upfront discount</span>
                <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 15, color: "var(--amber)" }}>{proj.dLabel}</span>
              </div>
              <input type="range" min={0} max={80} value={d} onChange={(e) => setD(Number(e.target.value))} style={{ width: "100%" }} />
            </div>
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>Volume rebate</span>
                <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 15, color: "var(--blue)" }}>{proj.rLabel}</span>
              </div>
              <input type="range" min={0} max={80} value={r} onChange={(e) => setR(Number(e.target.value))} style={{ width: "100%" }} />
            </div>
            <div style={{ marginBottom: 26 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>Financing assistance</span>
                <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 15, color: "var(--slate)" }}>{proj.fLabel}</span>
              </div>
              <input type="range" min={0} max={80} value={f} onChange={(e) => setF(Number(e.target.value))} style={{ width: "100%" }} />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 16, marginTop: "auto", borderTop: "1px solid var(--border-light)" }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>Scenario total</span>
            <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 16, color: proj.totalColor }}>{proj.totalLabel}</span>
          </div>
        </div>

        <div className="card-default" style={{ padding: "24px 28px" }}>
          <div className="label-caps" style={{ marginBottom: 20 }}>Projected Performance</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <div>
              <div className="serif" style={{ fontSize: 32, color: "var(--ink)" }}>{proj.units.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: "var(--slate)" }}>incremental units</div>
            </div>
            <div>
              <div className="serif" style={{ fontSize: 32, color: proj.deltaColor }}>{proj.deltaLabel}</div>
              <div style={{ fontSize: 12, color: "var(--slate)" }}>vs. current baseline</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderRadius: "var(--radius-md)", background: "rgba(15,42,74,0.03)", border: "1px solid var(--border-light)" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Cost per unit</span>
            <span className="serif" style={{ fontSize: 18 }}>{proj.costPerUnit}</span>
          </div>
          <p className="serif" style={{ marginTop: 20, fontSize: 15, color: "var(--blue)", fontStyle: "italic", lineHeight: 1.5 }}>{proj.scenarioInsight}</p>
        </div>
      </div>
    </div>
  );
}
