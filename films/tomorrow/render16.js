const { chromium } = require('playwright');
const [html, dur, out] = [process.argv[2], +process.argv[3], process.argv[4]];
const N = Math.ceil(dur*30), W = 3;
(async () => { const b = await chromium.launch();
  await Promise.all(Array.from({length:W},async (_,w)=>{ const p = await b.newPage({viewport:{width:1920,height:1080}});
    await p.goto('file://'+html); await p.waitForTimeout(300);
    for (let f=w; f<N; f+=W){ await p.evaluate(t=>render(t), f/30);
      await p.screenshot({path:`${out}/${String(f).padStart(5,'0')}.jpg`,type:'jpeg',quality:90}); } }));
  await b.close(); })();
