import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const sourcePath = (id) => join(appRoot, "src", "content", "sources", `${id}.json`);
const date = "2026-09-01";

const phase161 = await readJson(join(appRoot, "src", "data", "phase-161-stack-watch.json"));
const source177Ids = [
  "source-177-eia-steo-august-2026", "source-177-nist-chips-rd-awards-august-2026", "source-177-usbr-yakima-water-forecast-august-2026",
  "source-177-faa-hybrid-electric-demonstration-august-2026", "source-177-nasa-dss23-goldstone-august-2026",
  "source-177-doe-critical-minerals-battery-projects-august-2026", "source-177-noaa-us-climate-july-2026", "source-177-nist-tevv-athlon-august-2026",
];
const sources177 = await Promise.all(source177Ids.map((id) => readJson(sourcePath(id))));
const source178Ids = ["source-178-nist-bosch-roseville-sic-july-2026", "source-178-nist-chips-program-office-awards-august-2026"];
const sources178 = await Promise.all(source178Ids.map((id) => readJson(sourcePath(id))));
const laneOrder = ["Power and grid", "Chips and compute", "Water", "Mobility and aviation", "Space", "Critical minerals and manufacturing", "Climate and energy", "AI, quantum, cyber and human futures"];
const laneBySource = Object.fromEntries(source177Ids.map((id, i) => [id, laneOrder[i]]));
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

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

const additionSpecifications = {
  "source-177-eia-steo-august-2026": {
    artifact_date: "2026-08-11",
    data_through: "Forecast completed 2026-08-06; forecast horizon through 2027",
    evidence_type: "Monthly federal energy forecast and revision record",
    exact_next_artifact: "Retrieve the EIA September 9, 2026 Short-Term Energy Outlook or an official reschedule notice from the STEO archive; compare the Texas 2027 electricity-load-growth forecast, forecast-completion date, release date, and stated modeling assumptions against the August 2026 vintage, while preserving forecast-versus-observation status.",
  },
  "source-177-nist-chips-rd-awards-august-2026": {
    artifact_date: "2026-08-06",
    data_through: "Registry state updated 2026-08-06, including three named $100 million direct-funding awards",
    evidence_type: "Federal semiconductor R&D award registry",
    exact_next_artifact: "Recheck the CHIPS R&D Office Awards registry's updated timestamp and the separate Applied Materials, Arizona State University, and Absolics entries; capture any recipient, location, amount, program, purpose, or award-status change as an identity-specific dated delta, without treating an unchanged registry as delivery evidence.",
  },
  "source-177-usbr-yakima-water-forecast-august-2026": {
    artifact_date: "2026-08-06",
    data_through: "Hydrologic inputs through 2026-08-01; entitlement projection covers 2026-07 through 2026-09",
    evidence_type: "Monthly federal basin water-supply forecast",
    exact_next_artifact: "Retrieve Reclamation's September 2026 Yakima basin water-supply forecast, or a dated official no-release or reschedule notice; compare its hydrologic input date and separate senior- and junior-entitlement percentages with the August forecast, while leaving final delivered-volume, crop, household, and ecosystem outcomes open.",
  },
  "source-177-faa-hybrid-electric-demonstration-august-2026": {
    artifact_date: "2026-08-18",
    data_through: "Mid-Atlantic eIPP demonstration flights reported 2026-08-18; additional demonstrations described as planned through 2026",
    evidence_type: "Federal advanced-air-mobility demonstration notice",
    exact_next_artifact: "Retrieve the next FAA eVTOL Integration Pilot Program demonstration notice or formal program report that names the aircraft, flight dates, Mid-Atlantic route, participating airports, operating authority, completed flight count, and observed test result; keep certification, scheduled service, demand, economics, reliability, and scaled integration separate.",
  },
  "source-177-nasa-dss23-goldstone-august-2026": {
    artifact_date: "2026-08-25",
    data_through: "May-July 2026 testing and named mission communications from the 2026-08-03 operating start through the 2026-08-25 release",
    evidence_type: "Federal deep-space communications operating-milestone release",
    exact_next_artifact: "Retrieve a JPL, Deep Space Network, or NASA SCaN record specific to DSS-23 that reports a post-August 3 observation period, named communication passes or supported missions, receiver acceptance, availability or failure treatment, and a denominator; do not substitute network-wide capacity language or mission success for antenna-level recurring performance.",
  },
  "source-177-doe-critical-minerals-battery-projects-august-2026": {
    artifact_date: "2026-08-20",
    data_through: "Seven project selections announced 2026-08-20 under the third funding round of two named battery programs",
    evidence_type: "Federal project-selection announcement",
    exact_next_artifact: "Retrieve DOE's project-specific selection-to-award record for each of the seven named projects, including any final assistance agreement, obligation, recipient, location, amount, scope, and milestone schedule; retain separate states for selection, award, construction, commissioning, qualified output, and accepted operating capacity.",
  },
  "source-177-noaa-us-climate-july-2026": {
    artifact_date: "2026-08-12",
    data_through: "July 2026 observations; article published 2026-08-10 and corrected 2026-08-12",
    evidence_type: "Federal monthly observed climate assessment",
    exact_next_artifact: "Retrieve NOAA NCEI's September 2026 U.S. Climate Report and its release or revision metadata; preserve observation month, geography, temperature and precipitation measures, comparison baseline, record length, and any revision to the July assessment without inferring project damage, adaptation performance, attribution, or future local conditions.",
  },
  "source-177-nist-tevv-athlon-august-2026": {
    artifact_date: "2026-08-07",
    data_through: "Initial public draft announced 2026-08-07; public-comment period scheduled through 2026-10-06",
    evidence_type: "Federal initial public draft standards framework",
    exact_next_artifact: "After the October 6 comment deadline, retrieve the final or revised NIST AI 200-2, a formal comment-disposition record, or an official status notice; record the exact document version, publication date, draft status, and disposition while leaving every system-specific safety, effectiveness, compliance, and validation claim open.",
  },
};

