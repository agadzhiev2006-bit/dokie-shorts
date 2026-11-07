const STAND=s=>FLOOR-168*s-12, SITY=s=>FLOOR-84*s-22;
let CZ=1;
const sayW=(t,a,b,x,y,txt,o={})=>{const op=Math.min(Pr(t,a,a+.35),1-Pr(t,b-.35,b)); if(op<=0) return ""; return `<g transform="translate(${x} ${y-(1-eo(Pr(t,a,a+.35)))*8/CZ}) scale(${1/CZ})">${say(0,0,txt,op,o)}</g>`;};
function camT(c){return `translate(960 540) scale(${c[2]}) translate(${-c[0]} ${-c[1]})`;}
function camAt(keys,t){ if(t<=keys[0][0]) return keys[0].slice(1); for(let i=1;i<keys.length;i++) if(t<keys[i][0]){const a=keys[i-1],b=keys[i],e=eio(Pr(t,a[0],b[0])); return [lerp(a[1],b[1],e),lerp(a[2],b[2],e),lerp(a[3],b[3],e)];} return keys[keys.length-1].slice(1);}

/* ---------------- cast ---------------- */
const GS=.98, BS=1.08, GY=STAND(GS), GD=SITY(GS), BY=STAND(BS), BD=SITY(BS);
const EX={front:0,look:0,closed:0,smile:0,eyeY:0};
const SEATG=Object.assign({x:866,y:GD,s:GS,dir:1,lean:3,hunch:12,tilt:6,lf:[90,-90],lb:[86,-86],fW:[1004,684],bW:[984,688],brow:.35},EX);
const SEATB=Object.assign({x:1354,y:BD,s:BS,dir:-1,lean:2,hunch:8,tilt:4,lf:[90,-90],lb:[86,-86],fW:[1236,684],bW:[1250,688],brow:.4},EX);
const COUCH=Object.assign({x:760,y:BD,s:BS,dir:1,lean:6,hunch:10,tilt:8,lf:[90,-90],lb:[86,-86],fR:[78,-64],bR:[66,-58],brow:.25},EX);
const mugIn=(r,dir)=>mug(r.hf[0]+dir*12,r.hf[1]+16,.62,{});
const G_=(tr,t,seed=0,rim="rimW")=>GRAN(pose(tr,t,seed),rim), B_=(tr,t,seed=1,rim="rimC")=>BOY(pose(tr,t,seed),rim);
const CUPS2=(k1,k2)=>[{x:1060,k:k1},{x:1215,k:k2,band:"#6f9fd6"}];

/* ---- tracks ---- */
const TR={};
TR.k1=KF([Object.assign({t:0,x:1335,y:GY,s:GS,dir:-1,lean:10,hunch:14,tilt:8,fW:[1226,668],brow:.35},EX),
  {t:1.0,fW:[1222,676]},{t:1.6,lean:3,tilt:4,f:[12,6],ez:"io"},{t:2.1},
  {t:2.3,walk:0},{t:2.8,walk:1,x:1290,ez:"i"},{t:5.6,x:905,ez:"lin"},{t:6.0,x:880,walk:0,ez:"o"},
  {t:6.5,dir:1},{t:7.6,x:866,y:GD,lf:[90,-90],lb:[86,-86],lean:3,hunch:12,tilt:6},
  {t:8.2,fW:[1004,684],bW:[984,688]},{t:8.9,tilt:-12,eyeY:-4,look:2},{t:9.9},{t:10.6,tilt:5,eyeY:0,look:0,smile:.7,brow:.15},{t:13}]);
