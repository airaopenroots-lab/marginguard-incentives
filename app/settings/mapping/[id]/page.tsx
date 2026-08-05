import { fetchDataSourceById } from "@/lib/actions";
import MappingClient from "@/components/MappingClient";
import { notFound } from "next/navigation";

export default async function MappingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const source = await fetchDataSourceById(id);

  if (!source) {
    notFound();
  }

  return <MappingClient source={source} />;
}
