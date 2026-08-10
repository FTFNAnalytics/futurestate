import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runPhase57tHarness } from "./phase57t-canonical-delivery-recovery-harness.mjs";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-09";
const collectionSlug = "canonical-verification-endpoints-signed-release-indexes-cache-mirror-recovery-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingSlug = "research-watch-050-canonical-verification-delivery-and-recovery";
const briefingId = `briefing-${briefingSlug}`;
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => `  - ${JSON.stringify(item)}`)].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const name of ["research-documents", "signals", "research-collections", "briefings", "updates"]) await mkdir(join(contentRoot, name), { recursive: true });

const phase57s = JSON.parse(await readFile(join(dataRoot, "phase-57s-reader-verification-freshness-provenance-exports-digest-reconciliation.json"), "utf8"));
const manifests57s = JSON.parse(await readFile(join(dataRoot, "phase-57s-reader-verifiable-lifecycle-manifests.json"), "utf8"));
const freshness57s = JSON.parse(await readFile(join(dataRoot, "phase-57s-status-freshness-stale-view-detection.json"), "utf8"));
const exports57s = JSON.parse(await readFile(join(dataRoot, "phase-57s-provenance-export-digest-reconciliation-fixtures.json"), "utf8"));
if (phase57s.phase !== "57S" || phase57s.records.length !== 45) throw new Error("Phase 57T requires the complete Phase 57S baseline.");
const harness = runPhase57tHarness({ manifestSchemas: manifests57s.schemas, freshnessSchemas: freshness57s.schemas, exportSchemas: exports57s.schemas });
if (harness.endpointCases.length !== 162 || harness.indexCases.length !== 162 || harness.cacheCases.length !== 162 || harness.mirrorCases.length !== 162 || harness.recoveryCases.length !== 180 || harness.allCases.length !== 828 || harness.failures.length) {
  throw new Error("Phase 57T requires 828 passing endpoint, index, cache, mirror, redirect, and recovery cases.");
}

