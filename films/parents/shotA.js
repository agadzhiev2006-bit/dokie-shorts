const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:600}});
p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('file://'+__dirname+'/'+process.argv[2]);await p.waitForTimeout(300);
await p.screenshot({path:process.argv[3]});await b.close();})();
