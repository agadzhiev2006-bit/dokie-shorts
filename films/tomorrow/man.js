const D=Math.PI/180, v=(a,l)=>[Math.sin(a*D)*l,Math.cos(a*D)*l], add=(p,q)=>[p[0]+q[0],p[1]+q[1]];
const f=p=>p[0].toFixed(1)+","+p[1].toFixed(1);
const K="#0b0b0d", W="#ffffff";
/* obrysovaná čára: bílý okraj + černé jádro */
const line=(pts,w,o=7)=>{const d="M"+pts.map(f).join(" L");
  return `<path d="${d}" stroke="${W}" stroke-width="${w+o*2}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="${d}" stroke="${K}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`};
/* nohavice: volné, úzko u pasu, gramofon dole */
function pantLeg(h,k,a,wh,wk,wa,flip){
  const nrm=(p,q)=>{const dx=q[0]-p[0],dy=q[1]-p[1],l=Math.hypot(dx,dy);return [-dy/l,dx/l]};
  const n1=nrm(h,k),n2=nrm(k,a),nk=[(n1[0]+n2[0])/2,(n1[1]+n2[1])/2];
  const at=(p,n,w)=>[p[0]+n[0]*w,p[1]+n[1]*w], mid=(p,q,n,b)=>[(p[0]+q[0])/2+n[0]*b,(p[1]+q[1])/2+n[1]*b];
  const L0=at(h,n1,wh),L1=at(k,nk,wk),L2=at(a,n2,wa),R0=at(a,n2,-wa),R1=at(k,nk,-wk),R2=at(h,n1,-wh);
  /* zubatý okraj dole (látka se hromadí na botě) */
  let zz=""; const N=6; for(let i=1;i<N;i++){const t=i/N, p=[L2[0]+(R0[0]-L2[0])*t, L2[1]+(R0[1]-L2[1])*t+(i%2?10:-4)]; zz+=` L${f(p)}`;}
  const body=`<path d="M${f(L0)} Q${f(mid(L0,L1,n1,22))} ${f(L1)} Q${f(mid(L1,L2,n2,14))} ${f(L2)}${zz} L${f(R0)} Q${f(mid(R0,R1,n2,-10))} ${f(R1)} Q${f(mid(R1,R2,n1,-12))} ${f(R2)} Z" fill="${K}" stroke="${W}" stroke-width="7" stroke-linejoin="round"/>`;
  const S=(d,o=.92,w=5)=>`<path d="${d}" stroke="${W}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${o}"/>`;
  const sd=flip?-1:1, P=(base,n,w,dx=0,dy=0)=>{const q=at(base,n,w);return [q[0]+dx,q[1]+dy]};
  /* šipky v koleni */
  const kn=[P(k,nk,-wk*.55*sd,0,-34),P(k,nk,-wk*.05*sd,0,-6),P(k,nk,-wk*.5*sd,0,22)];
  const kn2=[P(k,nk,-wk*.35*sd,0,10),P(k,nk,wk*.1*sd,0,30),P(k,nk,-wk*.25*sd,0,52)];
  /* podélné záhyby */
  const t1=P([(h[0]+k[0])/2,(h[1]+k[1])/2],n1,wh*.35*sd), t2=P(k,nk,wk*.45*sd,0,-40);
  const c1=P(k,nk,wk*.5*sd,0,40), c2=P(a,n2,wa*.35*sd,0,-60);
  const c3=P(k,nk,-wk*.1*sd,0,90), c4=P(a,n2,-wa*.25*sd,0,-46);
  /* vlnky nad botou */
  const b1=[P(a,n2,-wa*.85,0,-40),P(a,n2,0,0,-28),P(a,n2,wa*.85,0,-42)];
  const b2=[P(a,n2,-wa*.7,0,-76),P(a,n2,wa*.1,0,-62),P(a,n2,wa*.75,0,-80)];
  return body+
   S(`M${f(kn[0])} Q${f(kn[1])} ${f(kn[2])}`)+S(`M${f(kn2[0])} Q${f(kn2[1])} ${f(kn2[2])}`,.7,4)+
   S(`M${f(t1)} Q${f([t1[0]+sd*10,(t1[1]+t2[1])/2])} ${f(t2)}`,.6,4)+
   S(`M${f(c1)} Q${f([c1[0]-sd*14,(c1[1]+c2[1])/2])} ${f(c2)}`)+
   S(`M${f(c3)} Q${f([c3[0]+sd*12,(c3[1]+c4[1])/2])} ${f(c4)}`,.75,4)+
   S(`M${f(b1[0])} Q${f(b1[1])} ${f(b1[2])}`)+S(`M${f(b2[0])} Q${f(b2[1])} ${f(b2[2])}`,.75,4);
}
/* tenisky */
function shoe(a,dir){const s=dir; const x=a[0],y=a[1];
  return `<g transform="translate(${x} ${y}) scale(${s} 1)">
   <path d="M-62 4 Q-66 -40 -20 -42 Q20 -44 46 -18 Q92 -10 96 22 L96 40 L-64 40 Z" fill="${K}" stroke="${W}" stroke-width="7" stroke-linejoin="round"/>
   <path d="M-64 30 L96 30 L96 46 Q20 54 -64 46 Z" fill="${W}" stroke="${K}" stroke-width="5"/>
   <path d="M0 -34 L22 -26 M8 -40 L30 -30 M-4 -24 L18 -16" stroke="${W}" stroke-width="5" stroke-linecap="round"/>
  </g>`}
