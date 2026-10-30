const VIO="#7c3aed",VIO2="#a78bfa",BLU="#2563eb",BLU2="#60a5fa",MAG="#db2777",MAG2="#f472b6",GRY="#374151",GRY2="#6b7280",YEL2="#fde68a",GRN2="#86efac",DRK="#1f1b2e";
const SC=[[0,3.1,a0],[3.1,6.35,a1],[6.35,10.1,a2],[10.1,13.3,a3],[13.3,15.75,a4],[15.75,17.6,a5],[17.6,20.7,a6],[20.7,24.75,a7],[24.75,31.3,a8],[31.3,37.05,a9],[37.05,41.45,a10],[41.45,44.8,a11],[44.8,49.9,a12],[49.9,53.8,a13]];
const CAP=[[0,3.1,"AI MAKES THIS IN ~10 SECONDS~"],[3.1,6.35,"THAT'S EXACTLY THE ~PROBLEM~"],[6.35,8.24,"IF ANYONE CAN MAKE IT..."],[8.24,10.1,"WHY WATCH ~YOURS?~"],[10.1,13.3,"WITHOUT A ~HUMAN EYE~"],[13.3,15.75,"MUSIC THAT ~DOESN'T MATCH~"],[15.75,17.6,"CUTS WITH ~NO RHYTHM~"],[17.6,20.7,"DEAD EYES. ~SIX FINGERS~"],[20.7,23.35,"LOOKS ~ALMOST~ GOOD"],[23.35,24.75,"ALMOST GOOD GETS ~SCROLLED~"],[24.75,28.6,"EVERYONE SAYS ~IT'S EASY~"],[28.6,31.3,"1 TOOL. 30 DAYS. ~RICH~"],[31.3,33.7,"WHAT THEY ~DON'T SHOW~"],[33.7,37.05,"MONTHS. YEARS. ~0 VIEWS~"],[37.05,39.1,"TOOLS GOT ~BETTER~"],[39.1,41.45,"COMPETITION GOT ~BIGGER~"],[41.45,44.8,"SKILLS ARE LOSING ~VALUE~"],[44.8,46.9,"AI DOESN'T MAKE YOU ~RICH~"],[46.9,49.9,"IT MAKES WORKERS ~FASTER~"],[49.9,53.8,"WOULD YOU STILL TRY? ~YES~ OR ~NO~"]];
const BEATS=[0,3.26,4.15,6.52,8.24,10.28,13.48,15.93,17.77,19.0,20.89,22.17,23.54,24.85,26.22,28.66,30.5,31.45,33.72,37.25,39.14,41.65,43.6,45.02,47.03,49.07,50.11,51.99];
const TX=(x,y,fs,txt,c="#fff",sw=12)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${fs}" fill="${c}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke">${txt}</text>`;
function laptop(x,y,sc,inner,r=0){return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${sc})"><rect x="-320" y="-220" width="640" height="420" rx="30" fill="${INK}"/><rect x="-296" y="-196" width="592" height="372" rx="14" fill="#fff"/><g>${inner}</g><path d="M-380 200 H380 L340 250 H-340Z" fill="${INK}"/></g>`}
function phone(x,y,sc,inner,r=0){return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${sc})"><rect x="-190" y="-340" width="380" height="680" rx="50" fill="${INK}"/><clipPath id="pc"><rect x="-166" y="-310" width="332" height="620" rx="30"/></clipPath><rect x="-166" y="-310" width="332" height="620" rx="30" fill="#fff"/><g clip-path="url(#pc)">${inner}</g></g>`}
function thumbCard(x,y,sc,c){return `<g transform="translate(${x} ${y}) scale(${sc})"><rect x="-110" y="-70" width="220" height="140" rx="16" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-96" y="-56" width="192" height="80" rx="8" fill="${c}"/><path d="M-14 -36 L18 -16 L-14 4Z" fill="#fff"/><rect x="-96" y="36" width="140" height="14" rx="7" fill="#ccc"/></g>`}
function xMark(x,y,sc){return `<g transform="translate(${x} ${y}) scale(${sc})"><circle r="70" fill="${RED}" stroke="${INK}" stroke-width="8"/><path d="M-30 -30 L30 30 M30 -30 L-30 30" stroke="#fff" stroke-width="18" stroke-linecap="round"/></g>`}
function check(x,y,sc){return `<g transform="translate(${x} ${y}) scale(${sc})"><circle r="70" fill="${GRN}" stroke="${INK}" stroke-width="8"/><path d="M-32 0 L-8 24 L34 -26" stroke="#fff" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`}
function note(x,y,sc,r=0){return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${sc})"><path d="M-20 60 V-80 L80 -100 V40" stroke="${INK}" stroke-width="16" fill="none" stroke-linejoin="round"/><ellipse cx="-44" cy="62" rx="34" ry="26" fill="${INK}"/><ellipse cx="56" cy="42" rx="34" ry="26" fill="${INK}"/></g>`}
function eyeIc(x,y,sc,t){const bl=Math.abs(Math.sin(t*1.4))<.07?.12:1;return `<g transform="translate(${x} ${y}) scale(${sc} ${sc*bl})"><path d="M-200 0 Q0 -170 200 0 Q0 170 -200 0Z" fill="#fff" stroke="${INK}" stroke-width="14"/><circle r="78" fill="${BLU}" stroke="${INK}" stroke-width="10"/><circle r="36" fill="${INK}"/><circle cx="24" cy="-24" r="16" fill="#fff"/></g>`}
function hand6(x,y,sc,t){let s=`<g transform="translate(${x} ${y}) scale(${sc}) rotate(${Math.sin(t*3)*4})"><rect x="-120" y="-40" width="240" height="220" rx="80" fill="#f2c9a0" stroke="${INK}" stroke-width="10"/>`;
 for(let i=0;i<6;i++){const a=-55+i*22;s+=`<g transform="rotate(${a}) translate(0 -60)"><rect x="-22" y="-170" width="44" height="170" rx="22" fill="#f2c9a0" stroke="${INK}" stroke-width="10"/></g>`}
 s+=`<circle cx="0" cy="200" r="0"/></g>`;return s}
