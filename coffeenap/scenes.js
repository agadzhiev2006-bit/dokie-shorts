/* ===== COFFEE vs NAP ===== */
const COF="#e8790f", NAP="#2563eb", COFL="#ffcf8f", NAPL="#a9c6ff", BRN="#5a3210";
const AC=COF, GRN=COF;
const BG=(c)=>`<rect x="-400" y="-400" width="1880" height="2800" fill="${c}"/>`;
/* split background: left coffee, right nap */
const SPLIT=(k=1)=>`<path d="M-400,-400 L${540+60*k},-400 L${540-60*k},2400 L-400,2400 Z" fill="${COFL}"/><path d="M${540+60*k},-400 L1480,-400 L1480,2400 L${540-60*k},2400 Z" fill="${NAPL}"/>
 <path d="M${540+60*k},-400 L${540-60*k},2400" stroke="${INK}" stroke-width="14"/>`;
function mug(t,steam=1){
  let s=`<path d="M80,-30 Q140,-30 140,14 Q140,58 74,58" fill="none" stroke="${INK}" stroke-width="18" stroke-linecap="round"/>
  <path d="M-84,-74 L84,-74 L70,92 Q68,108 52,108 L-52,108 Q-68,108 -70,92 Z" fill="#fff" stroke="${INK}" stroke-width="12" stroke-linejoin="round"/>
  <rect x="-76" y="2" width="152" height="40" fill="${COF}"/>
  <path d="M-84,-74 L84,-74 L70,92 Q68,108 52,108 L-52,108 Q-68,108 -70,92 Z" fill="none" stroke="${INK}" stroke-width="12" stroke-linejoin="round"/>
  <ellipse cx="0" cy="-74" rx="84" ry="18" fill="${BRN}" stroke="${INK}" stroke-width="10"/>`;
  for(let i=0;i<3;i++){const k=((t*.9+i/3)%1), x=-40+i*40, w=Math.sin(t*5+i)*10;
    s+=`<path d="M${x},${-100-k*60} q${12+w},-22 0,-44 q${-12-w},-22 0,-44" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round" opacity="${steam*Math.sin(k*Math.PI)}"/>`;}
  return s;}
function pillow(t){
  let s=`<path d="M-140,-74 Q0,-104 140,-74 Q172,0 140,74 Q0,104 -140,74 Q-172,0 -140,-74 Z" fill="${NAP}" stroke="${INK}" stroke-width="12" stroke-linejoin="round"/>
  <path d="M-110,-50 Q0,-70 110,-50 M-110,50 Q0,70 110,50" stroke="#fff" stroke-width="6" fill="none" opacity=".5" stroke-linecap="round"/>`;
  for(let i=0;i<3;i++){const k=((t*.7+i/3)%1);
    s+=TXT(90+k*70,-110-k*130,"Z",50+i*16,{w:800,c:INK,op:Math.sin(k*Math.PI)});}
  return s;}
const bolt=(c=COF)=>`<path d="M-18,-96 L46,-96 L12,-14 L56,-14 L-30,104 L-4,14 L-50,14 Z" fill="${c}" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>`;
function trophy(inner="?",fill=INK){
  return `<path d="M-92,-80 Q-150,-80 -140,-20 Q-130,30 -70,40" fill="none" stroke="${INK}" stroke-width="18"/><path d="M92,-80 Q150,-80 140,-20 Q130,30 70,40" fill="none" stroke="${INK}" stroke-width="18"/>
  <path d="M-100,-120 L100,-120 L88,-10 Q76,70 0,80 Q-76,70 -88,-10 Z" fill="${fill}" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>
  <rect x="-18" y="78" width="36" height="50" fill="${INK}"/><rect x="-80" y="126" width="160" height="40" rx="10" fill="${INK}"/>
  ${TXT(0,40,inner,150,{w:800,c:"#fff",serif:1})}`;}
function ring(p,c,txt,sub,r=150){const C=2*Math.PI*r;
  return `<circle r="${r}" fill="#fff" stroke="${INK}" stroke-width="12" filter="url(#ds)"/>
  <circle r="${r-26}" fill="none" stroke="${c}" stroke-width="34" stroke-dasharray="${C}" stroke-dashoffset="${(C*(1-clamp(p))).toFixed(1)}" transform="rotate(-90)"/>
  ${TXT(0,26,txt,96,{w:800})}${TXT(0,82,sub,34,{w:700,c:GR,ls:4})}`;}