const authorityBoundary = "Agency assertions, regulator evidence, FTFN controls, evidence-review identity, publication-review identity, release identity, publication identity, withdrawal identity, rollback identity, restore identity, republication identity, verification identity, endpoint identity, signing identity, cache identity, mirror identity, recovery identity, GAO acceptance, implementation, capability, closure, attribution, and operating outcomes remain separate evidence states.";
const agencyMeta = {
  DOT: { publisher: "National Railroad Passenger Corporation", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  NTIA: { publisher: "National Telecommunications and Information Administration", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOE: { publisher: "U.S. Department of Energy", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
};
const contracts = {
  "REOPEN-AMTRAK-PIDS": ["amtrak-pids", "Amtrak PIDS closeout", "AMTRAK-PIDS"],
  "REOPEN-AMTRAK-RELIABILITY": ["amtrak-reliability", "Amtrak named-asset reliability", "AMTRAK-RELIABILITY"],
  "REOPEN-LA-NEXTLINK-ADOPTION": ["la-nextlink-adoption", "Louisiana Nextlink adoption", "LA-NEXTLINK"],
  "REOPEN-LA-STARLINK-ADOPTION": ["la-starlink-adoption", "Louisiana Starlink adoption", "LA-STARLINK"],
  "REOPEN-MT-BEAD-QUARTER": ["mt-bead-quarter", "Montana BEAD completed quarter", "MT-BEAD"],
  "REOPEN-HANFORD-MASS-BALANCE": ["hanford-mass-balance", "Hanford complete material balance", "HANFORD"],
  "REOPEN-NNSA-QUALIFIED-RATE": ["nnsa-qualified-rate", "NNSA recurring qualified rate", "NNSA-QUALIFIED"],
  "REOPEN-NNSA-ACCEPTED-CAPACITY": ["nnsa-accepted-capacity", "NNSA accepted operating capacity", "NNSA-ACCEPTED"],
  "REOPEN-NNSA-GAO-BASELINE": ["nnsa-gao-baseline", "NNSA GAO enterprise baseline", "NNSA-GAO"],
};
const held57s = phase57s.records.filter((record) => record.record_status === "In Review");
const published57s = phase57s.records.filter((record) => record.record_status === "Published");
if (held57s.length !== 9 || published57s.length !== 36) throw new Error("Phase 57T must inherit thirty-six controls and exactly nine holds.");
const incrementKey = (key) => key.replace(/-(\d{2})$/, (_, value) => `-${String(Number(value) + 1).padStart(2, "0")}`);

const controlTypes = [
  {
    suffix: "canonical-reader-verification-endpoint", action: "CANONICAL-READER-VERIFICATION-ENDPOINT", stage: "Canonical reader-verification endpoint controls",
    title: (label) => `${label} receives a stable canonical verification endpoint contract`,
    finding: "A stable HTTPS verification URI resolves only to the exact current lifecycle-manifest digest, provenance-export digest, signed release-index digest, representation digest, and matching entity tag.",
    denominator: "One contract-specific endpoint schema, eighteen adversarial cases, six bounded valid routes, twelve explicit rejections, and zero actual verification endpoints published.",
    limits: ["A URI resolution proves delivery integrity, not claim truth.", "Query, fragment, alias, method, media-type, digest, and representation drift fail closed.", "Endpoint resolution cannot publish, restore, create evidence, or change claim state."],
    next: (label) => `Expose a ${label} verification URI only after it binds the exact current manifest, export, and signed release index.`, registry: "phase-57t-canonical-reader-verification-endpoints.json",
  },
  {
    suffix: "signed-release-index-chain", action: "SIGNED-RELEASE-INDEX-CHAIN", stage: "Signed release-index chain controls",
    title: (label) => `${label} receives an append-only signed release-index chain`,
    finding: "Each release index binds the canonical verification URI, current manifest and export digests, release sequence, prior index digest, signing-key identity, index digest, and detached signature without erasing earlier indexes.",
    denominator: "One contract-specific signed-index schema, eighteen adversarial cases, six valid or preservation routes, twelve explicit rejections, and zero production indexes signed.",
    limits: ["Fixture signatures are nonproduction controls and do not represent a released artifact.", "Missing, unauthorized, mismatched, regressive, substituted, or erasing indexes reject.", "A valid signature establishes integrity and signer-key binding, not evidence truth or acceptance."],
    next: (label) => `Append the next ${label} release index only with a separately governed signing identity and an intact prior-index digest.`, registry: "phase-57t-signed-release-indexes.json",
  },
  {
    suffix: "cache-coherence-receipt-fail-closed", action: "CACHE-COHERENCE-RECEIPT-FAIL-CLOSED", stage: "Cache-coherence receipt and fail-closed controls",
    title: (label) => `${label} receives digest-bound cache-coherence receipts`,
    finding: "A cached verification representation remains usable only when its canonical URI, release-index digest, entity tag, representation digest, manifest digest, export digest, and revalidation time match the current endpoint.",
    denominator: "One contract-specific cache schema, eighteen adversarial cases, five bounded valid routes, thirteen fail-closed rejections, and zero actual cache-coherence receipts issued.",
    limits: ["Serve-stale-on-error and warning-only mismatch behavior are prohibited.", "Age-window, revalidation, partition, transform, entity-tag, manifest, export, and index drift fail closed.", "Cache validation cannot create evidence, publish a claim, or change an inherited hold."],
    next: (label) => `Fail every cached ${label} representation closed until all seven coherence comparisons revalidate.`, registry: "phase-57t-cache-coherence-receipts.json",
  },
  {
    suffix: "mirror-redirect-integrity-control", action: "MIRROR-REDIRECT-INTEGRITY-CONTROL", stage: "Mirror and redirect integrity controls",
    title: (label) => `${label} receives mirror and redirect integrity enforcement`,
    finding: "Mirrors must preserve the exact representation and release-index digests, declare the canonical URI, enforce transport security, and use a single permanent redirect with no downgrade, query injection, fragment injection, loop, or transform.",
    denominator: "One contract-specific mirror and redirect schema, eighteen adversarial cases, five bounded valid routes, thirteen explicit rejections, and zero actual mirror or redirect events recorded.",
    limits: ["A mirror never becomes the lifecycle source-of-truth.", "Digest drift, canonical-header drift, target drift, loops, temporary redirects, downgrade, injection, and transforms reject.", "Mirror or redirect integrity cannot publish, accept, restore, implement, close, or create evidence."],
    next: (label) => `Permit a ${label} mirror or redirect only when it preserves the exact canonical representation and index chain.`, registry: "phase-57t-mirror-redirect-integrity.json",
  },
  {
    suffix: "immutable-history-recovery-drill", action: "IMMUTABLE-HISTORY-RECOVERY-DRILL", stage: "Immutable-history recovery-drill controls",
    title: (label) => `${label} receives a bounded immutable-history recovery drill`,
    finding: "Recovery reconstructs reader state only from complete immutable lifecycle history, notices, the controlling manifest, provenance export, and signed release index, then appends a nonactivating receipt without rewriting or automatically displaying anything.",
    denominator: "One contract-specific recovery schema, twenty adversarial cases, six valid reconstruction routes, fourteen explicit rejections, and zero actual recovery drills or reader-state changes executed.",
    limits: ["A drill proves deterministic reconstruction under fixture conditions, not service continuity or claim truth.", "Missing, mutable, mismatched, substituted, rewriting, activating, publishing, or closing recovery attempts reject.", "Recovery cannot bypass human publication authority or convert reconstructed state into evidence."],
    next: (label) => `Run a ${label} recovery only against immutable source history and keep the reconstructed state inactive until separate human verification.`, registry: "phase-57t-recovery-drill-fixtures.json",
  },
];

const records = [];
let documentNumber = 1153;
for (const priorHold of held57s) {
  const [shortSlug, label, prefix] = contracts[priorHold.reopening_contract_id] ?? [];
  const meta = agencyMeta[priorHold.agency];
  const sourceRecord = published57s.find((record) => record.action_key.startsWith(prefix));
  if (!shortSlug || !meta || !sourceRecord) throw new Error(`Incomplete Phase 57T metadata for ${priorHold.reopening_contract_id}`);
  for (const control of controlTypes) {
    const slug = `57t-${shortSlug}-${control.suffix}`;
    records.push({ record_id: `record-${slug}`, document_id: `research-doc-${slug}`, signal_id: `signal-${slug}`, document_number: documentNumber++, record_status: "Published", agency: priorHold.agency,
      action_key: `${prefix}-${control.action}-2026-01`, parent_hold_key: null, reopening_contract_id: null, evidence_stage: control.stage, title: control.title(label), finding: control.finding,
      denominator: control.denominator, evidence_limits: control.limits, next_action: control.next(label), structured_registry_file: control.registry, source_id: sourceRecord.source_id,
      supporting_source_ids: sourceRecord.supporting_source_ids, official_url: sourceRecord.official_url, publication_date: capturedDate, document_type: "Data Release", authority_boundary: authorityBoundary,
      meta: { ...meta, shortSlug, label, prefix } });
  }
}
for (const priorHold of held57s) {
  const [shortSlug, label, prefix] = contracts[priorHold.reopening_contract_id];
  const meta = { ...agencyMeta[priorHold.agency], shortSlug, label, prefix };
  const slug = `57t-preserved-${shortSlug}`;
  records.push({ ...priorHold, record_id: `record-${slug}`, document_id: `research-doc-${slug}`, signal_id: `signal-${slug}`, document_number: documentNumber++, record_status: "In Review",
    action_key: incrementKey(priorHold.action_key), parent_hold_key: priorHold.action_key, evidence_stage: "Canonical delivery, cache integrity, mirror integrity, and recovery hold",
    title: `${label} remains In Review after canonical delivery and recovery execution`,
    finding: "Ninety-two fixture-only cases pass, but no actual endpoint, signed index, cache receipt, mirror event, redirect event, recovery drill, target packet, or evidence event exists.",
    denominator: "One inherited hold, eighteen endpoint cases, eighteen signed-index cases, eighteen cache cases, eighteen mirror and redirect cases, twenty recovery cases, and zero actual workflow or evidence events.",
    evidence_limits: ["Synthetic endpoints, signatures, cache receipts, mirrors, redirects, replays, and drills are not publication history or evidence.", "No fixture creates a live endpoint, signed release, cache receipt, mirror event, reader-state change, trigger, publication, or closure.", "The inherited hold cannot close or publish automatically."],
    structured_registry_file: "phase-57t-canonical-delivery-recovery-harness-results.json", publication_date: capturedDate, authority_boundary: authorityBoundary, meta });
}
if (records.length !== 54 || documentNumber !== 1207) throw new Error("Phase 57T document numbering must span 1153 through 1206.");
const published = records.filter((record) => record.record_status === "Published");
const held = records.filter((record) => record.record_status === "In Review");
const carriedSources = [...new Set(published.flatMap((record) => record.supporting_source_ids))];
if (published.length !== 45 || held.length !== 9 || carriedSources.length !== 36) throw new Error("Phase 57T requires 45 Published controls, 9 holds, and 36 carried Tier 1 sources.");

const registries = [
  ["phase-57t-canonical-reader-verification-endpoints.json", { phase: "57T", captured_date: capturedDate, registry_type: "Canonical reader-verification endpoints and exact current-bundle resolution", schema_count: 9, case_count: 162, valid_routes: 54, rejected_routes: 108, passed_case_count: 162, failed_case_count: 0, actual_endpoints_published: 0, rule: "A stable canonical HTTPS URI resolves only to the exact current manifest, export, signed-index, representation, and entity-tag digests; every divergence fails closed.", schemas: harness.endpointSchemas, case_distribution: harness.distributions.endpoint, cases: harness.endpointCases }],
  ["phase-57t-signed-release-indexes.json", { phase: "57T", captured_date: capturedDate, registry_type: "Signed append-only release indexes and prior-index chaining", schema_count: 9, case_count: 162, valid_or_preservation_routes: 54, rejected_routes: 108, passed_case_count: 162, failed_case_count: 0, actual_release_indexes_signed: 0, prior_indexes_rewritten: 0, rule: "Each index binds the current verification bundle and prior index digest under a separately identified signing key; missing, mismatched, regressive, substituted, or erasing indexes reject.", schemas: harness.indexSchemas, case_distribution: harness.distributions.index, cases: harness.indexCases }],
  ["phase-57t-cache-coherence-receipts.json", { phase: "57T", captured_date: capturedDate, registry_type: "Cache-coherence receipts, exact revalidation, and stale-state fail-closed controls", schema_count: 9, case_count: 162, valid_routes: 45, rejected_stale_or_incoherent_routes: 117, passed_case_count: 162, failed_case_count: 0, actual_cache_receipts_created: 0, serve_stale_on_error_allowed: false, rule: "Cached verification state is usable only after exact URI, index, entity-tag, representation, manifest, export, and time coherence checks; every mismatch fails closed.", schemas: harness.cacheSchemas, case_distribution: harness.distributions.cache, cases: harness.cacheCases }],
  ["phase-57t-mirror-redirect-integrity.json", { phase: "57T", captured_date: capturedDate, registry_type: "Mirror representation, canonical header, transport, and redirect integrity controls", schema_count: 9, case_count: 162, valid_routes: 45, rejected_routes: 117, passed_case_count: 162, failed_case_count: 0, actual_mirror_or_redirect_events: 0, rule: "A mirror preserves exact representation and index digests and any redirect is one-hop, permanent, HTTPS, canonical, and free of injection, loops, or transforms.", schemas: harness.mirrorSchemas, case_distribution: harness.distributions.mirror, cases: harness.mirrorCases }],
  ["phase-57t-recovery-drill-fixtures.json", { phase: "57T", captured_date: capturedDate, registry_type: "Immutable-source recovery reconstruction and nonactivating append-only receipts", schema_count: 9, case_count: 180, valid_or_preservation_routes: 54, rejected_routes: 126, passed_case_count: 180, failed_case_count: 0, actual_recovery_drills_executed: 0, actual_reader_state_changes: 0, rule: "Recovery reconstructs reader state only from complete immutable history, notices, manifest, export, and signed index, appends a receipt, and never rewrites or activates state automatically.", schemas: harness.recoverySchemas, case_distribution: harness.distributions.recovery, cases: harness.recoveryCases }],
];
for (const [file, data] of registries) await writeJson(join(dataRoot, file), data);
await writeJson(join(dataRoot, "phase-57t-canonical-delivery-recovery-harness-results.json"), { phase: "57T", captured_date: capturedDate, total_case_count: 828, passed_case_count: 828, failed_case_count: 0,
  endpoint_case_count: 162, index_case_count: 162, cache_case_count: 162, mirror_case_count: 162, recovery_case_count: 180, test_ids: harness.allCases.map((row) => row.test_id), actual_endpoints_published: 0,
  actual_release_indexes_signed: 0, actual_cache_receipts_created: 0, actual_mirror_or_redirect_events: 0, actual_recovery_drills_executed: 0, actual_reader_state_changes: 0,
  evidence_records_created: 0, reopening_triggers_fired: 0, automated_closures_or_publications: 0, prior_artifact_rewrites: 0 });

const mainLedger = { phase: "57T", captured_date: capturedDate,
  goal: "Make reader-verification bundles canonically resolvable, signed, cache-coherent, mirror-safe, redirect-safe, and recoverable from immutable source history while every mismatch fails closed.",
  publication_rule: "Publish forty-five contract-specific endpoint, index, cache, mirror, redirect, and recovery controls; retain all nine inherited outcome records In Review.", authority_rule: authorityBoundary,
  records_reviewed: 54, records_published: 45, records_held: 9,
  evidence_stage_counts: Object.fromEntries([...controlTypes.map((control) => [control.stage, 9]), ["Canonical delivery, cache integrity, mirror integrity, and recovery hold", 9]]),
  new_official_source_profiles: 0, carried_official_source_profiles: 36, structured_rails: 5, canonical_endpoint_schemas: 9, signed_release_index_schemas: 9, cache_coherence_schemas: 9,
  mirror_redirect_integrity_schemas: 9, recovery_drill_schemas: 9, total_contract_specific_schemas: 45,
  canonical_endpoint_cases: 162, signed_release_index_cases: 162, cache_coherence_cases: 162, mirror_redirect_cases: 162, recovery_drill_cases: 180,
  valid_endpoint_routes: 54, rejected_endpoint_routes: 108, valid_index_routes: 54, rejected_index_routes: 108, valid_cache_routes: 45, rejected_cache_routes: 117,
  valid_mirror_routes: 45, rejected_mirror_routes: 117, valid_recovery_routes: 54, rejected_recovery_routes: 126, total_workflow_cases: 828, workflow_test_failures: 0,
  actual_endpoints_published: 0, actual_release_indexes_signed: 0, actual_cache_receipts_created: 0, actual_mirror_or_redirect_events: 0, actual_recovery_drills_executed: 0,
  actual_reader_state_changes: 0, eligible_records_accepted: 0, exact_target_artifacts_acquired: 0, exact_target_trigger_events: 0, public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: 0, implementation_changes: 0, capability_changes: 0, closure_changes: 0, attribution_changes: 0, operating_outcome_changes: 0, inherited_entity_ledger_closure_changes: 0,
  prior_visible_scope: { sources: 715, signals: 1037, published: 804, in_review: 233, research_collections: 54, research_documents: 1153, briefings: 57, updates: 73, research_export_records: 993 },
  post_batch_visible_scope: { sources: 715, signals: 1091, published: 849, in_review: 242, research_collections: 55, research_documents: 1207, briefings: 58, updates: 74, research_export_records: 1039 },
  post_batch_closure_counts: { Closed: 1, "Partially Closed": 21, Open: 2 }, preserved_phase57s_holds: held57s.map((record) => record.action_key), reopening_contract_ids: held57s.map((record) => record.reopening_contract_id), new_visible_holds: [],
  records: records.map(({ meta, ...record }) => record) };
await writeJson(join(dataRoot, "phase-57t-canonical-endpoints-signed-indexes-cache-mirror-recovery.json"), mainLedger);
await writeJson(join(dataRoot, "phase-57t-publication-review.json"), { phase: "57T", captured_date: capturedDate, promoted_document_ids: published.map((record) => record.document_id), promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id), held_signal_ids: held.map((record) => record.signal_id), inherited_hold_lineage: held.map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key, reopening_contract_id: record.reopening_contract_id })),
  endpoint_schemas_created: 9, signed_index_schemas_created: 9, cache_schemas_created: 9, mirror_schemas_created: 9, recovery_schemas_created: 9,
  endpoint_cases_executed: 162, signed_index_cases_executed: 162, cache_cases_executed: 162, mirror_cases_executed: 162, recovery_cases_executed: 180, total_workflow_cases_executed: 828,
  actual_endpoints_published: 0, actual_release_indexes_signed: 0, actual_cache_receipts_created: 0, actual_mirror_or_redirect_events: 0, actual_recovery_drills_executed: 0, actual_reader_state_changes: 0,
  decision: "Forty-five canonical-delivery, signed-index, cache, mirror, redirect, and recovery controls publish. All nine inherited holds remain In Review; every case is synthetic and no endpoint, signature, cache receipt, mirror event, recovery drill, reader-state change, evidence, trigger, publication, or closure event is recorded." });

