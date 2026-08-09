import { getDealById } from "@/lib/db/repo";
import { requireMobileToken, unauthorizedResponse } from "@/lib/mobile-auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireMobileToken(request);
  } catch {
    return unauthorizedResponse();
  }

  const { id } = await params;
  const deal = await getDealById(id);
  if (!deal) return Response.json({ error: "Deal not found" }, { status: 404 });

  return Response.json({
    id: deal.id,
    customer: deal.customer?.name || "Unknown",
    segment: deal.customer?.segment?.name || "General",
    status: deal.status,
    requestedValue: deal.requestedValue,
    requestedPct: deal.requestedPct,
    quantity: deal.quantity,
    config: deal.config,
    confidence: deal.confidence,
    marginAtRec: deal.marginAtRec,
    floorPct: deal.floorPct,
    recPct: deal.recPct,
    verdict: deal.verdict,
    verdictLong: deal.verdictLong,
    summary: deal.summary,
    recommendation: deal.recommendation,
    reason: deal.reason,
    precedent: deal.precedentSummary,
    createdAt: deal.createdAt,
    updatedAt: deal.updatedAt,
  });
}