const lab=(txt,c,w,sz=46)=>`<rect x="${-w/2}" y="-46" width="${w}" height="92" rx="46" fill="${c}" stroke="${INK}" stroke-width="8" filter="url(#ds)"/>${TXT(0,16,txt,sz,{c:"#fff",w:800,ls:3})}`;
const card2=(c,h=400)=>`<rect x="-460" y="${-h/2}" width="920" height="${h}" rx="50" fill="#fff" stroke="${INK}" stroke-width="10" filter="url(#ds)"/>`;
/* adenosine blob + receptor */
const ADN=(x,y,s=1,op=1)=>`<g transform="translate(${x} ${y}) scale(${s})" opacity="${op}"><path d="M0,-26 L25,-8 L16,22 L-16,22 L-25,-8 Z" fill="#8b8c90" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`;
const CAF=(x,y,s=1)=>`<circle cx="${x}" cy="${y}" r="${22*s}" fill="${COF}" stroke="${INK}" stroke-width="6"/>`;

/* hook composition used at start AND end (loop) */
function hookComp(t,t0){
  const q=t-t0; let s=SPLIT(1);
  s+=`<rect x="70" y="180" width="940" height="${q<0?0:250}" rx="40" fill="#fff" opacity=".92"/>`;
  s+=G(270,600,1.25*(1+.04*Math.sin(t*3)),mug(t),{r:-6+Math.sin(t*2)*3});
  s+=G(810,610,1.25*(1+.04*Math.sin(t*3+1)),pillow(t),{r:6+Math.sin(t*2+1)*3});
  s+=G(540,600,1+.08*Math.sin(t*6),`<circle r="78" fill="${INK}" stroke="#fff" stroke-width="10"/>${TXT(0,26,"VS",72,{c:"#fff",w:800})}`);
  s+=G(540,815,1,`<rect x="-330" y="-46" width="660" height="92" rx="46" fill="${INK}"/>${TXT(0,17,"SCIENCE PICKED A WINNER",44,{c:"#fff",w:800,ls:2})}`);
  return s;}

const SC=[];
/* 1 HOOK — full frame at 0 */
SC.push({a:0,b:3.35,tin:"none",tout:"zoom",f:t=>{
  const settle=lerp(1.18,1,eo(Pr(t,0,.45)));
  let s=`<g transform="translate(540 700) scale(${settle}) translate(-540 -700)">${hookComp(t,0)}</g>`;
  if(t>1.55){ // trophy with ? drops in centre
    const q=eob(Pr(t,1.6,1.95)); s+=G(540,560-(1-q)*500,.75*q,trophy("?"),{r:Math.sin(t*8)*5});}
  return s;}});
/* 2 not who you think */
SC.push({a:3.3,b:5.35,tin:"zoom",tout:"whip",f:t=>{
  let s=BG("#fff")+SPLIT(.3);
  s+=G(540,560,1.1*pop(t,3.35),trophy("?"),{r:Math.sin(t*10)*6});
  s+=G(250,520,.8*pop(t,3.6),mug(t),{r:-12});
  s+=G(830,520,.8*pop(t,3.7),pillow(t),{r:12});
  [[180,800,3.84],[900,780,4.0],[380,330,4.4],[720,320,4.5]].forEach(([x,y,t0],i)=>{s+=G(x,y,pop(t,t0,.3),TXT(0,40,"?",150,{serif:1,w:700,c:i%2?NAP:COF}),{r:(i%2?12:-12)});});
  s+=G(540,850,pop(t,3.84),TXT(0,0,"NOT",110,{w:800,c:INK,ls:6}));
  return s;}});
