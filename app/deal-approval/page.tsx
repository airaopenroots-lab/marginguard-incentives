import { fetchDeals } from "@/lib/actions";
import ApprovalClient from "@/components/ApprovalClient";

export default async function DealApprovalPage() {
  const deals = await fetchDeals().catch((e) => {
    console.error("Deal approval fetch failed:", e);
    return [];
  });

  return <ApprovalClient initialDeals={deals} />;
}
