import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, JSON.stringify(value, null, 2) + "\n", "utf8");
const phase95 = await readJson(join(dataRoot, "phase-95-infrastructure-construction-buildings-public-works-territorial-systems-delivery-registry.json"));
const upstream = phase95.commissioning_accessibility_asset_handover_operations_maintenance_adaptation_reconstruction_territorial_value_ledgers;
const labels = (value) => value.split("|").map((item) => item.trim());
const gates = (prefix, value) => labels(value).map((label, index) => ({ gate_id: `${prefix}-${String(index + 1).padStart(2, "0")}`, label }));
const taxonomy = (prefix, value, idKey) => labels(value).map((label, index) => ({ [idKey]: `${prefix}-${String(index + 1).padStart(2, "0")}`, label }));
const inactiveChecks = (items, basis) => items.map((item) => ({ ...item, decision_state: "Inactive", basis }));
const empty = (...names) => Object.fromEntries(names.map((name) => [name, []]));
const shortName = (record) => record.slug.replace(/^95-asl-\d+-/, "");
const common = (record, index, idKey, prefix, slug, kind) => ({
  [idKey]: `${prefix}-${String(index + 1).padStart(3, "0")}-${record.cohort_id}`,
  slug: `${slug}-${String(index + 1).padStart(3, "0")}-${shortName(record)}`,
  record_kind: kind, cohort_id: record.cohort_id, file_id: record.file_id, named_entity: record.named_entity,
  source_ids: record.source_ids, signal_ids: record.signal_ids, evidence_gap_ids: record.evidence_gap_ids,
  canonical_briefing_id: record.canonical_briefing_id, reader_pathway_ids: record.reader_pathway_ids, local_system_ids: record.local_system_ids,
  record_status: "Published", propagation_status: "not_started", first_reviewer_id: null, second_reviewer_id: null,
  automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
});

