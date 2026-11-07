/* ---------- BOY ROOM (cold) ---------- */
/* o: eve (0 day..1 evening), tv (game anim), paused, phoneBuzz, phoneOn, phoneOnCouch */
function room(t,o={}){
  const eve=o.eve||0;
  let s=`<rect x="-200" y="-200" width="2400" height="1500" fill="#0f121a"/><rect x="-200" y="-200" width="2400" height="${FLOOR+200}" fill="url(#bWall)"/>`;
  s+=`<rect x="-200" y="${FLOOR}" width="2400" height="500" fill="#13161e"/><rect x="-200" y="${FLOOR}" width="2400" height="7" fill="#262c3a"/>`;
  for(let i=0;i<9;i++) s+=`<path d="M-200 ${FLOOR+28+i*i*9} L2200 ${FLOOR+28+i*i*9}" stroke="#171b25" stroke-width="3"/>`;
  /* window left */
  const sky1=eve?"#151c2e":"#7b8596", sky2=eve?"#2c3552":"#b9bec8";
  s+=`<rect x="140" y="200" width="380" height="420" fill="#20263a"/><linearGradient id="rsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky1}"/><stop offset="1" stop-color="${sky2}"/></linearGradient><rect x="156" y="216" width="348" height="388" fill="url(#rsky)"/>`;
  /* city outside */
  for(let i=0;i<7;i++){const bx=156+i*52, bh=90+rnd(i+20)*150; s+=`<rect x="${bx}" y="${604-bh}" width="46" height="${bh}" fill="${eve?"#0d1220":"#5d6676"}"/>`;
    if(eve) for(let j=0;j<5;j++) if(rnd(i*7+j)>.55) s+=`<rect x="${bx+8+(j%2)*18}" y="${604-bh+14+j*22}" width="8" height="10" fill="#f0c57c" opacity=".8"/>`;}
  if(eve) for(let i=0;i<40;i++){const py=((t*40+rnd(i+3)*500)%420)-10; s+=`<circle cx="${156+rnd(i+7)*348+Math.sin(t+i)*8}" cy="${216+py}" r="${1.5+rnd(i)*2}" fill="#fff" opacity=".7"/>`;}
  s+=`<path d="M330 216 L330 604 M156 410 L504 410" stroke="#20263a" stroke-width="12"/><rect x="128" y="616" width="404" height="16" fill="#2a3144"/>`;
  /* poster + shelf */
  s+=`<rect x="640" y="250" width="150" height="210" fill="#242b3d"/><rect x="652" y="262" width="126" height="186" fill="#3b4763"/><circle cx="715" cy="330" r="34" fill="#c45a3c" opacity=".7"/><rect x="668" y="390" width="94" height="10" fill="#9aa6c0" opacity=".6"/><rect x="668" y="408" width="70" height="8" fill="#9aa6c0" opacity=".4"/>`;
  s+=`<rect x="860" y="330" width="260" height="12" fill="#2a3144"/><rect x="880" y="280" width="26" height="50" fill="#3a4560"/><rect x="912" y="292" width="22" height="38" fill="#4b5675"/><rect x="1060" y="300" width="36" height="30" rx="4" fill="#58627c"/>`;
  /* couch */
  s+=`<g filter="url(#rimC)"><rect x="470" y="600" width="70" height="${FLOOR-640}" rx="24" fill="#2b3142"/><rect x="500" y="640" width="560" height="140" rx="30" fill="#2f3648"/><rect x="1020" y="700" width="80" height="${FLOOR-740}" rx="22" fill="#2b3142"/><rect x="480" y="770" width="620" height="70" rx="18" fill="#353d51"/><rect x="510" y="840" width="18" height="40" fill="#1c2130"/><rect x="1050" y="840" width="18" height="40" fill="#1c2130"/></g>`;
  /* phone on couch */
  if(o.phoneOnCouch){ const bz=o.buzz?Math.sin(t*90)*3:0; s+=`<g transform="translate(${bz} 0)"><rect x="880" y="762" width="64" height="12" rx="4" fill="#111318"/>${o.phoneLit?`<rect x="882" y="758" width="60" height="5" rx="2" fill="#cfe4ff"/><ellipse cx="912" cy="760" rx="90" ry="40" fill="url(#phG)"/>`:""}</g>`;
    if(o.buzz) s+=`<path d="M868 748 q-8 -10 0 -20 M956 748 q8 -10 0 -20" stroke="#cfe4ff" stroke-width="3" fill="none" opacity="${.5+.5*Math.sin(t*40)}"/>`;}
  /* TV */
  s+=`<rect x="1400" y="700" width="420" height="${FLOOR-700}" fill="#1a1e29"/><rect x="1420" y="720" width="380" height="8" fill="#232838"/><rect x="1600" y="660" width="20" height="40" fill="#1a1e29"/>`;
  s+=`<rect x="1380" y="400" width="460" height="270" rx="8" fill="#0a0c12"/>`;
  const sc=`<clipPath id="tvc"><rect x="1392" y="412" width="436" height="246"/></clipPath>`;
  let g=`<rect x="1392" y="412" width="436" height="246" fill="#0e1a33"/>`;
  if(!o.paused){ for(let i=0;i<6;i++){const gx=1392+((t*120*(1+i*.3)+i*120)%560)-60, gy=440+rnd(i)*190; g+=`<rect x="${gx}" y="${gy}" width="${30+rnd(i+3)*60}" height="${16+rnd(i+5)*30}" fill="${["#3f6fd8","#e05a4a","#47b8a8","#f2c14e"][i%4]}" opacity=".75"/>`;}
    g+=`<rect x="1392" y="610" width="436" height="48" fill="#1b2a52"/><circle cx="${1520+Math.sin(t*3)*60}" cy="${560+Math.abs(Math.sin(t*5))*-50}" r="16" fill="#fff"/>`; }
  else g+=`<rect x="1392" y="412" width="436" height="246" fill="#000" opacity=".5"/><text x="1610" y="545" text-anchor="middle" font-family="${SANS}" font-weight="800" font-size="34" fill="#e8ecf5" letter-spacing="6">PAUSED</text>`;
  s+=sc+`<g clip-path="url(#tvc)">${g}</g>`;
  const fl=.85+.15*Math.sin(t*7)*(o.paused?0:1);
  s+=`<ellipse cx="1500" cy="540" rx="${eve?900:650}" ry="${eve?520:380}" fill="url(#tvG)" opacity="${(eve?.9:.5)*fl}"/>`;
  return s;}
