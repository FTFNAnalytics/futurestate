import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, JSON.stringify(value, null, 2) + "\n", "utf8");
const phase96 = await readJson(join(dataRoot, "phase-96-mobility-transportation-freight-communications-digital-networks-territorial-access-registry.json"));
const upstream = phase96.communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_ledgers;
const labels = (value) => value.split("|").map((item) => item.trim());
const gates = (prefix, value) => labels(value).map((label, index) => ({ gate_id: `${prefix}-${String(index + 1).padStart(2, "0")}`, label }));
const taxonomy = (prefix, value, idKey) => labels(value).map((label, index) => ({ [idKey]: `${prefix}-${String(index + 1).padStart(2, "0")}`, label }));
const inactiveChecks = (items, basis) => items.map((item) => ({ ...item, decision_state: "Inactive", basis }));
const empty = (...names) => Object.fromEntries(names.map((name) => [name, []]));
const shortName = (record) => record.slug.replace(/^96-dal-\d+-/, "");
const common = (record, index, idKey, prefix, slug, kind) => ({
  [idKey]: `${prefix}-${String(index + 1).padStart(3, "0")}-${record.cohort_id}`,
  slug: `${slug}-${String(index + 1).padStart(3, "0")}-${shortName(record)}`,
  record_kind: kind, cohort_id: record.cohort_id, file_id: record.file_id, named_entity: record.named_entity,
  source_ids: record.source_ids, signal_ids: record.signal_ids, evidence_gap_ids: record.evidence_gap_ids,
  canonical_briefing_id: record.canonical_briefing_id, reader_pathway_ids: record.reader_pathway_ids, local_system_ids: record.local_system_ids,
  record_status: "Published", propagation_status: "not_started", first_reviewer_id: null, second_reviewer_id: null,
  automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
});

