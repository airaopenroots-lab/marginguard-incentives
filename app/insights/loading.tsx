export default function InsightsLoading() {
  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "34px var(--gutter) 60px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: "32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ height: "48px", width: "350px", background: "#f0f0f0", borderRadius: "8px", marginBottom: "8px" }} />
          <div style={{ height: "20px", width: "400px", background: "#f8f8f8", borderRadius: "4px", marginBottom: "24px" }} />
          
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: "120px", background: "white", border: "1px solid var(--border-light)", borderRadius: "12px", animation: "pulse 2s infinite" }} />
          ))}
        </div>
        <div>
          <div style={{ height: "350px", background: "white", border: "1px solid var(--border-light)", borderRadius: "12px", animation: "pulse 2s infinite" }} />
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
}
