import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const json = async (name) => JSON.parse(await readFile(join(root, "src", "data", name), "utf8"));
const [p161, p177, p178] = await Promise.all([json("phase-161-stack-watch.json"), json("phase-177-october-stack-watch-and-source-currency-sweep.json"), json("phase-178-systems-atlas-and-compendium-depth-expansion.json")]);
const source177Ids = [
  "source-177-eia-steo-august-2026", "source-177-nist-chips-rd-awards-august-2026", "source-177-usbr-yakima-water-forecast-august-2026",
  "source-177-faa-hybrid-electric-demonstration-august-2026", "source-177-nasa-dss23-goldstone-august-2026",
  "source-177-doe-critical-minerals-battery-projects-august-2026", "source-177-noaa-us-climate-july-2026", "source-177-nist-tevv-athlon-august-2026",
];
const sources177 = await Promise.all(source177Ids.map(async (id) => JSON.parse(await readFile(join(root, "src", "content", "sources", `${id}.json`), "utf8"))));
const sourceById = new Map(sources177.map((source) => [source.id, source]));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const unique = (items) => new Set(items).size === items.length;
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const octoberRecheckByLane = {
  "Power and grid": "2026-10-05",
  "Chips and compute": "2026-10-07",
  Water: "2026-10-09",
  "Mobility and aviation": "2026-10-12",
  Space: "2026-10-14",
  "Critical minerals and manufacturing": "2026-10-16",
  "Climate and energy": "2026-10-20",
  "AI, quantum, cyber and human futures": "2026-10-23",
};
const expectedAdditionMetadata = {
  "source-177-eia-steo-august-2026": {
    artifact_date: "2026-08-11", data_through: "Forecast completed 2026-08-06; forecast horizon through 2027", evidence_type: "Monthly federal energy forecast and revision record",
    next_terms: ["September 9, 2026", "Texas 2027", "forecast-completion date", "forecast-versus-observation"],
  },
  "source-177-nist-chips-rd-awards-august-2026": {
    artifact_date: "2026-08-06", data_through: "Registry state updated 2026-08-06, including three named $100 million direct-funding awards", evidence_type: "Federal semiconductor R&D award registry",
    next_terms: ["Applied Materials", "Arizona State University", "Absolics", "identity-specific dated delta"],
  },
  "source-177-usbr-yakima-water-forecast-august-2026": {
    artifact_date: "2026-08-06", data_through: "Hydrologic inputs through 2026-08-01; entitlement projection covers 2026-07 through 2026-09", evidence_type: "Monthly federal basin water-supply forecast",
    next_terms: ["September 2026 Yakima", "hydrologic input date", "senior- and junior-entitlement", "final delivered-volume"],
  },
  "source-177-faa-hybrid-electric-demonstration-august-2026": {
    artifact_date: "2026-08-18", data_through: "Mid-Atlantic eIPP demonstration flights reported 2026-08-18; additional demonstrations described as planned through 2026", evidence_type: "Federal advanced-air-mobility demonstration notice",
    next_terms: ["eVTOL Integration Pilot Program", "aircraft", "completed flight count", "certification"],
  },
  "source-177-nasa-dss23-goldstone-august-2026": {
    artifact_date: "2026-08-25", data_through: "May-July 2026 testing and named mission communications from the 2026-08-03 operating start through the 2026-08-25 release", evidence_type: "Federal deep-space communications operating-milestone release",
    next_terms: ["DSS-23", "post-August 3", "communication passes", "antenna-level recurring performance"],
  },
  "source-177-doe-critical-minerals-battery-projects-august-2026": {
    artifact_date: "2026-08-20", data_through: "Seven project selections announced 2026-08-20 under the third funding round of two named battery programs", evidence_type: "Federal project-selection announcement",
    next_terms: ["each of the seven named projects", "final assistance agreement", "obligation", "accepted operating capacity"],
  },
  "source-177-noaa-us-climate-july-2026": {
    artifact_date: "2026-08-12", data_through: "July 2026 observations; article published 2026-08-10 and corrected 2026-08-12", evidence_type: "Federal monthly observed climate assessment",
    next_terms: ["September 2026 U.S. Climate Report", "temperature and precipitation", "comparison baseline", "adaptation performance"],
  },
  "source-177-nist-tevv-athlon-august-2026": {
    artifact_date: "2026-08-07", data_through: "Initial public draft announced 2026-08-07; public-comment period scheduled through 2026-10-06", evidence_type: "Federal initial public draft standards framework",
    next_terms: ["October 6 comment deadline", "NIST AI 200-2", "document version", "system-specific safety"],
  },
};
check(p177.packets.length === 32 && p177.counts.packets === 32, "Phase 177 requires 32 packets.");
const refs = p177.packets.filter((p) => p.packet_kind === "Phase 161 packet reference");
const additions = p177.packets.filter((p) => p.packet_kind === "New prepared official-source packet");
check(refs.length === 24 && additions.length === 8, "Phase 177 split must be 24 references plus 8 new packets.");
check(refs.every((p, i) => p.referenced_phase_161_packet_id === p161.stack_watch_packets[i].stack_watch_packet_id && JSON.stringify(p.referenced_claim_block_ids) === JSON.stringify(p161.stack_watch_packets[i].claim_blocks.map((c) => c.claim_block_id))), "Phase 177 must reference every Phase 161 packet and claim set in order.");
check(refs.every((p, i) => {
  const upstream = p161.stack_watch_packets[i];
  const expectedInherited = {
    checked_date: upstream.checked_date,
    artifact_date: upstream.artifact_date,
    data_through: upstream.data_through,
    evidence_type: upstream.evidence_type,
    publisher: upstream.publisher,
    official_url: upstream.official_url,
    source_semantic_digest: upstream.source_semantic_digest,
    topic_ids: upstream.topic_ids,
    project_chronicle_ids: upstream.project_chronicle_ids,
    place_ledger_ids: upstream.place_ledger_ids,
  };
  const expectedAffected = {
    source_ids: upstream.source_ids,
    topic_ids: upstream.topic_ids,
    project_chronicle_ids: upstream.project_chronicle_ids,
    place_ledger_ids: upstream.place_ledger_ids,
    alternative_candidate_ids: upstream.alternative_candidate_ids,
  };
  const serialized = JSON.stringify(p);
  return p.packet_state === "Reference only — immutable Phase 161 content; October source-currency check scheduled"
    && same(p.inherited_metadata, expectedInherited)
    && p.canonical_upstream_route === upstream.route
    && p.exact_next_artifact === upstream.decisive_next_artifact
    && same(p.affected_record_map, expectedAffected)
    && typeof p.reader_bridge === "string" && p.reader_bridge.length >= 350 && p.reader_bridge.includes(upstream.route)
    && !Object.hasOwn(p, "claim_blocks")
    && p.reader_bridge !== upstream.reader_brief
    && upstream.claim_blocks.every((claim) => !serialized.includes(claim.text));
}), "Every Phase 161 wrapper must be explicitly reference-only, preserve exact inherited metadata and routing, map affected records, bridge readers to the upstream packet, and omit inherited claim text.");
check(additions.every((p) => {
  const source = sourceById.get(p.source_ids[0]);
  const expected = expectedAdditionMetadata[p.source_ids[0]];
  return source && expected
    && p.claim_blocks.length === 3
    && p.checked_date === "2026-09-01"
    && p.publisher === source.source_owner
    && p.official_url === source.url
    && p.artifact_date === expected.artifact_date
    && p.data_through === expected.data_through
    && p.evidence_type === expected.evidence_type
    && p.exact_next_artifact.length >= 250
    && expected.next_terms.every((term) => p.exact_next_artifact.includes(term))
    && !p.exact_next_artifact.startsWith("At the lawful October review, recheck")
    && same(p.affected_record_map, { source_ids: [source.id], topics: source.primary_topics, framework_layers: source.framework_layers, jurisdiction: source.jurisdiction })
    && typeof p.reader_bridge === "string" && p.reader_bridge.length >= 350
    && p.october_recheck_date === null && p.october_finding === null;
}), "New Phase 177 packets require exact source-specific artifact metadata, next actions, affected maps, substantive reader bridges, and null October results.");
check(unique(additions.map((p) => p.exact_next_artifact)), "Every new Phase 177 packet requires a distinct source-specific next-artifact action.");
check(p177.packets.every((p) => p.route.startsWith("/review/v1oct/october-stack-watch/") && p.scheduled_october_recheck_date === octoberRecheckByLane[p.stack_lane] && p.october_recheck_date === null && p.october_finding === null), "Phase 177 routes, scheduled October dates, or null actual-result fields are invalid.");
check(same([...new Set(p177.packets.map((p) => p.scheduled_october_recheck_date))].sort(), Object.values(octoberRecheckByLane).sort()), "Phase 177 must schedule all eight lane rechecks across October 5-23.");
check(p177.lane_syntheses.length === 8 && p177.lane_syntheses.every((lane) => lane.packet_ids.length === 4 && lane.claim_block_references.length === 12), "Phase 177 requires eight four-packet lane syntheses referencing twelve claim blocks each.");
check(unique(p177.packets.map((p) => p.phase_177_packet_id)), "Phase 177 packet IDs must be unique.");