const mobilityGates = gates("96-MG", "Verified Phase 95 commissioned accessible territorial-system record | Lawful transport, street, accessibility, fare, civil-rights, Indigenous, privacy and intergovernmental authority | Person, household, trip, purpose, origin, destination, mode, operator, place, jurisdiction and period identity | Essential destinations, opportunities, services, care, education, work, culture and community-connection needs | Observed travel demand, suppressed demand, trip chains, time use, caregiving, disability and seasonal variation | Proximity, network reach, first-last mile, transfer, wayfinding, physical access and digital access | Fare, toll, fuel, parking, device, data, time, reliability and total household mobility burden | Walking, cycling, wheelchair, micromobility, transit, shared, private, community and assisted-mobility options | Universal design, step-free access, paratransit, information, sensory, cognitive and language accessibility | Rural, remote, northern, island, cross-border and low-density service conditions | Indigenous rights, jurisdiction, consent, mobility, access, benefit, cultural continuity and knowledge | Age, gender, race, income, disability, migration, household, protected-status and geographic distribution | Safety from traffic violence, harassment, policing, exposure, climate, disaster and digital harms | Complete-trip evidence from departure through transfers, arrival, return and missed or abandoned travel | Alternatives, induced demand, land-use interaction, no-build, demand-management and public-option evidence | Affordability, accessibility, inclusion, rights, distribution and public-value stress tests | No infrastructure availability as automatic usable access | No proximity, route or coverage statistic as automatic completed trip | Independent mobility-rights, accessibility, distribution and public-value review | Human mobility-access decision and dated receipt");
const serviceGates = gates("96-SG", "Adopted mobility-demand, access, affordability and inclusion baseline | Network, corridor, route, stop, station, terminal, service, vehicle, operator, user, jurisdiction and period identity | Walking, cycling, wheelchair, micromobility, street, road, transit, rail, aviation, maritime and intercity topology | Service plan, span, frequency, capacity, stop pattern, connections, timed transfers and disruption alternatives | Timetable, headway, real-time information, booking, ticketing, fares, payment, reservations and passenger rights | Fleet, vehicle, vessel, aircraft, guideway, station, terminal, curb, depot and control-system readiness | Operator, driver, crew, dispatcher, maintainer, controller, responder and workforce-capacity evidence | Operations control, priority, traffic management, signaling, dispatch, incident command and mutual aid | Crash, injury, fatality, near miss, conflict, speed, exposure, harassment and personal-safety evidence | Safe-system design, Vision Zero, maintenance, inspection, enforcement, education and emergency response | On-time performance, headway regularity, completion, cancellation, missed connection, crowding and recovery | Accessibility, affordability, comfort, information, dignity, complaint, compensation and remedy | Weather, wildfire, flood, heat, cold, outage, cyber, labor, equipment and compound-shock continuity | Energy, emissions, air quality, noise, land, water, biodiversity and lifecycle externalities | Road pricing, parking, curb, freight, transit, active-mobility and land-use integration | Public, private, concession, cooperative, community and Indigenous governance and public-return terms | No scheduled service as automatic completed trip | No vehicle throughput as automatic safe mobility | No ridership, speed or on-time statistic as automatic equitable reliable service | Independent operations, safety, accessibility, labor, environment and public-value review | Human service-performance and safety decision | Dated transportation-service, safety and reliability receipt");
const freightGates = gates("96-FG", "Verified Phase 95 asset-service and Phase 96 transportation-network baseline | Shipment, commodity, unit, owner, shipper, carrier, consignee, origin, destination, route, facility, jurisdiction and period identity | Demand, order, service promise, criticality, priority, lead time, delivery window and substitution options | Road, rail, maritime, inland waterway, aviation, pipeline, postal, courier, cargo-bike and intermodal routing | Port, airport, terminal, yard, warehouse, distribution center, curb, locker and last-mile capacity | Booking, reservation, slot, schedule, dwell, transfer, interchange, customs and border process | Vehicle, locomotive, wagon, vessel, aircraft, container, chassis, handling equipment and digital-system readiness | Driver, crew, dockworker, warehouse, dispatcher, customs, maintenance and contractor capacity | Inventory, buffer, cold chain, custody, traceability, security, quality and loss-control evidence | Travel time, dwell, queue, missed connection, damage, loss, cancellation, backlog and delivery-completion evidence | Price, surcharge, contract, liability, insurance, access, demurrage, detention and affordability evidence | Critical goods, food, medicine, energy, water, emergency, defense and remote-community priority | Labor rights, worker safety, hours, fatigue, sanitation, training, voice and remedy | Community safety, traffic, noise, air, water, land, climate, environmental justice and Indigenous rights | Single points of failure, supplier concentration, route concentration, interoperability and substitution | Weather, climate, disaster, cyber, conflict, strike, outage, border and compound-shock stress evidence | Emergency prioritization, mutual aid, public option, rationing, continuity, restoration and recovery | No freight movement as automatic reliable delivery | No throughput, tonnage or container count as automatic community or economic benefit | Independent logistics, labor, community, environment, resilience and public-value review | Human delivery-resilience decision | Dated freight, delivery, resilience and public-value receipt");
const digitalGates = gates("96-DG", "Verified Phase 95 commissioned communications asset and territorial-access baseline | Network, service, spectrum, platform, endpoint, provider, user, community, jurisdiction and period identity | Fixed, mobile, satellite, broadcast, radio, public-safety, emergency and community-network topology | Backhaul, middle mile, last mile, tower, fiber, cable, wireless, exchange, data center and power dependencies | Advertised, engineered, measured and experienced coverage, speed, latency, loss, capacity and availability | Subscription, device, installation, data, roaming, overage, taxes, fees and total household affordability | Physical, sensory, cognitive, language, age, disability and assisted-digital accessibility | Identity, authentication, payments, data exchange, registries, messaging and digital-public-infrastructure services | Open standards, interfaces, portability, federation, discovery, addressing and semantic interoperability | Privacy, consent, cybersecurity, safety, encryption, surveillance, content integrity and data-rights protection | Universal service, public option, community network, cooperative, municipal, Indigenous and shared-infrastructure models | Rural, remote, northern, island, low-income, Indigenous and disaster-affected territorial access | Provider, vendor, cloud, platform, equipment, spectrum and route concentration and lock-in evidence | Workforce, installation, operations, maintenance, security, repair, spare, upgrade and lifecycle capacity | Outage, congestion, interference, cyberattack, disaster, power loss and compound-shock continuity | Emergency alerts, public safety, mutual aid, priority access, backup, restoration and community communication | Environmental, energy, water, materials, e-waste, land, rights-of-way and lifecycle externalities | Public-interest governance, procurement, transparency, accountability, complaint, compensation and remedy | No network coverage as automatic affordable reliable connectivity | No service availability as automatic meaningful use or public value | No restored route or signal as automatic community recovery | Independent technical, affordability, accessibility, rights, security and public-value review | Human connectivity, interoperability and territorial-access decision | Dated network-service, rights, resilience and public-value receipt");