function deadFace(x,y,sc){return `<g transform="translate(${x} ${y}) scale(${sc})"><circle r="150" fill="#f2c9a0" stroke="${INK}" stroke-width="10"/><circle cx="-55" cy="-20" r="34" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="55" cy="-20" r="34" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="-55" cy="-20" r="6" fill="${INK}"/><circle cx="55" cy="-20" r="6" fill="${INK}"/><path d="M-60 70 Q0 90 60 70" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/></g>`}
function film(x,y,w,t,jit){let s=`<g transform="translate(${x} ${y})"><rect x="${-w/2}" y="-130" width="${w}" height="260" fill="${INK}"/>`;
 for(let i=0;i<14;i++)s+=`<rect x="${-w/2+20+i*(w/14)}" y="-118" width="30" height="22" rx="4" fill="#fff"/><rect x="${-w/2+20+i*(w/14)}" y="96" width="30" height="22" rx="4" fill="#fff"/>`;
 const cuts=[.07,.11,.43,.47,.5,.88];const cols=[BLU2,VIO2,YEL,MAG2,GRN2,ORG2,BLU2];let px=-w/2;
 cuts.concat([1]).forEach((c,i)=>{const nx=-w/2+c*w;s+=`<rect x="${px+4}" y="-84" width="${Math.max(0,nx-px-8)}" height="168" fill="${cols[i]}" transform="translate(${jit?((i*31+Math.floor(t*24))%9-4)*6:0} 0)"/>`;px=nx});
 return s+"</g>"}
