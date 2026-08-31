import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (name) => JSON.parse(await readFile(join(dataRoot, name), "utf8"));
const unique = (values) => [...new Set(values.filter(Boolean))];
const words = (value) => String(value ?? "").trim().split(/\s+/).filter(Boolean).length;
const deepWords = (value) => {
  if (typeof value === "string") return words(value);
  if (Array.isArray(value)) return value.reduce((sum, item) => sum + deepWords(item), 0);
  if (value && typeof value === "object") return Object.values(value).reduce((sum, item) => sum + deepWords(item), 0);
  return 0;
};
const deduplicatedPassageWords = (values) => {
  const seen = new Set();
  let total = 0;
  for (const value of values) {
    for (const passage of String(value).split(/(?<=[.!?])\s+/u).map((item) => item.trim()).filter(Boolean)) {
      const fingerprint = passage.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      if (!seen.has(fingerprint)) {
        seen.add(fingerprint);
        total += words(passage);
      }
    }
  }
  return total;
};
const ngramRepeatRatio = (values, width = 8) => {
  const counts = new Map();
  let total = 0;
  for (const value of values) {
    const tokens = String(value).toLowerCase().match(/[a-z0-9]+/g) ?? [];
    for (let index = 0; index <= tokens.length - width; index += 1) {
      const gram = tokens.slice(index, index + width).join(" ");
      counts.set(gram, (counts.get(gram) ?? 0) + 1);
      total += 1;
    }
  }
  const repeated = [...counts.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  return total ? repeated / total : 0;
};
const date = "2026-08-30";

const [notes, audits, biographies, dossiers, workbenches, missions] = await Promise.all([
  readJson("phase-125-evidence-annotation-ledger.json"),
  readJson("phase-126-mission-evidence-audits.json"),
  readJson("phase-127-project-place-conversion-biographies.json"),
  readJson("phase-123-comparative-delivery-dossiers.json"),
  readJson("phase-124-topic-research-workbenches.json"),
  readJson("phase-121-priority-research-missions.json"),
]);

const noteById = new Map(notes.evidence_annotations.map((record) => [record.note_id, record]));
const auditByMissionId = new Map(audits.mission_audits.map((record) => [record.mission_id, record]));
const dossierById = new Map(dossiers.dossiers.map((record) => [record.dossier_id, record]));
const missionById = new Map(missions.missions.map((record) => [record.mission_id, record]));
const projectBioByAtlasId = new Map(biographies.project_biographies.map((record) => [record.atlas_project_id, record]));
const placeBioByAtlasId = new Map(biographies.place_biographies.map((record) => [record.atlas_place_id, record]));

const topicProfiles = {
  "advanced-manufacturing": {
    focus: "The central research problem is to distinguish installed equipment, qualified lines, receiver-accepted output and dependable production. Announced capacity and isolated delivery milestones are useful chronology, but neither supplies a stable account of yield, rework, downtime, workforce qualification or customer acceptance.",
    strength: "The corpus is unusually rich in named production programs, audited oversight, delivery records, local workforce evidence and explicit cross-series holds. Those records make it possible to compare the shape of evidence chains while preserving the fact that MEP client surveys, aircraft deliveries, semiconductor construction and medical-device manufacturing use different entities and denominators.",
    uncertainty: "The unresolved issue is not a lack of industrial activity. It is the missing bridge between activity and a compatible facility-level operating account. Product definitions move, production interruptions are reported unevenly, receiver acceptance may be separated from contractor delivery, and client-attributed benefits do not establish causal improvement.",
    crossSystem: "Manufacturing evidence becomes more informative when read with power, water, minerals, logistics, standards and workforce files. Those links should expose dependencies rather than turn upstream inputs into explanations. A utility agreement, training cohort or mineral authorization can identify a gate without proving that a line produced accepted output.",
    nextResearch: "The highest-value work is a named-line evidence packet that joins capacity definition, qualification, receiving-party acceptance and repeated output for the same period. Revision history, stoppages and rejected units should travel with the series. National surveys remain valuable context, while facility claims require a separate verification path.",
    publicUse: "Readers can use this review to see why production announcements and industrial-policy totals should not be mistaken for dependable capacity. It also identifies where official program records support a bounded statement and where only a company or program-level account is available.",
  },
  "agriculture-and-bioeconomy": {
    focus: "The topic spans biological production, processing, land, water, energy, logistics and community food systems. Its evidence problem is therefore one of chain identity: a crop, feedstock, facility, product, geography and receiving market have to remain linked before scale or resilience can be described.",
    strength: "Official agricultural statistics, environmental records, energy accounts and food-system context provide substantial baseline material. The strongest records preserve commodity definitions, geography, season and unit. They help identify where a biological resource exists and where processing or delivery capacity remains only planned.",
    uncertainty: "Biological systems are sensitive to weather, disease, input prices, land-use change and measurement revisions. Aggregate production can rise while local access, soil condition or processing resilience deteriorates. A bioeconomy label also combines products with very different conversion efficiencies and market uses.",
    crossSystem: "Agriculture connects directly to water allocation, fertilizer and energy supply, transport, climate exposure, waste handling and local institutions. Cross-topic reading is useful when it keeps the receiving system visible. It becomes misleading when a national commodity total is transferred to a local food-security or bioproduct claim.",
    nextResearch: "Priority should go to repeated, geography-stable records that join biological input, processing yield, usable output, losses and destination. A second lane should examine local adoption and affordability with explicit population denominators. Method notes and revision calendars are essential because seasonal and administrative series often change.",
    publicUse: "The review helps readers separate resource potential from operating supply chains and community outcomes. It shows which questions can be answered with official statistics, which require processor or local-system records, and which remain dependent on a future comparable series.",
  },
  "ai-for-science": {
    focus: "AI-for-science evidence must move beyond inventories of tools and allocations of compute toward named scientific workflows. The relevant question is whether a system changes discovery time, experimental yield, replication, cost or quality under conditions that expose human review and failure handling.",
    strength: "The current corpus documents federal AI-use inventories, research-infrastructure reach and a structured NIST evaluation pilot. These records establish program identity, operating context and evaluation design. They also explicitly preserve the difference between the number of use cases and a measure of scientific benefit.",
    uncertainty: "Comparable outcomes remain the central gap. Active-use labels do not supply accuracy, reliability, cost, incident or mission-benefit denominators. Pilot evaluations can test methods without demonstrating durable use, and aggregate project counts do not show whether access changed the quality or pace of research.",
    crossSystem: "This topic depends on chips, energy, data infrastructure, cybersecurity, measurement standards and institutional adoption. Those dependencies are evidence constraints, not a claim that additional compute produces better science. Each receiving laboratory or workflow needs its own baseline and acceptance rule.",
    nextResearch: "The decisive artifact would pair a named workflow with a prior method or control, stable task definition, repeated quality measures, compute and labor costs, error review and publication or replication outcomes. System cards should also record override, incident and model-update histories.",
    publicUse: "Readers should leave with a disciplined distinction among policy priority, infrastructure availability, evaluation capability, operational use and scientific outcome. The current corpus can support that map, but it cannot yet support a general claim that AI has improved scientific performance.",
  },
  aviation: {
    focus: "Aviation combines aircraft, airports, routes, operators, airspace and propulsion systems. The evidence challenge is to retain the right exposure denominator while separating certification, fleet entry, service delivery and public outcomes.",
    strength: "DOT and BTS preserve recurring carrier-service records with explicit reporting populations, while FAA rules and integration programs identify the authority layer for newer aircraft categories. Measured challenge results add a bounded performance record without implying certification or commercial readiness.",
    uncertainty: "Cancellation, delay, baggage, complaint, safety, emissions, noise and access measures are not interchangeable. Carrier coverage changes, weather and network structure affect comparisons. A prototype or powered-lift rule cannot establish a route-level service outcome, and national rates may obscure airport or fleet conditions.",
    crossSystem: "Aviation depends on energy, manufacturing, airport infrastructure, air-traffic control, cybersecurity and local land-use acceptance. These relationships matter most when a named aircraft, airport or route carries the same identity across authority, implementation and operating records.",
    nextResearch: "The strongest immediate work is to preserve the annual carrier-service series while adding named airport, route and fleet baselines. A later outcome packet should join exposure-compatible safety, reliability, environmental and accessibility measures without combining them into a service score.",
    publicUse: "The review enables readers to distinguish a regulatory milestone from an operating service and to understand what official annual data can and cannot say. It also makes clear why aviation performance should be reported measure by measure rather than as a composite rank.",
  },
  "chips-and-compute": {
    focus: "Chips and compute research has to connect facilities and service systems to qualified output, accepted utility capacity and recurring operation. Capital announcements and construction milestones are important, but they do not establish wafers, compute availability or durable local benefit.",
    strength: "The corpus contains unusually detailed project, utility, water, workforce, permit and regional-load context. Named Phoenix and Northern Virginia records show how land, tariffs, transmission, wastewater and labor become explicit gates around large facilities.",
    uncertainty: "The missing evidence is facility-level and repeated. Public records rarely disclose metered energy and water, qualified wafer output, yield, uptime, customer acceptance or comparable workforce retention. City updates may relay company claims, while regional employment and load data cannot be transferred to one campus.",
    crossSystem: "This topic sits at the intersection of energy, water, advanced manufacturing, critical minerals, cybersecurity and local governance. A useful synthesis follows those dependencies to the named facility and stops when identity or denominator changes.",
    nextResearch: "Mission-decisive work should seek accepted utility-service records, inspection and occupancy artifacts, process qualification, facility-level resource use and repeated output. Bridge evidence can track infrastructure construction and workforce pipelines, while context maintenance preserves regional capacity and demand baselines.",
    publicUse: "Readers can use this review to test claims of semiconductor or compute capacity against the actual conversion chain. The review does not decide whether a facility is successful; it shows which official records would be needed to make a bounded operating or outcome statement.",
  },
  climate: {
    focus: "Climate evidence moves among physical observations, modeled scenarios, exposure, adaptation actions and realized losses. A strong review keeps those claim types separate and states which geography, time window and uncertainty treatment governs each one.",
    strength: "The corpus has broad official statistical, environmental and infrastructure rails, plus named local systems where water, hazard and resilience questions become concrete. This supports careful baseline and conversion analysis without converting a projection into an observed local outcome.",
    uncertainty: "Attribution, scale and timing remain persistent difficulties. National trends do not specify asset exposure, and a resilience plan does not prove reduced loss. Different hazard models, baselines and emissions scenarios can be informative without being numerically compatible.",
    crossSystem: "Climate conditions interact with energy, water, agriculture, mobility, housing, industrial facilities and public finance. Cross-system work should identify which dependency carries the exposure and which institution bears responsibility, rather than assigning one generalized resilience state.",
    nextResearch: "Priority should go to named places and assets with repeated physical observations, service interruptions, adaptation actions, recovery periods and revision-aware denominators. Modeled scenarios should remain attached to their assumptions and should be compared only inside compatible model families.",
    publicUse: "The review gives readers a way to separate hazard context, planned adaptation, implemented protection and measured outcome. It also clarifies when an evidence gap reflects missing local observation rather than uncertainty about the wider physical trend.",
  },
  "critical-minerals": {
    focus: "Critical-minerals evidence begins with material and asset identity. Resources, reserves, mine output, refined material, qualified product and customer receipt are different stages, and national import reliance is not a project operating measure.",
    strength: "USGS annual commodity records provide a strong baseline with methods, units and revision boundaries. Nevada project files add exact land and environmental authorities, finance and pre-operation conditions. Together they support a bounded account of context and permission.",
    uncertainty: "Current mine, refinery and processor capacity is often obscured by incompatible material definitions, company forecasts and undisclosed qualification requirements. A permit authorizes regulated activity but does not prove construction, commissioning, compliant operation or saleable output.",
    crossSystem: "Minerals connect geology, water, energy, transport, finance, manufacturing and community impacts. The chain becomes decision-useful only when the same material specification and asset identity survive from extraction through processing to receiver acceptance.",
    nextResearch: "The immediate research batch should pair USGS commodity baselines with named asset resource definitions, current compliance state and processor capacity. Later work needs commissioning, inspection, qualified-lot and customer-receipt records with repeated output and waste or water measures.",
    publicUse: "Readers can use this review to distinguish strategic importance from delivered supply. It makes official baseline evidence visible while preventing an authorized or financed project from being described as an operating source of qualified material.",
  },
  cybersecurity: {
    focus: "Cybersecurity evidence has to distinguish controls, maturity assessments, detected incidents, losses, recovery and mission or user harm. Reporting quality is itself part of the measurement problem because low counts may reflect weak detection or disclosure.",
    strength: "Annual FISMA and inspector-general records create recurring agency-level control and maturity series. They preserve review scope, recommendation state and method changes. CISA and NIST records add obligations, migration guidance and interoperability context.",
    uncertainty: "Control maturity is not a direct measure of event exposure or avoided harm. Agency methods change, system populations differ and recommendation closure may not establish operating effectiveness. Public loss and recovery data are especially incomplete and can reward under-reporting.",
    crossSystem: "Cybersecurity conditions every digital infrastructure topic, including AI, transport, energy, broadband, space and public administration. The relevant receiving system must be named; a federal policy or standard cannot establish local implementation or service resilience.",
    nextResearch: "The decisive evidence would join a stable system population to detected events, impact, recovery time, mission disruption, corrective action and recurrence. Control assessments remain useful bridge evidence when their scope and method are preserved separately from incident outcomes.",
    publicUse: "The review helps readers understand why a mature-control label and a low incident count answer different questions. It supports bounded comparison within an agency series while refusing a cross-agency security ranking or a claim that controls caused an outcome.",
  },
  "discovery-technologies": {
    focus: "Discovery technologies include observation platforms, metrology, data systems and research instruments. Their public value depends on more than deployment: access, validated products, workflow adoption, discovery quality, replication and cost must be traced separately.",
    strength: "NASA's public NISAR data release establishes an operating observation rail, while NSF, NOAA, NIST and USGS records describe data infrastructure, mapping and metrology programs. These sources identify platforms and access conditions with strong provenance.",
    uncertainty: "Data availability does not demonstrate scientific use or improved discovery. Coverage, processing level, calibration, downstream models and ground truth can change the result. Annual activity reports also summarize work without providing a comparable prior method or control.",
    crossSystem: "These tools serve climate, water, agriculture, infrastructure, minerals and AI research. Cross-topic value should be traced through a named workflow or decision, not inferred from the breadth of possible applications.",
    nextResearch: "The highest-value record would connect a specific platform and dataset to a defined prior method, validated product, user cohort, repeated decision or discovery measure, cost and uncertainty. Archive revisions and processing versions should remain explicit.",
    publicUse: "Readers can use this review to locate real operating data resources and to see why access is an intermediate state rather than an outcome. It keeps promising applications visible without converting potential use into realized benefit.",
  },
  energy: {
    focus: "Energy evidence must preserve the distinction among nameplate capacity, available capacity, delivered energy, reliability, affordability and emissions. Grid and fuel systems also require a clear balancing area, asset, customer class or service territory.",
    strength: "Official operators, regulators and statistical agencies provide extensive recurring data. Named storage, transmission and large-load files show authority, construction and service conditions. These records support strong baselines and conversion-chain analysis.",
    uncertainty: "Different markets, weather periods and accounting methods can make apparently similar measures incompatible. A capacity award or interconnection position does not establish energization, dispatch or reliability value, and modeled savings do not equal observed bills.",
    crossSystem: "Energy links compute, manufacturing, water, minerals, mobility, housing and public finance. The useful question is which accepted service and operating records connect a named asset to a receiving system, not whether one technology is generally superior.",
    nextResearch: "Priority should go to accepted interconnection, commissioning and interval operating records with asset identity, availability, curtailment, outages and service obligations. Cost and emissions analysis should retain market rules, counterfactual assumptions and revision histories.",
    publicUse: "This review helps readers move from capacity headlines to the records that establish operation and service. It supports compatible within-series observations while rejecting cross-market scores built from mismatched prices, reliability definitions or time windows.",
  },
  "finance-and-risk": {
    focus: "Finance and risk evidence asks what capital actually enables, which obligations attach to it and where loss is allocated. Commitment, close, expenditure, physical delivery, service and return are distinct stages.",
    strength: "The corpus includes official awards, loans, tariffs, regulatory decisions, budgets and project files. These records can identify committed scope, legal conditions and named counterparties, giving a strong basis for tracing the conversion path.",
    uncertainty: "Headline values often mix authorized ceilings, announced investment, obligated funds and actual expenditure. Project outcomes may remain undisclosed, while risk transfer, guarantees and public liabilities have different valuation dates and contingencies.",
    crossSystem: "Finance reaches every capital-intensive topic, from housing and transmission to minerals, storage, manufacturing and broadband. It should be treated as one enabling condition rather than an explanation for later delivery or a proxy for project quality.",
    nextResearch: "The decisive record joins a named financial instrument to disbursement, delivered scope, acceptance, service and the disclosed allocation of risk. Comparable analysis also needs currency date, nominal or real treatment, term, counterparty and denominator.",
    publicUse: "Readers can use this review to distinguish permission to spend from completed infrastructure and to understand why investment totals cannot be ranked as outcomes. It keeps public exposure and delivery obligations visible at the named project level.",
  },
  "human-futures": {
    focus: "Human-futures research covers population, work, institutions, access, health, housing and community capacity. The evidence challenge is to define the people and places affected without reducing different dimensions of life to one progress score.",
    strength: "Official statistical systems provide recurring demographic, labor and social baselines. Project and place files add concrete workforce, accessibility and service questions. This creates a strong context layer for studying who receives new capacity and under what conditions.",
    uncertainty: "Aggregate improvement can coexist with unequal access, displacement or unmeasured burden. Administrative categories change, local samples may be small and self-reported experience cannot be substituted for service operation. Causal attribution is rarely available from one series.",
    crossSystem: "Human outcomes receive effects from mobility, housing, digital access, industry, climate, water and public institutions. The relevant analysis should name the cohort, geography, service and period rather than attaching population claims to a nearby project.",
    nextResearch: "Priority should go to cohort-stable records that join availability, actual use, affordability, quality, complaints and persistence. Qualitative evidence can explain mechanisms, but quantitative comparisons need explicit population denominators and missing-data treatment.",
    publicUse: "The review gives readers a structured way to ask who benefits, who bears risk and what evidence would demonstrate durable access. It avoids a universal welfare index while making distributive questions a required part of technical research.",
  },
  mobility: {
    focus: "Mobility evidence must connect networks, routes, fleets and passenger-facing services to exposure, access, reliability, safety and cost. Authority to operate and vehicle miles are not the same as a dependable user outcome.",
    strength: "California DMV testing reports, Amtrak accessibility inventories, DOT carrier data and named regulatory records provide substantial baseline and chronology. They preserve fleet or station identities and expose where reporting definitions differ.",
    uncertainty: "Autonomous testing miles do not measure commercial passenger safety, a recall is not a fleet-wide rate, and station completion does not establish feature uptime or trip usability. Public reporting lacks a comparable service rollup for several named systems.",
    crossSystem: "Mobility depends on energy, digital infrastructure, land use, accessibility, public finance and safety regulation. Cross-mode reading should compare evidence requirements and institutional responsibilities rather than combine miles, stations, flights and riders.",
    nextResearch: "The strongest current batch can establish bounded fleet, testing and station baselines. Outcome work needs exposure-adjusted incidents, service quantity, uptime, accessibility use, complaints, affordability, travel time and emissions for stable geographies and periods.",
    publicUse: "Readers can use the review to understand which operating facts are already public and why the outcome layer remains thinner. It prevents a permit, deployment count or isolated safety event from becoming a generalized mobility-performance claim.",
  },
  "policy-and-standards": {
    focus: "Policy and standards shape what institutions may, must or can consistently do. The evidence task is to separate publication, legal effect, organizational adoption, implementation, conformity, enforcement and realized system change.",
    strength: "The corpus contains legislation, rules, standards, guidance, program conditions and administrative decisions across many topics. Exact document identity and authority make it possible to trace a requirement without assuming that every receiving organization implemented it.",
    uncertainty: "A published standard may be voluntary, a rule may have transition periods and a policy can lack resources or enforcement. Adoption counts often omit configuration, exceptions and continuing conformance. Different jurisdictions also assign authority differently.",
    crossSystem: "Standards and policy connect AI, quantum migration, cybersecurity, aviation, energy, water, construction and accessibility. A comparison is useful when it asks how a requirement enters a named receiving system, not which jurisdiction has the strongest policy.",
    nextResearch: "Priority should go to enactment and effective-date records, named adopters, implementation artifacts, conformity tests, exceptions, corrective action and repeated compliance. The research queue should retain superseded versions and local authority chains.",
    publicUse: "The review helps readers distinguish a normative commitment from operational change. It also explains why standards coverage should not become a jurisdiction ranking and why later acceptance evidence must remain attached to the responsible institution.",
  },
  quantum: {
    focus: "Quantum research must keep computing, sensing, communications and cryptographic migration distinct. Post-quantum standards respond to a future threat; they are not evidence that a quantum computer or sensor achieved an operating outcome.",
    strength: "The corpus has strong NIST and OMB records for post-quantum policy, algorithm selection and migration planning. Those sources establish a real standards-to-adoption pathway and a clear adjacent cybersecurity question.",
    uncertainty: "The current corpus does not contain mission-decisive evidence for quantum-system outcomes. It lacks named workloads, accepted use, benchmark methods, error and uptime series, costs and repeated performance. Reusing cryptographic migration records would create a category error.",
    crossSystem: "Quantum connects research infrastructure, chips, cryogenics, energy, cybersecurity, standards and institutional procurement. These dependencies can define an acquisition search, but none should be used to infer operational quantum advantage.",
    nextResearch: "A genuinely relevant official artifact should come from a national laboratory, metrology institute or user facility and name the task, system, method, acceptance state, repeated observations and comparison boundary. Forecasts and vendor roadmaps remain separate.",
    publicUse: "Readers can use this review to see that the evidence gap is explicit rather than hidden. It preserves useful post-quantum material in its proper domain while directing quantum-outcome research toward official benchmark and accepted-use records.",
  },
  space: {
    focus: "Space evidence spans vehicles, missions, ranges, launch sites, infrastructure and scientific services. Authorization, an individual mission and sustained access each require different records and denominators.",
    strength: "FAA annual licensed-operation counts provide a recurring national activity series. NASA and site records document mission architecture, environmental decisions, infrastructure and public data. These sources create a strong authority-to-activity chronology.",
    uncertainty: "National operation totals do not establish vehicle reliability, Space Coast utilization, mission success, cost, turnaround or community impact. Environmental approval does not prove mitigation performance, and an operational bridge does not establish launch cadence.",
    crossSystem: "Space depends on aviation regulation, manufacturing, energy, communications, environmental review, workforce and local infrastructure. The evidence chain should preserve vehicle, operator, mission and site identity rather than transfer a national trend to one corridor.",
    nextResearch: "Priority should go to vehicle- and site-specific mission manifests, accepted infrastructure, range availability, delays, anomalies, turnaround and repeated service. Cost, environmental monitoring and local outcomes require their own stable periods and denominators.",
    publicUse: "The review lets readers distinguish rapid growth in licensed activity from a conclusion about reliability or public benefit. It makes the Space Coast's open license and operating questions visible without predating a future gate or inferring an outcome.",
  },
  water: {
    focus: "Water evidence must retain source, right, treatment, conveyance, use, discharge, reuse and receiving basin. Provider supply, permitted withdrawal and facility consumption answer different questions.",
    strength: "Official hydrologic, utility, permit and infrastructure sources provide broad baseline coverage. Named industrial and municipal records show how agreements, capital programs and pre-operation conditions shape local delivery.",
    uncertainty: "Regional availability does not prove site service, and planned reclaimed-water infrastructure does not establish completed or metered reuse. Drought, groundwater accounting, quality standards and confidentiality complicate comparison across providers and facilities.",
    crossSystem: "Water connects climate, agriculture, minerals, chips, energy, housing and public health. Cross-system analysis should follow the physical and legal service path to the named user while keeping basin and provider boundaries visible.",
    nextResearch: "Mission-decisive records include accepted service, meter or withdrawal data, treatment performance, discharge compliance, reuse volume, interruptions and revision history. Bridge evidence can track agreements and capital construction, while provider baselines remain context.",
    publicUse: "Readers can use the review to test water-security and industrial-reuse claims against exact operating records. It avoids treating a citywide portfolio, permit ceiling or announced project as measured facility consumption or durable supply.",
  },
};

const queueFor = (audit) => [
  {
    tier: "Mission-decisive",
    artifact_need: audit.requirement_tests.map((test) => test.exact_missing_record).join("; "),
    rationale: `This tier addresses the mission's three copied requirements directly. A reviewer must preserve the named entity, period, definition and denominator and must record a dated disposition for each requirement. Until those records are reviewed, ${audit.mission_id} remains unadjudicated even when nearby context is strong.`,
  },
  {
    tier: "Bridge evidence",
    artifact_need: audit.next_acquisition_action,
    rationale: "Bridge evidence can connect authority, commitment, implementation, validation or acceptance to the decisive record, but it cannot substitute for that record. It is sequenced second because it explains the conversion path and narrows the next search while preserving the stopping point.",
  },
  {
    tier: "Context maintenance",
    artifact_need: `Maintain the ${audit.evidence_note_ids.length} linked context annotations and their exact source identities, revision dates and stated exclusions.`,
    rationale: "Context maintenance protects provenance and freshness. It is valuable for interpretation but is deliberately sequenced after mission-decisive and bridge work. This tier does not imply that the topic, jurisdiction, institution or project performs better or worse.",
  },
];

function horizonAnalysis({ mission, audit, linkedNotes, linkedProjects, linkedPlaces, linkedDossiers }) {
  const requirementNames = audit.requirement_tests.map((test) => test.requirement).join("; ");
  const sourceCount = unique(linkedNotes.flatMap((note) => note.source_ids)).length;
  const strongestContext = `${audit.strongest_current_context.selection_state}. ${audit.strongest_current_context.reason}`;
  const evidenceLimits = audit.evidence_limits.join(" ");
  return `${mission.research_horizon} work begins with the exact question: “${mission.research_contract.question}” The Phase 126 audit retains the upstream answer state and screens title/factual-nucleus overlap for three requirements without deciding whether evidence establishes them. Those requirements are ${requirementNames}. The current review can therefore describe the available shelf and the missing bridge, but it cannot announce a mission answer. For this horizon, the audit records: ${strongestContext} That context resolves through ${linkedNotes.length} Phase 125 annotations and ${sourceCount} source identities; the IDs provide provenance, not a conclusion. ${evidenceLimits} The linked delivery context includes ${linkedProjects.length} project biographies, ${linkedPlaces.length} place biographies and ${linkedDossiers.length} context-only dossiers where exact upstream membership supports the join. Their different stages, geographies and denominators remain separate. The research sequence starts with the exact missing records named by the requirement tests, then uses bridge evidence to follow the conversion path, and finally maintains contextual freshness. This is an editorial work order based on likely ability to answer the stated question. It is not a performance ranking, investment view, policy recommendation or estimate of importance. A later reviewer must date every disposition, retain incompatible definitions and stop at a bounded answer, explicit corpus gap or inadmissibility decision.`;
}

function authoredSections({ profile, workbench, topicNotes, projectBios, placeBios, topicDossiers }) {
  const covered = workbench.mission_links.filter((record) => record.acquisition_coverage === "Covered").length;
  const gaps = workbench.mission_links.length - covered;
  const sources = unique(topicNotes.flatMap((record) => record.source_ids)).length;
  return {
    executive_read: `This state-of-evidence review treats ${workbench.title.replace(" research workbench", "")} as a four-horizon research program rather than a collection of headlines. ${profile.focus} The workbench currently contains ${covered} missions with exact Phase 120 packet joins and ${gaps} with an acquisition-coverage gap. That split describes preparation, not truth or importance: all four missions remain unadjudicated. The review reads the evidence in the inherited Phase 124 order, connects it to ${topicNotes.length} exact Phase 125 annotations and ${sources} source identities, and preserves each Phase 126 requirement test. Its purpose is to show what the corpus can orient, where definitions or denominators break, and which exact record would most improve the next review. ${profile.publicUse}`,
    strongest_current_evidence: `${profile.strength} The topic's strongest current evidence is useful because its identity and limitations are visible. Phase 125 annotations preserve the factual nucleus, excluded inference, provenance reading and research use for every linked signal. Phase 126 then screens title/factual-nucleus language for potential overlap with each mission requirement while leaving semantic relevance and establishment undecided; its disposition remains “Title/factual-nucleus screen complete — mission remains unadjudicated.” This review does not override either layer. It organizes ${projectBios.length} project and ${placeBios.length} place biographies as receiving-system context and ${topicDossiers.length} Phase 123 dossiers as comparison context. A biography may expose a turning point or exact next record, but its inherited stage or state is unchanged. A dossier remains “Context only” even where its shared dependency is highly relevant.`,
    contested_reading: `${profile.uncertainty} The key editorial discipline is to publish the disagreement in the evidence structure rather than resolve it with an estimate. A strong context signal can still fail a mission requirement because the entity, observation period, method or denominator does not match. An In Review boundary can be useful when it explains why a tempting inference is inadmissible, but it is not promoted by appearing here. Failed searches and missing records are described only as limits of the current FTFN corpus; they are never claims that evidence does not exist externally. Conflicting series should remain side by side with their revision and coverage notes. No topic-level average, maturity score, readiness label or directional grade is created.`,
    cross_system_implications: `${profile.crossSystem} The ${topicDossiers.length} linked dossiers are valuable because they make identity, authority, period and denominator differences visible across real delivery systems. They do not authorize a project comparison. The ${projectBios.length + placeBios.length} linked biographies likewise help readers follow where a question becomes local, which institution owns the next record and which stage or system state was inherited from Phase 119. Cross-system interpretation should ask whether evidence structures are analogous, whether the same type of gate recurs and whether a measurement method can travel. It should not transfer an outcome, infer causation from adjacency or treat a place as if every project inside it shared one stage.`,
    research_program: `${profile.nextResearch} Every horizon therefore receives the same three research-value tiers in the same order: Mission-decisive, Bridge evidence and Context maintenance. The labels express editorial sequencing by ability to resolve the exact mission contract. They are not numeric ranks, forecasts of impact or judgments about organizations, technologies or places. Mission-decisive artifacts must answer the copied requirements directly. Bridge evidence may connect adjacent stages while preserving the stop rule. Context maintenance keeps source identities, revisions and boundary notes current. If a decisive artifact cannot be found, the valid next product is a dated corpus-bounded gap or access-blocker record, not a fabricated answer.`,
  };
}

const reviews = workbenches.workbenches.map((workbench, index) => {
  const profile = topicProfiles[workbench.slug];
  if (!profile) throw new Error(`Phase 128 lacks authored topic profile ${workbench.slug}`);
  const topicMissions = workbench.mission_links.map((link) => missionById.get(link.mission_id));
  const topicAudits = topicMissions.map((mission) => auditByMissionId.get(mission?.mission_id));
  if ([...topicMissions, ...topicAudits].some((record) => !record)) throw new Error(`Phase 128 cannot resolve missions or audits for ${workbench.topic_id}`);
  const topicNoteIds = unique(topicAudits.flatMap((audit) => audit.evidence_note_ids));
  const topicNotes = topicNoteIds.map((id) => noteById.get(id));
  if (topicNotes.some((record) => !record)) throw new Error(`Phase 128 cannot resolve a Phase 125 note for ${workbench.topic_id}`);
  const projectBios = workbench.project_links.map((record) => projectBioByAtlasId.get(record.atlas_project_id));
  const placeBios = workbench.place_links.map((record) => placeBioByAtlasId.get(record.atlas_place_id));
  if ([...projectBios, ...placeBios].some((record) => !record)) throw new Error(`Phase 128 cannot resolve a Phase 127 biography for ${workbench.topic_id}`);
  const topicDossiers = workbench.dossier_links.map((link) => dossierById.get(link.dossier_id));
  if (topicDossiers.some((record) => !record)) throw new Error(`Phase 128 cannot resolve a Phase 123 dossier for ${workbench.topic_id}`);
  const horizonSections = topicMissions.map((mission, horizonIndex) => {
    const audit = topicAudits[horizonIndex];
    const linkedNotes = audit.evidence_note_ids.map((id) => noteById.get(id));
    const linkedProjects = mission.relationships.atlas_project_ids.map((id) => projectBioByAtlasId.get(id));
    const linkedPlaces = mission.relationships.atlas_place_ids.map((id) => placeBioByAtlasId.get(id));
    if ([...linkedProjects, ...linkedPlaces].some((record) => !record)) throw new Error(`Phase 128 cannot resolve mission biography joins for ${mission.mission_id}`);
    const linkedDossiers = topicDossiers.filter((record) => record.priority_question_ids.includes(mission.priority_question_id));
    return {
      horizon_section_id: `128-HORIZON-${String(index + 1).padStart(3, "0")}-${String(horizonIndex + 1).padStart(2, "0")}`,
      horizon: mission.research_horizon,
      mission_id: mission.mission_id,
      audit_id: audit.audit_id,
      evidence_note_ids: [...audit.evidence_note_ids],
      project_biography_ids: linkedProjects.map((record) => record.biography_id),
      place_biography_ids: linkedPlaces.map((record) => record.biography_id),
      dossier_ids: linkedDossiers.map((record) => record.dossier_id),
      upstream_answer_state: mission.answer_state,
      audit_disposition: audit.audit_disposition,
      requirement_states: audit.requirement_tests.map((test) => ({ test_id: test.test_id, requirement: test.requirement, review_state: test.review_state })),
      analysis: horizonAnalysis({ mission, audit, linkedNotes, linkedProjects, linkedPlaces, linkedDossiers }),
      next_artifact_queue: queueFor(audit),
      queue_boundary: "Editorial research-value sequence only — not a topic, technology, institution, project, place or performance ranking.",
    };
  });
  const sections = authoredSections({ profile, workbench, topicNotes, projectBios, placeBios, topicDossiers });
  const authoredWordCount = deepWords(sections) + deepWords(horizonSections.map((section) => section.analysis));
  if (authoredWordCount < 900) throw new Error(`${workbench.topic_id} has only ${authoredWordCount} authored Phase 128 words.`);
  return {
    review_id: `128-REVIEW-${String(index + 1).padStart(3, "0")}`,
    workbench_id: workbench.workbench_id,
    topic_id: workbench.topic_id,
    slug: workbench.slug,
    title: `${workbench.title.replace(" research workbench", "")} state of evidence`,
    record_status: "Published",
    review_state: "Open evidence review — missions remain unadjudicated",
    topic_sequence: {
      sequence_basis: "Phase 124 canonical workbench order",
      ordering_boundary: "Presentation order only — not a topic, funding, importance or performance ranking.",
    },
    exact_joins: {
      workbench_id: workbench.workbench_id,
      mission_audit_ids: topicAudits.map((record) => record.audit_id),
      evidence_note_ids: topicNoteIds,
      project_biography_ids: projectBios.map((record) => record.biography_id),
      place_biography_ids: placeBios.map((record) => record.biography_id),
      dossier_ids: topicDossiers.map((record) => record.dossier_id),
    },
    authored_sections: sections,
    horizon_sections: horizonSections,
    authored_word_count: authoredWordCount,
    word_count_basis: "Rendered authored-layer analysis only; excludes route shell, identity fields, queues and boundary fields, but includes recurring structural sentences disclosed in aggregate repetition metrics.",
    route: workbench.route,
    interpretation_boundary: "This topic review sequences research and interprets the current corpus. It does not admit an artifact, close an acquisition gap, answer a mission, advance a conversion stage, create an observation or outcome, infer causation, or score or rank any topic, institution, project or place.",
  };
});

const newHtmlRoutes = ["/review/fieldbook/topic-reviews/"];
const enhancedExistingRoutes = workbenches.workbenches.map((record) => record.route);
const publicJsonExports = ["/data/phase-128-topic-state-of-evidence-reviews.json"];
const analysisPassages = reviews.flatMap((record) => [
  ...Object.values(record.authored_sections),
  ...record.horizon_sections.map((section) => section.analysis),
]);
const registry = {
  schema_version: "1.0",
  program_id: "FTFN-PHASE-128-TOPIC-STATE-OF-EVIDENCE-REVIEWS",
  phase: 128,
  title: "Topic state-of-evidence reviews",
  effective_date: date,
  record_status: "Published",
  status: "Complete",
  summary: "Seventeen topic reviews synthesize all sixty-eight mission horizons through exact evidence-note, mission-audit, biography, dossier and workbench IDs while keeping every mission unadjudicated and every research-value tier explicitly non-performance.",
  publication_boundary: "Phase 128 is an overlay-only interpretive edition. It changes no source, signal, packet, mission, audit, biography, dossier, project, place, conversion, outcome or future-gate state.",
  counts: {
    topic_reviews: reviews.length,
    horizon_reviews: reviews.reduce((sum, record) => sum + record.horizon_sections.length, 0),
    evidence_notes_linked: new Set(reviews.flatMap((record) => record.exact_joins.evidence_note_ids)).size,
    mission_audits_linked: new Set(reviews.flatMap((record) => record.exact_joins.mission_audit_ids)).size,
    project_biographies_linked: new Set(reviews.flatMap((record) => record.exact_joins.project_biography_ids)).size,
    place_biographies_linked: new Set(reviews.flatMap((record) => record.exact_joins.place_biography_ids)).size,
    dossiers_linked: new Set(reviews.flatMap((record) => record.exact_joins.dossier_ids)).size,
    authored_words: reviews.reduce((sum, record) => sum + record.authored_word_count, 0),
    deduplicated_authored_words: deduplicatedPassageWords(analysisPassages),
    authored_8gram_repeat_ratio: Number(ngramRepeatRatio(analysisPassages).toFixed(4)),
    minimum_authored_words_per_review: Math.min(...reviews.map((record) => record.authored_word_count)),
    new_html_routes: newHtmlRoutes.length,
    enhanced_existing_routes: enhancedExistingRoutes.length,
    public_surfaces: newHtmlRoutes.length + enhancedExistingRoutes.length,
    public_json_exports: publicJsonExports.length,
  },
  research_value_contract: {
    tier_order: ["Mission-decisive", "Bridge evidence", "Context maintenance"],
    meaning: "An editorial sequence based on ability to resolve the exact mission contract.",
    forbidden_reading: "The tier order is not a performance, importance, maturity, funding, jurisdiction, organization, project, place or technology ranking.",
  },
  routes: { index: newHtmlRoutes[0], public_export: publicJsonExports[0] },
  new_html_routes: newHtmlRoutes,
  enhanced_existing_routes: enhancedExistingRoutes,
  public_json_exports: publicJsonExports,
  topic_reviews: reviews,
};

const update = {
  id: "update-2026-08-30-phase-128-topic-state-of-evidence-reviews",
  effective_date: date,
  entry_type: "Source Refresh",
  title: "Phase 128 publishes seventeen topic state-of-evidence reviews",
  summary: `The Open Evidence Review adds ${registry.counts.topic_reviews} topic syntheses and ${registry.counts.horizon_reviews} horizon sections with ${registry.counts.authored_words.toLocaleString("en-US")} rendered analysis words and ${registry.counts.deduplicated_authored_words.toLocaleString("en-US")} exact-passage-deduplicated words while preserving every upstream mission and comparison state.`,
  affected_record_ids: reviews.map((record) => record.topic_id),
  related_paths: [...newHtmlRoutes, ...enhancedExistingRoutes, ...publicJsonExports],
  evidence_note: registry.publication_boundary,
  materiality: "No record-state change",
  publication_effect: "Adds one topic-review hub, enhances seventeen existing workbench routes and exposes one schema-1.0 JSON export.",
  next_check_date: null,
  work_package: "docs/work-packages/phase-128-v06-topic-state-of-evidence-reviews.md",
};

const workPackage = `# Phase 128 — Topic State-of-Evidence Reviews\n\n**Status:** Complete  \n**Effective date:** ${date}  \n**Program:** FTFN v0.6 — Open Evidence Review\n\n## Purpose\n\nGive each canonical topic a long-form state-of-evidence review that connects the four research horizons to exact annotations, audits, delivery biographies, comparative dossiers and the existing topic workbench.\n\n## Delivered\n\n- ${registry.counts.topic_reviews} topic reviews in exact Phase 124 order.\n- Exactly ${registry.counts.horizon_reviews} horizon sections: four per topic and one per Phase 121 mission.\n- Exact joins to ${registry.counts.evidence_notes_linked} Phase 125 evidence notes, ${registry.counts.mission_audits_linked} Phase 126 mission audits, ${registry.counts.project_biographies_linked} project biographies, ${registry.counts.place_biographies_linked} place biographies and ${registry.counts.dossiers_linked} Phase 123 dossiers.\n- ${registry.counts.authored_words.toLocaleString("en-US")} rendered authored-layer words and ${registry.counts.deduplicated_authored_words.toLocaleString("en-US")} exact-passage-deduplicated words; the smallest rendered topic review contains ${registry.counts.minimum_authored_words_per_review.toLocaleString("en-US")} words. Route shells, identity fields, queues and boundary fields are excluded; recurring structural sentences remain in the rendered count and are disclosed by an eight-gram repeat ratio of ${registry.counts.authored_8gram_repeat_ratio}.\n- A three-tier next-artifact queue ordered Mission-decisive, Bridge evidence and Context maintenance. The order is editorial research sequencing, never a performance ranking.\n- One new hub, seventeen enhanced existing routes and one direct schema-1.0 JSON export.\n\n## Evidence boundary\n\nAll sixty-eight mission answers remain unadjudicated. Phase 128 does not close any of the twelve acquisition gaps, admit an artifact, change a signal, advance a project, create an outcome or infer external nonexistence. A current-corpus limit remains exactly that: a limit of the current FTFN corpus.\n\n## Completion standard\n\nPhase 128 is complete when the topic, workbench and mission sets are exact; every horizon resolves one Phase 126 audit and its exact Phase 125 note IDs; biography and dossier joins are set-equal to their upstream memberships; every review exceeds 900 rendered authored-layer words outside route and boundary scaffolding; rendered, exact-passage-deduplicated and repeat-ratio metrics are reproducible; the research-value tiers remain non-numeric and non-performance; and all upstream and future-gate states are unchanged.\n`;

await Promise.all([
  writeFile(join(dataRoot, "phase-128-topic-state-of-evidence-reviews.json"), `${JSON.stringify(registry, null, 2)}\n`, "utf8"),
  writeFile(join(appRoot, "src", "content", "updates", "2026-08-30-phase-128-topic-state-of-evidence-reviews.json"), `${JSON.stringify(update, null, 2)}\n`, "utf8"),
  writeFile(join(workspaceRoot, "docs", "work-packages", "phase-128-v06-topic-state-of-evidence-reviews.md"), workPackage, "utf8"),
]);

console.log(`Phase 128 built: ${registry.counts.topic_reviews} topic reviews, ${registry.counts.horizon_reviews} horizon sections, ${registry.counts.authored_words} rendered / ${registry.counts.deduplicated_authored_words} deduplicated analysis words; minimum ${registry.counts.minimum_authored_words_per_review}.`);
