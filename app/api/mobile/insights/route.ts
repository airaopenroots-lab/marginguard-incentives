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
  const atStake = activeDeals.reduce((sum, deal) => sum + Number.parseFloat(deal.requestedValue || "0"), 0);

  return Response.json({
    activeDeals: activeDeals.length,
    approveRate: allDeals.length ? Math.round((approved.length / allDeals.length) * 100) : 0,
    dollarsAtStake: Math.round(atStake * 100) / 100,
    decisions: stats.total,
    accepted: stats.accepted,
    winRate: stats.winRate,
  });
}