TR.k2=KF([Object.assign({t:0},SEATG,{smile:.4,brow:.2}),{t:1.2,look:4,tilt:2},{t:2.6},{t:3.2,tilt:-12,eyeY:-4,look:2,smile:0},{t:4.0},{t:4.6,tilt:6,eyeY:0,look:3,brow:.6},{t:6}]);
TR.k3=KF([Object.assign({t:0},SEATG,{brow:.7}),{t:1.5},{t:3.0,tilt:18,hunch:18,brow:1.1,eyeY:3},{t:5.5,fW:[1190,684],ez:"io"},{t:7.0,fW:[1150,686]},{t:9}]);
TR.k4=KF([Object.assign({t:0},SEATG,{brow:.9,tilt:10,hunch:16}),{t:2.0,look:4,tilt:4},{t:3.5},{t:4.5,tilt:14,look:0},{t:7}]);
TR.k5g=KF([Object.assign({t:0},SEATG,{closed:1,tilt:24,hunch:26,lean:-2,fW:[990,700],bW:[975,704],brow:.5}),{t:14}]);
TR.k5b=KF([Object.assign({t:0,x:1772,y:BY,s:BS,dir:-1,lean:0,hunch:6,tilt:0,brow:.8,f:[8,4],b:[-8,-4]},EX),{t:3.0},{t:3.4,walk:0},{t:3.8,walk:1,x:1740,ez:"i"},{t:6.0,x:1520,ez:"lin"},{t:6.4,x:1505,walk:0,ez:"o"},{t:7.2,tilt:10,brow:1.2,eyeY:2},{t:14}]);
TR.k6g=TR.k5g;
TR.k6b=KF([Object.assign({t:0},SEATB,{brow:1.1,tilt:10,fW:null,bW:null,f:[30,40],b:[20,40]}),{t:3.0,tilt:6},{t:6.0,brow:1.3,tilt:12},{t:9}]);
TR.k7g=KF([Object.assign({t:0},SEATG,{closed:1,tilt:24,hunch:26,lean:-2,fW:[990,700],bW:[975,704],brow:.5}),
  {t:1.0},{t:1.5,closed:0,tilt:18},{t:2.4,tilt:4,hunch:12,lean:3,brow:-.2,look:3},{t:3.2,brow:.1,smile:.5},{t:5.0,fW:[1050,680],bW:[1032,684]},{t:7.5,smile:1},{t:8.0,tilt:9},{t:8.4,tilt:3},{t:11}]);
TR.k7b=KF([Object.assign({t:0},SEATB,{brow:.9,tilt:8}),{t:2.0,brow:.4},{t:3.4,brow:-.2,smile:.3},{t:6.0,tilt:2,smile:.8},{t:6.4,tilt:10},{t:6.8,tilt:3},{t:11}]);
TR.k8g=KF([Object.assign({t:0},SEATG,{smile:1,brow:-.1,fW:[1050,680],bW:[1032,684]}),{t:9}]);
TR.k8b=KF([Object.assign({t:0},SEATB,{smile:.9,brow:-.1}),{t:9}]);
TR.r1=KF([Object.assign({t:0},COUCH),{t:2.0},{t:2.7,tilt:18,eyeY:4,look:2,brow:.5},{t:3.6},{t:4.0,brow:.8},{t:4.4,fW:[912,762],fR:null,bR:[50,-40],lean:14,ez:"io"},{t:5.2,fW:null,fR:[70,-86],bR:[60,-80],lean:6,tilt:14},{t:8}]);
TR.r2=KF([Object.assign({t:0},COUCH,{eyeY:0}),{t:2.6},{t:3.2,tilt:18,eyeY:4,look:2,brow:.6},{t:5.2},{t:5.8,brow:1.0},{t:6.2,fW:[912,762],fR:null,bR:[50,-40],lean:14},{t:7.0,fW:null,fR:[70,-86],bR:[60,-80],lean:6,tilt:14},{t:9}]);
TR.r3=KF([Object.assign({t:0},COUCH,{fR:[70,-86],bR:[20,-10],tilt:14,brow:1.1}),{t:.6},{t:1.1,y:BY,lf:[0,0],lb:[0,0],lean:2,tilt:4,fR:[30,-40],bR:null,b:[-8,-4]},{t:1.5,dir:-1},{t:1.7,walk:0},{t:2.0,walk:1,x:700,ez:"i"},{t:5,x:150,ez:"lin"}]);
TR.st=KF([Object.assign({t:0,x:300,y:BY,s:BS,dir:1,lean:8,hunch:12,tilt:6,brow:.9,walk:1,f:[6,-4],b:[-6,-4],fHold:1,bHold:1},EX),{t:7,x:1500,ez:"lin"}]);
TR.dr=KF([Object.assign({t:0,x:690,y:BY,s:BS,dir:1,lean:2,hunch:8,tilt:2,brow:.9,f:[8,4],b:[-8,-4]},EX),
  {t:.5,walk:0},{t:.8,walk:1,x:720,ez:"i"},{t:1.5,x:770,walk:0,ez:"o"},
  {t:1.9,fW:[892,560]},{t:2.1,fW:[904,556],ez:"o"},{t:2.25,fW:[884,560]},{t:2.45,fW:[904,556],ez:"o"},{t:2.6,fW:[884,560]},{t:2.8,fW:[904,556],ez:"o"},{t:3.0,fW:[880,580]},
  {t:3.4,f:[8,4]},{t:4.4,tilt:-4,look:2,brow:1.2},{t:4.9,fW:[1080,624],tilt:2},{t:5.4,fW:[1100,626]},{t:6.4,fW:[1112,628]},{t:7}]);

