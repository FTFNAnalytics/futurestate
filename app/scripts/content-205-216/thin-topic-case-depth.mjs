// Additional authored case analysis. Citations refer to the topic-local source
// list; research inspection is not independent subject acceptance.
const paragraph = (text, citations = []) => ({text, citations});
const note = (source_index, locator, scope, access = 'Official artifact text inspected') => ({source_index, checked_date:'2026-09-14', locator, scope, access});
const recheckedNote = (source_index, locator, scope, access = 'Exact official HTML text re-read September 22') => ({source_index, checked_date:'2026-09-22', locator, scope, access});

export const thinTopicCaseDepth = {
  climate: {
    cases: [
      [
        paragraph('The August 2026 assessment makes the distinction concrete: NOAA reports a contiguous-U.S. monthly average of 75.6°F, 3.5°F above the twentieth-century average. Its summer statistic is a separate June–August average. These national aggregates describe exposure context, not the number of hours a named site exceeded its design temperature. The release also places the drought estimate on September 1, rather than treating drought coverage as another August temperature measurement. A reader should retain those different clocks even when they appear on one page.', [1]),
        paragraph('FTFN interpretation: suppose a project account attributes reduced output to heat. Start with the project’s time interval and location, not the national headline. Match local weather to actual output and an operating constraint; then examine maintenance, electricity supply, production scheduling and other plausible explanations. The annual record helps explain why the question deserves attention. It does not select the explanation. A useful case conclusion is therefore conditional: regional heat supports investigating local thermal exposure, while the size and cause of a particular operating loss remain unmeasured here. That distinction lets readers use climate information without converting it into a facility failure claim.')
      ],
      [
        paragraph('The denominator is part of this reservoir case. Reclamation describes the July inflow as unregulated inflow and the storage fraction against live capacity. Neither is automatically the water delivered to a specific customer. In the retained September 14 reading, the page carried an August 21 timestamp: a page labeled Current Status can contain an older observation. The September 22 source return below identifies the replacement snapshot separately. Its future release ranges remain operating projections or decisions, not completed outflows. The July quantities are not moved into a later month.', [2]),
        paragraph('FTFN interpretation: the project-level question is how a reservoir condition travels through a delivery system. A reader examining a factory should look for the particular entitlement, conveyance route, supplier agreement and metered delivery that connect that factory to the water source. A reader examining power service needs generation and dispatch records instead. These branches share hydrologic context but measure different services. Even a complete reservoir balance would not, by itself, establish either customer outcome. The decisive next evidence is the named operator action and period-matched delivery or generation record, with any contractual interpretation reviewed separately by the appropriate specialist.')
      ]
    ],
    source_notes: [
      recheckedNote(0,'Annual assessment: Temperature; Precipitation; Published January 13, 2026','Calendar-2025 regional context was re-read; it is not a site reading or outage attribution.'),
      recheckedNote(1,'Key Takeaways; Temperature; Drought; Published September 9, 2026','August, June–August summer and the September 1 drought snapshot retain different periods. The linked detailed report was not inspected in this recheck.'),
      recheckedNote(2,'Current Status; Current Operations; Inflow Forecasts and Model Projections; Last Updated September 15, 2026','The rolling page now reports August observations; the August 21/July account is retained history. Inflow, release and closing storage are not a complete balance. Forecasts are not actual deliveries. No entitlement interpretation.','Official HTML inspected and retained locally September 22; no interval ledger or independently reproduced balance acquired')
    ]
  },
  'agriculture-and-bioeconomy': {
    cases: [
      [
        paragraph('The regulated object matters: FDA’s summary distinguishes the intentional genomic alteration from the animal itself. The document allows breeding or food use for animals carrying one or two copies, but its resistance indication is for homozygous animals. In the described challenges, resistance required both undetectable viral RNA and undetectable PRRSV-binding antibodies at day 21. A breeding-use statement therefore cannot be substituted for a claim that every carrier of the alteration meets the resistance endpoint.', [0]),
        paragraph('FTFN interpretation: follow the genotype through the breeding and production cohort before assessing performance. A farm-level study would need to say which animals carried two copies, which strains they encountered, how infections were detected, how losses were counted and how management differed between groups. The KS06 exception makes the pathogen boundary especially important; the regulator’s assessment of that strain at approval is not an indefinitely current surveillance result. The practical research question is whether the specified resistance persists under documented field exposure, with breakthrough reporting and uncertainty visible. Approval establishes a decision for an intended use; it does not fill the commercial monitoring record.')
      ],
      [
        paragraph('FDA’s risk-assessment conclusion explicitly says the PRLR-SLICK alteration is not approved, conditionally approved or indexed. The low-risk decision instead concerns enforcement discretion for Acceligen’s specified alteration and associated products. The assessment examines molecular characterization, the trait’s relationship to naturally occurring mutations, animal safety, food safety and environmental considerations. That scope is meaningful evidence, but it is different from a trial estimating a farm’s production gain under a specified heat exposure.', [1,2]),
        paragraph('FTFN interpretation: separate three questions that a promotional summary might collapse. First, what regulatory position applies to this exact alteration? Second, what biological response is supported under the studied conditions? Third, what changed for a particular herd in ordinary operation? A future field comparison should document breed background, genotype, heat and humidity, husbandry, observation period and outcomes chosen in advance. It should also report adverse or null findings. Short hair, a safety assessment and a commercial performance estimate are not competing descriptions of the same measurement. They are different links in the evidence chain, and each can be useful without substituting for the others.')
      ]
    ],
    source_notes: [
      recheckedNote(0,'NADA 141-609, printed pages 1–3 and 18; Table VIII.4 and its exclusion note','Genotype, day-21 endpoint and KS06 limitation remain essential. The aggregate table excludes a challenge without infected controls. No commercial adoption estimate or current strain-surveillance result.','Exact 20-page FDA PDF text reviewed in relevant sections; pages 1–3 and 18 rendered and visually inspected September 22, not a full experimental reproduction'),
      recheckedNote(1,'V-006378, Conclusions on printed page 8, including lineage scope and approval-status wording','Enforcement discretion is distinct from approval and is limited to products from the two reviewed cattle and their progeny. This is not a repeated field-outcome study.','Exact eight-page FDA PDF conclusion rendered and visually inspected September 22; other pages were not visually re-reviewed'),
      recheckedNote(2,'FDA bulletin dated March 7, 2022: decision type, two cattle and offspring','The announcement communicates the same lineage-limited low-risk decision. It is not a separate commercial-cohort experiment.')
    ]
  },
  quantum: {
    cases: [
      [
        paragraph('The April 28, 2026 correction identifies Figure 3a as a repetition-code result: the original horizontal-axis description incorrectly said surface-code distance, and the legend labels were also amended. This matters because the long repetition-code experiment and the surface-code memory are different tests. The correction supplies a specific figure-label repair; it is neither evidence that every result was withdrawn nor permission to transfer the repetition-code result to general logical computation.', [3]),
        paragraph('FTFN interpretation: distinguish preservation, manipulation and application. A memory test asks whether encoded information survives under its tested cycle and decoding conditions. An application must also execute the required operations, handle its inputs and produce a verifiable result within a resource budget. The infrastructure behind the logical qubit includes calibration, measurement, decoding and the physical processor; a count of qubits cannot describe that whole system. For this case, the useful conclusion is that a prerequisite improved under an explicit experiment. To advance the application claim, seek the actual task and its complete execution record, not an extrapolation that quietly changes the experiment.')
      ],
      [
        paragraph('This edition now pins arXiv:2404.02280v3, revised November 17, 2024. Its authors report that comparisons depend on post-selection and say the revision corrected a misinterpreted physical teleportation baseline. The abstract describes repeated-error-correction comparisons against repeated physical CNOT baselines. Those details prevent an earlier version’s baseline or a selected-shot result from becoming an unconditional performance promise. No improvement factor is extracted into a cross-platform ranking here.', [2]),
        paragraph('FTFN interpretation: post-selection changes the question from how every attempted run performed to how an accepted subset performed. A reader evaluating usefulness should request both the acceptance rule and the cost of rejected attempts. Likewise, a baseline is a specified physical procedure, not a universal reference machine. Ask whether it performs the same logical task, which resources it consumes and how uncertainty was estimated. A later comparison should preserve circuit identity, decoding method, acceptance fraction and the version of the analysis. This makes the experimental result more informative without calling it a delivered application or a universal architecture advantage.')
      ]
    ],
    source_notes: [
      note(0,'Abstract; A surface code memory below threshold; High-distance repetition codes; Change history','Memory and repetition-code tests are kept separate. The paper’s main text was inspected; no new raw-data reproduction or universal application claim is made.'),
      note(1,'Published-paper abstract and date in IBM Research’s Nature record','Author-hosted exact-paper record used after direct publisher retrieval failed. It describes a noise-model/code-design result, not an installed processor; the differently stated QIP talk abstract is not substituted.'),
      note(2,'arXiv:2404.02280v3, Abstract; Comments; Submission history','Version pinned to November 17, 2024. Post-selection and the corrected physical teleportation baseline remain visible. Full experimental reproduction and independent subject review remain open.'),
      note(3,'Author Correction, April 28, 2026: Figure 3a axis and legend','Specific repetition-code labeling correction. It does not establish that unrelated numerical claims changed.','Publisher correction text retrieved through official-domain search; direct article/PDF retrieval failed, so no PDF visual inspection is claimed.')
    ]
  },
  'discovery-technologies': {
    cases: [
      [
        paragraph('The release connects its imagery to just over ten hours of test observations and describes the ten-year survey as upcoming at the time. It also reports 2,104 newly identified asteroids in that early observation set. These statements give the first-look milestone a concrete acquisition interval, but extrapolating that interval into a constant ten-year discovery rate would discard selection, cadence and confirmation differences. The release’s forward-looking data-volume and discovery expectations remain forecasts in this edition.', [0]),
        paragraph('FTFN interpretation: one can trace this case through distinct products. The detector produces measurements; processing turns them into calibrated images and measurements of objects; an analysis identifies changes or candidates; subsequent assessment supports a scientific conclusion. A public image demonstrates a real delivered product without measuring the performance of every downstream stage. To assess an operating survey, request observing coverage, repeated calibration, data-release definitions and validation appropriate to the claim. The next milestone should be evaluated on its own evidence. Nothing in a June 2025 first-look release establishes the complete September 2026 operating state simply because the page is still accessible.')
      ],
      [
        paragraph('The inspected record is LIGO-P2000318-v11. It places O3b between November 1, 2019 at 15:00 UTC and March 27, 2020 at 17:00 UTC, and selects the stated candidates at astrophysical probability above 0.5. A probability threshold is part of the catalog definition, not a direct count of all events that occurred in the Universe. The record also distinguishes inferred component properties from matter effects that the gravitational-wave data alone do not uniquely measure.', [1]),
        paragraph('FTFN interpretation: a catalog is both a scientific result and a reproducible selection decision. Comparing two releases requires more than subtracting their totals. Check observing duration, instrument sensitivity, search procedures, candidate thresholds and which earlier candidates were retained or revised. A count can grow because of more observing time or a changed analysis; those mechanisms have different implications for capability. For a reader, the strongest next step is to follow a named candidate into the released analysis and its uncertainties. This historical catalog supports bounded conclusions about its own selection process, not the latest event count, a threshold-free discovery rate or a universal identification of every binary component.')
      ]
    ],
    source_notes: [
      recheckedNote(0,'First Look release, June 23, 2025: test-observation interval; imagery caption; commissioning statement','The release describes early observations and a then-future survey. It was re-read as a historical milestone, not evidence of the complete September 2026 survey state.'),
      recheckedNote(1,'LIGO-P2000318-v11: Abstract; Notes and Changes; linked data release','O3b runs from November 1, 2019 to March 27, 2020 and uses p-astro above 0.5. This accepted-version record is historical, not the latest event total.','Exact document record re-read September 22; linked paper, data release and strain data not independently reproduced'),
      recheckedNote(2,'NASA publication date August 25, 2026; paragraph beginning After completing a testing campaign; Page Last Updated','May–July testing, August 3 operations and August 25 publication are distinct dates. This is NASA’s milestone account, not an independently reproduced availability series.')
    ]
  }
};

export function deepenThinTopics(editions) {
  const identities={climate:['209-CASE-001','209-CASE-002'],'agriculture-and-bioeconomy':['209-CASE-003','209-CASE-004'],quantum:['209-CASE-005','209-CASE-006'],'discovery-technologies':['209-CASE-007','209-CASE-008']};
  return editions.map(edition => {
    const expansion=thinTopicCaseDepth[edition.slug];
    if(!expansion)throw new Error(`Missing topic case expansion: ${edition.slug}`);
    let caseIndex=0;
    const sections=edition.sections.map(section => /^Case [12] —/.test(section.heading)
      ? {...section,case_id:identities[edition.slug][caseIndex],paragraphs:expansion.cases[caseIndex++]}
      : section);
    if(caseIndex!==2)throw new Error(`Expected two distinct cases: ${edition.slug}`);
    return {...edition,sections,source_notes:expansion.source_notes,case_development_state:'Two expanded cases drafted; independent factual/subject acceptance pending'};
  });
}
