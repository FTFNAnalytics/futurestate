// Browser-safe matching; never imports the article bodies or full registry.
export function searchReaders(records,query='',kind='') {
  const words=query.trim().toLocaleLowerCase('en').split(/\s+/).filter(Boolean);
  return records.filter(r=>(!kind||r.kind===kind)&&words.every(word=>`${r.title} ${r.summary} ${(r.identity_names??[]).join(' ')}`.toLocaleLowerCase('en').includes(word)));
}
