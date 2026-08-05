"use server";

import { getDeals, getSegments, getInsights, getHistory, getStats, saveScenario, getScenarios, getConfig, updateConfig, getDataSources, addDataSource, getDataSourceById, updateDataSourceMapping } from "./db/repo";
import { db } from "./db";
import { feedback } from "./db/schema";
import { seedDB } from "./db/seed";
import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { formatDate, formatRelativeTime } from "./utils";

export async function fetchDeals() {
  const data = await getDeals();
  return data.map(d => ({
    id: d.id,
    customer: d.customer?.name || "Unknown",
    segment: d.customer?.segment?.name || "General",
    age: formatRelativeTime(d.createdAt),
    config: d.config || "",
    confidence: (parseFloat(d.confidence || "0") * 100).toFixed(0) + "%",
    pays: d.customer?.avgPayDays + " days avg",
    memos: d.customer?.riskProfile || "0",
    adjust: d.customer?.riskProfile || "None",
    updated: formatRelativeTime(d.updatedAt),
    similar: "120",
    floor: d.floorPct + "%",
    marginAtRec: d.marginAtRec + "%",
    floorPct: d.floorPct || "0",
    recPct: d.recPct || "0",
    requested: d.requestedValue || "",
    verdict: d.verdict || "APPROVE",
    verdictLong: d.verdictLong || "",
    verdictColor: d.verdict === "APPROVE" ? "#0e7a5f" : d.verdict === "COUNTER" ? "#1d5bbf" : "#64748b",
    summary: d.summary || "",
    recommendation: d.recommendation || "",
    reason: d.reason || "",
    precedent: d.precedentSummary || "",
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
    time: formatDate(f.createdAt),
    justification: f.justification,
  }));
}

export async function fetchStats() {
  return await getStats();
}

export async function resetDatabase() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");
  
  await seedDB();
  revalidatePath("/");
  return { success: true };
}

export async function clearDecisions() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  await db.execute(sql`TRUNCATE TABLE feedback`);
  revalidatePath("/history");
  revalidatePath("/insights");
  return { success: true };
}

export async function saveScenarioAction(data: { name: string, config: string, totalSpend: number, projectedDelta: number }) {
  // Strict Mode: Validation
  if (!data.name || data.name.length < 3 || data.name.length > 50) {
    throw new Error("Scenario name must be between 3 and 50 characters.");
  }

  const existing = await fetchScenarios();
  if (existing.some(s => s.name.toLowerCase() === data.name.toLowerCase())) {
    throw new Error("A scenario with this name already exists.");
  }

  // Audit Snapshot: Capture model version
  const snapshotId = "mg-incentives-v4.0.0"; 

  await saveScenario({
    ...data,
    snapshotId,
  });
  
  revalidatePath("/planning");
  return { success: true };
}

export async function fetchScenarios() {
  return await getScenarios();
}

export async function fetchConfig() {
  const cfg = await getConfig();
  // Default values if not in DB
  return {
    confidence_threshold: cfg.confidence_threshold || "75",
    margin_floor: cfg.margin_floor || "3.5",
    payment_threshold: cfg.payment_threshold || "45",
    refresh_interval: cfg.refresh_interval || "7",
  };
}

export async function saveConfigAction(key: string, value: string) {
  await updateConfig(key, value);
  revalidatePath("/settings");
  return { success: true };
}

export async function fetchDataSources() {
  const data = await getDataSources();
  return data.map(s => ({
    ...s,
    lastSync: formatDate(s.lastSync)
  }));
}

export async function addDataSourceAction(name: string) {
  const [source] = await addDataSource(name);
  revalidatePath("/settings");
  return { success: true, source: {
    id: source.id,
    name: source.name,
    status: source.status,
    lastSync: formatDate(source.lastSync)
  } };
}

export async function fetchDataSourceById(id: string) {
  const source = await getDataSourceById(id);
  if (!source) return null;
  return {
    ...source,
    lastSync: formatDate(source.lastSync)
  };
}

export async function updateMappingAction(id: string, mapping: any) {
  await updateDataSourceMapping(id, mapping);
  revalidatePath(`/settings/mapping/${id}`);
  revalidatePath("/settings");
  return { success: true };
}

export async function testMappingAction(id: string, mapping: Record<string, string>) {
  const source = await getDataSourceById(id);
  if (!source) throw new Error("Source not found");

  // Simulate external data fetch
  const rawRecord: Record<string, any> = {
    "ext_cust_id": "C-9921",
    "legal_name": "Global Logistics Corp",
    "market_segment": "Regional Haul",
    "req_disc_pct": "12.5",
    "unit_count": "45",
    "system_ref": "REF-001-XYZ",
    "created_at_utc": new Date().toISOString()
  };

  // Apply mapping
  const result: Record<string, any> = {};
  Object.entries(mapping).forEach(([target, sourceKey]) => {
    if (sourceKey && rawRecord[sourceKey]) {
      result[target] = rawRecord[sourceKey];
    } else {
      result[target] = null;
    }
  });

  return {
    success: true,
    raw: rawRecord,
    mapped: result
  };
}
