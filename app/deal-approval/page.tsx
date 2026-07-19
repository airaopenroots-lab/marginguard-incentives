"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockDeals } from "@/lib/mock-data";
import { CheckCircle2, XCircle, ArrowRight, AlertTriangle, Brain, Shield, TrendingUp, Clock, User, MapPin, Truck } from "lucide-react";

export default function DealApprovalPage() {
  const [deals, setDeals] = useState(mockDeals);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const current = deals[selectedIdx];
  const pendingCount = deals.filter(d => d.status === "pending").length;

  const handleAction = (action: "approved" | "countered" | "rejected") => {
    const updated = [...deals];
    updated[selectedIdx] = { ...updated[selectedIdx], status: action };
    setDeals(updated);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium mb-4 tracking-wide">
            <Brain className="w-3.5 h-3.5" /> NEXT BEST INCENTIVE
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Deal Approval</h1>
          <p className="text-muted-foreground text-lg mt-1">Real-time AI recommendations at the point of decision</p>
        </div>
        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-sm px-4 py-2" variant="outline">
          {pendingCount} deal{pendingCount !== 1 ? "s" : ""} requiring decision
        </Badge>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Deal Queue */}
        <div className="col-span-4 space-y-3">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2 px-1">Deal Queue</div>
          {deals.map((deal, idx) => {
            const isSelected = selectedIdx === idx;
            const isResolved = deal.status !== "pending";
            return (
              <Card
                key={deal.id}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? "ring-2 ring-blue-500 border-blue-500/40 shadow-lg shadow-blue-500/5"
                    : "hover:border-blue-500/20 hover:shadow-md"
                } ${isResolved ? "opacity-60" : ""}`}
                onClick={() => setSelectedIdx(idx)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold">{deal.customer}</div>
                    <div className="flex items-center gap-2">
                      {isResolved && (
                        <Badge variant="outline" className="text-xs">
                          {deal.status === "approved" ? "✓ Accepted" : deal.status === "countered" ? "⟳ Countered" : "✗ Rejected"}
                        </Badge>
                      )}
                      <span className="font-mono text-xs text-muted-foreground">{deal.id}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>{deal.config}</span>
                      <span className="font-mono">${deal.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{deal.segment} • {deal.region}</span>
                      <span className={`font-medium ${deal.marginImpact < -15 ? "text-rose-400" : "text-amber-400"}`}>
                        {deal.marginImpact}% margin
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-border/50">
                      <span className="text-muted-foreground">Requested:</span>
                      <span className="font-medium">{deal.requestedAmount} ({deal.requestedIncentive})</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detail + AI Panel */}
        <div className="col-span-8 space-y-6">
          {/* Deal Detail Card */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-4 gap-6 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Customer</div>
                  <div className="font-semibold">{current.customer}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {current.region}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Configuration</div>
                  <div className="font-semibold flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-muted-foreground" /> {current.config}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{current.segment} Segment</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Payment Score</div>
                  <div className="font-semibold">
                    <span className={current.paymentScore < 50 ? "text-rose-400" : current.paymentScore < 70 ? "text-amber-400" : "text-emerald-400"}>
                      {current.paymentScore}/100
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">AR History</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Submitted</div>
                  <div className="font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(current.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {new Date(current.submittedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendation */}
          <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-violet-500/5">
            <CardHeader className="border-b border-blue-500/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">AI Recommendation</CardTitle>
                  <div className="flex items-center gap-2 text-sm mt-0.5">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className={`font-mono font-bold ${current.confidence >= 90 ? "text-emerald-400" : current.confidence >= 80 ? "text-amber-400" : "text-rose-400"}`}>
                      {current.confidence}%
                    </span>
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          current.confidence >= 90 ? "bg-emerald-500" : current.confidence >= 80 ? "bg-amber-500" : "bg-rose-500"
                        }`}
                        style={{ width: `${current.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Recommended Action */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                <div className="text-xs uppercase tracking-widest text-blue-400 mb-2">Recommended Action</div>
                <div className="text-3xl font-bold text-blue-400">{current.aiRecommendation}</div>
              </div>

              {/* Justification */}
              <div className="flex items-start gap-4 bg-muted/30 p-5 rounded-2xl border border-border">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium mb-1">Why this recommendation</div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{current.reason}</p>
                </div>
              </div>

              {/* Alternative */}
              {current.alternative && (
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Alternative Incentive Strategy</div>
                  <div className="p-5 border border-dashed border-violet-500/30 rounded-2xl bg-violet-500/5">
                    <div className="flex items-center gap-2 text-violet-400 text-sm font-medium">
                      <TrendingUp className="w-4 h-4" /> {current.alternative}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-border">
                <Button
                  onClick={() => handleAction("approved")}
                  size="lg"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="mr-2 w-5 h-5" /> Accept Recommendation
                </Button>
                <Button
                  onClick={() => handleAction("countered")}
                  variant="outline"
                  size="lg"
                  className="flex-1 border-blue-500/30 hover:bg-blue-500/10"
                >
                  <ArrowRight className="mr-2 w-5 h-5" /> Counter Offer
                </Button>
                <Button
                  onClick={() => handleAction("rejected")}
                  variant="outline"
                  size="lg"
                  className="flex-1 border-rose-500/30 hover:bg-rose-500/10 text-rose-400"
                >
                  <XCircle className="mr-2 w-5 h-5" /> Override
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                <Shield className="w-3 h-3 inline mr-1" />
                This decision is logged for continuous model learning. Human approver stays in control.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
