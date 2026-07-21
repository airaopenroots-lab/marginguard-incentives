"use client";

import Link from "next/link";

export default function HistoryClient({ initialHistory, stats }: { initialHistory: any[], stats: any }) {
  return (
    <div className="animate-rise" style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "34px var(--gutter) 60px" }}>
      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "22px", marginBottom: "34px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
          <span style={{ color: "var(--blue)", fontSize: "15px" }}>✦</span>
          <span className="serif" style={{ fontSize: "24px", letterSpacing: "-.01em" }}>
            Incentive <em style={{ fontStyle: "italic", color: "var(--blue)" }}>Intelligence</em>
          </span>
          <span className="label-caps" style={{ fontSize: "11px", letterSpacing: ".22em" }}>Truck OEM · Decision Log</span>
        </div>
        <nav style={{ display: "flex", gap: "6px" }}>
          <Link href="/deal-approval" className="tab-inactive" style={{ textDecoration: "none" }}>01 · Next Best Incentive</Link>
          <Link href="/planning" className="tab-inactive" style={{ textDecoration: "none" }}>02 · Incentive Mix by Segment</Link>
        </nav>
      </header>

      <h1 className="serif" style={{ fontSize: "40px", fontWeight: 400, margin: "0 0 6px", lineHeight: 1.05 }}>
        Decision <em style={{ fontStyle: "italic", color: "var(--blue)" }}>history</em>
      </h1>
      <p style={{ fontSize: "14px", color: "var(--slate)", margin: "0 0 28px" }}>
        Every accept, override, win, and loss feeds back into the model.
      </p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "28px" }}>
        <div className="card-default">
          <div className="label-caps" style={{ marginBottom: "6px" }}>AI recommendations accepted</div>
          <div style={{ fontFamily: "'Newsreader', serif", fontSize: "42px", lineHeight: 1, color: "var(--green)" }}>{stats.accepted}/{stats.total}</div>
        </div>
        <div className="card-default">
          <div className="label-caps" style={{ marginBottom: "6px" }}>Win rate when AI followed</div>
          <div style={{ fontFamily: "'Newsreader', serif", fontSize: "42px", lineHeight: 1, color: "var(--green)" }}>
            {stats.winRate}%
          </div>
        </div>
        <div className="card-default">
          <div className="label-caps" style={{ marginBottom: "6px" }}>Feedback loop</div>
          <div style={{ fontSize: "13.5px", lineHeight: 1.6, color: "var(--blue)" }}>
            All {stats.total} decisions logged. The model learns from every outcome — including the overrides.
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card-default" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
              {["ID", "Deal", "Customer", "Action", "AI recommendation", "Outcome", "User", "Time"].map(h => (
                <th key={h} className="label-caps" style={{ padding: "14px 18px", textAlign: "left", fontSize: "11px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {initialHistory.map(h => (
              <tr key={h.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                <td style={{ padding: "14px 18px", fontFamily: "ui-monospace, Menlo, monospace", fontSize: "11px", color: "var(--slate)" }}>{h.id}</td>
                <td style={{ padding: "14px 18px", fontFamily: "ui-monospace, Menlo, monospace", fontSize: "12px" }}>{h.deal}</td>
                <td style={{ padding: "14px 18px", fontWeight: 500 }}>{h.customer}</td>
                <td style={{ padding: "14px 18px" }}>
                  <span style={{
                    fontSize: "10.5px", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase",
                    padding: "3px 8px", borderRadius: "var(--radius-sm)",
                    border: `1px solid ${h.action === "ACCEPT" ? "var(--green)" : "var(--amber)"}`,
                    color: h.action === "ACCEPT" ? "var(--green)" : "var(--amber)",
                  }}>
                    {h.action}
                  </span>
                </td>
                <td style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "12.5px" }}>{h.rec}</td>
                <td style={{ padding: "14px 18px", fontWeight: 600, color: h.outcomeColor }}>{h.outcome}</td>
                <td style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "12px" }}>{h.user}</td>
                <td style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "12px" }}>{h.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="callout-crosslink" style={{ marginTop: "24px" }}>
        <span style={{ color: "var(--blue)" }}>◍</span>
        <p style={{ margin: 0, fontSize: "13.5px", lineHeight: 1.6, color: "var(--slate)" }}>
          Every decision logged here updates the scoring models behind <Link href="/deal-approval" style={{ fontWeight: 600 }}>Next Best Incentive</Link> and the response curves in <Link href="/planning" style={{ fontWeight: 600 }}>Incentive Mix by Segment</Link>.
        </p>
      </div>
    </div>
  );
}