function controller(p,dir=1){return `<g filter="url(#rimC)"><rect x="${p[0]-30}" y="${p[1]-14}" width="60" height="26" rx="12" fill="#2a2e38"/></g>`;}

/* ---------- STREET (night, snow) ---------- */
function street(t,camx){
  let s=`<rect x="-3000" y="-400" width="9000" height="2000" fill="url(#nsky)"/>`;
  /* far houses parallax .5 */
  const px=camx*.5; let far="";
  for(let i=-4;i<14;i++){const hx=i*420+px*0, hw=300+rnd(i+30)*80, hh=220+rnd(i+31)*120;
    far+=`<path d="M${hx} 760 L${hx} ${760-hh} L${hx+hw/2} ${760-hh-110} L${hx+hw} ${760-hh} L${hx+hw} 760 Z" fill="#0b0f1b"/>`;
    for(let j=0;j<3;j++) if(rnd(i*5+j)>.4) far+=`<rect x="${hx+40+j*90}" y="${760-hh+50}" width="46" height="56" fill="#f2c27a" opacity=".85"/><rect x="${hx+40+j*90}" y="${760-hh+50}" width="46" height="56" fill="url(#warmG)" opacity=".4"/>`;}
  s+=`<g transform="translate(${px} 0)">${far}</g>`;
  s+=`<rect x="-3000" y="760" width="9000" height="140" fill="#3a4258"/><rect x="-3000" y="${FLOOR}" width="9000" height="400" fill="#c3cad8"/><rect x="-3000" y="${FLOOR}" width="9000" height="10" fill="#e6ebf3"/><rect x="-3000" y="${FLOOR+70}" width="9000" height="200" fill="#9aa3b5"/>`;
  for(let i=-3;i<12;i++){const lx=i*640+200; s+=`<rect x="${lx}" y="420" width="12" height="${FLOOR-420}" fill="#0d1018"/><path d="M${lx+6} 420 q0 -30 50 -30" stroke="#0d1018" stroke-width="10" fill="none"/><rect x="${lx+40}" y="384" width="40" height="16" rx="5" fill="#ffd9a0"/><path d="M${lx+44} 400 L${lx+76} 400 L${lx+200} ${FLOOR} L${lx-80} ${FLOOR} Z" fill="url(#cone)" opacity=".7"/><ellipse cx="${lx+60}" cy="${FLOOR+10}" rx="170" ry="26" fill="#ffe6bf" opacity=".35"/>`;}
  return s;}
