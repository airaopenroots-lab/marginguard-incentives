"use server";

import { getDeals, getSegments, getInsights, getHistory, getStats, saveScenario, getScenarios } from "./db/repo";
import { db } from "./db";
import { feedback } from "./db/schema";
import { seedDB } from "./db/seed";
import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function fetchDeals() {
  const data = await getDeals();
  return data.map(d => ({
    id: d.id,
    customer: d.customer?.name || "Unknown",
    segment: d.customer?.segment?.name || "General",
    age: "1h in queue",
    config: d.config,
    confidence: (parseFloat(d.confidence || "0") * 100).toFixed(0) + "%",
    pays: d.customer?.avgPayDays + " days avg",
    memos: d.customer?.riskProfile || "0",
    adjust: d.customer?.riskProfile || "None",
    updated: "today",
    similar: "120",
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
  revalidatePath("/history");
  revalidatePath("/insights");
}

export async function fetchSegments() {
  return await getSegments();
}

export async function fetchInsights() {
  return await getInsights();
}

export async function fetchHistory() {
  const data = await getHistory();
  return data.map(f => ({
    id: f.id.slice(0, 8),
    deal: f.dealId,
    customer: f.deal?.customer?.name || "Unknown",
    action: f.action,
    rec: f.deal?.recommendation || "N/A",
    outcome: "Pending", 
    outcomeColor: "#64748b",
    user: "System User",
    time: f.createdAt ? new Date(f.createdAt).toLocaleString() : "Unknown",
    justification: f.justification,
  }));
}

export async function fetchStats() {
  return await getStats();
}

export async function resetDatabase() {
  await seedDB();
  revalidatePath("/");
  return { success: true };
}

export async function clearDecisions() {
  await db.execute(sql`TRUNCATE TABLE feedback`);
  revalidatePath("/history");
  revalidatePath("/insights");
  return { success: true };
}

export async function saveScenarioAction(data: { name: string, config: string, totalSpend: number, projectedDelta: number }) {
  await saveScenario(data);
  revalidatePath("/planning");
  return { success: true };
}

export async function fetchScenarios() {
  return await getScenarios();
}
