/* ================= TWO CUPS — Last Soul style short =================
   1920x1080, render(t) draws frame at time t (seconds). */
const W_=1920,H_=1080, FLOOR=880;
const HAND="Patrick Hand", SERIF="EB Garamond", SANS="Inter,sans-serif";
const sm=x=>x*x*(3-2*x);
const ease=(t,a,b,fn=eio)=>fn(Pr(t,a,b));
const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
const rnd=(i)=>hash(i*13.37+.5);

/* ---------- text ---------- */
function say(x,y,txt,op,o={}){ if(op<=0.001) return "";
  const sz=o.sz||44, w=txt.length*sz*.43+50, h=sz*1.5;
  return `<g opacity="${op}"><rect x="${x-w/2}" y="${y-h*.7}" width="${w}" height="${h}" rx="${h/2}" fill="#000" opacity="${o.bgop??.42}" filter="url(#soft)"/>`+
   `<text x="${x}" y="${y}" text-anchor="middle" font-family="${HAND}" font-size="${sz}" fill="${o.c||"#f4f1ea"}" letter-spacing=".5">${o.html||esc(txt)}</text></g>`;}
const sayT=(t,a,b,x,y,txt,o={})=>say(x,y+(1-eo(Pr(t,a,a+.35)))*8,txt,Math.min(Pr(t,a,a+.35),1-Pr(t,b-.35,b)),o);
/* typewriter with echo trails (inner voice at peaks) */
function typeEcho(t,a,b,x,y,txt,o={}){ if(t<a||t>b) return ""; const cps=o.cps||15, c=o.c||"#ff9a5c", sz=o.sz||46;
  const fo=1-Pr(t,b-.5,b); let s="";
  [[.6,.16,2*sz*.62],[.3,.3,sz*.62],[0,1,0]].forEach(([lag,op,dy])=>{const n=Math.floor(Math.max(0,t-a-lag)*cps); if(n<=0) return;
    s+=`<text x="${x}" y="${y+dy}" text-anchor="middle" font-family="${HAND}" font-size="${dy?sz*.62:sz}" fill="${c}" opacity="${op*fo}">${esc(txt.slice(0,n))}</text>`;});
  return `<rect x="${x-txt.length*sz*.25}" y="${y-sz}" width="${txt.length*sz*.5}" height="${sz*2.6}" rx="40" fill="#000" opacity="${.35*fo}" filter="url(#soft)"/>`+s;}

/* ---------- props ---------- */
function mug(x,y,sc=1,o={}){ /* x,y = bottom centre */
  const w=64*sc,h=70*sc, col=o.col||"#e7ddcc", sh=o.shade||"#b9ab95";
  let s=`<g ${o.noRim?"":'filter="url(#rimP)"'}>`;
  s+=`<path d="M${x+w/2-4*sc} ${y-h+14*sc} q${30*sc} ${2*sc} ${26*sc} ${30*sc} q${-4*sc} ${20*sc} ${-28*sc} ${18*sc}" stroke="${col}" stroke-width="${9*sc}" fill="none"/>`;
  s+=`<path d="M${x-w/2} ${y-h} L${x+w/2} ${y-h} L${x+w/2-4*sc} ${y-6*sc} Q${x+w/2-6*sc} ${y} ${x+w/2-14*sc} ${y} L${x-w/2+14*sc} ${y} Q${x-w/2+6*sc} ${y} ${x-w/2+4*sc} ${y-6*sc} Z" fill="${col}"/>`;
  s+=`<path d="M${x-w/2+6*sc} ${y-h+6*sc} L${x-w/2+10*sc} ${y-10*sc}" stroke="#fff" stroke-opacity=".35" stroke-width="${6*sc}" stroke-linecap="round"/>`;
  s+=`<path d="M${x+w/2-14*sc} ${y-h+4*sc} L${x+w/2-16*sc} ${y-8*sc}" stroke="${sh}" stroke-width="${10*sc}" stroke-linecap="round" opacity=".7"/>`;
  s+=`<ellipse cx="${x}" cy="${y-h}" rx="${w/2}" ry="${7*sc}" fill="${o.tea===false?"#6d655c":"#5a3018"}"/><ellipse cx="${x}" cy="${y-h}" rx="${w/2}" ry="${7*sc}" fill="none" stroke="${col}" stroke-width="${3*sc}"/>`;
  if(o.band) s+=`<rect x="${x-w/2+2*sc}" y="${y-h*.55}" width="${w-6*sc}" height="${9*sc}" fill="${o.band}"/>`;
  return s+`</g>`;}
