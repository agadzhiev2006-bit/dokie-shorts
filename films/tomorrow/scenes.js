/* ====== I SAID "TOMORROW" 1,000 TIMES — 16:9 film ====== */
const WW=1920, HH=1080;
const placeF=(x,y,sc,inner,dir=1,rot=0)=>`<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc*dir} ${sc}) translate(-540 -1150)">${inner}</g>`;
const toWF=(p,x,y,sc,dir=1)=>[x+(p[0]-540)*sc*dir,y+(p[1]-1150)*sc];
/* native shoulder for IK targets */
function Snat(P){const hip=[540+(P.hipx||0),1150+(P.bob||0)];const T=add(hip,[Math.sin(P.lean*D)*215,-Math.cos(P.lean*D)*215]);return add(T,[0,26]);}
const tgt=(P,w,x,y,sc,dir=1)=>{const S=Snat(P);return [540+(w[0]-x)/(sc*dir)-S[0],1150+(w[1]-y)/sc-S[1]];};
const fade=(t,a,b,e=.4)=>clamp(Math.min((t-a)/e,(b-t)/e));
const Ser="Caladea,Georgia,serif";

/* ---------- cast helpers ---------- */
/* age overlay: stubble, grey hair, eye bags */
function ageFX(C,sc,age){ if(age<=0) return ""; const r=150*sc; let s="";
  for(let i=0;i<46;i++){const a=hash(i*3.1)*1.6-.2, d=.55+hash(i*7.7)*.38; const x=C[0]+Math.cos(a)*r*d+r*.12, y=C[1]+Math.sin(a)*r*d*.9+r*.18;
    s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.6+hash(i)*1.4)*sc*2.2}" fill="#d9d9d9" opacity="${(.85*age).toFixed(2)}"/>`;}
  for(let i=0;i<7;i++){const a=-2.6+i*.32, x=C[0]+Math.cos(a)*r*.98, y=C[1]+Math.sin(a)*r*.98;
    s+=`<path d="M${x.toFixed(1)},${y.toFixed(1)} q${(6+hash(i)*10)*sc*2},${-(14+hash(i+1)*12)*sc*2} ${(16+hash(i+2)*8)*sc*2},${-(4)*sc*2}" stroke="#e6e6e6" stroke-width="${5*sc*2}" fill="none" stroke-linecap="round" opacity="${age.toFixed(2)}"/>`;}
  s+=`<path d="M${C[0]-r*.22},${C[1]+r*.12} q${r*.2},${r*.12} ${r*.4},0 M${C[0]+r*.42},${C[1]+r*.1} q${r*.18},${r*.1} ${r*.34},-4" stroke="#bdbdbd" stroke-width="${4*sc*2}" fill="none" opacity="${(.8*age).toFixed(2)}"/>`;
  return s;}
