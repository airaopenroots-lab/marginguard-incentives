// Centralized mock data for all prototypes
// Truck OEM / Heavy Equipment industry data

export type IncentiveType = "upfront_discount" | "volume_rebate" | "financing_support" | "tradein_allowance";

export interface Deal {
  id: string;
  customer: string;
  amount: number;
  requestedIncentive: string;
  requestedAmount: string;
  marginImpact: number;
  segment: string;
  region: string;
  config: string;
  paymentScore: number; // 0-100 from AR history
  aiRecommendation: string;
  confidence: number;
  reason: string;
  alternative: string | null;
  status: "pending" | "approved" | "countered" | "rejected";
  submittedAt: string;
}

export interface SegmentResponse {
  segment: string;
  discount: number;
  rebate: number;
  financing: number;
  tradein: number;
}

export interface ScenarioPoint {
  month: string;
  actual: number;
  predicted: number;
  variance: number;
}

export interface InsightItem {
  id: string;
  title: string;
  description: string;
  category: "opportunity" | "risk" | "anomaly";
  impact: "high" | "medium" | "low";
  createdAt: string;
}

export interface HistoryEntry {
  id: string;
  dealId: string;
  customer: string;
  action: string;
  recommendation: string;
  outcome: string;
  user: string;
  timestamp: string;
}

// ── USE CASE 1: Deal Approval ──────────────────────────────────────────

export const mockDeals: Deal[] = [
  {
    id: "DEAL-9382",
    customer: "Midwest Logistics",
    amount: 1245000,
    requestedIncentive: "Upfront Discount",
    requestedAmount: "12%",
    marginImpact: -18,
    segment: "Fleet",
    region: "Central",
    config: "FH-860 6x4 Tractor",
    paymentScore: 72,
    aiRecommendation: "Counter at 7%",
    confidence: 92,
    reason: "Similar fleet customers closed at 6.8-7.5% on FH-860 configs. 12% would destroy margin. Customer payment score 72/100.",
    alternative: "Volume rebate 8% + 4% upfront",
    status: "pending",
    submittedAt: "2026-07-19T09:23:00Z",
  },
  {
    id: "DEAL-9371",
    customer: "Western Construction",
    amount: 875000,
    requestedIncentive: "Upfront Discount + Free Service",
    requestedAmount: "15% + 2yr service",
    marginImpact: -24,
    segment: "Heavy Equipment",
    region: "West",
    config: "HD-785 Excavator",
    paymentScore: 91,
    aiRecommendation: "Approve as requested",
    confidence: 87,
    reason: "High historical win rate at 15% for Heavy Equipment. Excellent payment history (91/100) offsets cost. Long-term service contract increases lifetime value.",
    alternative: null,
    status: "pending",
    submittedAt: "2026-07-19T08:45:00Z",
  },
  {
    id: "DEAL-9401",
    customer: "Southern AgriCorp",
    amount: 2100000,
    requestedIncentive: "Financing Support",
    requestedAmount: "0% APR 60mo",
    marginImpact: -12,
    segment: "Agriculture",
    region: "South",
    config: "AG-920 Combine Harvester",
    paymentScore: 85,
    aiRecommendation: "Offer 2.9% APR instead",
    confidence: 94,
    reason: "AgriCorp has excellent credit. 0% APR costs $187K true cost. 2.9% APR still wins this segment (78% close rate) and saves $94K.",
    alternative: "3.9% APR + $25K trade-in bonus",
    status: "pending",
    submittedAt: "2026-07-18T16:12:00Z",
  },
  {
    id: "DEAL-9389",
    customer: "NorthEast Freight",
    amount: 680000,
    requestedIncentive: "Volume Rebate",
    requestedAmount: "10% rebate on 50 units",
    marginImpact: -9,
    segment: "Fleet",
    region: "Northeast",
    config: "FM-420 Day Cab",
    paymentScore: 48,
    aiRecommendation: "Counter: lower rebate, higher tier",
    confidence: 91,
    reason: "NorthEast Freight historically achieves only 62% of rebate tiers. Payment score 48/100 is a risk flag. Offer 6% rebate at 60 units instead — true cost similar, better protection.",
    alternative: "5% upfront + 3% rebate at 40 units",
    status: "pending",
    submittedAt: "2026-07-18T14:30:00Z",
  },
  {
    id: "DEAL-9412",
    customer: "Rocky Mountain Mining",
    amount: 3200000,
    requestedIncentive: "Trade-in Allowance + Discount",
    requestedAmount: "Trade-in $180K + 8%",
    marginImpact: -21,
    segment: "Heavy Equipment",
    region: "West",
    config: "HD-1250 Mining Truck",
    paymentScore: 94,
    aiRecommendation: "Approve with adjusted trade-in",
    confidence: 88,
    reason: "Trade-in overvalued by ~$35K vs auction comps. Approve at 8% discount + $145K trade-in. Mining segment has 96% retention — lifetime value justifies premium.",
    alternative: "8% discount + $145K trade-in + 2yr service package",
    status: "pending",
    submittedAt: "2026-07-18T11:05:00Z",
  },
  {
    id: "DEAL-9405",
    customer: "Gulf States Construction",
    amount: 1150000,
    requestedIncentive: "Upfront Discount",
    requestedAmount: "10%",
    marginImpact: -15,
    segment: "Construction",
    region: "South",
    config: "CE-450 Wheel Loader",
    paymentScore: 67,
    aiRecommendation: "Approve as requested",
    confidence: 84,
    reason: "10% is within construction segment norms (9-11%). Region has 3 active competitors — losing this deal could lose a key account. Payment score acceptable.",
    alternative: null,
    status: "pending",
    submittedAt: "2026-07-17T15:40:00Z",
  },
];