const mobilityClasses = taxonomy("96-MCL", "Daily essential trips | Work and livelihood trips | Education and training trips | Health and care trips | Shopping and service trips | Social, cultural and civic trips | Walking and rolling | Cycling and micromobility | Public and community transit | Private and shared vehicles | Assisted and paratransit mobility | Rural, remote and northern mobility | Indigenous and treaty mobility | Evacuation, return and recovery mobility", "mobility_demand_access_class_id");
const mobilityDimensions = taxonomy("96-MAD", "Destination proximity | Network reach and connectivity | Complete-trip accessibility | Travel-time burden | Reliability and predictability | Household affordability | Personal and traffic safety | Information and wayfinding | Comfort and dignity | Rural and remote availability | Distribution and inclusion | Independent mobility public-value review", "mobility_access_dimension_id");
const mobilitySafeguards = taxonomy("96-MRS", "No infrastructure availability as usable access | No proximity as completed trip | Complete person, trip and purpose identity | Universal design and disability rights | Affordable fares, tolls and total trip costs | Safe travel without violence or harassment | Gender, age, race and protected-status equity | Caregiver and trip-chain recognition | Rural, remote and Indigenous jurisdiction | Privacy and data minimization | Complaint, correction and remedy | Independent rights and distribution audit", "mobility_rights_safeguard_id");
const serviceClasses = taxonomy("96-SCL", "Walking and pedestrian networks | Cycling and micromobility networks | Local and regional bus | Bus rapid transit | Metro, subway and light rail | Commuter and regional rail | Intercity and high-speed rail | Streets, roads and highways | Ferries and coastal passenger service | Aviation and airports | Rural and remote community transport | Paratransit and assisted service | Intermodal stations and terminals | Emergency and evacuation transport", "transportation_service_network_class_id");
const serviceDimensions = taxonomy("96-TSD", "Network completeness | Service span and frequency | Capacity and crowding | Transfer and connection quality | On-time and headway reliability | Trip completion and cancellation | Safe-system performance | Accessibility and universal design | Affordability and passenger rights | Workforce and maintenance readiness | Emergency continuity and recovery | Independent service public-value review", "transportation_service_dimension_id");
const serviceSafeguards = taxonomy("96-TGS", "No schedule as completed trip | No throughput as safe mobility | Complete route, vehicle, operator and user identity | Safe-system and Vision Zero duty | Accessible vehicles, stops and information | Fair fares, payment and passenger rights | Worker safety, fatigue control and voice | Public, community and Indigenous governance | Climate, air, noise and lifecycle integrity | Open data and interoperable ticketing | Complaint, compensation and remedy | Independent safety and service audit", "transportation_governance_safeguard_id");
const freightClasses = taxonomy("96-FCL", "Road freight and trucking | Freight rail | Maritime shipping | Inland waterway freight | Air cargo | Pipeline transport | Postal and parcel networks | Courier and urban delivery | Cargo bikes and low-impact delivery | Ports and marine terminals | Airports and cargo terminals | Rail yards and intermodal terminals | Warehouses and distribution centers | Critical, emergency and remote supply", "freight_network_class_id");
const freightDimensions = taxonomy("96-FRD", "Order and service promise | Capacity and slot availability | Route and modal optionality | Transfer and intermodal reliability | Border and customs performance | Dwell, queue and lead time | Delivery completion and quality | Inventory and cold-chain integrity | Cost and contractual fairness | Labor capacity and safety | Shock continuity and restoration | Independent delivery public-value review", "freight_delivery_resilience_dimension_id");
const freightSafeguards = taxonomy("96-FGS", "No movement as reliable delivery | No throughput as community benefit | Complete shipment and custody identity | Worker safety, hours and voice | Fair contracting and prompt payment | Community traffic, noise and safety | Environmental and climate integrity | Indigenous rights and territorial access | Critical-goods priority and public option | Anti-concentration and route diversity | Complaint, restitution and remedy | Independent labor, community and resilience audit", "freight_public_value_safeguard_id");
const digitalClasses = taxonomy("96-DCL", "Fixed fiber broadband | Cable and fixed-wireless access | Mobile terrestrial networks | Satellite connectivity | Community and municipal networks | Indigenous-owned networks | Public safety and emergency radio | Broadcast and public media networks | Internet exchange and backhaul | Data centers and cloud regions | Digital identity and authentication | Payments and transaction rails | Public registries and data exchange | Emergency communication and restoration", "digital_network_class_id");
const digitalDimensions = taxonomy("96-DAD", "Territorial coverage | Experienced speed and latency | Capacity and congestion | Reliability and outage performance | Household and community affordability | Device and installation access | Accessible and meaningful use | Interoperability and portability | Privacy, security and data rights | Provider diversity and public options | Emergency continuity and restoration | Independent connectivity public-value review", "digital_access_dimension_id");
const digitalSafeguards = taxonomy("96-DGS", "No coverage as affordable reliable connectivity | No availability as meaningful use | No restored route as community recovery | Complete network, provider and user identity | Universal service and affordability duty | Accessibility and language inclusion | Privacy, consent and data minimization | Cybersecurity, encryption and safety | Open standards and anti-lock-in | Community and Indigenous governance | Complaint, compensation and remedy | Independent technical and rights audit", "digital_rights_safeguard_id");
const longHorizonTests = taxonomy("96-LHT", "Universal safe affordable mobility | Complete accessible daily trip chains | Zero traffic deaths and serious injuries | Reliable low-carbon multimodal service | Resilient fair freight and critical delivery | Universal affordable reliable connectivity | Interoperable rights-preserving digital infrastructure | Skilled safe voice-rich transport and network work | Rural, remote and Indigenous territorial access | Climate-ready redundant transport and communications | Emergency continuity with equitable restoration | Long-horizon territorial access under compound shocks", "long_horizon_access_test_id");