function cal(x,y,sc,txt,c=RED){return `<g transform="translate(${x} ${y}) scale(${sc})"><rect x="-170" y="-150" width="340" height="300" rx="30" fill="#fff" stroke="${INK}" stroke-width="10"/><rect x="-170" y="-150" width="340" height="90" rx="30" fill="${c}"/><rect x="-170" y="-90" width="340" height="30" fill="${c}"/><text y="70" text-anchor="middle" font-size="66" fill="${INK}">${txt}</text></g>`}
function tag(x,y,sc,txt,price,r=0){return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${sc})"><path d="M-200 -90 H140 L220 0 L140 90 H-200Z" fill="${YEL}" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/><circle cx="150" r="16" fill="${INK}"/><text x="-30" y="-10" text-anchor="middle" font-size="54" fill="${INK}">${txt}</text><text x="-30" y="60" text-anchor="middle" font-size="60" fill="${RED}">${price}</text></g>`}
/* scenes */
function a0(t){let s=bg(VIO,VIO2,t);const p=lin(t,-.3,2.9);
 s+=laptop(600,720,1.05,`<text y="-90" text-anchor="middle" font-size="64" fill="${INK}">AI VIDEO</text><rect x="-240" y="-30" width="480" height="60" rx="30" fill="#ddd"/><rect x="-240" y="-30" width="${480*p}" height="60" rx="30" fill="${GRN}"/><text y="120" text-anchor="middle" font-size="80" fill="${INK}">0:${String(Math.min(10,Math.floor(p*10))).padStart(2,"0")}</text>`,-3);
 s+=man(270,1640,.7,t<1.6?POS.point:POS.smug,t);
 if(t>2.6)s+=check(860,500,pop(t,2.6))+burst(860,500,t,2.6);
 return s}
function a1(t){let s=bg(RED,"#ff6b5e",t);
 const shock=P({b:[200,215],f:[160,145],bh:"open",fh:"open",tilt:-8,ex:{brow:-16,brow2:-16,mouth:.9,px:0}});
 s+=man(540,1650,.82,t<4.15?POS.think:shock,t);
 if(t>4.15){const k=pop(t,4.15,.4);s+=`<g transform="translate(540 460) scale(${k}) rotate(${Math.sin(t*12)*5})"><text text-anchor="middle" y="120" font-size="380" fill="${YEL}" stroke="${INK}" stroke-width="22" paint-order="stroke">!</text></g>`+burst(540,400,t,4.15,"#fff")}
 return s}
function a2(t){let s=bg(BLU,BLU2,t);const n=t<8.24?Math.floor(1+lin(t,6.4,8.2)*11):12+Math.floor(lin(t,8.24,9.6)*18);
 const cols=[VIO2,MAG2,YEL,GRN2,ORG2];for(let i=0;i<n;i++){const cx=170+(i%4)*247,cy=260+Math.floor(i/4)*175;s+=thumbCard(cx,cy,.95*pop(t,6.4+i*.08,.25),cols[i%5])}
 s+=man(540,1680,.66,t<8.24?POS.point:POS.shrug,t);
 if(t>8.24)s+=`<g transform="translate(860 1150) scale(${pop(t,8.24)})"><circle r="110" fill="${YEL}" stroke="${INK}" stroke-width="10"/><text y="50" text-anchor="middle" font-size="150" fill="${INK}">?</text></g>`;
 return s}
function a3(t){let s=bg("#f59e0b",YEL2,t);s+=eyeIc(540,560,1.25*pop(t,10.15),t)+burst(540,560,t,11.4,"#fff");
 if(t>11.4)s+=TX(540,900,110,"HUMAN TASTE","#fff",14);
 s+=man(540,1680,.62,t<11.4?POS.idle:POS.point,t);return s}
function a4(t){let s=bg(DRK,"#3b3355",t);s+=badge("01",160,260,YEL,1.1*pop(t,13.3));
 for(let i=0;i<4;i++)s+=note(260+i*190,640+Math.sin(t*5+i)*30,.9*pop(t,13.4+i*.12),i%2?-10:12);
 if(t>14.3){s+=TX(540,950,80,"MOOD: SAD 😢",YEL)+xMark(870,500,pop(t,14.3))+burst(870,500,t,14.3,RED)}
 s+=man(540,1690,.6,t<14.3?POS.idle:POS.sad,t);return s}
function a5(t){let s=bg(MAG,MAG2,t);s+=badge("02",160,260,YEL,1.1*pop(t,15.75));
 s+=film(540,720,1000,t,t>16.6);if(t>16.6)s+=xMark(880,500,pop(t,16.6));
 s+=man(540,1690,.6,t<16.6?POS.think:POS.shrug,t);return s}
