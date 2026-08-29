import "./generate-phase57f-content.mjs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-03";
const collectionSlug = "named-asset-project-cohort-registry-expansion-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-037-named-asset-project-cohort-registry-expansion";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => "  - " + JSON.stringify(item))].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const slugify = (value) => value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

for (const name of ["sources", "research-documents", "signals", "research-collections", "briefings", "updates"]) {
  await mkdir(join(contentRoot, name), { recursive: true });
}

const phase57f = JSON.parse(await readFile(join(dataRoot, "phase-57f-measured-reliability-observed-adoption-full-output-reconciliation.json"), "utf8"));
if (phase57f.phase !== "57F" || phase57f.records.length !== 25) throw new Error("Phase 57G requires the complete Phase 57F ledger.");

const agencyMeta = {
  DOT: { entity: "agency-dot", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  NTIA: { entity: "agency-ntia", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOE: { entity: "agency-doe", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
};

const sources = [
  {
    id: "source-57g-montana-bead-final-proposal-january-2026", name: "Montana BEAD Final Proposal, January 5, 2026",
    url: "https://doa.mt.gov/_docs/connectmt/MT-BEAD-Final-Proposal-1.5.26.pdf", owner: "Montana Department of Administration", agency: "NTIA", frequency: "Event Driven", access: "Report Series",
    limitation: "The approved Final Proposal is an award baseline. It does not establish executed grant agreements, construction, service activation, subscriber adoption, performance, retention, or accepted closeout.",
  },
  {
    id: "source-57g-montana-deployment-projects-csv", name: "Montana BEAD Final Proposal Deployment Projects CSV",
    url: "https://doa.mt.gov/_docs/connectmt/fp_deployment_projects-1.5.26.csv", owner: "Montana Department of Administration", agency: "NTIA", frequency: "Event Driven", access: "Data Download",
    limitation: "The file identifies approved proposal projects, funding, match, UEIs, and selected project attributes. It is not a construction, service, adoption, or acceptance report.",
  },
  {
    id: "source-57g-montana-locations-csv", name: "Montana BEAD Final Proposal Locations CSV",
    url: "https://doa.mt.gov/_docs/connectmt/fp_locations-1.5.26.csv", owner: "Montana Department of Administration", agency: "NTIA", frequency: "Event Driven", access: "Data Download",
    limitation: "FTFN publishes only project-level counts and raw code distributions from the location file. Individual BSL identifiers and sensitive location details remain outside public output.",
  },
  {
    id: "source-57g-montana-subgrantees-csv", name: "Montana BEAD Final Proposal Subgrantees CSV",
    url: "https://doa.mt.gov/_docs/connectmt/fp_subgrantees-1.5.26.csv", owner: "Montana Department of Administration", agency: "NTIA", frequency: "Event Driven", access: "Data Download",
    limitation: "The file supplies named proposed subgrantee identities, UEIs, and FRNs. Listing does not establish agreement execution, performance, service, adoption, or closeout.",
  },
  {
    id: "source-57g-montana-cai-csv", name: "Montana BEAD Final Proposal Community Anchor Institutions CSV",
    url: "https://doa.mt.gov/_docs/connectmt/fp_CAI-1.5.26.csv", owner: "Montana Department of Administration", agency: "NTIA", frequency: "Event Driven", access: "Data Download",
    limitation: "FTFN publishes project-level CAI counts rather than individual facility details. Inclusion is a proposal-baseline assignment, not proof of service or outcome.",
  },
  {
    id: "source-57g-hanford-dflaw-process-animation", name: "DOE Hanford Direct-Feed Low-Activity Waste Process Animation",
    url: "https://www.energy.gov/em/articles/hanford-releases-new-direct-feed-low-activity-waste-program-animation", owner: "U.S. Department of Energy, Office of Environmental Management", agency: "DOE", frequency: "Event Driven", access: "Release Page",
    limitation: "The process description defines lifecycle nodes and handoffs, not batch identities, container identities, measured mass, quality disposition, acceptance, or a reconciled production result.",
  },
  {
    id: "source-57g-hanford-ap106-feed-staging", name: "DOE Hanford Tank AP-106 Waste-Feed Mission",
    url: "https://www.energy.gov/em/articles/making-space-hanford-prepares-key-tank-waste-treatment-mission", owner: "U.S. Department of Energy, Office of Environmental Management", agency: "DOE", frequency: "Event Driven", access: "Release Page",
    limitation: "The page identifies AP-106's intended staging role and design volume but does not provide public batch IDs, transfer dates, accepted feed mass, quality results, or a complete material balance.",
  },
  {
    id: "source-57g-nnsa-lap4-30-base-construction", name: "NNSA LAP4 30 Base Equipment Installation CD-2/3 Approval",
    url: "https://www.energy.gov/nnsa/articles/nnsa-approves-start-construction-plutonium-pit-production-subproject-los-alamos", owner: "National Nuclear Security Administration", agency: "DOE", frequency: "Event Driven", access: "Release Page",
    limitation: "The 2023 approval defines the LAP4 umbrella, five-subproject structure, 30 Base scope, cost ceiling, and schedule. It does not establish current completion, operating rate, qualified output, or acceptance.",
  },
  {
    id: "source-57g-nnsa-fy2026-weapons-activities", name: "DOE FY 2026 Weapons Activities Congressional Justification",
    url: "https://www.energy.gov/sites/default/files/2025-06/doe-fy-2026-vol-1-wa.pdf", owner: "U.S. Department of Energy and National Nuclear Security Administration", agency: "DOE", frequency: "Annual", access: "Report Series",
    limitation: "Budget project structures, requests, forecasts, and planned critical decisions are not completed construction, accepted capacity, or qualified operating output.",
  },
];

for (const source of sources) {
  const meta = agencyMeta[source.agency];
  await writeJson(join(contentRoot, "sources", `${source.id}.json`), {
    id: source.id, name: source.name, url: source.url, source_type: "Government Agency", credibility_level: "Tier 1",
    primary_topics: meta.topics, framework_layers: meta.layers, country_or_region: "United States", update_frequency: source.frequency,
    capture_priority: "High", known_limitations: source.limitation, last_checked_date: capturedDate,
    watch_lanes: ["Security and Standards", "Cross-Cutting Official Rails"], live_access_type: source.access,
    ...(source.access === "Data Download" ? { data_download_url: source.url } : {}),
    review_cadence_days: source.frequency === "Annual" ? 365 : 45, monitoring_status: "Active",
    coverage_role: ["Primary Data", "Source Freshness"], jurisdiction: "United States public-sector program", source_owner: source.owner,
    notes: `Phase 57G named-asset and project-cohort registry source. Collection: ${collectionSlug}.`,
  });
}

const parseCohort = (raw, cohort, lifecycle) => raw.trim().split("\n").map((line) => {
  const [row, station, state, designStatus, designYear, deliveryStatus, deliveryYear] = line.split("|");
  return {
    membership_id: `AMTRAK-APPB-${cohort.toUpperCase()}-${row.padStart(3, "0")}`,
    source_row: Number(row), station_id: `AMTRAK-STATION-${state}-${slugify(station)}`,
    source_display_name: station, state, cohort, lifecycle,
    design_status: designStatus, projected_design_completion: designYear,
    delivery_status: deliveryStatus, projected_delivery_completion: deliveryYear,
    historical_snapshot_date: "2023-04-30", source_id: "source-57f-amtrak-stations-alp-fy24-29",
    outcome_state: null,
  };
});

const trainAccessRows = parseCohort(`
1|Marshall|TX|Complete|FY15|Complete|FY18
2|Clifton Forge|VA|Complete|FY15|Complete|FY19
3|Glenwood Springs|CO|Complete|FY16|Complete|FY19
4|Paoli|PA|Complete|FY16|Complete|FY19
5|Mount Joy|PA|Complete|FY14|Complete|FY19
6|Buffalo - Exchange St.|NY|Complete|FY18|Complete|FY21
7|Hazlehurst|MS|Complete|FY19|Complete|FY21
8|Picayune|MS|Complete|FY19|Complete|FY21
9|Gastonia|NC|Complete|FY19|Complete|FY21
10|Toccoa|GA|Complete|FY19|Complete|FY21
11|Sanderson|TX|Complete|FY19|Complete|FY21
12|Ashland|VA|Complete|FY19|Complete|FY21
13|Tyrone|PA|Complete|FY19|Complete|FY21
14|Alderson|WV|Complete|FY19|Complete|FY22
15|Middletown|PA|Complete|FY20|Complete|FY22
16|Crawfordsville|IN|Complete|FY21|Complete|FY22
17|Westerly|RI|Complete|FY18|Complete|FY22
18|Thurmond|WV|Complete|FY21|Complete|FY23
19|Newark|DE|Complete|FY18|In Progress|FY24
20|Ardmore|PA|Complete|FY21|In Progress|FY24
21|McComb|MS|In Progress|FY21|Pending|FY24
22|Latrobe|PA|In Progress|FY21|Pending|FY24
23|Yuma|AZ|In Progress|FY21|Pending|FY27
24|Philadelphia - North|PA|In Progress|FY22|Pending|FY25
25|Elko|NV|In Progress|FY22|Pending|FY27
26|Harpers Ferry|WV|In Progress|FY22|Pending|FY28
27|Aberdeen|MD|In Progress|FY23|Pending|FY29
28|Parkesburg|PA|In Progress|FY24|Pending|FY26
29|Coatesville|PA|In Progress|FY24|Pending|FY25
30|Downingtown|PA|In Progress|FY24|Pending|TBD
`, "train-access", "Design and construction response to known or potential train-access deficiency");

const pidsRows = parseCohort(`
1|Aberdeen|MD|Complete|FY12|Complete|FY12
2|Bloomington - Normal|IL|Complete|FY11|Complete|FY12
3|New Carrolton|MD|Complete|FY12|Complete|FY12
4|Wilmington|DE|Complete|FY12|Complete|FY12
5|Baltimore|MD|Complete|FY13|Complete|FY14
6|Denver|CO|Complete|FY14|Complete|FY14
7|Minot|ND|Complete|FY13|Complete|FY14
8|Anaheim|CA|Complete|FY14|Complete|FY15
9|Dearborn|MI|Complete|FY14|Complete|FY15
10|Fargo|ND|Complete|FY14|Complete|FY15
11|East Glacier Park|MT|Complete|FY14|Complete|FY15
12|Glenwood Springs|CO|Complete|FY14|Complete|FY15
13|Huntington|WV|Complete|FY15|Complete|FY15
14|Johnstown|PA|Complete|FY14|Complete|FY15
15|Marshall|TX|Complete|FY14|Complete|FY15
16|Norfolk|VA|Complete|FY14|Complete|FY15
17|Davis|CA|Complete|FY15|Complete|FY15
18|Savannah|GA|Complete|FY14|Complete|FY15
19|Tuscaloosa|AL|Complete|FY14|Complete|FY15
20|Washington|DC|Complete|FY13|Complete|FY15
21|Florence|SC|Complete|FY15|Complete|FY16
22|Greenville|SC|Complete|FY15|Complete|FY16
23|Lorton (Auto Train)|VA|Complete|FY13|Complete|FY16
24|Prince|WV|Complete|FY14|Complete|FY16
25|Providence|RI|Complete|FY13|Complete|FY16
26|Route 128 - Westwood|MA|Complete|FY13|Complete|FY16
27|Shelby|MT|Complete|FY14|Complete|FY16
28|Seattle - King St. Station|WA|Complete|FY15|Complete|FY16
29|Sanford (Auto Train)|FL|Complete|FY13|Complete|FY16
30|Klamath Falls|OR|Complete|FY17|Complete|FY17
31|Meriden|CT|Complete|FY17|Complete|FY17
32|Portland|ME|Complete|FY17|Complete|FY17
33|Rochester|NY|Complete|FY14|Complete|FY17
34|Saco|ME|Complete|FY17|Complete|FY17
35|Tukwila|WA|Complete|FY17|Complete|FY17
36|Wallingford|CT|Complete|FY17|Complete|FY17
37|Waterloo|IN|Complete|FY16|Complete|FY17
38|Albany - Rensselaer|NY|Complete|FY14|Complete|FY18
39|Austin|TX|Complete|FY17|Complete|FY18
40|Berlin|CT|Complete|FY17|Complete|FY18
41|Burlington|NC|Complete|FY17|Complete|FY18
42|Brunswick|ME|Complete|FY17|Complete|FY18
43|Carlinville|IL|Complete|FY17|Complete|FY18
44|Cary|NC|Complete|FY17|Complete|FY18
45|Durham|NC|Complete|FY17|Complete|FY18
46|Eugene - Springfield|OR|Complete|FY17|Complete|FY18
47|Freeport|ME|Complete|FY17|Complete|FY18
48|Havre|MT|Complete|FY17|Complete|FY18
49|Houston|TX|Complete|FY17|Complete|FY18
50|Jacksonville|FL|Complete|FY15|Complete|FY18
51|La Junta|CO|Complete|FY17|Complete|FY18
52|New London|CT|Complete|FY17|Complete|FY18
53|Old Orchard Beach|ME|Complete|FY17|Complete|FY18
54|Orlando|FL|Complete|FY18|Complete|FY18
55|Raleigh|NC|Complete|FY17|Complete|FY18
56|Richmond - Staples Mill Road|VA|Complete|FY15|Complete|FY18
57|Schenectady|NY|Complete|FY17|Complete|FY18
58|Salem|OR|Complete|FY17|Complete|FY18
59|Tacoma|WA|Complete|FY17|Complete|FY18
60|Tampa|FL|Complete|FY17|Complete|FY18
61|Wells|ME|Complete|FY17|Complete|FY18
62|Williston|ND|Complete|FY17|Complete|FY18
63|Charleston|SC|Complete|FY18|Complete|FY18
64|Winter Haven|FL|Complete|FY17|Complete|FY19
65|Alexandria|VA|Complete|FY18|Complete|FY19
66|Fredericksburg|VA|Complete|FY18|Complete|FY19
67|Omaha|NE|Complete|FY17|Complete|FY19
68|BWI Marshall Airport|MD|Complete|FY17|Complete|FY20
69|Carbondale|IL|Complete|FY17|Complete|FY20
70|Kingston|RI|Complete|FY17|Complete|FY20
71|Olympia/Lacey|WA|Complete|FY17|Complete|FY20
72|Philadelphia-30th Street Station|PA|Complete|FY15|Complete|FY20
73|Old Saybrook|CT|Complete|FY17|Complete|FY21
74|Rhinecliff|NY|Complete|FY15|Complete|FY21
75|New York - Penn Station|NY|Complete|FY14|Complete|FY21
76|Harrisburg|PA|Complete|FY18|Complete|FY22
77|Lancaster|PA|Complete|FY17|Complete|FY22
78|Chicago - Union Station|IL|Complete|FY17|In Progress|FY24
79|Albany|OR|Complete|FY18|Complete|FY22
80|Battle Creek|MI|Complete|FY18|Complete|FY21
81|Grand Junction|CO|Complete|FY18|Complete|FY22
82|Longview|TX|Complete|FY18|Complete|FY22
83|Everett|WA|Complete|FY18|Complete|FY22
84|Kirkwood|MO|Complete|FY18|Complete|FY23
85|Oxnard|CA|Complete|FY18|Complete|FY23
86|Pasco|WA|Complete|FY18|Complete|FY22
87|South Bend|IN|Complete|FY18|Complete|FY22
88|Tucson|AZ|Complete|FY17|Complete|FY23
89|Pittsburgh|PA|Complete|FY19|In Progress|FY23
90|Columbia|SC|Complete|FY19|In Progress|FY23
91|Charlottesville|VA|Complete|FY19|Pending|FY23
92|Fayetteville|NC|Complete|FY19|In Progress|FY23
93|Hudson|NY|Complete|FY19|Complete|FY23
94|Kansas City|MO|Complete|FY19|Complete|FY23
95|Miami|FL|Complete|FY19|Complete|FY23
96|Newport News|VA|Complete|FY19|Pending|FY23
97|Springfield|IL|Complete|FY19|Pending|FY24
98|Utica|NY|Complete|FY19|In Progress|FY24
99|Williamsburg|VA|Complete|FY19|In Progress|FY22
100|Galesburg|IL|Complete|FY20|In Progress|FY23
101|Saratoga Springs|NY|Complete|FY20|In Progress|FY23
102|Lynchburg|VA|Complete|FY21|In Progress|FY24
103|Albuquerque|NM|Complete|FY21|In Progress|FY23
104|Ann Arbor|MI|Complete|FY21|Complete|FY23
105|Bellingham|WA|Complete|FY21|In Progress|FY23
106|Deland|FL|Complete|FY21|Complete|FY23
107|Edmonds|WA|Complete|FY21|Complete|FY23
108|El Paso|TX|Complete|FY21|Complete|FY23
109|Fort Worth|TX|Complete|FY21|In Progress|FY23
110|Jackson|MS|Complete|FY21|In Progress|FY23
111|Kelso-Longview|WA|Complete|FY21|Complete|FY23
112|Portland|OR|Complete|FY21|In Progress|FY23
113|Rocky Mount|NC|Complete|FY21|In Progress|FY24
114|Whitefish|MT|Complete|FY21|In Progress|FY23
115|Wilson|NC|Complete|FY21|In Progress|FY23
116|Buffalo - Depew|NY|Complete|FY21|In Progress|FY24
117|Salinas|CA|Complete|FY21|Complete|FY23
118|Hanford|CA|Cancelled|N/A|Cancelled|N/A
119|Detroit|MI|Complete|FY18|On Hold|TBD
120|Atlanta|GA|Complete|FY19|On Hold|TBD
`, "pids", "Design and deployment response to known or potential passenger information display deficiency");

const amenityRows = parseCohort(`
1|Birmingham|AL|Complete|FY15|Complete|FY17
2|Camden|SC|Complete|FY13|Complete|FY15
3|Columbus|WI|Complete|FY14|Complete|FY17
4|Cut Bank|MT|Complete|FY13|Complete|FY17
5|Detroit Lakes|MN|Complete|FY13|Complete|FY17
6|Devils Lake|ND|Complete|FY13|Complete|FY17
7|East Glacier Park|MT|Complete|FY13|Complete|FY14
8|Fargo|ND|Complete|FY14|Complete|FY17
9|Gainesville|GA|Complete|FY13|Complete|FY15
10|Glasgow|MT|Complete|FY14|Complete|FY16
11|Havre|MT|Complete|FY13|Complete|FY15
12|Helper|UT|Complete|FY14|Complete|FY17
13|Huntington|WV|Complete|FY14|Complete|FY16
14|Johnstown|PA|Complete|FY14|Complete|FY18
15|La Junta|CO|Complete|FY14|Complete|FY17
16|Libby|MT|Complete|FY13|Complete|FY17
17|Macomb|IL|Complete|FY15|Complete|FY17
18|Malta|MT|Complete|FY13|Complete|FY15
19|Maysville|KY|Complete|FY16|Complete|FY16
20|McGregor|TX|Complete|FY16|Complete|FY17
21|Mt. Pleasant|IA|Complete|FY14|Complete|FY15
22|Niles|MI|Complete|FY14|Complete|FY16
23|Plattsburgh|NY|Complete|FY17|Complete|FY18
24|Port Huron|MI|Complete|FY16|Complete|FY17
25|Prince|WV|Complete|FY13|Complete|FY16
26|Raton|NM|Complete|FY15|Complete|FY17
27|Red Wing|MN|Complete|FY13|Complete|FY16
28|Rochester|NY|Complete|FY15|Complete|FY17
29|Rugby|ND|Complete|FY13|Complete|FY16
30|Savannah|GA|Complete|FY13|Complete|FY15
31|St. Cloud|MN|Complete|FY13|Complete|FY17
32|Stanley|ND|Complete|FY13|Complete|FY16
33|Staunton|VA|Complete|FY13|Complete|FY15
34|Tuscaloosa|AL|Complete|FY15|Complete|FY17
35|Williston|ND|Complete|FY13|Complete|FY17
36|Winona|MN|Complete|FY13|Complete|FY17
37|Alpine|TX|Complete|FY15|Complete|FY18
38|Charleston|SC|Complete|FY15|Complete|FY18
39|Richmond - Staples Mill Road|VA|Complete|FY16|Complete|FY18
40|Clifton Forge|VA|Complete|FY15|Complete|FY19
41|Fort Morgan|CO|Complete|FY14|Complete|FY19
42|Glenwood Springs|CO|Complete|FY16|Complete|FY19
43|Princeton|IL|Complete|FY16|Complete|FY19
44|Tomah|WI|Complete|FY16|Complete|FY19
45|Houston|TX|Complete|FY14|Complete|FY19
46|Creston|IA|Complete|FY17|Complete|FY19
47|Cumberland|MD|Complete|FY17|Complete|FY19
`, "amenity", "Design and construction response to known or potential station access or amenity deficiency");

const amtrakMembershipRows = [...trainAccessRows, ...pidsRows, ...amenityRows];
const uniqueStationMap = new Map();
for (const row of amtrakMembershipRows) {
  const item = uniqueStationMap.get(row.station_id) ?? { station_id: row.station_id, source_display_name: row.source_display_name, state: row.state, cohorts: [] };
  item.cohorts.push(row.membership_id);
  uniqueStationMap.set(row.station_id, item);
}
const statusCounts = (rows) => Object.fromEntries([...new Set(rows.map((row) => row.delivery_status))].sort().map((status) => [status, rows.filter((row) => row.delivery_status === status).length]));
const amtrakRegistry = {
  phase: "57G", captured_date: capturedDate, registry_type: "Historical named-station cohort membership",
  source_id: "source-57f-amtrak-stations-alp-fy24-29", historical_snapshot_date: "2023-04-30",
  membership_count: amtrakMembershipRows.length, unique_station_count: uniqueStationMap.size,
  cohort_counts: { train_access: trainAccessRows.length, pids: pidsRows.length, access_and_amenity: amenityRows.length },
  delivery_status_counts: { train_access: statusCounts(trainAccessRows), pids: statusCounts(pidsRows), access_and_amenity: statusCounts(amenityRows) },
  boundary: "These rows preserve the Appendix B historical cohort and plan-state identity. They do not establish current asset condition, uptime, use, complaint, remediation, boarding-time, rider outcome, or accepted closeout.",
  stations: [...uniqueStationMap.values()], membership_rows: amtrakMembershipRows,
};
await writeJson(join(dataRoot, "phase-57g-amtrak-named-station-registry.json"), amtrakRegistry);

const subgrantees = `
PX3CHN4WCPG3|AMAZON KUIPER COMMERCIAL SERVICES LLC|35927706
DCJTA84G5C75|SAFELINK INTERNET, L.L.C.|16179855
FEHNV13B9994|BIALEKI HOLDINGS LLC|20591780
KU6LTS39K9N4|BLACKFOOT TELEPHONE COOPERATIVE, INC.|1646165
L5W6ZMH9GM51|SPECTRUM PACIFIC WEST LLC|21520077
K9JTRFBU4DH1|GALLATIN WIRELESS INTERNET, LLC|25296351
U3USRJUWGMN6|GRIZZLY BROADBAND LLC|26802363
FBU3ABAM3KE7|INLAND MT LLC|32869737
VKTRZ9JF5RB3|INTERBEL TELEPHONE COOPERATIVE INC|6301592
WFF1YRLNLA35|LINCOLN TELEPHONE CO|1647734
UN1WNQVV11X7|MONTANA INTERNET CORPORATION|11562717
PTVEPVDJH2K5|PROJECT TELEPHONE COMPANY|3758315
JJVXC1A7BYG6|RANGE TELEPHONE COOPERATIVE INC|1646140
KY5RFTW5TEU3|SIYEH COMMUNICATIONS CO|29046562
C6M7C2FLKER5|SPACE EXPLORATION TECHNOLOGIES CORP.|26043968
KVGRDKXST245|TRIANGLE COMMUNICATION SYSTEM, INC|1637222
T6NTQ7J74C95|VISIONARY COMMUNICATIONS LLC|18092593
H14NYL2SZJF9|ZIPLY FIBER PACIFIC, LLC|31764285
ZXZSJJQPHEB9|ZIPLY FIBER OF MONTANA LLC|3574563
`.trim().split("\n").map((line) => {
  const [uei, legal_name, frn] = line.split("|");
  return { subgrantee_id: `MT-BEAD-UEI-${uei}`, state: "MT", uei, legal_name, frn, outcome_state: null };
});

const leoUeis = new Set(["PX3CHN4WCPG3", "C6M7C2FLKER5"]);
const montanaProjects = `
CM61-BEAD-MT-4644|AKCS - Montana - All Counties|PX3CHN4WCPG3|24957|0|14974200|4991400|61|Y|Flathead; Crow; Northern Cheyenne; Blackfeet; Fort Peck
CM61-BEAD-MT-4655|Blackfoot Telephone Cooperative Inc - Missoula - 1|KU6LTS39K9N4|3724|24|26234612|8744870|70,50|Y|Flathead
CM61-BEAD-MT-4654|Gallatin Wireless Internet-Park-1|K9JTRFBU4DH1|6495|60|92428300|16310876|71,50|Y|Crow
CM61-BEAD-MT-4685|InlandMT-Rosebud-1|FBU3ABAM3KE7|135|0|2023515|674505|71|Y|Crow; Northern Cheyenne
CM61-BEAD-MT-4669|Starlink Montana BEAD|C6M7C2FLKER5|18705|0|31008075|28443945|61|Y|Flathead; Crow; Northern Cheyenne; Blackfeet; Fort Peck
CM61-BEAD-MT-4657|Gallatin Wireless Internet-Stillwater-1|K9JTRFBU4DH1|1275|14|10196154|3398899|71,50|N|
CM61-BEAD-MT-4658|Grizzly Broadband-Ravalli-1|U3USRJUWGMN6|1122|43|8523919|2841419|50,71|N|
CM61-BEAD-MT-4648|InlandMT-LewisClark-1|FBU3ABAM3KE7|458|0|6813095|2272000|71|N|
CM61-BEAD-MT-4673|InterBel-FlatheadCounty-Application1|VKTRZ9JF5RB3|379|1|3148600|3148600|50|N|
CM61-BEAD-MT-4672|InterBel-FlatheadCounty-Application2|VKTRZ9JF5RB3|83|0|620925|206975|50|N|
CM61-BEAD-MT-4670|InterBel-LincolnCounty-Application2|VKTRZ9JF5RB3|19|2|218500|72834|50|N|
CM61-BEAD-MT-4662|InterBel-FlatheadCounty-Application3|VKTRZ9JF5RB3|200|0|1687140|908460|50|N|
CM61-BEAD-MT-4677|LincTel Communications - Lewis and Clark - 2|WFF1YRLNLA35|70|0|770603|256867|50|N|
CM61-BEAD-MT-4679|Montana Internet Corporation-Broadwater County|UN1WNQVV11X7|1154|10|4600623|6241873|50|N|
CM61-BEAD-MT-4651|Project Telephone Absarokee Town|PTVEPVDJH2K5|132|0|1000000|1073776|50|N|
CM61-BEAD-MT-4686|Range - Rosebud|JJVXC1A7BYG6|120|0|1758075|3125465|50|N|
CM61-BEAD-MT-4668|Range - Treasure|JJVXC1A7BYG6|184|0|2356969|785656|50|N|
CM61-BEAD-MT-4675|Safelink Internet dba Anthem Broadband- Gallatin County|DCJTA84G5C75|217|0|1348584|449527|72,50|N|
CM61-BEAD-MT-4661|Siyeh Communications - Flathead County|KY5RFTW5TEU3|894|4|8960175|2986725|50|N|
CM61-BEAD-MT-4693|Spectrum Pacific West - Missoula|L5W6ZMH9GM51|171|0|2468674|822891|50|N|
CM61-BEAD-MT-4692|Spectrum Pacific West - Flathead|L5W6ZMH9GM51|1483|0|19159362|6386455|50|N|
CM61-BEAD-MT-4691|Spectrum Pacific West - Cascade|L5W6ZMH9GM51|283|0|2162620|720873|50|N|
CM61-BEAD-MT-4689|Spectrum Pacific West - Carbon|L5W6ZMH9GM51|442|0|3478221|1159407|50|N|
CM61-BEAD-MT-4645|Triangle Communications - Hill - 1|KVGRDKXST245|388|0|599573|199858|71|N|
CM61-BEAD-MT-4256|Inland MT- Pondera- 1|FBU3ABAM3KE7|561|0|7807654|2602552|71|N|
CM61-BEAD-MT-4261|Inland MT- Cascade and Fergus Counties|FBU3ABAM3KE7|2894|0|43394500|39546500|71|N|
CM61-BEAD-MT-4246|VCN-BEAD-Whitehall|T6NTQ7J74C95|758|1|828823|169231|71,72,50|N|
CM61-BEAD-MT-4218|Ziply Fiber Pacific, LLC|H14NYL2SZJF9|686|0|1823196|5551078|50|N|
CM61-BEAD-MT-4206|Ziply Fiber of Montana LLC|ZXZSJJQPHEB9|214|0|2234435|744811|50|N|
CM61-BEAD-MT-4149|KDS_Cascade_County_Fber_Project-CBG_1|FEHNV13B9994|36|0|331803|110601|50|N|
CM61-BEAD-MT-4212|KDS_Cascade_County_Fber_Project-CBG_2|FEHNV13B9994|76|3|692479|230827|50|N|
CM61-BEAD-MT-4678|Triangle Communications - Hill - 2|KVGRDKXST245|0|21|33124|11042||N|
`.trim().split("\n").map((line) => {
  const [project_id, project_name, uei, bsl, cai, bead, match, technology, tribal, tribal_consent_name] = line.split("|");
  return {
    project_id, project_name, uei, subgrantee_id: `MT-BEAD-UEI-${uei}`,
    bsl_count: Number(bsl), cai_count: Number(cai), bead_support_usd: Number(bead), subgrantee_match_usd: Number(match),
    raw_technology_codes: technology ? technology.split(",") : [], intersects_tribal_land: tribal === "Y",
    tribal_consent_name: tribal_consent_name || null,
    reporting_contract: leoUeis.has(uei) ? "LEO quarterly and ten-year post-availability contract" : "Terrestrial quarterly, testing, monitoring, reimbursement, and closeout contract",
    outcome_state: null,
  };
});

const montanaRegistry = {
  phase: "57G", captured_date: capturedDate, registry_type: "Approved Final Proposal subgrantee and deployment-project cohort baseline",
  proposal_approval_date: "2026-01-05", subgrantee_count: subgrantees.length, project_count: montanaProjects.length,
  bsl_location_rows: montanaProjects.reduce((sum, row) => sum + row.bsl_count, 0), cai_rows: montanaProjects.reduce((sum, row) => sum + row.cai_count, 0),
  bead_support_total_usd: montanaProjects.reduce((sum, row) => sum + row.bead_support_usd, 0),
  subgrantee_match_total_usd: montanaProjects.reduce((sum, row) => sum + row.subgrantee_match_usd, 0),
  raw_location_classification_counts: { "0": 45401, "1": 22914 },
  raw_location_technology_counts: { "50": 14199, "61": 43662, "70": 684, "71": 8983, "72": 787 },
  privacy_boundary: { individual_bsl_identifiers_published: 0, individual_cai_details_published: 0, public_granularity: "Project-level counts and raw code distributions only" },
  interpretation_boundary: "The registry is an approved-proposal identity and denominator baseline. Raw codes remain untranslated unless an official schema is joined. No row establishes executed agreement, construction, service, subscriber adoption, test passage, retention, affordability, state acceptance, or closeout.",
  source_ids: ["source-57g-montana-bead-final-proposal-january-2026", "source-57g-montana-deployment-projects-csv", "source-57g-montana-locations-csv", "source-57g-montana-subgrantees-csv", "source-57g-montana-cai-csv", "source-57f-montana-bead-resource-index-august-2026", "source-57f-montana-leo-quarterly-instructions-june-2026", "source-57e-montana-quarterly-report-instructions-june-2026", "source-57e-montana-project-monitoring-guide-june-2026"],
  subgrantees, projects: montanaProjects,
};
await writeJson(join(dataRoot, "phase-57g-montana-project-cohort-registry.json"), montanaRegistry);

const hanfordNodes = [
  ["HANFORD-DFLAW-RETRIEVAL", "Tank-waste retrieval and source selection", "Process stage", "DOE Hanford tank operations", null, "HANFORD-DFLAW-TSCR"],
  ["HANFORD-DFLAW-TSCR", "Tank-Side Cesium Removal solids and cesium separation", "Treatment system", "DOE Hanford tank operations", "HANFORD-DFLAW-RETRIEVAL", "HANFORD-DFLAW-AP106"],
  ["HANFORD-DFLAW-AP106", "Tank AP-106 pretreated-feed staging", "Named tank and staging stage", "DOE Hanford tank operations", "HANFORD-DFLAW-TSCR", "HANFORD-DFLAW-222S"],
  ["HANFORD-DFLAW-222S", "222-S Laboratory batch certification", "Quality-control stage", "DOE Hanford laboratory operations", "HANFORD-DFLAW-AP106", "HANFORD-DFLAW-TRANSFER"],
  ["HANFORD-DFLAW-TRANSFER", "Underground transfer to the Low-Activity Waste Facility", "Transfer stage", "DOE Hanford tank operations", "HANFORD-DFLAW-222S", "HANFORD-LAW-FEED"],
  ["HANFORD-LAW-FEED", "Low-Activity Waste Facility feed receipt", "Facility receipt stage", "Waste Treatment and Immobilization Plant", "HANFORD-DFLAW-TRANSFER", "HANFORD-LAW-MELTER-1"],
  ["HANFORD-LAW-MELTER-1", "Low-Activity Waste Facility Melter 1", "Named production asset", "Waste Treatment and Immobilization Plant", "HANFORD-LAW-FEED", "HANFORD-LAW-CONTAINER-FILL"],
  ["HANFORD-LAW-MELTER-2", "Low-Activity Waste Facility Melter 2", "Named production asset", "Waste Treatment and Immobilization Plant", "HANFORD-LAW-FEED", "HANFORD-LAW-CONTAINER-FILL"],
  ["HANFORD-LAW-CONTAINER-FILL", "Stainless-steel container fill", "Container lifecycle stage", "Waste Treatment and Immobilization Plant", "HANFORD-LAW-MELTER-1/2", "HANFORD-LAW-CONTAINER-HANDLING"],
  ["HANFORD-LAW-CONTAINER-HANDLING", "Lid placement, exterior swab, and quality handling", "Container quality stage", "Waste Treatment and Immobilization Plant", "HANFORD-LAW-CONTAINER-FILL", "HANFORD-LAW-EXPORT-BAY"],
  ["HANFORD-LAW-EXPORT-BAY", "Low-Activity Waste Facility export bay", "Facility handoff stage", "Waste Treatment and Immobilization Plant", "HANFORD-LAW-CONTAINER-HANDLING", "HANFORD-IDF-TRANSPORT"],
  ["HANFORD-IDF-TRANSPORT", "Reusable transport sleeve and shipment to IDF", "Shipment stage", "DOE Hanford waste operations", "HANFORD-LAW-EXPORT-BAY", "HANFORD-IDF-STAGING"],
  ["HANFORD-IDF-STAGING", "Integrated Disposal Facility staging pad and receipt", "Receipt and staging stage", "Integrated Disposal Facility", "HANFORD-IDF-TRANSPORT", "HANFORD-IDF-DISPOSAL"],
  ["HANFORD-IDF-DISPOSAL", "Integrated Disposal Facility disposal cell", "Final disposal stage", "Integrated Disposal Facility", "HANFORD-IDF-STAGING", null],
].map(([stage_id, label, object_type, custodian, input_stage_id, output_stage_id], index) => ({
  sequence: index + 1, stage_id, label, object_type, custodian, input_stage_id, output_stage_id,
  stable_public_batch_id_available: false, stable_public_container_id_available: false,
}));

const hanfordEvents = [
  { event_id: "HANFORD-EVENT-2020-AP106-FEED-MISSION", observation_date: "2020-02-18", observation_period: "2020 AP-106 commissioning plan", stage_id: "HANFORD-DFLAW-AP106", measure: "AP-106 designated for pretreated-feed staging", operator: "milestone", value: null, unit: null, source_id: "source-57g-hanford-ap106-feed-staging" },
  { event_id: "HANFORD-EVENT-2025-09-20-CONTAINERS", observation_date: null, observation_period: "2025 extended hot-commissioning campaign", stage_id: "HANFORD-LAW-CONTAINER-HANDLING", measure: "immobilized-waste containers completed", operator: ">", value: 20, unit: "containers", source_id: "source-57c-hanford-20-containers-2025" },
  { event_id: "HANFORD-EVENT-2025-10-ACCEPTABLE-GLASS", observation_date: null, observation_period: "2025-10 consent-decree startup window", stage_id: "HANFORD-LAW-CONTAINER-FILL", measure: "acceptable-quality glass consent-decree startup milestone", operator: "milestone", value: null, unit: null, source_id: "source-57e-doe-hanford-acceptable-glass-startup" },
  { event_id: "HANFORD-EVENT-2026-02-19-SENT", observation_date: "2026-02-12", stage_id: "HANFORD-IDF-TRANSPORT", measure: "vitrified-waste containers sent to IDF", operator: "=", value: 19, unit: "containers", source_id: "source-57f-hanford-wtp-pmm-february-2026" },
  { event_id: "HANFORD-EVENT-2026-02-34-FILLED", observation_date: null, observation_period: "2026-02 regulator snapshot", stage_id: "HANFORD-LAW-CONTAINER-FILL", measure: "containers filled in regulator snapshot", operator: "=", value: 34, unit: "containers", source_id: "source-57b-ecology-wtp-byproduct-response-comments" },
  { event_id: "HANFORD-EVENT-2026-04-FIRST-DISPOSAL", observation_date: "2026-04-08", stage_id: "HANFORD-IDF-DISPOSAL", measure: "first batch permanently disposed", operator: "milestone", value: null, unit: null, source_id: "source-56x-hanford-first-ilaw-disposal-2026" },
  { event_id: "HANFORD-EVENT-2026-04-30-STAGED", observation_date: "2026-04-08", stage_id: "HANFORD-IDF-STAGING", measure: "containers staged at first-disposal event", operator: "approximately", value: 30, unit: "containers", source_id: "source-56x-hanford-first-ilaw-disposal-2026" },
  { event_id: "HANFORD-EVENT-2026-05-66-SHIPPED", observation_date: null, observation_period: "2026-05 project-managers meeting", stage_id: "HANFORD-IDF-TRANSPORT", measure: "containers shipped to IDF", operator: "=", value: 66, unit: "containers", source_id: "source-57b-hanford-wtp-project-managers-may-2026" },
  { event_id: "HANFORD-EVENT-2026-05-100K-IMMOBILIZED", observation_date: "2026-05-26", stage_id: "HANFORD-LAW-CONTAINER-FILL", measure: "tank-waste volume immobilized since hot commissioning", operator: ">", value: 100000, unit: "gallons", source_id: "source-57f-doe-hanford-100k-gallons-may-2026" },
];

const hanfordRegistry = {
  phase: "57G", captured_date: capturedDate, registry_type: "DFLAW batch-container lifecycle-stage registry",
  stage_count: hanfordNodes.length, observation_count: hanfordEvents.length,
  identity_schema: ["public_batch_id", "public_container_id", "source_stage_id", "destination_stage_id", "stage_date", "measure", "threshold_operator", "value", "unit", "quality_disposition", "shipment_state", "receipt_state", "acceptance_state", "disposal_state", "source_authority"],
  public_identity_availability: { batch_ids: 0, container_ids: 0 },
  nonconversion_rules: ["Do not multiply a nominal seven-metric-ton filled-container specification by a container count.", "Do not convert gallons of feed or immobilized waste into glass or waste mass without a source method.", "Do not assume that filled, sent, shipped, staged, accepted, and disposed counts cover the same container identities.", "Do not treat an agency milestone as regulator acceptance unless the accepting authority says so."],
  boundary: "Nodes and events define identity, custody, stage, date, operator, and unit. They do not create a synthetic batch lineage, container lineage, mass balance, quality yield, acceptance decision, or steady-state output rate.",
  source_ids: ["source-57g-hanford-dflaw-process-animation", "source-57g-hanford-ap106-feed-staging", "source-57c-hanford-20-containers-2025", "source-57e-doe-hanford-acceptable-glass-startup", "source-57f-hanford-wtp-pmm-february-2026", "source-57b-ecology-wtp-byproduct-response-comments", "source-56x-hanford-first-ilaw-disposal-2026", "source-57b-hanford-wtp-project-managers-may-2026", "source-57f-doe-hanford-100k-gallons-may-2026"],
  stages: hanfordNodes, observations: hanfordEvents,
};
await writeJson(join(dataRoot, "phase-57g-hanford-batch-container-stage-registry.json"), hanfordRegistry);

const nnsaEntries = [
  ["NNSA-PIT-MISSION", null, "Enterprise mission", "NNSA plutonium-pit production mission", "Two-site plan for resilient capacity; not an output record"],
  ["NNSA-LANL", "NNSA-PIT-MISSION", "Site", "Los Alamos National Laboratory", "Planned 30-pits-per-year capacity contribution"],
  ["NNSA-LANL-PF4", "NNSA-LANL", "Operating facility", "Plutonium Facility 4", "Sole current U.S. pit-production capability; facility state is not recurring qualified output"],
  ["NNSA-LANL-LAP4", "NNSA-LANL-PF4", "Capital-project umbrella", "Los Alamos Plutonium Pit Production Project (LAP4)", "Infrastructure project supporting PF-4 production capability"],
  ["NNSA-LANL-LAP4-30B", "NNSA-LANL-LAP4", "Subproject", "30 Base Equipment Installation", "CD-2/3 scope for basic 30-per-year equipment capacity; $1.864 billion ceiling and no-later-than August 2030 completion in 2023 approval"],
  ["NNSA-LANL-LAP4-30R", "NNSA-LANL-LAP4", "Subproject", "30 Reliable Equipment Installation", "Equipment scope intended to improve reliability of producing 30 per year"],
  ["NNSA-LANL-LAP4-30D", "NNSA-LANL-LAP4", "Scope strategy", "30 Diamond scope", "Later budget scope and realignment object; not a facility or qualified-output state"],
  ["NNSA-LANL-LAP4-DD", "NNSA-LANL-LAP4", "Subproject", "Decontamination and Demolition", "Enabling subproject; progress is not production capacity"],
  ["NNSA-LANL-LAP4-TDC", "NNSA-LANL-LAP4", "Subproject", "Training and Development Center", "Workforce and development support scope"],
  ["NNSA-LANL-LAP4-WECF", "NNSA-LANL-LAP4", "Subproject", "West Entry Control Facility", "Access-control enabling scope"],
  ["NNSA-SRS", "NNSA-PIT-MISSION", "Site", "Savannah River Site", "Planned at-least-50-pits-per-year capacity contribution"],
  ["NNSA-SRS-MOX", "NNSA-SRS", "Existing facility", "Former Mixed Oxide Fuel Fabrication Facility", "Repurposed host building; not itself an accepted pit-production capability"],
  ["NNSA-SRS-SRPPF", "NNSA-SRS-MOX", "Capital-project umbrella", "Savannah River Plutonium Processing Facility", "Project intended to establish the Savannah River capacity contribution"],
  ["NNSA-SRS-SRPPF-MPB", "NNSA-SRS-SRPPF", "Subproject", "Main Process Building", "Core process-building scope with baseline state tracked separately"],
  ["NNSA-SRS-SRPPF-HFTOC", "NNSA-SRS-SRPPF", "Subproject", "High-Fidelity Training and Operations Center", "Training and operations-support scope with its own critical-decision state"],
  ["NNSA-W87-1-FPU", "NNSA-LANL-PF4", "Qualification and acceptance event", "W87-1 first production unit", "One fully qualified and diamond-stamped war-reserve-quality unit verified October 1, 2024; not a recurring rate"],
  ["NNSA-GAO-23-104661-REC1", "NNSA-PIT-MISSION", "Independent recommendation baseline", "GAO-23-104661 Recommendation 1", "Open recommendation for a life-cycle cost estimate meeting GAO characteristics; December 2026 estimate remains a forecast"],
  ["NNSA-CAPACITY-30-50-80", "NNSA-PIT-MISSION", "Capacity plan", "LANL 30 plus Savannah River 50 for at least 80 pits per year", "Capacity objective and site allocation, not qualified production or accepted readiness"],
].map(([registry_id, parent_id, object_type, name, bounded_state]) => ({
  registry_id, parent_id, object_type, name, bounded_state, operating_outcome: null,
}));

const nnsaRegistry = {
  phase: "57G", captured_date: capturedDate, registry_type: "Site-facility-program-capacity-qualification-baseline work-breakdown crosswalk",
  entry_count: nnsaEntries.length,
  source_ids: ["source-57f-nnsa-pit-production-current", "source-57f-nnsa-stockpile-current", "source-57g-nnsa-lap4-30-base-construction", "source-57g-nnsa-fy2026-weapons-activities", "source-56w-nnsa-fy2027-weapons-activities", "source-56x-gao-nnsa-major-projects-2026", "source-57a-nnsa-w87-1-first-production-unit", "source-56q-gao-23-104661-recommendation-status"],
  object_type_rule: "Site, facility, project umbrella, subproject, scope strategy, qualification event, capacity plan, and independent recommendation baseline are distinct objects and may not substitute for one another.",
  boundary: "The crosswalk stabilizes work-breakdown identity and lineage. It does not establish completion, readiness, recurring qualified output, final capacity, recommendation implementation, or independent baseline sufficiency.",
  entries: nnsaEntries,
};
await writeJson(join(dataRoot, "phase-57g-nnsa-work-breakdown-registry.json"), nnsaRegistry);

const specs = [
  {
    slug: "amtrak-appendix-b-membership-registry", agency: "DOT", actionKey: "AMTRAK-APPB-197-MEMBERSHIP-REGISTRY-2026-01", stage: "Named-asset registry", status: "Published", publicationDate: "2023-04-30",
    sourceIds: ["source-57f-amtrak-stations-alp-fy24-29"], title: "Amtrak Appendix B now has 197 stable historical cohort-membership rows",
    finding: "FTFN normalized all 30 train-access, 120 PIDS, and 47 access-and-amenity Appendix B rows into 197 stable historical cohort memberships, while retaining source display names, state, row number, plan status, projected year, and the April 2023 snapshot boundary.",
    denominator: "Exactly 197 Appendix B cohort memberships: 30 train-access, 120 PIDS, and 47 access-and-amenity rows; overlapping stations remain separate memberships joined through a stable station key.",
    limits: ["A cohort membership is not a current asset inspection.", "The same station may appear in more than one deficiency cohort.", "The plan snapshot predates later June 2026 aggregate reporting."],
    next: "Join later station-device observations only when station identity, asset type, reporting period, method, and revision state are compatible.", registry: "phase-57g-amtrak-named-station-registry.json",
  },
  {
    slug: "amtrak-pids-120-station-status-registry", agency: "DOT", actionKey: "AMTRAK-PIDS-120-STATUS-REGISTRY-2026-01", stage: "Named-asset registry", status: "Published", publicationDate: "2023-04-30",
    sourceIds: ["source-57f-amtrak-stations-alp-fy24-29", "source-57b-amtrak-ada-progress-june-2026", "source-57e-amtrak-accessibility-progress-june-2026"], title: "The PIDS registry preserves all 120 stations and every historical deployment state",
    finding: "The PIDS membership registry contains 96 Complete, 18 In Progress, three Pending, two On Hold, and one Cancelled deployment states in the Appendix B snapshot, with Detroit, Atlanta, and Hanford retained as named exception rows.",
    denominator: "The complete 120-station Appendix B PIDS cohort and its source-reported historical design, deployment, and projected-completion fields.",
    limits: ["Historical completion does not establish present uptime or accepted closeout.", "On Hold and Cancelled are source states, not FTFN judgments.", "Later 93-deployment and 117-installation counts require a separate revision join."],
    next: "Reconcile the 120-row historical membership register to a current station-device inventory with explicit added, removed, renamed, replaced, and retired rows.", registry: "phase-57g-amtrak-named-station-registry.json",
  },
  {
    slug: "amtrak-train-access-30-station-status-registry", agency: "DOT", actionKey: "AMTRAK-TRAIN-ACCESS-30-REGISTRY-2026-01", stage: "Named-asset registry", status: "Published", publicationDate: "2023-04-30",
    sourceIds: ["source-57f-amtrak-stations-alp-fy24-29"], title: "The train-access registry separates eighteen complete and twelve unfinished historical station rows",
    finding: "Appendix B identifies 30 train-access cohort rows: 18 historical construction completions, two In Progress construction rows, and ten Pending construction rows, each preserved with design and projected construction fields.",
    denominator: "All 30 named train-access cohort memberships in Appendix B, including the 12 rows not reported Complete in the historical snapshot.",
    limits: ["Plan completion state is not device availability or passenger use.", "Projected fiscal years are not accepted completion dates.", "Third-party responsibility cannot be inferred where the extracted row does not identify it."],
    next: "Join current construction, substantial completion, final completion, passenger use, maintenance, complaint, and rider-outcome observations by stable station key.", registry: "phase-57g-amtrak-named-station-registry.json",
  },
  {
    slug: "amtrak-access-amenity-47-station-registry", agency: "DOT", actionKey: "AMTRAK-AMENITY-47-REGISTRY-2026-01", stage: "Named-asset registry", status: "Published", publicationDate: "2019-09-30",
    sourceIds: ["source-57f-amtrak-stations-alp-fy24-29"], title: "The access-and-amenity registry preserves forty-seven historical completed station rows",
    finding: "All 47 Appendix B access-and-amenity cohort memberships are source-reported Complete by FY2019 and now retain stable station, cohort, design, construction, and historical-snapshot identities.",
    denominator: "All 47 named Appendix B station access-and-amenity cohort memberships.",
    limits: ["Historical construction completion is not current amenity quality.", "The table does not enumerate each underlying asset.", "No compatible current uptime, use, complaint, remediation, or rider-experience table is published."],
    next: "Attach current asset and service-quality observations only at the exact station and asset level.", registry: "phase-57g-amtrak-named-station-registry.json",
  },
  {
    slug: "amtrak-cross-cohort-identity-and-revision-contract", agency: "DOT", actionKey: "AMTRAK-CROSS-COHORT-REVISION-CONTRACT-2026-01", stage: "Named-asset registry", status: "Published", publicationDate: "2026-08-03",
    sourceIds: ["source-57f-amtrak-stations-alp-fy24-29", "source-57e-amtrak-accessibility-progress-june-2026"], title: "Stable station keys now expose overlap without collapsing cohort or revision identity",
    finding: `The 197 memberships resolve to ${amtrakRegistry.unique_station_count} unique normalized station keys; each key preserves its separate train-access, PIDS, and amenity memberships so later revisions can add or close rows without rewriting the historical baseline.`,
    denominator: `${amtrakRegistry.unique_station_count} unique normalized station keys derived from 197 source memberships, with no assumed device-level identity.`,
    limits: ["Name normalization does not prove a current Amtrak station code.", "Cross-cohort overlap does not establish a shared underlying asset.", "Revision lineage requires explicit source evidence for every added, removed, renamed, replaced, or retired record."],
    next: "Acquire a current official station-device register and publish a row-level revision crosswalk.", registry: "phase-57g-amtrak-named-station-registry.json",
  },
  {
    slug: "montana-nineteen-subgrantee-identity-registry", agency: "NTIA", actionKey: "MT-BEAD-19-SUBGRANTEE-REGISTRY-2026-01", stage: "Project-cohort registry", status: "Published", publicationDate: "2026-01-05",
    sourceIds: ["source-57g-montana-subgrantees-csv", "source-57g-montana-bead-final-proposal-january-2026"], title: "Montana's approved Final Proposal identifies nineteen proposed subgrantees by UEI and FRN",
    finding: "FTFN normalized all 19 Final Proposal subgrantee rows with exact legal name, UEI, FRN, state, and stable registry identity.",
    denominator: "All 19 rows in Montana's January 5, 2026 Final Proposal subgrantee file.",
    limits: ["A listed subgrantee is not proof of executed agreement.", "UEI and FRN identify organizations, not operating performance.", "The register contains no subscriber, retention, price, complaint, or acceptance outcomes."],
    next: "Join executed agreement and quarterly submissions by UEI and project ID when public.", registry: "phase-57g-montana-project-cohort-registry.json",
  },
  {
    slug: "montana-thirty-two-deployment-project-registry", agency: "NTIA", actionKey: "MT-BEAD-32-PROJECT-REGISTRY-2026-01", stage: "Project-cohort registry", status: "Published", publicationDate: "2026-01-05",
    sourceIds: ["source-57g-montana-deployment-projects-csv", "source-57g-montana-subgrantees-csv"], title: "Thirty-two Montana deployment-project IDs now join to named subgrantees",
    finding: "The project registry preserves all 32 deployment-project IDs and joins every row to a named subgrantee through the official UEI, including one CAI-only project with zero BSL location rows.",
    denominator: "All 32 Final Proposal deployment-project rows joined to the 19-row subgrantee register.",
    limits: ["Project inclusion is an approved-proposal baseline, not construction start.", "A zero-BSL project can still carry CAI rows and must not be dropped.", "Project names are preserved as source labels rather than standardized operating brands."],
    next: "Use project ID plus UEI as the mandatory key for future agreement, construction, service, testing, adoption, and closeout observations.", registry: "phase-57g-montana-project-cohort-registry.json",
  },
  {
    slug: "montana-68315-bsl-project-denominator", agency: "NTIA", actionKey: "MT-BEAD-68315-BSL-DENOMINATOR-2026-01", stage: "Project-cohort registry", status: "Published", publicationDate: "2026-01-05",
    sourceIds: ["source-57g-montana-locations-csv", "source-57g-montana-deployment-projects-csv"], title: "Montana's 68,315 location rows now roll up to privacy-safe project denominators",
    finding: "FTFN reconciled all 68,315 Final Proposal BSL location rows to the 32 project IDs and publishes project-level totals plus raw classification and technology-code distributions without exposing individual BSL identifiers.",
    denominator: "Exactly 68,315 location-file rows; raw classification codes 0 and 1 total 45,401 and 22,914, and raw technology codes total the same 68,315 rows.",
    limits: ["Raw codes remain untranslated until an official schema is joined.", "Location assignment does not establish serviceability or subscription.", "Individual BSL identifiers and sensitive location details are excluded from FTFN public output."],
    next: "Reconcile future served-location and quarterly files to project-level eligible, serviceable, installed, subscribed, tested, retained, and accepted counts.", registry: "phase-57g-montana-project-cohort-registry.json",
  },
  {
    slug: "montana-183-cai-project-denominator", agency: "NTIA", actionKey: "MT-BEAD-183-CAI-DENOMINATOR-2026-01", stage: "Project-cohort registry", status: "Published", publicationDate: "2026-01-05",
    sourceIds: ["source-57g-montana-cai-csv", "source-57g-montana-deployment-projects-csv"], title: "Montana's 183 community-anchor rows remain a separate project-level denominator",
    finding: "The registry assigns all 183 community-anchor rows to their official project IDs while publishing only project-level CAI counts; the Triangle Hill 2 project remains visible with 21 CAIs and zero BSL rows.",
    denominator: "Exactly 183 Final Proposal CAI rows reconciled to the 32-project registry.",
    limits: ["CAIs are not interchangeable with BSL location rows.", "Assignment does not establish activated service or measured benefit.", "Individual CAI details remain outside the public registry."],
    next: "Publish project-level CAI service, test, remediation, and acceptance totals only when compatible official observations are public.", registry: "phase-57g-montana-project-cohort-registry.json",
  },
  {
    slug: "montana-funding-and-reporting-contract-join", agency: "NTIA", actionKey: "MT-BEAD-FUNDING-REPORTING-JOIN-2026-01", stage: "Project-cohort registry", status: "Published", publicationDate: "2026-08-03",
    sourceIds: ["source-57g-montana-deployment-projects-csv", "source-57f-montana-leo-quarterly-instructions-june-2026", "source-57e-montana-quarterly-report-instructions-june-2026", "source-57e-montana-project-monitoring-guide-june-2026"], title: "Project IDs now connect $303.7 million in proposed BEAD support to the correct reporting contract",
    finding: "The 32-project baseline totals $303,686,528 in proposed BEAD support and $145,190,798 in subgrantee match; Kuiper and Starlink project identities join to the LEO contract while the remaining projects join to terrestrial reporting, testing, monitoring, reimbursement, and closeout controls.",
    denominator: "All 32 project funding rows, 19 UEI identities, 68,315 BSL rows, and 183 CAI rows under the appropriate public reporting-control family.",
    limits: ["Proposal funding is not disbursement or expenditure.", "A reporting contract is not a completed report.", "No project receives an FTFN performance score or rank."],
    next: "Reopen the Montana outcome hold only with completed privacy-safe project-quarter or closeout tables and state acceptance or corrective-action decisions.", registry: "phase-57g-montana-project-cohort-registry.json",
  },
  {
    slug: "hanford-fourteen-stage-dflaw-registry", agency: "DOE", actionKey: "HANFORD-DFLAW-14-STAGE-REGISTRY-2026-01", stage: "Batch-container-stage registry", status: "Published", publicationDate: "2026-08-03",
    sourceIds: ["source-57g-hanford-dflaw-process-animation", "source-57e-hanford-dflaw-current-program-page"], title: "The Hanford DFLAW registry separates fourteen named process, asset, custody, and disposal stages",
    finding: "FTFN now maintains 14 ordered DFLAW lifecycle nodes from tank retrieval through TSCR, AP-106, laboratory certification, LAW processing, two named melters, container handling, shipment, IDF staging, and final disposal.",
    denominator: "Fourteen public process or custody nodes derived from DOE and regulator records, each with a stable stage key and explicit input/output relation.",
    limits: ["A stage key is not a public batch or container ID.", "The process path does not prove every transfer occurred for the same material cohort.", "Custody and acceptance authority remain distinct."],
    next: "Attach source-reported batch and container identities without inferring missing transitions.", registry: "phase-57g-hanford-batch-container-stage-registry.json",
  },
  {
    slug: "hanford-tscr-ap106-lab-feed-crosswalk", agency: "DOE", actionKey: "HANFORD-TSCR-AP106-FEED-REGISTRY-2026-01", stage: "Batch-container-stage registry", status: "Published", publicationDate: "2020-02-18",
    sourceIds: ["source-57g-hanford-ap106-feed-staging", "source-57g-hanford-dflaw-process-animation"], title: "TSCR, AP-106, 222-S certification, and LAW transfer now have distinct feed-stage identities",
    finding: "The registry separates cesium-and-solids removal, AP-106 staging, laboratory certification, underground transfer, and LAW receipt; DOE's 1.1-million-gallon tank specification and waste-feed mission are attached only to AP-106's facility and mission records.",
    denominator: "Five distinct feed preparation, quality, transfer, and receipt nodes plus one AP-106 feed-staging mission milestone.",
    limits: ["The 1.1-million-gallon figure is tank capacity, not measured feed staged.", "A documented feed-staging mission is not evidence that a batch was received or transferred.", "The source provides no stable public batch IDs or accepted mass balance."],
    next: "Publish batch IDs, certification dates, exact transferred volume and mass, LAW receipt, exceptions, and acceptance state.", registry: "phase-57g-hanford-batch-container-stage-registry.json",
  },
  {
    slug: "hanford-melter-container-handling-registry", agency: "DOE", actionKey: "HANFORD-MELTER-CONTAINER-REGISTRY-2026-01", stage: "Batch-container-stage registry", status: "Published", publicationDate: "2025-09-30",
    sourceIds: ["source-57c-hanford-20-containers-2025", "source-57f-doe-hanford-100k-gallons-may-2026"], title: "Melter 1, Melter 2, fill, lid, swab, export, and shipment remain separate asset and container stages",
    finding: "DOE records support separate registry nodes for both LAW melters and for fill, lid and exterior swab, export-bay handoff, reusable transport sleeve, and shipment; no public record supplies a stable container-level join across them.",
    denominator: "Two named melter assets and five post-melter container lifecycle or handoff stages.",
    limits: ["Nominal filled-container weight is not observed output mass.", "A filled count is not a quality-released, shipped, accepted, staged, or disposed count.", "The public sources do not identify each container."],
    next: "Publish stable container IDs with fill, quality, export, shipment, receipt, acceptance, staging, disposal, tare, gross, glass, and waste fields.", registry: "phase-57g-hanford-batch-container-stage-registry.json",
  },
  {
    slug: "hanford-nine-observation-stage-ledger", agency: "DOE", actionKey: "HANFORD-NINE-STAGE-OBSERVATION-LEDGER-2026-01", stage: "Batch-container-stage registry", status: "Published", publicationDate: "2026-08-03",
    sourceIds: ["source-57f-hanford-wtp-pmm-february-2026", "source-57b-ecology-wtp-byproduct-response-comments", "source-56x-hanford-first-ilaw-disposal-2026", "source-57b-hanford-wtp-project-managers-may-2026", "source-57f-doe-hanford-100k-gallons-may-2026"], title: "Nine dated Hanford observations now attach to exact lifecycle stages and operators",
    finding: "The registry stores nine bounded observations, including greater-than thresholds, exact counts, an approximate count, and milestone events, without assuming that feed-volume and container-stage observations share one cohort.",
    denominator: "Nine source-attributed observations across AP-106 staging, acceptable-glass startup, container fill or handling, shipment, IDF staging, and disposal.",
    limits: ["Different dates, verbs, authorities, and units remain non-interchangeable.", "No observation supplies the missing public batch and container IDs.", "The ledger is not a complete monthly material balance."],
    next: "Add only compatible stage observations and preserve each threshold operator, unit, authority, and revision.", registry: "phase-57g-hanford-batch-container-stage-registry.json",
  },
  {
    slug: "hanford-null-identity-and-nonconversion-contract", agency: "DOE", actionKey: "HANFORD-NULL-ID-NONCONVERSION-2026-01", stage: "Batch-container-stage registry", status: "Published", publicationDate: "2026-08-03",
    sourceIds: ["source-57g-hanford-dflaw-process-animation", "source-57f-hanford-wtp-pmm-february-2026", "source-57f-doe-hanford-100k-gallons-may-2026"], title: "Missing batch and container identities are now explicit null fields, not synthetic joins",
    finding: "The Hanford schema reserves batch ID, container ID, stage date, unit, quality disposition, shipment, receipt, acceptance, and disposal fields while recording zero public batch IDs and zero public container IDs in the current source set.",
    denominator: "The 14-stage registry and nine observations, with identity availability explicitly recorded as zero rather than inferred.",
    limits: ["Unknown identity is not evidence that no identifier exists operationally.", "Nominal weight may not be multiplied by aggregate counts.", "Gallon, glass, container, shipment, acceptance, and disposal observations cannot be synthetically converted."],
    next: "Reopen the mass-balance hold only with regulator-verifiable batch and container identities across every material stage.", registry: "phase-57g-hanford-batch-container-stage-registry.json",
  },
  {
    slug: "nnsa-two-site-site-facility-registry", agency: "DOE", actionKey: "NNSA-TWO-SITE-FACILITY-REGISTRY-2026-01", stage: "Site-facility-program registry", status: "Published", publicationDate: "2026-08-03",
    sourceIds: ["source-57f-nnsa-pit-production-current", "source-57f-nnsa-stockpile-current"], title: "The NNSA registry separates the enterprise mission, two sites, PF-4, former MOX building, and project umbrellas",
    finding: "FTFN now distinguishes NNSA's enterprise mission, LANL and Savannah River sites, PF-4 operating facility, former MOX host building, LAP4 project umbrella, and SRPPF project umbrella as separate work-breakdown objects.",
    denominator: "One enterprise mission, two sites, two facility objects, and two capital-project umbrellas within an 18-entry crosswalk.",
    limits: ["A site is not a facility or project.", "A host building is not accepted production capacity.", "Project activity does not establish recurring qualified output."],
    next: "Attach future scope, cost, schedule, qualification, capacity, and output observations to the exact work-breakdown object.", registry: "phase-57g-nnsa-work-breakdown-registry.json",
  },
  {
    slug: "nnsa-lap4-work-breakdown-registry", agency: "DOE", actionKey: "NNSA-LAP4-WBS-REGISTRY-2026-01", stage: "Site-facility-program registry", status: "Published", publicationDate: "2026-08-03",
    sourceIds: ["source-57g-nnsa-lap4-30-base-construction", "source-57g-nnsa-fy2026-weapons-activities", "source-56w-nnsa-fy2027-weapons-activities", "source-56x-gao-nnsa-major-projects-2026"], title: "LAP4 now separates 30 Base, 30 Reliable, 30 Diamond, D&D, TDC, and WECF scope objects",
    finding: "The LANL work breakdown distinguishes the LAP4 umbrella from 30 Base Equipment Installation, 30 Reliable Equipment Installation, later 30 Diamond scope, Decontamination and Demolition, Training and Development Center, and West Entry Control Facility objects.",
    denominator: "One LAP4 umbrella plus six named subproject or scope objects joined to PF-4 and LANL.",
    limits: ["30 Diamond is retained as a scope strategy, not treated as a facility.", "A CD-2/3 approval is not current completion.", "Cost and schedule baselines do not establish operating rate or qualified output."],
    next: "Track every baseline, forecast, construction, readiness, and output observation against its exact LAP4 object and effective date.", registry: "phase-57g-nnsa-work-breakdown-registry.json",
  },
  {
    slug: "nnsa-srppf-work-breakdown-registry", agency: "DOE", actionKey: "NNSA-SRPPF-WBS-REGISTRY-2026-01", stage: "Site-facility-program registry", status: "Published", publicationDate: "2026-08-03",
    sourceIds: ["source-56x-gao-nnsa-major-projects-2026", "source-56w-nnsa-fy2027-weapons-activities", "source-57f-nnsa-pit-production-current"], title: "SRPPF now separates the site, former MOX host, project umbrella, Main Process Building, and HFTOC",
    finding: "The Savannah River registry distinguishes SRS, the former MOX facility, SRPPF, the Main Process Building subproject, and the High-Fidelity Training and Operations Center subproject.",
    denominator: "Five distinct Savannah River site, facility, project, and subproject objects.",
    limits: ["Repurposing does not establish accepted capability.", "Subproject critical decisions are not umbrella-project completion.", "Training infrastructure does not establish qualified production output."],
    next: "Join baselines, construction, equipment, qualification, readiness, capacity, and output evidence only at the correct SRPPF work-breakdown level.", registry: "phase-57g-nnsa-work-breakdown-registry.json",
  },
  {
    slug: "nnsa-capacity-qualification-acceptance-crosswalk", agency: "DOE", actionKey: "NNSA-CAPACITY-QUALIFICATION-CROSSWALK-2026-01", stage: "Site-facility-program registry", status: "Published", publicationDate: "2026-08-03",
    sourceIds: ["source-57a-nnsa-w87-1-first-production-unit", "source-57f-nnsa-pit-production-current", "source-57g-nnsa-lap4-30-base-construction"], title: "The 30-plus-50 capacity plan and the W87-1 first production unit now occupy different registry objects",
    finding: "The registry separates LANL's planned 30-per-year contribution, Savannah River's planned at-least-50 contribution, the enterprise at-least-80 objective, and the one October 2024 fully qualified and diamond-stamped W87-1 first production unit.",
    denominator: "Three capacity-plan quantities and one named qualification-and-acceptance event, with no inferred recurring production between them.",
    limits: ["Capacity is not output.", "One first production unit is not a rate.", "Current generalized capability language still lacks a site-period terminology and disposition crosswalk."],
    next: "Publish dated site-period development, produced, rejected, reworked, qualified, accepted, and stockpile-entered counts.", registry: "phase-57g-nnsa-work-breakdown-registry.json",
  },
  {
    slug: "nnsa-gao-baseline-work-breakdown-crosswalk", agency: "DOE", actionKey: "NNSA-GAO-BASELINE-WBS-REGISTRY-2026-01", stage: "Site-facility-program registry", status: "Published", publicationDate: "2026-08-03",
    sourceIds: ["source-56q-gao-23-104661-recommendation-status", "source-56x-gao-nnsa-major-projects-2026", "source-57g-nnsa-fy2026-weapons-activities", "source-56w-nnsa-fy2027-weapons-activities"], title: "The GAO enterprise baseline recommendation is now distinct from project and subproject baselines",
    finding: "GAO-23-104661 Recommendation 1 now has its own registry object, separate from LAP4, SRPPF, 30 Base, Main Process Building, and HFTOC baseline objects; the recommendation remains Open and the December 2026 estimate remains a forecast.",
    denominator: "One independent enterprise life-cycle-cost recommendation object joined to, but not substituted by, named project and subproject baseline objects.",
    limits: ["A project baseline cannot satisfy an enterprise life-cycle-cost recommendation by substitution.", "Agency planning is not GAO closure.", "A forecast date is not a completed and independently accepted estimate."],
    next: "Reopen the exact-baseline hold only when GAO records implementation or closure against the recommendation's own sufficiency criteria.", registry: "phase-57g-nnsa-work-breakdown-registry.json",
  },
];

const holdKeyMap = {
  "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-05": "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-06",
  "AMTRAK-NAMED-RELIABILITY-HOLD-2026-04": "AMTRAK-NAMED-RELIABILITY-HOLD-2026-05",
  "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-05": "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-06",
  "LA-BEAD-STARLINK-HOLD-2026-05": "LA-BEAD-STARLINK-HOLD-2026-06",
  "MT-BEAD-QUARTERLY-HOLD-2026-05": "MT-BEAD-QUARTERLY-HOLD-2026-06",
  "HANFORD-WTP-MASS-BALANCE-HOLD-2026-02": "HANFORD-WTP-MASS-BALANCE-HOLD-2026-03",
  "NNSA-PIT-RATE-HOLD-2026-05": "NNSA-PIT-RATE-HOLD-2026-06",
  "NNSA-PIT-PEIS-HOLD-2026-05": "NNSA-PIT-PEIS-HOLD-2026-06",
  "NNSA-PIT-GAO-BASELINE-HOLD-2026-06": "NNSA-PIT-GAO-BASELINE-HOLD-2026-07",
};
const inheritedHolds = phase57f.records.filter((record) => record.record_status === "In Review").map((record) => ({
  slug: `preserved-${record.record_id.replace(/^record-57f-/, "")}`, agency: record.agency,
  actionKey: holdKeyMap[record.action_key], parentHold: record.action_key, stage: record.evidence_stage,
  status: "In Review", publicationDate: record.publication_date, sourceIds: record.supporting_source_ids,
  title: record.title, finding: record.finding, denominator: record.denominator,
  limits: record.evidence_limits, next: record.next_action, registry: null,
}));
if (inheritedHolds.length !== 9 || inheritedHolds.some((hold) => !hold.actionKey)) throw new Error("Phase 57G must preserve all nine Phase 57F holds with explicit lineage.");
const allSpecs = [...specs, ...inheritedHolds];

const sourceById = new Map(sources.map((source) => [source.id, source]));
const carriedIds = [...new Set(allSpecs.flatMap((spec) => spec.sourceIds).filter((id) => !sourceById.has(id)))];
for (const id of carriedIds) {
  const source = JSON.parse(await readFile(join(contentRoot, "sources", `${id}.json`), "utf8"));
  sourceById.set(id, { id, url: source.url, owner: source.source_owner ?? source.name });
}

const authorityBoundary = "A registry row is an identity, lineage, cohort, stage, or work-breakdown object—not reliability, adoption, yield, readiness, output, implementation, or closure. Historical and current revisions, site and facility, project and subproject, BSL and CAI, feed and glass, container stages, capacity and qualified output, agency assertions and independent acceptance remain separate. No record supports a ranking, composite, readiness score, generalized savings claim, or unsupported causal attribution.";
const records = allSpecs.map((spec, index) => {
  const meta = agencyMeta[spec.agency];
  return {
    record_id: `record-57g-${spec.slug}`, document_id: `research-doc-57g-${spec.slug}`, signal_id: `signal-57g-${spec.slug}`,
    document_number: 728 + index, phase: "57G", action_key: spec.actionKey, parent_hold_key: spec.parentHold ?? null,
    agency: spec.agency, entity_id: meta.entity, record_type: "Named-asset and project-cohort registry expansion panel",
    evidence_stage: spec.stage, title: spec.title, record_status: spec.status, source_id: spec.sourceIds[0], supporting_source_ids: spec.sourceIds,
    official_url: sourceById.get(spec.sourceIds[0])?.url, publication_date: spec.publicationDate,
    document_type: spec.status === "In Review" ? "Technical Report" : "Data Release",
    finding: spec.finding, denominator: spec.denominator, evidence_limits: spec.limits, next_action: spec.next,
    structured_registry_file: spec.registry, exact_target_artifact_acquired: false, directive_scope_change: false,
    implementation_change: false, closure_change: false, contact_or_foia_submitted: false,
    authority_boundary: authorityBoundary, captured_date: capturedDate,
  };
});

const published = records.filter((record) => record.record_status === "Published");
const held = records.filter((record) => record.record_status === "In Review");
const evidenceStageCounts = Object.fromEntries([...new Set(records.map((record) => record.evidence_stage))].map((stage) => [stage, records.filter((record) => record.evidence_stage === stage).length]));
const priorHoldKeys = phase57f.records.filter((record) => record.record_status === "In Review").map((record) => record.action_key);

await writeJson(join(dataRoot, "phase-57g-named-asset-project-cohort-registry-expansion.json"), {
  phase: "57G", captured_date: capturedDate,
  goal: "Build stable public identity and lineage registries for named Amtrak stations, Montana subgrantees and projects, Hanford lifecycle stages, and NNSA work-breakdown objects without converting registry structure into operating outcomes.",
  publication_rule: "Publish only source-attributed public registry identities, historical status, project-level privacy-safe denominators, lifecycle stages, work-breakdown relations, and bounded joins; preserve every operating-outcome hold.",
  authority_rule: "Identity is not outcome. Historical plan state is not current reliability, proposal assignment is not service or adoption, lifecycle node is not material balance, and work-breakdown state is not readiness or qualified output.",
  records_reviewed: records.length, records_published: published.length, records_held: held.length,
  evidence_stage_counts: evidenceStageCounts, new_official_source_profiles: sources.length, carried_official_source_profiles: carriedIds.length,
  structured_registries: [
    { file: "phase-57g-amtrak-named-station-registry.json", rows: amtrakRegistry.membership_count, unique_entities: amtrakRegistry.unique_station_count },
    { file: "phase-57g-montana-project-cohort-registry.json", rows: montanaRegistry.bsl_location_rows + montanaRegistry.cai_rows, projects: montanaRegistry.project_count, subgrantees: montanaRegistry.subgrantee_count },
    { file: "phase-57g-hanford-batch-container-stage-registry.json", stages: hanfordRegistry.stage_count, observations: hanfordRegistry.observation_count },
    { file: "phase-57g-nnsa-work-breakdown-registry.json", entries: nnsaRegistry.entry_count },
  ],
  exact_target_artifacts_acquired: 0, exact_target_trigger_events: 0, public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [], implementation_changes: [], closure_changes: [], inherited_entity_ledger_closure_changes: [],
  prior_visible_scope: phase57f.post_batch_visible_scope, post_batch_visible_scope: phase57f.post_batch_visible_scope,
  post_batch_closure_counts: phase57f.post_batch_closure_counts, preserved_phase57f_holds: priorHoldKeys,
  new_visible_holds: [], records,
});

await writeJson(join(dataRoot, "phase-57g-publication-review.json"), {
  phase: "57G", captured_date: capturedDate,
  promoted_document_ids: published.map((record) => record.document_id), promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id), held_signal_ids: held.map((record) => record.signal_id),
  inherited_hold_lineage: held.map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key })),
  exact_target_artifacts_acquired: 0,
  decision: "Twenty bounded registry records publish. All nine Phase 57F operating-outcome holds remain visible with unchanged reopening conditions; no new hold, trigger, contact, scope change, implementation change, or closure change is recorded.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = `${String(record.document_number - 727).padStart(2, "0")}-${record.record_id.replace(/^record-57g-/, "")}.txt`;
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url).filter(Boolean);
  const firstSource = sourceById.get(record.source_id);
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-57g-${record.record_id.replace(/^record-57g-/, "")}.json`), {
    id: record.document_id, collection_id: collectionId, title: record.title, slug: record.document_id.replace(/^research-doc-/, ""),
    record_status: record.record_status, publisher: firstSource?.owner ?? "U.S. public-sector authority", publication_date: record.publication_date,
    document_type: record.document_type, summary: `${record.finding} Denominator: ${record.denominator}`,
    key_findings: [`Evidence stage: ${record.evidence_stage}.`, `Finding: ${record.finding}`, `Denominator: ${record.denominator}`, ...record.evidence_limits.map((limit) => `Boundary: ${limit}`), `Next action: ${record.next_action}`],
    why_it_matters: record.record_status === "Published" ? "The record creates a stable public identity, lineage, cohort, stage, or work-breakdown join without promoting structure into an unsupported outcome." : "The visible hold prevents the expanded registries from being mistaken for current reliability, adoption, mass-balance, qualified-output, capacity, or independently accepted baseline evidence.",
    ftfn_relevance: ["Stabilizes public identity before later observations are joined.", "Preserves entity, cohort, stage, period, unit, threshold operator, method, revision, privacy boundary, and authority.", "Keeps registry structure, operating outcomes, forecasts, implementation, acceptance, and closure distinct."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: meta.topics, framework_layers: meta.layers, constraint_tags: ["Data Quality", "Regulation", "Public Trust"],
    source_id: record.source_id, supporting_source_ids: record.supporting_source_ids, supporting_official_urls: sourceUrls, official_url: record.official_url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`, archive_member: `official-links/${archiveName}`,
    capture_status: "Official link record", captured_date: capturedDate,
  });

  const signal = [
    "---", `id: ${JSON.stringify(record.signal_id)}`, `title: ${JSON.stringify(record.title)}`, `slug: ${JSON.stringify(record.signal_id.replace(/^signal-/, ""))}`,
    `record_status: ${JSON.stringify(record.record_status)}`, `summary: ${JSON.stringify(record.finding)}`, yamlList("source_ids", record.supporting_source_ids),
    `published_date: ${capturedDate}`, `captured_date: ${capturedDate}`, `primary_topic: ${JSON.stringify(meta.topics[0])}`, yamlList("framework_layers", meta.layers),
    'signal_type: "Research Result"', 'maturity_level: "Infrastructure"', 'time_horizon: "Now"', 'evidence_quality: "Official Data"',
    'verification_status: "Verified Against Primary Source"', `why_it_matters: ${JSON.stringify(`Evidence stage: ${record.evidence_stage}. Denominator: ${record.denominator}`)}`,
    yamlList("dependencies", ["stable public identity and lineage", "explicit cohort, lifecycle stage, or work-breakdown level", "compatible period, unit, denominator, method, revision, privacy boundary, and authority", "separate observation, outcome, forecast, implementation, acceptance, and closure evidence"]),
    yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"]), yamlList("receiving_systems", ["Phase 57G named-asset and project-cohort registries"]),
    yamlList("local_implications", ["Treat every registry row as identity and lineage evidence; do not infer reliability, adoption, yield, readiness, output, implementation, or closure."]),
    yamlList("evidence_gap_ids", meta.gaps), 'claim_scope: "Specific Source Update"', 'local_evidence_level: "General Source Layer"',
    `last_reviewed_date: ${capturedDate}`, `editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57G identity-and-lineage registry contract." : "Held under the exact inherited Phase 57F operating-outcome reopening condition.")}`,
    "---", "", "## Phase 57G registry panel", "", record.finding, "", "## Evidence stage and denominator", "", `**${record.evidence_stage}.** ${record.denominator}`,
    "", ...(record.structured_registry_file ? ["Structured registry: `" + record.structured_registry_file + "`.", ""] : []),
    "## Evidence boundaries", "", ...record.evidence_limits.map((limit) => `- ${limit}`), "",
    "Exact target artifact acquired: **No**. FTFN submitted no agency contact or FOIA request.", "", `Next action: ${record.next_action}`, "", "## Authority boundary", "", record.authority_boundary, "",
  ].join("\n");
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signal, "utf8");
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId, title: "Named-Asset and Project-Cohort Registry Expansion, 2026", slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 57G publishes twenty bounded identity-and-lineage registry panels across Amtrak, Montana BEAD, Hanford DFLAW, and NNSA while preserving all nine operating-outcome holds.",
  scope: `A 197-membership Amtrak Appendix B register resolving to ${amtrakRegistry.unique_station_count} normalized station keys; nineteen Montana subgrantees, thirty-two projects, 68,315 BSL rows and 183 CAI rows at privacy-safe project granularity; fourteen Hanford lifecycle stages and nine bounded observations; eighteen NNSA work-breakdown objects; and nine preserved holds.`,
  captured_date: capturedDate, document_ids: records.map((record) => record.document_id), download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The thirty-two-file archive contains twenty-nine official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Registry identity and lineage are published separately from reliability, adoption, yield, material balance, readiness, qualified output, implementation, acceptance, and closure.",
});

