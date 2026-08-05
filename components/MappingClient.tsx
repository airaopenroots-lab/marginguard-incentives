"use client";

import Link from "next/link";
import { useState } from "react";
import { updateMappingAction, testMappingAction } from "@/lib/actions";

interface MappingClientProps {
  source: {
    id: string;
    name: string;
    mapping: any;
  };
}

const SCHEMA_FIELDS = [
  { key: "customer_name", label: "Customer Name", desc: "Legal entity or account name" },
  { key: "segment", label: "Market Segment", desc: "Internal classification (e.g. Regional, Vocational)" },
  { key: "requested_discount", label: "Requested Discount", desc: "Percentage value (0-100)" },
  { key: "quantity", label: "Unit Quantity", desc: "Number of trucks in deal" },
  { key: "deal_id", label: "External Deal ID", desc: "Unique identifier in source system" },
  { key: "timestamp", label: "Submission Date", desc: "When the request was created" },
];

export default function MappingClient({ source }: MappingClientProps) {
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [mapping, setMapping] = useState<Record<string, string>>(source.mapping || {});
  const [testResult, setTestResult] = useState<any>(null);

  const handleSave = async () => {
    setLoading(true);
    await updateMappingAction(source.id, mapping);
    setLoading(false);
    alert("Field mapping updated successfully.");
  };

  const handleTest = async () => {
    setTesting(true);
    const result = await testMappingAction(source.id, mapping);
    setTestResult(result);
    setTesting(false);
  };

  return (
    <div className="animate-rise" style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "34px var(--gutter) 60px" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "22px", marginBottom: "34px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
          <span style={{ color: "var(--blue)", fontSize: "15px" }}>✦</span>
          <span className="serif" style={{ fontSize: "24px", letterSpacing: "-.01em" }}>
            Incentive <em style={{ fontStyle: "italic", color: "var(--blue)" }}>Intelligence</em>
          </span>
          <span className="label-caps" style={{ fontSize: "11px", letterSpacing: ".22em" }}>Data Mapping Protocol</span>
        </div>
        <Link href="/settings" className="btn-secondary" style={{ textDecoration: "none", fontSize: "11px", padding: "10px 18px" }}>
          Back to Settings
        </Link>
      </header>

      <div style={{ marginBottom: "40px" }}>
        <h1 className="serif" style={{ fontSize: "40px", fontWeight: 400, margin: "0 0 12px", lineHeight: 1.05 }}>
          Map <em style={{ fontStyle: "italic", color: "var(--blue)" }}>{source.name}</em>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--slate)", maxWidth: "60ch" }}>
          Define how fields from this external source map to the Marginguard intelligence schema. This protocol ensures high-fidelity reasoning across disparate data sets.
        </p>
      </div>

      <div className="card-default" style={{ padding: "0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--border-light)", borderBottom: "1px solid var(--border-light)" }}>
          <div style={{ padding: "16px 24px", background: "#f9fafb", fontSize: "12px", fontWeight: 600, color: "var(--slate)" }} className="label-caps">Marginguard Field</div>
          <div style={{ padding: "16px 24px", background: "#f9fafb", fontSize: "12px", fontWeight: 600, color: "var(--slate)" }} className="label-caps">Source External Field</div>
        </div>
        
        {SCHEMA_FIELDS.map((f) => (
          <div key={f.key} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--border-light)" }}>
            <div style={{ padding: "24px", background: "#fff" }}>
              <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>{f.label}</div>
              <div style={{ fontSize: "12.5px", color: "var(--slate)" }}>{f.desc}</div>
              <code style={{ display: "inline-block", marginTop: "8px", fontSize: "11px", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", color: "var(--blue)" }}>
                {f.key}
              </code>
            </div>
            <div style={{ padding: "24px", background: "#fff", display: "flex", alignItems: "center" }}>
              <input 
                type="text" 
                placeholder={`Enter source field for ${f.label.toLowerCase()}...`}
                value={mapping[f.key] || ""}
                onChange={(e) => setMapping({ ...mapping, [f.key]: e.target.value })}
                style={{ 
                  width: "100%", 
                  padding: "12px 16px", 
                  border: "1px solid var(--border-light)", 
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "inherit"
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "34px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button 
          className="btn-secondary" 
          onClick={handleTest} 
          disabled={testing || loading}
          style={{ padding: "14px 24px" }}
        >
          {testing ? "Simulating Fetch..." : "Test Protocol"}
        </button>
        <button 
          className="btn-primary" 
          onClick={handleSave} 
          disabled={loading || testing}
          style={{ padding: "14px 40px" }}
        >
          {loading ? "Saving Protocol..." : "Secure Field Mapping"}
        </button>
      </div>

      {testResult && (
        <div className="animate-rise card-default" style={{ marginTop: "34px", border: "1px solid var(--blue-light)", background: "#f8faff" }}>
          <div className="label-caps serif" style={{ marginBottom: "20px", color: "var(--blue)" }}>Simulation Results</div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--slate)", marginBottom: "12px" }} className="label-caps">Raw Source Sample</div>
              <pre style={{ fontSize: "11px", background: "#fff", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-light)", overflowX: "auto" }}>
                {JSON.stringify(testResult.raw, null, 2)}
              </pre>
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--slate)", marginBottom: "12px" }} className="label-caps">Marginguard Ingestion Preview</div>
              <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid var(--border-light)", padding: "8px 0" }}>
                {Object.entries(testResult.mapped).map(([key, value]: [string, any]) => (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "8px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: "12px", color: "var(--slate)" }}>{key}</span>
                    <span style={{ fontSize: "13px", fontWeight: 500, color: value ? "var(--ink)" : "var(--amber)" }}>
                      {value || "MISSING"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <p style={{ marginTop: "20px", fontSize: "12px", color: "var(--blue)", fontStyle: "italic" }}>
            ✦ Protocol verification complete. The simulation confirms how fields will be ingested into the intelligence engine.
          </p>
        </div>
      )}
    </div>
  );
}
