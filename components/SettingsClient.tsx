"use client";

import Link from "next/link";
import { resetDatabase, clearDecisions, saveConfigAction, addDataSourceAction } from "@/lib/actions";
import { useState } from "react";

interface SettingsClientProps {
  initialConfig: {
    confidence_threshold: string;
    margin_floor: string;
    payment_threshold: string;
    refresh_interval: string;
  };
  initialDataSources: {
    id: string;
    name: string;
    status: string;
    lastSync: string;
  }[];
}

export default function SettingsClient({ initialConfig, initialDataSources }: SettingsClientProps) {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(initialConfig);

  const handleReset = async () => {
    if (!confirm("Are you sure? This will wipe all data and re-seed the database.")) return;
    setLoading(true);
    await resetDatabase();
    setLoading(false);
    alert("Database reset complete.");
  };

  const handleClear = async () => {
    if (!confirm("Are you sure? This will wipe all decision feedback.")) return;
    setLoading(true);
    await clearDecisions();
    setLoading(false);
    alert("Decisions cleared.");
  };

  const handleUpdateConfig = async (key: string, value: string) => {
    setLoading(true);
    await saveConfigAction(key, value);
    setConfig(prev => ({ ...prev, [key]: value }));
    setLoading(false);
  };

  const handleAddSource = async () => {
    const name = window.prompt("Enter data source name:");
    if (!name) return;
    setLoading(true);
    await addDataSourceAction(name);
    setLoading(false);
  };

  return (
    <div className="animate-rise" style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "34px var(--gutter) 60px" }}>
      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "22px", marginBottom: "34px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
          <span style={{ color: "var(--blue)", fontSize: "15px" }}>✦</span>
          <span className="serif" style={{ fontSize: "24px", letterSpacing: "-.01em" }}>
            Incentive <em style={{ fontStyle: "italic", color: "var(--blue)" }}>Intelligence</em>
          </span>
          <span className="label-caps" style={{ fontSize: "11px", letterSpacing: ".22em" }}>Truck OEM · Settings</span>
        </div>
        <nav style={{ display: "flex", gap: "6px" }}>
          <Link href="/deal-approval" className="tab-inactive" style={{ textDecoration: "none" }}>01 · Next Best Incentive</Link>
          <Link href="/planning" className="tab-inactive" style={{ textDecoration: "none" }}>02 · Incentive Mix by Segment</Link>
        </nav>
      </header>

      <h1 className="serif" style={{ fontSize: "40px", fontWeight: 400, margin: "0 0 24px", lineHeight: 1.05 }}>
        Settings &amp; <em style={{ fontStyle: "italic", color: "var(--blue)" }}>configuration</em>
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Operator Support */}
        <div className="card-default">
          <div className="label-caps" style={{ marginBottom: "16px" }}>Operator Support & Training</div>
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <button 
              className="btn-primary" 
              onClick={() => {
                localStorage.removeItem("marginguard_tour_complete");
                window.location.href = "/insights";
              }}
              style={{ fontSize: "11px", padding: "12px 22px" }}
            >
              Restart Deployment Briefing
            </button>
            <Link 
              href="/docs" 
              className="btn-secondary"
              style={{ fontSize: "11px", padding: "11px 18px", textDecoration: "none", display: "inline-block" }}
            >
              Open Operating Codex
            </Link>
            <Link 
              href="/history" 
              className="btn-secondary"
              style={{ fontSize: "11px", padding: "11px 18px", textDecoration: "none", display: "inline-block" }}
            >
              Review Decision History
            </Link>
          </div>
          <p style={{ fontSize: "12px", color: "var(--slate)" }}>
            Access training materials or re-trigger the interactive onboarding experience.
          </p>
        </div>

        {/* AI Model Parameters */}
        <div className="card-default">
          <div className="label-caps" style={{ marginBottom: "16px" }}>AI model parameters</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { key: "confidence_threshold", label: "Confidence threshold", suffix: "%", desc: "Min confidence to auto-recommend" },
              { key: "margin_floor", label: "Margin floor (hard)", suffix: "%", desc: "No recommendation below this margin" },
              { key: "payment_threshold", label: "Payment score threshold", suffix: "/100", desc: "Flag for manual review below this" },
              { key: "refresh_interval", label: "Curve refresh interval", suffix: " days", desc: "How often response curves update" },
            ].map(p => (
              <div key={p.key} style={{ padding: "14px 16px", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)" }}>
                <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px" }}>{p.label}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                    <input 
                        type="text" 
                        value={config[p.key as keyof typeof config]} 
                        onChange={(e) => setConfig({ ...config, [p.key]: e.target.value })}
                        onBlur={(e) => handleUpdateConfig(p.key, e.target.value)}
                        style={{ 
                            fontFamily: "'Newsreader', serif", fontSize: "24px", color: "var(--blue)", 
                            border: "none", background: "transparent", width: "60px", outline: "none",
                            borderBottom: "1px dashed var(--blue)"
                        }}
                    />
                    <span className="serif" style={{ fontSize: "24px", color: "var(--blue)" }}>{p.suffix}</span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--slate)", marginTop: "4px" }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <div className="card-default">
          <div className="label-caps" style={{ marginBottom: "16px" }}>Connected data sources</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {initialDataSources.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", border: "1px dashed var(--border-light)", borderRadius: "8px", fontSize: "13px", color: "var(--slate)" }}>
                    No custom data sources registered.
                </div>
            ) : initialDataSources.map(s => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ fontWeight: 500, fontSize: "13.5px" }}>{s.name}</span>
                <span style={{ fontSize: "12.5px", color: "var(--slate)" }}>
                  <span style={{ color: "#0e7a5f", marginRight: "6px" }}>●</span>{s.status} · last sync {s.lastSync}
                </span>
              </div>
            ))}
          </div>
          <button className="btn-secondary" onClick={handleAddSource} style={{ marginTop: "16px", fontSize: "11px", padding: "10px 18px" }}>+ Add data source</button>
        </div>

        {/* Maintenance */}
        <div className="card-default">
          <div className="label-caps" style={{ marginBottom: "16px" }}>Database Maintenance</div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button 
              className="btn-secondary" 
              onClick={handleReset} 
              disabled={loading}
              style={{ fontSize: "11px", padding: "10px 18px" }}
            >
              {loading ? "Processing..." : "Reseed Database"}
            </button>
            <button 
              className="btn-secondary" 
              onClick={handleClear} 
              disabled={loading}
              style={{ fontSize: "11px", padding: "10px 18px", color: "var(--amber)", borderColor: "var(--amber)" }}
            >
              {loading ? "Processing..." : "Clear Decisions"}
            </button>
          </div>
        </div>

        {/* Architecture */}
        <div className="card-default">
          <div className="label-caps" style={{ marginBottom: "16px" }}>Architecture</div>
          <div style={{ fontSize: "13.5px", lineHeight: 1.9, color: "var(--ink)" }}>
            <strong>Stack:</strong> Next.js 15, TypeScript, seeded data engine (mulberry32 PRNG)<br />
            <strong>Database:</strong> PostgreSQL 16 + pgvector (Sprint 2)<br />
            <strong>Persistence:</strong> Scenarios, Dynamic Config, Data Source Registry (Sprint 3 Expansion)<br />
            <strong>Deploy:</strong> Docker Compose · Tailscale-ready
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "var(--slate)", paddingTop: "16px" }}>
          Incentive Intelligence · Sprint 3 · Strategic Expansion
        </p>
      </div>
    </div>
  );
}