const signalIds = records.map((record) => record.signal_id);
const publishedSignalIds = published.map((record) => record.signal_id);
const briefing = [
  "---", `id: ${JSON.stringify(briefingId)}`, 'title: "Research Watch 037: Named-Asset and Project-Cohort Registry Expansion"',
  'slug: "research-watch-037-named-asset-project-cohort-registry-expansion"', 'record_status: "Published"',
  'summary: "Phase 57G publishes twenty bounded identity-and-lineage registry panels and preserves all nine operating-outcome holds."',
  `published_date: ${capturedDate}`, `captured_date: ${capturedDate}`, yamlList("signal_ids", signalIds), yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"]),
  'claim_scope: "Editorial Synthesis"', 'local_evidence_level: "General Source Layer"', `last_reviewed_date: ${capturedDate}`,
  yamlList("top_takeaways", [
    `Amtrak's Appendix B now has 197 historical cohort memberships joined through ${amtrakRegistry.unique_station_count} normalized station keys without inventing device identities or current reliability.`,
    "Montana's approved proposal now has exact UEI, project, BSL, CAI, funding, raw-code, privacy, and reporting-contract joins at project granularity.",
    "Hanford now has named lifecycle-stage and observation registries while missing public batch and container IDs remain explicit nulls.",
    "NNSA now has separate site, facility, project, subproject, strategy, capacity, qualification, and GAO-baseline objects.",
  ]),
  yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"]),
  yamlList("what_to_watch_next", ["Amtrak current station-device revision register", "Montana completed project-quarter tables", "Hanford stable batch and container identities", "NNSA site-period qualified output and exact GAO baseline decision"]),
  "---", "", "## What Phase 57G adds", "",
  `The expansion turns four official evidence families into stable public join rails: ${amtrakMembershipRows.length} Amtrak cohort memberships, ${montanaProjects.length} Montana projects, ${hanfordNodes.length} Hanford lifecycle nodes, and ${nnsaEntries.length} NNSA work-breakdown objects.`,
  "", "## What did not move", "",
  "A registry row is not an outcome. None of the nine inherited holds clears: station identity does not supply reliability, proposal cohorts do not supply adoption, lifecycle stages do not supply a mass balance, and work-breakdown objects do not supply recurring qualified output, final capacity, or independent baseline closure.",
  "", "## Evidence boundary", "",
  "All nine Phase 57F holds remain visible. The entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57G records no trigger, agency contact, FOIA request, directive-scope change, implementation change, or closure change.", "",
].join("\n");
await writeFile(join(contentRoot, "briefings", "research-watch-037-named-asset-project-cohort-registry-expansion.mdx"), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-03-phase-57g-named-asset-project-cohort-registry-expansion.json"), {
  id: "update-2026-08-03-phase-57g-named-asset-project-cohort-registry-expansion", effective_date: capturedDate, entry_type: "Research Collection",
  title: "Phase 57G publishes twenty named-asset and project-cohort registry panels",
  summary: "Nine new Tier 1 sources and carried official records support four structured registries, twenty Published panels, and nine preserved operating-outcome holds.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-037-named-asset-project-cohort-registry-expansion/", ...signalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "Identity and lineage remain separate from reliability, adoption, material balance, readiness, output, implementation, acceptance, and closure.",
  work_package: "docs/work-packages/phase-57g-named-asset-project-cohort-registry-expansion.md",
});

