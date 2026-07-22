import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

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
    dependencyMaps,
    briefings
  ] = await Promise.all([
    getCollection("signals"),
    getCollection("topics"),
    getCollection("sources"),
    getCollection("organizations"),
    getCollection("technologies"),
    getCollection("localSystems"),
    getCollection("dependencyMaps"),
    getCollection("briefings")
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
    "/atlas/dependency-maps/",
    "/briefings/",
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
    ...dependencyMaps.map((dependencyMap) => urlEntry(`/atlas/dependency-maps/${dependencyMap.data.slug}/`)),
    ...briefings
      .filter((briefing) => briefing.data.record_status === "Published")
      .map((briefing) => urlEntry(`/briefings/${briefing.data.slug}/`, briefing.data.published_date ?? briefing.data.captured_date))
  ].sort();

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.join("\n")}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
