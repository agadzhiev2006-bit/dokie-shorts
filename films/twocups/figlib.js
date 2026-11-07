const INK="#111113", Ser="Caladea,Georgia,serif";
const fade=(t,a,b,e=.4)=>clamp(Math.min((t-a)/e,(b-t)/e));
const ln=(pts,w,c=INK)=>`<path d="M${pts.map(f).join(" L")}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const R=(x,y,w,h,c,rx=0,ex="")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${c}" ${ex}/>`;

/* ---------- stickman silhouette ---------- */
/* hip at (x,y); angles: 0 = down, 90 = right. f/b arms [upper,fore], lf/lb legs [thigh,knee]. fW/bW = world IK targets */
function fig(x,y,s,P={},dir=1){
  P=Object.assign({lean:0,tilt:0,f:[18,8],b:[-14,-6],lf:[6,-2],lb:[-6,2],bob:0,col:INK,hunch:0,thin:1,brow:(window.BROW??.5),eyes:1,closed:0,smile:0},P);
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
  let body=ln([tb,ts],72*th,c)+(P.belly?`<ellipse cx="${lerp(hip[0],S[0],.4)+14}" cy="${lerp(hip[1],S[1],.4)}" rx="${26*P.belly}" ry="${30*P.belly}" fill="${c}"/>`:"")+(P.bun?`<circle cx="${(C[0]-24*(1-(P.front??0))).toFixed(1)}" cy="${(C[1]-40).toFixed(1)}" r="21" fill="#cdc6ba"/>`:"")+`<circle cx="${C[0].toFixed(1)}" cy="${C[1].toFixed(1)}" r="46" fill="${c}"/>`;
  if(P.hat) body+=`<g transform="translate(${f(C)}) rotate(${P.lean+P.hunch+P.tilt})"><rect x="-62" y="-38" width="124" height="13" rx="6" fill="${c}"/><path d="M-36,-32 Q-36,-80 0,-82 Q36,-80 36,-32 Z" fill="${c}"/></g>`;
  g+=`<g ${RM}>${body}</g>`;
  if(P.shawl){g+=`<path d="M${f(add(S,[-54,-2]))} Q${f(add(S,[0,-30]))} ${f(add(S,[52,-2]))} L${f(add(S,[50,44]))} Q${f(add(S,[0,64]))} ${f(add(S,[-58,44]))} Z" fill="${P.shawl}"/><path d="M${f(add(S,[-56,40]))} Q${f(add(S,[0,60]))} ${f(add(S,[50,40]))}" stroke="#8a5426" stroke-width="5" fill="none"/>`;}
  if(P.phones){g+=`<path d="M${f(add(N,[-34,2]))} Q${f(add(N,[0,34]))} ${f(add(N,[34,2]))}" stroke="#4d525c" stroke-width="9" fill="none" stroke-linecap="round"/><rect x="${N[0]-46}" y="${N[1]-8}" width="20" height="26" rx="8" fill="#5d636e"/><rect x="${N[0]+26}" y="${N[1]-8}" width="20" height="26" rx="8" fill="#5d636e"/>`;}
  g+=legS(kf,af);
  /* face: eyes + brows (side-ish: shifted toward facing dir) */
  if(P.eyes){const R0=(px,py)=>{const cs=Math.cos(ca),sn=Math.sin(ca);return [C[0]+px*cs-py*sn, C[1]+px*sn+py*cs];};
    const ey=P.eyeY||0, eh=10*(1-Math.max(P.blink||0,P.closed||0)), fr=P.front??0, cx0=lerp(18,0,fr), sp=lerp(12,14,fr);
    for(const k of [-1,1]){const ex=cx0+k*sp, e=R0(ex+(P.look||0),4+ey), sd=-k, bi=R0(ex+sd*8,-16-P.brow*8), bo=R0(ex-sd*9,-16+P.brow*4), bm=R0(ex-sd*1,-19-P.brow*2.5);
      g+=`<ellipse cx="${e[0].toFixed(1)}" cy="${e[1].toFixed(1)}" rx="6.5" ry="${Math.max(1,eh).toFixed(1)}" fill="${P.eyeC||"#f3efe6"}" transform="rotate(${(P.lean+P.hunch+P.tilt)} ${e[0].toFixed(1)} ${e[1].toFixed(1)})"/>`;
      if(P.brows!==0) g+=`<path d="M${f(bo)} Q${f(bm)} ${f(bi)}" stroke="${P.browC||"#c9c4ba"}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      if(P.closed>0) g+=`<path d="M${f(R0(ex-7,4+ey))} Q${f(R0(ex,9+ey))} ${f(R0(ex+7,4+ey))}" stroke="${P.eyeC||"#f3efe6"}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="${P.closed}"/>`;}
    if(P.smile>0) g+=`<path d="M${f(R0(cx0-10,20))} Q${f(R0(cx0,20+P.smile*9))} ${f(R0(cx0+10,20))}" stroke="${P.eyeC||"#f3efe6"}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="${Math.min(1,P.smile*1.5)}"/>`;}
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
