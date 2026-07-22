import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { publicDatasetResponse, serializePublicTopic } from "../../lib/public-data";

export const GET: APIRoute = async () => {
  const topics = (await getCollection("topics"))
    .sort((left, right) => left.data.name.localeCompare(right.data.name))
    .map(serializePublicTopic);

  return publicDatasetResponse(
    "topics",
    "Public topic taxonomy and watch-question metadata.",
    topics
  );
};
