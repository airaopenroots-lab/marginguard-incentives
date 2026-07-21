// Seeded PRNG data engine for Incentive Intelligence
// mulberry32 — deterministic, seedable, uniform distribution

// ── PRNG core ──────────────────────────────────────────
export function mulberry32(seed: number): () => number {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// ── Types ──────────────────────────────────────────────
export type VerdictType = "APPROVE" | "COUNTER" | "ALTERNATIVE";

export interface Deal {
  id: string;
  customer: string;
  segment: string;
  age: string;
  config: string;
  confidence: string;
  pays: string;
  memos: string;
  adjust: string;
  updated: string;
  similar: string;
  floor: string;
  marginAtRec: string;
  floorPct: string;
  recPct: string;
  requested: string;
  verdict: VerdictType;
  verdictLong: string;
  verdictColor: string;
  summary: string;
  recommendation: string;
  reason: string;
  precedent: string;
}

export interface ResponseCurve {
  pts: string;
  color: string;
  opacity: number;
}

export interface SegmentCard {
  name: string;
  desc: string;
  flag: string;
  flagColor: string;
  curves: ResponseCurve[];
  insight: string;
}

export interface MonitoringAlert {
  title: string;
  body: string;
  dot: string;
  border: string;
  bg: string;
}

// ── Segment definitions ────────────────────────────────
export const SEGMENTS = [
  {
    seg: "Regional haul",
    names: ["Cascade Regional Freight", "Bluegrass Haulage", "Pioneer Freight Lines", "Redwood Carriers", "Lakeshore Transport"],
    model: "LT625 day cab · 6×4 · fleet spec",
    qmin: 15, qspan: 50, median: 6.4,
  },
  {
    seg: "Vocational",
    names: ["Ironline Construction Co.", "Granite Peak Excavation", "Delta Dump & Aggregate", "Keystone Site Works"],
    model: "HV613 vocational · dump spec",
    qmin: 6, qspan: 14, median: 5.6,
  },
  {
    seg: "LTL national",
    names: ["Meridian LTL Carriers", "Continental Freightways", "Atlas National Lines", "Harbor Line Freight"],
    model: "LT625 sleeper · national account",
    qmin: 50, qspan: 40, median: 6.0,
  },
  {
    seg: "Owner-operator",
    names: ["Bhatt & Sons Logistics", "J. Marovic Trucking", "Twin Oaks Hauling", "Sandhill Express"],
    model: "LT625 sleeper · owner spec",
    qmin: 1, qspan: 4, median: 5.2,
  },
];

const AGES = ["25m in queue", "40m in queue", "2h in queue", "5h in queue", "1d in queue"];

// ── Deal generator ─────────────────────────────────────
export function generateDeals(seed: number): Deal[] {
  const rng = mulberry32(seed);

  // Shuffle the name pool
  const pool: { S: typeof SEGMENTS[0]; n: string }[] = [];
  SEGMENTS.forEach(S => S.names.forEach(n => pool.push({ S, n })));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const t = pool[i]; pool[i] = pool[j]; pool[j] = t;
  }

  const count = 5 + Math.floor(rng() * 3);
  const lav = "#1d5bbf";

  return pool.slice(0, count).map((p, i) => {
    const S = p.S;
    const seg = S.seg;
    const qty = S.qmin + Math.floor(rng() * S.qspan);
    const reqPct = +(S.median - 0.8 + rng() * 2.6).toFixed(1);
    const pays = 15 + Math.floor(rng() * 28);
    const memosN = Math.floor(rng() * 4);
    const similarN = "" + (40 + Math.floor(rng() * 220));
    const confidence = (75 + Math.floor(rng() * 20)) + "%";
    const floorN = +(3.5 + rng() * 1.5).toFixed(1);
    const marginN = +(floorN + 2 + rng() * 1.6).toFixed(1);
    const floorPos = 30 + Math.floor(rng() * 14);
    const recPos = floorPos + 12 + Math.floor(rng() * 18);
    const counterAt = +(S.median + 0.1).toFixed(1);

    const base: Deal = {
      id: "D-" + (4810 + Math.floor(rng() * 90)) + i,
      customer: p.n,
      segment: seg,
      age: AGES[Math.floor(rng() * AGES.length)],
      config: qty + " × " + S.model,
      confidence,
      pays: pays + " days avg",
      memos: memosN === 0 ? "0" : memosN === 1 ? "1 (minor)" : "" + memosN,
      adjust: rng() < 0.6 ? "None in 24 mo" : rng() < 0.5 ? "1 warranty offset" : "1 return, resolved",
      updated: ["today", "yesterday", "3 days ago", "5 days ago"][Math.floor(rng() * 4)],
      similar: similarN,
      floor: floorN + "%",
      marginAtRec: marginN + "%",
      floorPct: floorPos + "%",
      recPct: recPos + "%",
      requested: "",
      verdict: "APPROVE",
      verdictLong: "",
      verdictColor: "",
      summary: "",
      recommendation: "",
      reason: "",
      precedent: "",
    };

    // Build the recommendation logic
    if (seg === "Vocational" && rng() < 0.6) {
      const reb = +(7 + rng() * 4).toFixed(1);
      return {
        ...base,
        requested: "$" + reb + "K/unit rebate",
        verdict: "ALTERNATIVE",
        verdictLong: "Different form",
        verdictColor: "#64748b",
        summary: "Asks for $" + reb + "K/unit rebate on " + qty + " vocational trucks.",
        recommendation: "Offer " + (reqPct - 1.2).toFixed(1) + "% upfront discount instead — vocational buyers barely respond to rebates.",
        reason: p.n + " attained only " + (55 + Math.floor(rng() * 15)) + "% of rebate tiers last cycle; the equivalent upfront discount wins at lower true cost.",
        precedent: "Vocational segment response to rebates is the flattest curve in the book.",
      };
    }

    if (seg === "Owner-operator" && rng() < 0.6) {
      return {
        ...base,
        requested: reqPct + "% discount",
        verdict: "ALTERNATIVE",
        verdictLong: "Different form",
        verdictColor: "#64748b",
        summary: reqPct + "% requested on " + qty + " sleepers, financing-sensitive buyer.",
        recommendation: "Offer 3% + 1.9% APR interest assistance — payment, not price, wins this segment.",
        reason: "Owner-operators respond to monthly payment. The financing package costs " + (reqPct - 2.4).toFixed(1) + "% in true dollars and outperforms on win rate.",
        precedent: "Interest assistance wins owner-operator deals at ~2.4 pts lower true cost.",
      };
    }

    if (reqPct > S.median + 0.6) {
      return {
        ...base,
        requested: reqPct + "% discount",
        verdict: "COUNTER",
        verdictLong: "Counter lower",
        verdictColor: lav,
        summary: "Requests " + reqPct + "% fleet discount on " + qty + " units.",
        recommendation: "Counter at " + counterAt + "% — history says this deal closes without the last " + Math.round((reqPct - counterAt) * 100) + " bps.",
        reason: "Deals like this one, with customers like this one, closed at " + S.median + "% when offered " + counterAt + "–" + (counterAt + 0.5).toFixed(1) + "%.",
        precedent: "Median winning incentive on comparable " + seg.toLowerCase() + " deals: " + S.median + "%.",
      };
    }

    return {
      ...base,
      requested: reqPct + "% discount",
      verdict: "APPROVE",
      verdictLong: "Approve as asked",
      verdictColor: "#0e7a5f",
      summary: reqPct + "% on " + qty + " units, " + seg.toLowerCase() + " account.",
      recommendation: "Approve as requested — " + reqPct + "% is at the winning median for this profile.",
      reason: p.n + " pays in " + pays + " days and competitive quotes are on the table. Countering risks a " + qty + "-unit deal to save " + Math.round(Math.abs(S.median - reqPct) * 100 + 20) + " bps.",
      precedent: seg + " deals of this size close at " + (S.median - 0.2).toFixed(1) + "–" + (S.median + 0.2).toFixed(1) + "% four years running.",
    };
  });
}

