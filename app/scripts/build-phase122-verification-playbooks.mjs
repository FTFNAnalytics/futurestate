import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = join(appRoot, "src", "data", "phase-122-verification-playbook-library.json");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));

const foundationSlugs = {
  boundaries: "evidence-and-claim-boundaries",
  ladder: "the-conversion-ladder",
  dependencies: "dependencies-and-bottlenecks",
  authority: "authority-permission-and-public-process",
  finance: "finance-procurement-and-delivery",
  place: "place-and-receiving-systems",
  acceptance: "acceptance-and-repeated-operation",
  measurement: "measurement-outcomes-and-denominators",
  uncertainty: "uncertainty-counterevidence-and-correction",
  comparability: "comparability-time-and-series-breaks",
};

const stageProcedures = [
  {
    source: "64-STAGE-01-CONTEXT", slug: "named-context-or-baseline", title: "Verify a named context or baseline",
    establish: "A bounded starting state for one named entity, cohort, asset, service area, or population at a stated date or period. The decision may establish what is known before conversion begins, but never that a later event occurred.",
    direct: ["A primary record that names the entity or cohort and the responsible reporting authority.", "A dated observation period with a defined measure, unit, denominator, and geographic boundary.", "A reconciliation note for aliases, entity changes, missing values, and series breaks."],
    falsePositives: ["A market forecast described in present tense.", "A national statistic applied to an unnamed local project.", "Nameplate capacity treated as available or qualified capacity."],
    substitutions: ["A press release without the underlying table or register.", "An undated dashboard screenshot with no extractable period.", "A nearby facility or parent-company total substituted for the named entity."],
    checklist: ["Resolve the canonical entity ID before reading the value.", "Record the source, event, capture, and review dates separately.", "Transcribe the measure, unit, denominator, exclusions, and geography.", "Check whether the entity or methodology changed during the period.", "Compare aliases against the canonical identity registry.", "State the first downstream artifact that this baseline does not establish."],
    worked: ["signal-bls-maricopa-q4-2025-employment-wage-baseline"], workedReading: "The Maricopa record names the county, quarter, covered-employment measure, and wage context, so it supports a bounded labor baseline without proving fab readiness.",
    counter: ["signal-mag-2023-projections-phoenix-region-growth-evidence-layer"], counterReading: "The MAG projection is useful scenario context, but projected regional growth cannot substitute for an observed project, workforce, or service baseline.",
    stop: "Stop at Context when the entity, period, measure, denominator, or geography cannot be resolved from a direct record; publish the ambiguity rather than choosing a convenient proxy.",
    foundations: ["boundaries", "place"], missions: ["116-Q-001", "116-Q-017"],
  },
  {
    source: "64-STAGE-02-AUTHORITY", slug: "policy-or-authority", title: "Verify policy or authority",
    establish: "A named legal, regulatory, permitting, licensing, tariff, standards, or public-process disposition, including its issuer, scope, conditions, effective date, and current status.",
    direct: ["The enacted instrument, signed order, issued permit, licence, tariff, standard, or official docket disposition.", "The issuing authority's scope, effective date, conditions, expiry, appeal, and supersession fields.", "An identity crosswalk connecting the instrument to the exact operator, asset, activity, or service area."],
    falsePositives: ["A consultation or draft treated as adopted law.", "Environmental review treated as operator authorization.", "A permit application treated as an issued and effective permit."],
    substitutions: ["An applicant announcement instead of the regulator's disposition.", "A general agency program page instead of the named instrument.", "Authority for one site, operator, or activity transferred to another."],
    checklist: ["Open the authoritative instrument, not only its landing page.", "Confirm issuer competence for the exact decision.", "Capture instrument number, dates, scope, conditions, and expiry.", "Check amendments, appeals, stays, withdrawals, and successor instruments.", "Bind the authority to the exact entity and geography.", "Leave implementation, acceptance, operation, and outcome stages unchanged."],
    worked: ["signal-faa-powered-lift-final-operating-rule"], workedReading: "The FAA final rule establishes a regulatory layer for powered-lift operations while its own boundary prevents an inference that an aircraft or service has been approved or operated.",
    counter: ["signal-faa-starship-lc39a-environmental-decision"], counterReading: "The LC-39A environmental decision establishes an environmental-review disposition, not every operator, vehicle, mission, construction, or operating authority required downstream.",
    stop: "Stop at Authority unless the final, current instrument and exact governed entity are both explicit; conditions and expiry remain part of the decision rather than footnotes.",
    foundations: ["authority", "ladder"], missions: ["116-Q-014", "116-Q-058"],
  },
  {
    source: "64-STAGE-03-COMMITMENT", slug: "finance-procurement-or-agreement", title: "Verify finance, procurement, or agreement",
    establish: "A binding or formally recorded commitment by named parties, such as financial close, appropriation, award, order, contract, offtake, grant, or delivery agreement, with conditions and scope intact.",
    direct: ["A signed agreement, executed financing notice, award instrument, order, appropriation, or official procurement record.", "Named parties, committed amount or quantity where public, scope, date, conditions precedent, and termination status.", "A project-identity link distinguishing selection, negotiation, execution, disbursement, and expenditure."],
    falsePositives: ["A project selection described as a closed award.", "A maximum contract ceiling described as money spent.", "A memorandum of understanding described as an unconditional delivery obligation."],
    substitutions: ["A beneficiary press release without the executed instrument.", "A portfolio total substituted for the named project commitment.", "A forecast capital requirement substituted for secured finance."],
    checklist: ["Classify the instrument before describing the commitment.", "Name every obligated party and the receiving project.", "Separate authorized, obligated, disbursed, and expended amounts.", "Record conditions, milestones, cancellation rights, and expiry.", "Check whether scope or counterparties changed after announcement.", "Keep construction, delivery, acceptance, and outcome unestablished."],
    worked: ["signal-thacker-pass-doe-loan-financial-close"], workedReading: "The official loan close establishes a named financing event for Thacker Pass; it does not establish construction completion, qualified material, shipment, or recurring supply.",
    counter: ["signal-doe-2026-critical-minerals-nineteen-project-selections"], counterReading: "DOE's nineteen selections open award trails, but selection alone is not an executed award, financial close, disbursement, or completed facility.",
    stop: "Stop at Commitment when execution, parties, scope, or conditions cannot be verified directly; never promote a selection, target, ceiling, or negotiation into a binding commitment.",
    foundations: ["finance", "dependencies"], missions: ["116-Q-026", "116-Q-046"],
  },
  {
    source: "64-STAGE-04-IMPLEMENTATION", slug: "build-or-implementation", title: "Verify build or implementation",
    establish: "A dated physical or organizational implementation milestone for the exact project, asset, system, site, cohort, or migration scope, including completed scope and remaining work.",
    direct: ["A construction, installation, migration, delivery, inspection, or implementation record tied to the named entity.", "A milestone definition, observed date, completed quantity or share, denominator, and remaining scope.", "Evidence that distinguishes mobilization, work in progress, substantial completion, and final completion."],
    falsePositives: ["A groundbreaking treated as substantial completion.", "Equipment delivery treated as installed and commissioned capacity.", "Portfolio progress transferred to an individual project."],
    substitutions: ["A rendering or future schedule instead of an observed milestone.", "Contractor marketing without an owner or authority record.", "Expenditure percentage substituted for physical completion."],
    checklist: ["Resolve the project, site, asset, and package identity.", "Define the milestone in physical or organizational terms.", "Record completed quantity and total applicable scope.", "Separate owner report, contractor report, and independent inspection.", "List incomplete packages, exceptions, and dependencies.", "Do not advance validation, acceptance, recurring operation, or outcome."],
    worked: ["signal-phoenix-tsmc-fab3-topping-out"], workedReading: "The Fab 3 topping-out record establishes a specific structural milestone at a named facility while leaving fit-out, utilities, qualification, acceptance, and production open.",
    counter: ["signal-phoenix-2026-2031-north-gateway-wrp-capital-program"], counterReading: "A preliminary capital program identifies planned wastewater work, but a budget line and schedule do not establish that the assets were built, inspected, or operating.",
    stop: "Stop at the exact observed milestone. If scope, denominator, or remaining work is absent, describe the record as partial implementation evidence rather than completion.",
    foundations: ["dependencies", "finance"], missions: ["116-Q-018", "116-Q-050"],
  },
  {
    source: "64-STAGE-05-VALIDATION", slug: "test-compliance-or-qualification", title: "Verify test, compliance, or qualification",
    establish: "A named test, inspection, compliance, certification, qualification, or corrective-action disposition for a defined article, system, cohort, facility, or operating configuration.",
    direct: ["A test report, inspection record, certification, regulator finding, qualification lot, or corrective-action closure.", "Named article or cohort, configuration, method, criteria, result, exceptions, reviewer, and decision date.", "A disposition explaining failures, waivers, retests, corrective actions, and the scope of any pass."],
    falsePositives: ["Participation in a pilot treated as passing its evaluation.", "One laboratory result generalized to an operating fleet.", "Corrective action opened treated as verified closed."],
    substitutions: ["A vendor performance claim without protocol or criteria.", "A certification framework substituted for a product certificate.", "A successful demonstration substituted for qualification under receiving-system conditions."],
    checklist: ["Name the test article, configuration, cohort, and environment.", "Capture protocol, thresholds, evaluator, and authority.", "Separate measured result from interpretation and disposition.", "Record exceptions, waivers, failures, and retest status.", "Check transfer limits between test and operating configurations.", "Keep receiving-party acceptance and sustained operation separate."],
    worked: ["signal-darpa-lift-challenge-2026-scheduled-field-trial"], workedReading: "DARPA's published measured results identify teams, scored runs, lift ratios, and prize decisions, supporting a bounded field-test result rather than an operational-aircraft claim.",
    counter: ["signal-nist-aria-pilot-multilevel-evaluation"], counterReading: "ARIA's multi-level pilot establishes that an evaluation occurred; it cannot by itself establish authorization, continuous assurance, accepted deployment, or mission benefit for a named system.",
    stop: "Stop at the tested configuration and stated disposition. Never extend a pass beyond the article, criteria, environment, authority, or exceptions recorded.",
    foundations: ["boundaries", "acceptance"], missions: ["116-Q-010", "116-Q-030"],
  },
  {
    source: "64-STAGE-06-ACCEPTANCE", slug: "accepted-service-product-or-cutover", title: "Verify accepted service, product, or cutover",
    establish: "A formal receiving-party decision that a named asset, service, product, lot, handover, or system transition satisfies stated acceptance criteria for a bounded operational scope.",
    direct: ["A signed acceptance, handover, turnover, authority-to-use, customer receipt, closeout, or cutover record.", "Named receiver, accepted object, criteria, date, exceptions, warranty or punch-list status, and authorized scope.", "A link from acceptance to the exact delivered configuration, lot, station, facility, or system."],
    falsePositives: ["Substantial completion treated as final acceptance.", "A vendor shipment treated as customer receipt.", "Permission to operate treated as receiver acceptance."],
    substitutions: ["A construction progress report without receiving-party signoff.", "An aggregate delivery count without named accepted assets.", "A target in-service date substituted for a dated acceptance record."],
    checklist: ["Identify the receiving party and its authority to accept.", "Resolve the accepted object and configuration exactly.", "Transcribe criteria, decision date, scope, and exceptions.", "Separate conditional, partial, provisional, and final acceptance.", "Record punch-list, warranty, closeout, and rejected-scope status.", "Do not infer repeated use, reliability, utilization, or outcome."],
    worked: ["signal-57b-amtrak-eleven-station-passenger-use-cohort"], workedReading: "Amtrak's turnover of eleven named station projects for passenger use is stronger receiving-system evidence than construction progress, while still not establishing recurring reliability or portfolio-wide outcomes.",
    counter: ["signal-57c-amtrak-station-portfolio-coverage"], counterReading: "A portfolio substantial-completion count does not identify final acceptance, passenger use, exceptions, or closeout for every station in its denominator.",
    stop: "Stop before Acceptance unless the receiver, accepted object, criteria, decision, and exceptions are explicit. Partial or conditional acceptance must retain that qualifier everywhere.",
    foundations: ["acceptance", "ladder"], missions: ["116-Q-003", "116-Q-015"],
  },
  {
    source: "64-STAGE-07-REPEAT", slug: "recurring-operation-or-output", title: "Verify recurring operation or output",
    establish: "Repeated service, use, adoption, dispatch, production, or output for one stable entity or cohort across compatible periods, including outages, attrition, and denominator changes.",
    direct: ["At least two compatible operating observations for the same named asset, service, facility, or cohort.", "Stable period, unit, denominator, coverage, outage, attrition, and exception definitions.", "A reconciliation of maintenance, downtime, curtailment, cancellations, revisions, and identity changes."],
    falsePositives: ["One successful run described as sustained operation.", "Installed capacity described as recurring output.", "Cumulative totals with no period or exposure denominator described as reliability."],
    substitutions: ["A capacity plate or commissioning certificate instead of operating records.", "Provider-wide totals substituted for a fixed eligible cohort.", "Two observations with incompatible units or entity boundaries."],
    checklist: ["Lock the entity and cohort identity across periods.", "Require at least two comparable operating intervals.", "Reconcile units, denominators, outages, and missing periods.", "Separate availability, utilization, output, quality, and adoption.", "Inspect revisions and series breaks before calculating change.", "Keep causal and net-public-outcome claims outside this decision."],
    worked: ["signal-56j-manatee-monthly-operation"], workedReading: "The named monthly Manatee operating record supports a bounded operation reading because it adds period-specific activity beyond nameplate capacity.",
    counter: ["signal-56b-manatee-capacity-panel"], counterReading: "The repeated 409 MW nameplate figure is a stable capacity description, not proof that the battery dispatched, remained available, or delivered recurring service.",
    stop: "Stop at Acceptance or a single operation when repeated compatible periods are absent. Do not manufacture recurrence by combining incomparable records.",
    foundations: ["acceptance", "comparability"], missions: ["116-Q-019", "116-Q-043"],
  },
  {
    source: "64-STAGE-08-OUTCOME", slug: "comparable-outcome", title: "Verify a comparable outcome",
    establish: "A repeated change in a defined service, welfare, cost, safety, reliability, environmental, resilience, or mission measure for a stable population or system, with comparison and attribution limits stated.",
    direct: ["A repeated outcome series with stable identity, measure, unit, period, denominator, exclusions, and revision policy.", "A declared comparison design or bounded before-after reading with uncertainty and alternative explanations.", "Exposure, service, or operating context sufficient to distinguish outcome from activity volume."],
    falsePositives: ["Deployment volume described as benefit.", "A regulatory approval described as safety improvement.", "A single favorable event described as a trend or causal effect."],
    substitutions: ["Testimonials or anecdotes instead of a defined series.", "Incompatible geographies or denominators ranked together.", "Modeled benefits substituted for observed outcomes."],
    checklist: ["Define the outcome independently of the intervention claim.", "Lock entity, population, period, unit, and denominator.", "Require repeated compatible observations and disclose revisions.", "Document exposure, confounders, uncertainty, and counterevidence.", "Test whether the comparison survives series-break exclusions.", "State what association, contribution, or causation is and is not supported."],
    worked: ["signal-56a-air-travel-consumer"], workedReading: "DOT's annual carrier-service rail can support bounded multi-period service measures because the reporting series preserves a comparable unit and carrier context; causal attribution still requires separate analysis.",
    counter: ["signal-cpuc-waymo-fared-driverless-expansion-2024"], counterReading: "Expanded legal authority for fared driverless service does not establish a repeated safety, access, affordability, reliability, or public-benefit outcome.",
    stop: "Stop before Outcome when identity, period, definition, denominator, repeated observations, uncertainty, or comparison compatibility is missing. Inadmissibility is a valid result.",
    foundations: ["measurement", "comparability"], missions: ["116-Q-004", "116-Q-052"],
  },
];

