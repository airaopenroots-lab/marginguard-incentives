"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const segments = ["Fleet", "Heavy Equipment", "Construction", "Agriculture"];
const incentiveTypes = ["Upfront Discount", "Volume Rebate", "Financing Support", "Trade-in Allowance"];

const mockResponseData = [
  { segment: "Fleet", discount: 68, rebate: 81, financing: 44, tradein: 29 },
  { segment: "Heavy Equipment", discount: 55, rebate: 92, financing: 77, tradein: 61 },
  { segment: "Construction", discount: 73, rebate: 52, financing: 68, tradein: 44 },
  { segment: "Agriculture", discount: 81, rebate: 67, financing: 39, tradein: 88 },
];

const scenarioData = [
  { month: "Q1", actual: 1240, predicted: 1310, variance: -5.3 },
  { month: "Q2", actual: 1890, predicted: 1740, variance: 8.6 },
  { month: "Q3", actual: 1560, predicted: 1620, variance: -3.7 },
];

export default function PlanningWorkbench() {
  const [budget, setBudget] = useState([45]);
  const [selectedSegment, setSelectedSegment] = useState("Fleet");

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Incentive Mix Planning</h1>
        <p className="text-muted-foreground text-lg">Response curves • Budget allocation • Scenario modeling</p>
      </div>

      <div className="flex gap-6">
        {/* Controls */}
        <div className="w-80 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Budget Allocation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span>Total Incentive Budget</span>
                  <span className="font-mono font-semibold">${(budget[0] * 100000).toLocaleString()}</span>
                </div>
                <Slider value={budget} onValueChange={setBudget} max={100} step={1} />
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-4">Segment Focus</div>
                <div className="grid grid-cols-2 gap-2">
                  {segments.map(s => (
                    <Button
                      key={s}
                      variant={selectedSegment === s ? "default" : "outline"}
                      onClick={() => setSelectedSegment(s)}
                      className="justify-start"
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scenario Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full mb-3" variant="secondary">Run New Scenario</Button>
              <Button className="w-full" onClick={() => alert("Scenario saved. This would trigger model retraining in production.")}>
                Save Current Allocation
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="flex-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Response Curves by Incentive Type — {selectedSegment}</CardTitle>
              <p className="text-sm text-muted-foreground">Higher = better response per true dollar spent</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={mockResponseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="segment" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="discount" fill="#3b82f6" name="Upfront Discount" />
                  <Bar dataKey="rebate" fill="#8b5cf6" name="Volume Rebate" />
                  <Bar dataKey="financing" fill="#ec4899" name="Financing Support" />
                  <Bar dataKey="tradein" fill="#f59e0b" name="Trade-in Allowance" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Program Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={scenarioData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={3} name="Actual Sales" />
                    <Line type="monotone" dataKey="predicted" stroke="#64748b" strokeWidth={2} strokeDasharray="4 2" name="Predicted" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recommended Mix</CardTitle>
                  <Badge variant="outline">Q3 2026</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-2">
                {incentiveTypes.map((type, i) => {
                  const pct = [35, 40, 18, 7][i];
                  return (
                    <div key={type} className="flex items-center gap-4">
                      <div className="w-36 text-sm font-medium">{type}</div>
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{width: `${pct}%`}}></div>
                      </div>
                      <div className="font-mono text-sm w-12 text-right">{pct}%</div>
                    </div>
                  );
                })}
                <div className="pt-4 text-xs text-center text-muted-foreground">
                  Expected lift vs current plan: <span className="text-emerald-400 font-medium">+14.2%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
