import { SkeletonTable } from "@/components/SkeletonTable";

export default function HistoryLoading() {
  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "34px var(--gutter) 60px" }}>
      <div style={{ height: "40px", width: "300px", background: "#f0f0f0", borderRadius: "8px", marginBottom: "20px", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
      <div style={{ height: "20px", width: "450px", background: "#f8f8f8", borderRadius: "4px", marginBottom: "40px" }} />
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "28px" }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: "100px", background: "white", border: "1px solid var(--border-light)", borderRadius: "12px", animation: "pulse 2s infinite" }} />
        ))}
      </div>

      <SkeletonTable rows={10} cols={8} />
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
}