/* 3 TEAM COFFEE */
SC.push({a:5.3,b:10.35,tin:"whip",tout:"up",f:t=>{
  let s=BG(COFL);
  const o=eio(Pr(t,6.5,6.8)); // mug slides up-left when molecule part starts
  s+=G(lerp(600,250,o),lerp(640,470,o),lerp(1.5,.7,o)*pop(t,5.36),mug(t),{r:-4});
  s+=G(lerp(600,250,o),lerp(900,620,o),lerp(1,.62,o)*pop(t,5.6),lab("TEAM COFFEE",COF,440));
  if(t>6.6){ // brain with receptors
    const bq=pop(t,6.64);
    s+=G(650,640,1.15*bq,brain(1));
    const R=[[-100,-90],[80,-110],[150,10],[-140,30]];
    R.forEach(([x,y],i)=>{ s+=G(650+x*1.15,640+y*1.15,bq,`<path d="M-30,0 A30 30 0 0 1 30,0" fill="#fff" stroke="${INK}" stroke-width="8"/>`);});
    // caffeine flies from mug to receptors
    R.forEach(([x,y],i)=>{const t0=6.8+i*.12, k=eio(Pr(t,t0,t0+.45)); if(t<t0) return;
      const sx=330,sy=420, tx=650+x*1.15, ty=640+y*1.15-14; s+=CAF(lerp(sx,tx,k),lerp(sy,ty,k)-Math.sin(k*Math.PI)*120,1);});
    // adenosine bounces off
    if(t>7.68){R.forEach(([x,y],i)=>{const k=Pr(t,7.7+i*.08,8.5+i*.08);
      const tx=650+x*1.15, ty=640+y*1.15; s+=ADN(tx+(x>0?1:-1)*(40+k*160), ty-90+k*(k*300-180),1,1-clamp((k-.8)*5));});
      s+=G(650,930,pop(t,7.72),lab("BLOCKED",INK,330),{r:-6});}
    if(t>8.4) s+=G(870,380,pop(t,8.56),`${ADN(0,0,2.2)}${TXT(0,90,"adenosine",36,{w:700})}${TXT(0,128,"= sleepy signal",30,{w:600,c:GR})}`);
    if(t>9.4){const q=pop(t,9.44); s+=G(330,860,q,`${TXT(0,0,"Zzz",90,{w:800,c:"#8b8c90"})}`)+X2(330,830,70,Pr(t,9.6,9.75),Pr(t,9.7,9.85),18);}
  }
  return s;}});
/* 4 20 minutes to kick in */
SC.push({a:10.3,b:13.15,tin:"up",tout:"iris",f:t=>{
  let s=BG("#fff");
  const p=eo(Pr(t,10.45,12.3)), m=Math.round(20*p);
  s+=G(620,620,1.5*pop(t,10.4),ring(p,COF,m,"MINUTES"));
  s+=G(300,420,.55*pop(t,10.6),mug(t),{r:-10});
  if(t>11.3) s+=G(620,950,pop(t,11.36),TXT(0,0,"~20 min",90,{serif:1,w:700,c:COF}));
  if(t>12.1){const q=pop(t,12.16); s+=G(880,380,q*1.1,bolt(),{r:Math.sin(t*20)*6}); }
  return s;}});
/* 5 TEAM NAP */
SC.push({a:13.1,b:17.15,tin:"iris",tout:"whip",f:t=>{
  let s=BG(NAPL);
  const o=eio(Pr(t,14.3,14.6));
  s+=G(lerp(560,830,o),lerp(640,420,o),lerp(1.5,.7,o)*pop(t,13.2),pillow(t));
  s+=G(lerp(560,830,o),lerp(900,580,o),lerp(1,.62,o)*pop(t,13.5),lab("TEAM NAP",NAP,380));
  if(t>14.3){const bq=pop(t,14.4);
    s+=G(560,700,1.2*bq,brain(1));
    // adenosine sitting on brain, then swept out
    for(let i=0;i<7;i++){const bx=560+(hash(i)-.5)*300, by=700+(hash(i+9)-.5)*200, k=eio(Pr(t,15.6+i*.07,16.4+i*.07));
      s+=ADN(bx+k*(500+i*30),by-k*(200+hash(i)*200),1.1*bq,1-clamp((k-.7)*4));}
    if(t>15.5){const sw=Math.sin((t-15.5)*9)*30; s+=G(380,820,pop(t,15.52),`<g transform="rotate(${-30+sw})"><rect x="-10" y="-200" width="20" height="200" rx="10" fill="${INK}"/><path d="M-60,0 L60,0 L80,90 L-80,90 Z" fill="${NAP}" stroke="${INK}" stroke-width="8"/></g>`);}
    if(t>16.5){s+=G(560,960,pop(t,16.56),lab("CLEARED",NAP,340));
      for(let i=0;i<4;i++) s+=sparkle(420+i*90,520+(i%2)*90,pop(t,16.6+i*.06)*1.2);}
  }
  return s;}});
