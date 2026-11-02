const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file:///home/claude/work/ep/ep.html');await p.waitForTimeout(300);
await p.evaluate(()=>{render(0.5);
 document.getElementById('cap').style.display='none';
 let s=SPLIT(1);
 s+=`<text x="540" y="430" text-anchor="middle" font-family="Inter Display" font-weight="800" font-size="210" fill="${POL}" stroke="${INK}" stroke-width="12" paint-order="stroke" letter-spacing="-4">POLITE</text>`;
 s+=G(540,540,1,`<circle r="74" fill="${INK}" stroke="#fff" stroke-width="10"/>${TXT(0,24,"OR",62,{c:"#fff",w:800})}`);
 s+=`<text x="540" y="790" text-anchor="middle" font-family="Inter Display" font-weight="800" font-size="190" fill="${SWR}" stroke="${INK}" stroke-width="12" paint-order="stroke" letter-spacing="-4">POTTY</text>`;
 s+=`<text x="540" y="980" text-anchor="middle" font-family="Inter Display" font-weight="800" font-size="190" fill="${SWR}" stroke="${INK}" stroke-width="12" paint-order="stroke" letter-spacing="-4">MOUTH?</text>`;
 s+=G(200,1150,.8,sb("fudge.",POL,380,80,1,0),{r:-10}); s+=G(880,1150,.85,sb(GRAW,SWR,400,92,0,1),{r:10});

 document.getElementById('gl').innerHTML=s;
 const P=Object.assign({},PO.shrug); P.ex={brow:-14,brow2:-14,mouth:.6,lid:0}; P.lb=[-12,6];P.lf=[18,-12];
 const mg=document.getElementById('mg'); mg.setAttribute('transform','translate(540 2160) scale(.95) translate(-540 -1665)'); mg.innerHTML=manSVG(P);
 document.getElementById('mshadow').setAttribute('cy',3000);
 document.getElementById('cam').style.transform='none'; document.getElementById('flash').style.opacity=0;});
await p.screenshot({path:'/home/claude/work/ep/cover_raw.png'});await b.close();})();