function snowScreen(t,n=90,sp=1){ let s=""; for(let i=0;i<n;i++){const sz=1.5+rnd(i)*3.5, v=(40+rnd(i+1)*70)*sp*(sz/3); const y=((t*v+rnd(i+2)*1200)%1160)-40, x=(rnd(i+3)*2000+Math.sin(t*.8+i)*30-t*12*sz)%2000;
  s+=`<circle cx="${(x+2000)%2000-40}" cy="${y}" r="${sz}" fill="#fff" opacity="${.5+rnd(i+4)*.4}"/>`;} return s;}

/* ---------- FRONT DOOR (exterior, night) ---------- */
function frontDoor(t,o={}){ const op=o.open||0;
  let s=`<rect x="-200" y="-200" width="2400" height="1500" fill="#1b2132"/>`;
  for(let i=0;i<30;i++) s+=`<rect x="-200" y="${-100+i*34}" width="2400" height="3" fill="#232a3e"/>`;
  s+=`<rect x="-200" y="${FLOOR}" width="2400" height="500" fill="#b9c1d0"/><rect x="-200" y="${FLOOR}" width="2400" height="12" fill="#e2e7ef"/>`;
  s+=`<rect x="800" y="${FLOOR-20}" width="420" height="24" fill="#5a5f6e"/><rect x="800" y="${FLOOR-26}" width="420" height="8" fill="#e8ecf3"/>`;
  /* door frame */
  s+=`<rect x="868" y="330" width="284" height="${FLOOR-350}" fill="#2a2420"/>`;
  if(op>0.01) s+=`<rect x="882" y="344" width="256" height="${FLOOR-364}" fill="#ffcf91"/><rect x="882" y="344" width="256" height="${FLOOR-364}" fill="url(#kWall)" opacity="${.35}"/>`;
  const dw=256*(1-op*.82);
  s+=`<rect x="882" y="344" width="${dw}" height="${FLOOR-364}" fill="#5b3a2e"/>`;
  if(dw>90) s+=`<rect x="${882+24}" y="372" width="${dw-48}" height="140" rx="6" fill="#ffcf91" opacity=".8"/><rect x="${882+24}" y="540" width="${dw-48}" height="290" fill="none" stroke="#4a2f25" stroke-width="7"/><circle cx="${882+dw-30}" cy="620" r="10" fill="#c9a86a"/><circle cx="${882+dw/2}" cy="${460}" r="0"/>`;
  /* wreath? small number */
  s+=`<text x="1010" y="318" text-anchor="middle" font-family="${SERIF}" font-size="34" fill="#c9b48e">17</text>`;
  /* porch lamp */
  s+=`<rect x="800" y="430" width="36" height="56" rx="8" fill="#ffd9a0"/><rect x="796" y="424" width="44" height="10" fill="#141414"/><ellipse cx="818" cy="460" rx="320" ry="300" fill="url(#warmG)" opacity=".75"/>`;
  if(op>0.01) s+=`<path d="M882 ${FLOOR} L1138 ${FLOOR} L${1138+400*op} ${FLOOR+300} L${882-300*op} ${FLOOR+300} Z" fill="#ffd9a0" opacity="${.45*op}"/><ellipse cx="1010" cy="600" rx="${300+300*op}" ry="400" fill="url(#warmG)" opacity="${op*.8}"/>`;
  /* window right with warm light */
  s+=`<rect x="1300" y="420" width="260" height="240" fill="#2a2420"/><rect x="1314" y="434" width="232" height="212" fill="#f2c27a" opacity=".8"/><path d="M1430 434 L1430 646 M1314 540 L1546 540" stroke="#2a2420" stroke-width="10"/><rect x="1290" y="656" width="280" height="14" fill="#e8ecf3"/>`;
  return s;}

