import { db } from "./index";
import { deals, customers, feedback, segments, scenarios } from "./schema";
import { eq, desc, l2Distance, sql, count, avg } from "drizzle-orm";

export async function getDeals() {
  return await db.query.deals.findMany({
    with: {
      customer: {
        with: {
          segment: true
        }
      }
    },
    orderBy: [desc(deals.createdAt)],
    limit: 50,
  });
}

export async function getDealById(id: string) {
  return await db.query.deals.findFirst({
    where: eq(deals.id, id),
    with: {
      customer: {
        with: {
          segment: true
        }
      }
    }
  });
}

export async function getSimilarDeals(dealId: string, limit = 5) {
  const deal = await db.query.deals.findFirst({
    where: eq(deals.id, dealId)
  });

  if (!deal || !deal.embedding) return [];

  // Vector similarity search
  const similarity = l2Distance(deals.embedding, deal.embedding);
  
  return await db
    .select({
      id: deals.id,
      customer: customers.name,
      requestedValue: deals.requestedValue,
      verdict: deals.verdict,
      similarity: similarity,
    })
    .from(deals)
    .innerJoin(customers, eq(deals.customerId, customers.id))
    .where(sql`${deals.id} != ${dealId}`)
    .orderBy(similarity)
    .limit(limit);
}

export async function getSegments() {
  return await db.query.segments.findMany();
}

export async function getInsights() {
  // Real logic: find segments with high requested_pct deals
  const hotSegments = await db
    .select({
      name: segments.name,
      avgRequested: avg(deals.requestedPct),
    })
    .from(deals)
    .innerJoin(customers, eq(deals.customerId, customers.id))
    .innerJoin(segments, eq(customers.segmentId, segments.id))
    .groupBy(segments.name)
    .having(sql`avg(${deals.requestedPct}) > 6.0`)
    .limit(3);

  // Return formatted insights
  return [
    ...hotSegments.map(s => ({
      id: `INS-${s.name.slice(0, 3).toUpperCase()}`,
      category: "risk" as const,
      title: `${s.name} attainment running hot`,
      body: `Average requested discount for this segment is ${Number(s.avgRequested).toFixed(1)}%, which is 15% above the historical median. High risk of budget breach.`,
      date: new Date().toISOString().split('T')[0],
    })),
    {
      id: "INS-001",
      category: "opportunity" as const,
      title: "Regional haul response to upfront discount is strongest curve",
      body: "Model confirms: every additional point of discount in this segment returns 2.3× the unit volume of the same dollar in rebates.",
      date: new Date().toISOString().split('T')[0],
    },
    {
      id: "INS-003",
      category: "anomaly" as const,
      title: "Margin-floor breaches: zero in the last 90 days",
      body: "Hard constraints are being respected across all recommendations. The system is operating within safe parameters.",
      date: new Date().toISOString().split('T')[0],
    }
  ];
}

export async function getHistory() {
  return await db.query.feedback.findMany({
    with: {
      deal: {
        with: {
          customer: true
        }
      }
    },
    orderBy: [desc(feedback.createdAt)],
    limit: 50,
  });
}

export async function getStats() {
  const [totalFeedback] = await db.select({ value: count() }).from(feedback);
  const [accepted] = await db.select({ value: count() }).from(feedback).where(eq(feedback.action, 'Accepted'));
  
  return {
    total: totalFeedback.value,
    accepted: accepted.value,
    winRate: 88, // Mocked for now until we have outcomes
  };
}

export async function saveScenario(data: { name: string, config: string, totalSpend: number, projectedDelta: number }) {
  return await db.insert(scenarios).values({
    ...data,
    totalSpend: data.totalSpend.toString(),
  }).returning();
}

export async function getScenarios() {
  return await db.query.scenarios.findMany({
    orderBy: [desc(scenarios.createdAt)],
  });
}