/* steam: k = strength 0..1 */
function steam(x,y,k,t,sc=1,seed=0){ if(k<=0.01) return ""; let s="";
  const n=3, Hh=260*sc*(.4+.6*k);
  for(let i=0;i<n;i++){ const ph=seed*3.1+i*2.4, off=(i-1)*10*sc, sp=1.2+i*.25;
    const pts=[]; for(let j=0;j<=14;j++){const u=j/14, yy=y-u*Hh, a=(4+30*u)*sc;
      pts.push([x+off+Math.sin(u*3.2-t*sp+ph)*a+Math.sin(u*6.5-t*sp*1.7+ph*1.7)*a*.18, yy]);}
    for(let j=0;j<14;j++){const u=j/14, op=k*.42*Math.sin(Math.PI*Math.min(1,u*1.1+.05))*(.8+.2*Math.sin(t*1.1+ph));
      s+=`<path d="M${f(pts[j])} L${f(pts[j+1])}" stroke="#fff3e2" stroke-opacity="${op.toFixed(3)}" stroke-width="${((12+u*26)*sc*(.55+.45*k)).toFixed(1)}" stroke-linecap="round"/>`;}}
  return `<g filter="url(#steamB)">${s}</g>`;}
function kettle(x,y,sc=1){return `<g filter="url(#rimP)"><path d="M${x-70*sc} ${y} Q${x-80*sc} ${y-90*sc} ${x-40*sc} ${y-110*sc} L${x+40*sc} ${y-110*sc} Q${x+80*sc} ${y-90*sc} ${x+70*sc} ${y} Z" fill="#2a2a2e"/>`+
  `<path d="M${x+60*sc} ${y-60*sc} L${x+120*sc} ${y-100*sc} L${x+124*sc} ${y-94*sc} L${x+72*sc} ${y-40*sc}" fill="#2a2a2e"/><path d="M${x-40*sc} ${y-112*sc} Q${x} ${y-180*sc} ${x+40*sc} ${y-112*sc}" stroke="#2a2a2e" stroke-width="${12*sc}" fill="none"/><rect x="${x-14*sc}" y="${y-126*sc}" width="${28*sc}" height="${14*sc}" rx="${5*sc}" fill="#2a2a2e"/></g>`+
  `<path d="M${x-52*sc} ${y-20*sc} Q${x-62*sc} ${y-80*sc} ${x-30*sc} ${y-96*sc}" stroke="#ffcf9a" stroke-opacity=".35" stroke-width="${6*sc}" fill="none" stroke-linecap="round"/>`;}

/* ---------- window outside ---------- */
const SEASON={
  autumn:{sky:["#56607a","#c99a76"],leaf:"#c8743a",ground:"#3b3a3a",fall:"leaf"},
  late:{sky:["#4c566d","#9c8a7c"],leaf:"#8d5a35",ground:"#3a3838",fall:"leaf",sparse:1},
  winter:{sky:["#55627a","#a3adbb"],leaf:null,ground:"#c9ced6",fall:"snow"},
  night:{sky:["#141b2c","#2c3550"],leaf:null,ground:"#8e95a3",fall:"snow"},
  spring:{sky:["#7fa3c9","#e8d9b8"],leaf:"#79a35a",ground:"#5e7a4a",fall:null}};