const climateGates = gates("97-CG", "Verified Phase 96 mobility, freight, communications and territorial-access record | Lawful climate, energy, land-use, transport, industrial, fiscal, Indigenous and intergovernmental authority | Entity, activity, asset, source, sink, gas, scope, geography, jurisdiction and period identity | Greenhouse-gas inventory with methods, factors, boundaries, uncertainty, revisions and independent assurance | Historical baseline, counterfactual, carbon budget, pathway, milestone and residual-emissions definition | Scope 1, 2 and 3 emissions, consumption, embodied, land-use and imported-emissions treatment | Energy, transport, buildings, industry, agriculture, forestry, waste and digital-system contribution | Avoidance, efficiency, electrification, clean supply, material substitution, demand reduction and land-use measures | Absolute and intensity metrics with denominator, leakage, rebound, additionality and double-counting controls | Carbon pricing, regulation, standards, procurement, public investment, finance and public-option instruments | Technology, infrastructure, workforce, material, land, water, capital and institutional dependencies | Household, worker, community, Indigenous, regional, income and protected-status distribution | Just transition, affordability, energy poverty, jobs, ownership, participation, consent and remedy | Climate justice, historical responsibility, territorial rights, loss and damage and international equity | Physical, transition, liability, lock-in, stranded-asset, feasibility and compound-risk stress evidence | Alternatives, no-action, no-build, sufficiency, public pathway and precautionary analysis | No emissions target as automatic delivered decarbonization | No offset, credit, certificate or model pathway as automatic emissions reduction | Independent inventory, pathway, rights, distribution and public-value review | Human mitigation-transition decision and dated receipt");
const pollutionGates = gates("97-PG", "Adopted climate-mitigation and emissions baseline | Pollutant, mixture, source, release, pathway, receptor, population, place, jurisdiction and period identity | Air, water, soil, sediment, noise, light, heat, radiation, biological and chemical pollution scope | Facility, transport, energy, agricultural, industrial, extractive, waste and diffuse-source attribution | Permit, licence, standard, limit, condition, monitoring, inspection, enforcement and compliance history | Measured concentration, load, duration, frequency, peak, cumulative exposure and uncertainty | Personal, occupational, household, community, ecosystem and food-chain exposure pathways | Acute, chronic, developmental, reproductive, neurological, respiratory and cumulative-health evidence | Baseline, background, hotspot, fence-line, upstream, downstream and comparative reference | Age, disability, race, income, occupation, housing, geography and protected-status distribution | Indigenous rights, jurisdiction, knowledge, harvesting, cultural continuity, consent and remedy | Avoidance, substitution, process control, capture, treatment, containment and source reduction | Monitoring coverage, detection limit, calibration, missingness, reporting lag and public access | Incident, exceedance, spill, leak, fire, failure, emergency response and notification evidence | Cleanup, remediation, exposure reduction, health protection, compensation and long-term care | Polluter-pays, liability, financial assurance, insurance, closure and restoration funding | No permit limit or compliance filing as automatic healthy exposure | No average concentration as automatic absence of hotspot or cumulative harm | No cleanup spending as automatic remediated environment or restored health | Independent exposure, health, rights, enforcement and environmental-justice review | Human pollution-exposure and remedy decision | Dated exposure, compliance, remediation and justice receipt");
const ecosystemGates = gates("97-EG", "Verified climate and pollution baseline | Ecosystem, habitat, species, population, community, watershed, seascape, landscape, territory and period identity | Forest, grassland, desert, wetland, freshwater, coastal, marine, soil, urban and cryosphere system scope | Structure, composition, function, productivity, connectivity, integrity and ecological-condition baseline | Species abundance, distribution, genetics, migration, reproduction, mortality and extinction-risk evidence | Habitat extent, quality, fragmentation, edge effects, corridors, refugia and cumulative disturbance | Water flow, quality, sediment, nutrient, soil, carbon, pollination and trophic-process evidence | Climate velocity, fire, drought, flood, heat, acidification, invasive species and compound-stressor exposure | Protected, conserved, restored, working, Indigenous and co-governed area status and effectiveness | Avoidance hierarchy, no-net-loss, biodiversity gain, offsets, additionality, permanence and leakage | Harvest, extraction, fishing, forestry, agriculture, recreation, development and carrying capacity | Indigenous rights, title, stewardship, knowledge, access, consent, benefit and cultural continuity | Community livelihoods, food, water, health, safety, recreation, culture and distributional value | Monitoring design, reference condition, counterfactual, detection power, uncertainty and open data | Restoration design, native composition, hydrology, connectivity, maintenance and adaptive management | Governance, enforcement, funding, workforce, seed, nursery, land, water and long-horizon capacity | No protected-area designation as automatic ecosystem recovery | No planted area or species count as automatic ecological integrity | No offset credit as automatic avoided biodiversity loss | Independent ecological, Indigenous-rights, community and public-value review | Human ecosystem-integrity and restoration decision | Dated biodiversity, restoration and stewardship receipt");
const planetaryGates = gates("97-PSG", "Verified climate, pollution and ecosystem baseline | Material, product, component, substance, waste stream, hazard, owner, user, place, jurisdiction and period identity | Resource extraction, design, production, distribution, use, repair, reuse, collection, recovery and disposal lifecycle | Material-flow, stock, durability, reparability, toxicity, recycled-content and criticality baseline | Prevention, refusal, reduction, sharing, maintenance, repair, refurbishment, remanufacture, reuse and recycling hierarchy | Municipal, industrial, construction, agricultural, hazardous, medical, electronic and disaster-waste scope | Collection, sorting, reverse logistics, treatment, recovery, residuals, leakage and illegal-disposal evidence | Producer responsibility, product standards, right to repair, deposit, procurement and public-option instruments | Worker safety, informal labor, community burden, environmental justice and Indigenous rights | Climate hazard, exposure, sensitivity, adaptive capacity, vulnerability and distribution baseline | Adaptation option, threshold, pathway, sequencing, maladaptation, residual risk and loss-and-damage evidence | Preparedness, early warning, protection, retreat, continuity, response, recovery and transformation | Funding, insurance, reserves, workforce, governance, maintenance and long-horizon institutional capacity | Air, water, land, ocean, biosphere, climate, nutrient, chemical and novel-entity system interactions | Planetary boundary, regional threshold, tipping point, feedback, irreversibility and precaution evidence | Consumption, trade, outsourced impact, sufficiency, demand, equity and fair-share analysis | Monitoring, accounting, disclosure, audit, public participation, challenge, correction and remedy | No waste diversion as automatic circular material stewardship | No adaptation spending as automatic reduced climate vulnerability | No restored infrastructure as automatic restored community or ecosystem | No aggregate footprint as automatic entity or jurisdiction ranking | Independent circularity, adaptation, rights, distribution and planetary-stewardship review | Human planetary-stewardship decision | Dated circularity, adaptation and planetary-system receipt");

