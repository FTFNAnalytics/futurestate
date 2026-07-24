import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { publicDatasetResponse, serializePublicReaderPathway } from "../../lib/public-data";

export const GET: APIRoute = async () => {
  const pathways = (await getCollection("readerPathways"))
    .filter((pathway) => pathway.data.record_status === "Published")
    .sort((left, right) => left.data.id.localeCompare(right.data.id))
    .map(serializePublicReaderPathway);

  return publicDatasetResponse(
    "pathways",
    "Published reader pathways and their connected signal, source, synthesis, collection, local-system, and evidence-gap metadata.",
    pathways
  );
};