function outside(x,y,w,h,season,t,id){ const S=SEASON[season];
  let s=`<clipPath id="cw${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#cw${id})">`;
  s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#sky_${season})"/>`;
  s+=`<path d="M${x} ${y+h*.72} Q${x+w*.3} ${y+h*.62} ${x+w*.55} ${y+h*.7} T${x+w} ${y+h*.66} L${x+w} ${y+h} L${x} ${y+h} Z" fill="${S.ground}" opacity=".9"/>`;
  /* neighbour house */
  s+=`<path d="M${x+w*.62} ${y+h*.7} L${x+w*.62} ${y+h*.45} L${x+w*.78} ${y+h*.32} L${x+w*.94} ${y+h*.45} L${x+w*.94} ${y+h*.7} Z" fill="#2c2b33" opacity=".8"/><rect x="${x+w*.7}" y="${y+h*.5}" width="${w*.06}" height="${h*.08}" fill="${season=="night"||season=="winter"?"#f2c27a":"#5a5a66"}"/>`;
  /* tree */
  const tx=x+w*.28, ty=y+h*.74;
  s+=`<path d="M${tx-8} ${ty} L${tx-4} ${ty-h*.5} M${tx-5} ${ty-h*.3} L${tx-48} ${ty-h*.52} M${tx-4} ${ty-h*.38} L${tx+44} ${ty-h*.58} M${tx-4} ${ty-h*.5} L${tx-20} ${ty-h*.66}" stroke="#1e1b1c" stroke-width="10" stroke-linecap="round"/>`;
  if(S.leaf){ const N=S.sparse?16:46; for(let i=0;i<N;i++){const a=rnd(i)*6.28, r=rnd(i+40)*h*.2; s+=`<circle cx="${tx+Math.cos(a)*r*1.2}" cy="${ty-h*.52+Math.sin(a)*r*.75}" r="${10+rnd(i+80)*14}" fill="${S.leaf}" opacity="${.75+rnd(i+5)*.25}"/>`;}}
  if(season=="winter"||season=="night") s+=`<path d="M${tx-48} ${ty-h*.52-4} L${tx-5} ${ty-h*.31-4} M${tx+44} ${ty-h*.58-4} L${tx-4} ${ty-h*.39-4}" stroke="#e8edf3" stroke-width="5" stroke-linecap="round" opacity=".8"/>`;
  if(S.fall){ const N=S.fall=="snow"?60:7; for(let i=0;i<N;i++){ const sp=S.fall=="snow"?(28+rnd(i)*30):(45+rnd(i)*25), py=((t*sp+rnd(i+3)*h*2)%(h+40))-20, px=x+rnd(i+9)*w+Math.sin(t*1.3+i)*14;
      s+= S.fall=="snow"?`<circle cx="${px}" cy="${y+py}" r="${1.6+rnd(i+2)*2.4}" fill="#fff" opacity=".85"/>`:`<ellipse cx="${px}" cy="${y+py}" rx="7" ry="4" fill="${S.leaf}" transform="rotate(${t*120+i*40} ${px} ${y+py})"/>`;}}
  return s+`</g>`;}

