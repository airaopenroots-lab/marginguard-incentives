"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import NavBar from "@/components/NavBar";
import OnboardingTour from "@/components/OnboardingTour";

export function AppShell({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  const role = (session?.user as any)?.role || "OPERATOR";

  return (
    <SessionProvider session={session}>
      <div className="ambient-orb ambient-orb-top" />
      <div className="ambient-orb ambient-orb-bottom" />
      <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
        <NavBar />
        <div style={{ paddingTop: session ? 56 : 0 }}>{children}</div>
      </div>
      <OnboardingTour userRole={role} />
    </SessionProvider>
  );
}
