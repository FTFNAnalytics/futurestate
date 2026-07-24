import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import {
  publicDatasetResponse,
  serializePublicResearchCollection,
  serializePublicResearchDocument
} from "../../lib/public-data";

export const GET: APIRoute = async () => {
  const collections = (await getCollection("researchCollections"))
    .filter((collection) => collection.data.record_status === "Published")
    .sort((left, right) => left.data.id.localeCompare(right.data.id))
    .map(serializePublicResearchCollection);
  const documents = (await getCollection("researchDocuments"))
    .filter((document) => document.data.record_status === "Published")
    .sort((left, right) => left.data.id.localeCompare(right.data.id))
    .map(serializePublicResearchDocument);

  return publicDatasetResponse(
    "research",
    "Published research collection and document metadata, summaries, evidence limits, source links, and capture status.",
    [...collections, ...documents]
  );
};
