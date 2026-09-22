import {deepenGlobalCohort} from './global-cohort-depth.mjs';
import {deepenPlaceSystems} from './place-system-depth.mjs';
export const placeDossiers = deepenPlaceSystems(deepenGlobalCohort([
  {record_id:'192-PLACE-001',title:'Ontario: trace a project through distinct public authorities',source_project:'191-PROJECT-001',jurisdiction:'Canada',region:'North America',
    answer:'Toronto’s application record provides a concrete view of how a place receives development: land, public authority, conditions, permits and services each matter. It is not an Ontario-wide delivery measure.',
    sections:[
      {heading:'Receiving system',text:'Use the named Toronto file as one case within the provincial and municipal system. Council adoption belongs to a public decision process; project enactment, servicing and physical construction need their own evidence. Do not assign the place the project’s stage.'},
      {heading:'What remains outside this dossier',text:'This case does not establish regional housing availability, affordability, infrastructure adequacy or the experience of future occupants. Those questions require population and service evidence at their own geographic boundaries.'},
      {heading:'Next reporting',text:'Add exact utility and servicing records, a current local housing baseline and observed construction/occupancy evidence. Independent jurisdiction review is pending; this is a bounded place lens, not a completed comprehensive Ontario atlas.'},
    ]},
  {record_id:'192-PLACE-002',title:'South Australia: study storage as part of a receiving network',source_project:'191-PROJECT-005',jurisdiction:'Australia',region:'Oceania',
    answer:'Dalrymple and Hornsdale are distinct network cases. Their existence does not supply a common South Australia storage-performance score.',
    sections:[
      {heading:'Receiving system',text:'A place-level account must describe what service is being supplied, where load and generation sit, and which operating rules matter. The Dalrymple case is particularly useful for examining a local receiving network; it should not be generalized without its topology and event conditions.'},
      {heading:'Keep denominators local to the question',text:'Installed power, stored energy, frequency-service response, islanding events and customer continuity are different measures. Combining them would make an attractive but undefined indicator. A regional assessment needs a transparent service and population boundary.'},
      {heading:'Next reporting',text:'Acquire compatible operator data, regional demand and reliability context, and actual distribution of service benefits. Retain outages and configuration changes. Independent method review remains open.'},
    ]},
  {record_id:'192-PLACE-006',title:'Cadarache, France: the local system behind an international research project',source_project:'191-PROJECT-012',jurisdiction:'France',region:'Europe',
    answer:'The France acquisition docket now has a named reporting focus: the receiving system around ITER at Cadarache. A research-project baseline cannot stand in for the wider place’s outcomes.',
    sections:[
      {heading:'Receiving system',text:'An international research project still depends on specific land, transport, utilities, construction interfaces, staff and a national regulatory setting. Those local relationships should be recorded independently from the international programme’s research goals.'},
      {heading:'Scope and identity limits',text:'This is a proposed named focus for the existing France place docket, not a silent replacement of the historical null identity field. Formal identity and jurisdiction acceptance remains open. No local employment, affordability or service outcome is inferred from the project’s budget.'},
      {heading:'Next reporting',text:'Bind exact regulator and local-authority artifacts, utilities and logistics evidence, and a defensible local baseline. The current draft establishes a reporting direction and bounded project context, not full place-dossier completion.'},
    ]},
  {record_id:'192-PLACE-010',title:'Naka, Japan: distinguish a research campus from an energy service',source_project:'191-PROJECT-020',jurisdiction:'Japan',region:'Asia',
    answer:'Naka is an identified research location for JT-60SA. Its experimental milestones do not establish electricity supplied to the surrounding place.',
    sections:[
      {heading:'Receiving system',text:'The relevant local system includes research operations, skilled personnel, diagnostics, facilities and institutional responsibility. Evaluate whether the campus can support a repeated experimental programme; do not substitute a power-station service test for its research purpose.'},
      {heading:'Scope and identity limits',text:'Naka is the proposed named focus for the existing Japan place-acquisition docket. The historical docket remains unchanged pending formal identity review. A training schedule is not evidence of completed training or a quantified regional workforce outcome.'},
      {heading:'Next reporting',text:'Acquire exact local facility, operating and workforce evidence and independently review the language and jurisdiction interpretation. A full place account also needs context beyond this one project.'},
    ]},
]));
