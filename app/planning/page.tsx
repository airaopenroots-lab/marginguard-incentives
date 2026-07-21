import { fetchSegments, fetchScenarios } from "@/lib/actions";
import PlanningClient from "@/components/PlanningClient";

export default async function PlanningPage() {
  const segments = await fetchSegments();
  const scenarios = await fetchScenarios();

  return (
    <PlanningClient 
      initialSegments={segments as any} 
      initialScenarios={scenarios.map(s => ({
        id: s.id,
        name: s.name,
        config: JSON.parse(s.config || "{}"),
        totalSpend: parseFloat(s.totalSpend || "0"),
        projectedDelta: s.projectedDelta || 0,
        createdAt: s.createdAt
      }))} 
    />
  );
}