/* ---------------- shots ---------------- */
const SH=[];
let T0=0; const add_=(dur,o)=>{o.a=T0;o.b=T0+dur;T0+=dur;SH.push(o);return o;};

add_(5.0,{card:t=>cardText(t,{lines:[{txt:"We always think there will be another Sunday.",at:1.0,it:1,sz:48,y:552}],out:4.3})});
/* --- CH1: Sunday --- */
add_(13,{cam:[[0,960,540,1.0],[13,1010,560,1.09]],fin:.9,w:t=>{
  const g=G_(TR.k1,t,0); const cups=[{x:1060,k:1}]; if(t>1.0) cups.push({x:1215,k:Math.min(1,(t-1)*1.5),band:"#6f9fd6"});
  return kitchen(t,{season:"autumn",clock:3+57.6/60+t/3600*30,date:12,kSteam:.5})+lampPend(1)+chairL()+chairR()+g.s+(t<1.0?mug(1226+0,684,.62,{band:"#6f9fd6"}):"")+table(t,{cups});}});
add_(4.5,{cam:[[0,1140,650,3.3],[4.5,1140,640,3.55]],w:t=>`<g filter="url(#blur6)">${kitchen(t,{season:"autumn",clock:4,date:12})}${lampPend(1)}${chairL()}${chairR()}${GRAN(Object.assign({},SEATG,{blink:0})).s}</g>`+table(t,{cups:CUPS2(1,1)})});
add_(3.2,{cam:[[0,1440,272,6.2],[3.2,1440,272,6.5]],w:t=>`<g filter="url(#blur6)">${kitchen(t,{season:"autumn",clock:4,date:12})}</g>`+wallClock(t<1.6?3+59/60+(t*0)/3600:4+((t-1.6)*1)/3600)});
add_(6,{cam:[[0,1000,610,1.9],[6,1010,615,2.0]],w:t=>kitchen(t,{season:"autumn",clock:4+2/60+t/3600*20,date:12})+lampPend(1)+chairL()+chairR()+G_(TR.k2,t,0).s+table(t,{cups:CUPS2(1,1)})});
/* boy room: phone buzzes */
add_(7.5,{cam:[[0,980,600,1.18],[7.5,1010,620,1.26]],w:t=>{ const p=pose(TR.r1,t,1); const r=BOY(p,"rimC"); const holding=t>4.9;
  let s=room(t,{eve:0,phoneOnCouch:t<4.8,buzz:(t>2&&t<2.7)||(t>3.3&&t<3.8),phoneLit:t>2&&t<4.8})+r.s;
  if(!holding) s+=controller(r.hb); if(holding) s+=`<rect x="${r.hf[0]-10}" y="${r.hf[1]-30}" width="22" height="40" rx="5" fill="#111318" stroke="#cfe4ff" stroke-width="2"/><ellipse cx="${r.hf[0]}" cy="${r.hf[1]-40}" rx="160" ry="120" fill="url(#phG)" opacity=".6"/>`;
  return s;}, ov:t=>notif(t,2.1,5.2,1060,640,"Grandma","Tea's ready ☕")});
add_(8,{w:t=>phoneShot(t,{dark:1,name:"Grandma",initial:"G",avatar:"#b9773a",bg:t=>room(t,{eve:0}),
  msgs:[{side:"in",text:"Sunday tea? ☕",at:-9,time:"Sat 6:12 PM"},{side:"out",text:"maybe!",at:-8},{side:"in",text:"Tea's ready ☕",at:-1,time:"Today 4:05 PM"}],
  typing:{text:"Can't today, next week 🙏",t0:2.2,cps:11,send:5.0}, thumb:thumbType(2.2,4.7,11)})});
