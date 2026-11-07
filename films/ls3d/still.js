const { chromium } = require('playwright');
const [html, out, ...times] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({args:['--enable-unsafe-swiftshader','--ignore-gpu-blocklist']}); const p = await b.newPage({viewport:{width:1920,height:1080}});
  p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => console.log('LOG', m.text()));
  await p.goto(html); await p.waitForFunction(()=>window.READY,{timeout:60000});
  for (const t of times){ const t0=Date.now(); await p.evaluate(t=>render(t), +t); await p.screenshot({path:`${out}_${t}.jpg`,type:'jpeg',quality:88}); console.log(t, Date.now()-t0,'ms'); }
  await b.close();
})();