const climateClasses = taxonomy("97-CCL", "Electricity and heat | Transport and mobility | Buildings and settlements | Industry and manufacturing | Agriculture and food systems | Forestry and land use | Waste and wastewater | Digital and communications systems | Public procurement and infrastructure | Finance and investment | Household consumption | International trade and supply chains | Carbon removals and sinks | Economy-wide transition pathways", "climate_transition_class_id");
const climateDimensions = taxonomy("97-CMD", "Inventory completeness | Baseline and carbon budget | Absolute emissions trajectory | Sector pathway feasibility | Technology and infrastructure readiness | Finance and policy delivery | Additionality and leakage control | Affordability and distribution | Just-transition capacity | Indigenous and territorial rights | Physical and transition resilience | Independent climate public-value review", "climate_mitigation_dimension_id");
const climateSafeguards = taxonomy("97-CJS", "No target as delivered decarbonization | No offset as verified reduction | Complete source, scope and period identity | Transparent methods and uncertainty | No double counting or boundary shifting | Precaution and intergenerational equity | Just transition and worker protection | Household affordability and energy justice | Indigenous rights, consent and stewardship | Public participation and remedy | Independent assurance and correction | No automated climate score or ranking", "climate_justice_safeguard_id");
const pollutionClasses = taxonomy("97-PCL", "Ambient and indoor air pollution | Drinking and surface-water pollution | Groundwater contamination | Soil and sediment contamination | Noise and vibration | Light and heat pollution | Hazardous chemicals and toxics | Radiation and radioactive contamination | Biological and pathogen hazards | Industrial and extractive releases | Transport and mobile-source pollution | Agricultural and diffuse pollution | Waste, landfill and incineration pollution | Emergency spills, fires and releases", "pollution_exposure_class_id");
const pollutionDimensions = taxonomy("97-PED", "Source and release attribution | Concentration and load | Duration and cumulative exposure | Hotspots and fence-line burden | Occupational exposure | Household and indoor exposure | Ecosystem and food-chain exposure | Health and wellbeing evidence | Compliance and enforcement | Prevention and source reduction | Remediation and long-term care | Independent exposure public-value review", "pollution_exposure_dimension_id");
const pollutionSafeguards = taxonomy("97-EJS", "No permit limit as healthy exposure | No average as absence of hotspots | No cleanup spending as restored health | Complete pollutant and receptor identity | Cumulative-impact and mixture analysis | Child, disability and protected-status safeguards | Worker right to know and refuse | Indigenous harvesting and cultural rights | Polluter pays and financial assurance | Public monitoring, notice and participation | Complaint, compensation and remedy | Independent environmental-justice audit", "environmental_justice_safeguard_id");
const ecosystemClasses = taxonomy("97-ECL", "Forests and woodlands | Grasslands and rangelands | Deserts and drylands | Wetlands and peatlands | Rivers and streams | Lakes and groundwater-dependent ecosystems | Estuaries and coasts | Oceans and marine systems | Soils and below-ground biodiversity | Urban nature and green-blue systems | Agricultural and working landscapes | Migratory corridors and flyways | Cryosphere and alpine systems | Indigenous and community conserved territories", "ecosystem_class_id");
const ecosystemDimensions = taxonomy("97-EID", "Extent and fragmentation | Composition and native diversity | Structure and habitat quality | Function and productivity | Connectivity and migration | Species abundance and recovery | Water and nutrient processes | Climate and disturbance resilience | Cumulative-impact condition | Stewardship and governance | Community and cultural value | Independent ecosystem public-value review", "ecosystem_integrity_dimension_id");
const ecosystemSafeguards = taxonomy("97-BRS", "No designation as ecosystem recovery | No planted area as ecological integrity | No offset as avoided biodiversity loss | Complete ecosystem and species identity | Reference condition and counterfactual | Avoidance before compensation | Additionality, permanence and leakage | Indigenous rights, consent and knowledge | Community livelihood and access | Long-horizon monitoring and maintenance | Challenge, correction and remedy | Independent ecological integrity audit", "biodiversity_rights_safeguard_id");
const planetaryClasses = taxonomy("97-SCL", "Product and material design | Repair and right-to-repair systems | Reuse, sharing and refurbishment | Remanufacturing and parts recovery | Municipal solid waste | Construction and demolition materials | Industrial by-products | Food and organic materials | Hazardous and chemical waste | Electronic and battery waste | Medical and biological waste | Mining and extractive waste | Disaster debris and emergency waste | Planetary-boundary and Earth-system stewardship", "circularity_stewardship_class_id");
const planetaryDimensions = taxonomy("97-PSD", "Prevention and absolute material reduction | Durability and reparability | Reuse and secondary markets | Collection and reverse logistics | Sorting and material quality | Safe recovery and residual control | Producer responsibility and public options | Worker and community justice | Climate vulnerability and adaptive capacity | Disaster continuity and transformation | Planetary thresholds and feedbacks | Independent planetary public-value review", "planetary_stewardship_dimension_id");
const planetarySafeguards = taxonomy("97-PGS", "No diversion as circular stewardship | No spending as reduced vulnerability | No restored infrastructure as restored system | Complete lifecycle and hazard identity | Waste hierarchy and precaution | Safe work and informal-worker rights | Community and environmental justice | Indigenous stewardship and territorial rights | Anti-export and outsourced-harm controls | Public participation and open accounting | Complaint, restitution and remedy | Independent circularity and adaptation audit", "planetary_governance_safeguard_id");
const longHorizonTests = taxonomy("97-LHT", "Net-zero aligned absolute emissions | Healthy exposure within protective thresholds | Thriving connected biodiverse ecosystems | Absolute resource-use and waste reduction | Safe circular materials without toxic recirculation | Climate-resilient essential systems | Just transition with secure livelihoods | Environmental justice and repaired cumulative harm | Indigenous jurisdiction and stewardship | Restored communities and ecosystems after disaster | Stable regional and planetary-system thresholds | Long-horizon stewardship under compound shocks", "long_horizon_planetary_test_id");

