"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Settings, Database, Shield, Zap, Bell, Users, Key, Globe } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-500/10 text-slate-400 rounded-full text-xs font-medium mb-4 tracking-wide">
          <Settings className="w-3.5 h-3.5" /> CONFIGURATION
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-lg mt-1">Platform configuration, integrations, and model parameters</p>
      </div>

      <div className="space-y-8">
        {/* Data Sources */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <CardTitle>Data Sources</CardTitle>
                <CardDescription>Connected systems feeding the AI engine</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "CPQ / Deal Desk API", status: "connected", lastSync: "2 min ago", icon: Zap },
              { name: "Invoice & AR System", status: "connected", lastSync: "15 min ago", icon: Database },
              { name: "Customer Behavior Stream", status: "connected", lastSync: "Real-time", icon: Bell },
              { name: "Unit Cost Database", status: "connected", lastSync: "1 hour ago", icon: Database },
            ].map((source) => (
              <div key={source.name} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <source.icon className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">{source.name}</div>
                    <div className="text-xs text-muted-foreground">Last sync: {source.lastSync}</div>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20" variant="outline">
                  {source.status.toUpperCase()}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full">+ Add Data Source</Button>
          </CardContent>
        </Card>

        {/* Model Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <CardTitle>AI Model Configuration</CardTitle>
                <CardDescription>Parameters controlling recommendation behavior</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Confidence Threshold</label>
                <Input defaultValue="85" type="number" min="50" max="99" />
                <p className="text-xs text-muted-foreground">Minimum confidence % to auto-recommend (50-99)</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Margin Floor (%)</label>
                <Input defaultValue="8" type="number" min="0" max="100" />
                <p className="text-xs text-muted-foreground">Hard margin floor — no recommendation below this</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Score Threshold</label>
                <Input defaultValue="45" type="number" min="0" max="100" />
                <p className="text-xs text-muted-foreground">Flag customers below this score for manual review</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Response Curve Refresh (days)</label>
                <Input defaultValue="7" type="number" min="1" max="30" />
                <p className="text-xs text-muted-foreground">How often segment response curves auto-update</p>
              </div>
            </div>
            <Button className="bg-violet-600 hover:bg-violet-700">Save Model Configuration</Button>
          </CardContent>
        </Card>

        {/* Access Control */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <CardTitle>Access Control</CardTitle>
                <CardDescription>User roles and permissions (Sprint 1 — Coming Soon)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { role: "Deal Desk Approver", users: 4, permissions: "View deals, accept/counter/override AI recs" },
              { role: "VP Sales", users: 2, permissions: "Override any rec, approve counter offers" },
              { role: "Finance Manager", users: 1, permissions: "Set margin floors, view budget pacing" },
              { role: "AI Admin", users: 1, permissions: "Configure model, data sources, feedback loop" },
            ].map((entry) => (
              <div key={entry.role} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                <div>
                  <div className="font-medium text-sm">{entry.role}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{entry.permissions}</div>
                </div>
                <Badge variant="outline" className="text-xs">{entry.users} user{entry.users !== 1 ? "s" : ""}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground pt-4 pb-8">
          Marginguard Incentives OS • Sprint 0 Prototype • PostgreSQL + pgvector • Version 1
        </div>
      </div>
    </div>
  );
}
