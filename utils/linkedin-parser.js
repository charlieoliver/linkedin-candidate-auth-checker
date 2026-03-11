export function parseLinkedInProfile(doc){
  const name=doc.querySelector('h1')?.innerText || null;

  const summary=doc.querySelector('.pv-shared-text-with-see-more span')?.innerText || null;

  const connectionsText=[...doc.querySelectorAll('span')]
    .map(e=>e.innerText)
    .find(t=>t && t.includes('connections'));

  let connections=null;

  if(connectionsText){
    const num=parseInt(connectionsText);
    if(!isNaN(num)) connections=num;
  }

  const github=[...doc.querySelectorAll('a')]
    .map(a=>a.href)
    .find(h=>h && h.includes('github.com'));

  return {
    name,
    summary,
    connections,
    github
  };
}
