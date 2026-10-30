const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
await p.goto('file://'+__dirname+'/film.html');await p.waitForTimeout(300);
await p.evaluate(()=>{
 const t=2;
 const oL={time:"night",season:0,goals:4,clock:[23,47],cal:"1"};
 const dL=seated(t,{phone:1,tilt:12,ex:{lid:8,blink:0,mouth:.0}});
 oL.time="dusk"; const L=room(t,oL)+chair()+dL.s;
 const oR={time:"dusk",season:2,dust:1,notes:190,plant:0,cob:1,goals:4,faded:1,clock:[4,12],cal:"1000"};
 const PR=SEAT({lean:10,tilt:18}); const dR=seated(t,{age:1,lean:6,phone:1,tilt:18,fT:tgt(PR,[DX+175,DY-80],DX,DY,DS),ex:{lid:20,blink:0,brow:6,px:4}});
 const C=dR.C, r=150*0.62;
 const beard=`<g transform="translate(${C[0]} ${C[1]}) rotate(18) scale(0.62)">
  <path d="M-40,138 Q50,128 128,86 Q150,170 104,236 Q80,272 58,300 Q40,262 10,236 Q-30,196 -40,138 Z" fill="#e9e9e9" stroke="#0b0b0d" stroke-width="7" stroke-linejoin="round"/>
  ${[0,1,2].map(i=>`<path d="M${20+i*34},${150-i*8} q${8},${45} ${-2},${85-i*10}" stroke="#b5b5b5" stroke-width="6" fill="none" stroke-linecap="round"/>`).join("")}
  <path d="M34,66 Q70,58 108,50" stroke="#e9e9e9" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M-120,-110 Q-40,-170 60,-150" stroke="#e9e9e9" stroke-width="22" fill="none" stroke-linecap="round"/></g>`;
 const R=`<g filter="url(#gray)">`+room(t,oR)+chair()+`</g>`+dR.s+beard;
 const view=(inner)=>`<g transform="translate(480 600) scale(1.75) translate(-880 -520)">${inner}</g>`;
 document.getElementById('w').innerHTML=`<defs><filter id="gray"><feColorMatrix type="saturate" values=".25"/></filter><clipPath id="cl"><rect width="960" height="1080"/></clipPath><clipPath id="cr"><rect x="960" width="960" height="1080"/></clipPath></defs>
  <g clip-path="url(#cl)">${view(L)}</g><g clip-path="url(#cr)"><g transform="translate(960 0)">${view(R)}</g></g>`;
 const lab=(x,txt,c)=>`<g transform="translate(${x} 1000)"><rect x="-170" y="-62" width="340" height="88" rx="16" fill="${c}"/><text y="4" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="64" fill="#fff" letter-spacing="4">${txt}</text></g>`;
 document.getElementById('ov').innerHTML=`<rect x="952" width="16" height="1080" fill="#fff"/>
  <path d="M900,560 L1020,560 L1020,520 L1090,590 L1020,660 L1020,620 L900,620 Z" fill="#e5352b" stroke="#fff" stroke-width="8"/>
  ${lab(480,"DAY 1","#2a63d6")}${lab(1440,"DAY 1000","#e5352b")}
  <rect width="1920" height="300" fill="#0b0b0d" opacity=".85"/>
  <text x="960" y="98" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="78" letter-spacing="14" fill="#e5352b">THERE IS NO</text>
  <text x="960" y="262" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="170" letter-spacing="8" fill="#fff">TOMORROW</text>`;
});
await p.screenshot({path:'thumb2_full.png'});await b.close();})();