/* ---------- PHONE UI ---------- */
/* cfg: {dark, name, msgs:[{side,text,at,time?}], typing:{text,t0,cps,send}, read:{at,label}, scroll:fn(t), lock:{until,time,date}, cal:{...}} */
function phoneUI(t,c){
  const X=0,Y=0,Wd=360,Hh=760, dark=c.dark, bg=dark?"#000":"#f6f4f1", fg=dark?"#f2f2f4":"#1b1b1d", inB=dark?"#26262a":"#e4e2df", outB="#2f7cf6", sub=dark?"#8d8d93":"#8a8780";
  let s=`<rect x="0" y="0" width="${Wd}" height="${Hh}" fill="${bg}"/>`;
  if(c.lock&&t<c.lock.until){ s+=`<rect x="0" y="0" width="${Wd}" height="${Hh}" fill="url(#lockG)"/><text x="${Wd/2}" y="150" text-anchor="middle" font-family="${SANS}" font-weight="600" font-size="22" fill="#e9eef8">${c.lock.date}</text><text x="${Wd/2}" y="250" text-anchor="middle" font-family="Inter Display,${SANS}" font-weight="700" font-size="104" fill="#f3f6fb">${c.lock.time}</text>`;
    s+=`<text x="${Wd/2}" y="560" text-anchor="middle" font-family="${SANS}" font-weight="500" font-size="17" fill="#c7cfdd" opacity=".8">No Notifications</text><rect x="${Wd/2-60}" y="${Hh-22}" width="120" height="5" rx="3" fill="#fff" opacity=".8"/>`; return s;}
  if(c.cal) return s+calUI(t,c);
  /* messages area */
  const kbH=270, kbIn=c.typing?eio(Pr(t,c.typing.t0-.35,c.typing.t0)):0, kbOut=c.typing&&c.typing.send?eio(Pr(t,c.typing.send+.1,c.typing.send+.45)):0, kb=kbIn*(1-kbOut);
  const inputY=Hh-58-kb*kbH;
  let y=inputY-16+(c.scroll?c.scroll(t):0); let m="";
  const all=c.msgs.slice(); if(c.typing&&c.typing.send&&t>=c.typing.send) all.push({side:"out",text:c.typing.text,at:c.typing.send});
  const sz=c.big?25:22, lh=sz*1.32;
  for(let i=all.length-1;i>=0;i--){ const M=all[i]; if(t<M.at) continue; const pop=eob(Pr(t,M.at,M.at+.3));
    const lines=wrap(M.text,c.big?17:21), bw=Math.min(268,Math.max(...lines.map(l=>l.length))*sz*.56+36), bh=lines.length*lh+20;
    if(c.read&&i==all.length-1&&M.side=="out"&&t>c.read.at){ m+=`<text x="${Wd-14}" y="${y}" text-anchor="end" font-family="${SANS}" font-size="13" font-weight="600" fill="${sub}" opacity="${Pr(t,c.read.at,c.read.at+.3)}">${c.read.label}</text>`; y-=20;}
    const bx=M.side=="out"?Wd-12-bw:12, by=y-bh;
    m+=`<g transform="translate(${bx+(M.side=="out"?bw:0)} ${y}) scale(${pop}) translate(${-(bx+(M.side=="out"?bw:0))} ${-y})"><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="19" fill="${M.side=="out"?outB:inB}"/>`;
    lines.forEach((l,j)=>m+=`<text x="${bx+18}" y="${by+14+sz*.95+j*lh}" font-family="${SANS}" font-size="${sz}" fill="${M.side=="out"?"#fff":fg}">${esc(l)}</text>`); m+=`</g>`;
    y=by-8; if(M.time){ m+=`<text x="${Wd/2}" y="${y-6}" text-anchor="middle" font-family="${SANS}" font-size="13" font-weight="600" fill="${sub}">${M.time}</text>`; y-=34;}
  }
  s+=`<clipPath id="msgc"><rect x="0" y="92" width="${Wd}" height="${inputY-92}"/></clipPath><g clip-path="url(#msgc)">${m}</g>`;
  /* header */
  s+=`<rect x="0" y="0" width="${Wd}" height="92" fill="${dark?"#121214":"#ecebe8"}" opacity=".97"/><path d="M22 58 l-10 -10 l10 -10" stroke="${outB}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  s+=`<circle cx="${Wd/2}" cy="40" r="22" fill="${c.avatar||"#9a8f84"}"/><text x="${Wd/2}" y="48" text-anchor="middle" font-family="${SANS}" font-weight="700" font-size="20" fill="#fff">${c.initial||"G"}</text><text x="${Wd/2}" y="82" text-anchor="middle" font-family="${SANS}" font-size="13" font-weight="600" fill="${fg}">${c.name} ›</text>`;
  /* input */
  const typed=c.typing&&t>=c.typing.t0&&!(c.typing.send&&t>=c.typing.send)?c.typing.text.slice(0,Math.floor((t-c.typing.t0)*(c.typing.cps||12))):"";
  s+=`<rect x="0" y="${inputY-6}" width="${Wd}" height="${Hh-inputY+6}" fill="${bg}"/><rect x="52" y="${inputY}" width="${Wd-66}" height="40" rx="20" fill="none" stroke="${dark?"#3a3a3f":"#cfccc6"}" stroke-width="1.5"/><circle cx="28" cy="${inputY+20}" r="15" fill="${dark?"#2a2a2e":"#dedbd6"}"/><path d="M28 ${inputY+12} v16 M20 ${inputY+20} h16" stroke="${sub}" stroke-width="2.4"/>`;
  s+=typed?`<text x="68" y="${inputY+27}" font-family="${SANS}" font-size="19" fill="${fg}">${esc(typed)}<tspan fill="${outB}" opacity="${(t*2%1)<.5?1:0}">|</tspan></text>`:`<text x="68" y="${inputY+27}" font-family="${SANS}" font-size="18" fill="${sub}">iMessage</text>`;
  if(typed) s+=`<circle cx="${Wd-34}" cy="${inputY+20}" r="15" fill="${outB}"/><path d="M${Wd-34} ${inputY+28} v-15 M${Wd-40} ${inputY+19} l6 -6 l6 6" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  if(kb>0.01){ const ky=Hh-kb*kbH; s+=`<rect x="0" y="${ky}" width="${Wd}" height="${kbH}" fill="${dark?"#1c1c1f":"#d4d1cc"}"/>`;
    const rows=["qwertyuiop","asdfghjkl","zxcvbnm"]; rows.forEach((r,i)=>{const kw=31, ox=(Wd-r.length*(kw+4))/2; for(let j=0;j<r.length;j++){
      const hit=typed&&typed.length&&typed[typed.length-1].toLowerCase()==r[j]&&((t-c.typing.t0)*(c.typing.cps||12))%1<.5;
      s+=`<rect x="${ox+j*(kw+4)}" y="${ky+14+i*54}" width="${kw}" height="44" rx="6" fill="${hit?(dark?"#77777d":"#fff"):(dark?"#4a4a4f":"#f7f6f4")}"/><text x="${ox+j*(kw+4)+kw/2}" y="${ky+44+i*54}" text-anchor="middle" font-family="${SANS}" font-size="20" fill="${fg}">${r[j]}</text>`;}});
    s+=`<rect x="${Wd/2-90}" y="${ky+176}" width="180" height="44" rx="6" fill="${dark?"#4a4a4f":"#f7f6f4"}"/>`;}
  s+=`<rect x="${Wd/2-60}" y="${Hh-12}" width="120" height="5" rx="3" fill="${dark?"#fff":"#000"}" opacity=".7"/>`;
  return s;}
