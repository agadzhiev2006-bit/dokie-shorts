/* ====== 5 MORE MINUTES — 16:9 mini-film (Last Soul style: black stickmen, grey world, mood light) ====== */
const WW=1920, HH=1080, Ser="Caladea,Georgia,serif", INK="#111113";
const fade=(t,a,b,e=.4)=>clamp(Math.min((t-a)/e,(b-t)/e));
const ln=(pts,w,c=INK)=>`<path d="M${pts.map(f).join(" L")}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const R=(x,y,w,h,c,rx=0,ex="")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${c}" ${ex}/>`;

/* ---------- stickman silhouette ---------- */
/* hip at (x,y); angles: 0 = down, 90 = right. f/b arms [upper,fore], lf/lb legs [thigh,knee]. fW/bW = world IK targets */
function fig(x,y,s,P={},dir=1){
  P=Object.assign({lean:0,tilt:0,f:[18,8],b:[-14,-6],lf:[6,-2],lb:[-6,2],bob:0,col:INK,hunch:0,thin:1,brow:(window.BROW??.5),eyes:1},P);
  const c=P.col, hip=[0,P.bob], la=P.lean*D;
  const T=add(hip,[Math.sin(la)*112,-Math.cos(la)*112]), S=add(hip,[Math.sin(la)*96,-Math.cos(la)*96]);
  const na=(P.lean+P.hunch)*D, N=add(T,[Math.sin(na)*10,-Math.cos(na)*10]);
  const ca=(P.lean+P.hunch+P.tilt)*D, C=add(N,[Math.sin(ca)*44,-Math.cos(ca)*44]);
  const loc=w=>[(w[0]-x)/(s*dir),(w[1]-y)/s];
  if(P.fW) P.f=ik(S,loc(P.fW),68,64,P.fBend??1);
  if(P.bW) P.b=ik(S,loc(P.bW),68,64,P.bBend??1);
  const arm=a=>{const e=add(S,v(a[0],68));return [e,add(e,v(a[1],64))]};
  const leg=a=>{const k=add(hip,v(a[0],84));return [k,add(k,v(a[0]+a[1],84))]};
  const [eb,hb]=arm(P.b),[ef,hf]=arm(P.f),[kb,ab]=leg(P.lb),[kf,af]=leg(P.lf);
  const th=P.thin, ft=P.lean<-60?[0,-14]:[16,0], RM='filter="url(#rim)"';
  const armS=(sh,e,h)=>`<g ${RM}>${ln([sh,e,h],26*th,c)}<circle cx="${h[0].toFixed(1)}" cy="${h[1].toFixed(1)}" r="${17*th}" fill="${c}"/></g>`;
  const legS=(k,an)=>`<g ${RM}>${ln([hip,k,an],30*th,c)}${ln([an,add(an,ft)],30*th,c)}</g>`;
  let g=armS(S,eb,hb)+legS(kb,ab);
  /* torso sack + head */
  const tb=add(hip,[Math.sin(la)*8,-Math.cos(la)*8]), ts=add(hip,[Math.sin(la)*90,-Math.cos(la)*90]);
  let body=ln([tb,ts],72*th,c)+(P.belly?`<ellipse cx="${lerp(hip[0],S[0],.4)+14}" cy="${lerp(hip[1],S[1],.4)}" rx="${26*P.belly}" ry="${30*P.belly}" fill="${c}"/>`:"")+`<circle cx="${C[0].toFixed(1)}" cy="${C[1].toFixed(1)}" r="46" fill="${c}"/>`;
  if(P.hat) body+=`<g transform="translate(${f(C)}) rotate(${P.lean+P.hunch+P.tilt})"><rect x="-62" y="-38" width="124" height="13" rx="6" fill="${c}"/><path d="M-36,-32 Q-36,-80 0,-82 Q36,-80 36,-32 Z" fill="${c}"/></g>`;
  g+=`<g ${RM}>${body}</g>`;
  g+=legS(kf,af);
  /* face: eyes + brows (side-ish: shifted toward facing dir) */
  if(P.eyes){const R0=(px,py)=>{const cs=Math.cos(ca),sn=Math.sin(ca);return [C[0]+px*cs-py*sn, C[1]+px*sn+py*cs];};
    const ey=P.eyeY||0, eh=6.5*(1-(P.blink||0));
    for(const ex of [6,30]){const sd=ex<18?1:-1, e=R0(ex,2+ey), bi=R0(ex+sd*6,-14-P.brow*7), bo=R0(ex-sd*7,-14+P.brow*3), bm=R0(ex-sd*1,-17-P.brow*2);
      g+=`<ellipse cx="${e[0].toFixed(1)}" cy="${e[1].toFixed(1)}" rx="5" ry="${Math.max(.8,eh).toFixed(1)}" fill="#efe8d6" transform="rotate(${(P.lean+P.hunch+P.tilt)} ${e[0].toFixed(1)} ${e[1].toFixed(1)})"/>`;
      const [L,Rr]=ex<18?[bo,bi]:[bi,bo]; g+=`<path d="M${f(ex<18?bo:bi)} Q${f(bm)} ${f(ex<18?bi:bo)}" stroke="#8b9098" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;}}
  if(P.veil) g+=`<path d="M${f(add(C,[-8,-38]))} Q${f(add(C,[-80,50]))} ${f(add(C,[-56,170]))} L${f(add(C,[14,40]))} Z" fill="#e8e8ea" opacity=".85"/>`;
  if(P.ph) g+=`<rect x="${hf[0]-10}" y="${hf[1]-30}" width="20" height="36" rx="4" fill="#1b1b1f" stroke="${P.ph>.5?"#bfe0ff":"#333"}" stroke-width="3" transform="rotate(${P.phr||0} ${hf[0]} ${hf[1]})"/>`;
  g+=armS(S,ef,hf);
  if(P.cane) g+=`<g ${RM}>${ln([hf,[hf[0]+10,P.cane]],8,c)}</g>`;
  const toWd=p=>[x+p[0]*s*dir,y+p[1]*s];
  return {s:`<g transform="translate(${x} ${y}) scale(${s*dir} ${s})">${g}</g>`,hf:toWd(hf),hb:toWd(hb),C:toWd(C),S:toWd(S)};}
/* poses */
const RUN=(t,sp=9,k=1)=>{const p=t*sp,sw=Math.sin(p);return {lean:12*k,bob:-Math.abs(Math.cos(p))*12*k,lf:[sw*38*k,-(10+60*Math.max(0,-sw))*k],lb:[-sw*38*k,-(10+60*Math.max(0,sw))*k],f:[-sw*45*k+20,-sw*20*k+110*k],b:[sw*45*k+20,sw*20*k+110*k]};};
const WALK=(t,sp=4.5,k=1)=>{const p=t*sp,sw=Math.sin(p);return {bob:-Math.abs(Math.cos(p))*5,lf:[sw*24*k,-Math.max(0,-sw)*30*k],lb:[-sw*24*k,-Math.max(0,sw)*30*k],f:[-sw*20*k,-6],b:[sw*20*k,-6]};};
const SITP={lf:[90,-90],lb:[86,-86]};
const LIE={lean:-90,lf:[90,0],lb:[92,0],f:[90,90],b:[88,90],tilt:0};
const glow=(p,r=150,o=1)=>`<ellipse cx="${p[0]}" cy="${p[1]}" rx="${r}" ry="${r*.85}" fill="url(#gPh)" opacity="${o}" style="mix-blend-mode:screen"/>`;

/* ---------- colour grade (multiply tint + darken) ---------- */
const GR={warm:["#ffb36e",.45,0],dawn:["#ffc68a",.32,0],eve:["#d8c39f",.25,.06],dim:["#8a9bd0",.45,.14],cold:["#3f5fe0",.66,.3],deep:["#2b45c0",.7,.45],night:["#3550c8",.5,.12],bench:["#5068d0",.42,.04],bright:["#fff0d4",.16,0],sun:["#ffe1b0",.22,0],none:["#fff",0,0]};
function grade(g,k=0){const [c,o,d]=typeof g==="string"?GR[g]:g;
  return `<rect x="-2000" y="-2000" width="6000" height="6000" fill="${c}" opacity="${o}" style="mix-blend-mode:multiply"/><rect x="-2000" y="-2000" width="6000" height="6000" fill="#000" opacity="${clamp(d+k)}"/>`;}
const mixG=(a,b,k)=>{const A=GR[a],B=GR[b],h=x=>[1,3,5].map(i=>parseInt(x.substr(i,2),16)),ca=h(A[0]),cb=h(B[0]);
  return ["#"+ca.map((v,i)=>Math.round(lerp(v,cb[i],k)).toString(16).padStart(2,"0")).join(""),lerp(A[1],B[1],k),lerp(A[2],B[2],k)];};

/* ---------- props ---------- */
function handS(p,ang=0,type="point",sc=1,rim="#b8bdc5"){const o=`fill="${INK}" stroke="${rim}" stroke-width="${5/sc}"`;
  return `<g transform="translate(${p[0]} ${p[1]}) rotate(${ang}) scale(${sc})"><rect x="-40" y="10" width="80" height="800" rx="34" ${o}/><rect x="-50" y="-44" width="100" height="96" rx="42" ${o}/>${type==="point"?`<rect x="-16" y="-130" width="32" height="104" rx="16" ${o}/>`:type==="open"?[-36,-12,12,36].map(dx=>`<rect x="${dx-11}" y="-128" width="22" height="100" rx="11" ${o}/>`).join("")+`<rect x="34" y="-66" width="26" height="86" rx="13" transform="rotate(30 40 18)" ${o}/>`:""}</g>`;}
function phoneBig(cx,cy,s,screen){return `<g transform="translate(${cx} ${cy}) scale(${s})"><rect x="-210" y="-410" width="420" height="820" rx="56" fill="#141416" stroke="#3a3a3e" stroke-width="10"/><svg x="-186" y="-380" width="372" height="760" viewBox="-186 -380 372 760"><rect x="-186" y="-380" width="372" height="760" rx="36" fill="#0d1120"/>${screen}</svg><rect x="-50" y="-372" width="100" height="22" rx="11" fill="#000"/></g>`;}
function feed(scroll){let s=""; for(let i=-1;i<9;i++){const y=-360+i*300-(scroll%300), k=Math.floor(scroll/300)+i;
  s+=R(-170,y,340,280,"#1c2236",18)+R(-150,y+18,300,170,["#3b4566","#56406a","#3d5a5a","#5a4a3a"][((k%4)+4)%4],12)+R(-150,y+202,180,16,"#4a5272",8)+R(-150,y+230,120,14,"#39405c",7)+heart(120,y+225,.6,.9);
  s+=`<path d="M${-30},${y+80} l60,23 l-60,23 Z" fill="#fff" opacity=".7"/>`;} return s;}
function heart(x,y,s,op=1,c="#ff3b5c"){return `<path transform="translate(${x} ${y}) scale(${s})" d="M0,30 C-50,-5 -40,-45 -12,-40 C0,-38 0,-28 0,-22 C0,-28 0,-38 12,-40 C40,-45 50,-5 0,30 Z" fill="${c}" opacity="${op}"/>`;}
function bigClock(t,str,col="#ff3b30",sub="",shake=0){
  let s=R(0,0,WW,HH,"#161618")+`<ellipse cx="960" cy="560" rx="760" ry="420" fill="${col}" opacity=".10" filter="url(#bl3)"/>`;
  const sx=shake?Math.sin(t*80)*shake:0;
  s+=`<g transform="translate(${sx} 0)">`+R(330,250,1260,560,"#232326",60)+R(370,290,1180,480,"#0b0b0c",40)+R(330,800,1260,40,"#1a1a1c",20);
  s+=`<g filter="url(#led)">${T_(960,690,str,330,{f:"DejaVu Sans Mono,monospace",w:700,c:col,ls:10})}</g>`;
  s+=T_(1450,350,"AM",40,{c:col,f:"monospace",w:700,op:.8})+(sub?T_(960,935,sub,44,{c:col,ls:8,w:800,op:.9}):"")+`</g>`;
  return s;}
function laptopBig(t,screen){return R(0,0,WW,HH,"#2a2a2d")+R(0,860,WW,220,"#3a3a3e")+`<g transform="translate(960 470)">${R(-600,-380,1200,760,"#18181a",30)}<svg x="-560" y="-340" width="1120" height="680" viewBox="-560 -340 1120 680">${R(-560,-340,1120,680,"#0e1220")}${screen}</svg></g>`+`<path d="M260,850 L1660,850 L1760,920 L160,920 Z" fill="#202023"/>`;}
function digital(x,y,str,on=1,ring=0,t=0){let s=`<g transform="translate(${x} ${y})">`+R(-58,-30,116,58,"#1d1d20",12)+R(-50,-22,100,40,"#0a0a0b",8)+T_(0,10,str,30,{f:"DejaVu Sans Mono,monospace",w:700,c:on?"#ff3b30":"#5a1a18"});
  if(ring) for(let i=0;i<3;i++) s+=`<path d="M${-74-i*16},-26 q-12,26 0,52 M${74+i*16},-26 q12,26 0,52" stroke="#e8e8ea" stroke-width="4" fill="none" opacity="${(.4+.6*Math.abs(Math.sin(t*20+i)))*ring}"/>`;
  return s+`</g>`;}

/* ---------- the room (grey, detailed) ---------- */
function room(t,o){
  o=Object.assign({sky:"day",clock:"7:00",ring:0,lap:0,note:1,peel:0,wc:[7,0],lamp:0,lapGlow:0},o);
  const night=o.sky==="night";
  let s=R(0,0,WW,HH,night?"#7d7f86":"#a9a9ac");
  for(let i=0;i<49;i++) s+=R(i*40,40,2,780,night?"#74767c":"#9f9fa2");
  s+=R(0,0,WW,36,"#8c8c90")+R(0,36,WW,6,"#c2c2c5");
  /* floor */
  s+=R(0,830,WW,250,"#6c6c70"); for(let i=0;i<6;i++) s+=R(0,850+i*40,WW,3,"#5c5c60");
  for(let i=0;i<40;i++) s+=R(Math.floor(hash(i*1.7)*1900),850+(i%6)*40,3,40,"#5c5c60");
  s+=R(0,808,WW,24,"#cfcfd2")+R(0,830,WW,4,"#4a4a4e");
  s+=`<ellipse cx="1010" cy="935" rx="430" ry="58" fill="#58585c"/><ellipse cx="1010" cy="935" rx="390" ry="46" fill="none" stroke="#7a7a7e" stroke-width="5" stroke-dasharray="16 10"/>`;
  /* window + city */
  const sky={day:["#dcdcde","#f2f2f2"],dawn:["#d2d2d4","#f4f4f4"],eve:["#9d9da1","#c9c9cb"],night:["#23252c","#3a3d46"]}[o.sky];
  s+=`<defs><linearGradient id="rsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs>`+R(150,150,380,400,"url(#rsky)");
  if(o.sky==="dawn") s+=`<circle cx="420" cy="470" r="70" fill="#fff" opacity=".85"/>`;
  if(night) s+=`<circle cx="450" cy="215" r="30" fill="#e9e9e2"/><circle cx="464" cy="206" r="27" fill="${sky[0]}"/>`;
  for(let i=0;i<9;i++){const bx=150+i*43, bh=70+hash(i*3.3)*180; s+=R(bx,550-bh,40,bh,night?"#17181d":"#b9b9bc");
    for(let j=0;j<Math.floor(bh/34);j++) for(let q=0;q<2;q++) if(hash(i*9+j*3+q)>.45) s+=R(bx+7+q*16,550-bh+12+j*34,9,14,night?(hash(i+j+q*5)>.5?"#d8cf9a":"#2a2b31"):"#a5a5a8");}
  s+=`<rect x="150" y="150" width="380" height="400" fill="none" stroke="#e4e4e6" stroke-width="16"/><path d="M340,150 V550 M150,350 H530" stroke="#e4e4e6" stroke-width="10"/>`+R(126,548,428,20,"#d9d9db",4);
  s+=`<path d="M96,128 Q126,350 104,610 L176,610 Q156,350 176,128 Z" fill="#78787d"/><path d="M584,128 Q554,350 576,610 L504,610 Q524,350 504,128 Z" fill="#78787d"/>`+R(76,118,528,12,"#505054",6);
  /* shelf + books above nightstand area */
  s+=R(640,330,300,14,"#6a6a6e",3); for(let i=0;i<9;i++){const h=50+hash(i*4.1)*40; s+=R(652+i*22,330-h,18,h,["#5b5b60","#86868b","#707075","#9a9a9e"][i%4],2);}
  s+=R(870,272,52,58,"#8f8f93",4)+R(878,280,36,42,"#c8c8cb",2);
  /* frame */
  s+=R(680,420,190,140,"#58585c",4)+R(694,434,162,112,"#c4c4c7")+`<path d="M700,540 L750,480 L790,520 L820,490 L850,540 Z" fill="#8d8d91"/>`;
  /* wall clock */
  const [hh,mm]=o.wc; s+=`<g transform="translate(1230 230)"><circle r="64" fill="#efefef" stroke="#3a3a3e" stroke-width="9"/>${[...Array(12)].map((_,i)=>`<path d="M${Math.sin(i*.5236)*48},${-Math.cos(i*.5236)*48} L${Math.sin(i*.5236)*55},${-Math.cos(i*.5236)*55}" stroke="#3a3a3e" stroke-width="4"/>`).join("")}<path d="M0,0 L${Math.sin(((hh%12)+mm/60)*.5236)*30},${-Math.cos(((hh%12)+mm/60)*.5236)*30}" stroke="#222" stroke-width="8" stroke-linecap="round"/><path d="M0,0 L${Math.sin(mm*.1047)*46},${-Math.cos(mm*.1047)*46}" stroke="#222" stroke-width="5" stroke-linecap="round"/><circle r="6" fill="#222"/></g>`;
  /* bed */
  s+=R(132,560,28,272,"#555559",6)+R(140,700,600,70,"#626266",8)+R(150,770,16,60,"#4a4a4e")+R(716,770,16,60,"#4a4a4e")+R(148,690,590,24,"#d8d8da",10);
  s+=`<path d="M170,694 Q170,650 220,652 L300,656 Q328,660 324,694 Z" fill="#ececee"/>`;
  /* nightstand + alarm */
  s+=R(12,650,112,182,"#7a7a7e",6)+R(20,700,96,4,"#5a5a5e")+`<circle cx="68" cy="740" r="6" fill="#4a4a4e"/>`+digital(68,622,o.clock,1,o.ring,t);
  /* plant */
  s+=`<g transform="translate(1080 830)"><path d="M-36,-90 L36,-90 L28,0 L-28,0 Z" fill="#5f5f63"/>${[-50,-25,0,25,50].map((a,i)=>`<path d="M0,-90 q${Math.sin(a*D)*50},-80 ${Math.sin(a*D)*90},-${150+hash(i)*60}" stroke="#3f3f43" stroke-width="16" fill="none" stroke-linecap="round"/>`).join("")}</g>`;
  /* desk + chair */
  s+=R(1300,640,420,24,"#5e5e62",5)+R(1316,664,18,166,"#4a4a4e")+R(1690,664,18,166,"#4a4a4e")+R(1540,664,150,100,"#56565a")+R(1555,705,120,3,"#7a7a7e");
  s+=`<g transform="translate(1680 640)">${R(-34,-10,68,10,"#2a2a2e",4)}<path d="M0,-10 L-24,-130 L12,-170" stroke="#2a2a2e" stroke-width="9" fill="none"/><path d="M-12,-182 L60,-204 L68,-156 L0,-140 Z" fill="#2a2a2e"/>${o.lamp?`<ellipse cx="40" cy="-120" rx="160" ry="120" fill="#ffd59a" opacity=".35" filter="url(#bl3)"/>`:""}</g>`;
  if(o.lap) s+=`<path d="M1380,628 L1560,628 L1586,520 L1406,520 Z" fill="#232326"/><path d="M1392,620 L1552,620 L1574,530 L1414,530 Z" fill="${o.lapGlow?"#cfe6ff":"#3a3a3e"}"/>${o.lapGlow?`<ellipse cx="1480" cy="560" rx="200" ry="150" fill="#cfe6ff" opacity=".3" filter="url(#bl3)"/>`:""}`;
  s+=R(1370,626,200,14,"#2a2a2e",4);
  s+=R(1150,560,22,180,"#3e3e42",8)+R(1150,722,170,22,"#47474b",8)+R(1226,744,14,80,"#2e2e32")+`<path d="M1170,826 L1300,826" stroke="#2e2e32" stroke-width="12" stroke-linecap="round"/>`;
  /* sticky note */
  if(o.note){const p=o.peel, y=430+eio(clamp((p-.45)/.55))*260, r=-4+p*40*(p<.45?p/.45:1)+(p>.45?(p-.45)*120:0);
    if(y<650||p<1) s+=`<g transform="translate(${1500+p*30} ${y}) rotate(${r})"><rect x="-70" y="-50" width="140" height="100" fill="#d9d9c4"/><rect x="-70" y="-50" width="140" height="16" fill="rgba(0,0,0,.08)"/>${T_(0,0,"START",26,{c:"#1b1b1b",w:900})}${T_(0,32,"THE THING",22,{c:"#1b1b1b",w:900})}</g>`;}
  /* door + gym bag */
  s+=R(1745,270,160,562,"#828286")+R(1745,270,160,562,"none",0,`stroke="#5a5a5e" stroke-width="10"`)+R(1770,300,110,200,"#78787c",4)+R(1770,530,110,260,"#78787c",4)+`<circle cx="1772" cy="560" r="10" fill="#d2d2d4"/>`;
  s+=`<g transform="translate(1690 830)">${R(-80,-66,160,66,"#38383c",26)}<path d="M-40,-66 Q0,-118 40,-66" stroke="#222" stroke-width="9" fill="none"/>${R(-60,-44,120,6,"#55555a",3)}</g>`;
  return s;}
/* blanket drawn over a lying figure */
const blanket=(dark=0)=>`<path d="M300,700 Q320,640 420,646 Q560,630 740,650 L740,770 L300,770 Z" fill="${dark?"#4a4a50":"#8a8a8f"}"/><path d="M360,700 Q450,676 520,700 M560,690 Q640,670 720,690" stroke="${dark?"#3a3a40":"#78787d"}" stroke-width="5" fill="none"/>`;
const BEDHIP=[400,688], BS=1.3;
function inBed(t,o={}){ // lying hero (optionally with phone)
  const P=Object.assign({},LIE,o.P||{});
  if(o.phone) {P.fW=[BEDHIP[0]-160+30,BEDHIP[1]-150]; P.ph=1; P.fBend=-1;}
  if(o.reach!=null){P.fW=[lerp(300,92,o.reach),lerp(680,600,o.reach)]; P.fBend=-1;}
  const m=fig(BEDHIP[0],BEDHIP[1],BS,P,1); return {s:m.s+blanket(o.dark),m};}

/* ---------- other backgrounds ---------- */
function street(t,o={}){o=Object.assign({sp:0,night:0},o); const N=o.night;
  let s=R(0,0,WW,HH,N?"#2a2c33":"#cfcfd2");
  const L=(sp,y0,hb,col,win,seed)=>{let r=""; const off=(t*sp)%2400; for(let k=-1;k<2;k++) for(let i=0;i<10;i++){const w=160+hash(i+seed)*120, x=k*2400+i*240-off, h=hb+hash(i*3+seed)*220;
    r+=R(x,y0-h,w,h,col); for(let j=0;j<Math.floor(h/60);j++) for(let q=0;q<Math.floor(w/46);q++) r+=R(x+14+q*46,y0-h+20+j*60,24,32,win(i,j,q));} return r;};
  s+=L(o.sp*.25,640,180,N?"#1c1d22":"#b4b4b8",()=>N?"#26272d":"#a6a6aa",3);
  s+=L(o.sp*.6,760,260,N?"#141519":"#8e8e92",(i,j,q)=>N?(hash(i*7+j+q*3)>.7?"#d6cb92":"#202126"):"#7c7c80",11);
  s+=R(0,760,WW,90,N?"#3a3b41":"#9a9a9e")+R(0,760,WW,10,N?"#4a4b52":"#b8b8bc")+R(0,850,WW,230,N?"#202125":"#5e5e62")+R(0,850,WW,8,"#7a7a7e");
  for(let i=-1;i<12;i++) s+=R(i*220-(t*o.sp)%220,960,110,10,"#cfcfd2",3,`opacity=".5"`);
  for(let i=-1;i<5;i++){const x=i*520-(t*o.sp)%520+200; s+=R(x,420,12,350,N?"#0e0e10":"#404044")+R(x-40,410,60,14,N?"#0e0e10":"#404044",6);
    if(N) s+=`<ellipse cx="${x-20}" cy="560" rx="140" ry="240" fill="#ffd59a" opacity=".12" filter="url(#bl3)"/>`;}
  return s;}
function park(t,o={}){o=Object.assign({sp:0,sun:.5},o);
  let s=`<defs><linearGradient id="psky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6e6e8"/><stop offset="1" stop-color="#f7f7f7"/></linearGradient></defs>`+R(0,0,WW,HH,"url(#psky)");
  s+=`<circle cx="1500" cy="${lerp(420,180,o.sun)}" r="80" fill="#fff"/><ellipse cx="1500" cy="${lerp(420,180,o.sun)}" rx="260" ry="220" fill="#fff" opacity=".6" filter="url(#bl3)"/>`;
  s+=`<path d="M0,640 Q300,560 640,620 T1300,600 T1920,610 L1920,800 L0,800 Z" fill="#c6c6c9"/>`;
  const off=(t*o.sp*.5)%600, off2=(t*o.sp)%700;
  for(let i=-1;i<5;i++){const x=i*600-off; s+=`<g transform="translate(${x} 0)"><circle cx="150" cy="560" r="80" fill="#aaaaae"/><circle cx="230" cy="590" r="60" fill="#a2a2a6"/><circle cx="420" cy="580" r="70" fill="#aaaaae"/></g>`;}
  s+=R(0,700,WW,380,"#9a9a9e")+R(0,780,WW,110,"#c9c9cc")+R(0,780,WW,6,"#b0b0b4");
  for(let i=-1;i<5;i++){const x=i*700-off2; s+=`<g transform="translate(${x} 0)">${R(300,500,26,290,"#4a4a4e")}<circle cx="313" cy="470" r="110" fill="#6a6a6e"/><circle cx="250" cy="520" r="70" fill="#727276"/><circle cx="380" cy="510" r="80" fill="#66666a"/>${R(520,740,140,12,"#4a4a4e")+R(530,752,8,40,"#4a4a4e")+R(642,752,8,40,"#4a4a4e")}</g>`;}
  for(let i=0;i<20;i++){const x=((hash(i)*WW-(t*o.sp*1.6))%WW+WW)%WW; s+=R(x,900+hash(i*5)*150,40,6,"#8a8a8e",3);}
  return s;}
function bench(t,o={}){ // night street, one warm lamp
  let s=R(0,0,WW,HH,"#24262d");
  for(let i=0;i<8;i++){const x=i*250-40, h=300+hash(i*2.2)*260; s+=R(x,760-h,220,h,"#17181d"); for(let j=0;j<Math.floor(h/70);j++) for(let q=0;q<4;q++) if(hash(i*13+j*5+q)>.82) s+=R(x+20+q*50,760-h+30+j*70,24,34,"#cfc390",0,`opacity=".55"`);}
  s+=R(0,760,WW,320,"#3a3b42")+R(0,760,WW,8,"#4c4d55");
  s+=`<path d="M1050,250 L780,880 L1440,880 Z" fill="url(#gCone)" style="mix-blend-mode:screen"/><ellipse cx="1110" cy="880" rx="380" ry="70" fill="#ffd59a" opacity=".22"/>`;
  s+=R(1094,210,16,670,"#0e0e10")+`<path d="M1102,214 Q1100,170 1050,176 L1020,188 L1080,206" stroke="#0e0e10" stroke-width="12" fill="none"/>`+R(1010,184,90,22,"#0e0e10",8)+`<ellipse cx="1050" cy="212" rx="40" ry="12" fill="#ffe3b0"/><ellipse cx="1050" cy="240" rx="220" ry="160" fill="url(#gLamp)" style="mix-blend-mode:screen"/>`;
  s+=R(880,770,500,20,"#4a3f35",6)+R(880,720,500,14,"#4a3f35",6)+R(880,690,500,14,"#4a3f35",6)+R(910,790,14,90,"#151517")+R(1336,790,14,90,"#151517")+R(910,690,10,100,"#151517")+R(1340,690,10,100,"#151517");
  return s;}
function hall(t,o){ // two rooms, door between
  let s=R(0,0,WW,HH,"#b0b0b3")+R(960,0,960,HH,"#9c9c9f");
  for(let i=0;i<24;i++) s+=R(i*40,40,2,780,"#a5a5a8");
  s+=R(0,830,WW,250,"#6c6c70")+R(0,808,WW,24,"#cfcfd2");
  s+=R(880,220,180,612,"#3c3c40")+R(870,210,200,14,"#e0e0e2")+R(870,210,14,622,"#e0e0e2")+R(1056,210,14,622,"#e0e0e2");
  s+=R(1180,640,220,16,"#5a5a5e",4)+R(1196,656,12,176,"#4a4a4e")+R(1372,656,12,176,"#4a4a4e");
  if(o.phoneOn) s+=R(1270,620,46,20,"#1b1b1f",5)+(o.phoneOn>1?`<ellipse cx="1293" cy="620" rx="90" ry="50" fill="#8fc8ff" opacity=".35" filter="url(#bl1)"/>`:"");
  return s;}
const doorPanel=k=>R(884,224,lerp(0,172,k),606,"#8a8a8e")+(k>.6?`<circle cx="${884+lerp(0,172,k)-24}" cy="560" r="10" fill="#d2d2d4"/>`:"");

/* ---------- text ---------- */
let TXT="";
const CAPS=[]; const say=(a,b,str,o={})=>CAPS.push([a,b,str,o]);
function drawCaps(t){if(window.NOCAP) return; for(const [a,b,str,o] of CAPS){const op=fade(t,a,b,o.e??.4); if(op<=0) continue; const y=o.y??970, sz=o.sz||56, c=o.c||"#fff";
  TXT+=`<g opacity="${op.toFixed(3)}">${T_(WW/2+3,y+4,str,sz,{f:Ser,it:1,w:700,c:"rgba(0,0,0,.75)"})}${T_(WW/2,y,str,sz,{f:Ser,it:1,w:700,c})}</g>`;}}
const typeT=(t,a,b,str,y,sz=78,c="#fff")=>{const n=Math.floor(clamp(Pr(t,a,b))*str.length); return T_(WW/2,y,str.slice(0,n)+(Math.floor(t*3)%2&&n<str.length?"|":""),sz,{f:Ser,it:1,w:700,c});};
const hud=(txt,op=1,x=60)=>{TXT+=`<g opacity="${op}">${R(x,56,90+txt.length*27,70,"rgba(0,0,0,.55)",14)}${T_(x+30,104,txt,40,{a:"start",ls:4})}</g>`;};
const counter=(txt,op=1,col="#fff",sz=150)=>{if(!txt) return; TXT+=`<g opacity="${op}">${R(WW/2-txt.length*sz*.38,330-sz*.95,txt.length*sz*.76,sz*1.25,"rgba(0,0,0,.55)",24)}${T_(WW/2+5,330+5,txt,sz,{c:"rgba(0,0,0,.6)",w:900,ls:6})}${T_(WW/2,330,txt,sz,{c:col,w:900,ls:6})}</g>`;};
const notif=(t,a,b,title,body,y=70)=>{const k=eo(Pr(t,a,a+.4))*(1-eo(Pr(t,b-.35,b))); if(k<=0) return; const yy=lerp(-200,y,k);
  TXT+=`<g transform="translate(${WW/2} ${yy})">${R(-430,0,860,150,"rgba(28,28,32,.94)",34)}${R(-400,32,86,86,"#3a3a40",20)}${T_(-357,90,title[0],44,{c:"#fff",w:900})}${T_(-290,64,title,34,{a:"start",c:"#fff",w:800})}${T_(-290,110,body,32,{a:"start",c:"#c9c9cf",w:500})}</g>`;};

/* ---------- scenes [a,b,fn,cam:[cx,cy,z0,z1]] ---------- */
const SC=[]; let CAMO=null;
/* H1 alarm slap (0-2) */
const fH1=t=>{const pr=t>1.05; let scr=T_(0,-170,"7:00",130,{c:"#fff",w:300})+T_(0,-104,"ALARM",30,{c:"#9fb3d6",ls:8})+R(-150,90,300,96,pr?"#ffb000":"#ff9500",48)+T_(0,152,"SNOOZE",40,{c:"#1b1b1b",w:900});
  let s=R(0,0,WW,HH,"#1a1916")+`<ellipse cx="960" cy="540" rx="560" ry="440" fill="#ffb36e" opacity=".22" filter="url(#bl3)"/>`;
  s+=`<g transform="translate(${pr?0:Math.sin(t*80)*9} 0)">${phoneBig(960,560,1,scr)}</g>`;
  const k=eio(Pr(t,.7,1.05)); s+=handS([lerp(1300,990,k),lerp(1100,700,k)],-14,"open",1.4);
  return s+grade("warm");};
SC.push([0,2,fH1,[960,540,1.1,1.2]]); say(1.05,2,"5 more minutes.");
/* H2 desk -> phone (2-4) */
const fH2=t=>{let s=room(t,{sky:"eve",wc:[19,40],lap:0}); const ph=eio(Pr(t,2.5,3.2));
  const m=fig(1220,731,1.15,Object.assign({},SITP,{fW:[lerp(1460,1330,ph),lerp(624,632,ph)],fBend:-1,bW:[1360,640],ph:ph>.6?1:0,tilt:ph*30,eyeY:ph*6}),1);
  s+=R(1440,618,40,10,"#1b1b1f",3,`opacity="${1-ph}"`)+m.s+(ph>.6?glow([m.C[0]+40,m.C[1]+10],120):""); return s+grade("eve");};
SC.push([2,4,fH2,[1320,540,1.55,1.7]]); say(2.3,4,"5 minutes.");
/* H3 night bed clock jumps (4-6) */
const fH3=t=>{const st=t<4.6?"1:05":t<5.3?"1:40":"2:30"; let s=room(t,{sky:"night",clock:st}); const b=inBed(t,{phone:1,dark:1}); s+=b.s+glow([b.m.C[0]+40,b.m.C[1]-60],200);
  s+=`<g transform="translate(800 330)">${R(-230,-110,460,200,"#0b0b0c",30)}<g filter="url(#led)">${T_(0,50,st,150,{f:"DejaVu Sans Mono,monospace",w:700,c:"#ff3b30"})}</g></g>`; return s+grade("cold");};
SC.push([4,6,fH3,[520,560,1.25,1.35]]);
/* H4 rapid cuts + counter (6-8) */
SC.push([6,8,t=>{const i=Math.floor((t-6)*7)%3, fn=[fH1,fH2,fH3][i], tt=[1.6,3.6,5.6][i]; CAMO=[[960,540,1.2],[1320,540,1.7],[520,560,1.35]][i];
  const s=fn(tt); const v=["5 MIN","45 MIN","6 HOURS","10 YEARS"][Math.min(3,Math.floor((t-6)/.5))];
  counter(v,1,Math.floor((t-6)/.5)>=3?"#ff4a4a":"#fff",170); return s;},[960,540,1,1]]);
/* H5 black line (8-9.4) */
SC.push([8,9.4,t=>R(0,0,WW,HH,"#000")+typeT(t,8.1,8.9,"This is how he lost 10 years.",560,76),[960,540,1,1]]);
/* H6 title (9.4-10.6) */
SC.push([9.4,10.6,t=>{const k=eo(Pr(t,9.4,9.9)); return R(0,0,WW,HH,"#000")+`<g opacity="${k}" transform="translate(960 560) scale(${lerp(1.15,1,k)})">${T_(0,0,"5 MORE MINUTES",150,{w:900,ls:18})}${R(-560,40,1120,6,"#ff3b30")}</g>`;},[960,540,1,1]]);

/* 1a dawn, alarm, slap (10.6-16) */
SC.push([10.6,16,t=>{const rg=t<13.1?1:0, re=t>12.4&&t<13.6?Math.sin(Pr(t,12.4,13.6)*Math.PI):0;
  let s=room(t,{sky:"dawn",clock:"7:00",ring:rg}); const b=inBed(t,{reach:re>0?re:null,P:re>0?{}:{}}); s+=b.s;
  s+=`<ellipse cx="340" cy="420" rx="420" ry="320" fill="#ffd9a8" opacity=".35" filter="url(#bl3)" style="mix-blend-mode:screen"/>`;
  return s+grade("warm");},[330,600,1.5,1.65]]);
say(13.3,16,"5 more minutes...");
/* 1b big clock snoozes (16-24) */
SC.push([16,24,t=>{const k=t<18?0:t<20?1:t<22?2:3, str=["7:05","7:10","7:35","7:35"][k], late=k>=2;
  let s=bigClock(t,str,"#ff3b30",late?"YOU'RE LATE":"SNOOZE",late?6:0);
  for(const p of [17.2,19.2]){const q=Pr(t,p,p+.6); if(q>0&&q<1){const y=lerp(1200,780,Math.sin(q*Math.PI)); s+=handS([1120,y],-10,"open",1.6);}}
  if(late&&Math.floor(t*4)%2) s+=R(0,0,WW,HH,"#ff0000",0,`opacity=".06"`);
  return s+grade(mixG("warm","dim",k/3));},[960,540,1,1.08]]);
/* 1c jumps out, panic (24-32) */
SC.push([24,32,t=>{let s=room(t,{sky:"day",clock:"7:35"}); if(t<24.6){s+=inBed(t).s;}
  else {const k=Pr(t,24.6,31.8), x=lerp(450,1500,.5-.5*Math.cos(k*Math.PI*3)), dir=Math.sin(k*Math.PI*3)>0?1:-1;
    s+=blanket().replace("Q320,640 420,646","Q330,690 420,700")+fig(x,606,1.3,Object.assign(RUN(t,13),{f:[30+Math.sin(t*20)*25,150],b:[-30+Math.cos(t*18)*25,-150],tilt:-10}),dir).s;
    s+=`<path d="M${x-60},500 l-20,-30 M${x+60},500 l20,-30 M${x},470 l0,-36" stroke="${INK}" stroke-width="6" stroke-linecap="round" opacity="${.5+.5*Math.sin(t*16)}"/>`;}
  return s+grade("dawn");},[960,560,1.05,1.1]]);
say(25,27.8,"Shit."); say(28.2,31.6,"SHIT.",{sz:80});
/* 1d street run + boss text (32-40) */
SC.push([32,40,t=>street(t,{sp:900})+fig(900,682,1.15,RUN(t,12),1).s+grade("bright"),[960,560,1.05,1.12]]);
/* 1e slow walk (40-50) */
SC.push([40,50,t=>street(t,{sp:160})+fig(860,682,1.15,Object.assign(WALK(t,3.2,.8),{hunch:22,lean:4}),1).s+grade("none"),[900,600,1.25,1.4]]);
say(42,49,"Tomorrow I'll wake up on time.");

/* 2a desk, closed laptop (50-58) */
const deskSit=(t,o={})=>{const ph=o.ph||0; return fig(1220,731,1.15,Object.assign({},SITP,{fW:ph?[1330,632]:[1400,630],fBend:-1,bW:[1360,640],ph:ph?1:0,tilt:ph?30:o.tilt||0,eyeY:ph?6:0}),1);};
SC.push([50,58,t=>{let s=room(t,{sky:"eve",wc:[19,lerp(0,10,Pr(t,50,58))]}); s+=deskSit(t,{tilt:8}).s; return s+grade("eve");},[1360,500,1.3,1.42]]);
say(51,57.6,"Okay. In 5 minutes I start.");
/* 2b picks phone, clock spins (58-66) */
SC.push([58,66,t=>{const ph=eio(Pr(t,59,60)); let s=room(t,{sky:"eve",wc:[19+(t-58)*.6,(10+(t-58)*90)%60]});
  const m=fig(1220,731,1.15,Object.assign({},SITP,{fW:[lerp(1460,1330,ph),lerp(624,632,ph)],fBend:-1,bW:[1360,640],ph:ph>.6?1:0,tilt:ph*30,eyeY:ph*6}),1);
  s+=R(1440,618,40,10,"#1b1b1f",3,`opacity="${ph>.1?0:1}"`)+m.s+(ph>.6?glow([m.C[0]+40,m.C[1]+10],130):""); return s+grade(mixG("eve","dim",Pr(t,60,66)));},[1300,470,1.15,1.3]]);
/* 2c feed close-up (66-75) */
SC.push([66,75,t=>{const sc=(t-66)*260+Math.sin(t*3)*30; let s=R(0,0,WW,HH,"#101218")+`<ellipse cx="960" cy="540" rx="560" ry="440" fill="#6fb8ff" opacity=".18" filter="url(#bl3)"/>`+phoneBig(960,560,1,feed(sc));
  s+=handS([1080,880+Math.sin(t*3)*60],-8,"point",1.3); return s+grade("dim");},[960,540,1.05,1.15]]);
say(70,74.6,"Just one more.");
/* 2d gym bag -> flop on bed (75-84) */
SC.push([75,84,t=>{let s=room(t,{sky:"eve",clock:"9:40"});
  if(t<79) s+=fig(1600,606,1.3,{tilt:20,hunch:10},1).s;
  else if(t<80.6){const k=Pr(t,79,80.6); s+=fig(lerp(1600,520,k),606,1.3,WALK(t,5),-1).s;}
  else if(t<81.1){const k=eio(Pr(t,80.6,81.1)); s+=fig(lerp(520,400,k),lerp(606,688,k),1.3,{lean:lerp(0,-90,k),lf:[lerp(0,90,k),0],lb:[lerp(0,92,k),0]},1).s;}
  else {const b=inBed(t,{phone:t>82,dark:0}); s+=b.s+(t>82?glow([b.m.C[0]+40,b.m.C[1]-60],170):"");}
  return s+grade("eve");},[1000,540,1.0,1.06]]);
say(75.5,78.8,"Gym in 5 minutes.");
/* 2e sticker falls (84-95) */
SC.push([84,95,t=>room(t,{sky:"eve",peel:Pr(t,86,92.5),wc:[22,10]})+grade("eve",.08),[1500,500,2.2,2.4]]);

/* 3a night bed glow (95-108) */
SC.push([95,108,t=>{let s=room(t,{sky:"night",clock:"1:00"}); const b=inBed(t,{phone:1,dark:1}); return s+b.s+glow([b.m.C[0]+40,b.m.C[1]-60],210)+grade("cold");},[380,600,1.6,1.8]]);
say(97,104.5,"5 more minutes, then sleep.");
/* 3b clock jumps (108-118) */
SC.push([108,118,t=>{const st=t<110.5?"1:05":t<113?"1:40":"2:30"; let s=bigClock(t,st,"#ff3b30","",0);
  const g=[110.5,113].some(c=>t>c&&t<c+.25); if(g) for(let i=0;i<10;i++) s+=R(0,hash(i+Math.floor(t*30))*HH,WW,6+hash(i)*30,i%2?"#ff2a6a":"#2affd5",0,`opacity=".3"`);
  return s+grade("night");},[960,540,1.0,1.1]]);
/* 3c screen time notification (118-126) */
SC.push([118,126,t=>{const sw=eio(Pr(t,123.4,124.1)); let s=R(0,0,WW,HH,"#0b0d14")+`<ellipse cx="960" cy="540" rx="560" ry="440" fill="#6fb8ff" opacity=".15" filter="url(#bl3)"/>`;
  let scr=feed((t-118)*120); const k=eo(Pr(t,119.6,120.2)); scr+=`<g transform="translate(${sw*-480} ${lerp(-260,0,k)})">${R(-170,-300,340,250,"rgba(30,32,40,.97)",26)}${T_(0,-250,"SCREEN TIME",24,{c:"#9fb3d6",ls:4})}${T_(0,-180,"6h 12m",64,{c:"#fff",w:800})}${T_(0,-130,"on your phone today",24,{c:"#c9c9cf",w:500})}${R(-130,-100,260,10,"#ff3b30",5)}</g>`;
  s+=phoneBig(960,560,1,scr)+handS([lerp(1120,820,sw),860],-8,"point",1.3); return s+grade("cold");},[960,540,1.05,1.12]]);
/* 3d staring at ceiling (126-134) */
SC.push([126,134,t=>{let s=room(t,{sky:"night",clock:"2:41"}); const b=inBed(t,{dark:1,P:{tilt:-6}}); s+=b.s+R(330,640,24,10,"#1b1b1f",3); return s+grade("deep");},[380,600,1.7,1.85]]);
say(128,133.4,"Where did the day go?",{sz:44,c:"#c8cfe8"});
/* 3e alarm in 4h (134-140) */
SC.push([134,140,t=>{let s=room(t,{sky:"night",clock:"2:47"}); s+=inBed(t,{dark:1}).s; TXT+=`<g opacity="${fade(t,134.6,139.2)}">${T_(WW/2,300,"ALARM IN 4H 13M",48,{c:"#ff6b5b",ls:8,w:800})}</g>`; return s+grade("deep");},[80,620,3.2,3.5]]);

/* 4a split loop (140-162) */
function panel(x,content,cx,cy,z){return `<svg x="${x}" y="0" width="960" height="1080" viewBox="0 0 960 1080"><g transform="translate(480 540) scale(${z}) translate(${-cx} ${-cy})">${content}</g></svg>`;}
SC.push([140,162,t=>{const k=Pr(t,140,161.5), day=Math.round(1+364*Math.pow(k,1.3)), sp=1.2-k*.7, i=Math.floor((t-140)/sp)%3;
  let L; if(i===0) L=panel(0,room(t,{sky:"dawn",clock:"7:05"})+inBed(t,{reach:.8}).s+grade("warm",.1),330,600,1.6);
  else if(i===1) L=panel(0,room(t,{sky:"eve"})+deskSit(t,{ph:1}).s+glow([1330,500],120)+grade("dim",.1),1330,560,1.5);
  else L=panel(0,room(t,{sky:"night",clock:"2:30"})+inBed(t,{phone:1,dark:1}).s+glow([300,560],180)+grade("cold"),380,600,1.6);
  const j=Math.min(2,Math.floor(k*3)), q=(k*3)%1; let Rr;
  if(j===0) Rr=park(t,{sp:600,sun:.6})+fig(900,682,1.15,Object.assign(RUN(t,10),{belly:lerp(1.4,0,q)}),1).s+grade("sun");
  else if(j===1){Rr=street(t,{})+(q<.5?R(700,500,500,260,"#9a9a9e",8)+R(740,540,420,60,"#555",4)+T_(950,582,"COMING SOON",34,{c:"#ddd",w:900}):R(700,500,500,260,"#d9d9dc",8)+R(740,540,420,60,"#2fbf5a",4)+T_(950,584,"OPEN",44,{c:"#fff",w:900}))+fig(1260,682,1.15,q<.5?{f:[150,60],b:[30,10]}:{f:[170,170],b:[-170,-170],tilt:-10},-1).s+grade("bright");}
  else Rr=R(0,0,WW,HH,"#d6d6d8")+`<path d="M700,860 L700,420 Q960,200 1220,420 L1220,860" stroke="#ececee" stroke-width="40" fill="none"/>`+[...Array(14)].map((_,n)=>`<circle cx="${700+hash(n)*520}" cy="${300+hash(n*3)*500}" r="${10+hash(n*5)*10}" fill="#f2f2f4" opacity=".9"/>`).join("")+R(0,860,WW,220,"#b4b4b8")+fig(880,654,1.15,{f:[40,60],tilt:-8},1).s+fig(1040,654,1.1,{f:[-40,-60],tilt:8,veil:1},-1).s+heart(960,330,1.4,.9)+grade("sun");
  const s=L+panel(960,Rr,960,560,1)+R(956,0,8,HH,"#e8e8ea");
  hud("DAY "+day); TXT+=T_(480,1030,"HIM",30,{c:"#ccc",ls:10,op:.8})+T_(1440,1030,"EVERYONE ELSE",30,{c:"#ccc",ls:10,op:.8}); return s;},[960,540,1,1]]);
/* 4b friend chat (162-170) */
SC.push([162,170,t=>{let scr=R(-186,-380,372,110,"#161a28")+`<circle cx="-130" cy="-322" r="30" fill="#3a3f55"/>`+T_(-130,-310,"M",30,{c:"#fff",w:900})+T_(-86,-312,"Max",30,{a:"start",c:"#fff",w:800});
  const b1=eo(Pr(t,163,163.4)); scr+=`<g opacity="${b1}">${R(-170,-200,300,150,"#2a2f42",26)}${T_(-150,-150,"Bro, you're still",26,{a:"start",c:"#fff",w:500})}${T_(-150,-116,"talking about",26,{a:"start",c:"#fff",w:500})}${T_(-150,-82,"that thing? lol",26,{a:"start",c:"#fff",w:500})}</g>`;
  if(t>165.5) scr+=R(-60,-20,220,60,"#1f6fe5",30)+T_(50,20,Math.floor(t*3)%2?"...":"..",40,{c:"#fff"});
  if(t>168.4) scr=scr.replace(/<rect x="-60" y="-20"[^>]*\/>.*$/,"");
  return R(0,0,WW,HH,"#101218")+`<ellipse cx="960" cy="540" rx="560" ry="440" fill="#6fb8ff" opacity=".14" filter="url(#bl3)"/>`+phoneBig(960,560,1,scr)+grade("dim");},[960,540,1.05,1.15]]);
/* 4c alone in the dark (170-175) */
SC.push([170,175,t=>room(t,{sky:"night",clock:"2:52"})+inBed(t,{dark:1}).s+grade("deep",.1),[400,620,1.3,1.9]]);

/* 5a goes out, old man on bench (175-183) */
const oldMan=(t,o={})=>fig(1260,786,1.12,Object.assign({},SITP,{hunch:28,lean:8,hat:1,fW:[1190,780],cane:885,bW:[1200,780]},o),-1);
SC.push([175,183,t=>{let s=bench(t); const w=Pr(t,175,180.6);
  if(t<180.6) s+=fig(lerp(-80,1040,w),676,1.12,Object.assign(WALK(t,4),{hunch:14}),1).s+glow([lerp(-80,1040,w)+40,600],60,.6);
  else {const k=eio(Pr(t,180.6,181.6)); s+=fig(1040,lerp(676,786,k),1.12,Object.assign({lf:[lerp(0,90,k),lerp(0,-90,k)],lb:[lerp(0,86,k),lerp(0,-86,k)],hunch:14,fW:[1110,760],fBend:-1,ph:1}),1).s+glow([1110,750],70,.8);}
  s+=oldMan(t).s; return s+grade("bench")+`<ellipse cx="1110" cy="560" rx="420" ry="380" fill="#ffd59a" opacity=".16" filter="url(#bl3)" style="mix-blend-mode:screen"/>`;},[960,560,1.0,1.12]]);
/* 5b dialogue (183-214) */
SC.push([183,214,t=>{let s=bench(t); const look=t>185&&t<199?-8:0, talk=[[185,191],[192,199],[200,206],[207,213]].some(([a,b])=>t>a&&t<b);
  s+=fig(1040,786,1.12,Object.assign({},SITP,{hunch:look?6:18,tilt:look?-10:10,fW:[1110,760],fBend:-1,ph:t<213?1:0}),1).s+(t<213?glow([1110,750],70,.8):"");
  const g=t>192&&t<199?Math.sin((t-192)*2.2):0, sh=t>207.5&&t<212.5;
  s+=oldMan(t,{tilt:talk?-6+Math.sin(t*5)*3:0,bW:sh?[1110,620]:g?[1150,lerp(700,640,(g+1)/2)]:[1200,780],bBend:-1}).s;
  return s+grade("bench")+`<ellipse cx="1110" cy="560" rx="420" ry="380" fill="#ffd59a" opacity=".16" filter="url(#bl3)" style="mix-blend-mode:screen"/>`;},[1150,640,1.45,1.62]]);
say(179.6,183.8,"“Can't sleep either?”",{c:"#f3dcae"});
say(185,191,"“I know that face. I had it for 40 years.”",{c:"#f3dcae"});
say(192,199,"“You give 5 minutes to your alarm. 5 to your phone. 5 to everyone.”",{c:"#f3dcae",sz:46});
say(200,206,"“Everyone except yourself.”",{c:"#f3dcae",sz:62});
say(207,213,"“Try it the other way. 5 minutes. For you.”",{c:"#f3dcae"});
/* 5c old man leaves, screen off (214-220) */
SC.push([214,220,t=>{let s=bench(t); const up=eio(Pr(t,214,215.2)), wk=Pr(t,215.2,219.6);
  s+=fig(1040,786,1.12,Object.assign({},SITP,{hunch:8,tilt:t>216.5&&t<218?-6:12,fW:[1110,760],fBend:-1,ph:t<218.2?1:0}),1).s+(t<218.2?glow([1110,750],70,.8):"");
  if(t<215.2) s+=oldMan(t,{lf:[lerp(90,0,up),lerp(-90,0,up)],lb:[lerp(86,0,up),lerp(-86,0,up)]}).s.replace("786",String(lerp(786,690,up)));
  else s+=fig(lerp(1260,1960,wk),690,1.12,Object.assign(WALK(t,3),{hunch:28,lean:8,hat:1,cane:885}),1).s;
  return s+grade("bench",wk*.1)+`<ellipse cx="1110" cy="560" rx="420" ry="380" fill="#ffd59a" opacity=".16" filter="url(#bl3)" style="mix-blend-mode:screen"/>`;},[1150,620,1.35,1.25]]);

/* 6a park run 5 min (220-230) */
SC.push([220,230,t=>{const tired=t>225.6&&t<228; let s=park(t,{sp:tired?120:620,sun:.25});
  s+=fig(900,682,1.15,tired?{lean:70,hunch:0,tilt:-45,f:[-31,-31],b:[-29,-29],lf:[14,-10],lb:[8,-4],bob:Math.sin(t*8)*3}:RUN(t,10),1).s;
  counter("5 MIN",fade(t,220.3,229.7),"#fff",110); return s+grade(mixG("dawn","sun",Pr(t,220,230)));},[960,560,1.0,1.06]]);
say(220.6,223.6,"Just 5 minutes.");
/* 6b phone in the other room (230-236) */
SC.push([230,236,t=>{const pl=t>232, dk=eio(Pr(t,233.4,234.6)); let s=hall(t,{phoneOn:pl?2:0});
  const x=t<231.4?lerp(400,1150,Pr(t,230,231.4)):t<232.4?1150:t<233.4?lerp(1150,760,Pr(t,232.4,233.4)):760;
  s+=fig(x,606,1.3,Object.assign(t<231.4||(t>232.4&&t<233.4)?WALK(t,5):{},t>231.4&&t<232.4?{fW:[1293,630],fBend:-1,ph:t<232?1:0,lean:14}:{} ,t>233.4?{fW:[lerp(900,1050,dk),560],fBend:-1}:{}),t>232.4&&t<233.4?-1:1).s;
  s+=doorPanel(dk); return s+grade("bright");},[960,540,1.0,1.05]]);
/* 6c sticker goes back up (236-242) */
SC.push([236,242,t=>{const k=eob(Pr(t,236.6,238.6)); let s=room(t,{sky:"day",note:0});
  const y=lerp(820,430,k); s+=`<g transform="translate(1500 ${y}) rotate(${lerp(18,-4,k)})"><rect x="-70" y="-50" width="140" height="100" fill="#d9d9c4"/>${T_(0,0,"START",26,{c:"#1b1b1b",w:900})}${T_(0,32,"THE THING",22,{c:"#1b1b1b",w:900})}</g>`+handS([1530,y+40],10,"point",.5,"#55555a");
  return s+grade("bright");},[1500,500,2.2,2.3]]);
/* 6d laptop timer (242-252) */
SC.push([242,252,t=>{const rem=Math.max(0,300-(t-242.4)*60), done=rem<=0, mm=Math.floor(rem/60), ss=Math.floor(rem%60);
  let scr=done?"":T_(0,40,`${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")}`,200,{f:"DejaVu Sans Mono,monospace",w:700,c:"#fff"})+R(-400,120,800,14,"#2a3150",7)+R(-400,120,800*(1-rem/300),14,"#2fbf5a",7);
  if(done){const n=Math.floor((t-247.4)*6); for(let i=0;i<Math.min(14,n);i++) scr+=R(-480+(i%3)*30,-280+i*40,200+hash(i)*560,18,["#5d7bd6","#2fbf5a","#c9c9cf"][i%3],9); if(t<248.4) scr+=T_(0,40,"DING",160,{c:"#ffd34d",w:900,op:1-Pr(t,247.4,248.4)});}
  let s=laptopBig(t,scr)+handS([700,1060+Math.abs(Math.sin(t*14))*-30],-6,"fist",1.1,"#55555a")+handS([1220,1060+Math.abs(Math.cos(t*13))*-30],6,"fist",1.1,"#55555a");
  counter(done?(t<250?"10 MIN":"20 MIN"):"",done?1:0,"#7fe08a",90); return s+grade("bright");},[960,520,1.0,1.06]]);
/* 6e montage: run, graph, payment (252-262) */
SC.push([252,262,t=>{const i=Math.min(2,Math.floor((t-252)/3.34)); let s;
  if(i===0){s=park(t,{sp:700,sun:.7})+fig(900,682,1.15,RUN(t,11),1).s+grade("sun"); counter("30 MIN",1,"#fff",100);}
  else if(i===1){const k=eo(Pr(t,255.4,258.4)); let pts=[...Array(12)].map((_,n)=>[-440+n*80,240-Math.pow(n/11,1.8)*440*k-hash(n)*30*k]); const scr=`<path d="M${pts.map(f).join(" L")}" stroke="#2fbf5a" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`+T_(-440,-260,"VISITORS",36,{a:"start",c:"#9fb3d6",ls:6});
    s=laptopBig(t,scr)+grade("bright"); counter("45 MIN",1,"#7fe08a",100);}
  else {s=R(0,0,WW,HH,"#d8d8da")+`<ellipse cx="960" cy="540" rx="560" ry="440" fill="#fff" opacity=".5" filter="url(#bl3)"/>`+phoneBig(960,560,1,feed(0).replace(/#1c2236/g,"#20263a")); notif(t,258.9,262.2,"Payment received","+ €250.00 — your first client",300); s+=grade("bright");}
  return s;},[960,540,1.02,1.06]]);
/* 6f friend meets him (262-270) */
SC.push([262,270,t=>{const w=Pr(t,262,263.6); let s=street(t,{});
  s+=fig(lerp(2000,1120,w),682,1.15,Object.assign(w<1?WALK(t,4):{},t>263?{tilt:-6,f:[120,20]}:{}),-1).s;
  s+=fig(800,682,1.15,{tilt:t>266.5?-8:0,lean:-2,f:t>266.5&&t<268?[100,140]:[16,6]},1).s; return s+grade("sun");},[960,560,1.25,1.35]]);
say(263,266.2,"“Bro... what happened to you?”",{c:"#d4e4ff"}); say(266.6,269.6,"5 minutes.");

/* 7a final alarm, hand stops (270-282) */
SC.push([270,282,t=>{const re=t<274?0:t<276?eio(Pr(t,274,276)):t<279.2?1+Math.sin(t*20)*.015:1-eio(Pr(t,279.2,280.2));
  let s=room(t,{sky:"dawn",clock:"7:00",ring:t<280.4?1:0});
  if(t<280.4) s+=inBed(t,{reach:re>0?re:null}).s;
  else {const k=eio(Pr(t,281.2,281.9)); s+=blanket().replace("Q320,640 420,646","Q330,690 420,700")+(t<281.2?fig(660,700,1.3,Object.assign({},SITP,{hunch:16,tilt:6}),1).s:fig(lerp(700,800,k),lerp(660,606,k),1.3,{lean:lerp(10,0,k),lf:[lerp(40,0,k),lerp(-40,0,k)],lb:[lerp(36,0,k),lerp(-36,0,k)],tilt:-6},1).s);}
  s+=`<ellipse cx="340" cy="420" rx="420" ry="320" fill="#ffd9a8" opacity="${.35+.25*Pr(t,280,282)}" filter="url(#bl3)" style="mix-blend-mode:screen"/>`;
  return s+grade(mixG("warm","bright",Pr(t,279,282)));},[300,600,1.45,1.75]]);
/* 7b standing at window, light floods (282-284.4) */
SC.push([282,284.4,t=>{let s=room(t,{sky:"dawn",clock:"7:01"})+blanket()+fig(560,606,1.3,{tilt:-14,lean:-2},-1).s;
  s+=`<ellipse cx="340" cy="360" rx="${600+Pr(t,282,284.4)*900}" ry="${420+Pr(t,282,284.4)*600}" fill="#fff6e4" opacity="${.4+.6*Pr(t,282.6,284.4)}" filter="url(#bl3)"/>`; return s+grade("bright");},[460,520,1.4,1.2]]);
/* 7c title (284.4-292) */
SC.push([284.4,292,t=>{const k=eo(Pr(t,285,286.2)); return R(0,0,WW,HH,"#000")+`<g opacity="${k*fade(t,284.4,291.8,.6)}" transform="translate(960 570) scale(${lerp(1.1,1,k)})">${T_(0,0,"5 MINUTES",170,{w:900,ls:24})}${R(-430,44,860,6,"#7fe08a")}</g>`;},[960,540,1,1.03]]);
/* 7d question (292-300) */
SC.push([292,300,t=>R(0,0,WW,HH,"#000")+`<g opacity="${fade(t,292.3,300.5,.5)}">${typeT(t,292.5,295,"What are you giving yours to?",560,78)}</g>`,[960,540,1,1.03]]);

const DUR=300;
const CUTS=SC.map(x=>x[0]).slice(1);
const FADES=[[133.6,134.4],[139.2,140.6],[174.4,175.6],[219.4,220.6],[283.8,285]];
function render(t){
  TXT=""; CAMO=null; window.BROW=t<214?.5:t<220?.25:0; let out="", z=1, cx=960, cy=540;
  for(const [a,b,fn,c] of SC) if(t>=a&&t<b){out=fn(t); const k=eio(Pr(t,a,b)); z=lerp(c[2],c[3],k); cx=c[0]; cy=c[1]; break;}
  if(CAMO){[cx,cy,z]=CAMO;}
  cx=clamp(cx,960/z,1920-960/z); cy=clamp(cy,540/z,1080-540/z);
  document.getElementById("w").innerHTML=`<g transform="translate(960 540) scale(${z}) translate(${-cx} ${-cy})">${out}</g>`;
  drawCaps(t); document.getElementById("ov").innerHTML=TXT;
  const fl=CUTS.reduce((m,c)=>{const k=Pr(t,c,c+.14);return Math.max(m,k>0&&k<1?(1-k)*.18:0)},0);
  document.getElementById("flash").style.opacity=fl;
  let fd=0; FADES.forEach(([a,b])=>{if(t>a&&t<b) fd=Math.max(fd,1-Math.abs(t-(a+b)/2)/((b-a)/2));});
  document.getElementById("fade").style.opacity=fd;
  const sh=[[0,.6,8],[16,.3,6],[24.6,.3,8],[6,2,4]].reduce((a,[s0,d,m])=>{const k=Pr(t,s0,s0+d);return a+(k>0&&k<1?m*(1-k):0)},0);
  document.getElementById("cam").style.transform=`translate(${Math.sin(t*90)*sh}px,${Math.cos(t*70)*sh}px)`;
}
window.render=render;