check(p178.place_system_dossiers.length === 10 && p178.comparison_overlays.length === 8 && p178.interpretive_essays.length === 4, "Phase 178 headline counts are invalid.");
check(!Object.hasOwn(p178, "depth_records"), "Phase 178 must not duplicate its dossier, overlay, and essay collections in a depth_records array.");
check(p178.coverage_matrix?.length === 10 && p178.counts.coverage_matrix_rows === 10, "Phase 178 requires one coverage-ledger row per dossier.");
check(
  p178.coverage_summary?.selected_places === 10 &&
  p178.coverage_summary?.represented_us_states === 7 &&
  p178.coverage_summary?.semiconductor_and_manufacturing_places === 9 &&
  p178.coverage_summary?.water_operations_places === 1 &&
  p178.coverage_summary?.selection_scores_published === 0 &&
  p178.coverage_matrix.every((row) => row.selection_score === null && /not scored or ranked/i.test(row.selection_state)),
  "Phase 178 coverage scope must remain explicit, exact, and unranked.",
);
check(p178.place_system_dossiers.every((d) => d.system_layers.length === 6 && d.timeline.length === 4 && d.dependency_edges.length === 5), "Every Phase 178 dossier requires 6/4/5 depth structures.");
check(p178.place_system_dossiers.every((d) => d.route.startsWith("/review/v1oct/atlas-depth/") && d.timeline.every((event) => /^\d{4}-\d{2}-\d{2}$/.test(event.date) && event.date <= "2026-09-01") && d.timeline.slice(2).every((event) => event.date === d.source_entry_binding.checked_date && /Bounded open/.test(event.evidence_state)) && d.dependency_edges.every((edge) => edge.relation === "Noncausal evidence dependency" && /not a causal effect/i.test(edge.boundary))), "Phase 178 routes, cutoff-dated bounded-open events, or dependency boundaries are invalid.");
check(p178.place_system_dossiers.every((d) => {
  const binding = d.source_entry_binding;
  return binding
    && d.source_ids.length === 1
    && binding.source_id === d.source_ids[0]
    && binding.entry_locator.includes(d.place_identity)
    && binding.checked_date === "2026-09-01"
    && binding.factual_nucleus === d.source_factual_nucleus
    && binding.factual_nucleus.length >= 100
    && binding.limitation.length >= 100;
}), "Every Phase 178 dossier requires an entry-specific source identity, locator, factual nucleus, cutoff check, and limitation.");
const canonicalTopics = new Set(["topic-chips-and-compute", "topic-advanced-manufacturing", "topic-critical-minerals", "topic-water"]);
const canonicalSignals = new Set(["signal-nist-metis-semiconductor-metrology-data-exchange"]);
const canonicalReaderPathways = new Set(["reader-pathway-industrial-water-agreement-to-reuse-operation", "reader-pathway-chips-compute-research-to-fab", "reader-pathway-advanced-manufacturing-research-to-production"]);
const canonicalDependencyMaps = new Set(["dependency-map-infrastructure-availability-is-not-usable-access", "dependency-map-delivered-output-is-not-realized-benefit", "dependency-map-funding-is-not-financing-capacity", "dependency-map-procurement-contract-is-not-public-capacity"]);
check(p178.place_system_dossiers.every((d) => {
  const links = d.linkage_contract;
  return links
    && same(links.canonical_source_ids, d.source_ids)
    && links.topic_ids.length > 0 && links.topic_ids.every((id) => canonicalTopics.has(id))
    && links.context_signal_ids.every((id) => canonicalSignals.has(id))
    && same(links.direct_project_ids, [])
    && same(links.evidence_gap_ids, [])
    && links.reader_pathway_ids.length > 0 && links.reader_pathway_ids.every((id) => canonicalReaderPathways.has(id))
    && links.dependency_map_ids.length > 0 && links.dependency_map_ids.every((id) => canonicalDependencyMaps.has(id))
    && links.absent_direct_backlinks.length === 3
    && /do not transfer evidence/i.test(links.boundary);
}), "Every Phase 178 dossier requires exact canonical backlinks plus explicit absence and non-transfer boundaries.");
const easton = p178.place_system_dossiers.find((d) => d.place_identity === "Easton, Pennsylvania");
check(easton && /Coherent/i.test(easton.source_entry_binding.entry_locator) && /\$79 million/i.test(easton.source_entry_binding.factual_nucleus) && /silicon-carbide|SiC/i.test(easton.source_entry_binding.factual_nucleus), "The Easton entry must bind the Coherent SiC proposal and its exact $79 million ceiling.");
check(p178.comparison_overlays.every((o) => o.verdict === "Context only — measures not normalized" && o.route.startsWith("/review/v1oct/atlas-depth/")), "Phase 178 overlays must remain context only.");
check(p178.interpretive_essays.every((e) => /does not add evidence/.test(e.evidence_boundary) && e.route.startsWith("/review/v1oct/atlas-depth/")), "Phase 178 essays require the noncausal evidence boundary.");
check(p178.counts.system_layers === 60 && p178.counts.timeline_entries === 40 && p178.counts.dependency_edges === 50, "Phase 178 structural counts are invalid.");
check(unique(p178.place_system_dossiers.map((d) => d.place_system_dossier_id)), "Phase 178 dossier IDs must be unique.");
check(unique([...p178.place_system_dossiers, ...p178.comparison_overlays, ...p178.interpretive_essays].map((record) => record.route)), "Phase 178 detail routes must be unique.");
const allowed = new Set(["source-178-nist-bosch-roseville-sic-july-2026", "source-178-nist-chips-program-office-awards-august-2026", ...additions.flatMap((p) => p.source_ids)]);
check(p178.place_system_dossiers.every((d) => d.source_ids.every((id) => allowed.has(id))), "Phase 178 contains an unauthorized source join.");
if (failures.length) { console.error(failures.map((x) => `- ${x}`).join("\n")); process.exit(1); }
console.log("Phase 177/178 asset assertions passed: 32 packets, 96 referenced/new claim blocks, 8 lanes; 10 dossiers, 8 overlays, 4 essays, 60 layers, 40 timeline entries, 50 dependency edges.");
