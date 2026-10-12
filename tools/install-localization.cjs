// Embed the Spanish catalog and language controls in each offline presentation.
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),versions=require('./localization-versions.cjs');
const runtime=fs.readFileSync(path.join(__dirname,'localization-runtime.js'),'utf8');
for(const version of versions){
 const file=path.join(root,version.html);let html=fs.readFileSync(file,'utf8');
 const catalog=version.catalogs.map(name=>fs.readFileSync(path.join(root,name),'utf8')).join('\n');
 const block='// BEGIN LOCALIZATION\n'+catalog+'\n'+runtime+'\n// END LOCALIZATION';
 if(html.includes('// BEGIN LOCALIZATION'))html=html.replace(/\/\/ BEGIN LOCALIZATION[\s\S]*?\/\/ END LOCALIZATION/,()=>block);
 else html=html.replace("'use strict';","'use strict';\n"+block);
 fs.writeFileSync(file,html);
 const scenes=vm.runInNewContext(html.match(/const S=(\[[\s\S]*?\n\]);/)[1]);
 const spanish=vm.runInNewContext(catalog+'\nES_SCENES');
 fs.writeFileSync(path.join(root,version.narrator),'# '+version.heading+'\n\n'+scenes.map((s,n)=>'## '+(n+1)+'. '+spanish[s.id][0]+'\n\n'+spanish[s.id][3]).join('\n\n')+'\n');
 console.log(`Embedded Spanish localization in ${version.html} and exported ${version.narrator}`);
}
