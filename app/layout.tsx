import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marginguard Incentives | AI Decision Intelligence",
  description: "Next Best Incentive • Incentive Mix by Segment",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-background text-foreground">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 flex flex-col min-h-screen">
            <header className="border-b border-border px-6 py-4 flex items-center justify-between bg-card">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Marginguard Incentives</h1>
                  <p className="text-xs text-muted-foreground">AI-Powered Incentive Intelligence Platform</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  LIVE
                </div>
                <div className="text-muted-foreground">Girish • Demo Mode</div>
              </div>
            </header>
            <div className="flex-1 p-8 overflow-auto">
              {children}
            </div>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
export const dynamic = "force-dynamic"
