const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'script-v2.html'),'utf8');
const catalog=fs.readFileSync(path.join(root,'locales/es-419.js'),'utf8');
const scenes=vm.runInNewContext(html.match(/const S=(\[[\s\S]*?\n\]);/)[1]);
const {ES_SCENES,ES_TEXT}=vm.runInNewContext(catalog+'\n({ES_SCENES,ES_TEXT})');
const refs=text=>[...text.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();
assert.equal(Object.keys(ES_SCENES).length,scenes.length);
for(const scene of scenes){
 const row=ES_SCENES[scene.id];assert.ok(row,`Missing scene ${scene.id}`);
 assert.equal(row.length,4);
 row.forEach(text=>assert.ok(typeof text==='string'&&text.trim(),`Empty translation: ${scene.id}`));
 for(const [n,key] of ['t','c','w'].entries())assert.deepEqual(refs(row[n]),refs(scene[key]),`Slide references differ: ${scene.id}.${key}`);
 assert.ok(ES_TEXT[scene.l],`Missing location: ${scene.l}`);
 for(const tag of scene.tg||[])assert.ok(ES_TEXT[tag[1]],`Missing tag: ${tag[1]}`);
}
assert.ok(html.includes(catalog),'Embedded catalog is stale');
assert.ok(html.includes(fs.readFileSync(path.join(root,'tools/localization-runtime.js'),'utf8')),'Embedded runtime is stale');
const script=fs.readFileSync(path.join(root,'narrator-es-419.md'),'utf8');
assert.equal((script.match(/^## /gm)||[]).length,scenes.length);
for(const row of Object.values(ES_SCENES))assert.ok(script.includes(row[3]),'Narrator export is stale');
console.log(`Validated ${scenes.length} translated slides, narration passages, locations, labels and slide references.`);
