import { fetchInsights } from "@/lib/actions";
import InsightsClient from "@/components/InsightsClient";

export default async function InsightsPage() {
  let insights: any[] = [];
  try {
    insights = await fetchInsights();
  } catch (e) {
    console.error("Insights fetch failed:", e);
  }

  return <InsightsClient initialInsights={insights} />;
}
