"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid tactical credentials.");
      } else {
        router.push("/deal-approval");
        router.refresh();
      }
    } catch (err) {
      console.error("Login submission error:", err);
      setError("Critical authentication failure. Verify secure terminal connection.");
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--wash-blue)"
    }}>
      <div className="card-hero" style={{ width: "100%", maxWidth: "400px", padding: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <span style={{ color: "var(--blue)", fontSize: "24px" }}>✦</span>
          <h1 className="serif" style={{ fontSize: "28px", marginTop: "12px" }}>Marginguard <em style={{ color: "var(--blue)" }}>Authentication</em></h1>
          <p className="label-caps" style={{ fontSize: "10px", marginTop: "8px" }}>Secure Terminal Access</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label className="label-caps" style={{ fontSize: "11px", display: "block", marginBottom: "8px" }}>Terminal ID</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              style={{ 
                width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-light)",
                fontSize: "14px"
              }}
            />
          </div>
          <div>
            <label className="label-caps" style={{ fontSize: "11px", display: "block", marginBottom: "8px" }}>Security Key</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ 
                width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-light)",
                fontSize: "14px"
              }}
            />
          </div>

          {error && <p style={{ color: "var(--amber)", fontSize: "12px", textAlign: "center" }}>{error}</p>}

          <button 
            type="submit"
            className="btn-primary"
            style={{ padding: "14px", fontSize: "13px", fontWeight: 700 }}
          >
            Authenticate Access
          </button>
        </form>

        <div style={{ marginTop: "32px", textAlign: "center", fontSize: "11px", color: "var(--slate)" }}>
          <p>Restricted to authorized OEM operators only.</p>
          <div style={{ marginTop: "8px", display: "flex", justifyContent: "center", gap: "12px" }}>
             <span>ADMIN: admin/admin</span>
             <span>OP: user/user</span>
          </div>
        </div>
      </div>
    </div>
  );
}