add_(8,{w:t=>phoneShot(t,{dark:0,big:1,rot:2,rim:"rimW",name:"Sammy ❤️",initial:"S",avatar:"#6f9fd6",bg:t=>kitchen(t,{season:"autumn",clock:4.1,date:12})+lampPend(1)+table(t,{cups:CUPS2(1,1)}),
  msgs:[{side:"out",text:"Sunday tea? ☕",at:-9,time:"Sat 6:12 PM"},{side:"in",text:"maybe!",at:-8},{side:"out",text:"Tea's ready ☕",at:-7,time:"Today 4:05 PM"},{side:"in",text:"Can't today, next week 🙏",at:.6}],
  typing:{text:"Okay sweetheart ❤️",t0:2.6,cps:5,send:6.7}, thumb:thumbType(2.6,6.2,5), read:{at:7.2,label:"Delivered"}})});
add_(9,{cam:[[0,1110,580,1.32],[9,960,540,1.0]],fout:1.0,w:t=>kitchen(t,{season:"autumn",clock:4.15+t/9*1.2,date:12,kSteam:0})+lampPend(1)+chairL()+chairR()+G_(TR.k3,t,0).s+table(t,{cups:[{x:1060,k:1},{x:1215-(t>5.5?eio(Pr(t,5.5,7))*0:0),k:Math.max(0,.9-t/6.5),band:"#6f9fd6"}]})});
add_(6.5,{card:t=>cardText(t,{lines:[{txt:"Do not act as if you had ten thousand years to live.",at:.5,sz:46,y:530},{txt:"— MARCUS AURELIUS",at:1.3,sz:20,ls:4,c:"#8f8a82",font:SERIF,y:600}],out:5.8})});
/* --- CH2: next week (montage) --- */
const calShot=(d0,m0,d1,m1,season,fin=0)=>({fin,cam:[[0,1180,440,2.3],[2.6,1195,445,2.4]],w:t=>{const flip={from:[d0,m0],p:Pr(t,.7,1.5)}; return kitchen(t,{season,clock:4+t/3600,date:d1,month:m1,flip})+lampPend(1);}});
add_(2.6,calShot(12,"NOVEMBER",19,"NOVEMBER","late",.6));
add_(2.6,{cam:[[0,1140,650,3.3],[2.6,1140,645,3.4]],w:t=>`<g filter="url(#blur6)">${kitchen(t,{season:"late",clock:4,date:19})}${lampPend(1)}${chairL()}${chairR()}</g>`+table(t,{cups:CUPS2(1,.5)})});
add_(3.6,{w:t=>phoneShot(t,{dark:1,name:"Grandma",initial:"G",avatar:"#b9773a",bg:t=>room(t,{eve:.5}),rot:-5,dx:-40,
  msgs:[{side:"in",text:"Tea's ready ☕",at:-9,time:"Sun 4:05 PM"},{side:"out",text:"Can't today, next week 🙏",at:-8},{side:"in",text:"Okay sweetheart ❤️",at:-7},{side:"in",text:"Sunday? ☕",at:-1,time:"Today 4:02 PM"}],
  typing:{text:"busy, sorry",t0:1.0,cps:12,send:2.3},thumb:thumbType(1.0,2.0,12)})});
add_(2.6,{w:t=>phoneShot(t,{dark:0,big:1,rot:3,dx:40,rim:"rimW",name:"Sammy ❤️",initial:"S",avatar:"#6f9fd6",bg:t=>kitchen(t,{season:"late",clock:4.1,date:19})+lampPend(1),
  msgs:[{side:"out",text:"Sunday? ☕",at:-9,time:"Today 4:02 PM"},{side:"in",text:"busy, sorry",at:-1}],typing:{text:"Ok ❤️",t0:.7,cps:4,send:2.1},thumb:thumbType(.7,1.9,4)})});
add_(2.6,calShot(19,"NOVEMBER",26,"NOVEMBER","late"));
add_(3.4,{cam:[[0,1140,650,3.3],[3.4,1150,645,3.45]],w:t=>{ const rc=eio(Pr(t,.4,1.3)), tk=eio(Pr(t,1.5,2.9)); const cx=1215-tk*60, cy=692-tk*170;
  const hw=[lerp(900,cx-46,rc), lerp(560,cy-34,rc)];
  return `<g filter="url(#blur6)">${kitchen(t,{season:"late",clock:4,date:26})}${lampPend(1)}${chairL()}${chairR()}</g>`+table(t,{cups:[{x:1060,k:1}]})+
   mug(cx,cy,.62,{band:"#6f9fd6"})+steam(cx,cy-50,.18,t,.5,2)+armHand([760,470],hw,.42,"rimW",1);}});
