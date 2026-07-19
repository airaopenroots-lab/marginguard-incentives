"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { summaryStats } from "@/lib/mock-data";
import { Brain, Target, TrendingUp, Shield, Zap, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 text-violet-400 rounded-full text-xs font-medium mb-5 tracking-wide">
          <Brain className="w-3.5 h-3.5" /> AI INCENTIVE INTELLIGENCE PLATFORM
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-4 leading-tight">
          Smarter incentive decisions.<br />
          <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Backed by AI. Driven by data.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Real-time Next Best Incentive recommendations and strategic Incentive Mix planning powered by your historical deal, invoice, and customer behavior data.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-12">
        {[
          { label: "Deals Pending", value: summaryStats.totalDealsPending, icon: Target, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Avg Confidence", value: summaryStats.avgConfidence + "%", icon: Brain, color: "text-violet-400", bg: "bg-violet-500/10" },
          { label: "Win Rate (AI)", value: summaryStats.winRateWithAI + "%", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Acceptance", value: summaryStats.acceptanceRate + "%", icon: Shield, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* UC Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
        {/* Use Case 1 */}
        <Link href="/deal-approval" className="group block">
          <Card className="h-full transition-all duration-300 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Use Case 1: Next Best Incentive</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Real-time deal approval intelligence</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                When a deal requests an incentive, the AI instantly recommends the smallest winning offer — approve as requested, counter lower, or switch incentive type — with clear justification.
              </p>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-blue-400 font-medium">
                <div className="h-px flex-1 bg-blue-500/20" />
                DEAL DESK • REAL-TIME
                <div className="h-px flex-1 bg-blue-500/20" />
              </div>
              <div className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition text-center">
                Open Deal Approval →
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Use Case 2 */}
        <Link href="/planning" className="group block">
          <Card className="h-full transition-all duration-300 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-0.5">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Use Case 2: Incentive Mix by Segment</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Strategic planning & optimization</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Discover which incentive types (discount, rebate, financing) drive the strongest response per customer segment and optimally allocate budget across programs.
              </p>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-violet-400 font-medium">
                <div className="h-px flex-1 bg-violet-500/20" />
                PLANNING WORKBENCH • STRATEGIC
                <div className="h-px flex-1 bg-violet-500/20" />
              </div>
              <div className="py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition text-center">
                Open Planning Workbench →
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Feature pillars */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: Shield,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            title: "Closed-Loop Learning",
            desc: "Every accepted recommendation and program outcome feeds back to improve future decisions. The system gets smarter with every deal.",
          },
          {
            icon: Brain,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            title: "Agentic Reasoning",
            desc: "Combines historical patterns with real-time customer behavior — payment scores, returns, adjustments — and margin constraints for every recommendation.",
          },
          {
            icon: Zap,
            color: "text-rose-400",
            bg: "bg-rose-500/10",
            title: "Response Curves",
            desc: "Visualize true ROI per incentive type per segment. Continuous model updates flag when segments shift so programs can be corrected mid-cycle.",
          },
        ].map((item) => (
          <Card key={item.title} className="border-border/50">
            <CardContent className="p-6">
              <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mb-5`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="font-semibold mb-2">{item.title}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{item.desc}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center pb-10">
        <p className="text-xs text-muted-foreground">
          Marginguard Incentives OS • Sprint 0 Prototype • PostgreSQL + pgvector • Version 1
        </p>
      </div>
    </div>
  );
}
