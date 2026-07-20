"use server";

import { getDeals, getSegments } from "./db/repo";
import { db } from "./db";
import { feedback } from "./db/schema";

export async function fetchDeals() {
  const data = await getDeals();
  return data.map(d => ({
    id: d.id,
    customer: d.customer?.name || "Unknown",
    segment: d.customer?.segment?.name || "General",
    age: "1h in queue", // Placeholder for now
    config: d.config,
    confidence: (parseFloat(d.confidence || "0") * 100).toFixed(0) + "%",
    pays: d.customer?.avgPayDays + " days avg",
    memos: d.customer?.riskProfile || "0",
    adjust: d.customer?.riskProfile || "None",
    updated: "today",
    similar: "120", // Placeholder
    floor: d.floorPct + "%",
    marginAtRec: d.marginAtRec + "%",
    floorPct: d.floorPct,
    recPct: d.recPct,
    requested: d.requestedValue,
    verdict: d.verdict,
    verdictLong: d.verdictLong,
    verdictColor: d.verdict === "APPROVE" ? "#0e7a5f" : d.verdict === "COUNTER" ? "#1d5bbf" : "#64748b",
    summary: d.summary,
    recommendation: d.recommendation,
    reason: d.reason,
    precedent: d.precedentSummary,
  }));
}

export async function recordDecision(dealId: string, action: string, justification: string) {
  await db.insert(feedback).values({
    dealId,
    action,
    justification,
  });
}

export async function fetchSegments() {
  return await getSegments();
}
