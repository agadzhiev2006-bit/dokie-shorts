const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1920,height:1080}});
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://'+process.cwd()+'/twocups.html'); await p.waitForTimeout(500);
  await p.evaluate(()=>{ const t=3.3; CZ=1.75;
    const g=GRAN(Object.assign({},SEATG,{brow:1.0,tilt:10,hunch:16,look:4,blink:0}));
    let w=kitchen(t,{season:"winter",clock:4.25,date:3,month:"DECEMBER"})+lampPend(1)+chairL()+chairR()+g.s+table(t,{cups:[{x:1060,k:1},{x:1215,k:0,band:"#6f9fd6"}]});
    let o=`<g transform="${camT([1060,560,1.75])}">${w}</g>`;
    o+=`<text x="1880" y="640" text-anchor="end" font-family="EB Garamond" font-weight="600" font-size="104" letter-spacing="10" fill="#f4efe6">TWO CUPS</text>`;
    document.getElementById('w').innerHTML=o; document.getElementById('fadeL').style.opacity=0; });
  await p.screenshot({path:'/home/claude/twocups_cover.jpg',type:'jpeg',quality:92});
  await b.close();
})();
