// usage: NODE_PATH=$(npm root -g) node render.js /abs/path/short.html DURATION_SEC /abs/out_dir
const { chromium } = require('playwright');
const [html, dur, out] = [process.argv[2], +process.argv[3], process.argv[4]];
const N = Math.ceil(dur*30), W = 4;
(async () => {
  const b = await chromium.launch();
  await Promise.all(Array.from({length:W},async (_,w)=>{
    const p = await b.newPage({viewport:{width:1080,height:1920}});
    await p.goto('file://'+html); await p.waitForTimeout(300);
    for (let f=w; f<N; f+=W){ await p.evaluate(t=>render(t), f/30);
      await p.screenshot({path:`${out}/${String(f).padStart(4,'0')}.jpg`,type:'jpeg',quality:92}); }
  }));
  await b.close();
})();
