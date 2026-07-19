"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  segments,
  incentiveTypes,
  incentiveTypeLabels,
  mockResponseData,
  mockScenarioData,
  defaultAllocation,
  type IncentiveType,
} from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { Zap, Compass, TrendingUp, Target, DollarSign, BarChart3, Info, CheckCircle2 } from "lucide-react";

type ConfigMode = "quick" | "guided";

export default function PlanningWorkbench() {
  const [mode, setMode] = useState<ConfigMode>("quick");
  const [budget, setBudget] = useState<number[]>([45]);
  const [selectedSegment, setSelectedSegment] = useState("Fleet");
  const [allocation, setAllocation] = useState(defaultAllocation);

  const totalBudget = budget[0] * 100000;

  const segmentData = mockResponseData.find(s => s.segment === selectedSegment)!;

  const responseChartData = [
    { name: incentiveTypeLabels.upfront_discount, value: segmentData.discount, color: "#3b82f6" },
    { name: incentiveTypeLabels.volume_rebate, value: segmentData.rebate, color: "#8b5cf6" },
    { name: incentiveTypeLabels.financing_support, value: segmentData.financing, color: "#ec4899" },
    { name: incentiveTypeLabels.tradein_allowance, value: segmentData.tradein, color: "#f59e0b" },
  ];

  const sortedByResponse = [...responseChartData].sort((a, b) => b.value - a.value);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 text-violet-400 rounded-full text-xs font-medium mb-4 tracking-wide">
          <BarChart3 className="w-3.5 h-3.5" /> INCENTIVE MIX BY SEGMENT
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Planning Workbench</h1>
        <p className="text-muted-foreground text-lg mt-1">Optimize incentive allocation across segments using response curves and scenario modeling</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-muted/50 rounded-2xl w-fit">
        <button
          onClick={() => setMode("quick")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            mode === "quick"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Zap className="w-4 h-4" /> Quick Config
        </button>
        <button
          onClick={() => setMode("guided")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            mode === "guided"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Compass className="w-4 h-4" /> Guided Config
        </button>
      </div>

      {/* Mode Description */}
      <div className="bg-violet-500/5 border border-violet-500/20 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-medium text-violet-400 mb-1">
            {mode === "quick"
              ? "Quick Config — Adjust budget and segment, see results instantly"
              : "Guided Config — Step-by-step explanation of each incentive type's performance per segment"}
          </div>
          <p className="text-xs text-muted-foreground">
            {mode === "quick"
              ? "Drag the budget slider and select segments. The charts update in real-time. Best for fast what-if analysis."
              : "Walk through each decision with explanations of what the data shows. Best for quarterly planning and stakeholder reviews."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Panel — Controls */}
        <div className="col-span-4 space-y-6">
          {/* Budget Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="w-5 h-5 text-emerald-400" /> Budget Allocation
              </CardTitle>
              <CardDescription>Total incentive budget for this planning cycle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-muted-foreground">Total Budget</span>
                  <span className="font-mono font-bold text-lg">${totalBudget.toLocaleString()}</span>
                </div>
                <Slider
                  value={budget}
                  onValueChange={(v) => setBudget(Array.isArray(v) ? v : [v])}
                  max={100}
                  step={1}
                  className="[&_[role=slider]]:bg-violet-500 [&_[role=slider]]:border-violet-500 [&_.bg-primary]:bg-violet-500"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                  <span>$0</span>
                  <span>$10M</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-violet-400" /> Segment Focus
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {segments.map(s => (
                    <Button
                      key={s}
                      variant={selectedSegment === s ? "default" : "outline"}
                      onClick={() => setSelectedSegment(s)}
                      size="sm"
                      className={`justify-start text-sm ${
                        selectedSegment === s
                          ? "bg-violet-600 hover:bg-violet-700"
                          : "hover:border-violet-500/30"
                      }`}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Mix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Recommended Mix
              </CardTitle>
              <CardDescription>Optimal allocation for {selectedSegment}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(Object.keys(allocation) as IncentiveType[]).map((type) => (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span>{incentiveTypeLabels[type]}</span>
                    <span className="font-mono font-medium">{allocation[type]}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all"
                      style={{ width: `${allocation[type]}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4 mt-2 border-t text-center">
                <span className="text-xs text-muted-foreground">Expected lift vs current: </span>
                <span className="text-emerald-400 font-bold">+14.2%</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <Button className="w-full bg-violet-600 hover:bg-violet-700">Save Allocation</Button>
              <Button variant="outline" className="w-full">Export Scenario Report</Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel — Charts & Analysis */}
        <div className="col-span-8 space-y-6">
          {mode === "quick" ? (
            <>
              {/* Quick Config Charts */}
              <Card>
                <CardHeader>
                  <CardTitle>Response Curves — {selectedSegment} Segment</CardTitle>
                  <CardDescription>Scores represent predicted behavioral response per true dollar of incentive spend. Higher = stronger response.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={340}>
                    <BarChart data={responseChartData} barSize={60}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: "oklch(0.708 0 0)" }} />
                      <YAxis tick={{ fontSize: 12, fill: "oklch(0.708 0 0)" }} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          background: "oklch(0.205 0 0)",
                          border: "1px solid oklch(1 0 0 / 0.1)",
                          borderRadius: "12px",
                          fontSize: "13px",
                        }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {responseChartData.map((entry, idx) => (
                          <rect key={idx} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Program Performance</CardTitle>
                    <CardDescription>Actual vs predicted sales volume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={mockScenarioData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.708 0 0)" }} />
                        <YAxis tick={{ fontSize: 11, fill: "oklch(0.708 0 0)" }} />
                        <Tooltip
                          contentStyle={{
                            background: "oklch(0.205 0 0)",
                            border: "1px solid oklch(1 0 0 / 0.1)",
                            borderRadius: "12px",
                            fontSize: "13px",
                          }}
                        />
                        <Line type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={3} dot={{ fill: "#22c55e", r: 5 }} name="Actual" />
                        <Line type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="6 3" dot={{ fill: "#8b5cf6", r: 4 }} name="Predicted" />
                        <Legend />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Variance by Quarter</CardTitle>
                    <CardDescription>Performance delta vs prediction</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5 mt-4">
                      {mockScenarioData.filter(d => d.actual > 0).map((d) => (
                        <div key={d.month}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-medium">{d.month}</span>
                            <span className={`font-mono font-bold ${d.variance > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                              {d.variance > 0 ? "+" : ""}{d.variance}%
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${d.variance > 0 ? "bg-emerald-500" : "bg-rose-500"}`}
                                style={{ width: `${Math.abs(d.variance) * 10}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-24 text-right font-mono">
                              ${d.actual.toLocaleString()}K
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            /* Guided Config — Step-by-step with explanations */
            <div className="space-y-6">
              {/* Step 1: Segment Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-sm font-bold text-white">1</div>
                    <div>
                      <CardTitle>Segment Profile: {selectedSegment}</CardTitle>
                      <CardDescription>Understanding the customer base before allocating budget</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    {responseChartData.map((item) => (
                      <div key={item.name} className="p-4 bg-muted/30 rounded-xl">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{item.name}</div>
                        <div className="text-3xl font-bold" style={{ color: item.color }}>{item.value}</div>
                        <div className="text-xs text-muted-foreground mt-1">Response Score /100</div>
                        <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${item.value}%`, backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl">
                    <div className="text-sm font-medium text-violet-400 mb-1">Analysis for {selectedSegment}</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedSegment === "Fleet" && "Fleet customers respond strongest to Volume Rebates (81/100) and Upfront Discounts (68/100). Financing support (44) and trade-in (29) are less effective. Recommendation: allocate 60-70% of budget to discounts and rebates."}
                      {selectedSegment === "Heavy Equipment" && "Heavy Equipment is highly responsive to Volume Rebates (92/100) and Financing Support (77/100). The high capital cost of equipment makes financing terms critical. Discounts alone (55) underperform relative to structured incentives."}
                      {selectedSegment === "Construction" && "Construction shows balanced response across Upfront Discount (73), Financing (68), and Rebates (52). No single incentive dominates — flexibility wins. Trade-in allowance (44) is moderate."}
                      {selectedSegment === "Agriculture" && "Agriculture is unique: Trade-in Allowance (88) and Upfront Discount (81) dominate. Farmers value equipment turnover and cash savings. Rebates (67) work but financing (39) is rarely the deciding factor."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Incentive Performance Ranking */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-sm font-bold text-white">2</div>
                    <div>
                      <CardTitle>Incentive Performance Ranking</CardTitle>
                      <CardDescription>Which incentive types drive the strongest customer response</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sortedByResponse.map((item, idx) => (
                      <div key={item.name} className="flex items-center gap-4 p-4 bg-muted/20 rounded-xl">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: item.color + "20", color: item.color }}>
                          #{idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {idx === 0 ? "Highest response — prioritize in budget allocation" :
                             idx === 1 ? "Strong response — secondary budget priority" :
                             idx === 2 ? "Moderate response — use selectively" :
                             "Lowest response — minimize or pair with stronger types"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</div>
                          <div className="text-xs text-muted-foreground">/100</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Step 3: Budget Allocation Guidance */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-sm font-bold text-white">3</div>
                    <div>
                      <CardTitle>Budget Allocation Guidance</CardTitle>
                      <CardDescription>How to split your ${totalBudget.toLocaleString()} budget for maximum impact</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(Object.keys(allocation) as IncentiveType[]).map((type) => {
                      const data = responseChartData.find(d => d.name === incentiveTypeLabels[type])!;
                      return (
                        <div key={type} className="flex items-center gap-4 p-3">
                          <div className="w-32 text-sm font-medium">{incentiveTypeLabels[type]}</div>
                          <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                              style={{ width: `${allocation[type]}%` }}
                            />
                          </div>
                          <div className="font-mono font-bold text-sm w-14 text-right">{allocation[type]}%</div>
                          <div className="w-28 text-right text-xs text-muted-foreground">
                            ${((totalBudget * allocation[type]) / 100).toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-emerald-400">Projected Outcome</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        At ${totalBudget.toLocaleString()} with this allocation, the model projects a <span className="text-emerald-400 font-bold">+14.2% lift</span> in segment response vs. the current plan. This translates to approximately <span className="text-emerald-400 font-bold">+$2.6M</span> in incremental revenue for the {selectedSegment} segment in the next planning cycle.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
