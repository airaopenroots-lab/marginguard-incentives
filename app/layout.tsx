import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Incentive Intelligence · Truck OEM",
  description: "Next Best Incentive · Incentive Mix by Segment",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session;
  try {
    session = await auth();
  } catch (e) {
    console.error("Auth failed:", e);
  }

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
        <AppShell session={session}>{children}</AppShell>
      </body>
    </html>
  );
}

export const dynamic = "force-dynamic";