const referenced = phase161.stack_watch_packets.map((packet, index) => ({
  phase_177_packet_id: `177-PACKET-${String(index + 1).padStart(3, "0")}`,
  packet_kind: "Phase 161 packet reference",
  packet_state: "Reference only — immutable Phase 161 content; October source-currency check scheduled",
  stack_lane: packet.stack_lane,
  title: packet.title,
  referenced_phase_161_packet_id: packet.stack_watch_packet_id,
  referenced_claim_block_ids: packet.claim_blocks.map((claim) => claim.claim_block_id),
  source_ids: packet.source_ids,
  checked_date: packet.checked_date,
  inherited_metadata: {
    checked_date: packet.checked_date,
    artifact_date: packet.artifact_date,
    data_through: packet.data_through,
    evidence_type: packet.evidence_type,
    publisher: packet.publisher,
    official_url: packet.official_url,
    source_semantic_digest: packet.source_semantic_digest,
    topic_ids: packet.topic_ids,
    project_chronicle_ids: packet.project_chronicle_ids,
    place_ledger_ids: packet.place_ledger_ids,
  },
  canonical_upstream_route: packet.route,
  exact_next_artifact: packet.decisive_next_artifact,
  affected_record_map: {
    source_ids: packet.source_ids,
    topic_ids: packet.topic_ids,
    project_chronicle_ids: packet.project_chronicle_ids,
    place_ledger_ids: packet.place_ledger_ids,
    alternative_candidate_ids: packet.alternative_candidate_ids,
  },
  reader_bridge: `This reference-only wrapper keeps ${packet.evidence_type.toLowerCase()} issued by ${packet.publisher} in the ${packet.stack_lane} lane, with its artifact vintage, data-through period, source identity, semantic digest, topics, named-project links, and receiving-place links inherited without alteration. Read the full three-claim block and binding exclusion at ${packet.route}. Phase 177 adds only a scheduled source-currency check against the exact next artifact; it does not refresh the inherited text, change its evidence state, or convert it into a project stage or outcome.`,
  scheduled_october_recheck_date: octoberRecheckByLane[packet.stack_lane],
  october_recheck_date: null,
  october_finding: null,
  route: `/review/v1oct/october-stack-watch/${packet.slug}/`,
  interpretation_boundary: "This record references the immutable Phase 161 packet and its claim IDs; it does not duplicate, republish, refresh, or adjudicate those claims.",
}));

const additions = sources177.map((source, index) => {
  const packetNo = 25 + index;
  const slug = slugify(source.name);
  const base = `177-PACKET-${String(packetNo).padStart(3, "0")}`;
  const specification = additionSpecifications[source.id];
  return {
    phase_177_packet_id: base,
    packet_kind: "New prepared official-source packet",
    stack_lane: laneBySource[source.id],
    title: source.name,
    source_ids: [source.id],
    publisher: source.source_owner,
    official_url: source.url,
    checked_date: source.last_checked_date,
    artifact_date: specification.artifact_date,
    data_through: specification.data_through,
    evidence_type: specification.evidence_type,
    packet_state: "Prepared — October review not yet conducted",
    semantic_digest_state: "Pending October source-currency sweep",
    exact_next_artifact: specification.exact_next_artifact,
    affected_record_map: { source_ids: [source.id], topics: source.primary_topics, framework_layers: source.framework_layers, jurisdiction: source.jurisdiction },
    claim_blocks: [
      { claim_block_id: `${base}-CLAIM-01`, claim_type: "Supported observation", text: source.factual_nucleus, source_ids: [source.id], evidence_state: "Prepared context — October finding null" },
      { claim_block_id: `${base}-CLAIM-02`, claim_type: "System implication", text: `This official record can orient the ${laneBySource[source.id]} lane only within the named jurisdiction, artifact vintage, issuer authority, and ${source.coverage_role.join(" and ").toLowerCase()} role.`, source_ids: [source.id], evidence_state: "Bounded interpretation — no stage or outcome change" },
      { claim_block_id: `${base}-CLAIM-03`, claim_type: "Excluded inference", text: source.known_limitations, source_ids: [source.id], evidence_state: "Binding exclusion" },
    ],
    reader_bridge: `${source.name} enters the ${laneBySource[source.id]} lane as ${specification.evidence_type.toLowerCase()} from ${source.source_owner}, bounded to ${specification.data_through}. The prepared claim set records one source-supported observation, one scoped system implication, and one binding excluded inference. Its October task names the exact successor artifact or status record needed; until that dated check is run, the packet creates no refreshed finding, admitted outcome, project stage, score, or rank.`,
    scheduled_october_recheck_date: octoberRecheckByLane[laneBySource[source.id]],
    october_recheck_date: null,
    october_finding: null,
    route: `/review/v1oct/october-stack-watch/${slug}/`,
    interpretation_boundary: "Prepared content only. Current source identity and September 1 check are recorded; no October review, evidence admission, stage decision, outcome, score, rank, or causal claim is implied.",
  };
});

