const { chromium } = require('playwright');
const [html, a, b, out, fps, scale, W] = [process.argv[2], +process.argv[3], +process.argv[4], process.argv[5], +process.argv[6], +process.argv[7], +(process.argv[8]||2)];
const N0=Math.round(a*fps), N1=Math.round(b*fps);
(async () => {
  const br = await chromium.launch();
  await Promise.all(Array.from({length:W},async (_,w)=>{
    const p = await br.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:scale});
    p.on('pageerror', e => console.log('ERR', e.message));
    await p.goto('file://'+html); await p.waitForTimeout(500);
    for (let f=N0+w; f<N1; f+=W){ await p.evaluate(t=>render(t), f/fps);
      await p.screenshot({path:`${out}/${String(f).padStart(5,'0')}.jpg`,type:'jpeg',quality:92}); }
  }));
  await br.close(); console.log('DONE');
})();