const updateJson = async (path, mutate) => {
  const value = JSON.parse(await readFile(path, "utf8")); mutate(value); await writeJson(path, value);
};
const newSourceIds = sources.map((source) => source.id);
const broadbandSourceIds = sources.filter((source) => source.agency === "NTIA").map((source) => source.id);
const energySourceIds = sources.filter((source) => source.agency === "DOE").map((source) => source.id);
const amtrakSourceIds = ["source-57f-amtrak-stations-alp-fy24-29"];

await updateJson(join(contentRoot, "organizations", "org-us-department-energy.json"), (value) => { value.source_ids = appendUnique(value.source_ids, energySourceIds); });

for (const [file, selected, question] of [
  ["finance-and-risk.json", newSourceIds, "Which Phase 57G registry next receives a compatible accepted operating observation without changing its historical denominator or work-breakdown identity?"],
  ["policy-and-standards.json", newSourceIds, "Which official revision next changes a Phase 57G registry membership, project, lifecycle stage, or baseline object?"],
  ["mobility.json", amtrakSourceIds, "Which current Amtrak source publishes a station-device revision register compatible with the 197 Appendix B memberships?"],
  ["chips-and-compute.json", broadbandSourceIds, "Which Montana project first publishes a privacy-safe completed project-quarter table against the exact approved cohort?"],
  ["energy.json", energySourceIds, "Which Hanford or NNSA source first supplies stable batch, container, work-breakdown, qualified-output, or exact-baseline observations?"],
]) {
  await updateJson(join(contentRoot, "topics", file), (value) => { value.featured_sources = appendUnique(value.featured_sources, selected); value.watch_questions = appendUnique(value.watch_questions, [question]); });
}