const packets177 = [...referenced, ...additions];
const laneSyntheses = laneOrder.map((lane, index) => ({
  lane_synthesis_id: `177-LANE-${String(index + 1).padStart(2, "0")}`,
  stack_lane: lane,
  packet_ids: packets177.filter((packet) => packet.stack_lane === lane).map((packet) => packet.phase_177_packet_id),
  claim_block_references: packets177.filter((packet) => packet.stack_lane === lane).flatMap((packet) => packet.referenced_claim_block_ids ?? packet.claim_blocks.map((claim) => claim.claim_block_id)),
  synthesis_state: "Reference map prepared — October findings remain null",
  boundary: "The lane synthesis references claim blocks by ID and does not duplicate their text or create a lane score, rank, trend, cause, or outcome.",
}));

const phase177 = {
  schema_version: "1.0", phase: 177, program_id: "FTFN-PHASE-177", dataset: "phase_177_october_stack_watch_and_source_currency_sweep",
  title: "October Stack Watch and Source-Currency Sweep", effective_date: date, record_status: "Prepared", build_status: "Complete locally — October operations not run",
  summary: "Reference twenty-four immutable Phase 161 packets and add eight current official-source packets across eight lanes, preserving ninety-six bounded claim identities while leaving every October recheck and finding null.",
  record_scope: "Append-only Phase 177 source-watch preparation over immutable Phase 156, 164, and 172 validation receipts.",
  publication_boundary: "September 1 preparation only. All October rechecks and findings remain null until their lawful dates.",
  publication_boundaries: [
    "September 1 preparation only. All October rechecks and findings remain null until their lawful dates.",
    "The twenty-four inherited packets are referenced by stable packet and claim IDs; their claim text is not duplicated or relabeled as newly checked.",
    "A forecast, selection, draft, demonstration, award, or milestone is not an observed outcome, accepted service, or causal finding."
  ],
  routes: { hub: "/review/v1oct/october-stack-watch/", public_export: "/data/phase-177-october-stack-watch-and-source-currency-sweep.json" },
  counts: { packets: 32, referenced_phase_161_packets: 24, new_prepared_packets: 8, lanes: 8, referenced_claim_blocks: 72, new_claim_blocks: 24, total_claim_block_references: 96 },
  packets: packets177, lane_syntheses: laneSyntheses,
  public_html_routes: ["/review/v1oct/october-stack-watch/", ...packets177.map((record) => record.route)],
  public_json_exports: ["/data/phase-177-october-stack-watch-and-source-currency-sweep.json"]
};