const signalMdx = (record) => `---
id: ${JSON.stringify(record.signal_id)}
title: ${JSON.stringify(record.title)}
slug: ${JSON.stringify(record.signal_id.replace(/^signal-/, ""))}
record_status: ${JSON.stringify(record.record_status)}
summary: ${JSON.stringify(record.finding)}
${yamlList("source_ids", record.supporting_source_ids)}
published_date: ${capturedDate}
captured_date: ${capturedDate}
primary_topic: ${JSON.stringify(record.meta.topics[0])}
${yamlList("framework_layers", record.meta.layers)}
signal_type: "Research Result"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: "Official Data"
verification_status: "Verified Against Primary Source"
why_it_matters: ${JSON.stringify(`Evidence stage: ${record.evidence_stage}. Denominator: ${record.denominator}`)}
${yamlList("dependencies", ["complete immutable lifecycle and notice history", "current Phase 57S manifest and provenance-export digests", "append-only signed release-index chain", "exact cache and representation coherence", "canonical mirror and redirect integrity", "immutable-source recovery reconstruction"])}
${yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"])}
${yamlList("receiving_systems", ["Phase 57T canonical verification delivery, cache integrity, mirror integrity, and recovery controls"])}
${yamlList("local_implications", ["Do not convert a synthetic endpoint, signature, cache receipt, mirror, redirect, replay, recovery receipt, or drill into evidence, eligibility, implementation, capability, closure, attribution, or operating outcomes."])}
${yamlList("evidence_gap_ids", record.meta.gaps)}
claim_scope: "Specific Source Update"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57T canonical-delivery and fail-closed recovery contract." : `Held under ${record.reopening_contract_id}; no actual Phase 57T endpoint, signature, cache, mirror, redirect, or recovery event exists.`)}
---

## Phase 57T canonical delivery and recovery control

${record.finding}

## Evidence stage and denominator

**${record.evidence_stage}.** ${record.denominator}

Structured registry: ${record.structured_registry_file}.
${record.reopening_contract_id ? `\nReopening contract: ${record.reopening_contract_id}. Trigger state: **not fired**.\n` : ""}
## Evidence boundaries

${record.evidence_limits.map((limit) => `- ${limit}`).join("\n")}

Actual endpoints, signatures, cache receipts, mirrors, redirects, recovery drills, reader-state changes, triggers, publications, and closures: **Zero**. FTFN submitted no agency contact or FOIA request.

Next action: ${record.next_action}

## Authority boundary

${authorityBoundary}
`;

