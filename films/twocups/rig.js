const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)), Pr=(t,a,b)=>clamp((t-a)/(b-a)), lerp=(a,b,p)=>a+(b-a)*p;
const eio=x=>{x=clamp(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}, eo=x=>1-Math.pow(1-clamp(x),3);
const eob=x=>{x=clamp(x);const c1=1.9,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
const hash=n=>{const s=Math.sin(n*127.1)*43758.5453;return s-Math.floor(s)};
const T_=(x,y,s,sz,o={})=>`<text x="${x}" y="${y}" text-anchor="${o.a||"middle"}" font-family="${o.f||"Inter Display,Inter,sans-serif"}" font-weight="${o.w||800}" font-size="${sz}" fill="${o.c||"#fff"}" letter-spacing="${o.ls||0}" opacity="${o.op??1}" ${o.it?'font-style="italic"':""}>${s}</text>`;
const ang=(p,q)=>Math.atan2(q[0]-p[0],q[1]-p[1])/D;
/* 2-kostní IK: vrací [upper, fore] úhly */
function ik(S,Tg,l1,l2,bend){const dx=Tg[0]-S[0],dy=Tg[1]-S[1];let d=Math.hypot(dx,dy);d=Math.min(d,l1+l2-1);
 const th=Math.atan2(dx,dy)/D, a=Math.acos(clamp((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1))/D, up=th+bend*a, E=add(S,v(up,l1)); return [up,ang(E,Tg)];}
/* ---------- rig s pupkem a svaly ---------- */
function man2(P){
  const hip=[540+(P.hipx||0),1150+(P.bob||0)];
  const T=add(hip,[Math.sin(P.lean*D)*215,-Math.cos(P.lean*D)*215]), S=add(T,[0,26]);
  const C=add(T,[Math.sin((P.lean+P.tilt*.3)*D)*140,-140]);
  const mu=P.muscle||0, be=P.belly||0, aw=22+mu*16;
  if(P.fT) P.f=ik(S,add(S,P.fT),140,130,P.fBend??-1);
  if(P.bT) P.b=ik(S,add(S,P.bT),140,130,P.bBend??-1);
  const arm=a=>{const e=add(S,v(a[0],140));return [e,add(e,v(a[1],130))]};
  const leg=(a,k,o)=>{const kn=add(add(hip,[o,0]),v(a,230));return [kn,add(kn,v(a+k,230))]};
  const [eb,hb]=arm(P.b),[ef,hf]=arm(P.f),[kb,ab]=leg(P.lb[0],P.lb[1],-26),[kf,af]=leg(P.lf[0],P.lf[1],26);
  const bic=(Sx,e,a)=>mu>0?`<ellipse cx="${(Sx[0]+e[0])/2}" cy="${(Sx[1]+e[1])/2}" rx="${16+mu*16}" ry="${40+mu*14}" transform="rotate(${-a} ${(Sx[0]+e[0])/2} ${(Sx[1]+e[1])/2})" fill="${K}" stroke="${W}" stroke-width="6"/>`:"";
  let s="";
  s+=line([S,eb,hb],aw)+bic(S,eb,P.b[0])+(P.bh!==null?hand(hb,P.bha??(180-P.b[1]),P.bh||"fist",P.bhs||1.15+mu*.2):"");
  s+=pantLeg(add(hip,[-26,0]),kb,ab,44+be*16,70,74,1)+shoe(add(ab,[0,8]),-1);
  if(mu>0){const sw=26+mu*74, tw=34; s+=`<path d="M${f(add(hip,[-tw,-30]))} L${f(add(S,[-sw,-6]))} Q${f(add(S,[0,-34]))} ${f(add(S,[sw,-6]))} L${f(add(hip,[tw,-30]))} Z" fill="${K}" stroke="${W}" stroke-width="7" stroke-linejoin="round"/>
     <path d="M${f(add(S,[-sw*.55,40]))} Q${f(add(S,[0,70]))} ${f(add(S,[sw*.55,40]))}" stroke="${W}" stroke-width="5" fill="none" opacity=".8"/><path d="M${f(add(S,[0,60]))} L${f(add(hip,[0,-60]))}" stroke="${W}" stroke-width="4" opacity=".55"/>
     ${[0,1,2].map(i=>`<path d="M${f(add(S,[-18,100+i*36]))} L${f(add(S,[18,100+i*36]))}" stroke="${W}" stroke-width="4" opacity="${.45*mu}"/>`).join("")}`;}
  else s+=line([add(hip,[0,-40]),T,add(T,[0,-24])],32);
  if(be>0){const c=add(lerp2(hip,T,.38),[18+be*40,0]); s+=`<ellipse cx="${c[0]}" cy="${c[1]}" rx="${34+be*86}" ry="${44+be*80}" fill="${K}" stroke="${W}" stroke-width="7"/><path d="M${c[0]+10+be*30},${c[1]-10} q12,10 0,22" stroke="${W}" stroke-width="5" fill="none" opacity=".7"/>`;}
  s+=pantLeg(add(hip,[26,0]),kf,af,44+be*16,72,76,0)+shoe(add(af,[0,8]),1);
  s+=`<path d="M${f(add(hip,[-66-be*30,-34]))} L${f(add(hip,[66+be*30,-34]))} L${f(add(hip,[70+be*30,14]))} L${f(add(hip,[-70-be*30,14]))} Z" fill="${K}" stroke="${W}" stroke-width="7" stroke-linejoin="round"/>`;
  s+=head(C,P.tilt,P.ex||{});
  if(P.band) s+=`<g transform="translate(${f(C)}) rotate(${P.tilt})"><path d="M-148,-60 Q0,-92 148,-60 L146,-36 Q0,-68 -146,-36 Z" fill="#e5352b"/><path d="M-146,-48 L-200,-20 M-146,-46 L-196,0" stroke="#e5352b" stroke-width="12" stroke-linecap="round"/></g>`;
  s+=line([S,ef,hf],aw)+bic(S,ef,P.f[0])+(P.fh!==null?hand(hf,P.fha??(180-P.f[1]),P.fh||"fist",P.fhs||1.2+mu*.2):"");
  return {s,hf,hb,C,S,hip};
}
const lerp2=(p,q,k)=>[lerp(p[0],q[0],k),lerp(p[1],q[1],k)];
/* umístění: nativní kyčel → (x,y) */
const place=(x,y,sc,inner,rot=0)=>`<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc}) translate(-540 -1150)">${inner}</g>`;
const toW=(p,x,y,sc)=>[x+(p[0]-540)*sc,y+(p[1]-1150)*sc];
const SIT={lean:0,tilt:4,lb:[82,-84],lf:[88,-88]};
const BASE=(o)=>Object.assign({lean:0,tilt:0,b:[-8,-6],f:[12,4],lb:[-10,4],lf:[14,-6],ex:{}},o);
const blink=t=>((t+.4)%3.1)<.1?1:0;