const climateDossiers = upstream.map((record, index) => ({
  ...common(record, index, "greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_dossier_id", "97-CMD", "97-cmd", "greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_dossier"),
  communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_ledger_id: record.communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_ledger_id,
  climate_state: "Inactive - No Verified Phase 96 Mobility And Network-Access Record", climate_decision: "Not Open",
  climate_checks: inactiveChecks(climateGates, "No verified Phase 96 mobility and network-access predecessor or Phase 97 climate-mitigation receipt exists."),
  climate_transition_class_records: climateClasses.map((item) => ({ ...item, class_state: "Unassessed" })),
  climate_mitigation_dimension_records: climateDimensions.map((item) => ({ ...item, dimension_state: "Not Measured" })),
  climate_justice_safeguard_records: climateSafeguards.map((item) => ({ ...item, safeguard_state: "Unverified" })),
  ...empty("verified_phase96_network_access_records", "inventory_records", "baseline_records", "budget_records", "pathway_records", "emission_records", "removal_records", "offset_records", "policy_records", "finance_records", "transition_records", "distribution_records", "review_records", "correction_records", "remedy_records"),
  climate_receipt_id: null, emissions_target_as_delivered_decarbonization_allowed: false, automatic_climate_mitigation_decision_allowed: false
}));
const pollutionLedgers = upstream.map((record, index) => ({
  ...common(record, index, "air_water_soil_noise_chemical_pollution_exposure_environmental_justice_ledger_id", "97-PEL", "97-pel", "air_water_soil_noise_chemical_pollution_exposure_environmental_justice_ledger"),
  greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_dossier_id: climateDossiers[index].greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_dossier_id,
  pollution_state: "Inactive - No Adopted Climate And Emissions Baseline", pollution_decision: "Not Open",
  pollution_checks: inactiveChecks(pollutionGates, "No adopted climate and emissions baseline or Phase 97 pollution-exposure receipt exists."),
  pollution_exposure_class_records: pollutionClasses.map((item) => ({ ...item, class_state: "Unassessed" })),
  pollution_exposure_dimension_records: pollutionDimensions.map((item) => ({ ...item, dimension_state: "Not Measured" })),
  environmental_justice_safeguard_records: pollutionSafeguards.map((item) => ({ ...item, safeguard_state: "Unverified" })),
  ...empty("pollutant_records", "source_records", "release_records", "permit_records", "monitoring_records", "exposure_records", "health_records", "hotspot_records", "incident_records", "enforcement_records", "remediation_records", "compensation_records", "review_records", "correction_records", "remedy_records"),
  pollution_receipt_id: null, permit_limit_as_healthy_exposure_allowed: false, automatic_pollution_exposure_or_remedy_decision_allowed: false
}));
const ecosystemRegisters = upstream.map((record, index) => ({
  ...common(record, index, "ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_register_id", "97-EBR", "97-ebr", "ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_register"),
  air_water_soil_noise_chemical_pollution_exposure_environmental_justice_ledger_id: pollutionLedgers[index].air_water_soil_noise_chemical_pollution_exposure_environmental_justice_ledger_id,
  ecosystem_state: "Inactive - No Verified Climate And Pollution Baseline", ecosystem_decision: "Not Open",
  ecosystem_checks: inactiveChecks(ecosystemGates, "No verified climate and pollution baseline or Phase 97 ecosystem-restoration receipt exists."),
  ecosystem_class_records: ecosystemClasses.map((item) => ({ ...item, class_state: "Unassessed" })),
  ecosystem_integrity_dimension_records: ecosystemDimensions.map((item) => ({ ...item, dimension_state: "Not Measured" })),
  biodiversity_rights_safeguard_records: ecosystemSafeguards.map((item) => ({ ...item, safeguard_state: "Unverified" })),
  ...empty("ecosystem_records", "habitat_records", "species_records", "population_records", "water_records", "soil_records", "disturbance_records", "protected_area_records", "harvest_records", "restoration_records", "monitoring_records", "indigenous_stewardship_records", "community_value_records", "review_records", "correction_records", "remedy_records"),
  ecosystem_receipt_id: null, protected_area_designation_as_ecosystem_recovery_allowed: false, automatic_ecosystem_integrity_or_restoration_decision_allowed: false
}));
const planetaryLedgers = upstream.map((record, index) => ({
  ...common(record, index, "waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_ledger_id", "97-PSL", "97-psl", "waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_ledger"),
  ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_register_id: ecosystemRegisters[index].ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_register_id,
  greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_dossier_id: climateDossiers[index].greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_dossier_id,
  planetary_state: "Inactive - No Verified Climate, Pollution And Ecosystem Baseline", planetary_decision: "Not Open",
  planetary_checks: inactiveChecks(planetaryGates, "No verified climate, pollution and ecosystem baseline or Phase 97 planetary-stewardship receipt exists."),
  circularity_stewardship_class_records: planetaryClasses.map((item) => ({ ...item, class_state: "Unassessed" })),
  planetary_stewardship_dimension_records: planetaryDimensions.map((item) => ({ ...item, dimension_state: "Not Measured" })),
  planetary_governance_safeguard_records: planetarySafeguards.map((item) => ({ ...item, safeguard_state: "Unverified" })),
  long_horizon_planetary_test_records: longHorizonTests.map((item) => ({ ...item, test_state: "Not Tested" })),
  ...empty("material_records", "product_records", "waste_records", "repair_records", "reuse_records", "recycling_records", "producer_responsibility_records", "hazard_records", "vulnerability_records", "adaptation_records", "preparedness_records", "loss_damage_records", "planetary_boundary_records", "monitoring_records", "participation_records", "review_records", "correction_records", "remedy_records"),
  planetary_receipt_id: null, waste_diversion_as_circular_stewardship_allowed: false, adaptation_spending_as_reduced_vulnerability_allowed: false, restored_infrastructure_as_restored_community_or_ecosystem_allowed: false, automatic_planetary_stewardship_decision_allowed: false
}));

