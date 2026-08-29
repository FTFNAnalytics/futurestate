import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const readText = async (...parts) => readFile(join(appRoot, ...parts), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const ledger = await readJson("src", "data", "phase-65-content-expansion.json");
const registry = await readJson("src", "data", "phase-61-project-conversion-registry.json");
const matrix = await readJson("src", "data", "phase-64-conversion-stage-matrix.json");
const researchCollectionFiles = (await readdir(join(appRoot, "src", "content", "research-collections"))).filter((name) => name.endsWith(".json"));
const researchDocumentFiles = (await readdir(join(appRoot, "src", "content", "research-documents"))).filter((name) => name.endsWith(".json"));
const briefingFiles = (await readdir(join(appRoot, "src", "content", "briefings"))).filter((name) => name.endsWith(".mdx"));
const sourceFiles = (await readdir(join(appRoot, "src", "content", "sources"))).filter((name) => name.endsWith(".json"));
const signalFiles = (await readdir(join(appRoot, "src", "content", "signals"))).filter((name) => name.endsWith(".mdx"));
const collections = await Promise.all(researchCollectionFiles.map((name) => readJson("src", "content", "research-collections", name)));
const documents = await Promise.all(researchDocumentFiles.map((name) => readJson("src", "content", "research-documents", name)));
const briefings = await Promise.all(briefingFiles.map(async (name) => ({ name, text: await readText("src", "content", "briefings", name) })));
const signals = await Promise.all(signalFiles.map(async (name) => {
  const text = await readText("src", "content", "signals", name);
  return {
    id: text.match(/^id:\s*"([^"]+)"/m)?.[1],
    status: text.match(/^record_status:\s*"([^"]+)"/m)?.[1]
  };
}));
const sourceIds = new Set((await Promise.all(sourceFiles.map((name) => readJson("src", "content", "sources", name)))).map((source) => source.id));
const collectionById = new Map(collections.map((collection) => [collection.id, collection]));
const documentById = new Map(documents.map((document) => [document.id, document]));
const signalById = new Map(signals.map((signal) => [signal.id, signal]));
const briefingById = new Map(briefings.map((briefing) => [briefing.text.match(/^id:\s*"([^"]+)"/m)?.[1], briefing]));

check(ledger.phase === "65" && ledger.schema_version === "1.0", "The Phase 65 ledger must preserve its stable identity and schema version.");
check(ledger.metrics.primary_records_reviewed === 96, "Phase 65 must review exactly ninety-six primary records.");
check(ledger.metrics.named_file_reporting_packs === 8 && ledger.metrics.undercovered_topic_packs === 8, "Phase 65 must contain eight named-file and eight topic reporting packs.");
check(ledger.metrics.signal_decisions === 48, "Phase 65 must contain forty-eight signal decisions.");
check(ledger.metrics.new_briefings_published === 11, "Phase 65 must publish eleven new briefings.");
check(ledger.metrics.legacy_briefings_dispositioned === 7, "Phase 65 must disposition all seven inherited briefing holds.");
check(ledger.metrics.canonical_named_briefings_deepened === 8 && ledger.metrics.local_systems_deepened === 5 && ledger.metrics.topic_families_deepened === 8, "Phase 65 must deepen eight canonical files, five local systems, and eight topic families.");
check(ledger.metrics.research_collections_added === 3, "Phase 65 must add three research collections.");

const newCollections = ledger.research_collections.map((record) => collectionById.get(record.id));
check(newCollections.every(Boolean), "One or more Phase 65 research collections are missing.");
check(newCollections.every((collection) => collection.record_status === "Published" && collection.document_ids.length === 32), "Each Phase 65 collection must contain thirty-two Published review records.");
const phase65DocumentIds = ledger.research_record_reviews.map((record) => record.id);
check(phase65DocumentIds.length === 96 && new Set(phase65DocumentIds).size === 96, "The Phase 65 research review IDs must be ninety-six and unique.");
check(new Set(ledger.research_record_reviews.map((record) => record.source_document_id)).size === 96, "The Phase 65 review shelf must cover ninety-six unique original research records.");
for (const id of phase65DocumentIds) {
  const document = documentById.get(id);
  check(Boolean(document), `Missing Phase 65 research record ${id}.`);
  check(document?.record_status === "Published", `${id} must be Published.`);
  check(document?.capture_status === "Official link record", `${id} must preserve the official-link capture contract.`);
  check(sourceIds.has(document?.source_id), `${id} references a missing official source.`);
  check(collectionById.get(document?.collection_id)?.document_ids.includes(id), `${id} is not assigned to its Phase 65 collection.`);
  check(document?.evidence_limits?.some((item) => item.includes("does not advance a Phase 64 matrix cell")), `${id} lacks the no-matrix-advance boundary.`);
}

check(ledger.named_file_reporting_packs.every((pack) => pack.documents.length === 8 && pack.phase65_record_ids.length === 8), "Every named file must have an eight-record reporting pack.");
check(ledger.undercovered_topic_packs.every((pack) => pack.documents.length === 4 && pack.phase65_record_ids.length === 4), "Every undercovered topic must have a four-record reporting pack.");
check(new Set(ledger.signal_decisions.map((decision) => decision.signal_id)).size === 48, "Phase 65 signal decisions must cover forty-eight unique signals.");
check(ledger.signal_decisions.filter((decision) => decision.decision === "Reconfirm Published").length === 32, "Phase 65 must reconfirm thirty-two Published signals.");
check(ledger.signal_decisions.filter((decision) => decision.decision === "Retain In Review").length === 16, "Phase 65 must retain sixteen signals In Review.");
for (const decision of ledger.signal_decisions) {
  const signal = signalById.get(decision.signal_id);
  const laterDarpaPromotion = decision.signal_id === "signal-darpa-lift-challenge-2026-scheduled-field-trial"
    && decision.prior_status === "In Review"
    && decision.decision === "Retain In Review"
    && signal?.status === "Published";
  check(Boolean(signal), `Missing Phase 65 signal decision target ${decision.signal_id}.`);
  check(signal?.status === decision.prior_status || laterDarpaPromotion, `${decision.signal_id} changed status despite the no-state-change decision.`);
  check((decision.decision === "Reconfirm Published") === (signal?.status === "Published") || laterDarpaPromotion, `${decision.signal_id} has an incompatible Phase 65 decision.`);
}

for (const id of ledger.briefing_ids) {
  const briefing = briefingById.get(id);
  check(Boolean(briefing), `Missing Phase 65 briefing ${id}.`);
  check(/record_status:\s*"Published"/.test(briefing?.text ?? ""), `${id} must be Published.`);
  check((briefing?.text ?? "").includes("## Interpretation boundary") && (briefing?.text ?? "").includes("## Next records"), `${id} lacks the Phase 65 evidence/open/next structure.`);
}

const legacyExpected = new Map([
  ["briefing-local-watch-001-conversion-gates", "Archived"],
  ["briefing-local-watch-002-corridor-conversion-gates", "Archived"],
  ["briefing-research-watch-002-local-implementation-dossiers", "Archived"],
  ["briefing-stack-watch-001", "Archived"],
  ["briefing-stack-watch-002-federal-research-industrial-capacity", "Published"],
  ["briefing-stack-watch-005-industrial-capacity-local-conversion", "Published"],
  ["briefing-stack-watch-006-thin-topic-conversion", "Archived"]
]);
for (const [id, status] of legacyExpected) {
  const briefing = briefingById.get(id);
  check(Boolean(briefing), `Missing inherited briefing ${id}.`);
  check((briefing?.text ?? "").includes(`record_status: "${status}"`), `${id} must have final disposition ${status}.`);
  check((briefing?.text ?? "").includes("## Phase 65 disposition"), `${id} lacks a visible Phase 65 disposition note.`);
}

const inReviewBriefings = briefings.filter((briefing) => /record_status:\s*"In Review"/.test(briefing.text));
check(inReviewBriefings.length === 0, `Phase 65 must resolve every briefing hold; found ${inReviewBriefings.length}.`);
check(ledger.gap_reconciliation.canonical_records === 16 && ledger.gap_reconciliation.semantic_mismatches_remaining === 0, "Phase 65 must reconcile all sixteen gap records with zero semantic mismatches.");
check(ledger.gap_reconciliation.gap_006_lane === "Local ENSO interpretation", "gap-006 must retain the local ENSO interpretation identity.");
const registryGap006 = registry.gap_operating_register.find((record) => record.gap_id === "gap-006");
check(registryGap006?.lane === "Local ENSO interpretation" && !JSON.stringify(registryGap006).includes("Insurance and risk transfer"), "The Phase 61 operating register still mislabels gap-006.");
check(ledger.content_only_boundary.phase_64_cells_advanced === 0, "Phase 65 must record zero Phase 64 cell advances.");
check(matrix.file_rows.flatMap((row) => row.stage_cells).filter((cell) => cell.cell_state === "Evidence Present").length === 16, "Phase 65 must not change the sixteen Evidence Present cells.");
check(matrix.file_rows.flatMap((row) => row.stage_cells).filter((cell) => cell.cell_state === "Partial / Held").length === 8, "Phase 65 must not change the eight Partial / Held cells.");
check(matrix.file_rows.flatMap((row) => row.stage_cells).filter((cell) => cell.cell_state === "Not Established").length === 40, "Phase 65 must not change the forty Not Established cells.");
check(Object.values(ledger.content_only_boundary).every((value) => value === 0), "Phase 65's content-only boundary must contain only zero state or infrastructure changes.");

if (failures.length) {
  console.error("Phase 65 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 65 assertions passed: 96 unique primary-record reviews, 3 collections, 8 named-file packs, 8 undercovered-topic packs, 48 no-state-change signal decisions (32 Published reconfirmations / 16 In Review retentions), 11 new Published briefings, 7 final legacy dispositions, 0 remaining In Review briefings, gap-006 reconciled, and 0 matrix, schema, export, score, rank, or automation changes.");
