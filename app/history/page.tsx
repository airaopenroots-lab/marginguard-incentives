"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockHistory } from "@/lib/mock-data";
import { CheckCircle2, XCircle, TrendingUp, AlertTriangle, Clock } from "lucide-react";

const outcomeStyles = {
  "Won": "text-emerald-400 bg-emerald-500/10",
  "Lost": "text-rose-400 bg-rose-500/10",
};

export default function HistoryPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-500/10 text-slate-400 rounded-full text-xs font-medium mb-4 tracking-wide">
          <Clock className="w-3.5 h-3.5" /> DECISION LOG
        </div>
        <h1 className="text-4xl font-bold tracking-tight">History & Feedback</h1>
        <p className="text-muted-foreground text-lg mt-1">Every AI recommendation, decision, and outcome — feeding the learning loop</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Win Rate (AI Followed)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">84%</div>
          </CardContent>
        </Card>
        <Card className="bg-rose-500/5 border-rose-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-rose-400 flex items-center gap-2">
              <XCircle className="w-4 h-4" /> Win Rate (Overridden)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-400">61%</div>
          </CardContent>
        </Card>
        <Card className="bg-violet-500/5 border-violet-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-violet-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Acceptance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-violet-400">78%</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Decisions Logged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-400">{mockHistory.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Deal</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Action</th>
                  <th className="py-4 px-6">AI Recommendation</th>
                  <th className="py-4 px-6">Outcome</th>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {mockHistory.map((entry) => {
                  const isWon = entry.outcome.startsWith("Won");
                  return (
                    <tr key={entry.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-muted-foreground">{entry.id}</td>
                      <td className="py-4 px-6 font-mono text-xs">{entry.dealId}</td>
                      <td className="py-4 px-6 font-medium">{entry.customer}</td>
                      <td className="py-4 px-6">
                        <Badge variant="outline" className="text-xs">{entry.action}</Badge>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">{entry.recommendation}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${outcomeStyles[isWon ? "Won" : "Lost"]}`}>
                          {isWon ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {entry.outcome}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground text-xs">{entry.user}</td>
                      <td className="py-4 px-6 text-right font-mono text-xs text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl text-sm text-center">
        <span className="text-violet-400 font-medium">Closed-loop learning active:</span>
        <span className="text-muted-foreground"> Every accepted, overridden, won, and lost outcome feeds back into the model for continuous improvement.</span>
      </div>
    </div>
  );
}
