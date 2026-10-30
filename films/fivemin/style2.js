/* ===== style v2: chunky silhouette with rim, eyes+brows, perspective sets, DOF ===== */
const INK2="#0d0d0f", RIM="#b8bdc5";
const DEFS2=`
 <filter id="rim" x="-20%" y="-20%" width="140%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius="4" result="d"/><feFlood flood-color="${RIM}"/><feComposite in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="dof" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="16"/></filter>
 <filter id="dof2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
 <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="60"/></filter>
 <filter id="sh2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>`;
const P2=(pts)=>pts.map(p=>p[0].toFixed(1)+","+p[1].toFixed(1)).join(" ");
/* front-facing chunky character. (x,y)=bottom centre of torso. P.arms: {l:[x,y] world fist target, r:[...]}, brow 0..1 sad, eyeY look down, eyeX */
function char2(x,y,s,P={}){
  P=Object.assign({brow:0,eyeX:0,eyeY:0,blink:0,tilt:0,legs:0,l:null,r:null,lit:null,band:0},P);
  const S=v=>v*s, W=(px,py)=>[x+S(px),y+S(py)];
  const shL=W(-74,-182), shR=W(74,-182);
  const arm=(sh,tg,side)=>{const dflt=W(side*96,-20); const t=tg||dflt; const a=ik(sh,t,S(100),S(96),side>0?-1:1);
    const e=add(sh,v(a[0],S(100))), h=add(e,v(a[1],S(96)));
    return `<g filter="url(#rim)"><path d="M${f(sh)} L${f(e)} L${f(h)}" stroke="${INK2}" stroke-width="${S(42)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${h[0]}" cy="${h[1]}" r="${S(27)}" fill="${INK2}"/></g>`;};
  let s0="";
  if(P.legs) s0+=`<g filter="url(#rim)"><rect x="${x-S(66)}" y="${y-S(10)}" width="${S(52)}" height="${S(190)}" rx="${S(10)}" fill="${INK2}"/><rect x="${x+S(14)}" y="${y-S(10)}" width="${S(52)}" height="${S(190)}" rx="${S(10)}" fill="${INK2}"/></g>`;
  const hc=W(0,-300);
  const body=`<path d="M${f(W(-70,-205))} Q${f(W(-84,-205))} ${f(W(-86,-186))} L${f(W(-96,-24))} Q${f(W(-98,0))} ${f(W(-74,0))} L${f(W(74,0))} Q${f(W(98,0))} ${f(W(96,-24))} L${f(W(86,-186))} Q${f(W(84,-205))} ${f(W(70,-205))} Z" fill="${INK2}"/>`;
  const head=`<g transform="rotate(${P.tilt} ${hc[0]} ${hc[1]+S(100)})"><circle cx="${hc[0]}" cy="${hc[1]}" r="${S(104)}" fill="${INK2}"/>${P.band?`<path d="M${hc[0]-S(104)},${hc[1]-S(40)} Q${hc[0]},${hc[1]-S(75)} ${hc[0]+S(104)},${hc[1]-S(40)} L${hc[0]+S(100)},${hc[1]-S(14)} Q${hc[0]},${hc[1]-S(48)} ${hc[0]-S(100)},${hc[1]-S(14)} Z" fill="#e6e2d8"/>`:""}</g>`;
  s0+=`<g filter="url(#rim)">${body}${head}</g>`;
  /* face */
  const ex=P.eyeX, ey=P.eyeY, eh=S(15)*(1-P.blink);
  s0+=`<g transform="rotate(${P.tilt} ${hc[0]} ${hc[1]+S(100)})">`;
  for(const sd of [-1,1]){const cx=hc[0]+S(sd*36+ex), cy=hc[1]+S(4+ey);
    s0+=`<ellipse cx="${cx}" cy="${cy}" rx="${S(11)}" ry="${Math.max(1,eh)}" fill="#efe8d6"/>`;
    const inY=-40-P.brow*14, outY=-34+P.brow*8;
    s0+=`<path d="M${hc[0]+S(sd*64+ex)},${hc[1]+S(outY+ey*.4)} Q${hc[0]+S(sd*40+ex)},${hc[1]+S((inY+outY)/2-6+ey*.4)} ${hc[0]+S(sd*16+ex)},${hc[1]+S(inY+ey*.4)}" stroke="#8b9098" stroke-width="${S(7)}" fill="none" stroke-linecap="round"/>`;}
  s0+=`</g>`;
  s0+=arm(shL,P.l,-1)+arm(shR,P.r,1);
  if(P.lit){const [c,o]=P.lit; s0+=`<ellipse cx="${hc[0]}" cy="${hc[1]+S(150)}" rx="${S(160)}" ry="${S(170)}" fill="${c}" opacity="${o}" style="mix-blend-mode:screen" filter="url(#sh2)"/>`;}
  return {s:s0,hc};}
/* speech text above head */
const say2=(x,y,str,sz=78,op=1)=>`<g opacity="${op}"><text x="${x}" y="${y}" text-anchor="middle" font-family="Patrick Hand" font-size="${sz}" fill="#f3ead6" stroke="#262628" stroke-width="${sz*.16}" stroke-linejoin="round" paint-order="stroke">${str}</text></g>`;
