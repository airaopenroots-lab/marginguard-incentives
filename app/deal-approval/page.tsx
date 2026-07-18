"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowRight, AlertTriangle, Brain } from "lucide-react";

const mockDeals = [
  {
    id: "DEAL-9382",
    customer: "Midwest Logistics",
    amount: 1245000,
    requestedIncentive: "12% Discount",
    marginImpact: -18,
    segment: "Fleet",
    aiRecommendation: "Counter at 7%",
    confidence: 92,
    reason: "Similar fleet customers closed at 6.8-7.5%. 12% would destroy margin on this config.",
    alternative: "Volume rebate + 4% upfront",
    status: "pending"
  },
  {
    id: "DEAL-9371",
    customer: "Western Construction",
    amount: 875000,
    requestedIncentive: "15% + Free Service",
    marginImpact: -24,
    segment: "Heavy Equipment",
    aiRecommendation: "Approve as requested",
    confidence: 87,
    reason: "High historical win rate at 15% for this segment. Strong payment history offsets cost.",
    alternative: null,
    status: "pending"
  }
];

export default function DealApprovalPage() {
  const [deals, setDeals] = useState(mockDeals);
  const [selectedDeal, setSelectedDeal] = useState(0);

  const current = deals[selectedDeal];

  const handleAction = (action: string) => {
    const updated = [...deals];
    updated[selectedDeal].status = action;
    setDeals(updated);
    alert(`Action taken: ${action} for ${current.id}. This decision will be logged for model retraining.`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Deal Approval</h1>
          <p className="text-muted-foreground text-lg">Next Best Incentive • Real-time AI Recommendations</p>
        </div>
        <Badge variant="outline" className="text-emerald-400 border-emerald-400">2 deals requiring decision</Badge>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Deal List */}
        <div className="col-span-5 space-y-4">
          {deals.map((deal, idx) => (
            <Card 
              key={deal.id}
              className={`cursor-pointer transition-all hover:shadow-md ${selectedDeal === idx ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedDeal(idx)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{deal.customer}</CardTitle>
                  <Badge variant={deal.status === "pending" ? "default" : "secondary"}>{deal.id}</Badge>
                </div>
                <CardDescription>${deal.amount.toLocaleString()} • {deal.segment}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <div>Requested: <span className="font-medium">{deal.requestedIncentive}</span></div>
                  <div className="text-rose-400">Margin: {deal.marginImpact}%</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Recommendation Panel */}
        <div className="col-span-7">
          <Card className="h-full">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-violet-500" />
                <div>
                  <CardTitle className="text-2xl">AI Recommendation</CardTitle>
                  <CardDescription className="text-base">Confidence: <span className="font-mono text-emerald-400">{current.confidence}%</span></CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-8 space-y-8">
              <div>
                <div className="uppercase text-xs tracking-widest text-muted-foreground mb-2">RECOMMENDED ACTION</div>
                <div className="text-4xl font-semibold text-emerald-400">{current.aiRecommendation}</div>
              </div>

              <div className="bg-muted/50 p-6 rounded-2xl border">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-amber-500 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">One-line Justification</div>
                    <p className="leading-relaxed text-foreground/90">{current.reason}</p>
                  </div>
                </div>
              </div>

              {current.alternative && (
                <div>
                  <div className="uppercase text-xs tracking-widest text-muted-foreground mb-3">ALTERNATIVE INCENTIVE</div>
                  <div className="p-5 border border-dashed border-violet-400 rounded-2xl bg-violet-500/5">
                    {current.alternative}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6 border-t">
                <Button onClick={() => handleAction("Approved")} size="lg" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  <CheckCircle2 className="mr-2" /> Accept Recommendation
                </Button>
                
                <Button onClick={() => handleAction("Countered")} variant="outline" size="lg" className="flex-1">
                  <ArrowRight className="mr-2" /> Counter Offer
                </Button>
                
                <Button onClick={() => handleAction("Rejected")} variant="destructive" size="lg" className="flex-1">
                  <XCircle className="mr-2" /> Override
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                This recommendation will be logged with outcome for continuous learning
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
