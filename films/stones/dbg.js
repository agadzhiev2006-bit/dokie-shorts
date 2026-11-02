const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+__dirname+'/stones.html');
console.log(await p.evaluate(()=>[13.5,14.2,14.6,15.0].map(t=>[t,feetY(t),JSON.stringify(dokPose(t))])));await b.close();})();
