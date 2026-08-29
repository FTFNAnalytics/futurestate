import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { publicDatasetResponse, serializePublicSource } from "../../lib/public-data";

export const GET: APIRoute = async () => {
  const sources = (await getCollection("sources"))
    .sort((left, right) => left.data.id.localeCompare(right.data.id))
    .map(serializePublicSource);

  return publicDatasetResponse(
    "sources",
    "Active public source metadata; internal notes and automation instructions are excluded.",
    sources
  );
};
