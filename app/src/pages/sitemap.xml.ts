import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import qualificationRegistry from "../data/phase-67-qualification-packet-registry.json";
import returnLedger from "../data/phase-67-evidence-return-envelope-ledger.json";
import measurementRegistry from "../data/phase-69-measurement-observation-break-registry.json";
import reviewRegistry from "../data/phase-70-observation-review-series-admission-registry.json";
import longitudinalOutcomeRegistry from "../data/phase-71-longitudinal-panel-outcome-comparison-registry.json";
import outcomeDesignRegistry from "../data/phase-72-outcome-evidence-counterfactual-design-registry.json";
import analysisRegistry from "../data/phase-73-analysis-execution-result-adjudication-registry.json";
import synthesisRegistry from "../data/phase-74-evidence-synthesis-challenge-decision-translation-registry.json";
import accountabilityRegistry from "../data/phase-75-decision-accountability-realized-impact-registry.json";
import learningRegistry from "../data/phase-76-cross-case-learning-portfolio-policy-retirement-registry.json";
import deliberationRegistry from "../data/phase-77-public-deliberation-participatory-governance-adaptive-mandate-registry.json";
import compactsRegistry from "../data/phase-78-interjurisdictional-compacts-shared-public-value-emergency-resilience-registry.json";
import stewardshipRegistry from "../data/phase-79-public-wealth-long-horizon-stewardship-intergenerational-balance-sheet-registry.json";
import investmentPortfolioRegistry from "../data/phase-80-public-investment-portfolios-transition-pathways-place-based-capacity-registry.json";
import universalServiceRegistry from "../data/phase-81-universal-service-essential-systems-public-option-delivery-registry.json";
import householdCapabilityRegistry from "../data/phase-82-household-capability-care-infrastructure-everyday-security-registry.json";
import communityInstitutionsRegistry from "../data/phase-83-community-institutions-social-infrastructure-collective-resilience-registry.json";
import foodSystemsRegistry from "../data/phase-84-food-systems-local-provisioning-community-resource-security-registry.json";
import housingPlaceRegistry from "../data/phase-85-housing-shelter-land-use-place-stability-registry.json";
import healthWellbeingRegistry from "../data/phase-86-health-public-health-disability-population-wellbeing-registry.json";
import educationKnowledgeCultureRegistry from "../data/phase-87-education-learning-skills-knowledge-cultural-capability-registry.json";
import workLaborLivelihoodsRegistry from "../data/phase-88-work-labor-livelihoods-economic-democracy-registry.json";
import incomeWealthSecurityRegistry from "../data/phase-89-income-wealth-poverty-social-protection-economic-security-registry.json";
import marketsFirmsGovernanceRegistry from "../data/phase-90-markets-firms-competition-corporate-power-democratic-economic-governance-registry.json";
import financeBankingCreditStabilityRegistry from "../data/phase-91-finance-banking-credit-capital-allocation-monetary-systems-financial-stability-registry.json";
import fiscalRevenueDebtMacroRegistry from "../data/phase-92-fiscal-policy-public-revenue-sovereign-debt-trade-external-balance-macroeconomic-coordination-registry.json";
import economicDevelopmentTransformationRegistry from "../data/phase-93-economic-development-industrial-strategy-innovation-systems-regional-convergence-productive-transformation-registry.json";
import physicalEconomySupplyChainRegistry from "../data/phase-94-energy-materials-manufacturing-logistics-strategic-supply-chain-transformation-registry.json";
import territorialSystemsDeliveryRegistry from "../data/phase-95-infrastructure-construction-buildings-public-works-territorial-systems-delivery-registry.json";
import mobilityNetworkAccessRegistry from "../data/phase-96-mobility-transportation-freight-communications-digital-networks-territorial-access-registry.json";
import environmentPlanetaryStewardshipRegistry from "../data/phase-97-environment-climate-ecosystems-pollution-waste-circularity-planetary-system-stewardship-registry.json";
import justiceSafetySecurityPeaceRegistry from "../data/phase-98-law-justice-public-safety-emergency-management-security-defense-peace-registry.json";
import democracyGovernmentLegitimacyRegistry from "../data/phase-99-democracy-government-public-administration-civic-information-institutional-legitimacy-registry.json";
import internationalOrderSharedFuturesRegistry from "../data/phase-100-international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures-registry.json";
import wholeSystemFuturesRegistry from "../data/phase-101-whole-system-futures-scenario-governance-polycrisis-readiness-civilizational-resilience-future-generations-registry.json";
import publicKnowledgeStewardshipRegistry from "../data/phase-102-public-knowledge-synthesis-civic-decision-literacy-reader-navigation-content-closure-evergreen-stewardship-registry.json";
import v03EditorialProgram from "../data/v03-editorial-program.json";
import v031ContentExpansion from "../data/v031-content-expansion.json";