add_(3.6,{w:t=>phoneShot(t,{dark:0,big:1,rot:2,rim:"rimW",name:"Sammy ❤️",initial:"S",avatar:"#6f9fd6",bg:t=>kitchen(t,{season:"late",clock:4.1,date:26})+lampPend(1),
  msgs:[{side:"out",text:"Sunday? ☕",at:-9,time:"Sun 4:02 PM"},{side:"in",text:"busy, sorry",at:-9},{side:"out",text:"Ok ❤️",at:-9},{side:"out",text:"Sunday? ☕",at:-1,time:"Today 4:01 PM"}],read:{at:1.1,label:"Read 4:01 PM"}})});
add_(2.6,calShot(26,"NOVEMBER",3,"DECEMBER","winter"));
add_(6.2,{cam:[[0,960,540,1.0],[6.2,1030,580,1.14]],w:t=>{ const tk=1; return kitchen(t,{season:"winter",clock:4.05+t/3600*40,date:3,month:"DECEMBER"})+lampPend(1)+chairL()+chairR()+G_(TR.k4,t,0).s+table(t,{cups:[{x:1060,k:1}],ring:.8});}});
add_(5,{cam:[[0,1150,655,3.3],[5,1170,650,3.6]],fout:1.0,w:t=>`<g filter="url(#blur6)">${kitchen(t,{season:"winter",clock:4,date:3,month:"DECEMBER"})}${lampPend(1)}${chairL()}${chairR()}</g>`+table(t,{cups:[{x:1060,k:.9}],ring:1})});
add_(6,{card:t=>cardText(t,{lines:[{txt:"The days are long, but the years are short.",at:.5,sz:46,y:530},{txt:"— GRETCHEN RUBIN",at:1.3,sz:20,ls:4,c:"#8f8a82",y:600}],out:5.3})});
/* --- CH3: one cup --- */
add_(8.5,{fin:.7,cam:[[0,980,600,1.18],[8.5,930,640,1.4]],w:t=>{ const r=BOY(pose(TR.r2,t,1),"rimC"); const holding=t>6.9;
  let s=room(t,{eve:1,paused:t>5.6,phoneOnCouch:!holding,phoneLit:t>3.3&&t<4.3})+r.s; if(!holding) s+=controller(r.hb); else s+=`<rect x="${r.hf[0]-10}" y="${r.hf[1]-30}" width="22" height="40" rx="5" fill="#111318" stroke="#cfe4ff" stroke-width="2"/><ellipse cx="${r.hf[0]}" cy="${r.hf[1]-40}" rx="160" ry="120" fill="url(#phG)" opacity=".6"/>`; return s;}});
add_(10,{w:t=>phoneShot(t,{dark:1,name:"Grandma",initial:"G",avatar:"#b9773a",bg:t=>room(t,{eve:1,paused:1}),dy:t<2.2?0:0,
  lock:{until:2.0,time:"4:12",date:"Sunday, December 17"},
  msgs:[{side:"in",text:"Tea's ready ☕",at:-9,time:"Nov 12, 4:05 PM"},{side:"out",text:"Can't today, next week 🙏",at:-9},{side:"in",text:"Okay sweetheart ❤️",at:-9},
        {side:"in",text:"Sunday? ☕",at:-9,time:"Nov 19, 4:02 PM"},{side:"out",text:"busy, sorry",at:-9},{side:"in",text:"Ok ❤️",at:-9},
        {side:"in",text:"Sunday? ☕",at:-9,time:"Nov 26, 4:01 PM"}],
  scroll:t=>-(1-eio(Pr(t,2.4,5.0)))*360, read:{at:-1,label:""}}), ov:t=>typeEcho(t,5.6,9.8,960,1000,"She stopped asking.",{cps:13})});
add_(5,{cam:[[0,940,600,1.12],[5,900,600,1.12]],w:t=>{const r=BOY(pose(TR.r3,t,1),"rimC"); return room(t,{eve:1,paused:1})+r.s+`<rect x="${r.hf[0]-10}" y="${r.hf[1]-30}" width="22" height="40" rx="5" fill="#111318"/>`;}});
add_(6.5,{w:t=>{ const p=pose(TR.st,t,1); const cx=p.x+260; let s=`<g transform="${camT([cx,560,1.0])}">${street(t,cx)}${BOY(p,"rimC").s}`;
  for(let i=0;i<4;i++){const bt=(t+i*.55)%2.2; if(bt<1.2){const C=[p.x+52,p.y-160]; s+=`<circle cx="${C[0]+bt*60}" cy="${C[1]-bt*30}" r="${8+bt*22}" fill="#e8eef8" opacity="${.35*(1-bt/1.2)}" filter="url(#blur6)"/>`;}}
  return s+`</g>`;}, ov:t=>snowScreen(t,110), raw:1});