const mobilityDossiers = upstream.map((record, index) => ({
  ...common(record, index, "passenger_mobility_demand_accessibility_affordability_inclusion_dossier_id", "96-MAD", "96-mad", "passenger_mobility_demand_accessibility_affordability_inclusion_dossier"),
  commissioning_accessibility_asset_handover_operations_maintenance_adaptation_reconstruction_territorial_value_ledger_id: record.commissioning_accessibility_asset_handover_operations_maintenance_adaptation_reconstruction_territorial_value_ledger_id,
  mobility_state: "Inactive - No Verified Phase 95 Commissioned Territorial-System Record", mobility_decision: "Not Open",
  mobility_checks: inactiveChecks(mobilityGates, "No verified Phase 95 commissioned territorial-system predecessor or Phase 96 mobility-access receipt exists."),
  mobility_demand_access_class_records: mobilityClasses.map((item) => ({ ...item, class_state: "Unassessed" })),
  mobility_access_dimension_records: mobilityDimensions.map((item) => ({ ...item, dimension_state: "Not Measured" })),
  mobility_rights_safeguard_records: mobilitySafeguards.map((item) => ({ ...item, safeguard_state: "Unverified" })),
  ...empty("verified_phase95_territorial_system_records", "person_records", "household_records", "trip_records", "purpose_records", "origin_records", "destination_records", "mode_records", "accessibility_records", "affordability_records", "safety_records", "distribution_records", "review_records", "correction_records", "remedy_records"),
  mobility_receipt_id: null, infrastructure_availability_as_usable_access_allowed: false, automatic_mobility_access_decision_allowed: false
}));
const serviceLedgers = upstream.map((record, index) => ({
  ...common(record, index, "multimodal_transportation_service_planning_operations_safety_reliability_ledger_id", "96-TSL", "96-tsl", "multimodal_transportation_service_planning_operations_safety_reliability_ledger"),
  passenger_mobility_demand_accessibility_affordability_inclusion_dossier_id: mobilityDossiers[index].passenger_mobility_demand_accessibility_affordability_inclusion_dossier_id,
  service_state: "Inactive - No Adopted Mobility-Access Baseline", service_decision: "Not Open",
  service_checks: inactiveChecks(serviceGates, "No adopted mobility-access baseline or Phase 96 transportation-service receipt exists."),
  transportation_service_network_class_records: serviceClasses.map((item) => ({ ...item, class_state: "Unassessed" })),
  transportation_service_dimension_records: serviceDimensions.map((item) => ({ ...item, dimension_state: "Not Measured" })),
  transportation_governance_safeguard_records: serviceSafeguards.map((item) => ({ ...item, safeguard_state: "Unverified" })),
  ...empty("network_records", "route_records", "stop_records", "station_records", "terminal_records", "schedule_records", "fare_records", "vehicle_records", "operator_records", "workforce_records", "safety_records", "incident_records", "reliability_records", "accessibility_records", "continuity_records", "review_records", "correction_records", "remedy_records"),
  service_receipt_id: null, scheduled_service_as_completed_trip_allowed: false, vehicle_throughput_as_safe_mobility_allowed: false, automatic_service_safety_or_reliability_decision_allowed: false
}));
const freightRegisters = upstream.map((record, index) => ({
  ...common(record, index, "freight_goods_movement_intermodal_logistics_delivery_resilience_register_id", "96-FRR", "96-frr", "freight_goods_movement_intermodal_logistics_delivery_resilience_register"),
  multimodal_transportation_service_planning_operations_safety_reliability_ledger_id: serviceLedgers[index].multimodal_transportation_service_planning_operations_safety_reliability_ledger_id,
  freight_state: "Inactive - No Verified Transportation-Network Baseline", freight_decision: "Not Open",
  freight_checks: inactiveChecks(freightGates, "No verified transportation-network baseline or Phase 96 freight-delivery receipt exists."),
  freight_network_class_records: freightClasses.map((item) => ({ ...item, class_state: "Unassessed" })),
  freight_delivery_resilience_dimension_records: freightDimensions.map((item) => ({ ...item, dimension_state: "Not Measured" })),
  freight_public_value_safeguard_records: freightSafeguards.map((item) => ({ ...item, safeguard_state: "Unverified" })),
  ...empty("shipment_records", "commodity_records", "carrier_records", "route_records", "facility_records", "terminal_records", "border_records", "workforce_records", "inventory_records", "custody_records", "delivery_records", "cost_records", "safety_records", "environment_records", "continuity_records", "restoration_records", "review_records", "correction_records", "remedy_records"),
  freight_receipt_id: null, freight_movement_as_reliable_delivery_allowed: false, automatic_delivery_resilience_decision_allowed: false
}));
const digitalLedgers = upstream.map((record, index) => ({
  ...common(record, index, "communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_ledger_id", "96-DAL", "96-dal", "communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_ledger"),
  freight_goods_movement_intermodal_logistics_delivery_resilience_register_id: freightRegisters[index].freight_goods_movement_intermodal_logistics_delivery_resilience_register_id,
  passenger_mobility_demand_accessibility_affordability_inclusion_dossier_id: mobilityDossiers[index].passenger_mobility_demand_accessibility_affordability_inclusion_dossier_id,
  digital_state: "Inactive - No Verified Commissioned Communications-Network Baseline", digital_decision: "Not Open",
  digital_checks: inactiveChecks(digitalGates, "No verified commissioned communications-network baseline or Phase 96 territorial-access receipt exists."),
  digital_network_class_records: digitalClasses.map((item) => ({ ...item, class_state: "Unassessed" })),
  digital_access_dimension_records: digitalDimensions.map((item) => ({ ...item, dimension_state: "Not Measured" })),
  digital_rights_safeguard_records: digitalSafeguards.map((item) => ({ ...item, safeguard_state: "Unverified" })),
  long_horizon_access_test_records: longHorizonTests.map((item) => ({ ...item, test_state: "Not Tested" })),
  ...empty("network_records", "service_records", "spectrum_records", "provider_records", "coverage_records", "performance_records", "affordability_records", "device_records", "interoperability_records", "digital_public_infrastructure_records", "privacy_records", "security_records", "outage_records", "restoration_records", "community_network_records", "indigenous_network_records", "environment_records", "review_records", "correction_records", "remedy_records"),
  digital_receipt_id: null, network_coverage_as_affordable_reliable_connectivity_allowed: false, restored_route_as_community_recovery_allowed: false, automatic_connectivity_or_territorial_access_decision_allowed: false
}));

