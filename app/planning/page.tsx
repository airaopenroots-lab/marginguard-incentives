import { fetchSegments, fetchScenarios } from "@/lib/actions";
import { auth } from "@/lib/auth";
import PlanningClient from "@/components/PlanningClient";

export default async function PlanningPage() {
  let session;
  try {
    session = await auth();
  } catch (e) {
    console.error("Auth failed:", e);
  }
  const role = (session?.user as any)?.role || "OPERATOR";
  
  let segments: any[] = [];
  let scenarios: any[] = [];
  try {
    [segments, scenarios] = await Promise.all([
      fetchSegments(),
      fetchScenarios()
    ]);
  } catch (e) {
    console.error("Planning fetch failed:", e);
  }

  return <PlanningClient initialSegments={segments} initialScenarios={scenarios} userRole={role} />;
}
