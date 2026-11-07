const { chromium } = require('playwright');
(async()=>{ for (const args of [[],['--use-angle=swiftshader','--enable-unsafe-swiftshader'],['--use-gl=angle','--use-angle=swiftshader-webgl','--enable-unsafe-swiftshader']]){
 const b=await chromium.launch({args}); const p=await b.newPage();
 const r=await p.evaluate(()=>{const c=document.createElement('canvas');const g=c.getContext('webgl2');return g?g.getParameter(g.RENDERER)+' | '+g.getParameter(g.VERSION):'none'});
 console.log(JSON.stringify(args),r); await b.close(); }})();