/* ---------- KITCHEN (grandma) ---------- */
/* o: season, lamp(0..1), dusk(0..1 darkness), cups:[k1,k2] steam strengths or null, cupsN, ring */
function kitchen(t,o={}){
  const season=o.season||"autumn", lampK=o.lamp??1;
  let s=`<rect x="-200" y="-200" width="2400" height="1500" fill="#1d1816"/>`;
  s+=`<rect x="-200" y="-200" width="2400" height="${FLOOR+200}" fill="url(#kWall)"/>`;
  /* wainscot */
  s+=`<rect x="-200" y="650" width="2400" height="${FLOOR-650}" fill="#2f2724"/><rect x="-200" y="642" width="2400" height="12" fill="#3d332e"/>`;
  for(let i=0;i<26;i++) s+=`<rect x="${-200+i*92}" y="670" width="4" height="${FLOOR-680}" fill="#26201d"/>`;
  /* floor */
  s+=`<rect x="-200" y="${FLOOR}" width="2400" height="500" fill="#221c1a"/><rect x="-200" y="${FLOOR}" width="2400" height="8" fill="#3a302b"/>`;
  for(let i=0;i<9;i++) s+=`<path d="M-200 ${FLOOR+30+i*i*9} L2200 ${FLOOR+30+i*i*9}" stroke="#2b2421" stroke-width="3"/>`;
  s+=`<ellipse cx="1110" cy="${FLOOR+60}" rx="420" ry="60" fill="#3a2a26" opacity=".9"/><ellipse cx="1110" cy="${FLOOR+60}" rx="380" ry="48" fill="none" stroke="#4a3631" stroke-width="5"/>`;
  /* window */
  s+=`<rect x="690" y="235" width="300" height="380" fill="#2a221f"/>`+outside(706,251,268,348,season,t,"k")+
     `<path d="M840 251 L840 599 M706 425 L974 425" stroke="#2a221f" stroke-width="12"/><rect x="676" y="612" width="328" height="18" fill="#3d332e"/>`;
  s+=`<path d="M690 235 L700 640 L660 640 L668 235 Z M990 235 L980 640 L1020 640 L1012 235 Z" fill="#5b3f37" opacity=".85"/>`;
  /* plant on sill */
  s+=`<rect x="900" y="574" width="40" height="40" rx="6" fill="#4a3b33"/><path d="M920 576 q-26 -40 -6 -66 M920 576 q20 -36 4 -60 M920 576 q4 -50 30 -58" stroke="#3f5a3a" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  /* counter + cabinets left */
  s+=`<rect x="-200" y="150" width="740" height="260" fill="#3c312b"/>`;
  for(let i=0;i<4;i++){ if(i==3&&o.cab){ const op=o.cab, dw=160*(1-op*.88);
      s+=`<rect x="360" y="170" width="160" height="220" fill="#1f1916"/><rect x="360" y="270" width="160" height="8" fill="#4a3b33"/><rect x="360" y="380" width="160" height="10" fill="#4a3b33"/>`;
      s+=mug(392,270,.42,{noRim:1})+mug(440,270,.42,{noRim:1})+(o.cabTaken?"":mug(488,270,.42,{band:"#6f9fd6",noRim:1}))+mug(410,380,.42,{noRim:1})+mug(462,380,.42,{noRim:1});
      s+=`<rect x="${520-dw}" y="170" width="${dw}" height="220" rx="4" fill="#4b3d34"/><rect x="${520-dw-14}" y="168" width="14" height="224" fill="#5a4a40" opacity="${op}"/>`; continue;}
    s+=`<rect x="${-180+i*180}" y="170" width="160" height="220" rx="6" fill="#43372f"/><rect x="${-40+i*180}" y="270" width="8" height="34" rx="4" fill="#8a745e"/>`;}
  s+=`<rect x="-200" y="620" width="760" height="${FLOOR-620}" fill="#3a2f29"/>`;
  for(let i=0;i<4;i++) s+=`<rect x="${-180+i*185}" y="650" width="165" height="${FLOOR-670}" rx="6" fill="#42362f"/><rect x="${-34+i*185}" y="680" width="8" height="40" rx="4" fill="#8a745e"/>`;
  s+=`<rect x="-200" y="598" width="770" height="24" fill="#5a4a40"/>`;
  s+=`<rect x="330" y="590" width="180" height="10" rx="3" fill="#1c1a1a"/><circle cx="420" cy="${620+(o.knob?0:0)}" r="0"/>`;
  s+=`<g transform="rotate(${(o.knob||0)*-90} 470 640)"><circle cx="470" cy="640" r="15" fill="#2a2522"/><rect x="467" y="626" width="6" height="16" rx="3" fill="#8a745e"/></g>`;
  if(o.flame) for(let i=0;i<7;i++){const fx=360+i*20, fh=(10+6*Math.sin(t*23+i*2.1))*o.flame; s+=`<path d="M${fx-5} 592 Q${fx} ${592-fh*2} ${fx+5} 592 Z" fill="#5fa0ff" opacity=".9"/><path d="M${fx-2} 592 Q${fx} ${592-fh} ${fx+2} 592 Z" fill="#cfe4ff"/>`;}
  if(o.flame) s+=`<ellipse cx="420" cy="590" rx="120" ry="40" fill="#5f9fff" opacity="${.18*o.flame}" filter="url(#blur6)"/>`;
  s+=kettle(420,590,.9)+(o.kSteam?steam(530,497,o.kSteam,t,.7,3):"");
  s+=`<rect x="150" y="540" width="60" height="58" rx="8" fill="#6a5a4c"/><rect x="230" y="560" width="40" height="38" rx="6" fill="#7a5a3c"/>`;
  s+=wallClock(o.clock??(3+58/60))+calendar(o.date||12,o.month||"NOVEMBER",o.flip);
  /* photo frame: grandma + little boy */
  s+=`<g filter="url(#rimP)"><rect x="1510" y="395" width="90" height="108" fill="#5a463a"/></g><rect x="1520" y="405" width="70" height="88" fill="#c8b79a"/><circle cx="1543" cy="440" r="11" fill="#2a2320"/><rect x="1533" y="452" width="20" height="40" rx="8" fill="#2a2320"/><circle cx="1543" cy="429" r="6" fill="#cdc6ba"/><circle cx="1570" cy="458" r="8" fill="#2a2320"/><rect x="1563" y="466" width="15" height="26" rx="6" fill="#2a2320"/>`;
  /* door */
  s+=`<rect x="1648" y="318" width="236" height="${FLOOR-318}" fill="#2c2420"/>`;
  const dop=o.door||0, dw=208*(1-dop*.85);
  if(dop>0.01) s+=`<rect x="1662" y="332" width="208" height="${FLOOR-332}" fill="${o.doorLight||"#3a4a66"}"/>`;
  s+=`<rect x="1662" y="332" width="${dw}" height="${FLOOR-332}" fill="#4a3b33"/>`;
  if(dw>80) s+=`<rect x="1682" y="356" width="${dw-40}" height="220" fill="none" stroke="#3d3029" stroke-width="6"/><rect x="1682" y="600" width="${dw-40}" height="250" fill="none" stroke="#3d3029" stroke-width="6"/><circle cx="${1662+dw-30}" cy="600" r="9" fill="#b58d55"/>`;
  return s;}
