export function searchShelf(records,filters={}){
  const words=(filters.q??'').trim().toLocaleLowerCase('en').split(/\s+/).filter(Boolean);
  return records.filter(r=>words.every(w=>`${r.title} ${r.summary} ${r.searchText??''} ${(r.facts??[]).map(f=>`${f.label} ${f.value}`).join(' ')}`.toLocaleLowerCase('en').includes(w))&&Object.entries(filters).every(([key,value])=>key==='q'||!value||(r.filters[key]??[]).includes(value)));
}
