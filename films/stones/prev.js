const { chromium } = require('playwright');
const ts=process.argv.slice(2).map(Number);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+__dirname+'/stones.html');await p.waitForTimeout(300);
for(const t of ts){await p.evaluate(t=>render(t),t);await p.screenshot({path:`pv/${t}.jpg`,type:'jpeg',quality:80});}
await b.close();})();
