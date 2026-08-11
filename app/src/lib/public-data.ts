import type { CollectionEntry } from "astro:content";

export const PUBLIC_DATA_SCHEMA_VERSION = "1.0";

function isoDate(date: Date | null | undefined): string | null {
  return date ? date.toISOString().slice(0, 10) : null;
}

export function serializePublicSource(source: CollectionEntry<"sources">) {
  const data = source.data;

  return {
    id: data.id,
    name: data.name,
    path: `/atlas/sources/${data.id}/`,
    url: data.url,
    source_type: data.source_type,
    credibility_level: data.credibility_level,
    primary_topics: data.primary_topics,
    framework_layers: data.framework_layers,
    country_or_region: data.country_or_region,
    update_frequency: data.update_frequency,
    capture_priority: data.capture_priority,
    known_limitations: data.known_limitations,
    last_checked_date: isoDate(data.last_checked_date),
    watch_lanes: data.watch_lanes,
    live_access_type: data.live_access_type,
    api_url: data.api_url ?? null,
    feed_url: data.feed_url ?? null,
    data_download_url: data.data_download_url ?? null,
    docket_search_url: data.docket_search_url ?? null,
    release_calendar_url: data.release_calendar_url ?? null,
    review_cadence_days: data.review_cadence_days ?? null,
    monitoring_status: data.monitoring_status,
    coverage_role: data.coverage_role,
    jurisdiction: data.jurisdiction ?? null,
    source_owner: data.source_owner ?? null
  };
}

export function serializePublicTopic(topic: CollectionEntry<"topics">) {
  const data = topic.data;

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    path: `/atlas/topics/${data.slug}/`,
    summary: data.summary,
    framework_layers: data.framework_layers,
    primary_constraints: data.primary_constraints,
    featured_sources: data.featured_sources,
    watch_questions: data.watch_questions
  };
}

export function serializePublicSignal(signal: CollectionEntry<"signals">) {
  const data = signal.data;

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    path: `/signals/${data.slug}/`,
    record_status: data.record_status,
    summary: data.summary,
    source_ids: data.source_ids,
    published_date: isoDate(data.published_date),
    captured_date: isoDate(data.captured_date),
    primary_topic: data.primary_topic,
    framework_layers: data.framework_layers,
    signal_type: data.signal_type,
    maturity_level: data.maturity_level,
    time_horizon: data.time_horizon,
    evidence_quality: data.evidence_quality,
    verification_status: data.verification_status,
    why_it_matters: data.why_it_matters,
    dependencies: data.dependencies,
    constraints: data.constraints,
    receiving_systems: data.receiving_systems,
    local_implications: data.local_implications,
    evidence_gap_ids: data.evidence_gap_ids,
    claim_scope: data.claim_scope,
    local_evidence_level: data.local_evidence_level,
    last_reviewed_date: isoDate(data.last_reviewed_date)
  };
}

export function serializePublicResearchCollection(collection: CollectionEntry<"researchCollections">) {
  const data = collection.data;

  return {
    record_kind: "research_collection",
    id: data.id,
    title: data.title,
    slug: data.slug,
    path: `/research/${data.slug}/`,
    record_status: data.record_status,
    summary: data.summary,
    scope: data.scope,
    captured_date: isoDate(data.captured_date),
    document_ids: data.document_ids,
    download_path: data.download_path,
    download_note: data.download_note,
    method_note: data.method_note
  };
}

export function serializePublicResearchDocument(document: CollectionEntry<"researchDocuments">) {
  const data = document.data;

  return {
    record_kind: "research_document",
    id: data.id,
    collection_id: data.collection_id,
    title: data.title,
    slug: data.slug,
    path: `/research/documents/${data.slug}/`,
    record_status: data.record_status,
    publisher: data.publisher,
    publication_date: isoDate(data.publication_date),
    document_type: data.document_type,
    summary: data.summary,
    key_findings: data.key_findings,
    why_it_matters: data.why_it_matters,
    ftfn_relevance: data.ftfn_relevance,
    evidence_limits: data.evidence_limits,
    primary_topics: data.primary_topics,
    framework_layers: data.framework_layers,
    constraint_tags: data.constraint_tags,
    source_id: data.source_id,
    official_url: data.official_url,
    capture_status: data.capture_status,
    captured_date: isoDate(data.captured_date)
  };
}

export function serializePublicReaderPathway(pathway: CollectionEntry<"readerPathways">) {
  const data = pathway.data;

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    record_status: data.record_status,
    summary: data.summary,
    current_state_summary: data.current_state_summary,
    current_state: data.current_state,
    primary_topics: data.primary_topics,
    topic_ids: data.topic_ids,
    local_system_ids: data.local_system_ids,
    signal_ids: data.signal_ids,
    source_ids: data.source_ids,
    organization_ids: data.organization_ids,
    technology_ids: data.technology_ids,
    briefing_ids: data.briefing_ids,
    dependency_map_ids: data.dependency_map_ids,
    research_collection_ids: data.research_collection_ids,
    evidence_gap_ids: data.evidence_gap_ids,
    dependency_stack: data.dependency_stack,
    evidence_limits: data.evidence_limits,
    next_records: data.next_records
  };
}

export function publicDatasetResponse(
  dataset: "sources" | "topics" | "signals" | "research" | "pathways" | "evidence_queue",
  recordScope: string,
  records: unknown[]
): Response {
  return new Response(
    JSON.stringify(
      {
        schema_version: PUBLIC_DATA_SCHEMA_VERSION,
        dataset,
        record_scope: recordScope,
        count: records.length,
        records
      },
      null,
      2
    ),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }
  );
}