// ── USE CASE 2: Planning Workbench ─────────────────────────────────────

export const segments = ["Fleet", "Heavy Equipment", "Construction", "Agriculture"];
export const incentiveTypes: IncentiveType[] = ["upfront_discount", "volume_rebate", "financing_support", "tradein_allowance"];
export const regions = ["Northeast", "South", "Central", "West"];

export const incentiveTypeLabels: Record<IncentiveType, string> = {
  upfront_discount: "Upfront Discount",
  volume_rebate: "Volume Rebate",
  financing_support: "Financing Support",
  tradein_allowance: "Trade-in Allowance",
};

export const mockResponseData: SegmentResponse[] = [
  { segment: "Fleet", discount: 68, rebate: 81, financing: 44, tradein: 29 },
  { segment: "Heavy Equipment", discount: 55, rebate: 92, financing: 77, tradein: 61 },
  { segment: "Construction", discount: 73, rebate: 52, financing: 68, tradein: 44 },
  { segment: "Agriculture", discount: 81, rebate: 67, financing: 39, tradein: 88 },
];

export const mockScenarioData: ScenarioPoint[] = [
  { month: "Q1 2026", actual: 1240, predicted: 1310, variance: -5.3 },
  { month: "Q2 2026", actual: 1890, predicted: 1740, variance: 8.6 },
  { month: "Q3 2026", actual: 1560, predicted: 1620, variance: -3.7 },
  { month: "Q4 2026 (proj)", actual: 0, predicted: 1950, variance: 0 },
];

export const defaultAllocation: Record<IncentiveType, number> = {
  upfront_discount: 35,
  volume_rebate: 40,
  financing_support: 18,
  tradein_allowance: 7,
};

// ── USE CASE: AI Insights ──────────────────────────────────────────────

export const mockInsights: InsightItem[] = [
  {
    id: "INS-001",
    title: "Fleet segment rebate response surging",
    description: "Fleet customers are responding 18% above forecast to volume rebates in Q3. Recommend shifting 5% of discount budget to rebates — projected +$2.1M incremental revenue.",
    category: "opportunity",
    impact: "high",
    createdAt: "2026-07-19T06:30:00Z",
  },
  {
    id: "INS-002",
    title: "NorthEast Freight payment risk escalating",
    description: "AR aging for NorthEast Freight crossed 90-day threshold on 3 invoices totaling $342K. Payment score dropped from 62 to 48 in 30 days. Flag for manual review before next deal.",
    category: "risk",
    impact: "high",
    createdAt: "2026-07-18T22:15:00Z",
  },
  {
    id: "INS-003",
    title: "Agriculture trade-in values over market",
    description: "Last 12 trade-in deals in Agriculture averaged 14% above auction comps. True cost of trade-in incentive is $22K higher per deal than modeled. Curve needs recalibration.",
    category: "anomaly",
    impact: "medium",
    createdAt: "2026-07-18T14:00:00Z",
  },
  {
    id: "INS-004",
    title: "Financing support underutilized in Construction",
    description: "Only 8% of Construction deals used financing support despite 68% response score. Competitors are pushing 0% financing — risk of share loss. Consider promotional program.",
    category: "opportunity",
    impact: "medium",
    createdAt: "2026-07-17T18:45:00Z",
  },
  {
    id: "INS-005",
    title: "Q3 budget pacing 12% ahead of plan",
    description: "Total incentive spend is $4.7M vs $4.2M planned through Week 28. Heavy Equipment segment is the main driver at +18% vs plan. No action needed if volume continues at +8.6%.",
    category: "risk",
    impact: "low",
    createdAt: "2026-07-17T09:00:00Z",
  },
  {
    id: "INS-006",
    title: "Deal velocity anomaly in West region",
    description: "West region deal submissions dropped 31% vs 4-week average. No seasonal pattern matches this. Possible competitive entry or sales team disruption. Investigate.",
    category: "anomaly",
    impact: "medium",
    createdAt: "2026-07-16T16:20:00Z",
  },
];

