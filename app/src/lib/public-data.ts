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

export function publicDatasetResponse(
  dataset: "sources" | "topics" | "signals",
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
