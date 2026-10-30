const {chromium}=require('playwright');
// [film t0, t1, crop centre x, text lines]
const SEG=[[0.0,6.3,760,["He said “tomorrow”","1,000 times."]],
 [22.8,28.0,880,["Every night.","Same word."]],
 [29.5,34.0,960,["“5 more minutes.”"]],
 [43.0,46.5,820,["Days became months."]],
 [54.6,58.6,960,["Even when Dad called."]],
 [68.0,72.0,820,["Then years."]],
 [81.8,87.8,900,["Tomorrow","never came."]],
 [102.7,105.9,760,["But what if","it's not too late?"]]];
const END=2.6, out=process.argv[2];
(async()=>{const b=await chromium.launch();
 const p=await b.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1080/607.5});
 await p.goto('file://'+__dirname+'/film.html');await p.waitForTimeout(300);
 await p.evaluate(()=>{window.NOCAP=1;});
 let f=0;
 for(const [a,bb,cx,lines] of SEG){const n=Math.round((bb-a)*30);
  for(let i=0;i<n;i++){const t=a+i/30, lt=i/30;
   await p.evaluate(([t,cx,lines,lt,dur])=>{render(t);
     const op=Math.min(1,lt/.25,(dur-lt)/.2);
     const h=lines.length*66+34; let s=`<g opacity="${op}"><rect x="${cx-290}" y="340" width="580" height="${h}" rx="18" fill="rgba(8,8,14,.72)"/>`; lines.forEach((L,k)=>{const y=400+k*66;
       s+=`<text x="${cx+3}" y="${y+4}" text-anchor="middle" font-family="Caladea" font-style="italic" font-weight="700" font-size="54" fill="rgba(0,0,0,.75)">${L}</text><text x="${cx}" y="${y}" text-anchor="middle" font-family="Caladea" font-style="italic" font-weight="700" font-size="54" fill="${k===lines.length-1&&lines.length>1?'#f7d046':'#fff'}">${L}</text>`;});
     s+=`</g>`; document.getElementById('ov').innerHTML=s; document.getElementById('flash').style.opacity=lt<.12?(.12-lt)*4:0;},[t,cx,lines,lt,bb-a]);
   await p.screenshot({path:`${out}/${String(f++).padStart(5,'0')}.jpg`,type:'jpeg',quality:92,clip:{x:cx-303.75,y:0,width:607.5,height:1080}});}}
 // end card
 for(let i=0;i<Math.round(END*30);i++){const lt=i/30;
  await p.evaluate(lt=>{document.getElementById('w').innerHTML='<rect width="1920" height="1080" fill="#000"/>';document.getElementById('fade').style.opacity=0;document.getElementById('vhs').innerHTML='';document.getElementById('flash').style.opacity=0;
   const op=Math.min(1,lt/.3);
   document.getElementById('ov').innerHTML=`<g opacity="${op}"><text x="960" y="470" text-anchor="middle" font-family="Caladea" font-style="italic" font-weight="700" font-size="56" fill="#fff">Watch the full film</text><text x="960" y="560" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="58" fill="#f7d046">↓ TAP BELOW ↓</text></g>`;},lt);
  await p.screenshot({path:`${out}/${String(f++).padStart(5,'0')}.jpg`,type:'jpeg',quality:92,clip:{x:656.25,y:0,width:607.5,height:1080}});}
 console.log(f,'frames');await b.close();})();