add_(7,{cam:[[0,960,560,1.05],[7,1000,580,1.15]],w:t=>{const r=BOY(pose(TR.dr,t,1),"rimC"); return frontDoor(t,{open:eio(Pr(t,5.3,6.6))})+r.s;}, ov:t=>snowScreen(t,80,.8)});
add_(14,{cam:[[0,960,540,1.0],[6,980,550,1.08],[14,1160,600,1.42]],w:t=>{const g=G_(TR.k5g,t,0); const b=B_(TR.k5b,t,1,"rimC");
  return kitchen(t,{season:"night",clock:4+12/60+t/3600*20,date:17,month:"DECEMBER",door:eio(Pr(t,.8,2.2)),doorLight:"#24314d"})+lampPend(.75)+chairL()+chairR()+g.s+`<g opacity="${Pr(t,1.3,2.0)}">${b.s}</g>`+table(t,{cups:[{x:1060,k:0}],ring:1});}});
add_(4.5,{cam:[[0,1080,650,3.6],[4.5,1075,655,3.9]],w:t=>{const tk=eio(Pr(t,.6,2.0)); const hw=[lerp(1300,1104,tk), lerp(600,650,tk)];
  return `<g filter="url(#blur6)">${kitchen(t,{season:"night",clock:4.2,date:17,month:"DECEMBER"})}${lampPend(.75)}${chairL()}${chairR()}${GRAN(Object.assign({},pose(TR.k5g,t,0))).s}</g>`+table(t,{cups:[{x:1060,k:0}],ring:1})+armHand([1340,610],hw,.5,"rimC",1);}});
add_(9,{cam:[[0,1110,610,1.7],[9,1110,620,1.85]],w:t=>kitchen(t,{season:"night",clock:4.3,date:17,month:"DECEMBER"})+lampPend(.75)+chairL()+chairR()+G_(TR.k6g,t+3,0).s+B_(TR.k6b,t,1,"rimC").s+table(t,{cups:[{x:1060,k:0}],ring:1}),
  ov:t=>typeEcho(t,2.0,8.6,960,150,"But she never stopped waiting.",{cps:13})});
/* --- CH4: two cups --- */
add_(5,{cam:[[0,440,560,3.0],[5,440,540,3.25]],w:t=>{const kn=eio(Pr(t,.9,1.4)); const fl=Pr(t,1.3,1.6);
  return kitchen(t,{season:"night",knob:kn,flame:fl,kSteam:Pr(t,2.2,4.8)*1.0,date:17,month:"DECEMBER"})+armHand([760,860],[lerp(640,500,eio(Pr(t,.2,.8))),lerp(760,652,eio(Pr(t,.2,.8)))],.5,"rimC",1);}});
add_(3.6,{cam:[[0,450,290,2.9],[3.6,450,285,3.05]],w:t=>{const op=eio(Pr(t,.2,.9)), rc=eio(Pr(t,1.0,1.8)), tk=eio(Pr(t,2.0,3.2)); const gone=t>2.0;
  const mx=lerp(488,640,tk), my=lerp(270,330,tk); let s=kitchen(t,{season:"night",cab:op,cabTaken:gone,date:17,month:"DECEMBER"});
  if(gone) s+=mug(mx,my,.42,{band:"#6f9fd6"});
  const hw=gone?[mx+34,my-30]:[lerp(700,522,rc),lerp(380,240,rc)];
  return s+(t>.7?armHand([780,520],hw,.42,"rimC",1):"");}});
add_(4.5,{cam:[[0,1140,650,3.3],[4.5,1140,640,3.6]],w:t=>`<g filter="url(#blur6)">${kitchen(t,{season:"night",clock:4.5,date:17,month:"DECEMBER"})}${lampPend(1)}${chairL()}${chairR()}</g>`+table(t,{cups:CUPS2(1,Math.min(1,.2+t*.4)),ring:0})});
add_(11,{cam:[[0,1110,600,1.7],[11,1110,615,1.9]],w:t=>{const g=G_(TR.k7g,t,0), b=B_(TR.k7b,t,1,"rimW");
  return kitchen(t,{season:"night",clock:4.6,date:17,month:"DECEMBER"})+lampPend(1)+chairL()+chairR()+g.s+b.s+table(t,{cups:CUPS2(1,1)})+sayW(t,3.0,5.9,g.C[0]+10,g.C[1]-95,"You came.")+sayW(t,5.9,9.2,b.C[0]-10,b.C[1]-95,"Every Sunday.");}});
