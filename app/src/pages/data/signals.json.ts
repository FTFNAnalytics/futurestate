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
    "Published signal metadata only; drafts, review records, body copy, and editorial notes are excluded.",
    signals
  );
};