function wallClock(cl){ const mh=(cl%1)*360, hh=(cl%12)/12*360; let s=`<g filter="url(#rimP)"><circle cx="1440" cy="270" r="58" fill="#2e2622"/><circle cx="1440" cy="270" r="48" fill="#d6ccb9"/></g>`;
  for(let i=0;i<12;i++){const a=i*30*D; s+=`<path d="M${1440+Math.sin(a)*40} ${270-Math.cos(a)*40} L${1440+Math.sin(a)*45} ${270-Math.cos(a)*45}" stroke="#3a312b" stroke-width="${i%3?2:3.5}"/>`;}
  const sec=(cl*3600)%60*6;
  return s+`<path d="M1440 270 L${1440+Math.sin(hh*D)*24} ${270-Math.cos(hh*D)*24}" stroke="#211b18" stroke-width="5" stroke-linecap="round"/><path d="M1440 270 L${1440+Math.sin(mh*D)*36} ${270-Math.cos(mh*D)*36}" stroke="#211b18" stroke-width="3.5" stroke-linecap="round"/><path d="M1440 270 L${1440+Math.sin(sec*D)*40} ${270-Math.cos(sec*D)*40}" stroke="#a3473b" stroke-width="1.6"/><circle cx="1440" cy="270" r="4" fill="#211b18"/>`;}
function calPage(date,month,x=1385,y=370){return `<rect x="${x}" y="${y}" width="96" height="124" rx="3" fill="#ddd4c4"/><rect x="${x}" y="${y}" width="96" height="26" fill="#a3473b"/><text x="${x+48}" y="${y+19}" text-anchor="middle" font-family="${SANS}" font-weight="700" font-size="13" fill="#f3e9dc" letter-spacing="2">SUNDAY</text><text x="${x+48}" y="${y+88}" text-anchor="middle" font-family="${SERIF}" font-weight="600" font-size="58" fill="#2e2622">${date}</text><text x="${x+48}" y="${y+112}" text-anchor="middle" font-family="${SANS}" font-weight="600" font-size="10" fill="#6a5d50" letter-spacing="2">${month}</text>`;}
/* flip: {from:[date,month], p:0..1} -> top page lifts up and falls away */
function calendar(date,month,flip){ let s=`<g filter="url(#rimP)"><rect x="1381" y="366" width="104" height="132" rx="4" fill="#cfc5b3"/></g><rect x="1381" y="362" width="104" height="8" fill="#5a463a"/>`+calPage(date,month);
  if(flip&&flip.p<1){ const p=flip.p, up=eio(Pr(p,0,.55)), fall=eio(Pr(p,.45,1)); const sy=Math.cos(up*Math.PI*.92);
    const pg=calPage(flip.from[0],flip.from[1]);
    s+=`<g opacity="${1-fall}" transform="translate(${fall*18} ${fall*140}) rotate(${fall*-14} 1433 370)"><g transform="translate(0 370) scale(1 ${sy.toFixed(3)}) translate(0 -370)">${sy>0?pg:`<rect x="1385" y="370" width="96" height="124" fill="#efe7d8"/>`}</g></g>`;}
  return s;}