// ── Response curve helper ──────────────────────────────
function resp(k: number, m: number, x: number): number {
  return m * (1 - Math.exp(-x / k));
}

function curve(k: number, m: number, color: string, opacity: number): ResponseCurve {
  const pts: string[] = [];
  for (let i = 0; i <= 20; i++) {
    const x = i / 20;
    pts.push((x * 200).toFixed(0) + "," + (90 - resp(k, m, x) * 82).toFixed(1));
  }
  return { pts: pts.join(" "), color, opacity };
}

// ── Segment card generator ─────────────────────────────
export function generateSegments(seed: number): SegmentCard[] {
  const gold = "#b45309";
  const lav = "#1d5bbf";
  const cream = "#8fa3bb";

  const segs = [
    { name: "Regional haulers", desc: "Mid-size fleets, 15–80 units", flag: "On plan", flagColor: lav, k: [0.35, 0.5, 0.8], m: [0.95, 0.7, 0.35], insight: "Steepest response to upfront discount — fund it here." },
    { name: "Vocational", desc: "Construction, dump, refuse", flag: "Rebates flat", flagColor: gold, k: [0.4, 0.9, 0.7], m: [0.85, 0.3, 0.45], insight: "Rebate curve is nearly flat — shift that spend to discount." },
    { name: "LTL national", desc: "Large accounts, 50+ units", flag: "On plan", flagColor: lav, k: [0.5, 0.35, 0.8], m: [0.7, 0.9, 0.3], insight: "Back-end volume rebates outperform — tiers drive commitment." },
    { name: "Owner-operators", desc: "1–5 units, payment-sensitive", flag: "Watch", flagColor: gold, k: [0.7, 0.85, 0.3], m: [0.45, 0.3, 0.95], insight: "Financing assistance dominates — monthly payment wins." },
  ];

  return segs.map((s, si) => {
    const j = mulberry32(seed + si * 13);
    const jm = s.m.map(v => Math.min(1, v * (0.85 + j() * 0.3)));
    return {
      name: s.name,
      desc: s.desc,
      flag: s.flag,
      flagColor: s.flagColor,
      curves: [
        curve(s.k[0], jm[0], gold, 1),
        curve(s.k[1], jm[1], lav, 1),
        curve(s.k[2], jm[2], cream, 1),
      ],
      insight: s.insight,
    };
  });
}

