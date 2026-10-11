// Keep corrected costumes and props reproducible when atlases are rebuilt.
module.exports = function refineDetails(html) {
  const spriteDeclaration = html.match(/^const SPRITES=.*;\r?\n/m);
  if (!spriteDeclaration) throw Error('Embedded sprites were not installed');
  html = html.replace(spriteDeclaration[0], '');
  const propsStart = html.indexOf("let g=grp('gate');");
  html = html.slice(0, propsStart) + spriteDeclaration[0] + html.slice(propsStart);

  const sceneryStart = html.indexOf("let g=grp('gate');");
  const sceneryEnd = html.indexOf("g=grp('ped');", sceneryStart);
  if (sceneryStart < 0 || sceneryEnd < 0) throw Error('Cannot find gate and statue renderers');
  const sceneryCode = `let g=grp('gate');mk('title',{},g).textContent='Gate of Time';
const gateRune=mk('g',{},g);spriteViewport(gateRune,'gate',-76).setAttribute('data-asset','gate');label(g,10,'GATE OF TIME');
g=grp('stat');mk('title',{},g).textContent='Goddess Statue';
const island=mk('g',{'shape-rendering':'crispEdges'},g);
mk('path',{d:'M-38 1H38V5H32V9H26V13H22V19H16V16H10V20H5V27H-2V21H-7V17H-15V13H-24V9H-32V5H-38Z',fill:'var(--stone)'},island);
mk('path',{d:'M-38 0H-25V-2H-12V-3H12V-2H25V0H38V3H-38Z',fill:'#839b6b'},island);
mk('path',{d:'M-24 7h9v2h-9ZM-9 14h7v2h-7ZM15 7h10v2H15ZM2 19h4v2H2Z',fill:'var(--muted)',opacity:.3},island);
spriteViewport(g,'statue',-76).setAttribute('data-asset','statue');
const skyPeople=mk('g',{},island);for(const [x,kind] of [[-30,'hero'],[29,'groose']]){const person=mk('g',{transform:'translate('+x+' -3.6) scale(.18)'},skyPeople);spriteViewport(person,kind);}
`;
  html = html.slice(0, sceneryStart) + sceneryCode + html.slice(sceneryEnd);
  html = html.replace(/\*180\} 0 -28/, '*180} 0 -30');

  html = html.replace(/g=grp\('crys'\);[^\n]*\n/, "g=grp('crys');mk('title',{},g).textContent='Zelda asleep in her crystal';const crystalShell=mk('g',{transform:'translate(0 13) scale(1.28)'},g);spriteViewport(crystalShell,'crystal-white',-52).setAttribute('data-asset','crystal-white');\n");
  html = html.replace(/const sleeper=makeFigure\(sleeping,[^\n]*?poseFigure\(sleeper,poses.sleep\);/, '');

  const swordStart = html.indexOf('function sword(id)');
  const swordEndMarker = "sword('swd');sword('swd2');";
  const swordEnd = html.indexOf(swordEndMarker, swordStart) + swordEndMarker.length;
  if (swordStart < 0 || swordEnd < swordEndMarker.length) throw Error('Cannot find sword renderer');
  const swordCode = `function sword(id){
 const group=grp(id),kind=id==='swd'?'master-sword':'goddess-sword';
 mk('title',{},group).textContent=id==='swd'?'Master Sword':'Goddess Sword';
 spriteViewport(group,kind).setAttribute('data-asset',kind);
}
sword('swd');sword('swd2');`;
  html = html.slice(0, swordStart) + swordCode + html.slice(swordEnd);

  html = html.replace(/mk\('path',\{d:'M0 0L-2-7-3-31[^\n]*actors.de.held\);/, "const demonWeapon=mk('g',{transform:'scale(.75)'},actors.de.held);spriteViewport(demonWeapon,'demise-sword',-70).setAttribute('data-asset','demise-sword');");

  if (!html.includes('function setHeldSword(')) {
    const marker = 'actors.li.held.appendChild(handSword);';
    const updater = `
handSword.dataset.blade='master-sword';
function setHeldSword(kind){
 if(handSword.dataset.blade===kind)return;
 handSword.dataset.blade=kind;
 handSword.querySelector('image').setAttribute('href',SPRITES[kind].data);
 handSword.querySelector('[data-asset]').setAttribute('data-asset',kind);
 handSword.querySelector('title').textContent=kind==='master-sword'?'Master Sword':'Goddess Sword';
}
`;
    html = html.replace(marker, marker + updater);
    html = html.replace(' handSword.style.display=', " setHeldSword(i===8||i===10&&t<2.1?'goddess-sword':'master-sword');\n handSword.style.display=");
  }
  if (!html.includes('function setZeldaOutfit(')) {
    const outfitCode = `function setZeldaOutfit(figure,kind){
 if(figure.outfit===kind)return;
 figure.outfit=kind;
 figure.viewport.querySelector('image').setAttribute('href',SPRITES[kind].data);
 figure.viewport.setAttribute('data-asset',kind);
 figure.rig.setAttribute('data-outfit',kind==='zelda'?'pink':'white');
}
`;
    html = html.replace('const cast=', outfitCode + 'const cast=');
    html = html.replace('function render(t){', `function render(t){
 // The escape in scene 10 replays scene 3, before the white dress blessing.
 const zeldaOutfit=[1,2,9].includes(i)?'zelda':'zelda-white';
 for(const id of ['ze','z2'])setZeldaOutfit(actors[id],zeldaOutfit);`);
    html = html.replace('makeFigure(icon,null,name,kind);', "const figure=makeFigure(icon,null,name,kind);if(kind==='zelda')setZeldaOutfit(figure,'zelda-white');");
  }
  if (!html.includes('// Crystal size stays consistent with Zelda in every scene.')) {
    html = html.replace('const DURATION=', `// Crystal size stays consistent with Zelda in every scene.
for(const scene of S){const crystal=scene.k.crys;if(!crystal)continue;if(crystal.length===4)crystal[3]=1;else{if(crystal[2]>0)crystal[3]=1;crystal[7]=1;}}
const DURATION=`);
  }
  return html;
};