const registry = {
  schema_version: "1.0", phase: "97", title: "Environment, Climate, Ecosystems, Pollution, Waste, Circularity And Planetary-System Stewardship", effective_date: "2026-08-27", record_status: "Published", operating_state: "governed_empty_state",
  decision_boundary: "This registry does not create an emissions, mitigation, exposure, health, compliance, remediation, ecosystem, biodiversity, restoration, waste, circularity, adaptation, vulnerability, recovery, planetary-boundary, receipt, score, rank, Phase 64 advance, or operating-outcome decision.",
  interpretation_boundary: "An emissions target is not delivered decarbonization. A permit limit is not healthy exposure. Protected-area designation is not ecosystem recovery. Waste diversion is not circular material stewardship. Adaptation spending is not reduced climate vulnerability. Restored infrastructure is not restored community or ecosystem.",
  climate_gates: climateGates, pollution_gates: pollutionGates, ecosystem_gates: ecosystemGates, planetary_gates: planetaryGates,
  climate_transition_classes: climateClasses, climate_mitigation_dimensions: climateDimensions, climate_justice_safeguards: climateSafeguards,
  pollution_exposure_classes: pollutionClasses, pollution_exposure_dimensions: pollutionDimensions, environmental_justice_safeguards: pollutionSafeguards,
  ecosystem_classes: ecosystemClasses, ecosystem_integrity_dimensions: ecosystemDimensions, biodiversity_rights_safeguards: ecosystemSafeguards,
  circularity_stewardship_classes: planetaryClasses, planetary_stewardship_dimensions: planetaryDimensions, planetary_governance_safeguards: planetarySafeguards, long_horizon_planetary_tests: longHorizonTests,
  greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_dossiers: climateDossiers,
  air_water_soil_noise_chemical_pollution_exposure_environmental_justice_ledgers: pollutionLedgers,
  ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_registers: ecosystemRegisters,
  waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_ledgers: planetaryLedgers,
  metrics: { verified_phase96_mobility_network_access_records_received: 0, climate_mitigation_decisions: 0, pollution_exposure_environmental_justice_decisions: 0, ecosystem_integrity_restoration_decisions: 0, circularity_adaptation_planetary_stewardship_decisions: 0, independent_reviews_completed: 0, receipts_created: 0, scores_created: 0, rankings_created: 0, phase64_cells_advanced: 0 }
};
await writeJson(join(dataRoot, "phase-97-environment-climate-ecosystems-pollution-waste-circularity-planetary-system-stewardship-registry.json"), registry);

