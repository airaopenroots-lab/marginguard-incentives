import { fetchHistory, fetchStats } from "@/lib/actions";
import HistoryClient from "@/components/HistoryClient";

export default async function HistoryPage() {
  const history = await fetchHistory();
  const stats = await fetchStats();

  return <HistoryClient initialHistory={history} stats={stats} />;
}