/* 6 past 20 min -> groggy */
SC.push({a:17.1,b:20.45,tin:"whip",tout:"drop",f:t=>{
  let s=BG("#fff");
  const p=eo(Pr(t,17.3,18.7))*1.3, m=Math.round(30*Math.min(p,1.3)/1.0);
  const C=2*Math.PI*124;
  s+=G(500,600,1.4*pop(t,17.2),ring(Math.min(p,1),NAP,Math.round(Math.min(p,1.3)*20)+(p>1?"+":""),"MINUTES")+
     (p>1?`<circle r="124" fill="none" stroke="#d6312a" stroke-width="34" stroke-dasharray="${(C*(p-1)).toFixed(1)} ${C}" transform="rotate(-90)" />`:""));
  if(t>18.0) s+=G(820,330,pop(t,18.0),lab("TOO LONG",INK,320,40),{r:8});
  if(t>19.5){const q=pop(t,19.6), wob=Math.sin(t*7)*10;
    s+=`<rect x="-400" y="-400" width="1880" height="2800" fill="#fff" opacity="${clamp((t-19.55)*6)*.85}"/>`;
    s+=G(540,600,q*1.2,`<g transform="rotate(${wob})">${[0,1,2].map(i=>`<path d="M0,0 m-${30+i*40},0 a${30+i*40},${30+i*40} 0 1,1 ${60+i*80},0" fill="none" stroke="${NAP}" stroke-width="12" stroke-linecap="round" transform="rotate(${t*200+i*60})"/>`).join("")}</g>`);
    s+=G(540,900,q,`<g transform="skewX(${wob})">${TXT(0,0,"GROGGY",130,{w:800,ls:6})}</g>`);}
  return s;}});
/* 7 driving study */
SC.push({a:20.4,b:24.55,tin:"drop",tout:"zoom",f:t=>{
  let s=BG("#f2f1ec");
  // road
  s+=`<path d="M420,330 L660,330 L1000,1150 L80,1150 Z" fill="#55565b"/>`;
  for(let i=0;i<6;i++){const k=((t*1.6+i/6)%1), y=330+k*k*820, w=4+k*22, h=12+k*80;
    s+=`<rect x="${540-w/2}" y="${y}" width="${w}" height="${h}" fill="#fff"/>`;}
  const wh=pop(t,20.64), rot=Math.sin(t*2.4)*14;
  s+=G(540,980,1.05*wh,`<g transform="rotate(${rot})"><circle r="150" fill="none" stroke="${INK}" stroke-width="34"/><circle r="40" fill="${INK}"/><path d="M-140,0 L140,0 M0,0 L0,140" stroke="${INK}" stroke-width="26"/></g>`);
  if(t>21.2) s+=G(830,420,pop(t,21.28),lab("STUDY",INK,250,40),{r:6});
  if(t>22.4){const q=pop(t,22.44); s+=`<rect x="-400" y="-400" width="1880" height="2800" fill="#fff" opacity="${clamp((t-22.4)*6)*.9}"/>`;
    s+=G(540,560,q*.95,ICR.clip+`${[0,1,2].map(i=>`<rect x="-70" y="${-80+i*60}" width="${120-i*20}" height="18" rx="9" fill="#c9c9cc"/>`).join("")}`);}
  if(t>23.1){const k=eob(Pr(t,23.2,23.55));
    s+=G(lerp(-200,250,k),620,.9,mug(t),{r:-10}); s+=G(lerp(1300,830,k),620,.9,pillow(t),{r:10});
    s+=G(540,880,pop(t,23.48),`<circle r="70" fill="${INK}"/>${TXT(0,24,"VS",64,{c:"#fff",w:800})}`);}
  return s;}});