function wrap(txt,n){const w=txt.split(" "), out=[]; let cur=""; for(const x of w){ if((cur+" "+x).trim().length>n&&cur){out.push(cur);cur=x;} else cur=(cur+" "+x).trim(); } if(cur) out.push(cur); return out;}
function calUI(t,c){ const Wd=360; const C=c.cal; let s=`<rect x="0" y="0" width="${Wd}" height="760" fill="#000"/>`;
  s+=`<text x="20" y="70" font-family="${SANS}" font-size="17" fill="#ff453a">‹ Cancel</text><text x="${Wd/2}" y="70" text-anchor="middle" font-family="${SANS}" font-weight="700" font-size="18" fill="#fff">New Event</text><text x="${Wd-20}" y="70" text-anchor="end" font-family="${SANS}" font-weight="700" font-size="17" fill="${t>C.add?"#8d8d93":"#ff453a"}">Add</text>`;
  const n=Math.floor(Math.max(0,t-C.t0)*10), title=C.title.slice(0,n);
  s+=`<rect x="14" y="100" width="${Wd-28}" height="96" rx="12" fill="#1c1c1e"/><text x="30" y="140" font-family="${SANS}" font-size="20" fill="#fff">${esc(title)}${t>C.t0&&n<C.title.length?"|":""}</text><path d="M30 156 H${Wd-30}" stroke="#2c2c2e"/><text x="30" y="184" font-family="${SANS}" font-size="17" fill="#8d8d93">Grandma's place</text>`;
  s+=`<rect x="14" y="214" width="${Wd-28}" height="96" rx="12" fill="#1c1c1e"/><text x="30" y="250" font-family="${SANS}" font-size="17" fill="#fff">Starts</text><rect x="${Wd-180}" y="230" width="152" height="30" rx="7" fill="#2c2c2e"/><text x="${Wd-104}" y="251" text-anchor="middle" font-family="${SANS}" font-size="15" fill="#fff">Sun  4:00 PM</text><path d="M30 264 H${Wd-30}" stroke="#2c2c2e"/><text x="30" y="294" font-family="${SANS}" font-size="17" fill="#fff">Ends</text><text x="${Wd-30}" y="294" text-anchor="end" font-family="${SANS}" font-size="15" fill="#8d8d93">6:00 PM</text>`;
  const rp=t>C.rep; s+=`<rect x="14" y="328" width="${Wd-28}" height="52" rx="12" fill="${rp?"#2a2016":"#1c1c1e"}"/><text x="30" y="361" font-family="${SANS}" font-size="17" fill="#fff">Repeat</text><text x="${Wd-30}" y="361" text-anchor="end" font-family="${SANS}" font-size="17" font-weight="${rp?700:400}" fill="${rp?"#ffb35c":"#8d8d93"}">${rp?"Every Week ›":"Never ›"}</text>`;
  s+=`<rect x="14" y="398" width="${Wd-28}" height="52" rx="12" fill="#1c1c1e"/><text x="30" y="431" font-family="${SANS}" font-size="17" fill="#fff">Alert</text><text x="${Wd-30}" y="431" text-anchor="end" font-family="${SANS}" font-size="17" fill="#8d8d93">1 hour before ›</text>`;
  if(t>C.add){ const p=eob(Pr(t,C.add,C.add+.35)); s+=`<g opacity="${Pr(t,C.add,C.add+.2)}" transform="translate(${Wd/2} 600) scale(${p}) translate(${-Wd/2} -600)"><rect x="40" y="540" width="${Wd-80}" height="120" rx="18" fill="#1c1c1e"/><circle cx="${Wd/2}" cy="578" r="20" fill="#ffb35c"/><path d="M${Wd/2-9} 578 l6 7 l12 -14" stroke="#000" stroke-width="3.5" fill="none" stroke-linecap="round"/><text x="${Wd/2}" y="630" text-anchor="middle" font-family="${SANS}" font-size="16" font-weight="600" fill="#fff">Every Sunday · 4:00 PM</text></g>`;}
  return s;}
