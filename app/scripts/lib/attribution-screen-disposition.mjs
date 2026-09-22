// A narrow triage decision cannot follow changed text or clear another record.
export function attributionScreenDisposition(candidate,records,asOfDate){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate))throw Error('Screen cutoff must be an ISO date');
 const matches=records.filter(r=>r.id===candidate.id);
 if(matches.length>1)throw Error('Duplicate screen disposition');
 const r=matches[0];
 if(!r||r.review_date>asOfDate)return null;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(r.review_date)||!/^\d{4}-\d{2}-\d{2}$/.test(r.source_check_date)||r.source_check_date>r.review_date||!r.reason||!r.disposition)throw Error('Invalid dated screen disposition');
 if(r.source_file!==candidate.source_file||r.reviewed_source_sha256!==candidate.source_sha256)return null;
 return structuredClone(r);
}
