import { fetchSegments } from "@/lib/actions";
import PlanningClient from "@/components/PlanningClient";

export default async function PlanningPage() {
  const segments = await fetchSegments();

  return <PlanningClient initialSegments={segments} />;
}
