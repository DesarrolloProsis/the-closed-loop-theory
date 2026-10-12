const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..'),versions=require('./localization-versions.cjs');
const runtime=fs.readFileSync(path.join(root,'tools/localization-runtime.js'),'utf8');
const refs=text=>[...text.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();
// Names read the same in both languages and need no catalog entry.
const NAMES=new Set(['Hylia','Demise']);
for(const version of versions){
 const html=fs.readFileSync(path.join(root,version.html),'utf8');
 const catalog=version.catalogs.map(name=>fs.readFileSync(path.join(root,name),'utf8')).join('\n');
 const scenes=vm.runInNewContext(html.match(/const S=(\[[\s\S]*?\n\]);/)[1]);
 const {ES_SCENES,ES_TEXT}=vm.runInNewContext(catalog+'\n({ES_SCENES,ES_TEXT})');
 const where=`${version.html}:`;
 assert.equal(Object.keys(ES_SCENES).length,scenes.length,`${where} scene count differs`);
 for(const scene of scenes){
  const row=ES_SCENES[scene.id];assert.ok(row,`${where} missing scene ${scene.id}`);
  assert.equal(row.length,4);
  row.forEach(text=>assert.ok(typeof text==='string'&&text.trim(),`${where} empty translation: ${scene.id}`));
  for(const [n,key] of ['t','c','w'].entries())assert.deepEqual(refs(row[n]),refs(scene[key]),`${where} slide references differ: ${scene.id}.${key}`);
  assert.ok(ES_TEXT[scene.l],`${where} missing location: ${scene.l}`);
  for(const tag of scene.tg||[])assert.ok(ES_TEXT[tag[1]],`${where} missing tag: ${tag[1]}`);
 }
 // Timeline facts, the opening, closing and FAQ cards, and the stage's rule note.
 const facts=vm.runInNewContext('['+html.match(/FACTS=\[([\s\S]*?)\n\];/)[1]+']',{X:new Proxy({},{get:()=>0})});
 for(const fact of facts)if(fact[8]&&!NAMES.has(fact[8]))assert.ok(ES_TEXT[fact[8]],`${where} missing timeline text: ${fact[8]}`);
 for(const id of ['card','opening','faq']){
  const block=html.match(new RegExp(`<div id="${id}"[\\s\\S]*?(?=<div id="|<aside)`))[0];
  for(const [,text] of block.matchAll(/>([^<>]+)</g))if(text.trim())assert.ok(ES_TEXT[text.trim()],`${where} missing ${id} text: ${text.trim()}`);
 }
 const note=html.match(/ruleNote=[^;]*;\[\['([^']+)',192\],\['([^']+)',199\]\]/);
 for(const text of note.slice(1))assert.ok(ES_TEXT[text],`${where} missing rule note: ${text}`);
 assert.ok(html.includes(catalog),`${where} embedded catalog is stale`);
 assert.ok(html.includes(runtime),`${where} embedded runtime is stale`);
 const script=fs.readFileSync(path.join(root,version.narrator),'utf8');
 assert.equal((script.match(/^## /gm)||[]).length,scenes.length);
 for(const scene of scenes)assert.ok(script.includes(ES_SCENES[scene.id][3]),`${where} narrator export is stale`);
 console.log(`${version.html}: validated ${scenes.length} translated slides, narration passages, locations, labels, timeline texts, cards and slide references.`);
}
