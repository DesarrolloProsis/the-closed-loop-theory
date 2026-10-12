// Embedded with the catalog so the downloaded HTML also works offline.
let language='en';
const englishBySpanish=new Map();
function tr(text){return language==='es-419'?(ES_TEXT[text]??text):text}
function narrationText(id){return language==='es-419'?ES_SCENES[id][3]:(NARRATION[id]||'')}
function localizeDOM(root=document.body){
 const convert=value=>{const trimmed=value.trim(),replacement=language==='es-419'?(ES_TEXT[trimmed]??trimmed):(englishBySpanish.get(trimmed)??trimmed);return value.replace(trimmed,replacement)};
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){
  if(node.parentElement.closest('script,style,#language-controls,#rec-language-controls,#nar-voice,#narrator-text,.title'))continue;
  const next=convert(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next;
 }
 for(const el of root.querySelectorAll('[aria-label],[title]'))for(const attr of ['aria-label','title']){
  const value=el.getAttribute(attr);if(value){const next=convert(value);if(next!==value)el.setAttribute(attr,next)}
 }
}
function narratorMarkdown(){return '# '+tr('Narrator script')+' — '+(language==='es-419'?'Español (Latinoamérica)':'English')+'\n\n'+S.map((s,n)=>'## '+(n+1)+'. '+tr(s.t)+'\n\n'+narrationText(s.id)).join('\n\n')+'\n'}
function updateNarratorScript(){
 const container=document.getElementById('narrator-text');container.replaceChildren();
 for(const [n,s] of S.entries()){const section=document.createElement('section'),heading=document.createElement('h3'),p=document.createElement('p');heading.textContent=(n+1)+'. '+tr(s.t);p.textContent=narrationText(s.id);section.append(heading,p);container.append(section)}
}
function setLanguage(next,refresh=true){
 const wasPlaying=playing,wasAutoplay=autoplay,at=time;
 stopNarration();language=next==='es-419'?'es-419':'en';store.set('slideshow-language',language);
 document.documentElement.lang=language;
 if(refresh){const url=new URL(location.href);url.searchParams.set('lang',language);try{history.replaceState(null,'',url)}catch{}}
 document.title=language==='es-419'?'Skyward Sword · La historia que se corrige a sí misma':'Skyward Sword · The self-correcting timeline';
 document.querySelector('.title').innerHTML=language==='es-419'?'La historia que <em>se corrige</em>.':'The <em>self-correcting</em> timeline.';
 document.querySelectorAll('[data-language-select]').forEach(el=>el.value=language);
 for(const el of document.querySelectorAll('.scene-dot')){const n=Number(el.textContent)-1;el.title=tr(S[n].t);el.setAttribute('aria-label',tr('Scene')+' '+(n+1)+': '+tr(S[n].t))}
 loadVoices();updateNarratorScript();
 if(refresh){
  // Keep the selected slide and animation position; restart its spoken text in the new language.
  go(pos,false);playing=wasPlaying;autoplay=wasAutoplay;time=at;lastFrame=0;overrun=0;render(time);prepareNarration(playing);updatePlay();
 }
 localizeDOM();
}
function initLocalization(){
 for(const s of S){const row=ES_SCENES[s.id];if(!row)throw Error('Missing Spanish scene '+s.id);['t','c','w'].forEach((key,n)=>ES_TEXT[s[key]]=row[n])}
 for(const [en,es] of Object.entries(ES_TEXT))if(en!==es)englishBySpanish.set(es,en);
 const makeSelect=(id)=>{const box=document.createElement('div');box.id=id;box.className='language-controls ui';const label=document.createElement('label');label.textContent='Language / Idioma ';const select=document.createElement('select');select.dataset.languageSelect='';select.setAttribute('aria-label','Language / Idioma');for(const [value,text] of [['en','English'],['es-419','Español (Latinoamérica)']]){const o=document.createElement('option');o.value=value;o.textContent=text;select.append(o)}select.onchange=()=>setLanguage(select.value);label.append(select);box.append(label);return box};
 document.querySelector('.presentation').before(makeSelect('language-controls'));
 document.querySelector('#rec-start > div').prepend(makeSelect('rec-language-controls'));
 const script=document.createElement('details');script.className='narrator-script ui';script.innerHTML='<summary>Narrator script</summary><button type="button" id="download-narrator">Download script</button><div id="narrator-text"></div>';document.querySelector('.tracks').after(script);
 document.getElementById('download-narrator').onclick=()=>{const url=URL.createObjectURL(new Blob([narratorMarkdown()],{type:'text/markdown;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='narrator-'+language+'.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
 const requested=new URLSearchParams(location.search).get('lang');setLanguage(requested||store.get('slideshow-language')||'en',false);
}
