"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { computeProjection } from "@/lib/seed-engine";
import { saveScenarioAction } from "@/lib/actions";

interface DBUIPlannedSegment {
  id: number;
  name: string;
  description: string | null;
  model: string | null;
  qmin: number | null;
  qspan: number | null;
  median: string | null;
  k: string[] | null;
  m: string[] | null;
  insight: string | null;
}

interface DBScenario {
  id: string;
  name: string;
  config: Record<number, { d: number; r: number; f: number }>;
  totalSpend: number;
  projectedDelta: number;
  createdAt: Date | null;
}

interface UICurve {
  pts: string;
  color: string;
  opacity: number;
}

const STRATEGIES = [
  { id: "growth", label: "Aggressive Growth", d: 70, r: 20, f: 10, desc: "Focus on upfront discounts to capture transactional volume." },
  { id: "retention", label: "Customer Retention", d: 20, r: 60, f: 20, desc: "Back-end rebates to drive fleet commitment and loyalty." },
  { id: "financing", label: "Financing Dominance", d: 15, r: 15, f: 70, desc: "Leverage interest assistance for owner-operators." },
];

export default function PlanningClient({ initialSegments, initialScenarios }: { initialSegments: DBUIPlannedSegment[], initialScenarios: DBScenario[] }) {
  const [configMode, setConfigMode] = useState<"quick" | "guided">("quick");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  
  const [budgets, setBudgets] = useState<Record<number, { d: number; r: number; f: number }>>(() => {
    const initial: Record<number, { d: number; r: number; f: number }> = {};
    initialSegments.forEach(s => {
      initial[s.id] = { d: 1.5, r: 1.1, f: 0.4 }; // Starting point: $3M total per segment * 4 = $12M
    });
    return initial;
  });

  const proj = useMemo(() => {
    const segmentInputs = initialSegments.map(s => ({
      d: budgets[s.id]?.d || 0,
      r: budgets[s.id]?.r || 0,
      f: budgets[s.id]?.f || 0,
      k: (s.k || []).map(parseFloat),
      m: (s.m || []).map(parseFloat),
      baseUnits: s.name.includes("Regional") ? 420 : s.name.includes("Vocational") ? 360 : 380,
    }));
    return computeProjection(segmentInputs);
  }, [budgets, initialSegments]);

  const curveColors = ["#b45309", "#1d5bbf", "#8fa3bb"]; // discount, rebate, financing
  const curveLabels = ["Upfront discount", "Volume rebate", "Financing assistance"];

  const applyStrategy = (strat: typeof STRATEGIES[0]) => {
    const newBudgets: Record<number, { d: number; r: number; f: number }> = {};
    initialSegments.forEach(s => {
      newBudgets[s.id] = { 
        d: (strat.d / 10) / initialSegments.length, 
        r: (strat.r / 10) / initialSegments.length, 
        f: (strat.f / 10) / initialSegments.length 
      };
    });
    setBudgets(newBudgets);
  };
  
  const updateSegmentBudget = (id: number, type: 'd' | 'r' | 'f', val: number) => {
    setBudgets(prev => ({
      ...prev,
      [id]: { ...prev[id], [type]: val }
    }));
  };

  const rebalance = () => {
    const newBudgets = { ...budgets };
    const segments = initialSegments.map(s => ({
      id: s.id,
      k: (s.k || []).map(parseFloat),
      m: (s.m || []).map(parseFloat),
      current: budgets[s.id]
    }));

    // Find best and worst ROI for 'd' (discount)
    let bestId = segments[0].id;
    let worstId = segments[0].id;
    let maxSlope = -1;
    let minSlope = 1e9;

    segments.forEach(s => {
      // Slope at current x=d: (m/k) * exp(-d/k)
      const slope = (s.m[0] / s.k[0]) * Math.exp(-s.current.d / s.k[0]);
      if (slope > maxSlope) { maxSlope = slope; bestId = s.id; }
      if (slope < minSlope) { minSlope = slope; worstId = s.id; }
    });

    if (bestId !== worstId && newBudgets[worstId].d >= 0.2) {
      newBudgets[worstId] = { ...newBudgets[worstId], d: Math.max(0, newBudgets[worstId].d - 0.2) };
      newBudgets[bestId] = { ...newBudgets[bestId], d: newBudgets[bestId].d + 0.2 };
      setBudgets(newBudgets);
    }
  };

  const handleSave = async () => {
    const name = window.prompt("Enter scenario name:");
    if (!name) return;
    
    setSaveStatus("Saving...");
    await saveScenarioAction({
      name,
      config: JSON.stringify(budgets),
      totalSpend: proj.total,
      projectedDelta: proj.delta
    });
    setSaveStatus("Saved!");
    setTimeout(() => setSaveStatus(null), 2000);
  };

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
            <Link href="/deal-approval" className="tab-inactive" style={{ textDecoration: "none" }}>01 · Next Best Incentive</Link>
            <span className="tab-active">02 · Incentive Mix by Segment</span>
          </nav>
        </div>
      </header>

      {/* ── Title section ──────────────────────────────── */}
      <div style={{ marginBottom: 36, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div className="label-caps" style={{ marginBottom: "8px", color: "var(--blue)", letterSpacing: "0.22em" }}>Planning workbench · FY27 Q1 cycle</div>
          <h1 className="serif" style={{ fontSize: "clamp(28px, 3.4vw, 40px)", fontWeight: 400, lineHeight: 1.05, color: "var(--ink)", margin: "0 0 8px" }}>
            Where does each <em style={{ fontStyle: "italic", color: "var(--blue)" }}>true dollar</em> respond?
          </h1>
          <p className="slate" style={{ fontSize: 15, fontWeight: 500, margin: 0 }}>Program budget $12.0M</p>
        </div>
        <div style={{ display: "flex", gap: "4px", background: "rgba(15,42,74,0.05)", padding: "4px", borderRadius: "6px" }}>
          <button 
            onClick={() => setViewMode("cards")} 
            style={{ 
              fontSize: "11px", fontWeight: 600, padding: "6px 12px", borderRadius: "4px", border: "none", cursor: "pointer", 
              background: viewMode === "cards" ? "white" : "transparent", color: viewMode === "cards" ? "var(--blue)" : "var(--slate)",
              boxShadow: viewMode === "cards" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
            }}
          >
            Cards
          </button>
          <button 
            onClick={() => setViewMode("list")} 
            style={{ 
              fontSize: "11px", fontWeight: 600, padding: "6px 12px", borderRadius: "4px", border: "none", cursor: "pointer", 
              background: viewMode === "list" ? "white" : "transparent", color: viewMode === "list" ? "var(--blue)" : "var(--slate)",
              boxShadow: viewMode === "list" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
            }}
          >
            List
          </button>
        </div>
      </div>

      {/* ── Segment grid/list ─────────────────────────── */}
      {viewMode === "list" ? (
        <div className="card-default" style={{ padding: 0, overflow: "hidden", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(15,42,74,0.03)", borderBottom: "1px solid var(--border-light)" }}>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: "11px", color: "var(--slate)", textTransform: "uppercase" }}>Segment</th>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: "11px", color: "var(--slate)", textTransform: "uppercase" }}>Response</th>
                <th style={{ padding: "12px 20px", textAlign: "right", fontSize: "11px", color: "var(--slate)", textTransform: "uppercase" }}>Budget ($M)</th>
                <th style={{ padding: "12px 20px", textAlign: "right", fontSize: "11px", color: "var(--slate)", textTransform: "uppercase" }}>Mix (D / R / F)</th>
              </tr>
            </thead>
            <tbody>
              {segmentsWithCurves.map((seg) => (
                <tr key={seg.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ fontWeight: 600, fontSize: "14px" }}>{seg.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--slate)" }}>{seg.description}</div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <svg viewBox="0 0 200 40" style={{ width: 120, height: 24, opacity: 0.8 }}>
                      {seg.curves.map((curve, ci) => (
                         <polyline key={ci} points={curve.pts.split(' ').map(p => {
                           const [x, y] = p.split(',');
                           return `${parseFloat(x)},${parseFloat(y)/2.5}`; // Sparkline scaling
                         }).join(' ')} stroke={curve.color} fill="none" strokeWidth="2" />
                      ))}
                    </svg>
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right", fontFamily: "monospace", fontWeight: 700 }}>
                    ${((budgets[seg.id]?.d || 0) + (budgets[seg.id]?.r || 0) + (budgets[seg.id]?.f || 0)).toFixed(1)}M
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                       {['d', 'r', 'f'].map((type, ci) => (
                         <input 
                           key={type}
                           type="number" step="0.1" min="0"
                           value={budgets[seg.id]?.[type as 'd'|'r'|'f'] || 0}
                           onChange={(e) => updateSegmentBudget(seg.id, type as 'd'|'r'|'f', parseFloat(e.target.value))}
                           style={{ width: "48px", textAlign: "center", fontSize: "12px", padding: "4px", border: "1px solid var(--border-light)", borderRadius: "4px", background: "rgba(15,42,74,0.02)" }}
                         />
                       ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
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
              <p className="serif" style={{ fontSize: "14.5px", fontStyle: "italic", color: "var(--blue)", lineHeight: 1.45, margin: "0 0 16px" }}>{seg.insight}</p>
              
              <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                  <span>Budget Allocation</span>
                  <span style={{ fontFamily: "monospace", color: "var(--blue)" }}>${((budgets[seg.id]?.d || 0) + (budgets[seg.id]?.r || 0) + (budgets[seg.id]?.f || 0)).toFixed(1)}M</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {['d', 'r', 'f'].map((type, ci) => (
                    <div key={type} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: curveColors[ci] }} />
                      <input 
                        type="range" min={0} max={5} step={0.1} 
                        value={budgets[seg.id]?.[type as 'd'|'r'|'f'] || 0} 
                        onChange={(e) => updateSegmentBudget(seg.id, type as 'd'|'r'|'f', parseFloat(e.target.value))} 
                        style={{ flex: 1, height: 3 }} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ── Budget scenario + Projection ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        <div className="card-hero" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div className="label-caps">Budget scenario</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                onClick={handleSave}
                style={{ fontSize: "10px", fontWeight: 700, padding: "4px 10px", borderRadius: "4px", border: "1px solid var(--border-light)", cursor: "pointer", background: "white" }}
              >
                {saveStatus || "Save"}
              </button>
              <div style={{ display: "flex", gap: "4px", background: "rgba(15,42,74,0.05)", padding: "3px", borderRadius: "4px" }}>
                <button onClick={() => setConfigMode("quick")} style={{ fontSize: "10px", fontWeight: 600, padding: "4px 8px", borderRadius: "3px", border: "none", cursor: "pointer", background: configMode === "quick" ? "var(--card)" : "transparent", color: configMode === "quick" ? "var(--blue)" : "var(--slate)" }}>Quick</button>
                <button onClick={() => setConfigMode("guided")} style={{ fontSize: "10px", fontWeight: 600, padding: "4px 8px", borderRadius: "3px", border: "none", cursor: "pointer", background: configMode === "guided" ? "var(--card)" : "transparent", color: configMode === "guided" ? "var(--blue)" : "var(--slate)" }}>Guided</button>
              </div>
            </div>
          </div>

          {configMode === "guided" ? (
            <div className="animate-rise" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="label-caps" style={{ fontSize: "10px", color: "var(--blue)" }}>Select a predefined strategy</div>
              {STRATEGIES.map(strat => (
                <button 
                  key={strat.id} 
                  onClick={() => applyStrategy(strat)}
                  style={{
                    textAlign: "left", padding: "14px 16px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)",
                    background: "white", // Simplified check for now
                    cursor: "pointer", transition: "all .2s"
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--ink)", marginBottom: "4px" }}>{strat.label}</div>
                  <div style={{ fontSize: "12px", color: "var(--slate)", lineHeight: 1.4 }}>{strat.desc}</div>
                </button>
              ))}
              <div style={{ marginTop: "12px", padding: "12px", background: "rgba(29,91,191,0.05)", borderRadius: "var(--radius-md)", border: "1px dashed var(--blue)" }}>
                <p style={{ fontSize: "12px", color: "var(--blue)", margin: 0 }}>
                   <strong>Guided Config:</strong> These strategies are optimized based on current segment response curves. Adjusting sliders on cards will refine the specific mix.
                </p>
              </div>
            </div>
          ) : (
            <div className="animate-rise">
              <div style={{ padding: "24px 20px", background: "rgba(29,91,191,0.03)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)", textAlign: "center" }}>
                <div className="serif" style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "8px" }}>Dynamic Optimization</div>
                <p style={{ fontSize: "13px", color: "var(--slate)", lineHeight: 1.5, marginBottom: "20px" }}>
                  Adjust per-segment budgets directly on the cards above. Use the auto-optimizer to shift capital to the highest-yield response curves.
                </p>
                <button 
                  onClick={rebalance}
                  style={{
                    width: "100%", padding: "12px", borderRadius: "8px", background: "var(--blue)", 
                    color: "white", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "14px",
                    boxShadow: "0 2px 4px rgba(29,91,191,0.2)"
                  }}
                >
                  Rebalance for ROI
                </button>
              </div>
              
              <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                   <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--slate)", textTransform: "uppercase" }}>Discount</div>
                   <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)" }}>{proj.dLabel}</div>
                </div>
                <div>
                   <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--slate)", textTransform: "uppercase" }}>Rebate</div>
                   <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)" }}>{proj.rLabel}</div>
                </div>
                <div>
                   <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--slate)", textTransform: "uppercase" }}>Financing</div>
                   <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)" }}>{proj.fLabel}</div>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 16, marginTop: "auto", borderTop: "1px solid var(--border-light)" }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>Scenario total</span>
            <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 16, color: proj.totalColor }}>{proj.totalLabel}</span>
          </div>

          {initialScenarios.length > 0 && (
            <div style={{ marginTop: 24, borderTop: "1px solid var(--border-light)", paddingTop: 20 }}>
              <div className="label-caps" style={{ marginBottom: 12, fontSize: "10px" }}>Saved Scenarios</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {initialScenarios.map(s => (
                  <button 
                    key={s.id} 
                    onClick={() => setBudgets(s.config)}
                    style={{ fontSize: "11px", padding: "6px 12px", borderRadius: "6px", border: "1px solid var(--border-light)", background: "white", cursor: "pointer", transition: "all .2s" }}
                    onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--blue)")}
                    onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--border-light)")}
                  >
                    {s.name} <span style={{ color: "var(--slate)", marginLeft: 4 }}>({s.projectedDelta > 0 ? "+" : ""}{s.projectedDelta})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
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
