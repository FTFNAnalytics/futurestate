import p181 from "./phase-181-canonical-resource-map.json";
import p182 from "./phase-182-evidence-source-backlog.json";
import p183 from "./phase-183-missing-system-topic-missions.json";
import p184 from "./phase-184-canonical-topic-edition-2.json";
import p185 from "./phase-185-global-place-systems-atlas-i.json";
import p186 from "./phase-186-named-delivery-case-atlas-ii.json";
import p187 from "./phase-187-outcomes-longitudinal-observatory.json";
import p188 from "./phase-188-state-of-frontier-systems-edition.json";
import p189 from "./phase-189-global-authority-rail-activation.json";
import p190 from "./phase-190-global-jurisdiction-system-profiles.json";
import p191 from "./phase-191-international-named-project-conversion-cohort.json";
import p192 from "./phase-192-global-place-systems-atlas.json";
import p193 from "./phase-193-comparative-evidence-lab.json";
import p194 from "./phase-194-longitudinal-outcomes-observatory.json";
import p195 from "./phase-195-canonical-question-library.json";
import p196 from "./phase-196-global-reference-candidate-gate.json";
import p197 from "./phase-197-underrepresented-region-topic-gap-closure.json";
import p198 from "./phase-198-failure-delay-reversal-correction-casebooks.json";
import p199 from "./phase-199-distribution-affordability-service-quality-observatory.json";
import p200 from "./phase-200-cross-system-constraint-monographs.json";
import p201 from "./phase-201-change-intelligence-correction-service.json";
import p202 from "./phase-202-accessible-multilingual-low-bandwidth-editions.json";
import p203 from "./phase-203-state-of-future-systems-2026.json";
import p204 from "./phase-204-v1-public-reference-edition-promotion-gate.json";

type Registry = Record<string, any>;

const idFor = (record: Registry) => Object.entries(record).find(([key, value]) => key.endsWith("_id") && typeof value === "string")?.[1] ?? record.id;

export const canonicalV1refSlug = (record: Registry, registry: Registry) => {
  const hub = registry.routes?.hub;
  if (typeof hub === "string" && typeof record.route === "string" && record.route !== hub && record.route.startsWith(hub)) {
    const relative = record.route.slice(hub.length).split("/").filter(Boolean).join("--");
    if (relative) return relative;
  }
  if (typeof record.slug === "string" && record.slug) return record.slug;
  const routeSlug = record.route?.split("/").filter(Boolean).at(-1);
  if (routeSlug) return routeSlug;
  const id = idFor(record);
  if (id) return String(id).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  throw new Error("Cannot derive a canonical route slug for a v1 reference record.");
};

export const collectV1refPrimaryRecords = (registry: Registry) => {
  const records: Registry[] = [];
  const ids = new Set<string>();
  const declaredRoutes = new Set<string>(registry.public_html_routes ?? []);
  const visit = (value: any) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) return value.forEach(visit);
    const id = idFor(value);
    const slug = typeof value.slug === "string" ? value.slug : value.route?.split("/").filter(Boolean).at(-1);
    if (
      typeof id === "string"
      && typeof slug === "string"
      && typeof value.route === "string"
      && declaredRoutes.has(value.route)
    ) {
      if (!ids.has(id)) { ids.add(id); records.push(value.slug ? value : { ...value, slug }); }
      return;
    }
    Object.values(value).forEach(visit);
  };
  visit(registry);
  return records;
};

export const v1refRegistries = [
  ["resource-map", p181], ["evidence-source-backlog", p182], ["missing-system-missions", p183], ["topic-canon", p184],
  ["global-places-i", p185], ["delivery-cases-ii", p186], ["outcome-candidates", p187], ["frontier-systems-edition", p188],
  ["global-authority", p189], ["jurisdictions", p190], ["international-projects", p191], ["global-places-ii", p192],
  ["comparative-lab", p193], ["longitudinal-review", p194], ["questions", p195], ["global-reference-gate", p196],
  ["gap-closure", p197], ["failure-casebooks", p198], ["distribution-observatory", p199], ["constraint-monographs", p200],
  ["change-intelligence", p201], ["accessible-editions", p202], ["state-of-future-systems", p203], ["promotion-gate", p204],
] as const;

export const v1refNativeDefinitions = v1refRegistries.map(([section, registry]) => ({
  section,
  registry,
  phase: registry.phase,
  items: collectV1refPrimaryRecords(registry),
}));

export const v1refDefinitions = v1refNativeDefinitions.map(({ section, registry, phase, items }) => ({
  release: "v1ref",
  section,
  registry: {
    ...registry,
    routes: { ...registry.routes, hub: `/review/v1ref/${section}/` },
  },
  phase,
  items: items.map((item) => {
    const slug = canonicalV1refSlug(item, registry);
    return {
      ...item,
      source_slug: item.slug,
      source_route: item.route,
      slug,
      route: `/review/v1ref/${section}/${slug}/`,
    };
  }),
}));

export const v1refDatasetMap = Object.fromEntries(v1refRegistries.map(([, registry]) => [String(registry.routes.public_export).replace(/^\/data\//, "").replace(/\.json$/, ""), registry]));