const guideDefinitions = [
  ["environment-climate-ecosystems-pollution-waste-circularity-planetary-stewardship-doctrine-001", "Environment, Climate, Ecosystems, Pollution, Waste, Circularity And Planetary Stewardship Doctrine 001", "A governed doctrine from emissions and exposure through ecological integrity, circularity, adaptation and planetary stewardship."],
  ["greenhouse-gas-inventories-carbon-budgets-targets-delivered-decarbonization-001", "Greenhouse-Gas Inventories, Carbon Budgets, Targets And Delivered Decarbonization 001", "Trace inventories, budgets, pathways and real emissions without treating targets or offsets as delivery."],
  ["energy-transport-buildings-industry-land-use-climate-mitigation-001", "Energy, Transport, Buildings, Industry, Land Use And Climate Mitigation 001", "Govern sector pathways, dependencies, distribution and just transition across the full emissions system."],
  ["climate-adaptation-vulnerability-resilience-loss-and-damage-001", "Climate Adaptation, Vulnerability, Resilience, Loss And Damage 001", "Separate adaptation spending and infrastructure restoration from reduced vulnerability and recovery."],
  ["air-quality-noise-toxic-exposure-environmental-health-001", "Air Quality, Noise, Toxic Exposure And Environmental Health 001", "Trace sources, hotspots, cumulative exposure and health protection beyond permit compliance."],
  ["water-soil-chemical-pollution-remediation-environmental-justice-001", "Water, Soil, Chemical Pollution, Remediation And Environmental Justice 001", "Govern contamination, enforcement, cleanup, compensation and the distribution of cumulative harm."],
  ["ecosystems-biodiversity-habitat-connectivity-species-recovery-001", "Ecosystems, Biodiversity, Habitat Connectivity And Species Recovery 001", "Trace ecological condition, connectivity and recovery without substituting designation or planted area."],
  ["forests-wetlands-freshwater-oceans-coasts-cryosphere-001", "Forests, Wetlands, Freshwater, Oceans, Coasts And Cryosphere 001", "Connect land, water, ocean and cryosphere systems through function, disturbance and stewardship."],
  ["waste-prevention-reuse-repair-recycling-circularity-001", "Waste Prevention, Reuse, Repair, Recycling And Circularity 001", "Apply the material hierarchy without treating diversion totals as circular stewardship."],
  ["materials-product-stewardship-epr-ewaste-hazardous-waste-001", "Materials, Product Stewardship, EPR, E-Waste And Hazardous Waste 001", "Trace products, producers, hazards, workers, communities and safe lifecycle responsibility."],
  ["indigenous-stewardship-environmental-rights-just-transition-001", "Indigenous Stewardship, Environmental Rights And Just Transition 001", "Center jurisdiction, consent, knowledge, distribution, livelihood security and remedy."],
  ["planetary-boundaries-monitoring-restoration-long-horizon-001", "Planetary Boundaries, Monitoring, Restoration And Long-Horizon Stewardship 001", "Stress-test regional and Earth-system stewardship across thresholds, feedbacks and compound shocks."]
];
const sourceIds = [...new Set(upstream.flatMap((record) => record.source_ids))];
const signalIds = [...new Set(upstream.flatMap((record) => record.signal_ids))];
const evidenceGapIds = [...new Set(upstream.flatMap((record) => record.evidence_gap_ids))];
const localSystemIds = [...new Set(upstream.flatMap((record) => record.local_system_ids))];
const yamlList = (items) => items.map((item) => `  - "${item}"`).join("\n");
const sharedBody = `
## Governed environmental-stewardship chain

Phase 97 begins only after a verified Phase 96 mobility and network-access record. It separates greenhouse-gas inventories and mitigation; pollution, exposure and environmental justice; ecosystems, biodiversity and restoration; then waste, circularity, climate adaptation, disaster risk and planetary-system stewardship. Each transition requires authority, exact identities, baselines, dependencies, distribution, alternatives, stress tests, independent review, a human decision and a dated receipt.

## Climate mitigation and just transition

Trace inventories, budgets, absolute emissions, sector pathways, policy delivery, additionality, leakage, affordability and justice. An emissions target is not delivered decarbonization.

## Pollution, exposure and environmental justice

Trace sources, releases, hotspots, cumulative exposure, health, compliance, prevention, enforcement, remediation and remedy. A permit limit is not healthy exposure.

## Ecosystems and biodiversity

Trace ecological extent, composition, function, connectivity, species, disturbance, stewardship, monitoring and durable restoration. Protected-area designation is not ecosystem recovery.

## Circularity, adaptation and planetary stewardship

Trace material prevention and reuse, safe recovery, vulnerability, adaptation pathways, loss and damage, planetary thresholds and public governance. Waste diversion is not circular stewardship, adaptation spending is not reduced vulnerability, and restored infrastructure is not restored community or ecosystem.

## Decision boundary

The registry is deliberately empty. It contains no verified Phase 96 predecessor, mitigation, exposure, health, ecosystem, restoration, circularity, adaptation, recovery or planetary-stewardship decision; no review or receipt; and no score, rank, Phase 64 advance or operating-outcome change.
`;
const guideIds = [];
for (const [slug, title, summary] of guideDefinitions) {
  const id = `briefing-${slug}`; guideIds.push(id);
  await writeFile(join(contentRoot, "briefings", id + ".mdx"), `---\nid: "${id}"\ntitle: "${title}"\nslug: "${slug}"\nrecord_status: "Published"\nsummary: "${summary}"\npublished_date: 2026-08-27\ncaptured_date: 2026-08-27\nsignal_ids:\n${yamlList(signalIds)}\nevidence_gap_ids:\n${yamlList(evidenceGapIds)}\nclaim_scope: "Editorial Synthesis"\nlocal_evidence_level: "General Source Layer"\nlast_reviewed_date: 2026-08-27\ntop_takeaways:\n  - "Environmental stewardship requires separate climate, pollution, ecosystem and planetary-system records."\n  - "Targets, limits, designations, diversion, spending and restored infrastructure cannot substitute for verified outcomes."\n  - "No mitigation, exposure, recovery, circularity, score, ranking or planetary-outcome decision is created by this guide."\nconstraint_watch:\n  - "Public Trust"\n  - "Infrastructure"\n  - "Capital"\n  - "Labor"\n  - "Regulation"\n  - "Interpretation"\nwhat_to_watch_next:\n  - "A verified Phase 96 mobility and network-access record"\n  - "Separately reviewed climate, pollution, ecosystem and stewardship decisions"\n  - "Real dated emissions, exposure, ecological-condition, circularity and adaptation receipts"\n---\n\n${summary}\n${sharedBody}`, "utf8");
}

