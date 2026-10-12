// Embed the Spanish catalog and language controls in the offline presentation.
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),file=path.join(root,'script-v2.html');
let html=fs.readFileSync(file,'utf8');
const catalog=fs.readFileSync(path.join(root,'locales/es-419.js'),'utf8');
const runtime=fs.readFileSync(path.join(__dirname,'localization-runtime.js'),'utf8');
const block='// BEGIN LOCALIZATION\n'+catalog+'\n'+runtime+'\n// END LOCALIZATION';
if(html.includes('// BEGIN LOCALIZATION'))html=html.replace(/\/\/ BEGIN LOCALIZATION[\s\S]*?\/\/ END LOCALIZATION/,()=>block);
else html=html.replace("'use strict';","'use strict';\n"+block);
fs.writeFileSync(file,html);
const scenes=vm.runInNewContext(html.match(/const S=(\[[\s\S]*?\n\]);/)[1]);
const spanish=vm.runInNewContext(catalog+'\nES_SCENES');
fs.writeFileSync(path.join(root,'narrator-es-419.md'),'# Guion de narración — Español (Latinoamérica)\n\n'+scenes.map((s,n)=>'## '+(n+1)+'. '+spanish[s.id][0]+'\n\n'+spanish[s.id][3]).join('\n\n')+'\n');
console.log('Embedded Spanish localization and exported narrator-es-419.md');
