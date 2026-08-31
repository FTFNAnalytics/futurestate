import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (name) => JSON.parse(await readFile(join(dataRoot, name), "utf8"));

const [coverage, authority, encyclopedia, atlas] = await Promise.all([
  readJson("phase-116-coverage-architecture.json"),
  readJson("phase-117-global-authority-graph.json"),
  readJson("phase-118-canonical-living-encyclopedia.json"),
  readJson("phase-119-deep-project-place-atlas.json"),
]);

const authorityRoutes = [
  "/review/authority/",
  ...authority.jurisdictions.map((record) => `/review/authority/jurisdictions/${record.slug}/`),
  ...authority.rails.map((record) => `/review/authority/rails/${record.slug}/`),
];
const encyclopediaRoutes = encyclopedia.public_routes.filter((route) => !route.endsWith(".json"));
const atlasRoutes = [
  atlas.routes.project_index,
  atlas.routes.place_index,
  ...atlas.projects.map((record) => `/atlas/projects/${record.slug}/`),
  ...atlas.places.map((record) => `/atlas/places/${record.slug}/`),
];
const phaseRoutes = [
  { phase: 116, title: coverage.title, routes: coverage.phase_routes },
  { phase: 117, title: authority.title, routes: authorityRoutes },
  { phase: 118, title: encyclopedia.title, routes: encyclopediaRoutes },
  { phase: 119, title: atlas.title, routes: atlasRoutes },
];
const publicHtmlRoutes = ["/review/v04/", ...phaseRoutes.flatMap((record) => record.routes)];
const uniquePublicHtmlRoutes = [...new Set(publicHtmlRoutes)];
const publicJsonExports = [
  "/data/v04-public-conversion-observatory.json",
  "/data/phase-116-coverage-architecture.json",
  "/data/global-authority-graph.json",
  "/data/phase-118-canonical-living-encyclopedia.json",
  atlas.routes.public_export,
];

if (uniquePublicHtmlRoutes.length !== publicHtmlRoutes.length) {
  throw new Error("The v0.4 route registry contains a duplicate public HTML route.");
}

const program = {
  schema_version: "1.0",
  dataset: "v04_public_conversion_observatory",
  program_id: "FTFN-V04-PUBLIC-CONVERSION-OBSERVATORY",
  version: "0.4",
  title: "FTFN v0.4 — Public Conversion Observatory",
  effective_date: "2026-08-30",
  record_status: "Published",
  status: "Complete",
  summary: "A governed coverage architecture, international authority graph, canonical living encyclopedia, and deep project-and-place atlas that make the route from public claim to authority, implementation, accepted operation, and comparable outcome explicit.",
  core_objectives: [
    "Build the most legible public account of how frontier technologies and system transitions move from research and policy into real institutions, infrastructure, services, and outcomes.",
    "Keep claims, authority, commitments, implementation, acceptance, recurring operation, and outcomes distinct so readers can see both what is established and what remains unknown.",
    "Connect every synthesis layer back to named evidence, named entities, geographic context, uncertainty, and a visible maintenance responsibility.",
    "Expand international and local coverage without converting discovery portals, candidate rails, editorial synthesis, or future checks into evidence they do not contain.",
  ],
  publication_boundaries: [
    "Phase 117 authority rails are Candidate discovery infrastructure. A portal identity is not evidence of a project, adoption, accepted operation, comparison, or outcome.",
    "Phase 118 chapters synthesize already published FTFN records and state their source and signal lineage; they create no new empirical observation or outcome claim.",
    "Phase 119 distinguishes governed records from curated editorial records and exposes the coverage tier on every project and place page.",
    "No Phase 60 future evidence gate, Phase 61 project decision, observation, outcome, score, ranking, or translation-review state is changed by v0.4.",
  ],
  phases: phaseRoutes.map((record) => ({
    phase: record.phase,
    title: record.title,
    status: "Complete",
    public_html_routes: record.routes.length,
    routes: record.routes,
  })),
  counts: {
    phases: 4,
    public_html_routes: uniquePublicHtmlRoutes.length,
    public_json_exports: publicJsonExports.length,
    canonical_topics: coverage.counts.topics,
    conversion_stages: coverage.counts.conversion_stages,
    claim_types: coverage.counts.claim_types,
    canonical_entities: coverage.counts.canonical_entities,
    jurisdiction_layers: authority.counts.jurisdictions,
    candidate_authority_rails: authority.counts.authority_rails,
    candidate_source_records_added: authority.counts.source_records_added,
    encyclopedia_chapters: encyclopedia.counts.chapters,
    projects: atlas.counts.projects_total,
    places: atlas.counts.places_total,
  },
  public_html_routes: uniquePublicHtmlRoutes,
  public_json_exports: publicJsonExports,
};

await writeFile(join(dataRoot, "v04-public-conversion-observatory.json"), `${JSON.stringify(program, null, 2)}\n`, "utf8");
console.log(`FTFN v0.4 registry built: ${program.counts.public_html_routes} HTML routes, ${program.counts.public_json_exports} JSON exports, and ${program.counts.candidate_authority_rails} Candidate authority rails.`);
