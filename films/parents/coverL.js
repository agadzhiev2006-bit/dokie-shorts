const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+__dirname+'/ladder.html');await p.waitForTimeout(300);
await p.evaluate(()=>{
  const t=20.3; const W=world(t);
  let s=`<g transform="translate(540 1060) scale(1.25) translate(-700 -260)">${W}</g>`;
  s+=`<rect width="1080" height="560" fill="#05060b" opacity=".55"/>`;
  s+=T_(540,300,"SHE STAYED",120,{c:"#f4f1ea",f:"Inter,sans-serif",w:900,ls:2});
  s+=T_(540,410,"when he had &#36;0",70,{c:"#ffd98f",f:"Caladea,Georgia,serif",it:1,w:700});
  s+=T_(540,1880,"@ROBINSMEDIA",26,{c:"#9aa0b5",f:"Inter,sans-serif",w:800,ls:6});
  document.getElementById("w").innerHTML=s; document.getElementById("flash").style.opacity=0;});
await p.screenshot({path:'/home/claude/robinsmedia_ladder_cover.jpg',type:'jpeg',quality:93});await b.close();})();
