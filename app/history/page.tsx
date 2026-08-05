import { fetchHistory, fetchStats } from "@/lib/actions";
import HistoryClient from "@/components/HistoryClient";
import { Suspense } from "react";
import HistoryLoading from "./loading";

async function HistoryContent() {
  let history: any[] = [];
  let stats = { accepted: 0, total: 0, winRate: 0 };
  try {
    const [h, s] = await Promise.all([
      fetchHistory(),
      fetchStats()
    ]);
    history = h;
    stats = s;
  } catch (e) {
    console.error("History fetch failed:", e);
  }
  return <HistoryClient initialHistory={history} stats={stats} />;
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<HistoryLoading />}>
      <HistoryContent />
    </Suspense>
  );
}