for (let index = 0; index < records.length; index += 1) {
  const record = records[index];
  const slug = record.signal_id.replace(/^signal-/, "");
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signalMdx(record), "utf8");
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-${slug}.json`), { id: record.document_id, collection_id: collectionId, title: record.title, slug, record_status: record.record_status,
    publisher: record.meta.publisher, publication_date: capturedDate, document_type: record.document_type, summary: `${record.finding} Denominator: ${record.denominator}`,
    key_findings: [`Evidence stage: ${record.evidence_stage}.`, `Finding: ${record.finding}`, `Denominator: ${record.denominator}`, ...record.evidence_limits.map((limit) => `Boundary: ${limit}`), `Next action: ${record.next_action}`],
    why_it_matters: "The record makes canonical delivery, signed release lineage, cache coherence, mirror and redirect integrity, and immutable-source recovery independently auditable without creating an editorial event or changing evidence state.",
    ftfn_relevance: ["Binds stable reader-verification URIs to the exact current Phase 57S manifest and export.", "Fails stale caches, transformed mirrors, and unsafe redirects closed.", "Reconstructs reader state only from immutable history under a nonactivating recovery receipt."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: record.meta.topics, framework_layers: record.meta.layers, constraint_tags: ["Data Quality", "Regulation", "Public Trust"], source_id: record.source_id, supporting_source_ids: record.supporting_source_ids,
    supporting_official_urls: [record.official_url], official_url: record.official_url, local_capture_path: `/downloads/${collectionSlug}/official-links/${String(index + 1).padStart(2, "0")}-phase57t-record.txt`,
    archive_member: `official-links/${String(index + 1).padStart(2, "0")}-phase57t-record.txt`, capture_status: "Official link record", captured_date: capturedDate });
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), { id: collectionId, title: "Canonical Verification Endpoints, Signed Release Indexes, Cache Integrity, and Recovery, 2026", slug: collectionSlug, record_status: "Published",
  summary: "Phase 57T executes 828 synthetic canonical-endpoint, signed-index, cache-coherence, mirror, redirect, and immutable-source recovery cases across nine contracts while preserving every inherited hold and failing every delivery mismatch closed.",
  scope: "Nine endpoint schemas, nine signed-index schemas, nine cache schemas, nine mirror and redirect schemas, nine recovery schemas, 828 cases, forty-five Published controls, nine preserved holds, and zero actual delivery, signing, cache, mirror, redirect, recovery, or reader-state events.",
  captured_date: capturedDate, document_ids: records.map((record) => record.document_id), download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The fifty-seven-file archive contains fifty-four official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Every endpoint, signature, cache receipt, mirror, redirect, replay, recovery receipt, and drill is synthetic. Canonical delivery remains subordinate to complete immutable history; mismatches fail closed; recovery never rewrites or activates reader state automatically." });

const briefing = `---
id: ${JSON.stringify(briefingId)}
title: "Research Watch 050: Canonical Verification Delivery and Recovery"
slug: ${JSON.stringify(briefingSlug)}
record_status: "Published"
summary: "Phase 57T passes 828 synthetic endpoint, signed-index, cache, mirror, redirect, and recovery cases while preserving all nine holds and keeping every actual delivery, signing, replay, reader-state, trigger, and evidence-event count at zero."
published_date: ${capturedDate}
captured_date: ${capturedDate}
${yamlList("signal_ids", records.map((record) => record.signal_id))}
${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
${yamlList("top_takeaways", ["Nine stable endpoint schemas bind exact current manifests, exports, indexes, representations, and entity tags.", "Nine signed-index chains preserve prior verification bundles under explicit signing-key identity.", "Cache, mirror, and redirect controls fail stale, transformed, downgraded, injected, looped, or incoherent representations closed.", "Nine recovery schemas reconstruct inactive reader state only from immutable source history; forty-five controls publish and all nine holds remain In Review."])}
${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}
${yamlList("what_to_watch_next", ["One production canonical verification URI with externally governed signing-key custody", "One production cache mismatch that fails closed and emits a bounded receipt", "One independently checked mirror or permanent redirect against the canonical representation", "One scheduled recovery drill that reconstructs but does not activate reader state"])}
---

## What Phase 57T proves

Reader-verification bundles can be specified through stable canonical URIs, append-only signed indexes, exact cache and mirror coherence, safe redirects, and deterministic immutable-source recovery while every mismatch fails closed.

## What did not move

No synthetic endpoint, signature, cache receipt, mirror, redirect, replay, recovery receipt, or drill is an actual editorial or infrastructure event. No reader state activates, no trigger or hold closes, and every inherited hold remains In Review.

## Evidence boundary

The entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57T records no agency contact, FOIA request, directive-scope change, implementation change, capability change, closure change, attribution change, or operating-outcome change.
`;
await writeFile(join(contentRoot, "briefings", `${briefingSlug}.mdx`), briefing, "utf8");
await writeJson(join(contentRoot, "updates", "2026-08-09-phase-57t-canonical-verification-delivery-recovery.json"), { id: "update-2026-08-09-phase-57t-canonical-verification-delivery-recovery", effective_date: capturedDate, entry_type: "Research Collection",
  title: "Phase 57T makes reader verification canonically deliverable, cache-safe, mirror-safe, and recoverable", summary: "Thirty-six carried Tier 1 sources support forty-five Published controls, nine preserved holds, forty-five schemas, 828 executable cases, stable endpoint contracts, signed release-index chains, strict cache coherence, mirror and redirect integrity, and immutable-source recovery drills.",
  affected_record_ids: [collectionId, briefingId, ...records.map((record) => record.signal_id)], related_paths: [`/research/${collectionSlug}/`, `/briefings/${briefingSlug}/`, ...records.map((record) => `/signals/${record.signal_id.replace(/^signal-/, "")}/`)],
  evidence_note: "Synthetic endpoints, signatures, caches, mirrors, redirects, replays, receipts, and recovery drills remain separate from source evidence, reviewer identity, acceptance, implementation, capability, closure, attribution, and operating outcomes.",
  work_package: "docs/work-packages/phase-57t-canonical-verification-endpoints-signed-indexes-cache-mirror-recovery.md" });

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const path = join(contentRoot, "topics", file); const topic = JSON.parse(await readFile(path, "utf8"));
  topic.watch_questions = appendUnique(topic.watch_questions, ["Which real Phase 57T canonical endpoint first binds the current verification bundle to a governed signature, fails stale caches or mirrors closed, and supports an immutable-source recovery drill without activating reader state?"]);
  await writeJson(path, topic);
}
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const path = join(contentRoot, "reader-pathways", file); const pathway = JSON.parse(await readFile(path, "utf8"));
  pathway.research_collection_ids = appendUnique(pathway.research_collection_ids, [collectionId]);
  pathway.dependency_stack = [...pathway.dependency_stack.filter((item) => item.stage !== "Phase 57T canonical verification delivery and recovery"), { stage: "Phase 57T canonical verification delivery and recovery",
    current_state: "Nine endpoint, nine signed-index, nine cache, nine mirror and redirect, and nine recovery schemas pass 828 cases; zero actual endpoints, signatures, cache receipts, mirror events, recovery drills, reader-state changes, triggers, publications, or closures are recorded.",
    boundary: "Canonical delivery, signatures, cache checks, mirrors, redirects, and recovery are integrity controls, not evidence, acceptance, implementation, capability, closure, attribution, or operating outcomes." }];
  await writeJson(path, pathway);
}
const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = JSON.parse(await readFile(mapPath, "utf8"));
map.nodes = [...map.nodes.filter((node) => node.id !== "node-phase57t-canonical-delivery-recovery"), { id: "node-phase57t-canonical-delivery-recovery", label: "Nine canonical endpoints; signed indexes; cache and mirror integrity; immutable recovery; zero actual events", node_type: "Signal", note: "Stable URIs bind exact verification bundles, stale delivery fails closed, and recovery reconstructs inactive reader state only from immutable history." }];
map.links = [...map.links.filter((link) => link.from !== "node-phase57t-canonical-delivery-recovery"),
  { from: "node-phase57t-canonical-delivery-recovery", to: "node-phase57s-reader-verification-freshness", relationship: "Depends On", confidence: "Supported", note: "Phase 57T delivers and reconstructs only the complete manifest, freshness, export, and reconciliation state established by Phase 57S." },
  { from: "node-phase57t-canonical-delivery-recovery", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Canonical transport and recovery cannot cure an incompatible identity, definition, unit, method, denominator, period, privacy, authority, or acceptance boundary." },
  { from: "node-phase57t-canonical-delivery-recovery", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Endpoint, signature, cache, mirror, redirect, and recovery integrity do not establish implementation, capability, closure, operating outcomes, attribution, or causation." }];
await writeJson(mapPath, map);

console.log(`Generated Phase 57T: ${records.length} records (${published.length} Published, ${held.length} In Review), 45 schemas, 828 cases, 36 carried Tier 1 sources, Research Watch 050, one collection, one update, and integration across five topics, three pathways, and one dependency map.`);