const registry = {
  schema_version: "1.0", phase: "96", title: "Mobility, Transportation, Freight, Communications, Digital Networks And Territorial Access", effective_date: "2026-08-27", record_status: "Published", operating_state: "governed_empty_state",
  decision_boundary: "This registry does not create a trip, access, affordability, safety, service, reliability, delivery, freight, connectivity, interoperability, restoration, community-recovery, receipt, score, rank, Phase 64 advance, or operating-outcome decision.",
  interpretation_boundary: "Infrastructure availability is not usable access. A scheduled service is not a completed trip. Vehicle throughput is not safe mobility. Freight movement is not reliable delivery. Network coverage is not affordable reliable connectivity. A restored route is not community recovery.",
  mobility_gates: mobilityGates, service_gates: serviceGates, freight_gates: freightGates, digital_gates: digitalGates,
  mobility_demand_access_classes: mobilityClasses, mobility_access_dimensions: mobilityDimensions, mobility_rights_safeguards: mobilitySafeguards,
  transportation_service_network_classes: serviceClasses, transportation_service_dimensions: serviceDimensions, transportation_governance_safeguards: serviceSafeguards,
  freight_network_classes: freightClasses, freight_delivery_resilience_dimensions: freightDimensions, freight_public_value_safeguards: freightSafeguards,
  digital_network_classes: digitalClasses, digital_access_dimensions: digitalDimensions, digital_rights_safeguards: digitalSafeguards, long_horizon_access_tests: longHorizonTests,
  passenger_mobility_demand_accessibility_affordability_inclusion_dossiers: mobilityDossiers,
  multimodal_transportation_service_planning_operations_safety_reliability_ledgers: serviceLedgers,
  freight_goods_movement_intermodal_logistics_delivery_resilience_registers: freightRegisters,
  communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_ledgers: digitalLedgers,
  metrics: { verified_phase95_territorial_system_records_received: 0, mobility_access_decisions: 0, transportation_service_safety_reliability_decisions: 0, freight_delivery_resilience_decisions: 0, connectivity_territorial_access_decisions: 0, independent_reviews_completed: 0, receipts_created: 0, scores_created: 0, rankings_created: 0, phase64_cells_advanced: 0 }
};
await writeJson(join(dataRoot, "phase-96-mobility-transportation-freight-communications-digital-networks-territorial-access-registry.json"), registry);