/* phone held in hand, full-frame close-up; bgFn draws blurred background */
function phoneShot(t,c){ const rot=c.rot??-3, px=960+(c.dx||0), py=575+(c.dy||0)+Math.sin(t*.9)*3, sc=c.sc||1.06, rim=c.rim||"rimC";
  let s=`<g filter="url(#blur24)">${c.bg(t)}</g><rect x="0" y="0" width="1920" height="1080" fill="#000" opacity="${c.dim??.35}"/>`;
  s+=`<ellipse cx="${px}" cy="${py}" rx="560" ry="520" fill="${c.dark?"url(#phG)":"url(#warmG)"}" opacity=".3"/>`;
  let ph=`<g filter="url(#${rim})"><rect x="-196" y="-396" width="392" height="792" rx="58" fill="#0b0b0d"/></g><g transform="translate(-180 -380)"><clipPath id="scr"><rect x="0" y="0" width="360" height="760" rx="44"/></clipPath><g clip-path="url(#scr)">${phoneUI(t,c)}</g></g>`;
  const th=c.thumb?c.thumb(t):null, tap=c.tap?c.tap(t):null;
  let hand=`<g filter="url(#${rim})"><path d="M-250 250 Q-280 520 -140 700 L240 700 Q270 520 226 300 Q170 250 80 268 L-160 262 Z" fill="#0b0b0d"/>`;
  hand+=[-150,-62,26].map((yy,i)=>`<rect x="-262" y="${yy}" width="104" height="54" rx="27" fill="#0b0b0d" transform="rotate(${-6+i*5} -210 ${yy+27})"/>`).join("");
  if(th) hand+=`<path d="M200 470 Q${th[0]+70} ${th[1]+120} ${th[0]} ${th[1]}" stroke="#0b0b0d" stroke-width="52" fill="none" stroke-linecap="round"/>`;
  else hand+=`<rect x="176" y="150" width="58" height="150" rx="29" fill="#0b0b0d"/>`;
  hand+=`</g>`;
  let tp=""; if(tap){ const b=[tap[0]+170,tap[1]+420]; tp=`<g filter="url(#${rim})"><path d="M${b[0]} ${b[1]} L${tap[0]+8} ${tap[1]+14}" stroke="#0b0b0d" stroke-width="64" fill="none" stroke-linecap="round"/><path d="M${b[0]-70} ${b[1]-30} Q${b[0]+40} ${b[1]-110} ${b[0]+150} ${b[1]+20} L${b[0]+190} ${b[1]+400} L${b[0]-90} ${b[1]+400} Z" fill="#0b0b0d"/><rect x="${b[0]-80}" y="${b[1]-10}" width="70" height="44" rx="22" fill="#0b0b0d" transform="rotate(-30 ${b[0]-45} ${b[1]+12})"/></g>`;}
  return s+`<g transform="translate(${px} ${py}) rotate(${rot}) scale(${sc})">${ph}${hand}${tp}</g>`;}
