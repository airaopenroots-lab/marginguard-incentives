import Link from "next/link";
import { fetchInsights } from "@/lib/actions";
import InsightsClient from "@/components/InsightsClient";

export default async function InsightsPage() {
  const insights = await fetchInsights();

  return <InsightsClient initialInsights={insights} />;
}
