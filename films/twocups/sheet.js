const { chromium } = require('playwright');
const [html, out] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1920,height:1080}});
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://'+html); await p.waitForTimeout(500);
  const sh = await p.evaluate(()=>SH.map((s,i)=>[i,+s.a.toFixed(2),+s.b.toFixed(2)]));
  console.log(JSON.stringify(sh), await p.evaluate(()=>DUR));
  const ts = process.argv[4] ? process.argv[4].split(',').map(Number) : sh.map(s=>+(s[1]+(s[2]-s[1])*.6).toFixed(2));
  for (const t of ts){ await p.evaluate(t=>render(t), t); await p.screenshot({path:`${out}/${String(t).padStart(7,'0')}.jpg`,type:'jpeg',quality:70}); }
  await b.close();
})();