/* ruce */
function hand(p,ang,type,sc=1){ if(!type) return "";
  const o=`fill="${K}" stroke="${W}" stroke-width="${6/sc}" stroke-linejoin="round"`;
  let h="";
  if(type==="thumb") h=`<rect x="-46" y="-30" width="92" height="84" rx="34" ${o}/>
     <rect x="-34" y="-112" width="44" height="100" rx="22" ${o}/>
     <path d="M-36 4 Q0 -4 38 2 M-36 24 Q0 16 40 22 M-34 42 Q0 36 36 40" stroke="${W}" stroke-width="${5/sc}" fill="none" stroke-linecap="round"/>`;
  if(type==="open") h=`<path d="M-40 40 Q-50 -10 -38 -60 Q-30 -74 -20 -60 L-18 -28 L-10 -80 Q0 -94 10 -80 L8 -28 L22 -70 Q32 -82 40 -66 L28 -20 L48 -44 Q60 -50 58 -34 Q40 10 30 40 Q0 58 -40 40 Z" ${o}/>`;
  if(type==="point") h=`<rect x="-40" y="-26" width="80" height="72" rx="30" ${o}/><rect x="-8" y="-104" width="36" height="92" rx="18" ${o}/>`;
  if(type==="fist") h=`<rect x="-42" y="-34" width="84" height="80" rx="32" ${o}/><path d="M-30 -10 L30 -10 M-30 10 L30 10" stroke="${W}" stroke-width="${5/sc}" stroke-linecap="round"/>`;
  return `<g transform="translate(${f(p)}) rotate(${ang}) scale(${sc})">${h}</g>`;
}
/* hlava */
function head(c,tilt,ex){
  return `<g transform="translate(${f(c)}) rotate(${tilt})">
   <circle r="150" fill="${K}" stroke="${W}" stroke-width="7"/>
   <path d="M-124 -56 A134 134 0 0 1 -30 -128" stroke="${W}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".95"/>
   <g transform="translate(-44 6) scale(1.28)">
   <g transform="translate(${ex.look||0} 0)">
   <path d="M2 -28 Q24 -44 50 -30 Q46 -2 22 0 Q4 -2 2 -28 Z" fill="${W}"/>
   <path d="M66 -28 Q88 -44 108 -28 Q104 -2 86 0 Q68 -2 66 -28 Z" fill="${W}"/>
   <circle cx="${28+ (ex.px||0)}" cy="-14" r="10" fill="${K}"/><circle cx="${90+(ex.px||0)}" cy="-14" r="10" fill="${K}"/>
   ${ex.blink>0?`<rect x="-6" y="-52" width="124" height="${(ex.blink*54).toFixed(1)}" fill="${K}"/>`:""}
   <path d="M-2 ${-30+(ex.lid||0)} Q24 ${-50+(ex.lid||0)} 54 ${-30+(ex.lid||0)}" stroke="${K}" stroke-width="12" fill="none" stroke-linecap="round"/>
   <path d="M62 ${-30+(ex.lid||0)} Q86 ${-50+(ex.lid||0)} 112 ${-30+(ex.lid||0)}" stroke="${K}" stroke-width="12" fill="none" stroke-linecap="round"/>
   <!-- obočí -->
   <path d="M0 ${-62+(ex.brow||0)} L50 ${-50+(ex.brow||0)}" stroke="${W}" stroke-width="8" stroke-linecap="round"/>
   <path d="M66 ${-50+(ex.brow2??ex.brow??0)} L112 ${-64+(ex.brow2??ex.brow??0)}" stroke="${W}" stroke-width="8" stroke-linecap="round"/>
   <!-- brýle (trochu nakřivo) -->
   <g transform="rotate(8 60 -10)">
    <path d="M-12 -40 L58 -40 L54 18 L-6 18 Z" fill="rgba(11,11,13,.35)" stroke="${W}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M70 -40 L136 -40 L128 18 L74 18 Z" fill="rgba(11,11,13,.35)" stroke="${W}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M58 -32 L70 -32" stroke="${W}" stroke-width="7"/><path d="M-12 -36 L-60 -50" stroke="${W}" stroke-width="7" stroke-linecap="round"/>
    <path d="M-2 -32 L40 -32" stroke="${W}" stroke-width="4" opacity=".6"/>
   </g></g>
   <!-- ústa -->
   ${ex.mouth>0.05?`<path d="M30 46 Q62 ${56+ex.mouth*30} 96 38 Q66 ${56+ex.mouth*10} 30 46 Z" fill="${W}"/>`:""}
   <path d="M28 48 Q64 64 98 34" stroke="${W}" stroke-width="8" fill="none" stroke-linecap="round"/>
   <path d="M98 34 L106 26" stroke="${W}" stroke-width="7" stroke-linecap="round"/>
  </g></g>`}
