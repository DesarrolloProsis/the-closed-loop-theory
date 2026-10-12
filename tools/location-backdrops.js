// Source for the self-contained backdrops embedded in script-v2.html.
// Coordinates use its 170 × 105 pixel canvas; the actors stand at y=85.
function templeHall(b,old){
 const stone=old?'#737f72':'#b7b79a',light=old?'#a3ac90':'#ded6b3',shade=old?'#4e6258':'#818f7c',gold=old?'#a69e67':'#c7b573';
 b.wall(stone,old?'#697769':'#a8aa90');
 // Deep central sanctuary, flanked by heavy square piers and recessed panels.
 b.poly([[38,8],[132,8],[121,77],[49,77]],shade);
 b.px(58,18,54,61,old?'#596d5d':'#8b9d80');
 b.px(64,30,42,45,old?'#344d45':'#607d6b');
 b.poly([[64,30],[70,21],[100,21],[106,30]],light);
 b.px(69,31,32,44,old?'#536b58':'#9ea988');
 b.line(85,32,85,73,shade);
 // Winged crest carved into the sanctuary doors.
 b.poly([[85,35],[80,43],[90,43]],gold);
 for(const sign of [-1,1])for(let n=0;n<3;n++)b.line(85+sign*3,46+n,85+sign*(13-n*3),43+n*3,gold);
 for(const [x,w,top] of [[3,15,0],[29,10,10],[131,10,10],[152,15,0]]){
  b.px(x,top,w,85-top,stone);b.px(x,top,3,85-top,light);b.px(x+w-3,top,3,85-top,shade);
  b.px(x-2,top+8,w+4,4,light);b.px(x-2,79,w+4,6,light);
  for(let y=top+19;y<77;y+=17){b.px(x+4,y,w-7,11,shade);b.px(x+4,y,w-7,1,gold)}
 }
 b.px(0,3,170,5,shade);b.px(0,8,170,2,gold);
 // The characteristic roof light falls across the green-grey hall.
 b.poly([[96,10],[109,10],[135,78],[97,78]],old?'#8d9b77':'#c1c8a1');
 for(let y=17;y<75;y+=3)b.px(99+(y-17)*.18,y,2,1,light);
 b.tiles(old?'#8b927b':'#bbb99a',old?'#818a74':'#afaf91',light);
 for(const x of [29,57,85,113,141])b.line(85,85,x,104,shade);
 b.px(49,77,72,2,light);b.px(44,80,82,2,stone);b.px(39,83,92,2,light);
 if(old){
  for(const x of [7,31,137,160]){const len=12+Math.floor(b.R()*18);b.line(x,10,x-2,10+len,'#466a44');for(let y=13;y<10+len;y+=4)b.px(x-3,y,4,2,'#6c8652')}
  for(let n=0;n<22;n++)b.px(b.R()*170,87+b.R()*16,3,1,'#6d8054');
  b.line(20,31,24,43,shade);b.line(24,43,21,51,shade);
 }
}
function sealedGrounds(b,past=false){
 b.sky(['#8fb7ae','#adc9b3','#c8d8b9','#dce3c5']);
 b.ridge(38,10,.055,2,'#7b9b88');b.ridge(46,6,.12,4,'#608773');
 for(let x=0;x<175;x+=10)b.disc(x,38+(x%13),10,'#5e8264');
 // Temple silhouette above the pit: paired towers and broken domed entrance.
 b.px(60,27,50,26,'#a1a88c');b.poly([[58,27],[67,20],[102,20],[112,27]],'#718571');
 for(const x of [58,105]){b.px(x,20,7,32,'#aeb398');b.poly([[x-1,20],[x+3,10],[x+8,20]],'#82907c')}
 b.oval(85,32,14,12,'#b9b99b');b.px(72,32,27,20,'#999f80');b.px(79,36,12,16,'#445f4e');
 b.px(83,38,4,1,'#c6b079');b.px(81,40,8,1,'#c6b079');
 b.px(0,53,170,32,'#7e9863');
 // Broad elliptical terraces read as the spiral depression from a low viewpoint.
 for(const [rx,ry,y] of [[94,26,68],[75,20,69],[56,14,71],[35,8,73]]){
  b.oval(85,y,rx,ry,'#496d58');b.oval(85,y-3,rx,ry-2,past?'#92a76c':'#80985f');
  b.oval(85,y-4,rx-3,Math.max(1,ry-4),'#668256');
 }
 b.oval(85,73,18,4,'#b0b48b');b.oval(85,73,6,2,'#7a866c');
 // Offset connecting ramps break up the rings into one descending route.
 b.poly([[8,64],[20,62],[48,69],[44,73]],'#8ea16b');b.poly([[124,64],[149,60],[157,64],[128,71]],'#8ea16b');
 b.ground('#a1ae78','#839365','#77875b','#69794f',70);
 for(const x of [8,156]){b.px(x,70,5,15,'#a8ae8d');b.px(x-1,69,7,2,'#c0c1a0')}
}
function timeTemple(b,past){
 b.sky(past?['#73b9ce','#a6d1d1','#d8e4c9']:['#cabba0','#e0cba6','#eedcb7']);
 b.ridge(59,6,.04,1,past?'#91a591':'#c6aa82');
 // Lanayru's monumental blue-green stonework, gold trim and pointed buttresses.
 const body=past?'#748f88':'#969b84',edge=past?'#c6c9a1':'#beba95',dark=past?'#3f686d':'#667a75';
 b.px(18,20,134,65,body);b.px(18,19,134,4,edge);b.px(18,24,134,2,'#b6a265');
 for(const x of [20,50,118,148]){b.poly([[x-6,85],[x-4,24],[x,10],[x+5,24],[x+7,85]],edge);b.px(x,27,3,53,dark);b.px(x-4,39,9,3,'#b6a265')}
 b.poly([[59,78],[59,38],[67,27],[103,27],[111,38],[111,78]],dark);
 b.poly([[65,78],[65,40],[72,33],[98,33],[105,40],[105,78]],past?'#81a5a0':'#80948b');
 b.oval(85,49,13,13,edge);b.oval(85,49,11,11,dark);b.oval(85,49,7,7,'#b6a265');b.oval(85,49,5,5,past?'#81a5a0':'#80948b');
 for(const x of [69,100])b.px(x,63,2,14,edge);
 for(const x of [34,133])for(let y=31;y<72;y+=12){b.oval(x,y,5,5,dark);b.oval(x,y,3,3,'#b1af81');b.px(x-1,y-1,3,3,body)}
 b.tiles(past?'#b4b792':'#c5b897',past?'#a2ac8d':'#b4a98c',edge);
 for(let y=78;y<85;y+=2)b.px(53-(y-78)*2,y,64+(y-78)*4,1,edge);
 if(!past){b.poly([[21,19],[35,19],[30,34],[24,30]],'#dfcca7');b.line(123,46,119,55,dark);b.line(119,55,122,63,dark);for(let k=0;k<22;k++)b.px(b.R()*170,94+b.R()*10,5,1,'#d5c59f')}
}
function lanayruGorge(b,alive=false){
 b.sky(['#afc9cc','#cdd8ca','#e5dfbd']);
 b.poly([[0,25],[22,26],[29,40],[47,41],[52,28],[83,27],[88,40],[110,40],[116,25],[146,24],[153,35],[170,35],[170,85],[0,85]],'#d4b080');
 b.px(0,49,170,36,'#be976c');
 for(const [x,w,top,depth] of [[0,30,37,88],[37,31,47,89],[88,29,34,93],[139,31,40,89]]){
  b.poly([[x,top+4],[x+6,top],[x+w-4,top+1],[x+w,top+8],[x+w-4,depth],[x+4,depth]],'#b18d63');
  b.poly([[x+5,top],[x+w-4,top+1],[x+w-8,depth],[x+8,depth]],'#c9a475');
  for(let y=top+10;y<depth;y+=9)b.px(x+5,y,w-10,1,'#b79468');
 }
 // A dark split between shelf and mesa, crossed by ancient mining rails.
 b.poly([[63,54],[86,54],[102,85],[49,85]],'#8e765a');
 b.line(14,66,136,66,'#6c756c');b.line(14,69,136,69,'#8b8d73');for(let x=18;x<136;x+=7)b.px(x,65,2,6,'#a99f7b');
 b.ground(alive?'#96b578':'#e0c38f',alive?'#8ba477':'#cdb080',alive?'#789166':'#b99d71','#a78d68',70);
 // Circular industrial platform and sparse cacti, kept behind the acting lane.
 b.oval(29,81,19,4,'#6d766b');b.oval(29,80,16,3,'#b4b394');b.oval(29,80,12,2,'#7e8776');b.px(25,79,8,2,'#b5a475');
 for(const x of [7,155,164]){b.px(x,69,2,15,alive?'#548b65':'#7f926e');b.px(x-3,74,3,2,'#829b72');b.px(x-3,71,1,4,'#829b72')}
}
const BACKDROPS={
 landPast:{top:'#96c3cf',bottom:'#859e64',paint:b=>{b.sky(['#96c3cf','#bdd9d7','#e6e8cd']);b.cloud(28,19,5,'#f5f3df','#d5e0d8');b.cloud(131,13,4,'#f5f3df','#d5e0d8');b.ridge(59,13,.043,2,'#93ae99');b.ridge(74,10,.08,4,'#6e956f');b.px(57,43,56,27,'#b7bba0');b.poly([[52,43],[65,32],[103,32],[118,43]],'#839b8c');for(const x of [56,106]){b.px(x,33,8,40,'#c7c7a7');b.poly([[x-1,33],[x+4,23],[x+9,33]],'#8aa196')}b.px(77,47,15,25,'#677f70');b.ground('#adc17d','#859e64','#738b54','#6b8151',70)}},
 storm:{top:'#333e51',bottom:'#798d9a',paint:b=>{b.sky(['#333e51','#4d5868','#697784','#a0a6ab']);for(let x=0;x<180;x+=19)b.cloud(x,15+(x%17),12,'#414b5c','#576270');for(const x of [29,139]){b.line(x,18,x-5,32,'#e8eef0');b.line(x-5,32,x+2,31,'#e8eef0');b.line(x+2,31,x-7,51,'#e8eef0')}b.px(0,70,170,35,'#798d9a');b.px(0,71,170,2,'#b7c1c2');for(let k=0;k<90;k++)b.px(b.R()*170,75+b.R()*30,2+b.R()*9,1,k%3?'#8fa1aa':'#b3c0c5');for(const x of [29,139])for(let y=78;y<104;y+=4)b.px(x-(y-78)*.12,y,2+(y-78)*.2,1,'#c0ccd0')}},
 woodsPresent:{top:'#8fb7ae',bottom:'#839365',paint:b=>sealedGrounds(b)},
 groundsPast:{top:'#8fb7ae',bottom:'#839365',paint:b=>sealedGrounds(b,true)},
 templePast:{top:'#b7b79a',bottom:'#bbb99a',paint:b=>templeHall(b,false)},
 templePresent:{top:'#737f72',bottom:'#8b927b',paint:b=>templeHall(b,true)},
 desertPast:{top:'#73b9ce',bottom:'#b4b792',paint:b=>timeTemple(b,true)},
 desertPresent:{top:'#cabba0',bottom:'#c5b897',paint:b=>timeTemple(b,false)},
 gorgePresent:{top:'#afc9cc',bottom:'#cdb080',paint:b=>lanayruGorge(b)},
 gorgePast:{top:'#afc9cc',bottom:'#8ba477',paint:b=>lanayruGorge(b,true)},
 spring:{top:'#527969',bottom:'#b9b68b',paint:b=>{
  b.sky(['#527969','#729881','#a3b398']);b.ridge(35,8,.1,2,'#577459');b.px(0,36,170,37,'#7a8d68');
  for(let x=0;x<170;x+=14){b.px(x,34,3,35,'#687e5d');b.disc(x,30,11,'#527b55')}
  b.px(0,68,170,37,'#70a59a');for(const x of [28,64,142]){b.px(x,35,3,38,'#bad5b5');b.px(x+1,36,1,36,'#e0e7c4');b.oval(x+1,73,7,2,'#b8d3b0')}
  b.px(82,64,44,12,'#a1a184');b.px(78,62,52,3,'#c6c49b');b.px(88,57,32,5,'#d7d0a5');
  b.px(101,43,7,14,'#c8c6a3');b.disc(104,40,3,'#ded7b1');b.poly([[102,47],[94,41],[95,49],[103,52]],'#b6b895');b.poly([[106,47],[114,41],[113,49],[106,52]],'#b6b895');
  for(let n=0;n<55;n++)b.px(b.R()*170,77+b.R()*28,4,1,'#a0c4a4');
  b.poly([[19,84],[151,84],[164,105],[6,105]],'#b9b68b');b.px(19,84,132,2,'#ded4a7');
  for(let x=24;x<154;x+=21)b.line(x,86,x-6,104,'#989e7c');for(const x of [4,164])b.disc(x,64,10,'#416d50');
 }},
 skyPresent:{top:'#74bddf',bottom:'#edf1dc',paint:b=>{
  b.sky(['#74bddf','#a6d5e5','#d1e6e4','#edf1dc'],0,105);
  for(const [x,y,r] of [[12,34,5],[111,13,5],[153,47,7],[48,77,8]])b.cloud(x,y,r,'#f8f5e5','#d8e5df');
  // Distant inhabited islands, red roofs, a windmill and a falling stream.
  for(const [x,y,w] of [[17,56,36],[97,47,47],[145,26,21]]){
   b.poly([[x,y],[x+w,y],[x+w-7,y+9],[x+w*.55,y+20],[x+6,y+9]],'#928c72');b.poly([[x+w*.5,y+2],[x+w-2,y+2],[x+w*.55,y+20]],'#6f7d71');b.px(x,y,w,3,'#8cac6e');
   if(w>25){for(const dx of [5,18]){b.px(x+dx,y-8,10,8,'#e3d1ac');b.poly([[x+dx-2,y-8],[x+dx+5,y-15],[x+dx+12,y-8]],'#b17c65');b.px(x+dx+4,y-4,2,4,'#74847b')}}
  }
  b.px(119,48,3,27,'#b3dedc');b.px(120,50,1,26,'#e3efdf');b.px(133,33,5,14,'#ded6b6');b.line(129,30,142,40,'#f0e6c6');b.line(142,30,129,40,'#f0e6c6');
  for(let x=-5;x<180;x+=18)b.cloud(x,95+(x%5),8,'#f7f4e5','#dde7dd');
 }},
 centuries:{top:'#172841',bottom:'#3c534b',paint:b=>{b.sky(['#172841','#273c53','#455a66']);b.stars(75,62,['#e9ecda','#aec8c8']);b.disc(133,22,7,'#dedfc1');b.ridge(67,8,.06,2,'#314e48');b.px(57,51,58,34,'#52665b');b.poly([[53,51],[64,41],[108,41],[119,51]],'#3c544e');b.px(80,60,12,25,'#283d38');b.ground('#60745b','#3c534b','#334941','#30453e',60)}},
 plain:{top:'#2c2924',bottom:'#34302a',paint:b=>{b.px(0,0,BG_W,BG_GROUND,'#2c2924');for(let y=4;y<BG_GROUND;y+=8)for(let x=4;x<BG_W;x+=8)b.px(x,y,1,1,'#3a362f');b.px(0,BG_GROUND,BG_W,1,'#4a443b');b.px(0,BG_GROUND+1,BG_W,BG_H-BG_GROUND-1,'#34302a')}}
};