const guideDefinitions = [
  ["mobility-transportation-freight-communications-digital-networks-territorial-access-doctrine-001", "Mobility, Transportation, Freight, Communications, Digital Networks And Territorial Access Doctrine 001", "A governed doctrine from human mobility and transport service through reliable delivery and universal digital access."],
  ["travel-demand-accessibility-proximity-complete-trips-001", "Travel Demand, Accessibility, Proximity And Complete Trips 001", "Trace why, whether and how people complete essential trips without substituting proximity for access."],
  ["walking-cycling-wheelchair-micromobility-public-realm-001", "Walking, Cycling, Wheelchair, Micromobility And Public Realm 001", "Govern safe, dignified and universally accessible movement through streets and public places."],
  ["roads-streets-traffic-safety-vision-zero-001", "Roads, Streets, Traffic Safety And Vision Zero 001", "Separate vehicle flow from safe-system performance, access and public value."],
  ["public-transit-rail-schedules-fares-service-quality-001", "Public Transit, Rail, Schedules, Fares And Service Quality 001", "Trace scheduled service through affordability, accessibility, reliability and completed trips."],
  ["aviation-maritime-ports-intercity-rural-remote-mobility-001", "Aviation, Maritime, Ports, Intercity, Rural And Remote Mobility 001", "Govern long-distance and geographically constrained mobility without erasing territorial difference."],
  ["freight-intermodal-terminals-last-mile-reliable-delivery-001", "Freight, Intermodal Terminals, Last Mile And Reliable Delivery 001", "Trace goods from service promise and custody through transfer, last mile and completed delivery."],
  ["transport-labor-operations-maintenance-state-of-good-repair-001", "Transport Labor, Operations, Maintenance And State Of Good Repair 001", "Connect safe skilled work, operations control, maintenance and renewal to service reliability."],
  ["communications-broadband-mobile-satellite-universal-connectivity-001", "Communications, Broadband, Mobile, Satellite And Universal Connectivity 001", "Separate advertised coverage from affordable, reliable and meaningfully usable connectivity."],
  ["digital-public-infrastructure-interoperability-data-rights-cybersecurity-001", "Digital Public Infrastructure, Interoperability, Data Rights And Cybersecurity 001", "Govern shared digital rails through open standards, rights, security and public accountability."],
  ["emergency-continuity-evacuation-restoration-community-recovery-001", "Emergency Continuity, Evacuation, Restoration And Community Recovery 001", "Trace continuity and restoration without treating a reopened route or signal as recovery."],
  ["territorial-access-affordability-equity-indigenous-mobility-long-horizon-001", "Territorial Access, Affordability, Equity, Indigenous Mobility And Long Horizon 001", "Stress-test mobility and connectivity across geography, jurisdiction, distribution and compound shocks."]
];
const sourceIds = [...new Set(upstream.flatMap((record) => record.source_ids))];
const signalIds = [...new Set(upstream.flatMap((record) => record.signal_ids))];
const evidenceGapIds = [...new Set(upstream.flatMap((record) => record.evidence_gap_ids))];
const localSystemIds = [...new Set(upstream.flatMap((record) => record.local_system_ids))];
const yamlList = (items) => items.map((item) => `  - "${item}"`).join("\n");
const sharedBody = `
## Governed mobility and network-access chain

Phase 96 begins only after a verified Phase 95 commissioned territorial-system record. It separates passenger mobility demand, affordability and inclusion; multimodal service planning, operations, safety and reliability; freight and reliable delivery; then communications, digital public infrastructure, interoperability and territorial access. Each transition requires authority, exact identities, baselines, dependencies, distribution, alternatives, stress tests, independent review, a human decision and a dated receipt.

## Mobility access and complete trips

Trace trip purpose, origins and destinations, proximity, time, cost, accessibility, safety, suppressed demand and distribution. Infrastructure availability is not usable access, and proximity is not a completed trip.

## Transportation service and safety

Trace networks, schedules, fares, vehicles, workforce, operations, reliability, accessibility, safe-system performance and continuity. A scheduled service is not a completed trip, and vehicle throughput is not safe mobility.

## Freight and reliable delivery

Trace orders, custody, routes, terminals, borders, workers, inventory, costs, externalities, continuity and final delivery. Freight movement is not reliable delivery.

## Communications and territorial access

Trace coverage, experienced performance, affordability, devices, accessibility, interoperability, privacy, security, public options, outages and restoration. Network coverage is not affordable reliable connectivity, and a restored route is not community recovery.

## Decision boundary

The registry is deliberately empty. It contains no verified Phase 95 predecessor, trip, service, safety, delivery, connectivity, interoperability, restoration or recovery decision; no review or receipt; and no score, rank, Phase 64 advance or operating-outcome change.
`;
const guideIds = [];
for (const [slug, title, summary] of guideDefinitions) {
  const id = `briefing-${slug}`; guideIds.push(id);
  await writeFile(join(contentRoot, "briefings", id + ".mdx"), `---\nid: "${id}"\ntitle: "${title}"\nslug: "${slug}"\nrecord_status: "Published"\nsummary: "${summary}"\npublished_date: 2026-08-27\ncaptured_date: 2026-08-27\nsignal_ids:\n${yamlList(signalIds)}\nevidence_gap_ids:\n${yamlList(evidenceGapIds)}\nclaim_scope: "Editorial Synthesis"\nlocal_evidence_level: "General Source Layer"\nlast_reviewed_date: 2026-08-27\ntop_takeaways:\n  - "Mobility and network access require separate human, service, delivery and connectivity records."\n  - "Availability, schedules, throughput, movement, coverage and restoration cannot substitute for verified outcomes."\n  - "No trip, safety, delivery, connectivity, score, ranking or territorial-outcome decision is created by this guide."\nconstraint_watch:\n  - "Public Trust"\n  - "Infrastructure"\n  - "Capital"\n  - "Labor"\n  - "Regulation"\n  - "Interpretation"\nwhat_to_watch_next:\n  - "A verified Phase 95 commissioned territorial-system record"\n  - "Separately reviewed mobility, service, freight and connectivity decisions"\n  - "Real dated complete-trip, safety, delivery, reliability and access receipts"\n---\n\n${summary}\n${sharedBody}`, "utf8");
}

