import { fetchDeals } from "@/lib/actions";
import ApprovalClient from "@/components/ApprovalClient";

export default async function DealApprovalPage() {
  const deals = await fetchDeals();

  return <ApprovalClient initialDeals={deals} />;
}