const placeProfiles = [
  { place: "Roseville, California", sourceId: source178Ids[0], artifactDate: "2026-07-13", subject: "Bosch silicon-carbide manufacturing facility", authorityState: "Signed direct-funding agreement for up to $225 million supporting a stated $2 billion facility transformation", anchor: "Commerce reports that sample production had begun and commercial production was expected in 2026.", boundary: "Sample production does not establish commissioning of the commercial line, accepted customer output, yield, utilization, workforce realized, or recurring operating reliability.", next: "A Bosch or Commerce milestone record identifying the exact Roseville line, commercial-production start, qualified product, accepted output, period, method, and denominator." },
  { place: "Genesee County, New York", sourceId: source178Ids[1], artifactDate: "2026-08-06", subject: "Edwards Vacuum semiconductor-grade dry-vacuum-pump activity", authorityState: "Direct funding listed at up to $18 million", anchor: "NIST describes the investment as supporting domestic supply of semiconductor manufacturing equipment in a category it says lacked domestic production.", boundary: "The registry does not establish disbursement, construction completion, commissioned equipment, qualified pump output, customer acceptance, or supply-chain reliability.", next: "An Edwards Vacuum or Commerce project milestone naming the Genesee County facility, commissioned line, qualified product, accepted output, observation period, and denominator." },
  { place: "Malta, New York", sourceId: source178Ids[1], artifactDate: "2026-08-06", subject: "GlobalFoundries fabrication and advanced-packaging expansion", authorityState: "$1.45 billion in direct funding listed across a new 300 mm facility, modernization, and campus expansion", anchor: "The official registry links the Malta expansion to a strategic agreement for a dedicated supply of semiconductor technologies.", boundary: "A direct award and strategic agreement do not establish construction completion, packaging capability in service, customer-accepted volume, yield, utilization, or dependable supply.", next: "A facility-specific GlobalFoundries or Commerce record separating the Malta workstreams and reporting commissioned tools, qualified process, customer acceptance, period, and output denominator." },
  { place: "Burlington, Vermont", sourceId: source178Ids[1], artifactDate: "2026-08-06", subject: "GlobalFoundries gallium-nitride-on-silicon facility revitalization", authorityState: "$125 million in direct funding listed", anchor: "NIST says the award supports commercialization of 200 mm technologies and a planned U.S. high-volume GaN-on-silicon capability.", boundary: "Expected commercialization and the phrase high-volume do not establish a commissioned line, qualified product, customer acceptance, actual production rate, yield, utilization, or market outcome.", next: "A GlobalFoundries or Commerce acceptance record naming the Burlington line, qualified 200 mm GaN-on-silicon product, commercial start, accepted volume, period, and denominator." },
  { place: "Canton, New York", sourceId: source178Ids[1], artifactDate: "2026-08-06", subject: "Corning high-purity fused-silica and ultra-low-expansion glass expansion", authorityState: "Direct funding listed at up to $32 million", anchor: "NIST says the investment will enable increased HPFS and EXTREME ULE Glass production and scale a novel manufacturing process in Canton.", boundary: "An award purpose does not establish installed capacity, process qualification, accepted product, yield, operating rate, customer deliveries, or supply-chain outcome.", next: "A Corning or Commerce facility record identifying the commissioned Canton process, qualified material, accepted output, period, and product-specific denominator." },
  { place: "Baytown, Texas", sourceId: source178Ids[1], artifactDate: "2026-08-06", subject: "Sumika ultra-high-purity isopropyl-alcohol manufacturing proposal", authorityState: "Proposed funding listed at up to $52.1 million", anchor: "The registry says the proposed investment would support UHP isopropyl alcohol used in advanced logic and memory production.", boundary: "Proposed funding is not a signed award, obligation, construction start, commissioned plant, qualified chemical output, customer acceptance, or domestic supply result.", next: "A signed Commerce funding agreement followed by a Baytown facility milestone reporting commissioning, semiconductor-grade qualification, accepted output, period, and denominator." },
  { place: "Easton, Pennsylvania", sourceId: source178Ids[1], artifactDate: "2026-08-06", subject: "Coherent silicon-carbide epitaxial-wafer and test-capability proposal", authorityState: "Proposed funding listed at up to $79 million", anchor: "NIST says the proposed investment would support SiC epitaxial-wafer capacity, back-end processing, and performance and reliability testing.", boundary: "A proposed capacity expansion does not establish a signed award, installed tools, qualified wafers, validated reliability method, accepted output, utilization, or operating capacity.", next: "A signed award and Coherent facility record naming installed Easton tools, qualified wafer definition, reliability protocol, accepted output, period, and denominator." },
  { place: "Beaverton, Oregon", sourceId: source178Ids[1], artifactDate: "2026-08-06", subject: "Analog Devices mature-node semiconductor manufacturing proposal", authorityState: "Part of up to $105 million in proposed funding split across Chelmsford, Beaverton, and Camas", anchor: "NIST says the Oregon proposal would support front-end mature-node manufacturing for automotive, industrial, defense, and other applications.", boundary: "The shared proposed amount cannot be assigned to Beaverton without a site allocation, and the proposal establishes neither award execution nor commissioned, qualified, or accepted output.", next: "A signed agreement with a site-specific Beaverton allocation and a facility milestone reporting commissioned process, qualified devices, accepted output, period, and denominator." },
  { place: "Camas, Washington", sourceId: source178Ids[1], artifactDate: "2026-08-06", subject: "Analog Devices mature-node semiconductor manufacturing proposal", authorityState: "Part of up to $105 million in proposed funding split across Chelmsford, Beaverton, and Camas", anchor: "NIST says the Washington proposal would support front-end mature-node manufacturing for automotive, industrial, defense, and other applications.", boundary: "The shared proposed amount cannot be assigned to Camas without a site allocation, and the proposal establishes neither award execution nor commissioned, qualified, or accepted output.", next: "A signed agreement with a site-specific Camas allocation and a facility milestone reporting commissioned process, qualified devices, accepted output, period, and denominator." },
  { place: "Yakima Basin, Washington", sourceId: "source-177-usbr-yakima-water-forecast-august-2026", artifactDate: "2026-08-06", subject: "Yakima Project water-supply operations", authorityState: "Federal monthly water-supply forecast and stated proration operation", anchor: "Reclamation reports August 1 storage of 605,000 acre-feet, or 57% full and 80% of average, with projected entitlements of 100% for senior and 58% for junior right holders.", boundary: "The forecast is not final delivered-volume accounting, a farm or household outcome, an ecosystem result, a loss estimate, or a future weather observation.", next: "The final 2026 Yakima Project delivered-water accounting by right class, delivery period, method, and denominator, with revisions to the August forecast identified." },
];
const sourceById = new Map([...sources177, ...sources178].map((source) => [source.id, source]));
const layerNames = ["Resource foundations", "Enabling infrastructure", "Institutions and authority", "Finance and commitment", "Workforce and implementation", "Operations and outcomes"];
const topicIdByName = {
  "Chips and Compute": "topic-chips-and-compute",
  "Advanced Manufacturing": "topic-advanced-manufacturing",
  "Critical Minerals": "topic-critical-minerals",
  Water: "topic-water",
};
const dossiers = placeProfiles.map((profile, index) => {
  const source = sourceById.get(profile.sourceId);
  const id = `178-DOSSIER-${String(index + 1).padStart(3, "0")}`;
  const waterSystem = profile.place === "Yakima Basin, Washington";
  const sourceEntryFactualNucleus = `${profile.authorityState}. ${profile.anchor}`;
  const linkageContract = {
    canonical_source_ids: [profile.sourceId],
    topic_ids: source.primary_topics.map((topic) => topicIdByName[topic]).filter(Boolean),
    context_signal_ids: waterSystem ? [] : ["signal-nist-metis-semiconductor-metrology-data-exchange"],
    direct_project_ids: [],
    evidence_gap_ids: [],
    reader_pathway_ids: waterSystem
      ? ["reader-pathway-industrial-water-agreement-to-reuse-operation"]
      : ["reader-pathway-chips-compute-research-to-fab", "reader-pathway-advanced-manufacturing-research-to-production"],
    dependency_map_ids: waterSystem
      ? ["dependency-map-infrastructure-availability-is-not-usable-access", "dependency-map-delivered-output-is-not-realized-benefit"]
      : ["dependency-map-funding-is-not-financing-capacity", "dependency-map-procurement-contract-is-not-public-capacity", "dependency-map-delivered-output-is-not-realized-benefit"],
    absent_direct_backlinks: ["No canonical signal directly represents this named place-system record.", "No canonical named-project file exists for this exact subject.", "No existing evidence-gap record has the same place and intervention identity."],
    boundary: "Context links orient the reader; they do not transfer evidence, stage, denominator, or outcome between records.",
  };
  const layerReads = [
    `${profile.subject} is the named local-system anchor. The official artifact fixes a place and intervention but does not inventory every relevant power, water, land, material, or upstream-supply input.`,
    `${profile.anchor} The infrastructure reading stops at the artifact's stated milestone; ${profile.boundary}`,
    `${source.source_owner} supplies the official ${profile.authorityState.toLowerCase()} record. That authority does not substitute for local permits, operator acceptance, customer qualification, or another agency's jurisdiction.`,
    `${profile.authorityState}. Amount, award, proposal, and expenditure are retained as different states; none is converted into realized capacity, output, employment, or benefit.`,
    `The source does not provide a compatible place-specific workforce pipeline, filled-job cohort, training completion series, or implementation workforce denominator. Those fields remain unknown rather than estimated.`,
    `${profile.boundary} The decisive bridge is: ${profile.next}`,
  ];
  return {
    place_system_dossier_id: id, slug: slugify(profile.place), title: `${profile.place} place-system dossier`, place_identity: profile.place,
    subject: profile.subject, authority_state: profile.authorityState, source_ids: [profile.sourceId], dossier_state: "Published context — no inferred project stage", source_factual_nucleus: sourceEntryFactualNucleus,
    source_entry_binding: { source_id: profile.sourceId, entry_locator: `${profile.place} — ${profile.subject}`, checked_date: source.last_checked_date, factual_nucleus: sourceEntryFactualNucleus, limitation: profile.boundary },
    linkage_contract: linkageContract,
    reader_narrative: `${profile.place} enters the Atlas as a receiving system with one exact official anchor: ${profile.anchor} The dossier separates the authority and commitment stated in that record from implementation, commissioning, accepted operation, recurring performance, and public outcome. ${profile.boundary} Missing layers remain explicit research needs; they are not filled by an estimate or by transferring evidence from another place.`,
    system_question: `What exact place-specific records would connect ${profile.subject.toLowerCase()} from the current ${profile.authorityState.toLowerCase()} state to implementation, accepted operation, and repeatable outcome evidence?`,
    system_layers: layerNames.map((name, i) => ({ layer_id: `${id}-LAYER-${i + 1}`, layer: name, current_read: layerReads[i], decisive_question: i === 5 ? profile.next : `Which dated ${profile.place} record would resolve the ${name.toLowerCase()} layer with a stable entity, period, method, and denominator?`, boundary: "This layer cannot be averaged into a place score or transferred to another system layer." })),
    timeline: [
      { timeline_entry_id: `${id}-TIME-01`, date: profile.artifactDate, event: profile.anchor, evidence_state: "Official artifact context" },
      { timeline_entry_id: `${id}-TIME-02`, date: source.last_checked_date, event: "The canonical official source identity and its current limitation were checked for Phase 178.", evidence_state: "Source check — no stage decision" },
      { timeline_entry_id: `${id}-TIME-03`, date: source.last_checked_date, event: "At the Phase 178 cutoff, no compatible implementation, commissioning, delivery, or service-acceptance bridge was admitted by this dossier.", evidence_state: "Bounded open bridge as of source check" },
      { timeline_entry_id: `${id}-TIME-04`, date: source.last_checked_date, event: "At the Phase 178 cutoff, no repeated operating or public-outcome observation with a stable denominator was admitted by this dossier.", evidence_state: "Bounded open outcome as of source check" },
    ],
    dependency_edges: [`${source.source_owner} authority → ${profile.subject}`, `${profile.authorityState} → place-specific implementation record`, "Implementation record → commissioning or delivery evidence", "Commissioning or delivery → receiver acceptance", "Receiver acceptance → repeated operating or public-outcome observation"].map((label, i) => ({ dependency_edge_id: `${id}-EDGE-${i + 1}`, label, relation: "Noncausal evidence dependency", state: "Context only", boundary: "The arrow records an evidence prerequisite, not a causal effect." })),
    exact_next_artifact: profile.next,
    route: `/review/v1oct/atlas-depth/${slugify(profile.place)}/`,
    interpretation_boundary: `The dossier preserves the limitations of ${source.name}. ${profile.boundary} It does not infer a project stage, common denominator, outcome, cause, score, rank, or future finding.`,
  };
});