// ── USE CASE: History & Feedback ───────────────────────────────────────

export const mockHistory: HistoryEntry[] = [
  {
    id: "HIST-042",
    dealId: "DEAL-9381",
    customer: "Eastern Haulers Inc",
    action: "Accepted AI Recommendation",
    recommendation: "Counter at 7%",
    outcome: "Won at 7.5% counter",
    user: "Sarah Chen (Deal Desk)",
    timestamp: "2026-07-19T07:15:00Z",
  },
  {
    id: "HIST-041",
    dealId: "DEAL-9375",
    customer: "Pacific Rim Logistics",
    action: "Overrode — Approved Higher",
    recommendation: "Reject — below margin floor",
    outcome: "Lost to competitor (15% cheaper)",
    user: "Mike Torres (VP Sales)",
    timestamp: "2026-07-18T19:40:00Z",
  },
  {
    id: "HIST-040",
    dealId: "DEAL-9372",
    customer: "Great Plains Equipment",
    action: "Accepted AI Recommendation",
    recommendation: "Approve as requested",
    outcome: "Won at 10%",
    user: "James Okonkwo (Deal Desk)",
    timestamp: "2026-07-18T14:55:00Z",
  },
  {
    id: "HIST-039",
    dealId: "DEAL-9368",
    customer: "Coastal Crane & Rigging",
    action: "Countered Lower Than AI",
    recommendation: "Counter at 12%",
    outcome: "Won at 9%",
    user: "Sarah Chen (Deal Desk)",
    timestamp: "2026-07-18T10:20:00Z",
  },
  {
    id: "HIST-038",
    dealId: "DEAL-9360",
    customer: "Midwest Logistics",
    action: "Accepted AI Recommendation",
    recommendation: "Offer financing alternative",
    outcome: "Won — switched to 4.9% APR",
    user: "James Okonkwo (Deal Desk)",
    timestamp: "2026-07-17T16:30:00Z",
  },
  {
    id: "HIST-037",
    dealId: "DEAL-9355",
    customer: "Rocky Mountain Mining",
    action: "Accepted AI Recommendation",
    recommendation: "Approve with adjusted trade-in",
    outcome: "Won — trade-in adjusted -$35K",
    user: "Mike Torres (VP Sales)",
    timestamp: "2026-07-17T11:10:00Z",
  },
  {
    id: "HIST-036",
    dealId: "DEAL-9348",
    customer: "Sunbelt AgriSupply",
    action: "Accepted AI Recommendation",
    recommendation: "Approve as requested",
    outcome: "Won at 15%",
    user: "Sarah Chen (Deal Desk)",
    timestamp: "2026-07-16T15:45:00Z",
  },
  {
    id: "HIST-035",
    dealId: "DEAL-9342",
    customer: "Northern Freightways",
    action: "Accepted AI Recommendation",
    recommendation: "Counter at 5%",
    outcome: "Lost — customer walked",
    user: "James Okonkwo (Deal Desk)",
    timestamp: "2026-07-16T09:30:00Z",
  },
];

// ── Summary Stats ───────────────────────────────────────────────────────

export const summaryStats = {
  totalDealsPending: 6,
  avgConfidence: 89,
  dealsThisMonth: 42,
  acceptanceRate: 78, // % where AI rec was accepted
  winRateWithAI: 84,  // % won when AI rec followed
  winRateWithoutAI: 61, // % won when AI rec overridden
  totalBudgetQ3: 18_500_000,
  budgetSpentQ3: 7_200_000,
  expectedLift: 14.2,
};
