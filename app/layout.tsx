import type { Metadata } from "next";
import "./globals.css";
import OnboardingTour from "@/components/OnboardingTour";

export const metadata: Metadata = {
  title: "Incentive Intelligence · Truck OEM",
  description: "Next Best Incentive · Incentive Mix by Segment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=Hanken+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        {/* Ambient background orbs */}
        <div className="ambient-orb ambient-orb-top" />
        <div className="ambient-orb ambient-orb-bottom" />

        {/* Page surface */}
        <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
          {children}
        </div>
        <OnboardingTour />
      </body>
    </html>
  );
}

export const dynamic = "force-dynamic";