const claimProcedures = [
  ["116-CLAIM-01-BASELINE", "baseline-context", "Review a baseline or context claim", "A dated starting condition for a named population or system, without implying change.", ["Observed primary table with entity, period, measure, and denominator.", "Boundary and exclusion note.", "Series and revision metadata."], ["Forecast presented as observation.", "National average assigned to one place.", "Capacity confused with output."], ["Undated summary.", "Secondary chart without lineage.", "Mixed-entity total."], ["Resolve subject and geography.", "Verify observation date.", "Capture measure and unit.", "Capture denominator and exclusions.", "Inspect revisions.", "Write the no-change boundary."], "signal-bls-maricopa-q4-2025-employment-wage-baseline", "This signal supports a county-period workforce baseline with an explicit limit on fab-readiness inference.", "signal-mag-2023-projections-phoenix-region-growth-evidence-layer", "A projection remains scenario context and is inadmissible as an observed baseline.", "Do not publish a baseline claim until subject, period, measure, and denominator all resolve.", ["boundaries", "place"], ["116-Q-001", "116-Q-017"]],
  ["116-CLAIM-02-RESEARCH", "research-result", "Review a research-result claim", "A measured finding for a defined study population, test article, method, and setting, with transfer limits.", ["Citable study or test report.", "Method, population, result, uncertainty, and limitations.", "Version and correction history."], ["Abstract headline generalized beyond the study.", "Model output called field performance.", "Statistical significance called operational importance."], ["Press coverage instead of study.", "Related experiment with different article.", "Benchmark score without protocol."], ["Name the study and article.", "Record design and sample.", "Extract result and uncertainty.", "Check preregistered versus exploratory status.", "Review limitations and conflicts.", "Bound transfer to real operation."], "signal-nist-metis-semiconductor-metrology-data-exchange", "METIS is admissible as a shared-data infrastructure research test within its stated setting.", "signal-nsf-ai-materials-institute-award-2433348", "A research award establishes funding, not a measured research result.", "Stop at funding or protocol when no completed method-and-result artifact exists.", ["boundaries", "uncertainty"], ["116-Q-009", "116-Q-037"]],
  ["116-CLAIM-03-ANNOUNCEMENT", "announcement-or-plan", "Review an announcement or plan claim", "A named issuer's stated intention, target, proposal, schedule, or ambition, explicitly labeled as prospective.", ["Issuer-authored dated announcement or plan.", "Named object, proposed scale, horizon, and status.", "Assumptions and update history where available."], ["Target described as achieved.", "Proposed capacity described as financed.", "Planned date described as a commitment."], ["Media paraphrase without issuer record.", "Old plan superseded by a later version.", "Industry forecast substituted for project plan."], ["Identify issuer and authority.", "Label prospective status.", "Capture target and horizon.", "Record assumptions and dependencies.", "Check supersession.", "Name the next executable artifact."], "signal-kennedy-multiuser-master-plan", "Kennedy's master plan establishes a prospective infrastructure frame while keeping future missions unproved.", "signal-phoenix-2026-2031-north-gateway-wrp-capital-program", "A preliminary capital program cannot be written as completed procurement or construction.", "Never convert future tense into a completed stage; stop at the plan's explicit status.", ["boundaries", "dependencies"], ["116-Q-054", "116-Q-066"]],
  ["116-CLAIM-04-AUTHORITY", "policy-or-authority", "Review a policy or authority claim", "A current authoritative instrument and its exact legal or administrative effect for a named scope.", ["Final instrument or docket disposition.", "Issuer, number, dates, scope, conditions, and status.", "Amendment, expiry, appeal, and supersession trail."], ["Draft called final.", "Review called licence.", "Applicant claim called approval."], ["Agency homepage.", "Company announcement.", "Authority for another entity."], ["Open the instrument.", "Confirm issuer competence.", "Capture number and dates.", "Read conditions and exceptions.", "Check current disposition.", "Hold all downstream stages."], "signal-faa-powered-lift-final-operating-rule", "The final operating rule supports a bounded regulatory claim.", "signal-faa-starship-lc39a-environmental-decision", "An environmental decision cannot stand in for all vehicle, operator, or mission authority.", "Stop unless the exact current instrument and governed entity are explicit.", ["authority", "ladder"], ["116-Q-014", "116-Q-058"]],
  ["116-CLAIM-05-COMMITMENT", "finance-procurement-or-agreement", "Review a finance, procurement, or agreement claim", "A binding recorded obligation among named parties, with stage of commitment and conditions distinguished.", ["Executed award, contract, order, loan, appropriation, or agreement.", "Parties, scope, amount or quantity, date, and conditions.", "Status of close, obligation, disbursement, and termination."], ["Selection called award.", "Ceiling called expenditure.", "MOU called firm order."], ["Recipient release only.", "Portfolio sum for one project.", "Capital need forecast."], ["Classify instrument.", "Name parties.", "Separate financial states.", "Record conditions.", "Check amendments.", "Hold delivery and outcome."], "signal-thacker-pass-doe-loan-financial-close", "The federal loan close is a direct named commitment record.", "signal-doe-2026-critical-minerals-nineteen-project-selections", "Selections require separate executed-award evidence.", "Stop before commitment when execution or binding effect is unresolved.", ["finance", "dependencies"], ["116-Q-026", "116-Q-046"]],
  ["116-CLAIM-06-IMPLEMENTATION", "build-or-implementation", "Review a build or implementation claim", "Observed progress against a defined physical or organizational delivery scope for one named entity.", ["Owner, authority, or inspection milestone record.", "Observed date, scope, quantity, denominator, and remaining work.", "Milestone-definition and package crosswalk."], ["Groundbreaking called completion.", "Delivery called installation.", "Spend called physical progress."], ["Rendering.", "Future schedule.", "Portfolio average."], ["Resolve project package.", "Define milestone.", "Measure completed scope.", "Capture denominator.", "List remaining work.", "Hold testing and acceptance."], "signal-phoenix-tsmc-fab3-topping-out", "Topping out supports one structural milestone and no later stage.", "signal-phoenix-2026-2031-north-gateway-wrp-capital-program", "Programmed work is not observed implementation.", "Stop at the exact dated milestone; never round partial implementation to completion.", ["dependencies", "finance"], ["116-Q-018", "116-Q-050"]],
  ["116-CLAIM-07-VALIDATION", "test-compliance-or-qualification", "Review a test, compliance, or qualification claim", "A test or compliance disposition for a named article, cohort, configuration, method, and criteria.", ["Direct test, inspection, certificate, or compliance record.", "Article, method, criteria, result, exceptions, and evaluator.", "Retest, waiver, and corrective-action disposition."], ["Pilot participation called pass.", "Lab result generalized to fleet.", "Open action called closure."], ["Vendor claim.", "Framework without certificate.", "Different configuration's result."], ["Name article and version.", "Capture protocol.", "Extract result.", "Record exceptions.", "Check evaluator authority.", "Bound transfer."], "signal-darpa-lift-challenge-2026-scheduled-field-trial", "The DARPA artifact supports measured scored-run results and prize decisions.", "signal-nist-aria-pilot-multilevel-evaluation", "A completed pilot is not continuous assurance or accepted operation.", "Stop at the tested configuration and stated disposition.", ["boundaries", "acceptance"], ["116-Q-010", "116-Q-030"]],
  ["116-CLAIM-08-ACCEPTANCE", "accepted-service-product-or-cutover", "Review an acceptance claim", "A named receiver's formal decision to take, use, or authorize a bounded delivered object or transition.", ["Acceptance, turnover, closeout, receipt, or cutover record.", "Receiver, object, criteria, date, exceptions, and scope.", "Configuration or lot identity."], ["Substantial completion called acceptance.", "Shipment called receipt.", "Authority called handover."], ["Vendor notice.", "Aggregate delivery count.", "Target in-service date."], ["Identify receiver.", "Resolve object.", "Read criteria.", "Classify partial or final.", "Record exceptions.", "Hold recurrence."], "signal-57b-amtrak-eleven-station-passenger-use-cohort", "Turnover for passenger use is receiving-system evidence for named station projects.", "signal-57c-amtrak-station-portfolio-coverage", "Substantial-completion coverage does not prove final acceptance for every station.", "Stop unless receiver, object, criteria, date, and exceptions are direct.", ["acceptance", "ladder"], ["116-Q-003", "116-Q-015"]],
  ["116-CLAIM-09-OPERATION", "recurring-operation-or-adoption", "Review a recurring operation or adoption claim", "Repeated compatible service, output, use, or adoption for a stable entity or cohort.", ["Two or more compatible operating periods.", "Stable entity, unit, denominator, and coverage.", "Outage, attrition, exception, and revision treatment."], ["One run called sustained.", "Capacity called output.", "Cumulative total called reliability."], ["Commissioning certificate.", "Provider-wide aggregate.", "Incompatible period pair."], ["Lock identity.", "Require repeated periods.", "Reconcile denominators.", "Record outages.", "Check revisions.", "Hold causal outcome."], "signal-56j-manatee-monthly-operation", "A named monthly operating record advances beyond capacity-only evidence.", "signal-56b-manatee-capacity-panel", "Repeated nameplate capacity remains a capacity record, not recurring output.", "Stop when repeat observations or compatibility are absent.", ["acceptance", "comparability"], ["116-Q-019", "116-Q-043"]],
  ["116-CLAIM-10-OUTCOME", "measured-outcome", "Review a measured-outcome claim", "A repeated bounded change in a defined receiving-system or public measure, with uncertainty and attribution limits.", ["Stable repeated outcome series.", "Identity, period, definition, denominator, exclusions, and revisions.", "Comparison design, uncertainty, and alternatives."], ["Deployment count called benefit.", "Approval called safety gain.", "Single event called trend."], ["Testimonial.", "Incompatible ranking.", "Modeled benefit."], ["Define outcome.", "Lock denominator.", "Require recurrence.", "Test comparability.", "Record uncertainty.", "Bound attribution."], "signal-56a-air-travel-consumer", "The annual carrier-service rail can support bounded repeated service measures.", "signal-cpuc-waymo-fared-driverless-expansion-2024", "Expanded authority is not a measured passenger or safety outcome.", "Inadmissibility is required when a stable repeated denominator is absent.", ["measurement", "comparability"], ["116-Q-016", "116-Q-052"]],
  ["116-CLAIM-11-FORECAST", "forecast-or-scenario", "Review a forecast or scenario claim", "A conditional future path tied to a named model, base date, assumptions, horizon, range, and update history.", ["Model or issuer methodology.", "Base date, horizon, assumptions, range, and scenario conditions.", "Version and back-test or revision record where available."], ["Projection called observation.", "Central case called certainty.", "Target called forecast."], ["Chart without methodology.", "Superseded forecast.", "Different geography's projection."], ["Name model and version.", "Capture base date.", "List assumptions.", "Preserve range.", "Check updates.", "Separate observed values."], "signal-mag-2023-projections-phoenix-region-growth-evidence-layer", "MAG's projection is admissible as a named regional scenario layer.", "signal-bls-maricopa-q4-2025-employment-wage-baseline", "An observed labor baseline is not itself a forecast of future project workforce.", "Stop if model, base date, assumptions, horizon, or conditional status is missing.", ["uncertainty", "comparability"], ["116-Q-017", "116-Q-021"]],
  ["116-CLAIM-12-CORRECTION", "correction-or-withdrawal", "Review a correction, revision, or withdrawal", "A dated, attributable change from a preserved prior state to a bounded current state across every affected surface.", ["Original record and corrected, revised, superseding, or withdrawal artifact.", "Responsible authority, reason, effective date, and scope.", "Complete affected-record and propagation inventory."], ["Silent overwrite called correction.", "Routine data refresh called error correction.", "One page fixed while downstream synthesis remains stale."], ["Unattributed editor note.", "Deleted prior value.", "Third-party disagreement without authority."], ["Preserve prior state.", "Name correcting authority.", "Explain reason and scope.", "Date the decision.", "Inventory every surface.", "Verify propagated current state."], "signal-56a-census-asm", "The explicit ASM series break demonstrates why a discontinued or changed series must remain visible.", "signal-57e-amtrak-pids-cross-report-reconciliation", "Conflicting PIDS inventories require reconciliation; choosing one silently would not be a correction.", "Stop publication until prior state, corrected state, authority, date, reason, and propagation trail all resolve.", ["uncertainty", "boundaries"], ["116-Q-004", "116-Q-068"]],
];

