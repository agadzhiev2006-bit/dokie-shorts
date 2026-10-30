const { chromium } = require('playwright');
const [html, dur, out, W0, F0] = [process.argv[2], +process.argv[3], process.argv[4], +(process.argv[5]||3), +(process.argv[6]||0)];
const N = Math.ceil(dur*30), W = W0;
(async () => { const b = await chromium.launch();
  await Promise.all(Array.from({length:W},async (_,w)=>{ const p = await b.newPage({viewport:{width:1920,height:1080}});
    await p.goto('file://'+html); await p.waitForTimeout(400);
    for (let f=F0+w; f<N; f+=W){ await p.evaluate(t=>render(t), f/30);
      await p.screenshot({path:`${out}/${String(f).padStart(5,'0')}.jpg`,type:'jpeg',quality:90}); } }));
  await b.close(); })();
