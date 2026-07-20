import { db } from "./index";
import { segments, customers, deals } from "./schema";
import { generateDeals, type Deal } from "../seed-engine";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Seeding database...");

  // 1. Clear existing data
  await db.execute(sql`TRUNCATE TABLE feedback CASCADE`);
  await db.execute(sql`TRUNCATE TABLE deals CASCADE`);
  await db.execute(sql`TRUNCATE TABLE customers CASCADE`);
  await db.execute(sql`TRUNCATE TABLE segments CASCADE`);

  // 2. Insert segments
  const segEntries = [
    {
      name: "Regional haulers",
      description: "Mid-size fleets, 15–80 units",
      model: "LT625 day cab · 6×4 · fleet spec",
      qmin: 15,
      qspan: 50,
      median: "6.4",
      k: ["0.35", "0.50", "0.80"],
      m: ["0.95", "0.70", "0.35"],
      insight: "Steepest response to upfront discount — fund it here.",
    },
    {
      name: "Vocational",
      description: "Construction, dump, refuse",
      model: "HV613 vocational · dump spec",
      qmin: 6,
      qspan: 14,
      median: "5.6",
      k: ["0.40", "0.90", "0.70"],
      m: ["0.85", "0.30", "0.45"],
      insight: "Rebate curve is nearly flat — shift that spend to discount.",
    },
    {
      name: "LTL national",
      description: "Large accounts, 50+ units",
      model: "LT625 sleeper · national account",
      qmin: 50,
      qspan: 40,
      median: "6.0",
      k: ["0.50", "0.35", "0.80"],
      m: ["0.70", "0.90", "0.30"],
      insight: "Back-end volume rebates outperform — tiers drive commitment.",
    },
    {
      name: "Owner-operators",
      description: "1–5 units, payment-sensitive",
      model: "LT625 sleeper · owner spec",
      qmin: 1,
      qspan: 4,
      median: "5.2",
      k: ["0.70", "0.85", "0.30"],
      m: ["0.45", "0.30", "0.95"],
      insight: "Financing assistance dominates — monthly payment wins.",
    },
  ];

  const insertedSegments = await db.insert(segments).values(segEntries).returning();
  console.log(`Inserted ${insertedSegments.length} segments.`);

  // 3. Insert Customers and Deals
  // We'll generate 100 deals using our engine logic
  const seed = 12345;
  // Note: generateDeals returns a small set, let's call it multiple times with different seeds
  let allDeals: Deal[] = [];
  for (let i = 0; i < 20; i++) {
    allDeals = [...allDeals, ...generateDeals(seed + i)];
  }

  // Deduplicate customers and insert them
  const customerNames = Array.from(new Set(allDeals.map(d => d.customer)));
  const customerMap = new Map<string, string>();

  for (const name of customerNames) {
    const deal = allDeals.find(d => d.customer === name);
    if (!deal) continue;
    const segment = insertedSegments.find(s => s.name.startsWith(deal.segment.split(' ')[0])); // Fuzzy match
    const segmentId = segment?.id || insertedSegments[0].id;

    const [c] = await db.insert(customers).values({
      name,
      segmentId,
      avgPayDays: parseInt(deal.pays) || 30,
      riskProfile: deal.adjust,
    }).returning();
    customerMap.set(name, c.id);
  }
  console.log(`Inserted ${customerNames.length} customers.`);

  // 4. Insert Deals
  const dealValues = allDeals.map(d => {
    const customerId = customerMap.get(d.customer);
    const segmentId = insertedSegments.find(s => s.name.startsWith(d.segment.split(' ')[0]))?.id || insertedSegments[0].id;
    
    // Parse numeric values
    const requestedPct = parseFloat(d.requested.replace(/[^0-9.]/g, '')) || 0;
    const quantity = parseInt(d.config.split(' ')[0]) || 1;
    
    // Embedding: [requestedPct, quantity, segmentId]
    const embedding = [requestedPct, quantity, segmentId];

    return {
      id: d.id,
      customerId,
      status: "PENDING" as const,
      requestedValue: d.requested,
      requestedPct: requestedPct.toString(),
      quantity,
      config: d.config,
      confidence: (parseFloat(d.confidence) / 100).toString(),
      marginAtRec: (parseFloat(d.marginAtRec) || 0).toString(),
      floorPct: (parseFloat(d.floorPct) || 0).toString(),
      recPct: (parseFloat(d.recPct) || 0).toString(),
      verdict: d.verdict,
      verdictLong: d.verdictLong,
      summary: d.summary,
      recommendation: d.recommendation,
      reason: d.reason,
      precedentSummary: d.precedent,
      embedding,
    };
  });

  // Batch insert to avoid issues
  for (let i = 0; i < dealValues.length; i += 50) {
    await db.insert(deals).values(dealValues.slice(i, i + 50)).onConflictDoNothing();
  }
  
  console.log(`Inserted ${dealValues.length} deals.`);
  console.log("Seeding complete.");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