add_(6,{w:t=>phoneShot(t,{dark:1,name:"",bg:t=>kitchen(t,{season:"night",clock:4.6,date:17})+lampPend(1),rim:"rimW",cal:{title:"Grandma ☕",t0:.6,rep:2.6,add:4.2},
  tap:t=>t<.2?null:t<1.6?[-60,-250+(t>.4&&t<.55?8:0)]:t<3.0?[100,-20+(t>2.45&&t<2.6?8:0)]:t<4.7?[150,-310+(t>4.05&&t<4.2?8:0)]:null})});
add_(9,{cam:[[0,1110,600,1.35],[9,960,540,1.0]],fout:1.4,w:t=>{const lg=Pr(t,2,2.4)*(1-Pr(t,3.8,4.3)); const g=GRAN(Object.assign(pose(TR.k8g,t,0),{bob:-Math.abs(Math.sin(t*9))*4*lg})); g.s=g.s; const b=B_(TR.k8b,t,1,"rimW");
  return kitchen(t,{season:"spring",clock:4.1,date:14,month:"APRIL"})+lampPend(.8)+chairL()+chairR()+g.s+b.s+table(t,{cups:CUPS2(1,1)})+sayW(t,.8,3.2,b.C[0]-10,b.C[1]-95,"Same time next week?")+sayW(t,3.4,6.0,g.C[0]+10,g.C[1]-95,"Always.");}});
add_(5,{card:t=>cardText(t,{lines:[{txt:"They won't ask forever.",at:.6,it:1,sz:50,y:552}],out:4.4})});
add_(7,{card:t=>cardText(t,{lines:[{txt:"TWO CUPS",at:.8,fi:1.6,sz:96,ls:22,y:540,w:500},{txt:"Show up while the tea is still warm.",at:1.8,fi:1.2,sz:30,it:1,c:"#bdb7ad",y:610}],out:6.4})});
const DUR=T0;

/* notification widget floating near phone */
function notif(t,a,b,x,y,who,txt){ if(t<a||t>b) return ""; const p=eob(Pr(t,a,a+.35)), op=Math.min(1,Pr(t,a,a+.2))*(1-Pr(t,b-.3,b));
  return `<g opacity="${op}" transform="translate(${x} ${y}) scale(${p})"><rect x="-10" y="-46" width="340" height="86" rx="20" fill="#1d2230" opacity=".92"/><rect x="6" y="-30" width="54" height="54" rx="14" fill="#3fc75a"/><path d="M20 -8 h26 a6 6 0 0 1 6 6 v10 a6 6 0 0 1 -6 6 h-14 l-8 7 v-7 h-4 a6 6 0 0 1 -6 -6 v-10 a6 6 0 0 1 6 -6 z" fill="#fff"/><text x="74" y="-8" font-family="${SANS}" font-weight="700" font-size="20" fill="#fff">${who}</text><text x="74" y="22" font-family="${SANS}" font-size="20" fill="#d6dae4">${txt}</text></g>`;}

function render(t){
  let S=SH.find(s=>t>=s.a&&t<s.b)||SH[SH.length-1]; const lt=t-S.a; let out="";
  if(S.card) out=S.card(lt);
  else if(S.raw) out=S.w(lt);
  else if(S.cam){ const c=camAt(S.cam,lt); CZ=c[2]; out=`<g transform="${camT(c)}">${S.w(lt)}</g>`; }
  else out=S.w(lt);
  if(S.ov) out+=S.ov(lt);
  document.getElementById('w').innerHTML=out;
  let fo=0; if(S.fin) fo=Math.max(fo,1-Pr(lt,0,S.fin)); if(S.fout) fo=Math.max(fo,Pr(lt,S.b-S.a-S.fout,S.b-S.a));
  document.getElementById('fadeL').style.opacity=fo;
  document.getElementById('vig').style.opacity=S.card?0:1; document.getElementById('grain').style.opacity=S.card?.04:.07;
}
