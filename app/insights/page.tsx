"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockInsights, type InsightItem } from "@/lib/mock-data";
import { TrendingUp, AlertTriangle, Zap, Lightbulb, ChevronRight } from "lucide-react";

const categoryConfig = {
  opportunity: { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Opportunity" },
  risk: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Risk Alert" },
  anomaly: { icon: Zap, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", label: "Anomaly" },
};

const impactBadge = {
  high: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  low: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export default function InsightsPage() {
  const [selected, setSelected] = useState<InsightItem | null>(null);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 text-violet-400 rounded-full text-xs font-medium mb-4 tracking-wide">
          <Lightbulb className="w-3.5 h-3.5" /> AI INSIGHTS
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Intelligence Feed</h1>
        <p className="text-muted-foreground text-lg mt-1">Continuous monitoring of deals, segments, and anomaly detection</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Insight List */}
        <div className="col-span-2 space-y-4">
          {mockInsights.map((insight) => {
            const cat = categoryConfig[insight.category];
            const CatIcon = cat.icon;
            return (
              <Card
                key={insight.id}
                className={`cursor-pointer transition-all hover:shadow-lg hover:border-violet-500/30 ${
                  selected?.id === insight.id ? "ring-2 ring-violet-500 border-violet-500/40" : ""
                }`}
                onClick={() => setSelected(insight)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 ${cat.bg} rounded-xl flex items-center justify-center shrink-0 mt-0.5`}>
                        <CatIcon className={`w-4.5 h-4.5 ${cat.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base leading-snug">{insight.title}</CardTitle>
                        <CardDescription className="mt-1">{insight.description.slice(0, 120)}...</CardDescription>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                  </div>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                  <Badge className={cat.border + " " + cat.color + " bg-transparent"} variant="outline">{cat.label}</Badge>
                  <Badge className={impactBadge[insight.impact]} variant="outline">{insight.impact.toUpperCase()} IMPACT</Badge>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(insight.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="col-span-1">
          {selected ? (
            <Card className="sticky top-8">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const cat = categoryConfig[selected.category];
                    const CatIcon = cat.icon;
                    return (
                      <>
                        <div className={`w-8 h-8 ${cat.bg} rounded-lg flex items-center justify-center`}>
                          <CatIcon className={`w-4 h-4 ${cat.color}`} />
                        </div>
                        <Badge className={cat.border + " " + cat.color + " bg-transparent"} variant="outline">{cat.label}</Badge>
                      </>
                    );
                  })()}
                </div>
                <CardTitle className="text-lg leading-snug">{selected.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm leading-relaxed text-muted-foreground">{selected.description}</p>
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Impact</span>
                    <Badge className={impactBadge[selected.impact]} variant="outline">{selected.impact.toUpperCase()}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Detected</span>
                    <span className="font-mono text-xs">
                      {new Date(selected.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID</span>
                    <span className="font-mono text-xs">{selected.id}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition">
                    Investigate
                  </button>
                  <button className="flex-1 py-2 border border-border hover:border-violet-500/30 rounded-lg text-sm transition">
                    Dismiss
                  </button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="sticky top-8 bg-muted/20">
              <CardContent className="py-12 text-center">
                <Lightbulb className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-40" />
                <p className="text-sm text-muted-foreground">Select an insight<br />to view full details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