// ── Monitoring alerts ──────────────────────────────────
export function generateAlerts(): MonitoringAlert[] {
  const lav = "#1d5bbf";
  return [
    {
      title: "Vocational rebate attainment running hot",
      body: "Attainment tracking at 71% vs. 61% planned — true cost of the program is rising. Curves updated.",
      dot: "#b45309",
      border: "rgba(180,83,9,.3)",
      bg: "rgba(180,83,9,.05)",
    },
    {
      title: "Owner-operator segment under-responding",
      body: "Discount response 18% below curve for two consecutive months. Recommend shifting to interest assistance mid-year.",
      dot: "#b45309",
      border: "rgba(180,83,9,.3)",
      bg: "rgba(180,83,9,.05)",
    },
    {
      title: "Spend pacing to budget",
      body: "Q1 spend at 24.6% of annual plan — within the expected band across all four segments.",
      dot: lav,
      border: "rgba(15,42,74,.12)",
      bg: "#ffffff",
    },
  ];
}

// ── Projection computation ─────────────────────────────
export interface SegmentBudget {
  d: number;
  r: number;
  f: number;
  k: number[];
  m: number[];
  baseUnits: number;
}

export function computeProjection(segmentBudgets: SegmentBudget[]) {
  let totalUnits = 0;
  let totalBaseline = 0;
  let totalSpend = 0;

  let totalD = 0;
  let totalR = 0;
  let totalF = 0;

  segmentBudgets.forEach(b => {
    totalD += b.d;
    totalR += b.r;
    totalF += b.f;
    totalSpend += (b.d + b.r + b.f);

    const units = Math.round(
      b.baseUnits * (
        resp(b.k[0], b.m[0], b.d) +
        resp(b.k[1], b.m[1], b.r) +
        resp(b.k[2], b.m[2], b.f)
      )
    );
    totalUnits += units;

    // Baseline: fixed mix of $6.0M discount, $4.5M rebate, $1.5M financing distributed across 4 segments
    const bD = 6.0 / 4;
    const bR = 4.5 / 4;
    const bF = 1.5 / 4;

    const baseline = Math.round(
      b.baseUnits * (
        resp(b.k[0], b.m[0], bD) +
        resp(b.k[1], b.m[1], bR) +
        resp(b.k[2], b.m[2], bF)
      )
    );
    totalBaseline += baseline;
  });

  const over = Math.abs(totalSpend - 12) > 0.05;
  const delta = totalUnits - totalBaseline;
  const costPerUnit = totalUnits > 0 ? "$" + Math.round((totalSpend * 1e6) / totalUnits).toLocaleString() : "—";

  let scenarioInsight: string;
  if (delta > 15) {
    scenarioInsight = "Reallocation beats the current plan — mostly by moving flat vocational rebate spend into discounts.";
  } else if (delta < -15) {
    scenarioInsight = "This split underperforms — you are funding the flattest parts of the curves.";
  } else {
    scenarioInsight = "Roughly at the current plan. Try shifting rebate dollars toward discount or financing.";
  }

  return {
    total: totalSpend,
    over,
    units: totalUnits,
    baseline: totalBaseline,
    delta,
    costPerUnit,
    scenarioInsight,
    dLabel: "$" + totalD.toFixed(1) + "M",
    rLabel: "$" + totalR.toFixed(1) + "M",
    fLabel: "$" + totalF.toFixed(1) + "M",
    totalLabel: "$" + totalSpend.toFixed(1) + "M" + (over ? (totalSpend > 12 ? " — over budget" : " — under budget") : " ✓"),
    totalColor: over ? "#b45309" : "#0e7a5f",
    deltaLabel: (delta >= 0 ? "+" : "") + delta + " units",
    deltaColor: delta >= 0 ? "#0e7a5f" : "#b45309",
  };
}