const mapDefinitions = [
  ["emissions-target-is-not-delivered-decarbonization", "An Emissions Target Is Not Delivered Decarbonization", "From target and pathway through measured absolute emissions, policy delivery, additionality, leakage, distribution and independent assurance."],
  ["permit-limit-is-not-healthy-exposure", "A Permit Limit Is Not Healthy Exposure", "From a legal limit through measured concentration, hotspots, cumulative pathways, vulnerable receptors, health evidence and remedy."],
  ["protected-area-designation-is-not-ecosystem-recovery", "Protected-Area Designation Is Not Ecosystem Recovery", "From legal designation through effective governance, ecological condition, connectivity, species recovery, monitoring and stewardship."],
  ["waste-diversion-is-not-circular-material-stewardship", "Waste Diversion Is Not Circular Material Stewardship", "From diverted tonnage through prevention, durability, repair, reuse, safe material quality, residuals and absolute resource reduction."],
  ["adaptation-spending-is-not-reduced-climate-vulnerability", "Adaptation Spending Is Not Reduced Climate Vulnerability", "From expenditure through exposure, sensitivity, adaptive capacity, thresholds, maladaptation, residual risk and equitable outcomes."],
  ["restored-infrastructure-is-not-restored-community-or-ecosystem", "Restored Infrastructure Is Not Restored Community Or Ecosystem", "From repaired assets through return, livelihoods, health, culture, ecological function, rights and durable recovery."]
];
const mapIds = [];
for (const [slug, title, summary] of mapDefinitions) {
  const id = `dependency-map-${slug}`; mapIds.push(id);
  await writeJson(join(contentRoot, "dependency-maps", slug + ".json"), {
    id, title, slug, summary, map_type: "Dependency Stack", record_status: "Published", primary_topic: "Climate", framework_layers: ["Human Systems", "Enabling Infrastructure", "Frontier Domains"], constraint_tags: ["Public Trust", "Infrastructure", "Capital", "Labor", "Regulation", "Interpretation"],
    map_question: `What records are required before ${title.toLowerCase()} can support a bounded environmental-stewardship decision?`, interpretation_boundary: registry.interpretation_boundary, source_ids: sourceIds, signal_ids: signalIds, technology_ids: [], local_system_ids: localSystemIds, evidence_gap_ids: evidenceGapIds,
    nodes: [
      { id: "node-access", label: "Verified Phase 96 mobility and network-access chain", node_type: "Evidence Gap", record_id: "gap-016", note: "No qualifying Phase 96 record exists." },
      { id: "node-climate", label: "Measured mitigation and just transition", node_type: "Constraint", note: "Targets are not delivered decarbonization." },
      { id: "node-pollution", label: "Healthy exposure and environmental justice", node_type: "Constraint", note: "Permit limits are not healthy exposure." },
      { id: "node-ecosystem", label: "Ecological integrity and durable restoration", node_type: "Constraint", note: "Designation is not recovery." },
      { id: "node-planetary", label: "Circularity, adaptation and planetary stewardship", node_type: "Constraint", note: "Diversion, spending and repaired assets are not outcomes." },
      { id: "node-receipt", label: "Independent review, challenge, correction, remedy and receipts", node_type: "Evidence Gap", record_id: "gap-016", note: "No Phase 97 receipt exists." }
    ],
    links: [["node-access","node-climate"],["node-climate","node-pollution"],["node-pollution","node-ecosystem"],["node-ecosystem","node-planetary"],["node-planetary","node-receipt"]].map(([from,to]) => ({ from, to, relationship: "Depends On", confidence: "Missing Evidence", note: "The downstream decision remains closed until its predecessor is reviewed and receipted." })),
    what_this_map_supports: ["Separate climate, exposure, ecosystem, circularity, adaptation and recovery decisions.", "Explicit authority, identities, baselines, dependencies, distribution, alternatives, stress, review and remedy.", "Public reasoning without entity, facility, community, ecosystem, place, jurisdiction or country scoring or ranking."],
    what_this_map_does_not_prove: ["It does not establish delivered decarbonization, healthy exposure, ecosystem recovery, circular stewardship, reduced vulnerability or recovery.", "It does not convert targets, limits, designations, diversion, spending or restored infrastructure into outcomes.", "It does not create a receipt, score, rank, stage advance or operating-outcome change."],
    next_records_needed: ["A verified Phase 96 mobility and network-access chain.", "Separately adopted climate, pollution, ecosystem and planetary-stewardship decisions.", "Independent inventory, exposure, health, ecological, rights, circularity, adaptation, correction and propagation receipts."]
  });
}

