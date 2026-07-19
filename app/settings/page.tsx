"use client";

import Link from "next/link";

export default function SettingsPage() {
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
        {/* Data Sources */}
        <div className="card-default">
          <div className="label-caps" style={{ marginBottom: "16px" }}>Connected data sources</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { name: "Deal desk / CPQ feed", status: "Connected · real-time", dot: "#0e7a5f" },
              { name: "Invoice & AR history", status: "Connected · 15min refresh", dot: "#0e7a5f" },
              { name: "Customer behavior stream", status: "Connected · continuous", dot: "#0e7a5f" },
              { name: "Unit cost database", status: "Connected · hourly refresh", dot: "#0e7a5f" },
            ].map(s => (
              <div key={s.name} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ fontWeight: 500, fontSize: "13.5px" }}>{s.name}</span>
                <span style={{ fontSize: "12.5px", color: "var(--slate)" }}>
                  <span style={{ color: s.dot, marginRight: "6px" }}>●</span>{s.status}
                </span>
              </div>
            ))}
          </div>
          <button className="btn-secondary" style={{ marginTop: "16px", fontSize: "11px", padding: "10px 18px" }}>+ Add data source</button>
        </div>

        {/* Model Config */}
        <div className="card-default">
          <div className="label-caps" style={{ marginBottom: "16px" }}>AI model parameters</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { label: "Confidence threshold", value: "75%", desc: "Minimum confidence to auto-recommend" },
              { label: "Margin floor (hard)", value: "3.5%", desc: "No recommendation below this margin" },
              { label: "Payment score threshold", value: "45/100", desc: "Flag for manual review below this" },
              { label: "Curve refresh interval", value: "7 days", desc: "How often response curves auto-update" },
            ].map(p => (
              <div key={p.label} style={{ padding: "14px 16px", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)" }}>
                <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>{p.label}</div>
                <div style={{ fontFamily: "'Newsreader', serif", fontSize: "24px", color: "var(--blue)", marginBottom: "4px" }}>{p.value}</div>
                <div style={{ fontSize: "12px", color: "var(--slate)" }}>{p.desc}</div>
              </div>
            ))}
          </div>
          <button className="btn-primary" style={{ marginTop: "20px", fontSize: "11px", padding: "12px 22px" }}>Save model configuration</button>
        </div>

        {/* Architecture */}
        <div className="card-default">
          <div className="label-caps" style={{ marginBottom: "16px" }}>Architecture</div>
          <div style={{ fontSize: "13.5px", lineHeight: 1.9, color: "var(--ink)" }}>
            <strong>Stack:</strong> Next.js 15, TypeScript, seeded data engine (mulberry32 PRNG)<br />
            <strong>Database:</strong> PostgreSQL 16 + pgvector (planned Sprint 2)<br />
            <strong>Deploy:</strong> Docker Compose · Tailscale-ready<br />
            <strong>Data spine:</strong> Seeded PRNG → shared data layer → scoring logic (UC1) + response curves (UC2) → two screens + feedback log
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "var(--slate)", paddingTop: "16px" }}>
          Incentive Intelligence · Sprint 1A · Design System Rebase
        </p>
      </div>
    </div>
  );
}