function a6(t){let s=bg("#0f766e","#2dd4bf",t);s+=badge("03",160,260,YEL,1.1*pop(t,17.6));
 s+=deadFace(330,640,pop(t,17.7)*1.05);if(t>19.0){s+=hand6(780,700,pop(t,19.0)*1.1,t)+TX(780,1060,90,"6 FINGERS?!",YEL)+burst(780,640,t,19.0,"#fff")}
 const scared=P({lean:-8,b:[200,215],f:[150,140],tilt:10,ex:{brow:-14,mouth:.7}});
 s+=man(540,1700,.58,t<19?POS.think:scared,t);return s}
function a7(t){let s=bg(GRY,GRY2,t);const sw=eo(lin(t,23.9,24.6));
 s+=phone(540,780,1.15,`<g transform="translate(0 ${-sw*700})"><rect x="-150" y="-290" width="300" height="420" rx="18" fill="${VIO2}"/><text y="-60" text-anchor="middle" font-size="54" fill="#fff">ALMOST</text><text y="0" text-anchor="middle" font-size="54" fill="#fff">GOOD</text><rect x="-150" y="150" width="200" height="22" rx="11" fill="#ccc"/><rect x="-150" y="190" width="140" height="22" rx="11" fill="#ccc"/><rect x="-150" y="440" width="300" height="420" rx="18" fill="${ORG2}"/></g>`);
 if(t>22.17&&t<23.9)s+=TX(860,420,90,"6/10",YEL);
 if(t>23.9){const hp=lin(t,23.9,24.5);s+=`<g transform="translate(${660} ${1050-hp*500})"><circle r="40" fill="#fff" stroke="${INK}" stroke-width="8"/></g>`}
 s+=man(220,1700,.55,POS.idle,t);return s}
function a8(t){let s=bg(MAG,"#fb7185",t);
 s+=phone(560,700,.95,`<rect x="-150" y="-290" width="300" height="560" rx="18" fill="${YEL}"/><text y="-150" text-anchor="middle" font-size="64" fill="${INK}">IT'S</text><text y="-70" text-anchor="middle" font-size="64" fill="${INK}">EASY!</text><text y="60" text-anchor="middle" font-size="110" fill="${INK}">💸</text><text y="200" text-anchor="middle" font-size="40" fill="${RED}">LINK IN BIO</text>`,4);
 const st=[["1 TOOL",28.66],["30 DAYS",29.5],["RICH",30.5]];st.forEach(([w,a],i)=>{if(t>a)s+=`<g transform="translate(${i===2?540:i?820:260} ${i===2?1180:1110}) rotate(${i%2?6:-8}) scale(${pop(t,a,.3)})"><rect x="-150" y="-60" width="300" height="120" rx="20" fill="#fff" stroke="${INK}" stroke-width="9"/><text y="28" text-anchor="middle" font-size="68" fill="${i===2?GRN:INK}">${w}</text></g>`});
 const sk=P({f:[30,170],fh:"point",tilt:10,ex:{brow:10,brow2:-12,lid:8}});
 s+=man(180,1720,.5,sk,t);return s}
function a9(t){let s=bg("#334155","#64748b",t);
 const lbl=t<32.87?"MONTH 1":t<33.72?"MONTH "+(2+Math.floor(lin(t,32.87,33.6)*10)):"YEAR "+(1+Math.floor(lin(t,33.72,36.0)*2));
 s+=cal(770,480,pop(t,31.4),lbl);
 s+=laptop(400,940,.7,`<text y="-40" text-anchor="middle" font-size="80" fill="${INK}">0 VIEWS</text><text y="60" text-anchor="middle" font-size="50" fill="#999">👁 · · ·</text>`);
 
 s+=man(820,1700,.55,POS.sad,t,true);return s}
