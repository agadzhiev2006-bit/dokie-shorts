const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+__dirname+'/parents.html');await p.waitForTimeout(300);
await p.evaluate(()=>{
  // top: busted moment, bottom: laughing
  const top=panelStrict(14.9), bot=panelChill(15.2);
  let s=`<rect width="1080" height="1920" fill="#0a0b12"/>`;
  s+=`<g clip-path="url(#cA)"><g transform="translate(40 0)">${top}</g></g>`;
  s+=`<g clip-path="url(#cB)"><g transform="translate(40 960)">${bot}</g></g>`;
  s+=`<rect y="955" width="1080" height="10" fill="#0a0b12"/>`;
  s+=header(540,88,"STRICT PARENTS","#9fb2d6")+header(540,1150,"CHILL PARENTS","#ffcf8a");
  s+=`<rect x="110" y="845" width="860" height="230" rx="46" fill="#0a0b12" stroke="#2c3142" stroke-width="4"/>`;
  s+=T_(540,948,"SAME KID.",92,{c:"#eef0f6",f:"Inter,sans-serif",w:900,ls:2});
  s+=T_(540,1040,"DIFFERENT PARENTS",78,{c:"#ffcf8a",f:"Inter,sans-serif",w:900,ls:1});
  s+=T_(540,1890,"@ROBINSMEDIA",26,{c:"#b9bccb",f:"Inter,sans-serif",w:800,ls:6});
  document.getElementById("w").innerHTML=s;});
await p.screenshot({path:'/home/claude/robinsmedia_strict_vs_chill_cover.jpg',type:'jpeg',quality:93});await b.close();})();