function guitar(x,y,s=1,r=0,dust=0,broken=0){
  return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
   <rect x="-12" y="-330" width="24" height="250" rx="6" fill="#5a3a22" stroke="#0b0b0d" stroke-width="4"/>
   <rect x="-20" y="-380" width="40" height="60" rx="10" fill="#3b2614" stroke="#0b0b0d" stroke-width="4"/>
   ${[0,1,2,3,4,5].map(i=>`<rect x="-14" y="${-300+i*34}" width="28" height="3" fill="#c9cdd2"/>`).join("")}
   <path d="M0,-90 C-80,-90 -90,-20 -60,10 C-110,50 -100,150 0,150 C100,150 110,50 60,10 C90,-20 80,-90 0,-90 Z" fill="#d98c3a" stroke="#0b0b0d" stroke-width="5"/>
   <path d="M0,-80 C-66,-80 -76,-22 -50,6 C-92,46 -84,136 0,136 C84,136 92,46 50,6 C76,-22 66,-80 0,-80 Z" fill="#e8a24c"/>
   <circle cy="10" r="30" fill="#2a1a10"/><rect x="-36" y="78" width="72" height="16" rx="5" fill="#3b2614"/>
   ${broken?`<path d="M-4,-330 L-4,10 M4,-330 L4,10" stroke="#e8e8e8" stroke-width="2"/><path d="M8,-120 q40,30 20,90" stroke="#e8e8e8" stroke-width="2" fill="none"/>`:[-6,-2,2,6].map(dx=>`<path d="M${dx},-330 L${dx},86" stroke="#e8e8e8" stroke-width="1.6"/>`).join("")}
   ${dust>0?`<path d="M0,-90 C-80,-90 -90,-20 -60,10 C-110,50 -100,150 0,150 C100,150 110,50 60,10 C90,-20 80,-90 0,-90 Z" fill="#b9ad9a" opacity="${dust*.55}"/>`:""}
  </g>`;}
function phoneBig(cx,cy,s,screen){return `<g transform="translate(${cx} ${cy}) scale(${s})"><rect x="-210" y="-410" width="420" height="820" rx="56" fill="#111" stroke="#2c2c30" stroke-width="10"/><rect x="-186" y="-380" width="372" height="760" rx="36" fill="#0b0f1c"/><rect x="-50" y="-372" width="100" height="22" rx="11" fill="#000"/>${screen}</g>`;}
function heart(x,y,s,op=1,c="#ff3b5c"){return `<path transform="translate(${x} ${y}) scale(${s})" d="M0,30 C-50,-5 -40,-45 -12,-40 C0,-38 0,-28 0,-22 C0,-28 0,-38 12,-40 C40,-45 50,-5 0,30 Z" fill="${c}" opacity="${op}"/>`;}

/* ---------- the room ---------- */
const NOTES=[]; for(let i=0,j=0;NOTES.length<190&&j<2000;j++){ // spread from board outward, skip clock+calendar
  const a=hash(j*1.7)*6.283, d=Math.pow(NOTES.length/190,.75)*1100, x=clamp(1300+Math.cos(a)*d*1.15,30,1890), y=clamp(430+Math.sin(a)*d*.62,30,790);
  if(x>620&&x<1080&&y<360) continue; NOTES.push([x,y,(hash(j*2.3)-.5)*24]);}
function note(x,y,r,s=1,txt="tomorrow",col="#f7d046"){return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><rect x="-40" y="-40" width="80" height="80" fill="${col}" filter="url(#nsh)"/><rect x="-40" y="-40" width="80" height="14" fill="rgba(0,0,0,.06)"/>${T_(0,8,txt,txt.length>9?12:15,{c:"#3a2a10",f:Ser,it:1,w:700})}</g>`;}
const SKY={night:["#0b1030","#1d2556"],morning:["#6d8fd6","#ffd1a1"],day:["#58a6f0","#cfeaff"],sunrise:["#f2995e","#ffe2a8"],dusk:["#3a2f6b","#e98a6b"]};
function room(t,o){
  o=Object.assign({time:"night",season:0,dust:0,notes:0,slap:-1,plant:1,cob:0,goals:0,checks:0,faded:0,clock:[23,47],cal:"1",fresh:0,today:0,bed:0},o);
  const night=o.time==="night", sk=SKY[o.time];
  let s=`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sk[0]}"/><stop offset="1" stop-color="${sk[1]}"/></linearGradient></defs>`;
  const wall=night?"#272a44":o.time==="sunrise"?"#e8c9a2":"#d8c8ae";
  s+=`<rect width="${WW}" height="${HH}" fill="${wall}"/><rect y="820" width="${WW}" height="260" fill="${night?"#3a2a22":"#8a5f42"}"/>`;
  for(let i=0;i<5;i++) s+=`<path d="M0,${850+i*52} L${WW},${850+i*52}" stroke="rgba(0,0,0,.18)" stroke-width="3"/>`;
  s+=`<rect y="806" width="${WW}" height="16" fill="${night?"#1d1e30":"#b9a588"}"/>`;
  /* window */
  s+=`<rect x="130" y="140" width="400" height="430" rx="6" fill="url(#sky)"/>`;
  if(night){for(let i=0;i<18;i++) s+=`<circle cx="${150+hash(i)*360}" cy="${160+hash(i+9)*200}" r="${1.5+hash(i+3)*2}" fill="#fff" opacity="${.5+.5*Math.sin(t*2+i)}"/>`; s+=`<circle cx="440" cy="220" r="34" fill="#f3efd6"/><circle cx="456" cy="210" r="30" fill="${sk[0]}"/>`;}
  else s+=`<circle cx="${o.time==="sunrise"?330:440}" cy="${o.time==="sunrise"?470:230}" r="60" fill="#fff4cf" opacity=".9"/>`;
  /* tree outside by season: 0 summer 1 autumn 2 winter 3 spring */
  const se=((o.season%4)+4)%4, cc=["#3d8a43","#d9822b",null,"#7fc37a"][se];
  s+=`<path d="M260,570 L270,420 Q240,380 210,370 M270,430 Q300,380 340,370" stroke="#4a3322" stroke-width="16" fill="none" stroke-linecap="round"/>`;
  if(cc){s+=`<circle cx="230" cy="350" r="70" fill="${cc}"/><circle cx="320" cy="330" r="80" fill="${cc}"/><circle cx="280" cy="280" r="70" fill="${cc}"/>`; if(se===3) for(let i=0;i<10;i++) s+=`<circle cx="${210+hash(i)*160}" cy="${270+hash(i+4)*120}" r="9" fill="#ffc2d8"/>`; if(se===1) for(let i=0;i<4;i++){const q=(t*.4+i/4)%1; s+=`<ellipse cx="${200+hash(i)*260+Math.sin(q*9)*20}" cy="${360+q*200}" rx="8" ry="5" fill="#d9822b"/>`;}}
  else {s+=`<rect x="130" y="520" width="400" height="50" fill="#f4f7fb"/>`; for(let i=0;i<22;i++){const q=(t*.25+hash(i))%1; s+=`<circle cx="${140+hash(i*5)*380}" cy="${150+q*410}" r="4" fill="#fff" opacity=".9"/>`;}}
  if(night) s+=`<rect x="130" y="140" width="400" height="430" fill="#000" opacity=".15"/>`;
  s+=`<rect x="130" y="140" width="400" height="430" rx="6" fill="none" stroke="#f1ece4" stroke-width="18"/><path d="M330,140 L330,570 M130,355 L530,355" stroke="#f1ece4" stroke-width="12"/><rect x="110" y="566" width="440" height="22" rx="4" fill="#efe8dd"/>`;
  /* plant on sill */
  const pl=o.plant;
  s+=`<g transform="translate(470 566)"><path d="M-34,-56 L34,-56 L26,0 L-26,0 Z" fill="#c4643c" stroke="#0b0b0d" stroke-width="4"/>`;
  for(let i=0;i<5;i++){const a=-60+i*30, dr=(1-pl)*(a<0?-60:60), col=pl>.5?"#3f9a4a":pl>.2?"#9a8a3a":"#7a5a30";
    s+=`<path d="M0,-56 q${Math.sin((a+dr)*D)*40},${-Math.cos((a+dr)*D)*60*(.4+pl*.6)} ${Math.sin((a+dr)*D)*70},${-Math.cos((a+dr)*D)*90*(.3+pl*.7)}" stroke="${col}" stroke-width="12" fill="none" stroke-linecap="round"/>`;}
  if(pl<.4) s+=`<ellipse cx="-50" cy="-4" rx="12" ry="5" fill="#7a5a30"/><ellipse cx="54" cy="-3" rx="10" ry="4" fill="#7a5a30"/>`;
  s+=`</g>`;
  /* clock */
  const [hh,mm]=o.clock; s+=`<g transform="translate(720 210)"><circle r="62" fill="#f7f3ea" stroke="#2b2b2b" stroke-width="8"/>${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>`<path d="M${Math.sin(i*.5236)*48},${-Math.cos(i*.5236)*48} L${Math.sin(i*.5236)*54},${-Math.cos(i*.5236)*54}" stroke="#2b2b2b" stroke-width="4"/>`).join("")}<path d="M0,0 L${Math.sin(((hh%12)+mm/60)*.5236)*30},${-Math.cos(((hh%12)+mm/60)*.5236)*30}" stroke="#2b2b2b" stroke-width="7" stroke-linecap="round"/><path d="M0,0 L${Math.sin(mm*.10472)*46},${-Math.cos(mm*.10472)*46}" stroke="#e5352b" stroke-width="4" stroke-linecap="round"/><circle r="5" fill="#2b2b2b"/></g>`;
  /* calendar */
  s+=`<g transform="translate(880 130)"><rect width="150" height="180" rx="8" fill="#fff" stroke="#2b2b2b" stroke-width="5"/><rect width="150" height="44" rx="8" fill="#e5352b"/>${T_(75,32,"DAY",26,{ls:4})}${T_(75,140,o.cal,String(o.cal).length>3?54:72,{c:"#1b1b1b",w:900})}${o.flip>0?`<g transform="translate(75 44) rotate(${-o.flip*160}) translate(-75 -44)" opacity="${1-o.flip}"><rect y="44" width="150" height="136" fill="#f4f1ea" stroke="#2b2b2b" stroke-width="3"/></g>`:""}</g>`;
  /* goals board */
  const G=["GET FIT","LEARN GUITAR","START MY CHANNEL","CALL DAD MORE"];
  s+=`<g transform="translate(1100 300)"><rect width="470" height="300" rx="10" fill="#f6f4ee" stroke="#9aa0a8" stroke-width="10"/>${T_(235,58,"GOALS",40,{c:"#e5352b",w:900,ls:6})}`;
  for(let i=0;i<4;i++){const vis=clamp(o.goals-i); if(vis<=0) continue; const txt=G[i].slice(0,Math.ceil(G[i].length*vis));
    s+=`<g opacity="${(1-o.faded*.75).toFixed(2)}"><rect x="34" y="${92+i*52}" width="30" height="30" rx="4" fill="none" stroke="#2b2b2b" stroke-width="4"/>${T_(80,118+i*52,txt,32,{a:"start",c:"#1d2a6b",w:800})}</g>`;
    if(o.checks>i){const k=clamp((o.checks-i)*1); s+=`<path d="M36,${106+i*52} l12,14 l26,-${30*k}" stroke="#18a34a" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;}}
  s+=`</g>`;
  /* desk */
  s+=`<rect x="960" y="640" width="720" height="26" rx="6" fill="#7a5134" stroke="#3b2618" stroke-width="5"/><rect x="990" y="666" width="24" height="160" fill="#5a3b25"/><rect x="1630" y="666" width="24" height="160" fill="#5a3b25"/><rect x="1380" y="666" width="230" height="110" fill="#6a4630" stroke="#3b2618" stroke-width="4"/>`;
  /* lamp */
  s+=`<g transform="translate(1560 640)"><rect x="-40" y="-10" width="80" height="12" rx="5" fill="#2b2b2b"/><path d="M0,-10 L-30,-150 L10,-190" stroke="#2b2b2b" stroke-width="10" fill="none"/><path d="M-20,-200 L60,-225 L70,-170 L-6,-150 Z" fill="${night?"#ffd27a":"#3b3b3b"}" stroke="#2b2b2b" stroke-width="6"/></g>`;
  /* door + gym bag */
  s+=`<rect x="1730" y="260" width="170" height="560" fill="#9c7a5a" stroke="#5a4330" stroke-width="8"/><circle cx="1760" cy="560" r="10" fill="#d4b26a"/>`;
  s+=`<g transform="translate(1790 790)"><rect x="-70" y="-60" width="140" height="70" rx="28" fill="#2a63d6" stroke="#0b0b0d" stroke-width="5"/><path d="M-36,-60 Q0,-110 36,-60" stroke="#0b0b0d" stroke-width="8" fill="none"/>${o.dust>0?`<rect x="-70" y="-60" width="140" height="70" rx="28" fill="#b9ad9a" opacity="${o.dust*.6}"/>`:""}</g>`;
  /* guitar on stand left of desk */
  if(!o.noGuitar) s+=guitar(640,800,.62,-8,o.dust);
  /* sticky notes */
  for(let i=0;i<o.notes;i++){const [x,y,r]=NOTES[i]; let sc=1; if(i===o.slap) sc=lerp(1.6,1,eob(o.slapK)); s+=note(x,y,r,sc,"tomorrow",o.dust>.4?"#d8c27a":"#f7d046");}
  if(o.today){const k=eob(o.today); s+=note(1300,450,-4,1.6*k,"TODAY","#7fe08a");}
  /* cobwebs */
  if(o.cob>0){const W2=(x,y,sx,sy)=>`<g transform="translate(${x} ${y}) scale(${sx} ${sy})" opacity="${o.cob}" stroke="#e8e8e8" stroke-width="2" fill="none"><path d="M0,0 L160,0 M0,0 L0,160 M0,0 L120,80 M0,0 L70,140 M0,0 L150,40"/><path d="M40,0 Q30,22 0,30 M80,0 Q60,46 0,64 M120,0 Q96,70 0,104 M160,0 Q130,96 0,150"/></g>`;
    s+=W2(0,0,1,1)+W2(WW,0,-1,1)+W2(560,140,-.6,.6)+W2(1100,300,.5,.5);}
  return s;}
/* overlay: lighting + dust (drawn after characters) */
function light(o){let s="";
  if(o.time==="night"){s+=`<rect width="${WW}" height="${HH}" fill="#06081a" opacity=".3"/><ellipse cx="1560" cy="520" rx="420" ry="300" fill="#ffd27a" opacity=".16" filter="url(#bl3)"/>`;}
  if(o.glow){const [x,y]=o.glow; s+=`<ellipse cx="${x}" cy="${y}" rx="170" ry="150" fill="#6fb8ff" opacity=".14" filter="url(#bl3)"/>`;}
  if(o.dust>0){for(let i=0;i<80;i++) s+=`<circle cx="${hash(i*1.3)*WW}" cy="${hash(i*2.9)*HH}" r="${1+hash(i)*2.5}" fill="#e8dcc0" opacity="${(o.dust*.5*hash(i*4)).toFixed(2)}"/>`; s+=`<rect width="${WW}" height="${HH}" fill="#7a6a50" opacity="${o.dust*.18}"/>`;}
  return s;}

/* ---------- posed Dokie ---------- */
const DX=820, DY=668, DS=.62; // seated at desk
const SEAT=(o)=>BASE(Object.assign({},SIT,o));
function chair(){return `<g><rect x="700" y="420" width="40" height="300" rx="14" fill="#3b3f4a" stroke="#0b0b0d" stroke-width="5" transform="rotate(-6 720 600)"/><rect x="700" y="680" width="230" height="34" rx="12" fill="#4a4f5c" stroke="#0b0b0d" stroke-width="5"/><rect x="800" y="714" width="16" height="90" fill="#2b2b2b"/><path d="M730,812 L890,812" stroke="#2b2b2b" stroke-width="14" stroke-linecap="round"/></g>`;}
function seated(t,o){ // returns {s,m}
  o=Object.assign({age:0,phone:0,look:0,tilt:4,lean:0},o);
  const P=SEAT({lean:o.lean+o.age*12,tilt:o.tilt+o.age*8,belly:o.belly||0,fh:o.fh||"fist",bh:o.bh||"fist",ex:Object.assign({blink:blink(t),px:o.look,lid:o.lid??(o.age*10)},o.ex||{})});
  if(o.fT) P.fT=o.fT; else P.fT=tgt(P,o.phone?[DX+150,DY-230]:[1010,630],DX,DY,DS); P.fBend=1;
  if(o.bT) P.bT=o.bT; else P.bT=tgt(P,[990,640],DX,DY,DS); P.bBend=1;
  const m=man2(P); let s=placeF(DX,DY,DS,m.s);
  const C=toWF(m.C,DX,DY,DS); s+=ageFX(C,DS,o.age);
  if(o.phone){const h=toWF(m.hf,DX,DY,DS); s+=phone(h,1.1,-10,o.phone);}
  return {s,m,C};}
function standing(t,x,y,sc,o,dir=1){
  const P=BASE(Object.assign({ex:{blink:blink(t)}},o)); if(o.fW){P.fT=tgt(P,o.fW,x,y,sc,dir);P.fBend=o.fBend??1;} if(o.bW){P.bT=tgt(P,o.bW,x,y,sc,dir);P.bBend=o.bBend??-1;}
  const m=man2(P); return {s:placeF(x,y,sc,m.s,dir)+ageFX(toWF(m.C,x,y,sc,dir),sc,o.age||0),m};}

/* ---------- text ---------- */
let TXT="";
const cap=(t,a,b,str,o={})=>{if(window.NOCAP) return; const op=fade(t,a,b,o.e??.5); if(op<=0) return; const y=o.y??960;
  TXT+=`<g opacity="${op.toFixed(3)}">${T_(WW/2+2,y+3,str,o.sz||58,{f:Ser,it:1,w:700,c:"rgba(0,0,0,.6)"})}${T_(WW/2,y,str,o.sz||58,{f:Ser,it:1,w:700,c:o.c||"#fff"})}</g>`;};
const typeT=(t,a,b,str,y,sz=78,c="#fff")=>{const n=Math.floor(clamp(Pr(t,a,b))*str.length); return T_(WW/2,y,str.slice(0,n)+(Math.floor(t*3)%2&&n<str.length?"|":""),sz,{f:Ser,it:1,w:700,c});};
const hud=(n,op=1)=>{TXT+=`<g opacity="${op}"><rect x="60" y="56" width="${150+String(n).length*28}" height="70" rx="14" fill="rgba(0,0,0,.55)"/>${T_(90,104,"DAY "+n,40,{a:"start",ls:4})}</g>`;};

/* ---------- scenes [a,b,fn, camera:[cx,cy,zoomStart,zoomEnd]] ---------- */
const SC=[];
/* 0 HOOK: old Dokie, wall of notes (0-7) */
SC.push([0,7,t=>{
  const o={time:"dusk",season:2,dust:1,notes:190,plant:0,cob:1,goals:4,faded:1,clock:[4,12],cal:"1000"};
  let s=room(t,o)+chair(); const d=seated(t,{age:1,tilt:10,look:-6,ex:{lid:16,blink:blink(t)}}); s+=d.s+light(o);
  cap(t,-1,6.3,`I said “tomorrow” 1,000 times.`,{sz:66});
  return s;},[1000,520,1.35,1.18]]);
/* 1 rewind card (7-9.5) */
SC.push([7,9.6,t=>{
  const o={time:"dusk",season:2,dust:1,notes:190,plant:0,cob:1,goals:4,faded:1,clock:[4,12-Math.floor((t-7)*40)],cal:"1000"};
  let s=room(t,o)+chair()+seated(t,{age:1,tilt:10}).s+light(o);
  s+=`<rect width="${WW}" height="${HH}" fill="#000" opacity="${.35+.3*Pr(t,7,9.6)}"/>`;
  TXT+=T_(WW/2,560,"1,000 days earlier",84,{f:Ser,it:1,w:700});
  return s;},[960,540,1,1]]);
/* 2 DAY 1: writes goals (9.6-19) */
SC.push([9.6,19,t=>{
  const g=clamp(Pr(t,10.6,17.4)*4,0,4), o={time:"dusk",season:0,goals:g,clock:[21,5+Math.floor((t-9.6)*2)],cal:"1"};
  let s=room(t,o)+chair();
  const li=Math.min(3,Math.floor(g)), wx=1180+((g%1)*160)+Math.sin(t*14)*8, wy=410+li*52;
  const st=standing(t,1010,720,DS,{lean:2,tilt:t>17.6?-4:2,fW:[wx,wy],bW:[960,700],fh:"point",bh:"fist",ex:{blink:blink(t),brow:-4,mouth:t>17.6?.5:0}});
  s+=st.s+light(o); hud(1);
  return s;},[1180,520,1.22,1.32]]);
/* 3 23:47 guitar vs phone (19-29) */
SC.push([19,29,t=>{
  const o={time:"night",season:0,goals:4,clock:[23,47],cal:"1",notes:t>27?1:0,slap:0,slapK:Pr(t,27,27.4)};
  let s=room(t,o)+chair();
  const buzz=t>21.4&&t<23.6, look=t<21.4?-8:t<23?6:0, ph=eio(Pr(t,23.2,24.2));
  if(!ph) s+=phone([1180,630],1,90,buzz?.9:0)+(buzz?`<path d="M1130,600 q-10,30 0,60 M1230,600 q10,30 0,60" stroke="#8fd0ff" stroke-width="5" fill="none" opacity="${.5+.5*Math.sin(t*40)}"/>`:"");
  const d=seated(t,{look,phone:ph,tilt:ph?12:4,ex:{blink:blink(t),lid:ph?10:0,mouth:0}}); s+=d.s;
  s+=light({time:"night",glow:ph>.5?[d.C[0]+60,d.C[1]+30]:null});
  if(t>24.8&&t<27) TXT+=`<g opacity="${fade(t,24.8,27,.3)}"><ellipse cx="${d.C[0]+230}" cy="${d.C[1]-150}" rx="150" ry="70" fill="#fff"/><circle cx="${d.C[0]+110}" cy="${d.C[1]-80}" r="14" fill="#fff"/><circle cx="${d.C[0]+80}" cy="${d.C[1]-50}" r="8" fill="#fff"/>${T_(d.C[0]+230,d.C[1]-136,"tomorrow.",46,{c:"#1b1b1b",f:Ser,it:1,w:700})}</g>`;
  hud(1);
  return s;},[1000,520,1.18,1.36]]);
/* 4 alarm snooze (29-37) */
SC.push([29,37,t=>{
  const k=Math.min(3,Math.floor((t-29.3)/2.2)), times=["7:00","7:09","7:18","7:47"], pressed=((t-29.3)%2.2)>1.5&&k<3;
  let s=`<rect width="${WW}" height="${HH}" fill="#14131f"/><ellipse cx="960" cy="540" rx="520" ry="420" fill="#6fb8ff" opacity=".18" filter="url(#bl3)"/>`;
  const late=k>=3, shake=!late&&!pressed?Math.sin(t*70)*6:0;
  let scr=T_(0,-170,times[k],120,{c:late?"#ff4a4a":"#fff",w:300})+T_(0,-110,late?"you're late.":"ALARM",30,{c:late?"#ff8a8a":"#9fb3d6",ls:6});
  if(!late) scr+=`<rect x="-150" y="80" width="300" height="96" rx="48" fill="${pressed?"#ffb000":"#ff9500"}"/>${T_(0,142,"SNOOZE",40,{c:"#1b1b1b",w:900})}`;
  s+=`<g transform="translate(${shake} 0)">${phoneBig(960,560,1,scr)}</g>`;
  if(pressed) s+=hand([1000,770],-10,"point",1.6);
  cap(t,29.6,36.7,k<3?"just 5 more minutes...":"",{y:1010,sz:48});
  return s;},[960,540,1.05,1.12]]);
/* 5 montage DAY 2 -> 120 (37-52) */
SC.push([37,52,t=>{
  const k=Pr(t,37,51.5), day=Math.max(2,Math.round(2+118*Math.pow(k,1.4))), loop=((t-37)*1.6)%1;
  const o={time:loop<.5?"dusk":"night",season:k*1.6,goals:4,faded:k*.3,plant:1-k*.7,notes:1+Math.floor(k*40),slap:Math.floor(k*40),slapK:(t*1.6)%1,clock:[23,Math.floor(loop*59)],cal:String(day),flip:(t*3.2)%1,dust:k*.15};
  let s=room(t,o)+chair();
  const ph=loop>.45?1:0; const d=seated(t,{look:loop<.3?-8:0,phone:ph,tilt:ph?12:4,ex:{blink:blink(t),lid:ph?12:4}}); s+=d.s+light({time:o.time,glow:ph?[d.C[0]+60,d.C[1]+30]:null,dust:o.dust});
  hud(day);
  return s;},[1060,500,1.02,1.08]]);
/* 6 Dad calling (52-62) */
SC.push([52,62,t=>{
  const declined=t>56.4, missed=1+Math.floor(Pr(t,57.5,61.5)*6);
  let s=`<rect width="${WW}" height="${HH}" fill="#14131f"/><ellipse cx="960" cy="540" rx="520" ry="420" fill="#3ccf6e" opacity="${declined?.05:.12+.06*Math.sin(t*8)}" filter="url(#bl3)"/>`;
  let scr="";
  if(!declined){scr+=`<circle cy="-150" r="80" fill="#3b4256"/>${T_(0,-128,"D",70,{c:"#fff",w:900})}${T_(0,-20,"Dad",64,{c:"#fff",w:700})}${T_(0,30,"is calling...",30,{c:"#9fb3d6"})}<circle cx="-100" cy="230" r="54" fill="#ff3b30"/><circle cx="100" cy="230" r="54" fill="#34c759"/><path d="M-130,230 q30,-24 60,0" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M78,212 q22,40 44,36" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/>`;}
  else {scr+=T_(0,-170,"23:52",90,{c:"#fff",w:300}); for(let i=0;i<Math.min(missed,4);i++) scr+=`<g transform="translate(0 ${-60+i*96})"><rect x="-170" y="-38" width="340" height="80" rx="18" fill="#232a3d"/>${T_(-150,-6,"Dad",26,{a:"start",c:"#fff",w:800})}${T_(-150,24,`Missed call${i===0&&missed>4?` (${missed})`:""}`,22,{a:"start",c:"#ff6b6b"})}</g>`;}
  const ring=!declined?Math.sin(t*60)*5*(Math.sin(t*4)>0):0;
  s+=`<g transform="translate(${ring} 0)">${phoneBig(960,560,1,scr)}</g>`;
  if(t>55.2&&!declined){const k=eio(Pr(t,55.2,56.3)); s+=hand([lerp(1260,860,k),lerp(900,800,k)],-20,"point",1.6);}
  cap(t,56.6,61.8,"later.",{y:1010,sz:56});
  return s;},[960,540,1.08,1.0]]);
/* 7 years pass DAY 120 -> 1000 (62-76) */
SC.push([62,76,t=>{
  const k=Pr(t,62,75.5), day=Math.round(120+880*Math.pow(k,1.25)), age=eio(Pr(t,64,75));
  const o={time:["dusk","night","day","night"][Math.floor(t*1.2)%4],season:1.6+k*9,goals:4,faded:.3+k*.7,plant:.3-.3*k,notes:41+Math.floor(k*149),slap:41+Math.floor(k*149)-1,slapK:(t*4)%1,clock:[(t*30)%24,(t*600)%60],cal:String(day),flip:(t*6)%1,dust:.15+k*.85,cob:clamp((k-.4)*2)};
  let s=room(t,o)+chair(); const ph=Math.floor(t*1.2)%2; const d=seated(t,{age,phone:ph,tilt:ph?12:6,look:ph?0:-8}); s+=d.s+light({time:o.time,dust:o.dust,glow:ph?[d.C[0]+60,d.C[1]+30]:null});
  hud(day);
  return s;},[1000,520,1.0,1.12]]);
/* 8 old Dokie, guitar snaps (76-88) */
SC.push([76,88,t=>{
  const o={time:"dusk",season:2,dust:1,notes:190,plant:0,cob:1,goals:4,faded:1,clock:[4,12],cal:"1000",noGuitar:1};
  let s=room(t,o)+chair();
  const rise=eio(Pr(t,76.5,79)), hold=t>79;
  const st=standing(t,lerp(820,760,rise),740,DS,{age:1,lean:14,tilt:12,lb:[-10,4],lf:[14,-6],fW:hold?[820,560]:[lerp(900,690,rise),lerp(650,560,rise)],bW:hold?[720,470]:[760,700],fh:"fist",bh:"fist",ex:{blink:blink(t),lid:14,brow:t>83.2?10:0,brow2:t>83.2?-6:0,mouth:0}});
  s+=st.s;
  const snap=t>83;
  s+=hold?guitar(770,610,.62,-62,1,snap):guitar(640,800,.62,-8,1);
  if(hold){s+=hand([820,560],20,"fist",.75);}
  if(snap&&t<84) s+=`<path d="M650,470 l40,-30 l-10,40 l40,-20" stroke="#fff" stroke-width="6" fill="none" opacity="${1-Pr(t,83,84)}"/>`;
  s+=light({time:"dusk",dust:1});
  cap(t,84.2,87.8,"Tomorrow never came.",{sz:62});
  return s;},[820,520,1.28,1.45]]);
/* 9 black text (88-100) */
SC.push([88,100,t=>{
  let s=`<rect width="${WW}" height="${HH}" fill="#000"/>`;
  s+=typeT(t,88.6,91.4,"Tomorrow isn't a day.",470);
  if(t>93) s+=typeT(t,93,96.4,"It's where dreams go to wait.",590,78,"#e5352b");
  return s;},[960,540,1,1.04]]);
/* 10 closes eyes -> rewind (100-106) */
SC.push([100,106,t=>{
  const back=t>102.6;
  const o=back?{time:"night",season:0,goals:4,clock:[23,47],cal:"1"}:{time:"dusk",season:2,dust:1,notes:190,plant:0,cob:1,goals:4,faded:1,clock:[4,12],cal:"1000"};
  let s=room(t,o)+chair(); const d=seated(t,back?{phone:1,tilt:12,ex:{lid:8,blink:0}}:{age:1,tilt:10,ex:{lid:lerp(10,30,Pr(t,100.4,101.8)),blink:t>101.8?1:0}});
  s+=d.s+light({time:o.time,dust:o.dust||0,glow:back?[d.C[0]+60,d.C[1]+30]:null});
  if(back){hud(1); cap(t,103,105.9,"What if it's not too late?",{sz:58});}
  return s;},[1000,520,1.3,1.2]]);
/* 11 the choice (106-120) */
SC.push([106,120,t=>{
  const down=eio(Pr(t,106.6,107.6)), pick=eio(Pr(t,109,110.4)), play=t>110.6, rip=Pr(t,115.5,116.2), today=Pr(t,116.6,117.2);
  const o={time:"night",season:0,goals:4,clock:[23,49],cal:"1",notes:rip<1?1:0,today,noGuitar:pick>0};
  let s=room(t,o)+chair();
  if(t<109){ s+=phone([lerp(DX+120,1180,down),lerp(DY-200,636,down)],1.1,lerp(-10,90,down),lerp(1,0,down));
    const d=seated(t,{fT:null,look:t>108?-8:0,tilt:4,ex:{blink:blink(t),brow:t>107.6?6:0,brow2:t>107.6?6:0}}); s+=d.s+light({time:"night"});}
  else { s+=phone([1180,636],1,90,0);
    const strum=play?Math.sin(t*9):0;
    const P=SEAT({lean:4,tilt:t>112.4?-2:6,fh:"fist",bh:"fist",ex:{blink:blink(t),mouth:t>112.4&&t<115?.6:0,brow:t>111.2&&t<112.2?10:0}});
    P.fT=tgt(P,[DX+70,DY-60+strum*20],DX,DY,DS);P.fBend=1;P.bT=tgt(P,[DX+235,DY-135],DX,DY,DS);P.bBend=-1;
    const m=man2(P); s+=placeF(DX,DY,DS,m.s);
    s+=guitar(lerp(640,DX+40,pick),lerp(800,DY-20,pick),.62,lerp(-8,62,pick),0);
    if(play) s+=hand(toWF(m.hf,DX,DY,DS),20,"fist",.75)+hand([DX+235,DY-135],-30,"fist",.7);
    if(play&&t<112.2){const q=Pr(t,110.6,112.2); s+=T_(DX+120,DY-260-q*60,"♪",60,{c:"#ffd34d",op:1-q});}
    if(t>111.2&&t<112.2) TXT+=T_(DX+230,DY-330,"*twang*",44,{c:"#fff",f:Ser,it:1,w:700});
    s+=light({time:"night"});}
  if(t>115.4) cap(t,117.4,119.8,"Today.",{sz:62,c:"#7fe08a"});
  hud(1);
  return s;},[1000,520,1.15,1.3]]);
/* 12a DAY 7 run (120-127) */
SC.push([120,127,t=>{
  let s=`<rect width="${WW}" height="${HH}" fill="url(#gDayF)"/><circle cx="1500" cy="200" r="90" fill="#fff4cf"/>`;
  const off=(t*420)%640, off2=(t*160)%900;
  for(let i=-1;i<4;i++) s+=`<g transform="translate(${i*900-off2} 0)"><rect x="80" y="420" width="160" height="320" fill="#a9c3dc"/><rect x="300" y="360" width="200" height="380" fill="#9bb6d0"/><rect x="560" y="460" width="140" height="280" fill="#b4cbe0"/></g>`;
  for(let i=-1;i<5;i++) s+=`<g transform="translate(${i*640-off} 0)"><rect x="300" y="560" width="26" height="200" fill="#5a3b25"/><circle cx="313" cy="520" r="90" fill="#3d8a43"/><circle cx="260" cy="560" r="60" fill="#4a9a4e"/></g>`;
  s+=`<rect y="740" width="${WW}" height="340" fill="#9a9a9e"/><rect y="740" width="${WW}" height="20" fill="#c9c9cc"/>`;
  for(let i=-1;i<12;i++) s+=`<rect x="${i*200-(t*700)%200}" y="900" width="100" height="12" fill="#fff" opacity=".7"/>`;
  const ph=t*9, sw=Math.sin(ph);
  const P=BASE({lean:12,tilt:-4,bob:-Math.abs(Math.cos(ph))*30,lb:[sw*42,-(20+70*Math.max(0,-sw))],lf:[-sw*42,-(20+70*Math.max(0,sw))],f:[-sw*50+10,-sw*50+110],b:[sw*50+10,sw*50+110],fh:"fist",bh:"fist",ex:{brow:6,brow2:6,mouth:.3,blink:blink(t)}});
  s+=placeF(900,700,DS,man2(P).s);
  hud(7); return s;},[960,560,1.05,1.1]]);
/* 12b DAY 30 call Dad (127-135) */
SC.push([127,135,t=>{
  const ans=t>129.4;
  let s=`<rect width="${WW}" height="${HH}" fill="#1b1a26"/><ellipse cx="960" cy="540" rx="560" ry="440" fill="#34c759" opacity="${ans?.18:.12}" filter="url(#bl3)"/>`;
  let scr=`<circle cy="-150" r="80" fill="#3b4256"/>${T_(0,-128,"D",70,{c:"#fff",w:900})}${T_(0,-20,"Dad",64,{c:"#fff",w:700})}`;
  scr+=ans?T_(0,30,`00:${String(Math.floor((t-129.4)*7)).padStart(2,"0")}`,34,{c:"#34c759"}):T_(0,30,"is calling...",30,{c:"#9fb3d6"})+`<circle cx="-100" cy="230" r="54" fill="#ff3b30"/><circle cx="100" cy="230" r="54" fill="#34c759"/>`;
  s+=phoneBig(960,560,1,scr);
  if(!ans){const k=eio(Pr(t,128,129.3)); s+=hand([lerp(1300,1070,k),lerp(900,820,k)],-20,"point",1.6);}
  if(ans) for(let i=0;i<6;i++){const q=((t-129.4)*.6+i/6)%1; s+=heart(700+hash(i)*520,760-q*560,1.2,(1-q)*.9);}
  if(ans) cap(t,130.2,134.8,"“Hey son... I missed you.”",{y:1000,sz:50});
  hud(30); return s;},[960,540,1.0,1.08]]);
/* 12c DAY 100 playing (135-145) */
SC.push([135,145,t=>{
  const o={time:"day",season:3,goals:4,checks:clamp(Pr(t,136,143)*3,0,3),plant:1,clock:[18,20],cal:"100",noGuitar:1};
  let s=room(t,o)+chair();
  const strum=Math.sin(t*8);
  const P=SEAT({lean:2,tilt:-4+Math.sin(t*2)*3,fh:"fist",bh:"fist",ex:{blink:blink(t),lid:6,mouth:.4}});
  P.fT=tgt(P,[DX+70,DY-60+strum*22],DX,DY,DS);P.fBend=1;P.bT=tgt(P,[DX+235,DY-135+Math.sin(t*3)*6],DX,DY,DS);P.bBend=-1;
  const m=man2(P); s+=placeF(DX,DY,DS,m.s)+guitar(DX+40,DY-20,.62,62,0)+hand(toWF(m.hf,DX,DY,DS),20,"fist",.75)+hand([DX+235,DY-135+Math.sin(t*3)*6],-30,"fist",.7);
  for(let i=0;i<5;i++){const q=((t*.7+i/5)%1); s+=T_(DX+80+q*260+Math.sin(q*9+i)*30,DY-220-q*300,i%2?"♫":"♪",54,{c:"#e5352b",op:Math.sin(q*Math.PI)});}
  s+=light({time:"day"}); hud(100); return s;},[1060,520,1.1,1.22]]);
/* 13 sunrise at window (145-153) */
SC.push([145,153,t=>{
  const o={time:"sunrise",season:3,goals:4,checks:4,plant:1,clock:[6,10],cal:"365",noGuitar:1,today:1};
  let s=room(t,o);
  const strum=Math.sin(t*7);
  const P=BASE({lean:0,tilt:-6,lb:[-10,4],lf:[14,-6],fh:"fist",bh:"fist",ex:{blink:blink(t),lid:8,mouth:.3}});
  const x=600,y=760; P.fT=tgt(P,[x+70,y-60+strum*20],x,y,DS);P.fBend=1;P.bT=tgt(P,[x+235,y-135],x,y,DS);P.bBend=-1;
  const m=man2(P); s+=placeF(x,y,DS,m.s)+guitar(x+40,y-20,.62,62,0)+hand(toWF(m.hf,x,y,DS),20,"fist",.75)+hand([x+235,y-135],-30,"fist",.7);
  s+=`<rect width="${WW}" height="${HH}" fill="#ffb35c" opacity=".12"/><ellipse cx="330" cy="420" rx="500" ry="380" fill="#ffd59a" opacity=".25" filter="url(#bl3)"/>`;
  hud(365); return s;},[820,520,1.3,1.15]]);
/* 14 end text (153-161) */
SC.push([153,161,t=>{
  let s=`<rect width="${WW}" height="${HH}" fill="#000"/>`;
  s+=typeT(t,153.4,156,"Tomorrow is a lie we tell ourselves.",470,70);
  if(t>157) s+=`<g opacity="${fade(t,157,163,.4)}">${T_(WW/2,610,"Start today.",96,{f:Ser,it:1,w:700,c:"#7fe08a"})}</g>`;
  return s;},[960,540,1,1.04]]);
/* 15 comment bait (161-166) */
SC.push([161,166,t=>{
  let s=`<rect width="${WW}" height="${HH}" fill="#000"/>`;
  s+=`<g opacity="${fade(t,161.2,166.5,.4)}">${T_(WW/2,520,"What do you keep saying",58,{f:Ser,it:1,w:700})}${T_(WW/2,610,"“tomorrow” to?",76,{f:Ser,it:1,w:700,c:"#f7d046"})}</g>`;
  return s;},[960,540,1,1.03]]);

const DUR=166;
const CUTS=SC.map(x=>x[0]).slice(1);
const REW=[[6.6,9.6],[101.8,103.0]];
function render(t){
  TXT=""; let out="", cam=[960,540,1,1];
  for(const [a,b,fn,c] of SC) if(t>=a&&t<b){out=fn(t); const k=eio(Pr(t,a,b)); cam=c; var z=lerp(c[2],c[3],k), cx=clamp(c[0],960/z,1920-960/z), cy=clamp(c[1],540/z,1080-540/z); break;}
  document.getElementById("w").innerHTML=`<g transform="translate(960 540) scale(${z}) translate(${-cx} ${-cy})">${out}</g>`;
  document.getElementById("ov").innerHTML=TXT;
  /* VHS rewind */
  let vhs=0; REW.forEach(([a,b])=>{if(t>a&&t<b) vhs=Math.max(vhs,Math.sin(Pr(t,a,b)*Math.PI));});
  let v=""; if(vhs>0){ for(let i=0;i<14;i++){const y=(hash(i+Math.floor(t*24))*HH); v+=`<rect x="0" y="${y}" width="${WW}" height="${4+hash(i*3)*30}" fill="#fff" opacity="${.12*vhs}"/><rect x="${(hash(i*7+Math.floor(t*30))-.5)*80}" y="${y}" width="${WW}" height="${3+hash(i)*8}" fill="${i%2?"#ff2a6a":"#2affd5"}" opacity="${.25*vhs}"/>`;}
    v+=`<rect width="${WW}" height="${HH}" fill="#000" opacity="${.15*vhs}"/>${T_(90,110,"◀◀ REWIND",44,{a:"start",f:"monospace",c:"#fff",op:vhs*(Math.floor(t*4)%2?1:.4)})}`;}
  document.getElementById("vhs").innerHTML=v;
  document.getElementById("w").parentNode.style.filter=vhs>0?`saturate(${1-vhs*.6}) contrast(${1+vhs*.3})`:"none";
  /* cut flashes + fades in/out of black scenes */
  const fl=CUTS.reduce((m,c)=>{const k=Pr(t,c,c+.16);return Math.max(m,k>0&&k<1?(1-k)*.25:0)},0);
  document.getElementById("flash").style.opacity=fl;
  let fd=0; [[87.4,88.6],[99.4,100.6],[152.4,153.6],[165,166.2]].forEach(([a,b])=>{if(t>a&&t<b) fd=Math.max(fd,1-Math.abs(t-(a+b)/2)/((b-a)/2));});
  document.getElementById("fade").style.opacity=fd;
  const sh=[[83,.4,10],[29.3,.2,0]].reduce((a,[s0,d,m])=>{const k=Pr(t,s0,s0+d);return a+(k>0&&k<1?m*(1-k):0)},0);
  document.getElementById("cam").style.transform=`translate(${Math.sin(t*90)*sh}px,${Math.cos(t*70)*sh}px)`;
}
window.render=render;