/* RIG */
function manSVG(P){
  const hip=[540+(P.hipx||0),1150+(P.bob||0)];
  const T=add(hip,[Math.sin(P.lean*D)*215,-Math.cos(P.lean*D)*215]);
  const S=add(T,[0,26]);
  const C=add(T,[Math.sin((P.lean+P.tilt*.3)*D)*140,-140]);
  const arm=a=>{const e=add(S,v(a[0],140));return [e,add(e,v(a[1],130))]};
  const leg=(a,k,o)=>{const kn=add(add(hip,[o,0]),v(a,230));return [kn,add(kn,v(a+k,230))]};
  const [eb,hb]=arm(P.b),[ef,hf]=arm(P.f),[kb,ab]=leg(P.lb[0],P.lb[1],-26),[kf,af]=leg(P.lf[0],P.lf[1],26);
  let s="";
  if(P.bh) s+=line([S,eb,hb],22)+hand(hb,P.bha||0,P.bh,P.bhs||1.15);
  else s+=line([S,add(S,v(P.b[0],120))],22);
  s+=pantLeg(add(hip,[-26,0]),kb,ab,44,70,74,1)+shoe(add(ab,[0,8]),-1);
  s+=line([add(hip,[0,-40]),T,add(T,[0,-24])],32);
  s+=pantLeg(add(hip,[26,0]),kf,af,44,72,76,0)+shoe(add(af,[0,8]),1);
  s+=`<path d="M${f(add(hip,[-66,-34]))} L${f(add(hip,[66,-34]))} L${f(add(hip,[70,14]))} L${f(add(hip,[-70,14]))} Z" fill="${K}" stroke="${W}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M${f(add(hip,[-64,-14]))} L${f(add(hip,[64,-14]))}" stroke="${W}" stroke-width="5"/>`;
  s+=head(C,P.tilt,P.ex);
  s+=line([S,ef,hf],22)+hand(hf,P.fha||0,P.fh,P.fhs||1.35);
  return s;
}