const pathwayIds = [...new Set(climateDossiers.flatMap((record) => record.reader_pathway_ids))];
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
  const records = [climateDossiers[index], pollutionLedgers[index], ecosystemRegisters[index], planetaryLedgers[index]];
  const path = join(contentRoot, "briefings", source.canonical_briefing_id + ".mdx");
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 97 environment, climate, ecosystems, pollution, waste, circularity, and planetary-stewardship boundary")) {
    const links = records.map((record) => { const value = Object.values(record).find((item) => typeof item === "string" && /^97-(CMD|PEL|EBR|PSL)-/.test(item)); return `[${value}](/evidence/environment-climate-ecosystems-pollution-waste-circularity/${record.slug}/)`; });
    body = body.trimEnd() + `\n\n## Phase 97 environment, climate, ecosystems, pollution, waste, circularity, and planetary-stewardship boundary\n\nThe [Environment, Climate, Ecosystems, Pollution, Waste, Circularity And Planetary-System Stewardship Registry](/evidence/environment-climate-ecosystems-pollution-waste-circularity/) assigns ${links.join(", ")} to this named file. No mitigation, exposure, health, ecosystem, restoration, circularity, adaptation, recovery, receipt, score, rank, or Phase 64 cell change exists.\n`;
    await writeFile(path, body, "utf8");
  }
}
const localFiles = ["local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor.mdx"];
for (const filename of localFiles) {
  const path = join(contentRoot, "local-systems", filename); let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 97 environment, climate, ecosystems, pollution, waste, circularity, and planetary-stewardship boundary")) {
    body = body.trimEnd() + "\n\n## Phase 97 environment, climate, ecosystems, pollution, waste, circularity, and planetary-stewardship boundary\n\nThe [Environment, Climate, Ecosystems, Pollution, Waste, Circularity And Planetary-System Stewardship Registry](/evidence/environment-climate-ecosystems-pollution-waste-circularity/) connects this place to emissions, exposure, environmental justice, ecosystems, biodiversity, restoration, waste, circularity, vulnerability, adaptation and planetary thresholds. Targets, permit limits, designations, diversion totals, spending and restored infrastructure do not establish outcomes.\n";
    await writeFile(path, body, "utf8");
  }
}
const operatingBriefings = ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-public-investment-doctrine-001.mdx", "briefing-procurement-vendor-lockin-public-options-001.mdx", "briefing-public-wealth-balance-sheet-001.mdx", "briefing-cooperatives-employee-ownership-public-employment-001.mdx", "briefing-worker-voice-organizing-collective-bargaining-001.mdx", "briefing-platform-gig-informal-contingent-work-001.mdx", "briefing-distributional-public-balance-sheets-001.mdx", "briefing-community-wealth-universal-supports-public-options-001.mdx", "briefing-cross-case-public-authority-001.mdx", "briefing-shared-public-value-allocation-001.mdx"];
for (const name of operatingBriefings) {
  const path = join(contentRoot, "briefings", name); let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 97 environment, climate, ecosystems, pollution, waste, circularity, and planetary-stewardship control")) {
    body = body.trimEnd() + "\n\n## Phase 97 environment, climate, ecosystems, pollution, waste, circularity, and planetary-stewardship control\n\nThe [Environment, Climate, Ecosystems, Pollution, Waste, Circularity And Planetary-System Stewardship Registry](/evidence/environment-climate-ecosystems-pollution-waste-circularity/) adds eight inactive climate-mitigation dossiers, eight inactive pollution-exposure ledgers, eight inactive ecosystem-restoration registers, and eight inactive planetary-stewardship ledgers. It creates zero mitigation, exposure, health, restoration, circularity, adaptation, recovery, receipt, score, ranking, or stage decisions.\n";
    await writeFile(path, body, "utf8");
  }
}
await writeJson(join(contentRoot, "updates", "2026-08-27-phase-97-environment-climate-ecosystems-pollution-waste-circularity-planetary-system-stewardship.json"), {
  id: "update-2026-08-27-phase-97-environment-climate-ecosystems-pollution-waste-circularity-planetary-system-stewardship", effective_date: "2026-08-27", entry_type: "Source Refresh", title: "Phase 97 adds environment, climate, ecosystem, pollution, circularity, adaptation, and planetary-stewardship controls", summary: "Eight inactive climate-mitigation dossiers, eight pollution-exposure ledgers, eight ecosystem-restoration registers, and eight planetary-stewardship ledgers expose the environmental contract without deciding decarbonization, healthy exposure, ecological recovery, circularity, reduced vulnerability, recovery, score, rank, or outcome for an entity, facility, worker, community, ecosystem, place, institution, jurisdiction, or country.", affected_record_ids: [...guideIds, ...mapIds, "briefing-outcomes-watch-001-what-actually-changed", "gap-015", "gap-016"], related_paths: ["/evidence/environment-climate-ecosystems-pollution-waste-circularity/", ...guideDefinitions.map(([slug]) => `/briefings/${slug}/`), "/data/environment-climate-ecosystems-pollution-waste-circularity-planetary-system-stewardship.json"], evidence_note: "This release contains empty climate, pollution, ecosystem and planetary-stewardship contracts plus synthetic-only validation. It contains no verified Phase 96 predecessor or Phase 97 decision or receipt.", materiality: "No record-state change", publication_effect: "Adds twelve Published briefings, six Published maps, one searchable registry with thirty-two detail routes, one public export, and reader-surface integrations while leaving all evidence, network-access, environmental and operating states unchanged.", next_check_date: "2026-09-01", work_package: "docs/work-packages/phase-97-environment-climate-ecosystems-pollution-waste-circularity-planetary-system-stewardship.md"
});

console.log(`Phase 97 content built: ${climateDossiers.length} inactive climate dossiers, ${pollutionLedgers.length} inactive pollution ledgers, ${ecosystemRegisters.length} inactive ecosystem registers, ${planetaryLedgers.length} inactive planetary ledgers, ${guideIds.length} guides, ${mapIds.length} maps, ${pathwayIds.length} pathways, and 0 mitigation, exposure, restoration, or stewardship decisions.`);