const qualityProcedures = [
  ["116-QUALITY-01-IDENTITY", "canonical-identity", "Audit canonical identity", "Whether every material assertion resolves to one stable entity, cohort, asset, service, place, or instrument.", ["Canonical ID and typed aliases.", "Direct identity attributes and parent-child relations.", "Explicit non-equivalence rules."], ["Parent company merged with facility.", "Project merged with corridor.", "Same name assumed same entity."], ["Keyword match.", "Nearby asset.", "Aggregate operator total."], ["Resolve canonical ID.", "Verify type.", "Check aliases.", "Check parent-child links.", "Test non-equivalence.", "Record identity changes."], "signal-phoenix-z37-20-1-tsmc-campus-planning-record", "The planning record helps bound the named TSMC campus envelope.", "signal-mag-2023-projections-phoenix-region-growth-evidence-layer", "A Phoenix-region projection cannot identify one facility or project cohort.", "Fail the audit when a reasonable reviewer could map the claim to more than one entity.", ["boundaries", "place"], ["116-Q-017", "116-Q-049"]],
  ["116-QUALITY-02-CLAIM", "claim-bounding", "Audit claim bounding", "Whether actor, object, action, date, scope, status, and non-establishing boundary are explicit in each material claim.", ["Direct artifact and exact predicate.", "Date, scope, status, and claim type.", "Explicit downstream non-inference."], ["Verb implies later stage.", "Scope omitted.", "Status qualifier dropped."], ["Headline alone.", "Compound sentence mixing stages.", "Generic progress wording."], ["Mark actor.", "Mark object.", "Mark action.", "Mark date and scope.", "Classify status.", "Write boundary."], "signal-faa-powered-lift-final-operating-rule", "Its title and summary distinguish the regulatory layer from aircraft and service outcomes.", "signal-phoenix-tsmc-fab3-topping-out", "Calling topping out 'the fab is complete' would erase scope and stage qualifiers.", "Stop editing when a material sentence cannot be decomposed into one bounded evidence claim.", ["boundaries", "ladder"], ["116-Q-014", "116-Q-018"]],
  ["116-QUALITY-03-AUTHORITY", "authority-and-provenance", "Audit authority and provenance", "Whether the cited publisher is authoritative for the exact predicate and the evidence trail can be reconstructed.", ["Direct source ID and official artifact.", "Publisher competence, document date, capture date, and locator.", "Supersession and correction trail."], ["Official portal assumed to prove every claim.", "Secondary summary outranks primary record.", "Source authority transferred across domains."], ["Search snippet.", "Broken citation without capture.", "Organization homepage."], ["Open artifact.", "Verify publisher competence.", "Capture dates.", "Record locator.", "Check supersession.", "Trace signal lineage."], "signal-rhyolite-ridge-water-permit-preoperation-gates", "A regulator permit is authoritative for its pre-operation water conditions.", "signal-thacker-pass-doe-loan-financial-close", "DOE finance evidence cannot substitute for water-compliance authority.", "Fail when the source is merely official-looking rather than authoritative for the exact claim.", ["authority", "boundaries"], ["116-Q-026", "116-Q-050"]],
  ["116-QUALITY-04-STAGE", "conversion-stage-clarity", "Audit conversion-stage clarity", "Whether each record states exactly which conversion question is established, held, or not established.", ["Stage-specific direct artifact.", "Decision state and exact next artifact.", "Explicit no-transfer boundary."], ["Elapsed time implies progress.", "Maturity level substitutes for conversion.", "One stage automatically advances another."], ["Narrative momentum.", "Portfolio stage.", "Technology-readiness label."], ["Classify artifact.", "Match stage question.", "Record decision.", "Name next artifact.", "Test no-transfer.", "Inspect downstream language."], "signal-thacker-pass-doe-loan-financial-close", "Financial close supports Commitment and leaves later stages open.", "signal-thacker-pass-federal-land-authorization", "Land authority cannot be relabeled as production or accepted supply.", "Fail any record that names progress without a stage-specific artifact and stop rule.", ["ladder", "dependencies"], ["116-Q-026", "116-Q-027"]],
  ["116-QUALITY-05-PLACE", "geographic-and-local-specificity", "Audit geographic and local specificity", "Whether jurisdiction, service area, receiving institutions, infrastructure dependencies, and transfer limits are explicit.", ["Named geography and service boundary.", "Local authority and receiving-system records.", "Dependency and transfer-limit account."], ["National evidence proves local delivery.", "Metro average proves project condition.", "One corridor represents a country."], ["Unbounded map.", "Headquarters location.", "Adjacent jurisdiction statistic."], ["Name geography.", "Resolve service area.", "Identify authorities.", "List dependencies.", "Check local denominator.", "State transfer limits."], "signal-chandler-reclaimed-water-operating-scale", "The Chandler record supports a bounded local reclaimed-water operating context.", "signal-56a-epa-water-reuse", "A national implementation record without operating-volume denominator cannot prove Chandler or Phoenix delivery.", "Fail when the claim's receiving place or jurisdiction cannot be separated from broader context.", ["place", "dependencies"], ["116-Q-049", "116-Q-050"]],
  ["116-QUALITY-06-FRESHNESS", "time-and-freshness", "Audit time and freshness", "Whether event, source, capture, review, cadence, and next-check dates are fit for the claim and staleness is visible.", ["Event and publication dates.", "Capture and last-review dates.", "Cadence, expiry, supersession, and next check."], ["Old artifact written in present tense.", "Capture date mistaken for event date.", "Expired authority treated as current."], ["Undated dashboard.", "Cached snippet.", "Later summary with no disposition detail."], ["Separate all dates.", "Check expiry.", "Check supersession.", "Assess cadence.", "Set next check.", "Mark stale language."], "signal-faa-part450-operator-transition", "The completed transition record gives a dated regulatory population change.", "signal-56a-census-asm", "The ASM series ending after 2021 must not be presented as a current continuous series.", "Fail current-tense publication when freshness cannot be established for its intended use.", ["comparability", "uncertainty"], ["116-Q-013", "116-Q-033"]],
  ["116-QUALITY-07-MEASURE", "measurement-and-denominator", "Audit measurement and denominator", "Whether a reader can reconstruct what was measured, for whom, over which period, with which unit, exclusions, and uncertainty.", ["Measure definition and unit.", "Entity or cohort, period, denominator, and exclusions.", "Uncertainty and revision policy."], ["Numerator without denominator.", "Capacity denominator used for output.", "Changing cohort treated as stable."], ["Percentage without base.", "Cumulative total without period.", "Rounded marketing metric."], ["Define measure.", "Capture unit.", "Name cohort.", "Record period.", "Verify denominator.", "Trace revisions."], "signal-57d-amtrak-portfolio-denominator-series", "The Amtrak series explicitly surfaces denominator changes across reports.", "signal-57e-amtrak-pids-cross-report-reconciliation", "Incompatible inventories cannot yield one completion percentage without reconciliation.", "Fail quantitative publication when numerator, denominator, period, or entity cannot be reconstructed.", ["measurement", "comparability"], ["116-Q-016", "116-Q-052"]],
  ["116-QUALITY-08-COMPARABILITY", "comparability", "Audit comparability", "Whether identities, definitions, periods, denominators, methods, and series-break treatments permit the proposed comparison.", ["Compatibility decision for each compared field.", "Harmonization and exclusion method.", "Series-break and revision treatment."], ["Same label assumed same measure.", "Different periods ranked together.", "Different denominators normalized silently."], ["Index values as raw levels.", "Nominal and real values mixed.", "Provider definitions pooled."], ["Align identities.", "Align definitions.", "Align periods.", "Align denominators.", "Handle breaks.", "Declare exclusions."], "signal-56a-air-travel-consumer", "The annual carrier-service rail offers a basis for compatible within-series comparison.", "signal-57e-amtrak-pids-cross-report-reconciliation", "Two conflicting PIDS inventories are not comparable until scope is reconciled.", "Return Inadmissible rather than rank records when any material compatibility dimension fails.", ["comparability", "measurement"], ["116-Q-016", "116-Q-064"]],
  ["116-QUALITY-09-UNCERTAINTY", "uncertainty-and-alternatives", "Audit uncertainty and alternatives", "Whether limitations, competing explanations, disconfirming evidence, and conclusion-changing artifacts are visible.", ["Method and sampling uncertainty.", "Alternative explanations and counterevidence.", "Named artifact that would change the decision."], ["Record volume implies confidence.", "Absence of evidence proves nonexistence.", "One favored mechanism treated as causal."], ["Tone as confidence measure.", "Unbounded expert opinion.", "Unreported null result."], ["List unknowns.", "Quantify uncertainty where possible.", "Name alternatives.", "Seek disconfirming evidence.", "State attribution limit.", "Name decisive artifact."], "signal-nhtsa-waymo-flooded-roadway-recall-2026", "The recall supplies concrete counterevidence that bounds broad ADS operating claims.", "signal-cpuc-waymo-fared-driverless-expansion-2024", "Authority alone cannot resolve uncertainty about persistent service quality or safety.", "Fail any strong conclusion that omits a plausible alternative or the artifact that could reverse it.", ["uncertainty", "boundaries"], ["116-Q-044", "116-Q-052"]],
  ["116-QUALITY-10-REPRODUCIBILITY", "reproducibility-and-correction", "Audit reproducibility and correction", "Whether another reviewer can reconstruct the decision and see prior, current, corrected, and propagated states.", ["Stable IDs and machine-readable record.", "Public method, source lineage, and dated update.", "Prior/current state and complete propagation path."], ["Silent overwrite.", "Result without method.", "Correction isolated to one page."], ["Ephemeral note.", "Unversioned spreadsheet.", "Orphan update without affected IDs."], ["Re-run method.", "Resolve every ID.", "Compare prior state.", "Check dated update.", "Inspect all surfaces.", "Verify no hidden mutation."], "signal-56a-census-asm", "The explicit series-break record makes a discontinuity reproducible rather than silently smoothing history.", "signal-57e-amtrak-pids-cross-report-reconciliation", "Conflicting inventories show why a reproducible reconciliation must preserve both inputs.", "Fail when the conclusion cannot be regenerated from stable public inputs and a documented method.", ["uncertainty", "boundaries"], ["116-Q-004", "116-Q-068"]],
];

