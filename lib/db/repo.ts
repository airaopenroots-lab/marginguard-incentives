import { db } from "./index";
import { deals, customers } from "./schema";
import { eq, desc, l2Distance, sql } from "drizzle-orm";

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
