const { chromium } = require('playwright');
const [html,out,times]=[process.argv[2],process.argv[3],process.argv[4].split(',').map(Number)];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()==='error')console.log('CERR',m.text())});
await p.goto('file://'+html);await p.waitForTimeout(300);
for(const t of times){await p.evaluate(t=>render(t),t);await p.screenshot({path:`${out}/t${t}.jpg`,type:'jpeg',quality:70});}
await b.close();})();