/* 8 scoreboard */
SC.push({a:24.5,b:28.45,tin:"zoom",tout:"spin",f:t=>{
  let s=BG("#fff");
  const base=1080, H=480;
  const b1=eo(Pr(t,24.64,25.6)), b2=eo(Pr(t,26.64,27.6));
  s+=`<path d="M120,${base} L960,${base}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>`;
  s+=`<rect x="200" y="${base-H*.62*b1}" width="240" height="${H*.62*b1}" rx="18" fill="${COF}" stroke="${INK}" stroke-width="8"/>`;
  s+=`<rect x="640" y="${base-H*.62*b2}" width="240" height="${H*.62*b2}" rx="18" fill="${NAP}" stroke="${INK}" stroke-width="8"/>`;
  s+=G(320,base+90,pop(t,24.64)*.42,mug(t,0)); s+=G(760,base+90,pop(t,26.64)*.42,pillow(t));
  if(t>25.8) s+=G(320,base-H*.62-80,pop(t,25.84),lab("BETTER ✓",COF,300,40));
  if(t>27.7) s+=G(760,base-H*.62-80,pop(t,27.76),lab("BETTER ✓",NAP,300,40));
  return s;}});
/* 9 the winner was... (spotlight drumroll) */
SC.push({a:28.4,b:30.32,tin:"spin",tout:"none",f:t=>{
  let s=BG("#fff");
  const sh=Math.sin(t*40)*(4+8*Pr(t,28.6,30.2));
  s+=G(540+sh,600,1.25*pop(t,28.5),trophy("?"),{r:sh*.6});
  s+=`<circle cx="540" cy="600" r="${lerp(420,280,Pr(t,28.5,30.2))}" fill="none" stroke="rgba(11,11,13,.82)" stroke-width="2600"/>`;
  [0,1,2].forEach(i=>{s+=G(380+i*160,900,pop(t,29.2+i*.25,.25),`<circle r="18" fill="#fff"/>`);});
  return s;}});
/* 10 BOTH */
SC.push({a:30.3,b:33.95,tin:"none",tout:"whip",f:t=>{
  let s=SPLIT(eo(Pr(t,30.32,30.7))*0+1);
  const q=eob(Pr(t,30.32,30.6)), o=eio(Pr(t,30.95,31.25));
  // gold trophy with both icons
  s+=G(540,560-o*170,(1.25-o*.6)*q,trophy("",`url(#bothG)`),{r:Math.sin(t*3)*4});
  s+=`<defs><linearGradient id="bothG" x1="0" x2="1"><stop offset=".5" stop-color="${COF}"/><stop offset=".5" stop-color="${NAP}"/></linearGradient></defs>`;
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2+t*.4, k=Pr(t,30.32,31.0), r=180+k*240;
    s+=sparkle(540+Math.cos(a)*r,(560-o*170)+Math.sin(a)*r*.8,(1-Pr(t,30.9,31.3))*1.4);}
  if(t<31.2) s+=G(540,880,q,TXT(0,0,"BOTH",190,{w:800,c:"#fff",ls:10})+TXT(0,0,"BOTH",190,{w:800,c:"none",ls:10}).replace('fill="none"',`fill="none" stroke="${INK}" stroke-width="6"`),{op:1-o});
  if(t>31.0){ // step 1 coffee
    const a1=pop(t,31.04); s+=G(300,760,a1,`${card2("#fff",0)}`)+G(300,700,a1*.9,mug(t))+G(300,900,a1,lab("1  COFFEE",COF,330,40));}
  if(t>32.0){const a2=pop(t,32.08); s+=G(790,700,a2*.9,pillow(t))+G(790,900,a2,lab("2  NAP",NAP,270,40));
    s+=G(545,740,pop(t,32.2),TXT(0,30,"→",110,{w:800}));}
  if(t>32.7) s+=G(790,1050,pop(t,32.8),TXT(0,0,"15 min",84,{serif:1,w:700,c:NAP}));
  return s;}});