const publishedByAgency = (agency) => published.filter((record) => record.agency === agency).map((record) => record.signal_id);
for (const [file, selectedSignals, selectedSources] of [
  ["policy-standards-to-implementation.json", publishedSignalIds, newSourceIds],
  ["cross-corridor-authorization-to-operation.json", [...publishedByAgency("DOT"), ...publishedByAgency("NTIA")], [...amtrakSourceIds, ...broadbandSourceIds]],
  ["energy-grid-capacity-to-service.json", publishedByAgency("DOE"), energySourceIds],
]) {
  await updateJson(join(contentRoot, "reader-pathways", file), (value) => {
    value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57g-")), selectedSignals);
    value.source_ids = appendUnique(value.source_ids, selectedSources); value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]);
    value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
    value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 57G named-asset and project-cohort registry panels");
    value.dependency_stack.push({
      stage: "Phase 57G named-asset and project-cohort registry panels",
      current_state: "Twenty Published identity-and-lineage records, four structured registries, and nine preserved operating-outcome holds.",
      boundary: "Registry identity is not reliability, adoption, material balance, readiness, qualified output, implementation, acceptance, or closure.",
    });
    value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 57G prohibits synthetic identity joins, historical-to-current promotion, location-detail exposure, raw-code guessing, cross-stage conversion, work-breakdown substitution, rankings, composite scores, readiness scores, generalized savings, and unsupported causal inference."]);
    value.next_records = appendUnique(value.next_records, ["Compatible current asset, project-quarter, batch-container, site-period output, and exact independent-baseline observations joined to stable registry identities."]);
  });
}

