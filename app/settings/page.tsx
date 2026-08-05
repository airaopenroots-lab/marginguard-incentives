import { fetchConfig, fetchDataSources } from "@/lib/actions";
import { auth } from "@/lib/auth";
import SettingsClient from "@/components/SettingsClient";

export default async function SettingsPage() {
  let session;
  try {
    session = await auth();
  } catch (e) {
    console.error("Auth failed:", e);
  }
  const role = (session?.user as any)?.role || "OPERATOR";
  
  const config = await fetchConfig();
  let dataSources: any[] = [];
  try {
    dataSources = await fetchDataSources();
  } catch (e) {
    console.error("Settings fetch failed:", e);
  }

  return <SettingsClient initialConfig={config} initialDataSources={dataSources} userRole={role} />;
}