const mapDefinitions = [
  ["infrastructure-availability-is-not-usable-access", "Infrastructure Availability Is Not Usable Access", "From an available asset through accessible paths, information, affordability, safety, service and complete-trip evidence."],
  ["scheduled-service-is-not-completed-trip", "A Scheduled Service Is Not A Completed Trip", "From timetable and fare through arrival, boarding, transfers, disruption, accessibility, destination and return."],
  ["vehicle-throughput-is-not-safe-mobility", "Vehicle Throughput Is Not Safe Mobility", "From traffic flow through safe-system design, exposure, conflicts, injuries, accessibility, mode choice and public-realm outcomes."],
  ["freight-movement-is-not-reliable-delivery", "Freight Movement Is Not Reliable Delivery", "From departure and throughput through custody, transfers, dwell, condition, last mile, receipt and service promise."],
  ["network-coverage-is-not-affordable-reliable-connectivity", "Network Coverage Is Not Affordable Reliable Connectivity", "From mapped availability through subscription, device, performance, accessibility, rights, security and meaningful use."],
  ["restored-route-is-not-community-recovery", "A Restored Route Is Not Community Recovery", "From reopened transport or communications through equitable access, return, livelihoods, care, culture, safety and durable recovery."]
];
const mapIds = [];
for (const [slug, title, summary] of mapDefinitions) {
  const id = `dependency-map-${slug}`; mapIds.push(id);
  await writeJson(join(contentRoot, "dependency-maps", slug + ".json"), {
    id, title, slug, summary, map_type: "Dependency Stack", record_status: "Published", primary_topic: "Human Futures", framework_layers: ["Human Systems", "Enabling Infrastructure", "Frontier Domains"], constraint_tags: ["Public Trust", "Infrastructure", "Capital", "Labor", "Regulation", "Interpretation"],
    map_question: `What records are required before ${title.toLowerCase()} can support a bounded mobility or territorial-access decision?`, interpretation_boundary: registry.interpretation_boundary, source_ids: sourceIds, signal_ids: signalIds, technology_ids: [], local_system_ids: localSystemIds, evidence_gap_ids: evidenceGapIds,
    nodes: [
      { id: "node-assets", label: "Verified Phase 95 commissioned territorial systems", node_type: "Evidence Gap", record_id: "gap-016", note: "No qualifying Phase 95 record exists." },
      { id: "node-mobility", label: "Mobility demand, access, affordability and inclusion", node_type: "Constraint", note: "Availability is not usable access." },
      { id: "node-service", label: "Multimodal service, operations, safety and reliability", node_type: "Constraint", note: "Schedules and throughput are not completed or safe trips." },
      { id: "node-freight", label: "Freight custody, logistics and reliable delivery", node_type: "Constraint", note: "Movement is not delivery." },
      { id: "node-digital", label: "Affordable reliable connectivity and territorial access", node_type: "Constraint", note: "Coverage and restoration are not use or recovery." },
      { id: "node-receipt", label: "Independent review, challenge, correction, remedy and receipts", node_type: "Evidence Gap", record_id: "gap-016", note: "No Phase 96 receipt exists." }
    ],
    links: [["node-assets","node-mobility"],["node-mobility","node-service"],["node-service","node-freight"],["node-freight","node-digital"],["node-digital","node-receipt"]].map(([from,to]) => ({ from, to, relationship: "Depends On", confidence: "Missing Evidence", note: "The downstream decision remains closed until its predecessor is reviewed and receipted." })),
    what_this_map_supports: ["Separate mobility, transport-service, freight-delivery, connectivity and recovery decisions.", "Explicit authority, identities, baselines, dependencies, distribution, alternatives, stress, review and remedy.", "Public reasoning without person, route, operator, carrier, provider, community, place, jurisdiction or country scoring or ranking."],
    what_this_map_does_not_prove: ["It does not establish a completed trip, safe service, reliable delivery, usable connectivity or community recovery.", "It does not convert availability, schedules, throughput, movement, coverage or restoration into outcomes.", "It does not create a receipt, score, rank, stage advance or operating-outcome change."],
    next_records_needed: ["A verified Phase 95 commissioned territorial-system chain.", "Separately adopted mobility, service, freight and digital-access decisions.", "Independent accessibility, safety, labor, rights, delivery, connectivity, recovery, correction and propagation receipts."]
  });
}

