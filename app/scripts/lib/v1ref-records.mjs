export const unique = (values) => [...new Set(values)];

export function recordId(record) {
  const phaseId = Object.entries(record).find(([key, value]) => key.endsWith("_id") && typeof value === "string")?.[1];
  return phaseId ?? (typeof record.id === "string" ? record.id : null);
}

export function canonicalRecordSlug(record, registry) {
  const hub = registry.routes?.hub;
  if (typeof hub === "string" && typeof record.route === "string" && record.route !== hub && record.route.startsWith(hub)) {
    const relative = record.route.slice(hub.length).split("/").filter(Boolean).join("--");
    if (relative) return relative;
  }
  if (typeof record.slug === "string" && record.slug) return record.slug;
  const routeSlug = record.route?.split("/").filter(Boolean).at(-1);
  if (routeSlug) return routeSlug;
  const id = recordId(record);
  if (id) return String(id).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  throw new Error("Cannot derive a canonical route slug for a v1 reference record.");
}

export function collectPrimaryRecords(registry) {
  const records = [];
  const seen = new Set();
  const declaredRoutes = new Set(registry.public_html_routes ?? []);
  const visit = (value) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    const id = recordId(value);
    const slug = typeof value.slug === "string" ? value.slug : value.route?.split("/").filter(Boolean).at(-1);
    if (
      id
      && typeof slug === "string"
      && typeof value.route === "string"
      && declaredRoutes.has(value.route)
    ) {
      if (!seen.has(id)) {
        seen.add(id);
        records.push(value.slug ? value : { ...value, slug });
      }
      return;
    }
    Object.values(value).forEach(visit);
  };
  visit(registry);
  return records;
}

export function phaseHub(registry) {
  if (typeof registry.routes?.hub === "string") return registry.routes.hub;
  const routes = registry.public_html_routes ?? [];
  return routes[0] ?? null;
}

export function phaseExport(registry) {
  if (typeof registry.routes?.public_export === "string") return registry.routes.public_export;
  return registry.public_json_exports?.[0] ?? null;
}

export function validateRegistryInventory(registry) {
  const records = collectPrimaryRecords(registry);
  const hub = phaseHub(registry);
  const exportRoute = phaseExport(registry);
  const htmlRoutes = registry.public_html_routes ?? [];
  const jsonExports = registry.public_json_exports ?? [];
  const failures = [];
  if (!hub) failures.push("missing phase hub route");
  if (!exportRoute) failures.push("missing phase export route");
  if (unique(htmlRoutes).length !== htmlRoutes.length) failures.push("duplicate HTML route");
  if (unique(jsonExports).length !== jsonExports.length) failures.push("duplicate JSON export");
  if (hub && !htmlRoutes.includes(hub)) failures.push("hub absent from HTML route inventory");
  if (exportRoute && !jsonExports.includes(exportRoute)) failures.push("public export absent from JSON route inventory");
  const recordRoutes = records.map((record) => record.route);
  if (unique(recordRoutes).length !== recordRoutes.length) failures.push("duplicate primary-record route");
  for (const route of recordRoutes) if (!htmlRoutes.includes(route)) failures.push(`record route absent from inventory: ${route}`);
  const detailRoutes = htmlRoutes.filter((route) => route !== hub);
  for (const route of detailRoutes) if (!recordRoutes.includes(route)) failures.push(`detail route lacks a primary record: ${route}`);
  return { records, hub, exportRoute, htmlRoutes, jsonExports, failures };
}