function a10(t){let s=bg("#ea580c",ORG2,t);
 if(t<39.14){s+=`<g transform="translate(540 600) scale(${pop(t,37.25)})"><rect x="-260" y="-110" width="520" height="220" rx="24" fill="${RED}" stroke="${INK}" stroke-width="10"/><path d="M-90 -110 V-170 H90 V-110" stroke="${INK}" stroke-width="16" fill="none"/><text y="30" text-anchor="middle" font-size="70" fill="#fff">AI TOOLS</text></g>`;for(let i=0;i<5;i++)s+=`<g transform="translate(${180+i*180} ${360}) scale(${pop(t,37.6+i*.12)})"><text text-anchor="middle" font-size="70" fill="#fff" stroke="${INK}" stroke-width="10" paint-order="stroke">+</text></g>`}
 else{const n=Math.floor(3+lin(t,39.14,41.2)**1.6*30);for(let i=0;i<n;i++){const x=120+(i%6)*170,y=620+Math.floor(i/6)*190;s+=man(x,y,.16*pop(t,39.14+i*.05,.25),POS.idle,t+i)}}
 s+=man(540,1700,.6,t<39.14?POS.cheer:P({b:[200,215],f:[150,140],ex:{brow:-12,mouth:.6}}),t);return s}
function a11(t){let s=bg(DRK,"#4c1d95",t);const d=lin(t,42.86,44.5);
 s+=tag(540,500,1.4*pop(t,41.65),"SKILL",t<42.86?"$500":"$"+Math.max(20,Math.round(500-d*480)),-6);
 let pts=[];for(let i=0;i<=20;i++){const x=180+i*36,y=780+Math.pow(i/20,1.4)*380*cl(d*1.2);pts.push(x+","+y)}
 if(t>42.86)s+=`<polyline points="${pts.join(" ")}" fill="none" stroke="${RED}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>`;
 s+=man(840,1700,.55,t<42.86?POS.idle:POS.sad,t,true);return s}
function a12(t){let s=bg("#16a34a",GRN2,t);
 if(t<46.9){s+=`<g transform="translate(540 560) scale(${pop(t,45.02)})">`+TX(0,0,170,"AI ≠ $$$",YEL)+`</g>`;if(t>46.0)s+=xMark(540,800,pop(t,46.0))}
 else{const typing=Math.sin(t*30)>0;const P2=P({lean:10,b:[100,90],f:[95,100],bh:"open",fh:"open",ex:{brow:-4,mouth:.3}});
  s+=laptop(640,1050,.75,`<rect x="-240" y="-150" width="${480*lin(t,47.1,49.6)}" height="40" rx="20" fill="${GRN}"/><text y="60" text-anchor="middle" font-size="60" fill="${INK}">WORKING...</text>`);
  s+=man(330,1700,.58,P2,t);
  if(t>49.07){for(let i=0;i<14;i++){const y=200+(i*97)%800,ph=((t-49.07)*2.6+i*.37)%1;s+=`<rect x="${-300+ph*1600}" y="${y}" width="${180+i%4*50}" height="12" rx="6" fill="#fff" opacity=".8"/>`}s+=`<g transform="translate(540 420) scale(${pop(t,49.07)})">${TX(0,0,190,"FASTER",YEL,16)}</g>`}}
 return s}
function a13(t){let s=`<rect width="540" height="1920" fill="#16a34a"/><rect x="540" width="540" height="1920" fill="${RED}"/><path d="M540 0 V1920" stroke="${INK}" stroke-width="14"/>`;
 const pl=1+Math.sin(t*8)*.04;
 if(t>51.99){s+=`<g transform="translate(270 560) scale(${pop(t,51.99)*pl})">${TX(0,40,170,"YES","#fff",16)}</g><g transform="translate(810 560) scale(${pop(t,52.2)*pl})">${TX(0,40,170,"NO","#fff",16)}</g>`}
 else s+=`<g transform="translate(540 560) scale(${pop(t,50.11)})">${TX(0,40,120,"STILL TRY?",YEL,14)}</g>`;
 if(t>51.99)s+=`<g transform="translate(540 960) scale(${pop(t,52.3)})"><rect x="-300" y="-80" width="600" height="160" rx="80" fill="#fff" stroke="${INK}" stroke-width="10"/><text y="30" text-anchor="middle" font-size="76" fill="${INK}">COMMENT 👇</text></g>`;
 s+=man(540,1700,.6,POS.think,t);return s}
render(0);
