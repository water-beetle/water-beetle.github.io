import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const directory=process.argv[2]||'dist',c={window:{}};vm.createContext(c);
for(const f of ['data.js','editorial.js'])vm.runInContext(fs.readFileSync(directory+'/'+f,'utf8'),c);
const d=c.window.ATLAS_DATA,e=c.window.ATLAS_EDITORIAL,ids=new Set(d.research.map(n=>n.id));
assert.equal(d.research.length,119);assert.equal(ids.size,119);assert.equal(d.docs.length,39);assert.equal(e.chapters.length,12);
assert.equal(d.docs.filter(x=>x.path.startsWith('Docs/Planning/')).length,32);
assert.equal(Object.keys(d.economy.materials).length,24);assert.equal(Object.keys(d.economy.recipes).length,30);assert.equal(Object.keys(d.economy.products).length,140);
for(const n of d.research){assert(n.name&&n.type);for(const id of [...n.deps,...n.supplyDeps])assert(ids.has(id),'Missing dependency '+id);assert(n.stage>=0&&n.stage<=9);}
const refs=new Set([...e.chapters.flatMap(x=>x.refs),...e.changes.map(x=>x[4])]);
for(const id of refs)assert(d.docs.some(x=>x.sections.some(s=>new RegExp('^'+id+'(?:\\s|$|[—:：])').test(s.heading))),'Unresolved source '+id);
for(const doc of d.docs)assert(!doc.path.includes('/Archive/'));
const html=fs.readFileSync(directory+'/index.html','utf8');for(const m of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g))assert(fs.existsSync(directory+'/'+m[1]));
for(const file of ['app.js','editorial.js','data.js'])new vm.Script(fs.readFileSync(directory+'/'+file,'utf8'));
console.log('PASS: 39 source documents, 12 chapters, 119 research definitions, every prerequisite/source ID, 24 materials, 30 recipes, 140 products, local assets and JS syntax.');
