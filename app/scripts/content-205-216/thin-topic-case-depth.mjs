// Additional authored case analysis. Citations refer to the topic-local source
// list; research inspection is not independent subject acceptance.
const paragraph = (text, citations = []) => ({text, citations});
const note = (source_index, locator, scope, access = 'Official artifact text inspected') => ({source_index, checked_date:'2026-09-14', locator, scope, access});

export const thinTopicCaseDepth = {
  climate: {
    cases: [
      [
        paragraph('The August 2026 assessment makes the distinction concrete: NOAA reports a contiguous-U.S. monthly average of 75.6°F, 3.5°F above the twentieth-century average. Its summer statistic is a separate June–August average. These national aggregates describe exposure context, not the number of hours a named site exceeded its design temperature. The release also places the drought estimate on September 1, rather than treating drought coverage as another August temperature measurement. A reader should retain those different clocks even when they appear on one page.', [1]),
        paragraph('FTFN interpretation: suppose a project account attributes reduced output to heat. Start with the project’s time interval and location, not the national headline. Match local weather to actual output and an operating constraint; then examine maintenance, electricity supply, production scheduling and other plausible explanations. The annual record helps explain why the question deserves attention. It does not select the explanation. A useful case conclusion is therefore conditional: regional heat supports investigating local thermal exposure, while the size and cause of a particular operating loss remain unmeasured here. That distinction lets readers use climate information without converting it into a facility failure claim.')
      ],
      [
        paragraph('The denominator is part of this reservoir case. Reclamation describes the July inflow as unregulated inflow and the storage fraction against live capacity. Neither is automatically the water delivered to a specific customer. The page’s August 21 timestamp also precedes this September 14 reading: a page labeled Current Status can contain an older observation. Its future release ranges remain operating projections or decisions, not completed outflows. This edition retains that reporting lag instead of moving the July quantities into September.', [2]),
        paragraph('FTFN interpretation: the project-level question is how a reservoir condition travels through a delivery system. A reader examining a factory should look for the particular entitlement, conveyance route, supplier agreement and metered delivery that connect that factory to the water source. A reader examining power service needs generation and dispatch records instead. These branches share hydrologic context but measure different services. Even a complete reservoir balance would not, by itself, establish either customer outcome. The decisive next evidence is the named operator action and period-matched delivery or generation record, with any contractual interpretation reviewed separately by the appropriate specialist.')
      ]
    ],
    source_notes: [
      note(0,'Annual assessment: Temperature; publication date','Calendar-2025 regional context. Not a site reading or outage attribution.'),
      note(1,'Key Takeaways; Temperature; Drought; Published','August and summer temperatures and the September 1 drought snapshot have different periods. The later detailed report was not assumed available merely from its scheduled date.'),
      note(2,'Current Status; Current Operations; Last Updated','Reported July inflow, release and storage are distinct quantities; future operating ranges are not completed service. No entitlement interpretation is supplied.')
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
      note(0,'NADA 141-609, printed pages 1–3; General Information; Effectiveness','April 29, 2025 approval of a specified alteration. Homozygous resistance, day-21 endpoint and KS06 exception retained. No commercial adoption estimate.'),
      note(1,'V-006378, Evaluation of Risks; Overall Conclusion, printed page 8','Low-risk determination and enforcement discretion, not an approval. Safety reasoning does not constitute a repeated production-outcome series.'),
      note(2,'FDA announcement, March 7, 2022','Communicates the low-risk decision; it is not a separate farm experiment.')
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
      note(0,'First Look release, June 23, 2025: test observations; imagery caption; commissioning statement','Test imagery and reported candidate discoveries are distinguished from planned survey outputs. No annualized discovery-rate calculation.'),
      note(1,'LIGO-P2000318-v11, abstract and O3b catalog link','Exact historical interval and p-astro threshold retained. The document record was checked; no reanalysis of strain data or claim to the latest catalog.'),
      note(2,'NASA article date; testing/operations paragraph; article metadata','Displayed publication date August 25, 2026, correcting this draft’s August 27 date. Operations are reported from August 3; those are separate dates. No independent availability series.')
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
