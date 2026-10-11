const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const file = path.join(root, 'script.html');
const atlas = JSON.parse(fs.readFileSync(path.join(root, 'assets/sprites/manifest.json'), 'utf8').replace(/^\uFEFF/, ''));
let html = fs.readFileSync(file, 'utf8');
const spriteCode = `// Embedded pixel atlases keep the presentation usable as a single offline file.
const SPRITES=${JSON.stringify(atlas)};
const poseFrames={idle:0,old:0,walkA:1,walkB:2,runA:3,runB:2,cast:4,bless:4,guard:4,strike:7,overhead:5,recoil:6,fall:6,kneel:6,plant:4,pray:6,drag:4,captive:0,sleep:6,dive:5,land:6,harp:0,farewell:5};
const grips=[[9,-5],[11,-8],[11,-10],[16,-12],[23,-17],[15,-39],[10,1],[27,-15]];
function spriteViewport(parent,kind,y=-56){
 const data=SPRITES[kind];
 const viewport=mk('svg',{x:-40,y,width:80,height:80,viewBox:'0 0 80 80',overflow:'hidden',class:'sprite-pixels','aria-hidden':'true'},parent);
 mk('image',{href:data.data,width:80*data.frames,height:80,'image-rendering':'pixelated'},viewport);
 return viewport;
}
function makeFigure(parent,id,name,kind){
 const rig=mk('g',{class:'actor pixel-actor '+kind,'data-character':name},parent);
 mk('title',{},rig).textContent=name;
 mk('path',{d:'M-13 21h26v2h-26Z',fill:'var(--ink)',opacity:.10},rig);
 const viewport=spriteViewport(rig,kind),torso=mk('g',{},rig),held=mk('g',{},torso);
 const a={rig,viewport,torso,held,kind,frame:-1};
 poseFigure(a,poses[kind==='old-impa'?'old':'idle']);
 if(id)actors[id]=a;
 return a;
}
function poseFigure(a,p){
 let closest='idle',best=Infinity;
 for(const [name,pose] of Object.entries(poses)){
  const distance=pose.reduce((sum,value,index)=>sum+(value-p[index])**2,0);
  if(distance<best){best=distance;closest=name;}
 }
 const frame=poseFrames[closest];
 if(frame!==a.frame){a.viewport.setAttribute('viewBox',frame*80+' 0 80 80');a.frame=frame;a.rig.setAttribute('data-frame',frame);a.rig.setAttribute('data-pose',closest);}
 a.held.setAttribute('transform','translate('+grips[frame][0]+' '+grips[frame][1]+')');
}
`;
if (html.includes('const SPRITES=')) {
  html = html.replace(/^const SPRITES=.*?;\r?\n/m, `const SPRITES=${JSON.stringify(atlas)};\n`);
} else {
  const start = html.indexOf('function makeFigure(');
  const end = html.indexOf('const cast=', start);
  if (start < 0 || end < 0) throw Error('Cannot find figure renderer');
  html = html.slice(0, start) + spriteCode + html.slice(end);
  const monsterStart = html.indexOf("g=grp('im');");
  const monsterEnd = html.indexOf("g=grp('seal');", monsterStart);
  html = html.slice(0, monsterStart) + "g=grp('im');mk('title',{},g).textContent='Imprisoned';const monsterViewport=spriteViewport(g,'imprisoned',-66);\n" + html.slice(monsterEnd);
  html = html.replace("if(i===0)setState(E.im,", "monsterViewport.setAttribute('viewBox',((Math.floor(t*4)%3)*80)+' 0 80 80');\n if(i===0)setState(E.im,");
  html = html.replace("const icon=mk('svg',{viewBox:'-16 -44 32 68'", "const icon=mk('svg',{viewBox:'-34 -52 68 80'");
  html = html.replace("viewBox:'-34 -45 68 68'", "viewBox:'-38 -54 76 72'");
  html = html.replace('.cast-item svg{width:22px;height:35px;', '.cast-item svg{width:34px;height:44px;');
  html = html.replace('.actor{filter:brightness(1.4)}', '.actor{filter:none}');
  html = html.replace('</style>', '.pixel-actor{filter:none}.sprite-pixels,.sprite-pixels image{image-rendering:pixelated;image-rendering:crisp-edges}.pixel-actor .sprite-pixels{shape-rendering:crispEdges}\n</style>');
  html = html.replace("handSword.setAttribute('transform',\u0060rotate(\u0024{swordAngle}) translate(0 -17) scale(.7)\u0060)", "handSword.setAttribute('transform',\u0060rotate(\u0024{swordAngle}) translate(0 -12) scale(.7)\u0060)");
}
html = html.replace('.cast-item svg{', '.cast-item > svg{');
html = html.replace(/\.actor\{--actor:[\s\S]*?(?=\.prop-label)/, '.actor{image-rendering:pixelated}');
html = html.replace('sleep:6,dive:5,land:6,harp:0,farewell:5', 'sleep:6,dive:5,land:6,harp:4,farewell:5');
html = html.replace("const harp=mk('g',{},actors.li.torso)", "const harp=mk('g',{transform:'translate(-1 11)'},actors.li.held)");
html = html.replace("monsterViewport.setAttribute('viewBox',((Math.floor(t*4)%3)*80)+' 0 80 80');", "monsterViewport.setAttribute('viewBox',((i===0&&t>1.8&&t<3.5||i===4&&t>3.4||i===11&&t>2?3:Math.floor(t*4)%3)*80)+' 0 80 80');");
const poseStart = html.indexOf('function poseAt(');
const poseEnd = html.indexOf('function setState(', poseStart);
html = html.slice(0, poseStart) + "function poseAt(id,t){const q=cues[i][id];if(!q)return poses[actors[id].kind==='old-impa'?'old':'idle'];let name=q[0][1];for(const cue of q){if(t<cue[0])break;name=cue[1]}return poses[name]}\n" + html.slice(poseEnd);
html = require('./refine-details.cjs')(html);
new Function(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(file, html);
console.log('Installed corrected character, sword, and crystal atlases; JavaScript syntax valid.');