const pathwayIds = [...new Set(mobilityDossiers.flatMap((record) => record.reader_pathway_ids))];
for (const pathwayId of pathwayIds) {
  const path = join(contentRoot, "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json");
  const pathway = await readJson(path);
  pathway.briefing_ids = [...new Set([...(pathway.briefing_ids ?? []), ...guideIds])];
  pathway.dependency_map_ids = [...new Set([...(pathway.dependency_map_ids ?? []), ...mapIds])];
  pathway.last_reviewed_date = "2026-08-27";
  await writeJson(path, pathway);
}
for (let index = 0; index < upstream.length; index += 1) {
  const source = upstream[index];
  const records = [mobilityDossiers[index], serviceLedgers[index], freightRegisters[index], digitalLedgers[index]];
  const path = join(contentRoot, "briefings", source.canonical_briefing_id + ".mdx");
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 96 mobility, transportation, freight, communications, digital-networks, and territorial-access boundary")) {
    const links = records.map((record) => { const value = Object.values(record).find((item) => typeof item === "string" && /^96-(MAD|TSL|FRR|DAL)-/.test(item)); return `[${value}](/evidence/mobility-transportation-freight-communications-digital-networks/${record.slug}/)`; });
    body = body.trimEnd() + `\n\n## Phase 96 mobility, transportation, freight, communications, digital-networks, and territorial-access boundary\n\nThe [Mobility, Transportation, Freight, Communications, Digital Networks And Territorial Access Registry](/evidence/mobility-transportation-freight-communications-digital-networks/) assigns ${links.join(", ")} to this named file. No trip, safety, service, delivery, connectivity, restoration, recovery, receipt, score, rank, or Phase 64 cell change exists.\n`;
    await writeFile(path, body, "utf8");
  }
}
const localFiles = ["local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor.mdx"];
for (const filename of localFiles) {
  const path = join(contentRoot, "local-systems", filename); let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 96 mobility, transportation, freight, communications, digital-networks, and territorial-access boundary")) {
    body = body.trimEnd() + "\n\n## Phase 96 mobility, transportation, freight, communications, digital-networks, and territorial-access boundary\n\nThe [Mobility, Transportation, Freight, Communications, Digital Networks And Territorial Access Registry](/evidence/mobility-transportation-freight-communications-digital-networks/) connects this place to trip demand, multimodal services, safe operations, reliable freight delivery, universal communications, digital public infrastructure, interoperability and territorial access. Availability, schedules, throughput, movement, coverage and restoration do not establish outcomes.\n";
    await writeFile(path, body, "utf8");
  }
}
const operatingBriefings = ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-public-investment-doctrine-001.mdx", "briefing-procurement-vendor-lockin-public-options-001.mdx", "briefing-public-wealth-balance-sheet-001.mdx", "briefing-cooperatives-employee-ownership-public-employment-001.mdx", "briefing-worker-voice-organizing-collective-bargaining-001.mdx", "briefing-platform-gig-informal-contingent-work-001.mdx", "briefing-distributional-public-balance-sheets-001.mdx", "briefing-community-wealth-universal-supports-public-options-001.mdx", "briefing-cross-case-public-authority-001.mdx", "briefing-shared-public-value-allocation-001.mdx"];
for (const name of operatingBriefings) {
  const path = join(contentRoot, "briefings", name); let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 96 mobility, transportation, freight, communications, digital-networks, and territorial-access control")) {
    body = body.trimEnd() + "\n\n## Phase 96 mobility, transportation, freight, communications, digital-networks, and territorial-access control\n\nThe [Mobility, Transportation, Freight, Communications, Digital Networks And Territorial Access Registry](/evidence/mobility-transportation-freight-communications-digital-networks/) adds eight inactive mobility-access dossiers, eight inactive transportation-service ledgers, eight inactive freight-delivery registers, and eight inactive digital-access ledgers. It creates zero trip, safety, service, delivery, connectivity, restoration, recovery, receipt, score, ranking, or stage decisions.\n";
    await writeFile(path, body, "utf8");
  }
}
await writeJson(join(contentRoot, "updates", "2026-08-27-phase-96-mobility-transportation-freight-communications-digital-networks-territorial-access.json"), {
  id: "update-2026-08-27-phase-96-mobility-transportation-freight-communications-digital-networks-territorial-access", effective_date: "2026-08-27", entry_type: "Source Refresh", title: "Phase 96 adds mobility, transportation, freight, communications, digital-network, and territorial-access controls", summary: "Eight inactive mobility-access dossiers, eight transportation-service ledgers, eight freight-delivery registers, and eight digital-access ledgers expose the network-access contract without deciding a trip, safe service, reliable delivery, affordable connectivity, restoration, recovery, score, rank, or outcome for a person, route, operator, carrier, provider, community, place, institution, jurisdiction, or country.", affected_record_ids: [...guideIds, ...mapIds, "briefing-outcomes-watch-001-what-actually-changed", "gap-015", "gap-016"], related_paths: ["/evidence/mobility-transportation-freight-communications-digital-networks/", ...guideDefinitions.map(([slug]) => `/briefings/${slug}/`), "/data/mobility-transportation-freight-communications-digital-networks-territorial-access.json"], evidence_note: "This release contains empty mobility, service, freight and digital-access contracts plus synthetic-only validation. It contains no verified Phase 95 predecessor or Phase 96 decision or receipt.", materiality: "No record-state change", publication_effect: "Adds twelve Published briefings, six Published maps, one searchable registry with thirty-two detail routes, one public export, and reader-surface integrations while leaving all evidence, territorial-system, mobility, service, delivery, connectivity and operating states unchanged.", next_check_date: "2026-09-01", work_package: "docs/work-packages/phase-96-mobility-transportation-freight-communications-digital-networks-territorial-access.md"
});

console.log(`Phase 96 content built: ${mobilityDossiers.length} inactive mobility-access dossiers, ${serviceLedgers.length} inactive service ledgers, ${freightRegisters.length} inactive freight registers, ${digitalLedgers.length} inactive digital-access ledgers, ${guideIds.length} guides, ${mapIds.length} maps, ${pathwayIds.length} pathways, and 0 trip, safety, delivery, or connectivity decisions.`);