await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 57G adds four stable identity-and-lineage registries and twenty bounded panels while preserving nine operating-outcome holds.";
  value.source_ids = appendUnique(value.source_ids, newSourceIds);
  value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57g-")), publishedSignalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase57g-identity-registries");
  value.links = value.links.filter((link) => link.from !== "node-phase57g-identity-registries");
  value.nodes.push({
    id: "node-phase57g-identity-registries", label: "Four identity registries; twenty Published panels; nine holds", node_type: "Signal",
    note: "Stable station, project, lifecycle-stage, and work-breakdown identities create join rails without asserting operating outcomes.",
  });
  value.links.push(
    { from: "node-phase57g-identity-registries", to: "node-phase57f-measured-adoption-output", relationship: "Depends On", confidence: "Supported", note: "Phase 57G preserves all nine Phase 57F holds and their exact reopening conditions." },
    { from: "node-phase57g-identity-registries", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Historical cohorts, proposal projects, material stages, and work-breakdown objects remain revisioned and non-interchangeable." },
    { from: "node-phase57g-identity-registries", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Identity and lineage do not establish reliability, adoption, yield, readiness, output, implementation, closure, or causation." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["Four Phase 57G identity-and-lineage registries, twenty bounded Published panels, and nine preserved operating-outcome holds."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["Compatible current asset, project-quarter, batch-container, site-period qualified-output, and exact independent-baseline observations."]);
});

console.log(`Generated Phase 57G: ${published.length} Published records, ${held.length} In Review holds, ${sources.length} new Tier 1 sources, four structured registries, and Research Watch 037.`);