/* 11 wake up right as it hits — timeline */
SC.push({a:33.9,b:36.0,tin:"whip",tout:"zoom",f:t=>{
  let s=BG("#fff");
  const X0=110,X1=950,Y=640, k=eo(Pr(t,33.95,35.1)), X=m=>X0+(X1-X0)*m/22;
  s+=`<rect x="${X0}" y="${Y-30}" width="${X(15)-X0}" height="60" rx="30" fill="${NAP}" stroke="${INK}" stroke-width="8"/>`;
  s+=TXT((X0+X(15))/2,Y+14,"NAP",40,{c:"#fff",w:800,ls:4});
  s+=`<path d="M${X0},${Y+80} L${X1},${Y+80}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`;
  [0,15,20].forEach(m=>{s+=`<path d="M${X(m)},${Y+64} L${X(m)},${Y+96}" stroke="${INK}" stroke-width="8"/>`+TXT(X(m),Y+150,m+"m",38,{w:700,c:GR});});
  const hx=X(Math.min(22*k,17));
  s+=`<path d="M${hx},${Y-90} L${hx},${Y+96}" stroke="${INK}" stroke-width="8"/><circle cx="${hx}" cy="${Y-100}" r="18" fill="${INK}"/>`;
  s+=G(X(18),Y-210,pop(t,34.5)*.9,bolt(),{r:Math.sin(t*18)*6});
  s+=G(X(18),Y-360,pop(t,34.6),lab("CAFFEINE HITS",COF,420,38));
  if(t>35.0){const r=Math.sin(t*50)*10; s+=G(300,400,pop(t,35.12),`<g transform="rotate(${r})"><circle r="80" fill="#fff" stroke="${INK}" stroke-width="12"/><circle cx="-60" cy="-70" r="26" fill="${INK}"/><circle cx="60" cy="-70" r="26" fill="${INK}"/><path d="M0,0 L0,-46 M0,0 L30,10" stroke="${INK}" stroke-width="10" stroke-linecap="round"/></g>`);
    s+=G(300,550,pop(t,35.2),TXT(0,0,"AWAKE",64,{w:800,c:COF,ls:4}));}
  return s;}});
/* 12 loop back to hook */
SC.push({a:35.95,b:40,tin:"zoom",tout:"none",f:t=>{
  let s=hookComp(t,35.95);
  return s;}});

const BEATS=[0,1.6,3.36,3.84,5.36,6.64,7.68,8.56,9.44,10.4,11.36,12.16,13.2,14.4,15.52,16.56,17.2,18.0,19.6,20.64,21.28,22.44,23.2,24.64,25.84,26.64,27.76,28.56,30.32,31.04,32.08,32.8,34.0,34.5,35.12,36.0,37.2,38.16];
const KEYS=[[0,"shrug"],[1.6,"pointUp"],[3.36,"wag"],[5.36,"point"],[6.64,"explain"],[7.68,"fist"],[8.44,"present"],[9.44,"sad"],[10.4,"walk"],[11.36,"explain"],[12.16,"thumb"],
[13.2,"present"],[14.4,"explain"],[15.52,"fist"],[16.56,"thumb"],[17.2,"wag"],[18.6,"explain"],[19.6,"sad"],[20.64,"explain"],[22.44,"think"],[23.2,"fist"],
[24.64,"point"],[25.84,"thumb"],[26.64,"point"],[27.76,"thumb"],[28.56,"think"],[29.2,"pointUp"],[30.32,"stop"],[31.04,"explain"],[32.08,"point"],[33.28,"thumb"],
[34.0,"explain"],[35.12,"fist"],[36.0,"think"],[37.2,"shrug"]];
/* CAM: [t, x, feetY, scale] */
const CAM=[[0,540,1900,1.0],[3.2,540,1900,1.0],[3.6,540,1830,.82],[5.2,540,1830,.82],[5.6,250,1680,.56],[10.2,250,1680,.56],[10.6,870,1660,.5],[13.0,870,1660,.5],
[13.4,250,1680,.56],[17.0,250,1680,.56],[17.4,850,1680,.56],[20.3,850,1680,.56],[20.7,190,1700,.46],[24.4,190,1700,.46],[24.8,540,1720,.42],[28.3,540,1720,.42],
[28.7,540,1880,.85],[30.2,540,1880,.85],[30.5,540,1700,.5],[33.8,540,1700,.5],[34.2,820,1680,.55],[35.8,820,1680,.55],[36.2,540,1900,1.0],[99,540,1900,1.0]];
const SHAKE=[[0,.35,16],[7.68,.25,8],[19.6,.4,14],[23.2,.3,10],[30.32,.45,18],[35.12,.3,10]];
const FLASH=[[5.3,.2],[13.12,.2],[30.3,.3],[35.98,.2]];
