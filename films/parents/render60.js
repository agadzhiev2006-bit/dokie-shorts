const { chromium } = require('playwright');
const [html, dur, out, fps] = [process.argv[2], +process.argv[3], process.argv[4], +(process.argv[5]||60)];
const N = Math.ceil(dur*fps), W = 3;
(async () => {
  const b = await chromium.launch();
  await Promise.all(Array.from({length:W},async (_,w)=>{
    const p = await b.newPage({viewport:{width:1080,height:1920}});
    await p.goto('file://'+html); await p.waitForTimeout(300);
    for (let f=w; f<N; f+=W){ await p.evaluate(t=>render(t), f/fps);
      await p.screenshot({path:`${out}/${String(f).padStart(5,'0')}.jpg`,type:'jpeg',quality:93}); }
  }));
  await b.close(); console.log('DONE');
})();
