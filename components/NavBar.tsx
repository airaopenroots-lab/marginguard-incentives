"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Dashboard", href: "/deal-approval", icon: "◈" },
  { label: "Settings", href: "/settings", icon: "⚙" },
];

export default function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session?.user) return null;

  const role = (session.user as any)?.role || "OPERATOR";
  const displayName = (session.user as any)?.name || "Operator";
  const roleLabel = role === "ADMIN" ? "Admin" : "Operator";
  const roleColor = role === "ADMIN" ? "var(--amber)" : "var(--blue)";

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-light)",
        height: 56,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "0 var(--gutter)",
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Logo + Brand */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <span style={{ color: "var(--blue)", fontSize: 14 }}>✦</span>
          <span
            className="serif"
            style={{
              fontSize: 17,
              fontWeight: 400,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
            }}
          >
            Marginguard
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 4, flex: 1 }}>
          {NAV_LINKS.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "var(--blue)" : "var(--slate)",
                  background: isActive ? "var(--wash-blue)" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 13 }}>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side: user + logout */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexShrink: 0,
          }}
        >
          {/* Role badge */}
          <span
            className="label-caps"
            style={{
              fontSize: 10,
              letterSpacing: "0.16em",
              color: roleColor,
              background:
                role === "ADMIN" ? "var(--wash-amber)" : "var(--wash-blue)",
              border: `1px solid ${
                role === "ADMIN" ? "var(--amber)" : "var(--border-blue)"
              }`,
              borderRadius: "var(--radius-sm)",
              padding: "3px 8px",
            }}
          >
            {roleLabel}
          </span>

          {/* User name */}
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--ink)",
              maxWidth: 140,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayName}
          </span>

          {/* Sign Out */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              background: "transparent",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-md)",
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--slate)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--wash-blue)";
              e.currentTarget.style.color = "var(--blue)";
              e.currentTarget.style.borderColor = "var(--border-blue)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--slate)";
              e.currentTarget.style.borderColor = "var(--border-light)";
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
