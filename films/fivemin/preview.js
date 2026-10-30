const {chromium}=require('playwright');
const [html,out,...ts]=process.argv.slice(2);
(async()=>{const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1920,height:1080}});
 const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+html); await p.waitForTimeout(300);
 for(const t of ts){ try{await p.evaluate(t=>render(t),+t);}catch(e){errs.push(t+': '+e.message)}
  await p.screenshot({path:`${out}/f_${String(Math.round(t*10)).padStart(5,'0')}.jpg`,type:'jpeg',quality:80}); }
 console.log(errs.join('\n')||'ok'); await b.close();})();
