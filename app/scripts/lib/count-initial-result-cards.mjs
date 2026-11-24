// Counts result-card elements in generated HTML, including legacy cards that
// predate data-shelf-card. It is a markup budget check, not a visibility or
// accessibility test. Comments and script/style contents are not page elements.
export function countInitialResultCards(html){
  const markup=html.replace(/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,'');
  let count=0;
  for(const tag of markup.matchAll(/<[a-z][a-z0-9:-]*\b((?:[^'"<>]|"[^"]*"|'[^']*')*)>/gi)){
    const attributes=new Map();
    for(const a of tag[1].matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s'"=<>`]+)))?/g))attributes.set(a[1].toLowerCase(),a[2]??a[3]??a[4]??'');
    if(attributes.has('data-shelf-card')||attributes.has('data-overview-card')||(attributes.get('class')??'').split(/\s+/).includes('record-card'))count++;
  }
  return count;
}