const siteUrl = "https://ftfn.io";

function buildUrl(path: string): string {
  return `${siteUrl}${path}`;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function urlEntry(path: string, lastModified?: Date): string {
  const lastmod = lastModified ? `\n    <lastmod>${formatDate(lastModified)}</lastmod>` : "";

  return `  <url>\n    <loc>${buildUrl(path)}</loc>${lastmod}\n  </url>`;
}

export const GET: APIRoute = async () => {
  const [
    signals,
    topics,
    sources,
    organizations,
    technologies,
    localSystems,
    evidenceGaps,
    dependencyMaps,
    briefings,
    researchCollections,
    researchDocuments
  ] = await Promise.all([
    getCollection("signals"),
    getCollection("topics"),
    getCollection("sources"),
    getCollection("organizations"),
    getCollection("technologies"),
    getCollection("localSystems"),
    getCollection("evidenceGaps"),
    getCollection("dependencyMaps"),
    getCollection("briefings"),
    getCollection("researchCollections"),
    getCollection("researchDocuments")
  ]);

  const staticRoutes = [
    "/",
    "/signals/",
    "/atlas/",
    "/atlas/topics/",
    "/atlas/sources/",
    "/atlas/source-monitor/",
    "/atlas/source-coverage/",
    "/atlas/organizations/",
    "/atlas/technologies/",
    "/atlas/local-systems/",
    "/atlas/evidence-gaps/",
    "/atlas/dependency-maps/",
    "/research/",
    "/briefings/",
    "/evidence/qualification/",
    "/evidence/measurements/",
    "/evidence/review/",
    "/evidence/outcomes/",
    "/evidence/claims/",
    "/evidence/analysis/",
    "/evidence/synthesis/",
    "/evidence/accountability/",
    "/evidence/learning/",
    "/evidence/deliberation/",
    "/evidence/compacts/",
    "/evidence/stewardship/",
    "/evidence/investment-portfolios/",
    "/evidence/essential-services/",
    "/evidence/household-capability/",
    "/evidence/community-institutions/",
    "/evidence/food-systems/",
    "/evidence/housing-place-stability/",
    "/evidence/health-population-wellbeing/",
    "/evidence/education-knowledge-culture/",
    "/evidence/work-labor-livelihoods/",
    "/evidence/infrastructure-construction-buildings-public-works-territorial-systems/",
    "/evidence/mobility-transportation-freight-communications-digital-networks/",
    "/evidence/environment-climate-ecosystems-pollution-waste-circularity/",
    "/evidence/law-justice-public-safety-emergency-security-defense-peace/",
    "/evidence/democracy-government-public-administration-civic-information-institutional-legitimacy/",
    "/evidence/international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures/",
    "/evidence/whole-system-futures-scenario-governance-polycrisis-readiness-civilizational-resilience-future-generations/",
    "/evidence/public-knowledge-synthesis-civic-decision-literacy-reader-navigation-content-closure-evergreen-stewardship/",
    "/data/",
    "/method/",
    "/updates/",
    "/about/"
  ];

  const routes = [
    ...staticRoutes.map((path) => urlEntry(path)),
    ...signals
      .filter((signal) => signal.data.record_status === "Published")
      .map((signal) => urlEntry(`/signals/${signal.data.slug}/`, signal.data.published_date ?? signal.data.captured_date)),
    ...topics.map((topic) => urlEntry(`/atlas/topics/${topic.data.slug}/`)),
    ...sources.map((source) => urlEntry(`/atlas/sources/${source.data.id}/`, source.data.last_checked_date)),
    ...organizations.map((organization) => urlEntry(`/atlas/organizations/${organization.data.slug}/`)),
    ...technologies.map((technology) => urlEntry(`/atlas/technologies/${technology.data.slug}/`)),
    ...localSystems.map((system) => urlEntry(`/atlas/local-systems/${system.data.slug}/`, system.data.last_reviewed_date)),
    ...evidenceGaps.map((gap) => urlEntry(`/atlas/evidence-gaps/${gap.data.slug}/`, gap.data.latest_review?.review_date)),
    ...dependencyMaps
      .filter((dependencyMap) => dependencyMap.data.record_status === "Published")
      .map((dependencyMap) => urlEntry(`/atlas/dependency-maps/${dependencyMap.data.slug}/`)),
    ...researchCollections
      .filter((collection) => collection.data.record_status === "Published")
      .map((collection) => urlEntry(`/research/${collection.data.slug}/`, collection.data.captured_date)),
    ...researchDocuments
      .filter((document) => document.data.record_status === "Published")
      .map((document) => urlEntry(`/research/documents/${document.data.slug}/`, document.data.publication_date ?? undefined)),
    ...briefings
      .filter((briefing) => briefing.data.record_status === "Published")
      .map((briefing) => urlEntry(`/briefings/${briefing.data.slug}/`, briefing.data.published_date ?? briefing.data.captured_date)),
    ...qualificationRegistry.packet_records.map((record) => urlEntry(`/evidence/qualification/${record.slug}/`)),
    ...returnLedger.envelope_records.map((record) => urlEntry(`/evidence/qualification/${record.slug}/`)),
    ...measurementRegistry.measurement_specifications.map((record) => urlEntry(`/evidence/measurements/${record.slug}/`)),
    ...reviewRegistry.observation_review_dockets.map((record) => urlEntry(`/evidence/review/${record.slug}/`)),
    ...reviewRegistry.series_admission_dockets.map((record) => urlEntry(`/evidence/review/${record.slug}/`)),
    ...longitudinalOutcomeRegistry.longitudinal_panel_shells.map((record) => urlEntry(`/evidence/outcomes/${record.slug}/`)),
    ...longitudinalOutcomeRegistry.outcome_claim_dockets.map((record) => urlEntry(`/evidence/outcomes/${record.slug}/`)),
    ...outcomeDesignRegistry.outcome_evidence_packets.map((record) => urlEntry(`/evidence/claims/${record.slug}/`)),
    ...outcomeDesignRegistry.counterfactual_design_dockets.map((record) => urlEntry(`/evidence/claims/${record.slug}/`)),
    ...analysisRegistry.analysis_execution_dockets.map((record) => urlEntry(`/evidence/analysis/${record.slug}/`)),
    ...analysisRegistry.result_adjudication_dockets.map((record) => urlEntry(`/evidence/analysis/${record.slug}/`)),
    ...synthesisRegistry.result_synthesis_input_dockets.map((record) => urlEntry(`/evidence/synthesis/${record.slug}/`)),
    ...synthesisRegistry.synthesis_contradiction_dossiers.map((record) => urlEntry(`/evidence/synthesis/${record.slug}/`)),
    ...accountabilityRegistry.implementation_commitment_realization_ledgers.map((record) => urlEntry(`/evidence/accountability/${record.slug}/`)),
    ...accountabilityRegistry.decision_accountability_dossiers.map((record) => urlEntry(`/evidence/accountability/${record.slug}/`)),
    ...learningRegistry.institutional_learning_dossiers.map((record) => urlEntry(`/evidence/learning/${record.slug}/`)),
    ...learningRegistry.cross_case_transfer_registers.map((record) => urlEntry(`/evidence/learning/${record.slug}/`)),
    ...learningRegistry.portfolio_governance_registers.map((record) => urlEntry(`/evidence/learning/${record.slug}/`)),
    ...learningRegistry.policy_supersession_retirement_ledgers.map((record) => urlEntry(`/evidence/learning/${record.slug}/`)),
    ...deliberationRegistry.stakeholder_standing_notice_registers.map((record) => urlEntry(`/evidence/deliberation/${record.slug}/`)),
    ...deliberationRegistry.deliberation_issue_response_dockets.map((record) => urlEntry(`/evidence/deliberation/${record.slug}/`)),
    ...deliberationRegistry.mandate_legitimacy_appeal_registers.map((record) => urlEntry(`/evidence/deliberation/${record.slug}/`)),
    ...deliberationRegistry.adaptive_mandate_review_ledgers.map((record) => urlEntry(`/evidence/deliberation/${record.slug}/`)),
    ...compactsRegistry.interjurisdictional_authority_externality_maps.map((record) => urlEntry(`/evidence/compacts/${record.slug}/`)),
    ...compactsRegistry.shared_public_value_contribution_compacts.map((record) => urlEntry(`/evidence/compacts/${record.slug}/`)),
    ...compactsRegistry.mutual_aid_continuity_dispute_registers.map((record) => urlEntry(`/evidence/compacts/${record.slug}/`)),
    ...compactsRegistry.emergency_authority_normalization_ledgers.map((record) => urlEntry(`/evidence/compacts/${record.slug}/`)),
    ...stewardshipRegistry.public_asset_obligation_registers.map((record) => urlEntry(`/evidence/stewardship/${record.slug}/`)),
    ...stewardshipRegistry.lifecycle_cost_maintenance_ledgers.map((record) => urlEntry(`/evidence/stewardship/${record.slug}/`)),
    ...stewardshipRegistry.procurement_dependency_contingent_risk_registers.map((record) => urlEntry(`/evidence/stewardship/${record.slug}/`)),
    ...stewardshipRegistry.intergenerational_balance_sheet_stewardship_ledgers.map((record) => urlEntry(`/evidence/stewardship/${record.slug}/`)),
    ...investmentPortfolioRegistry.public_investment_mission_thesis_dossiers.map((record) => urlEntry(`/evidence/investment-portfolios/${record.slug}/`)),
    ...investmentPortfolioRegistry.portfolio_membership_dependency_sequence_registers.map((record) => urlEntry(`/evidence/investment-portfolios/${record.slug}/`)),
    ...investmentPortfolioRegistry.place_based_delivery_capacity_transition_ledgers.map((record) => urlEntry(`/evidence/investment-portfolios/${record.slug}/`)),
    ...investmentPortfolioRegistry.portfolio_stress_rebalancing_realization_ledgers.map((record) => urlEntry(`/evidence/investment-portfolios/${record.slug}/`)),
    ...universalServiceRegistry.service_floor_universal_access_dossiers.map((record) => urlEntry(`/evidence/essential-services/${record.slug}/`)),
    ...universalServiceRegistry.affordability_cross_subsidy_coverage_ledgers.map((record) => urlEntry(`/evidence/essential-services/${record.slug}/`)),
    ...universalServiceRegistry.provider_plurality_interoperability_continuity_registers.map((record) => urlEntry(`/evidence/essential-services/${record.slug}/`)),
    ...universalServiceRegistry.rights_quality_step_in_restoration_ledgers.map((record) => urlEntry(`/evidence/essential-services/${record.slug}/`)),
    ...householdCapabilityRegistry.household_capability_service_bundle_dossiers.map((record) => urlEntry(`/evidence/household-capability/${record.slug}/`)),
    ...householdCapabilityRegistry.care_infrastructure_workforce_capacity_ledgers.map((record) => urlEntry(`/evidence/household-capability/${record.slug}/`)),
    ...householdCapabilityRegistry.household_affordability_time_debt_administrative_burden_registers.map((record) => urlEntry(`/evidence/household-capability/${record.slug}/`)),
    ...householdCapabilityRegistry.neighborhood_access_displacement_crisis_recovery_ledgers.map((record) => urlEntry(`/evidence/household-capability/${record.slug}/`)),
    ...communityInstitutionsRegistry.community_institution_access_trust_continuity_dossiers.map((record) => urlEntry(`/evidence/community-institutions/${record.slug}/`)),
    ...communityInstitutionsRegistry.civic_association_cooperative_mutual_aid_capacity_ledgers.map((record) => urlEntry(`/evidence/community-institutions/${record.slug}/`)),
    ...communityInstitutionsRegistry.local_information_media_public_knowledge_integrity_registers.map((record) => urlEntry(`/evidence/community-institutions/${record.slug}/`)),
    ...communityInstitutionsRegistry.collective_preparedness_trauma_recovery_resilience_ledgers.map((record) => urlEntry(`/evidence/community-institutions/${record.slug}/`)),
    ...foodSystemsRegistry.food_production_land_water_sovereignty_dossiers.map((record) => urlEntry(`/evidence/food-systems/${record.slug}/`)),
    ...foodSystemsRegistry.processing_storage_distribution_local_provisioning_ledgers.map((record) => urlEntry(`/evidence/food-systems/${record.slug}/`)),
    ...foodSystemsRegistry.food_access_affordability_nutrition_institutional_meals_registers.map((record) => urlEntry(`/evidence/food-systems/${record.slug}/`)),
    ...foodSystemsRegistry.reserve_contamination_circularity_community_resource_security_ledgers.map((record) => urlEntry(`/evidence/food-systems/${record.slug}/`)),
    ...housingPlaceRegistry.housing_need_supply_delivery_habitability_dossiers.map((record) => urlEntry(`/evidence/housing-place-stability/${record.slug}/`)),
    ...housingPlaceRegistry.tenure_affordability_public_social_community_housing_ledgers.map((record) => urlEntry(`/evidence/housing-place-stability/${record.slug}/`)),
    ...housingPlaceRegistry.homelessness_shelter_supportive_housing_displacement_registers.map((record) => urlEntry(`/evidence/housing-place-stability/${record.slug}/`)),
    ...housingPlaceRegistry.retrofit_climate_disaster_reconstruction_place_stability_ledgers.map((record) => urlEntry(`/evidence/housing-place-stability/${record.slug}/`)),
    ...healthWellbeingRegistry.primary_preventive_community_care_access_dossiers.map((record) => urlEntry(`/evidence/health-population-wellbeing/${record.slug}/`)),
    ...healthWellbeingRegistry.acute_emergency_specialty_behavioral_health_care_ledgers.map((record) => urlEntry(`/evidence/health-population-wellbeing/${record.slug}/`)),
    ...healthWellbeingRegistry.public_health_surveillance_prevention_environmental_exposure_registers.map((record) => urlEntry(`/evidence/health-population-wellbeing/${record.slug}/`)),
    ...healthWellbeingRegistry.disability_equity_preparedness_population_wellbeing_ledgers.map((record) => urlEntry(`/evidence/health-population-wellbeing/${record.slug}/`)),
    ...educationKnowledgeCultureRegistry.early_childhood_school_access_inclusion_learning_dossiers.map((record) => urlEntry(`/evidence/education-knowledge-culture/${record.slug}/`)),
    ...educationKnowledgeCultureRegistry.postsecondary_vocational_apprenticeship_affordability_ledgers.map((record) => urlEntry(`/evidence/education-knowledge-culture/${record.slug}/`)),
    ...educationKnowledgeCultureRegistry.learning_capability_credential_skills_transition_registers.map((record) => urlEntry(`/evidence/education-knowledge-culture/${record.slug}/`)),
    ...educationKnowledgeCultureRegistry.public_knowledge_culture_research_community_learning_ledgers.map((record) => urlEntry(`/evidence/education-knowledge-culture/${record.slug}/`)),
    ...workLaborLivelihoodsRegistry.job_access_matching_hiring_nondiscrimination_dossiers.map((record) => urlEntry(`/evidence/work-labor-livelihoods/${record.slug}/`)),
    ...workLaborLivelihoodsRegistry.job_quality_wages_benefits_hours_safety_ledgers.map((record) => urlEntry(`/evidence/work-labor-livelihoods/${record.slug}/`)),
    ...workLaborLivelihoodsRegistry.worker_voice_organizing_collective_bargaining_economic_democracy_registers.map((record) => urlEntry(`/evidence/work-labor-livelihoods/${record.slug}/`)),
    ...workLaborLivelihoodsRegistry.livelihood_security_displacement_just_transition_long_horizon_ledgers.map((record) => urlEntry(`/evidence/work-labor-livelihoods/${record.slug}/`)),
    ...incomeWealthSecurityRegistry.household_income_earnings_tax_transfer_resource_dossiers.map((record) => urlEntry(`/evidence/income-wealth-economic-security/${record.slug}/`)),
    ...incomeWealthSecurityRegistry.wealth_assets_debt_liabilities_intergenerational_balance_ledgers.map((record) => urlEntry(`/evidence/income-wealth-economic-security/${record.slug}/`)),
    ...incomeWealthSecurityRegistry.poverty_deprivation_social_protection_benefit_access_registers.map((record) => urlEntry(`/evidence/income-wealth-economic-security/${record.slug}/`)),
    ...incomeWealthSecurityRegistry.economic_security_distribution_shock_mobility_long_horizon_ledgers.map((record) => urlEntry(`/evidence/income-wealth-economic-security/${record.slug}/`)),
    ...marketsFirmsGovernanceRegistry.firm_formation_ownership_control_governance_dossiers.map((record) => urlEntry(`/evidence/markets-firms-economic-governance/${record.slug}/`)),
    ...marketsFirmsGovernanceRegistry.market_structure_competition_pricing_conduct_ledgers.map((record) => urlEntry(`/evidence/markets-firms-economic-governance/${record.slug}/`)),
    ...marketsFirmsGovernanceRegistry.corporate_power_platform_supply_chain_public_support_registers.map((record) => urlEntry(`/evidence/markets-firms-economic-governance/${record.slug}/`)),
    ...marketsFirmsGovernanceRegistry.democratic_economic_governance_rights_remedy_long_horizon_ledgers.map((record) => urlEntry(`/evidence/markets-firms-economic-governance/${record.slug}/`)),
    ...financeBankingCreditStabilityRegistry.money_payments_banking_access_settlement_dossiers.map((record) => urlEntry(`/evidence/finance-banking-credit-financial-stability/${record.slug}/`)),
    ...financeBankingCreditStabilityRegistry.credit_underwriting_affordability_servicing_productive_allocation_ledgers.map((record) => urlEntry(`/evidence/finance-banking-credit-financial-stability/${record.slug}/`)),
    ...financeBankingCreditStabilityRegistry.capital_markets_institutional_investment_insurance_risk_transfer_registers.map((record) => urlEntry(`/evidence/finance-banking-credit-financial-stability/${record.slug}/`)),
    ...financeBankingCreditStabilityRegistry.monetary_policy_systemic_risk_resolution_public_guarantee_democratic_finance_ledgers.map((record) => urlEntry(`/evidence/finance-banking-credit-financial-stability/${record.slug}/`)),
    ...fiscalRevenueDebtMacroRegistry.public_revenue_tax_expenditure_distribution_compliance_dossiers.map((record) => urlEntry(`/evidence/fiscal-revenue-debt-trade-macro-coordination/${record.slug}/`)),
    ...fiscalRevenueDebtMacroRegistry.budget_expenditure_stabilizer_delivery_public_value_ledgers.map((record) => urlEntry(`/evidence/fiscal-revenue-debt-trade-macro-coordination/${record.slug}/`)),
    ...fiscalRevenueDebtMacroRegistry.sovereign_debt_fiscal_rule_public_balance_sheet_resilience_registers.map((record) => urlEntry(`/evidence/fiscal-revenue-debt-trade-macro-coordination/${record.slug}/`)),
    ...fiscalRevenueDebtMacroRegistry.trade_external_balance_supply_resilience_macroeconomic_coordination_ledgers.map((record) => urlEntry(`/evidence/fiscal-revenue-debt-trade-macro-coordination/${record.slug}/`)),
    ...economicDevelopmentTransformationRegistry.economic_development_mission_sector_strategy_production_ecosystem_dossiers.map((record) => urlEntry(`/evidence/economic-development-industrial-strategy-productive-transformation/${record.slug}/`)),
    ...economicDevelopmentTransformationRegistry.innovation_research_diffusion_commercialization_standards_ledgers.map((record) => urlEntry(`/evidence/economic-development-industrial-strategy-productive-transformation/${record.slug}/`)),
    ...economicDevelopmentTransformationRegistry.regional_cluster_corridor_supplier_workforce_convergence_registers.map((record) => urlEntry(`/evidence/economic-development-industrial-strategy-productive-transformation/${record.slug}/`)),
    ...economicDevelopmentTransformationRegistry.productive_transformation_diversification_decarbonization_shared_prosperity_ledgers.map((record) => urlEntry(`/evidence/economic-development-industrial-strategy-productive-transformation/${record.slug}/`)),
    ...physicalEconomySupplyChainRegistry.energy_water_industrial_utility_reliability_dossiers.map((record) => urlEntry(`/evidence/energy-materials-manufacturing-supply-chains/${record.slug}/`)),
    ...physicalEconomySupplyChainRegistry.minerals_materials_processing_circularity_qualification_ledgers.map((record) => urlEntry(`/evidence/energy-materials-manufacturing-supply-chains/${record.slug}/`)),
    ...physicalEconomySupplyChainRegistry.manufacturing_equipment_automation_maintenance_quality_accepted_production_registers.map((record) => urlEntry(`/evidence/energy-materials-manufacturing-supply-chains/${record.slug}/`)),
    ...physicalEconomySupplyChainRegistry.logistics_inventory_strategic_reserves_emergency_conversion_supply_chain_resilience_ledgers.map((record) => urlEntry(`/evidence/energy-materials-manufacturing-supply-chains/${record.slug}/`)),
    ...territorialSystemsDeliveryRegistry.spatial_planning_land_assembly_rights_of_way_site_readiness_dossiers.map((record) => urlEntry(`/evidence/infrastructure-construction-buildings-public-works-territorial-systems/${record.slug}/`)),
    ...territorialSystemsDeliveryRegistry.project_design_engineering_cost_estimation_permitting_procurement_ledgers.map((record) => urlEntry(`/evidence/infrastructure-construction-buildings-public-works-territorial-systems/${record.slug}/`)),
    ...territorialSystemsDeliveryRegistry.construction_contractors_trades_materials_safety_inspection_registers.map((record) => urlEntry(`/evidence/infrastructure-construction-buildings-public-works-territorial-systems/${record.slug}/`)),
    ...territorialSystemsDeliveryRegistry.commissioning_accessibility_asset_handover_operations_maintenance_adaptation_reconstruction_territorial_value_ledgers.map((record) => urlEntry(`/evidence/infrastructure-construction-buildings-public-works-territorial-systems/${record.slug}/`)),
    ...mobilityNetworkAccessRegistry.passenger_mobility_demand_accessibility_affordability_inclusion_dossiers.map((record) => urlEntry(`/evidence/mobility-transportation-freight-communications-digital-networks/${record.slug}/`)),
    ...mobilityNetworkAccessRegistry.multimodal_transportation_service_planning_operations_safety_reliability_ledgers.map((record) => urlEntry(`/evidence/mobility-transportation-freight-communications-digital-networks/${record.slug}/`)),
    ...mobilityNetworkAccessRegistry.freight_goods_movement_intermodal_logistics_delivery_resilience_registers.map((record) => urlEntry(`/evidence/mobility-transportation-freight-communications-digital-networks/${record.slug}/`)),
    ...mobilityNetworkAccessRegistry.communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_ledgers.map((record) => urlEntry(`/evidence/mobility-transportation-freight-communications-digital-networks/${record.slug}/`)),
    ...environmentPlanetaryStewardshipRegistry.greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_dossiers.map((record) => urlEntry(`/evidence/environment-climate-ecosystems-pollution-waste-circularity/${record.slug}/`)),
    ...environmentPlanetaryStewardshipRegistry.air_water_soil_noise_chemical_pollution_exposure_environmental_justice_ledgers.map((record) => urlEntry(`/evidence/environment-climate-ecosystems-pollution-waste-circularity/${record.slug}/`)),
    ...environmentPlanetaryStewardshipRegistry.ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_registers.map((record) => urlEntry(`/evidence/environment-climate-ecosystems-pollution-waste-circularity/${record.slug}/`)),
    ...environmentPlanetaryStewardshipRegistry.waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_ledgers.map((record) => urlEntry(`/evidence/environment-climate-ecosystems-pollution-waste-circularity/${record.slug}/`)),
    ...justiceSafetySecurityPeaceRegistry.rights_rule_of_law_courts_legal_aid_access_to_justice_dossiers.map((record) => urlEntry(`/evidence/law-justice-public-safety-emergency-security-defense-peace/${record.slug}/`)),
    ...justiceSafetySecurityPeaceRegistry.public_safety_violence_prevention_policing_fire_corrections_accountability_ledgers.map((record) => urlEntry(`/evidence/law-justice-public-safety-emergency-security-defense-peace/${record.slug}/`)),
    ...justiceSafetySecurityPeaceRegistry.emergency_management_civil_protection_critical_system_security_resilience_registers.map((record) => urlEntry(`/evidence/law-justice-public-safety-emergency-security-defense-peace/${record.slug}/`)),
    ...justiceSafetySecurityPeaceRegistry.defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_ledgers.map((record) => urlEntry(`/evidence/law-justice-public-safety-emergency-security-defense-peace/${record.slug}/`)),
    ...democracyGovernmentLegitimacyRegistry.elections_representation_participation_inclusion_democratic_integrity_dossiers.map((record) => urlEntry("/evidence/democracy-government-public-administration-civic-information-institutional-legitimacy/" + record.slug + "/")),
    ...democracyGovernmentLegitimacyRegistry.constitutional_legislative_executive_public_administration_capability_ledgers.map((record) => urlEntry("/evidence/democracy-government-public-administration-civic-information-institutional-legitimacy/" + record.slug + "/")),
    ...democracyGovernmentLegitimacyRegistry.public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_registers.map((record) => urlEntry("/evidence/democracy-government-public-administration-civic-information-institutional-legitimacy/" + record.slug + "/")),
    ...democracyGovernmentLegitimacyRegistry.civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_ledgers.map((record) => urlEntry("/evidence/democracy-government-public-administration-civic-information-institutional-legitimacy/" + record.slug + "/")),
    ...internationalOrderSharedFuturesRegistry.international_order_diplomacy_treaties_international_law_peaceful_dispute_resolution_dossiers.map((record) => urlEntry("/evidence/international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures/" + record.slug + "/")),
    ...internationalOrderSharedFuturesRegistry.multilateral_institutions_representation_development_cooperation_collective_delivery_ledgers.map((record) => urlEntry("/evidence/international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures/" + record.slug + "/")),
    ...internationalOrderSharedFuturesRegistry.migration_displacement_refugee_asylum_humanitarian_protection_shared_responsibility_registers.map((record) => urlEntry("/evidence/international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures/" + record.slug + "/")),
    ...internationalOrderSharedFuturesRegistry.global_commons_transboundary_risk_catastrophic_risk_intergenerational_shared_human_futures_ledgers.map((record) => urlEntry("/evidence/international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures/" + record.slug + "/")),
    ...wholeSystemFuturesRegistry.whole_system_scenario_assumption_boundary_driver_uncertainty_dossiers.map((record) => urlEntry("/evidence/whole-system-futures-scenario-governance-polycrisis-readiness-civilizational-resilience-future-generations/" + record.slug + "/")),
    ...wholeSystemFuturesRegistry.cross_domain_dependency_cascade_compound_risk_polycrisis_stress_test_ledgers.map((record) => urlEntry("/evidence/whole-system-futures-scenario-governance-polycrisis-readiness-civilizational-resilience-future-generations/" + record.slug + "/")),
    ...wholeSystemFuturesRegistry.preparedness_option_portfolio_continuity_recovery_transformation_registers.map((record) => urlEntry("/evidence/whole-system-futures-scenario-governance-polycrisis-readiness-civilizational-resilience-future-generations/" + record.slug + "/")),
    ...wholeSystemFuturesRegistry.civilizational_resilience_renewal_future_generations_stewardship_ledgers.map((record) => urlEntry("/evidence/whole-system-futures-scenario-governance-polycrisis-readiness-civilizational-resilience-future-generations/" + record.slug + "/")),
    ...publicKnowledgeStewardshipRegistry.canonical_public_synthesis_claim_boundary_evidence_lineage_dossiers.map((record) => urlEntry("/evidence/public-knowledge-synthesis-civic-decision-literacy-reader-navigation-content-closure-evergreen-stewardship/" + record.slug + "/")),
    ...publicKnowledgeStewardshipRegistry.civic_decision_literacy_uncertainty_tradeoff_public_reason_ledgers.map((record) => urlEntry("/evidence/public-knowledge-synthesis-civic-decision-literacy-reader-navigation-content-closure-evergreen-stewardship/" + record.slug + "/")),
    ...publicKnowledgeStewardshipRegistry.reader_navigation_learning_pathway_accessibility_translation_registers.map((record) => urlEntry("/evidence/public-knowledge-synthesis-civic-decision-literacy-reader-navigation-content-closure-evergreen-stewardship/" + record.slug + "/")),
    ...publicKnowledgeStewardshipRegistry.content_completeness_maintenance_correction_archive_evergreen_stewardship_ledgers.map((record) => urlEntry("/evidence/public-knowledge-synthesis-civic-decision-literacy-reader-navigation-content-closure-evergreen-stewardship/" + record.slug + "/")),
    ...v03EditorialProgram.phases.flatMap((phase) => phase.routes.map((route) => urlEntry(route, new Date(v03EditorialProgram.effective_date)))),
    ...v031ContentExpansion.phases.flatMap((phase) => phase.routes.map((route) => urlEntry(route, new Date(v031ContentExpansion.effective_date))))
  ].sort();

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.join("\n")}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