/* chairs & table drawn in separate layers so characters sit between */
const chairL=()=>`<g filter="url(#rimP)"><rect x="788" y="548" width="20" height="${FLOOR-548}" rx="8" fill="#4b3a31"/><rect x="788" y="786" width="150" height="20" rx="6" fill="#55433a"/><rect x="918" y="800" width="14" height="${FLOOR-800}" fill="#4b3a31"/></g><rect x="792" y="560" width="12" height="200" rx="5" fill="#5e4a3f"/>`;
const chairR=()=>`<g filter="url(#rimP)"><rect x="1412" y="548" width="20" height="${FLOOR-548}" rx="8" fill="#4b3a31"/><rect x="1282" y="786" width="150" height="20" rx="6" fill="#55433a"/><rect x="1288" y="800" width="14" height="${FLOOR-800}" fill="#4b3a31"/></g>`;
function table(t,o={}){ let s=`<g filter="url(#rimP)"><rect x="1090" y="700" width="40" height="${FLOOR-700}" fill="#3e3029"/><path d="M1020 ${FLOOR} Q1110 ${FLOOR-26} 1200 ${FLOOR} Z" fill="#3e3029"/>`;
  s+=`<path d="M912 690 L1308 690 L1312 770 Q1300 786 1282 772 Q1262 786 1242 772 Q1222 786 1202 772 Q1182 786 1162 772 Q1142 786 1122 772 Q1102 786 1082 772 Q1062 786 1042 772 Q1022 786 1002 772 Q982 786 962 772 Q942 786 922 772 Q912 780 908 770 Z" fill="#cdbfa6"/></g>`;
  s+=`<rect x="912" y="690" width="396" height="9" fill="#e4d8c3"/>`;
  if(o.ring) s+=`<ellipse cx="1210" cy="694" rx="26" ry="4" fill="none" stroke="#9c7a55" stroke-width="3" opacity="${o.ring}"/>`;
  if(o.phone) s+=`<rect x="1150" y="684" width="56" height="8" rx="3" fill="#1c1c20"/>${o.phone>.5?`<rect x="1150" y="680" width="56" height="5" rx="2" fill="#bfe0ff" opacity=".8"/>`:""}`;
  const cups=o.cups||[];
  cups.forEach((c,i)=>{ if(!c) return; s+=mug(c.x,692,.62,{band:c.band})+steam(c.x,642,c.k,t,.5,i+1);});
  return s;}
function lampPend(on=1){ return `<path d="M1110 -50 L1110 300" stroke="#141110" stroke-width="4"/><path d="M1050 340 Q1110 270 1170 340 Z" fill="#2b221e"/>`+
  `<path d="M1054 338 L1166 338 L1290 700 L930 700 Z" fill="url(#cone)" opacity="${.55*on}"/><ellipse cx="1110" cy="345" rx="34" ry="10" fill="#ffe2b3" opacity="${on}"/><ellipse cx="1110" cy="560" rx="560" ry="380" fill="url(#lampG)" opacity="${on}"/>`;}

/* ---------- characters ---------- */
function CH(P,rim="rimW"){ const r=fig(P.x,P.y,P.s,P,P.dir); r.s=r.s.replaceAll('url(#rim)',`url(#${rim})`); return r;}
function GRAN(P,rim){ return CH(Object.assign({bun:1,shawl:"#b9773a",thin:.92},P),rim);}
function BOY(P,rim){ return CH(Object.assign({phones:1},P),rim);}
