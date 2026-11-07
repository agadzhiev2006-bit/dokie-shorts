const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({args:['--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 for (const q of ['?noaa','?noaa&pbr']){ const p = await b.newPage({viewport:{width:1920,height:1080}}); await p.goto('http://127.0.0.1:8123/ls3d/film3d.html'+q); await p.waitForFunction(()=>window.READY,{timeout:120000});
  for (const t of [12,30,160]){ const t0=Date.now(); await p.evaluate(t=>render(t),t); const t1=Date.now(); await p.screenshot({path:`/tmp/sp${q?'n':'a'}_${t}.jpg`,type:'jpeg',quality:92}); console.log(q,t,'render',t1-t0,'shot',Date.now()-t1);} await p.close(); }
 await b.close();})();
