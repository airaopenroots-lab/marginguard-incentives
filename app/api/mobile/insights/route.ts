import { getDeals, getStats } from "@/lib/db/repo";
import { requireMobileToken, unauthorizedResponse } from "@/lib/mobile-auth";

export async function GET(request: Request) {
  try {
    await requireMobileToken(request);
  } catch {
    return unauthorizedResponse();
  }

  const [allDeals, stats] = await Promise.all([getDeals(), getStats()]);
  const activeDeals = allDeals.filter((deal) => deal.status === "PENDING");
  const approved = allDeals.filter((deal) => deal.status === "APPROVED");
  // requestedValue is currently a display string (for example, "6.9% discount"),
  // not a currency amount. Never expose NaN as a KPI; report zero until a
  // monetary exposure field is added to the data model.
  const dollarsAtStake = 0;

  return Response.json({
    activeDeals: activeDeals.length,
    approveRate: allDeals.length ? Math.round((approved.length / allDeals.length) * 100) : 0,
    dollarsAtStake,
    decisions: stats.total,
    accepted: stats.accepted,
    winRate: stats.winRate,
  });
}