const coverageMatrix = dossiers.map((dossier) => ({
  coverage_matrix_id: `178-COVERAGE-${dossier.place_system_dossier_id.split("-").at(-1)}`,
  dossier_id: dossier.place_system_dossier_id,
  place_identity: dossier.place_identity,
  subject: dossier.subject,
  official_source_depth: "One current Tier 1 official profile with an entry-specific factual nucleus and limitation.",
  named_identity_state: "Exact place and intervention retained.",
  policy_or_operating_visibility: dossier.place_identity === "Yakima Basin, Washington" ? "Federal operating forecast visible; final delivery accounting open." : "Federal award or proposal state visible; local permit and operating records open.",
  geographic_contribution: "Adds a named U.S. receiving place without converting geography into a performance denominator.",
  coverage_gap_role: dossier.place_identity === "Yakima Basin, Washington" ? "Water allocation and delivery chain" : "Semiconductor manufacturing and upstream supply chain",
  selection_state: "Selected for source-bound depth — not scored or ranked",
  selection_score: null,
}));

const overlayProfiles = [
  { pair: [0,5], title: "Signed direct funding versus proposed funding", question: "What can be compared when Roseville has a signed agreement and Baytown remains a proposal?", compatible: ["Federal program authority", "named place", "stated funding ceiling", "industrial input role"], incompatible: ["legal funding state", "technology", "facility scope", "implementation milestone", "operating denominator"], reading: "The pair is useful for showing why a funding pipeline needs stage labels. It cannot support a claim that the projects have equal commitment, progress, capacity, or outcome." },
  { pair: [2,3], title: "Two direct awards, different production systems", question: "Can the Malta and Burlington GlobalFoundries records form one capacity comparison?", compatible: ["same company family", "direct-award authority", "named facility geography"], incompatible: ["300 mm fab and packaging scope", "200 mm GaN-on-silicon scope", "product denominator", "commissioning state", "customer-acceptance measure"], reading: "Shared ownership and award authority permit a portfolio view, not a pooled capacity, readiness, or performance result." },
  { pair: [1,4], title: "Equipment and materials as distinct upstream nodes", question: "What does a pump-supply record share with a semiconductor-glass record?", compatible: ["upstream semiconductor-supply role", "direct-funding registry", "named U.S. place"], incompatible: ["product", "unit", "process", "market", "qualification and acceptance denominator"], reading: "The records can map different supply-chain dependencies but cannot be summed into a common domestic-capacity figure." },
  { pair: [7,8], title: "One proposed award across Beaverton and Camas", question: "How should a shared proposed ceiling be represented across two named facilities?", compatible: ["company", "program", "proposed ceiling", "mature-node purpose"], incompatible: ["site allocation", "installed toolset", "product mix", "output", "employment", "local infrastructure"], reading: "The shared up-to amount must remain one proposal-level figure; assigning or duplicating it by site would fabricate a denominator." },
  { pair: [0,6], title: "Silicon carbide: sample production versus proposed expansion", question: "Does a shared SiC label make Roseville and Easton operationally comparable?", compatible: ["SiC industrial domain", "named place", "federal program context"], incompatible: ["device versus epitaxial-wafer scope", "signed versus proposed funding", "sample milestone", "qualification method", "accepted output"], reading: "The common material domain supports a dependency map, not a claim of matched capacity, maturity, or reliability." },
  { pair: [9,5], title: "Water allocation forecast versus manufacturing proposal", question: "Can a basin forecast and a chemical-facility proposal be compared as local-system readiness?", compatible: ["named geography", "official authority", "future implementation relevance"], incompatible: ["measure", "period", "denominator", "jurisdiction", "decision state", "outcome population"], reading: "They can coexist in a place-constraint architecture, but the evidence is non-comparable and yields no composite readiness score." },
  { pair: [2,7], title: "New-fab direct award versus mature-node proposal", question: "What does the Malta–Beaverton contrast reveal about facility-stage language?", compatible: ["semiconductor manufacturing", "federal program registry", "named place"], incompatible: ["award state", "facility intervention", "technology", "site-level amount", "accepted output denominator"], reading: "The contrast is categorical context only. It does not rank either place or turn stated investment into comparable operating capacity." },
  { pair: [3,4], title: "Device fabrication versus upstream optical material", question: "Can Burlington GaN-on-silicon and Canton glass investments share an outcome denominator?", compatible: ["direct-award authority", "named facility", "semiconductor ecosystem role"], incompatible: ["value-chain position", "product", "unit", "customer", "qualification protocol", "operating period"], reading: "The pair shows interdependence across a supply chain while preserving the absence of a compatible comparison measure." },
];
const overlays = overlayProfiles.map((profile, index) => ({
  comparison_overlay_id: `178-OVERLAY-${String(index + 1).padStart(2, "0")}`,
  slug: slugify(profile.title), title: profile.title,
  dossier_ids: profile.pair.map((value) => dossiers[value].place_system_dossier_id), verdict: "Context only — measures not normalized",
  comparison_question: profile.question,
  compatible_fields: profile.compatible,
  incompatible_fields: profile.incompatible,
  compatible_reading: profile.reading,
  noncomparability: `The named ${profile.incompatible.join(", ")} fields are not interchangeable. The overlay creates no pooled value, score, rank, causal result, or synthetic stage.`,
  decisive_next_artifacts: profile.pair.map((value) => dossiers[value].exact_next_artifact),
  route: `/review/v1oct/atlas-depth/${slugify(profile.title)}/`,
}));
const essayProfiles = [
  { title: "Infrastructure is not service", dossierIndexes: [0,2,9], sourceIds: [source178Ids[0], source178Ids[1], "source-177-usbr-yakima-water-forecast-august-2026"], thesis: "Physical assets and institutional programs become public value only through a chain of accepted, repeated service that must be observed rather than assumed.", sections: [
    { heading: "The visible asset", text: "A fab expansion, a new manufacturing line, and a reservoir system are tangible. Their visibility makes them tempting proxies for delivery. The Phase 178 records preserve a harder distinction: an official funding or forecast record establishes a named intervention, not a universal operating state." },
    { heading: "The missing receiver", text: "Service evidence requires a receiver and acceptance rule. Semiconductor output needs a qualified product, customer or program acceptance, period, and denominator. Water operations need delivered volumes by right class and period. Without that receiving side, capacity and benefit remain open questions." },
    { heading: "The recurring test", text: "A single sample, ceremony, forecast, or delivery can be a real milestone and still fail to establish dependable operation. Recurrence, revisions, downtime, exclusions, and method continuity determine whether the record can support a service claim." },
    { heading: "Editorial consequence", text: "The Atlas therefore publishes the asset, authority, and open bridge together. It refuses a synthetic place stage and asks for the next record that would connect the asset to accepted operation." }
  ] },
  { title: "Selection is not capacity", dossierIndexes: [1,4,5,6], sourceIds: [source178Ids[1], "source-177-doe-critical-minerals-battery-projects-august-2026"], thesis: "A selection, proposal, or award is an institutional commitment state; capacity begins only when a defined system can produce accepted output under a stated period and denominator.", sections: [
    { heading: "Commitment has stages", text: "Proposed funding, a signed direct award, obligation, expenditure, construction, commissioning, qualification, and recurring production are different states. Collapsing them turns program administration into a performance claim." },
    { heading: "Amounts need denominators", text: "An up-to amount may cover several sites or workstreams. The Beaverton–Camas proposal shows why a shared ceiling cannot be duplicated across places; the Malta award shows why a portfolio amount cannot become one facility's capacity figure without allocation." },
    { heading: "Capacity needs an operating definition", text: "Installed equipment, nameplate potential, qualified throughput, accepted output, and utilization answer different questions. A credible capacity statement must identify product, line, unit, period, method, exclusions, and receiving authority." },
    { heading: "What the resource can say now", text: "These records map where public commitments are aimed and which supply-chain nodes they touch. They do not yet demonstrate how much dependable domestic output exists or what outcome the investment caused." }
  ] },
  { title: "Demonstration is not operations", dossierIndexes: [0,9], sourceIds: ["source-177-faa-hybrid-electric-demonstration-august-2026", "source-177-nasa-dss23-goldstone-august-2026", source178Ids[0]], thesis: "A demonstration shows that a bounded event occurred; operations require an authorized, accepted, repeatable service record with performance and failure boundaries.", sections: [
    { heading: "Three different milestone types", text: "FAA's hybrid-electric flights are demonstrations, DSS-23 is described by NASA as beginning mission communications after testing, and Roseville reports sample production. Each is meaningful, but each sits at a different point in its own technical and institutional chain." },
    { heading: "Authorization and acceptance", text: "A route demonstration does not supply aircraft certification or scheduled-service authority. An operating antenna milestone does not by itself quantify network-wide availability. Sample production does not establish a qualified commercial line. The relevant receiver and acceptance test differ in every system." },
    { heading: "Repeatability and denominator", text: "Operations claims need a period, service unit, denominator, failure treatment, and revision policy. Flight count, supported communication passes, accepted wafer output, and uptime cannot be pooled merely because each is described as progress." },
    { heading: "The useful bounded claim", text: "The resource can state the exact event, date, issuer, and excluded inference. That makes milestones informative without converting them into premature claims of commercial service, total capacity, reliability, or success." }
  ] },
  { title: "Measurement without compatible denominators is not comparison", dossierIndexes: [2,3,7,8,9], sourceIds: [source178Ids[1], "source-177-usbr-yakima-water-forecast-august-2026"], thesis: "Comparison becomes evidence only when entity, period, measure, method, denominator, jurisdiction, and revision treatment are compatible—or when the noncomparability is itself made explicit.", sections: [
    { heading: "Shared labels conceal different units", text: "Funding, capacity, output, service, adoption, and benefit are not interchangeable. Even two semiconductor facilities may produce different products on different tools for different receivers, while a basin forecast uses an entirely different population and time basis." },
    { heading: "Geography is not a denominator", text: "Naming Beaverton, Camas, Malta, or Yakima locates a record but does not define what is counted. Site allocation, product boundary, right class, customer cohort, and observation period must be present before a rate or total can travel across records." },
    { heading: "Noncomparability is a result", text: "A Context only verdict is not editorial failure. It prevents false rankings and identifies exactly which fields must be acquired before a comparison can be made." },
    { heading: "A better next move", text: "Instead of forcing a common score, the overlays preserve each source's state and publish decisive next artifacts. Future comparison can then begin from compatible accepted records, not from narrative similarity." }
  ] },
];
const sourceToPacket = new Map(additions.map((record) => [record.source_ids[0], record.phase_177_packet_id]));
const essays = essayProfiles.map((profile, index) => ({
  interpretive_essay_id: `178-ESSAY-${String(index + 1).padStart(2, "0")}`, slug: slugify(profile.title), title: profile.title,
  dossier_ids: profile.dossierIndexes.map((value) => dossiers[value].place_system_dossier_id),
  source_ids: profile.sourceIds,
  phase_177_packet_ids: profile.sourceIds.map((sourceId) => sourceToPacket.get(sourceId)).filter(Boolean),
  thesis: profile.thesis,
  sections: profile.sections,
  evidence_boundary: "The essay synthesizes exact source-bound context and qualitative noncausal dependencies; it does not add evidence, normalize measures, infer causation, or alter an underlying record.",
  route: `/review/v1oct/atlas-depth/${slugify(profile.title)}/`,
}));
const phase178 = {
  schema_version: "1.0", phase: 178, program_id: "FTFN-PHASE-178", dataset: "phase_178_systems_atlas_and_compendium_depth_expansion",
  title: "Systems Atlas and Compendium Depth Expansion", effective_date: date, record_status: "Published context", build_status: "Complete locally",
  summary: "Add ten source-bound place-system dossiers, eight explicit noncomparability overlays, and four interpretive essays without manufacturing a place stage, score, rank, causal result, or future finding.",
  record_scope: "Append-only Phase 178 interpretive depth layer over immutable Phase 156, 164, and 172 validation receipts.",
  publication_boundary: "Place-system depth is interpretive and source-bound. No project stage, performance score, rank, causal finding, or future-dated check is created.",
  publication_boundaries: [
    "Place-system depth is interpretive and source-bound. No project stage, performance score, rank, causal finding, or future-dated check is created.",
    "Funding agreements, proposed awards, demonstrations, forecasts, and commissioned components remain distinct from accepted operating service and repeated outcomes.",
    "Comparison overlays retain explicit noncomparability whenever period, measure, method, denominator, jurisdiction, or milestone state differs."
  ],
  routes: { hub: "/review/v1oct/atlas-depth/", public_export: "/data/phase-178-systems-atlas-and-compendium-depth-expansion.json" },
  counts: { place_system_dossiers: 10, comparison_overlays: 8, interpretive_essays: 4, coverage_matrix_rows: 10, system_layers: 60, timeline_entries: 40, dependency_edges: 50 },
  coverage_summary: { selected_places: 10, represented_us_states: 7, semiconductor_and_manufacturing_places: 9, water_operations_places: 1, selection_scores_published: 0, boundary: "This is a deliberately deep industrial-supply cohort, not a balanced national sample or a ranking of places." },
  coverage_matrix: coverageMatrix,
  place_system_dossiers: dossiers, comparison_overlays: overlays, interpretive_essays: essays,
  public_html_routes: ["/review/v1oct/atlas-depth/", ...dossiers.map((record) => record.route), ...overlays.map((record) => record.route), ...essays.map((record) => record.route)],
  public_json_exports: ["/data/phase-178-systems-atlas-and-compendium-depth-expansion.json"]
};