/* hand + arm insert in world coords */
function armHand(a,w,sc,rim="rimC",grab=1){ const ang=Math.atan2(w[1]-a[1],w[0]-a[0])/D; const m=[(a[0]+w[0])/2,(a[1]+w[1])/2-30*sc];
  let s=`<g filter="url(#${rim})"><path d="M${f(a)} Q${f(m)} ${f(w)}" stroke="#0b0b0d" stroke-width="${22*sc}" fill="none" stroke-linecap="round"/>`;
  s+=`<g transform="translate(${f(w)}) rotate(${ang}) scale(${sc})"><rect x="-6" y="-15" width="36" height="30" rx="13" fill="#0b0b0d"/>`;
  for(let i=0;i<4;i++){const yy=-11+i*7.4; s+=grab?`<path d="M26 ${yy} q14 2 14 10" stroke="#0b0b0d" stroke-width="7" fill="none" stroke-linecap="round"/>`:`<rect x="24" y="${yy-3.5}" width="${22-Math.abs(i-1.5)*3}" height="7" rx="3.5" fill="#0b0b0d"/>`;}
  s+=`<path d="M12 -12 l12 -12" stroke="#0b0b0d" stroke-width="8" stroke-linecap="round"/></g></g>`; return s;}
/* thumb hovering over keyboard keys while typing */
function thumbType(t0,t1,cps=12){ return t=>{ if(t<t0-.3||t>t1+.3) return null; const k=Math.floor((t-t0)*cps), r=rnd(k), q=(t-t0)*cps%1;
  return [-90+r*200, 250+rnd(k+7)*120+(q<.4?10:0)];};}

/* ---------- black cards ---------- */
function cardText(t,o){ /* o: lines:[{txt,at,sz,it,c,ls,y,font,w}], out */
  let s=`<rect x="0" y="0" width="1920" height="1080" fill="#000"/>`;
  o.lines.forEach(L=>{ const op=Math.min(Pr(t,L.at,L.at+(L.fi||.5)),1-Pr(t,o.out,o.out+.4)); if(op<=0) return;
    s+=`<text x="960" y="${L.y}" text-anchor="middle" font-family="${L.font||SERIF}" font-size="${L.sz||46}" ${L.it?'font-style="italic"':""} font-weight="${L.w||400}" letter-spacing="${L.ls||0}" fill="${L.c||"#f2efe8"}" opacity="${op}">${esc(L.txt)}</text>`;});
  return s;}
