import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { publicDatasetResponse, serializePublicSignal } from "../../lib/public-data";

export const GET: APIRoute = async () => {
  const signals = (await getCollection("signals"))
    .filter((signal) => signal.data.record_status === "Published")
    .sort((left, right) => left.data.id.localeCompare(right.data.id))
    .map(serializePublicSignal);

  return publicDatasetResponse(
    "signals",
    "Historical Published signal metadata with current editorial classifications and corrections; method notes and held classifications are not current external developments. Draft/review publication states, body copy and private notes are excluded.",
    signals
  );
};