const update177 = { id: "update-2026-09-01-phase-177", effective_date: date, entry_type: "Source Refresh", title: "Phase 177 prepares the October Stack Watch", summary: "References all 24 Phase 161 packets and prepares eight new official-source packets; October checks remain null.", affected_record_ids: packets177.map((p) => p.phase_177_packet_id), related_paths: [phase177.routes.hub, phase177.routes.public_export, ...packets177.map((p) => p.route)], evidence_note: phase177.publication_boundaries[0], materiality: "No record-state change", publication_effect: "Adds thirty-three local review routes and one schema-1.0 JSON export; it creates no October finding.", work_package: "docs/work-packages/phase-177-october-stack-watch-and-source-currency-sweep.md" };
const update178 = { id: "update-2026-09-01-phase-178", effective_date: date, entry_type: "Source Refresh", title: "Phase 178 expands place-system depth", summary: "Adds ten source-bound place-system dossiers, eight noncomparability overlays, and four noncausal essays.", affected_record_ids: [...dossiers.map((d) => d.place_system_dossier_id), ...overlays.map((record) => record.comparison_overlay_id), ...essays.map((record) => record.interpretive_essay_id)], related_paths: [phase178.routes.hub, phase178.routes.public_export, ...dossiers.map((d) => d.route), ...overlays.map((record) => record.route), ...essays.map((record) => record.route)], evidence_note: phase178.publication_boundaries[0], materiality: "No record-state change", publication_effect: "Adds twenty-three local review routes and one schema-1.0 JSON export; it creates no stage, score, rank, or causal outcome.", work_package: "docs/work-packages/phase-178-systems-atlas-and-compendium-depth-expansion.md" };

await Promise.all([
  writeFile(join(appRoot, "src", "data", "phase-177-october-stack-watch-and-source-currency-sweep.json"), `${JSON.stringify(phase177, null, 2)}\n`),
  writeFile(join(appRoot, "src", "data", "phase-178-systems-atlas-and-compendium-depth-expansion.json"), `${JSON.stringify(phase178, null, 2)}\n`),
  writeFile(join(appRoot, "src", "content", "updates", "2026-09-01-phase-177.json"), `${JSON.stringify(update177, null, 2)}\n`),
  writeFile(join(appRoot, "src", "content", "updates", "2026-09-01-phase-178.json"), `${JSON.stringify(update178, null, 2)}\n`),
]);
console.log(`Built Phase 177 (${packets177.length} packets) and Phase 178 (${dossiers.length} dossiers, ${overlays.length} overlays, ${essays.length} essays).`);
