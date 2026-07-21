import { fetchConfig, fetchDataSources } from "@/lib/actions";
import SettingsClient from "@/components/SettingsClient";

export default async function SettingsPage() {
  const config = await fetchConfig();
  const dataSources = await fetchDataSources();

  return (
    <SettingsClient 
      initialConfig={config} 
      initialDataSources={dataSources.map(d => ({
        id: d.id,
        name: d.name,
        status: d.status,
        lastSync: d.lastSync?.toLocaleString() || "Never"
      }))} 
    />
  );
}
