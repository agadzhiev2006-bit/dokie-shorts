const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1000,height:1000}});
p.on('pageerror',e=>console.log(e.message));await p.goto('file://'+__dirname+'/ava.html');await p.waitForTimeout(300);
await p.screenshot({path:'/home/claude/dokiemind_avatar.png'});await b.close();})();
