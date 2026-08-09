import { getDeals } from "@/lib/db/repo";
import { requireMobileToken, unauthorizedResponse } from "@/lib/mobile-auth";

export async function GET(request: Request) {
  try {
    await requireMobileToken(request);
  } catch {
    return unauthorizedResponse();
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || "20")));
  const allDeals = await getDeals();
  const start = (page - 1) * limit;
  const deals = allDeals.slice(start, start + limit).map((deal) => ({
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
  }));

  return Response.json({ deals, page, limit, total: allDeals.length });
}
