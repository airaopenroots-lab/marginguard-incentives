"use client";

export function SkeletonTable({ rows = 5, cols = 5 }: { rows?: number, cols?: number }) {
  return (
    <div style={{ width: "100%", background: "white", borderRadius: "12px", border: "1px solid var(--border-light)", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "rgba(15,42,74,0.03)", borderBottom: "1px solid var(--border-light)" }}>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} style={{ padding: "14px 18px", textAlign: "left" }}>
                <div className="skeleton" style={{ width: "60%", height: "12px", borderRadius: "4px" }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border-light)" }}>
              {Array.from({ length: cols }).map((_, j) => (
                <td key={j} style={{ padding: "14px 18px" }}>
                  <div className="skeleton" style={{ width: j === 0 ? "40%" : "80%", height: "14px", borderRadius: "4px" }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
