import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Target, TrendingUp, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm mb-4">
          <Brain className="w-4 h-4" /> AI INCENTIVE INTELLIGENCE PLATFORM
        </div>
        <h1 className="text-5xl font-bold tracking-tighter mb-4">
          Make better incentive decisions.<br />Faster. Smarter.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Real-time Next Best Incentive recommendations and strategic Incentive Mix planning powered by your historical deal, invoice, and customer data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Use Case 1 */}
        <Card className="hover:border-primary/50 transition-colors group">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Target className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <CardTitle>Use Case 1: Next Best Incentive</CardTitle>
                <CardDescription>Real-time deal approval intelligence</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-sm leading-relaxed text-muted-foreground">
              When a deal requests an incentive, the AI instantly recommends the smallest winning offer — approve as requested, counter lower, or switch incentive type — with clear justification.
            </div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-blue-400 font-medium">
              <div className="h-px flex-1 bg-blue-500/30"></div>
              DEAL DESK
              <div className="h-px flex-1 bg-blue-500/30"></div>
            </div>
            <a href="/deal-approval" className="block text-center py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition">
              Open Deal Approval Dashboard →
            </a>
          </CardContent>
        </Card>

        {/* Use Case 2 */}
        <Card className="hover:border-violet-500/50 transition-colors group">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                <TrendingUp className="w-6 h-6 text-violet-500" />
              </div>
              <div>
                <CardTitle>Use Case 2: Incentive Mix by Segment</CardTitle>
                <CardDescription>Strategic planning &amp; optimization</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-sm leading-relaxed text-muted-foreground">
              Discover which incentive types (discount, rebate, financing) drive the strongest response per customer segment and optimally allocate budget across programs.
            </div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-violet-400 font-medium">
              <div className="h-px flex-1 bg-violet-500/30"></div>
              PLANNING WORKBENCH
              <div className="h-px flex-1 bg-violet-500/30"></div>
            </div>
            <a href="/planning" className="block text-center py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition">
              Open Planning Workbench →
            </a>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 grid grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-3xl p-8">
          <Shield className="w-8 h-8 text-emerald-500 mb-6" />
          <div className="font-semibold mb-2">Closed-Loop Learning</div>
          <div className="text-sm text-muted-foreground">Every accepted recommendation and program outcome feeds back to improve future decisions.</div>
        </div>
        <div className="bg-card border border-border rounded-3xl p-8">
          <Brain className="w-8 h-8 text-amber-500 mb-6" />
          <div className="font-semibold mb-2">Agentic Reasoning</div>
          <div className="text-sm text-muted-foreground">Combines historical patterns with real-time customer behavior and margin constraints.</div>
        </div>
        <div className="bg-card border border-border rounded-3xl p-8">
          <TrendingUp className="w-8 h-8 text-rose-500 mb-6" />
          <div className="font-semibold mb-2">Response Curves</div>
          <div className="text-sm text-muted-foreground">Visualize true ROI per incentive type per segment with continuous model updates.</div>
        </div>
      </div>
    </div>
  );
}