const parseSignal = (raw) => {
  const block = raw.split(/^---\s*$/m)[1] ?? "";
  const get = (key) => {
    const line = block.split(/\r?\n/).find((item) => item.startsWith(key + ":"));
    return (line ?? "").slice(key.length + 1).trim().replace(/^['\"]|['\"]$/g, "");
  };
  return { id: get("id"), status: get("record_status") };
};

const linkFoundations = (keys, foundationBySlug) => keys.map((key) => {
  const slug = foundationSlugs[key];
  const chapter = foundationBySlug.get(slug);
  if (!chapter) throw new Error("Missing Phase 118 foundation: " + slug);
  return { chapter_id: chapter.chapter_id, label: chapter.title, route: "/review/encyclopedia/foundations/" + slug + "/" };
});

const linkMissions = (ids, questionById) => ids.map((questionId) => {
  const question = questionById.get(questionId);
  if (!question) throw new Error("Missing Phase 116 priority question: " + questionId);
  const number = questionId.split("-").at(-1);
  const horizon = question.research_horizon.toLowerCase();
  return {
    mission_id: "121-MISSION-" + number,
    question_id: questionId,
    label: question.topic_slug.replaceAll("-", " ") + " — " + question.research_horizon,
    route: "/review/fieldbook/missions/" + question.topic_slug + "-" + horizon + "/",
  };
});

const corrections = (label) => [
  "Preserve the prior " + label + " decision and the direct artifact that supported it; never silently overwrite history.",
  "Record the correcting authority, reason, decision date, prior state, current state, and every affected stable ID.",
  "Propagate the correction through the source or artifact record, signal decision, canonical synthesis, pathway or mission, dependency surface, update log, and machine-readable export.",
  "Re-run content, phase, route, and release validation before publication; a partial propagation remains unpublished.",
];

const makeRecord = ({ kind, index, source, slug, title, label, definition, procedure, foundationBySlug, questionById }) => {
  const prefix = kind === "stage_playbook" ? "STAGE" : kind === "claim_review_protocol" ? "CLAIM" : "QUALITY";
  const group = kind === "stage_playbook" ? "stages" : kind === "claim_review_protocol" ? "claims" : "quality";
  return {
    record_id: "122-" + prefix + "-" + String(index + 1).padStart(2, "0"),
    record_kind: kind,
    source_contract_id: source,
    source_contract_label: label,
    slug,
    title,
    canonical_definition: definition,
    what_it_can_establish: procedure.establish,
    minimum_direct_evidence: procedure.direct,
    false_positives: procedure.falsePositives,
    inadmissible_substitutions: procedure.substitutions,
    reviewer_checklist: procedure.checklist,
    worked_example: { signal_ids: procedure.worked, interpretation: procedure.workedReading },
    counterexample: { signal_ids: procedure.counter, interpretation: procedure.counterReading },
    stop_rule: procedure.stop,
    correction_and_propagation_requirements: corrections(label.toLowerCase()),
    related_foundations: linkFoundations(procedure.foundations, foundationBySlug),
    related_missions: linkMissions(procedure.missions, questionById),
    route: "/review/fieldbook/method/" + group + "/" + slug + "/",
  };
};

export async function buildPhase122({ write = true } = {}) {
  const [coverage, encyclopedia] = await Promise.all([
    readJson(appRoot, "src", "data", "phase-116-coverage-architecture.json"),
    readJson(appRoot, "src", "data", "phase-118-canonical-living-encyclopedia.json"),
  ]);
  const foundationBySlug = new Map(encyclopedia.foundation_chapters.map((record) => [record.slug, record]));
  const questionById = new Map(coverage.priority_questions.map((record) => [record.question_id, record]));
  const stageById = new Map(coverage.conversion_stages.map((record) => [record.stage_id, record]));
  const claimById = new Map(coverage.claim_types.map((record) => [record.claim_type_id, record]));
  const qualityById = new Map(coverage.quality_dimensions.map((record) => [record.quality_dimension_id, record]));

  const stage_playbooks = stageProcedures.map((procedure, index) => {
    const contract = stageById.get(procedure.source);
    return makeRecord({ kind: "stage_playbook", index, source: procedure.source, slug: procedure.slug, title: procedure.title, label: contract.label, definition: contract.question, procedure: { ...procedure, worked: procedure.worked, counter: procedure.counter }, foundationBySlug, questionById });
  });
  const claim_review_protocols = claimProcedures.map((entry, index) => {
    const [source, slug, title, establish, direct, falsePositives, substitutions, checklist, workedId, workedReading, counterId, counterReading, stop, foundations, missions] = entry;
    const contract = claimById.get(source);
    return makeRecord({ kind: "claim_review_protocol", index, source, slug, title, label: contract.label, definition: contract.definition, procedure: { establish, direct, falsePositives, substitutions, checklist, worked: [workedId], workedReading, counter: [counterId], counterReading, stop, foundations, missions }, foundationBySlug, questionById });
  });
  const quality_audit_cards = qualityProcedures.map((entry, index) => {
    const [source, slug, title, establish, direct, falsePositives, substitutions, checklist, workedId, workedReading, counterId, counterReading, stop, foundations, missions] = entry;
    const contract = qualityById.get(source);
    return makeRecord({ kind: "quality_audit_card", index, source, slug, title, label: contract.label, definition: contract.audit_question, procedure: { establish, direct, falsePositives, substitutions, checklist, worked: [workedId], workedReading, counter: [counterId], counterReading, stop, foundations, missions }, foundationBySlug, questionById });
  });
  const records = [...stage_playbooks, ...claim_review_protocols, ...quality_audit_cards];

  const signalDirectory = join(appRoot, "src", "content", "signals");
  const signalById = new Map();
  for (const name of await readdir(signalDirectory)) {
    if (!name.endsWith(".mdx")) continue;
    const signal = parseSignal(await readFile(join(signalDirectory, name), "utf8"));
    signalById.set(signal.id, signal);
  }
  for (const record of records) {
    for (const id of [...record.worked_example.signal_ids, ...record.counterexample.signal_ids]) {
      if (signalById.get(id)?.status !== "Published") throw new Error(record.record_id + " references a missing or non-Published signal: " + id);
    }
  }

  const registry = {
    schema_version: "1.0",
    program_id: "FTFN-PHASE-122-VERIFICATION-PLAYBOOK-LIBRARY",
    phase: 122,
    edition: "v0.5",
    title: "Verification Playbook Library",
    effective_date: "2026-08-30",
    record_status: "Published",
    summary: "Thirty procedural playbooks turn the Phase 116 conversion-stage, claim-type, and quality contracts into repeatable reviewer decisions with direct-evidence thresholds, rejection tests, worked examples, correction paths, and stop rules.",
    publication_boundary: "This library explains how to review existing evidence. It creates no source, signal, gate decision, receipt, observation, outcome, score, ranking, or automatic publication authority.",
    operating_rules: [
      "A checklist organizes human review; it does not make a publication decision.",
      "Every worked example inherits the status, scope, source lineage, and limitations of its cited Published signal.",
      "A failed checklist or inadmissible substitution stops the claim at its last directly established state.",
      "Correction requires visible prior and current states plus complete downstream propagation.",
    ],
    counts: { stage_playbooks: 8, claim_review_protocols: 12, quality_audit_cards: 10, leaf_records: 30, public_html_routes: 31, public_json_exports: 1 },
    stage_playbooks,
    claim_review_protocols,
    quality_audit_cards,
    public_routes: ["/review/fieldbook/method/", ...records.map((record) => record.route), "/data/phase-122-verification-playbook-library.json"],
  };

  if (write) {
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, JSON.stringify(registry, null, 2) + "\n", "utf8");
  }
  return registry;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const registry = await buildPhase122();
    console.log("Phase 122 registry built: " + registry.counts.leaf_records + " procedural records across " + registry.counts.public_html_routes + " HTML routes and one JSON export.");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
