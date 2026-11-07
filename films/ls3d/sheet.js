const { chromium } = require('playwright');
const [html, out, list] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({args:['--enable-unsafe-swiftshader','--ignore-gpu-blocklist']}); const p = await b.newPage({viewport:{width:1920,height:1080}});
  p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if(!/GPU stall|PCFSoft/.test(m.text())) console.log('LOG', m.text().slice(0,200)); });
  await p.goto(html); await p.waitForFunction(()=>window.READY,{timeout:90000});
  const sh = await p.evaluate(()=>SHOTS); console.log(JSON.stringify(sh.map(s=>[+s[0].toFixed(2),+s[1].toFixed(2)])));
  const ts = list ? list.split(',').map(Number) : sh.map(s=>+(s[0]+(s[1]-s[0])*.6).toFixed(2));
  for (const t of ts){ await p.evaluate(t=>render(t), t); await p.screenshot({path:`${out}/${String(t.toFixed(2)).padStart(7,'0')}.jpg`,type:'jpeg',quality:70}); }
  await b.close();
})();
