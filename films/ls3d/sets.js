import {THREE,M,box,cyl,sph,at,grp,canvasTex,redraw,Steam,hash,D,lerp,clamp,glowTex} from './engine.js';

/* ---------- shared props ---------- */
export function mug(band=null){ const g=new THREE.Group();
  const body=cyl(.042,.038,.095,0xe9e0cf,{r:.5}); body.position.y=.0475; g.add(body);
  const tea=cyl(.037,.037,.004,0x4a2410,{r:.3}); tea.position.y=.088; g.add(tea);
  const h=new THREE.Mesh(new THREE.TorusGeometry(.026,.007,8,16),M(0xe9e0cf,{r:.5})); h.position.set(.048,.05,0); h.castShadow=true; g.add(h);
  if(band){ const b=cyl(.0425,.0425,.012,band,{r:.6}); b.position.y=.055; g.add(b);}
  g.userData.tea=tea; return g;}
export function photoTex(){ return canvasTex(160,200,(x,w,h)=>{x.fillStyle='#cbb99c';x.fillRect(0,0,w,h);x.fillStyle='#e6d6b8';x.fillRect(0,130,w,70);
  x.fillStyle='#1f1a17'; x.beginPath();x.arc(58,62,22,0,7);x.fill(); x.fillRect(40,82,36,78); x.fillStyle='#9a948a'; x.beginPath();x.arc(58,40,10,0,7);x.fill();
  x.fillStyle='#1f1a17'; x.beginPath();x.arc(108,100,16,0,7);x.fill(); x.fillRect(95,114,26,46);});}
function clockTex(){ return canvasTex(256,256,()=>{});}
export function drawClock(x,w,h,hr){ x.fillStyle='#dcd2bf'; x.beginPath(); x.arc(128,128,120,0,7); x.fill(); x.strokeStyle='#3a312b';
  for(let i=0;i<60;i++){const a=i/60*Math.PI*2, r1=i%5?108:100; x.lineWidth=i%5?2:5; x.beginPath(); x.moveTo(128+Math.sin(a)*r1,128-Math.cos(a)*r1); x.lineTo(128+Math.sin(a)*114,128-Math.cos(a)*114); x.stroke();}
  const hh=(hr%12)/12*Math.PI*2, mm=(hr%1)*Math.PI*2, ss=((hr*3600)%60)/60*Math.PI*2; x.lineCap='round';
  x.strokeStyle='#1d1815'; x.lineWidth=9; x.beginPath(); x.moveTo(128,128); x.lineTo(128+Math.sin(hh)*60,128-Math.cos(hh)*60); x.stroke();
  x.lineWidth=6; x.beginPath(); x.moveTo(128,128); x.lineTo(128+Math.sin(mm)*92,128-Math.cos(mm)*92); x.stroke();
  x.strokeStyle='#a3473b'; x.lineWidth=2.5; x.beginPath(); x.moveTo(128,128); x.lineTo(128+Math.sin(ss)*100,128-Math.cos(ss)*100); x.stroke(); x.fillStyle='#1d1815'; x.beginPath(); x.arc(128,128,7,0,7); x.fill();}
export function drawCal(x,w,h,date,month){ x.fillStyle='#e2d9c9'; x.fillRect(0,0,w,h); x.fillStyle='#a3473b'; x.fillRect(0,0,w,58); x.fillStyle='#f3e9dc'; x.font='700 28px Inter, sans-serif'; x.textAlign='center'; x.fillText('SUNDAY',w/2,40);
  x.fillStyle='#2e2622'; x.font='600 150px "EB Garamond", serif'; x.fillText(String(date),w/2,200); x.fillStyle='#6a5d50'; x.font='600 22px Inter, sans-serif'; x.fillText(month,w/2,250);}
/* outside view through window */
export const SEAS={autumn:{s1:'#5d6884',s2:'#d8a57c',g:'#4a4540',leaf:'#c8743a',fall:'leaf'},late:{s1:'#4f5970',s2:'#a1907f',g:'#454240',leaf:'#8d5a35',fall:'leaf',sparse:1},
  winter:{s1:'#5e6a82',s2:'#b4bcc8',g:'#d6dbe3',leaf:null,fall:'snow'},night:{s1:'#0d1324',s2:'#2a3352',g:'#7f889a',leaf:null,fall:'snow'},spring:{s1:'#7ea6d0',s2:'#f0dfbd',g:'#6c8c52',leaf:'#7fa85c',fall:null}};
export function drawOutside(x,w,h,season,t){ const S=SEAS[season]; const g=x.createLinearGradient(0,0,0,h); g.addColorStop(0,S.s1); g.addColorStop(1,S.s2); x.fillStyle=g; x.fillRect(0,0,w,h);
  x.fillStyle=season=='night'?'#141a2a':'#3d3a42'; x.beginPath(); x.moveTo(w*.6,h*.72); x.lineTo(w*.6,h*.45); x.lineTo(w*.78,h*.3); x.lineTo(w*.96,h*.45); x.lineTo(w*.96,h*.72); x.fill();
  x.fillStyle=(season=='night'||season=='winter')?'#f2c27a':'#5d5d68'; x.fillRect(w*.7,h*.5,w*.07,h*.08);
  x.fillStyle=S.g; x.beginPath(); x.moveTo(0,h*.72); x.quadraticCurveTo(w*.3,h*.6,w*.55,h*.7); x.quadraticCurveTo(w*.8,h*.76,w,h*.66); x.lineTo(w,h); x.lineTo(0,h); x.fill();
  const tx=w*.28, ty=h*.74; x.strokeStyle='#1e1b1c'; x.lineCap='round'; x.lineWidth=12; x.beginPath(); x.moveTo(tx-8,ty); x.lineTo(tx-4,ty-h*.5); x.moveTo(tx-5,ty-h*.3); x.lineTo(tx-60,ty-h*.52); x.moveTo(tx-4,ty-h*.38); x.lineTo(tx+56,ty-h*.58); x.stroke();
  if(S.leaf){ const N=S.sparse?18:60; for(let i=0;i<N;i++){const a=hash(i)*6.28, r=hash(i+40)*h*.2; x.fillStyle=S.leaf; x.globalAlpha=.75+hash(i+5)*.25; x.beginPath(); x.arc(tx+Math.cos(a)*r*1.3,ty-h*.52+Math.sin(a)*r*.8,12+hash(i+80)*16,0,7); x.fill();} x.globalAlpha=1;}
  if(season=='winter'||season=='night'){ x.strokeStyle='#e8edf3'; x.lineWidth=6; x.beginPath(); x.moveTo(tx-60,ty-h*.52-5); x.lineTo(tx-5,ty-h*.31-5); x.moveTo(tx+56,ty-h*.58-5); x.lineTo(tx-4,ty-h*.39-5); x.stroke();}
  if(S.fall){ const N=S.fall=='snow'?90:9; for(let i=0;i<N;i++){ const sp=S.fall=='snow'?(30+hash(i)*30):(50+hash(i)*25), py=((t*sp+hash(i+3)*h*2)%(h+40))-20, px=hash(i+9)*w+Math.sin(t*1.3+i)*16;
    x.fillStyle=S.fall=='snow'?'rgba(255,255,255,.9)':S.leaf; x.beginPath(); if(S.fall=='snow') x.arc(px,py,1.8+hash(i+2)*2.6,0,7); else x.ellipse(px,py,8,4,t*2+i,0,7); x.fill();}}}

/* ---------- KITCHEN (grandma) ---------- */
export function buildKitchen(scene){
  const K={}; const root=new THREE.Group(); scene.add(root); K.root=root;
  const wallC=0x8a7666, wainC=0x5e4a3d, floorC=0x5a4334;
  /* floor planks */
  const fl=box(8,.04,6,floorC,{r:.85}); fl.position.set(0,-.02,0); root.add(fl);
  for(let i=0;i<20;i++){ const p=box(.008,.002,6,0x46342a,{cast:false}); p.position.set(-4+i*.4,.001,0); root.add(p);}
  const rug=cyl(1.25,1.25,.01,0x6b3b33,{r:1,seg:48}); rug.scale.z=.7; rug.position.set(.3,.006,-.5); root.add(rug);
  const rug2=cyl(1.1,1.1,.012,0x7c4a3f,{r:1,seg:48}); rug2.scale.z=.7; rug2.position.set(.3,.007,-.5); root.add(rug2);
  /* back wall with window opening x[-1.55,-.35] y[1.0,2.15] */
  const BZ=-2.2, wz=BZ-.05;
  const wl=(x0,x1,y0,y1)=>{const b=box(x1-x0,y1-y0,.1,wallC,{r:.95}); b.position.set((x0+x1)/2,(y0+y1)/2,wz); root.add(b);};
  wl(-4,-1.55,0,2.8); wl(-.35,4,0,2.8); wl(-1.55,-.35,0,1.0); wl(-1.55,-.35,2.15,2.8);
  const wain=box(8,.95,.02,wainC,{r:.9}); wain.position.set(0,.475,BZ); root.add(wain);
  const rail=box(8,.05,.05,0x6e5545); rail.position.set(0,.96,BZ+.01); root.add(rail);
  /* left wall */
  const lw=box(.1,2.8,6,0x7d6a5c,{r:.95}); lw.position.set(-3.05,1.4,0); root.add(lw);
  /* ceiling */
  const ce=box(8,.05,6,0x3a302a,{cast:false}); ce.position.set(0,2.82,0); root.add(ce);
  /* window frame */
  const fr=M(0x4a3a30); const fw=(w,h,x,y)=>{const b=box(w,h,.08,0,{mat:fr}); b.position.set(x,y,BZ+.0); root.add(b);};
  fw(1.3,.07,-.95,2.15); fw(1.3,.08,-.95,1.0); fw(.07,1.2,-1.55,1.575); fw(.07,1.2,-.35,1.575); fw(.04,1.15,-.95,1.575); fw(1.2,.04,-.95,1.6);
  const sill=box(1.45,.04,.22,0x5a4636); sill.position.set(-.95,.98,BZ+.1); root.add(sill);
  K.outTex=canvasTex(512,512,(x,w,h)=>drawOutside(x,w,h,'autumn',0));
  const out=new THREE.Mesh(new THREE.PlaneGeometry(1.25,1.2),new THREE.MeshBasicMaterial({map:K.outTex})); out.position.set(-.95,1.575,BZ-.12); root.add(out);
  /* curtains */
  const cu=M(0x7a4a3c,{r:1,side:THREE.DoubleSide}); for(const cx of [-1.72,-.18]){ const c=new THREE.Mesh(new THREE.CylinderGeometry(.14,.18,1.6,12,1,true,0,Math.PI),cu); c.position.set(cx,1.45,BZ+.12); c.rotation.y=Math.PI; c.castShadow=true; root.add(c);}
  const rod=cyl(.012,.012,1.9,0x2a2420); rod.rotation.z=Math.PI/2; rod.position.set(-.95,2.28,BZ+.12); root.add(rod);
  /* plant on sill */
  const pot=cyl(.07,.05,.11,0x6b5444); pot.position.set(-.55,1.06,BZ+.1); root.add(pot);
  for(let i=0;i<6;i++){ const l=new THREE.Mesh(new THREE.SphereGeometry(.05,8,6),M(0x4f6a42)); l.scale.set(.6,1.6,.4); l.position.set(-.55+Math.sin(i*1.2)*.05,1.2+hash(i)*.06,BZ+.1+Math.cos(i*1.2)*.03); l.rotation.z=Math.sin(i*1.2)*.6; l.castShadow=true; root.add(l);}
  /* counter + cabinets (left) */
  const cab=M(0x6e5646,{r:.8}), cabD=M(0x7a6050,{r:.8});
  const base=box(.65,.88,3.0,0,{mat:cab}); base.position.set(-2.68,.44,-.7); root.add(base);
  for(let i=0;i<4;i++){ const d=box(.02,.74,.68,0,{mat:cabD}); d.position.set(-2.345,.45,-2.0+i*.74); root.add(d); const hd=box(.02,.12,.02,0xb0946f); hd.position.set(-2.33,.7,-1.72+i*.74); root.add(hd);}
  const top=box(.72,.05,3.06,0x8c7a6a,{r:.5}); top.position.set(-2.66,.905,-.7); root.add(top);
  K.uppers=[]; for(let i=0;i<4;i++){ const u=new THREE.Group(); u.position.set(-2.72,1.95,-2.0+i*.74); if(i==3){ const pn=(w,h,d,x,y,z)=>{const b=box(w,h,d,0,{mat:cab}); b.position.set(x,y,z); u.add(b);}; pn(.04,.75,.7,-.23,0,0); pn(.5,.04,.7,0,.355,0); pn(.5,.04,.7,0,-.355,0); pn(.5,.75,.03,0,0,-.335); pn(.5,.75,.03,0,0,.335); const sf=box(.46,.02,.64,0x4e3d33); sf.position.y=0; u.add(sf);} else { const ub=box(.5,.75,.7,0,{mat:cab}); u.add(ub);} const dg=new THREE.Group(); dg.position.set(.255,0,-.35); u.add(dg); const ud=box(.02,.7,.68,0,{mat:cabD}); ud.position.set(0,0,.35); dg.add(ud); const hd=box(.02,.1,.02,0xb0946f); hd.position.set(.012,-.25,.62); dg.add(hd); u.userData.door=dg; root.add(u); K.uppers.push(u);}
  /* mugs inside cabinet 3 (z ~ .22) */
  const inner=new THREE.Group(); inner.position.set(-2.72,1.595,.22); const shelf=box(.46,.02,.66,0x4e3d33); shelf.position.y=0; inner.add(shelf);
  K.cabL=new THREE.PointLight(0xffd9a8,0,1.2,2); K.cabL.position.set(-2.55,1.85,.25); root.add(K.cabL);
  K.cabMugs=[]; [[-.05,-.2,null],[.05,-.05,null],[.0,.15,0x6f9fd6],[-.08,.25,null]].forEach(([dx,dz,b])=>{const m=mug(b); m.position.set(dx,.01,dz); m.rotation.y=-Math.PI/2; inner.add(m); K.cabMugs.push(m);}); root.add(inner);
  /* stove + kettle */
  const grate=new THREE.Mesh(new THREE.TorusGeometry(.09,.012,6,24),M(0x1c1a1a)); grate.rotation.x=Math.PI/2; grate.position.set(-2.62,.94,-1.35); root.add(grate);
  const kettle=new THREE.Group(); const kb=sph(.12,0x2b2b30,{r:.35}); kb.scale.set(1,.85,1); kb.position.y=.1; kettle.add(kb); const kl=cyl(.04,.05,.04,0x2b2b30); kl.position.y=.2; kettle.add(kl);
  const sp=cyl(.012,.025,.16,0x2b2b30); sp.rotation.z=-.9; sp.position.set(.15,.15,0); kettle.add(sp); const hdl=new THREE.Mesh(new THREE.TorusGeometry(.08,.012,8,20,Math.PI),M(0x1c1c20)); hdl.position.y=.2; hdl.rotation.y=Math.PI/2; kettle.add(hdl);
  kettle.position.set(-2.62,.95,-1.35); kettle.rotation.y=Math.PI/2; root.add(kettle); K.kettle=kettle;
  K.kSteam=new Steam(22,.8); K.kSteam.g.position.set(-2.62,1.14,-1.2); root.add(K.kSteam.g);
  K.flame=new THREE.Group(); for(let i=0;i<10;i++){ const f=new THREE.Mesh(new THREE.ConeGeometry(.012,.04,6),new THREE.MeshBasicMaterial({color:0x5fa0ff})); const a=i/10*Math.PI*2; f.position.set(Math.cos(a)*.07,.0,Math.sin(a)*.07); K.flame.add(f);} K.flame.position.set(-2.62,.955,-1.35); K.flame.visible=false; root.add(K.flame);
  K.flameL=new THREE.PointLight(0x6aa8ff,0,1.2,2); K.flameL.position.set(-2.55,1.0,-1.35); root.add(K.flameL);
  const knob=cyl(.025,.025,.03,0x2a2522); knob.rotation.z=Math.PI/2; knob.position.set(-2.32,.82,-1.35); root.add(knob); K.knob=knob;
  const jar1=cyl(.06,.06,.16,0x8a7a68); jar1.position.set(-2.62,1.01,-.5); root.add(jar1); const jar2=cyl(.05,.05,.12,0x9a6a40); jar2.position.set(-2.62,.99,-.3); root.add(jar2);
  /* table */
  const T={x:.3,z:-.6}; K.T=T; const tg=new THREE.Group(); tg.position.set(T.x,0,T.z); root.add(tg);
  const ttop=cyl(.62,.62,.04,0x6b5040); ttop.position.y=.74; tg.add(ttop);
  const cloth=cyl(.66,.72,.24,0xd8ccb4,{r:1,open:true,side:THREE.DoubleSide,em:0x5a4f40,ei:1}); cloth.position.y=.64; tg.add(cloth);
  const clothT=cyl(.665,.665,.012,0xcdbfa6,{r:1}); clothT.position.y=.765; tg.add(clothT);
  const leg=cyl(.05,.07,.72,0x4e3a2f); leg.position.y=.36; tg.add(leg); const foot=cyl(.28,.32,.04,0x4e3a2f); foot.position.y=.02; tg.add(foot);
  K.tableY=.771;
  K.ring=new THREE.Mesh(new THREE.RingGeometry(.034,.042,32),new THREE.MeshBasicMaterial({color:0x8c6a48,transparent:true,opacity:0})); K.ring.rotation.x=-Math.PI/2; K.ring.position.set(T.x+.22,K.tableY+.001,T.z+.05); root.add(K.ring);
  /* chairs */
  const chair=(x,z,ry)=>{const g=new THREE.Group(); const cm=M(0x5a4335,{r:.8}); const seat=box(.44,.05,.44,0,{mat:cm}); seat.position.y=.46; g.add(seat);
    for(const [lx,lz] of [[-.19,-.19],[.19,-.19],[-.19,.19],[.19,.19]]){ const l=box(.04,.46,.04,0,{mat:cm}); l.position.set(lx,.23,lz); g.add(l);}
    const bk=box(.44,.5,.04,0,{mat:cm}); bk.position.set(0,.98,-.2); g.add(bk); for(const lx of [-.2,.2]){const p=box(.04,.55,.04,0,{mat:cm}); p.position.set(lx,.73,-.2); g.add(p);}
    g.position.set(x,0,z); g.rotation.y=ry; root.add(g); return g;};
  K.chairG=chair(T.x-.78,T.z,Math.PI/2); K.chairB=chair(T.x+.78,T.z,-Math.PI/2);
  /* cups on table */
  K.cupG=mug(); K.cupG.position.set(T.x-.25,K.tableY,T.z+.05); root.add(K.cupG);
  K.cupB=mug(0x6f9fd6); K.cupB.position.set(T.x+.22,K.tableY,T.z+.05); K.cupB.rotation.y=Math.PI; root.add(K.cupB);
  K.stG=new Steam(24,1); K.stG.g.position.set(T.x-.25,K.tableY+.1,T.z+.05); root.add(K.stG.g);
  K.stB=new Steam(24,1); K.stB.g.position.set(T.x+.22,K.tableY+.1,T.z+.05); root.add(K.stB.g);
  /* pendant lamp */
  const cord=cyl(.006,.006,.9,0x111111,{cast:false}); cord.position.set(T.x,2.37,T.z); root.add(cord);
  const shade=new THREE.Mesh(new THREE.ConeGeometry(.24,.18,32,1,true),M(0x2f2722,{side:THREE.DoubleSide})); shade.position.set(T.x,1.85,T.z); shade.castShadow=false; root.add(shade);
  K.bulb=sph(.055,0xffe2b3,{basic:1,cast:false}); K.bulb.position.set(T.x,1.78,T.z); root.add(K.bulb);
  const lampGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xffcf91,transparent:true,opacity:.35,depthWrite:false})); lampGlow.scale.set(1.2,1.2,1); lampGlow.position.set(T.x,1.76,T.z); root.add(lampGlow); K.lampGlow=lampGlow;
  K.lampSpot=new THREE.SpotLight(0xffc98a,15,6,Math.PI/3.2,.55,1.6); K.lampSpot.position.set(T.x,1.78,T.z); K.lampSpot.target.position.set(T.x,0,T.z); K.lampSpot.castShadow=true; K.lampSpot.shadow.mapSize.set(1024,1024); K.lampSpot.shadow.radius=6; K.lampSpot.shadow.bias=-.0008; root.add(K.lampSpot,K.lampSpot.target);
  K.lampFill=new THREE.PointLight(0xffb878,4,7,1.6); K.lampFill.position.set(T.x,1.6,T.z+.2); root.add(K.lampFill);
  /* window light */
  K.sun=new THREE.DirectionalLight(0xffc89a,1.4); K.sun.position.set(-1.6,3.6,-6); K.sun.target.position.set(.2,0,.4); K.sun.castShadow=true; K.sun.shadow.mapSize.set(1024,1024); K.sun.shadow.camera.left=-4;K.sun.shadow.camera.right=4;K.sun.shadow.camera.top=4;K.sun.shadow.camera.bottom=-4; K.sun.shadow.radius=4; K.sun.shadow.bias=-.0006; root.add(K.sun,K.sun.target);
  K.hemi=new THREE.HemisphereLight(0x9aa3b8,0x3a2a22,.55); root.add(K.hemi);
  /* wall clock, calendar, photo */
  K.clockTex=canvasTex(256,256,(x,w,h)=>drawClock(x,w,h,3.97));
  const cf=cyl(.2,.2,.05,0x2e2622); cf.rotation.x=Math.PI/2; cf.position.set(1.35,2.0,BZ+.03); root.add(cf);
  const cface=new THREE.Mesh(new THREE.CircleGeometry(.17,48),new THREE.MeshStandardMaterial({map:K.clockTex,roughness:.6})); cface.position.set(1.35,2.0,BZ+.058); root.add(cface); K.clockFace=cface;
  K.calTex=canvasTex(256,320,(x,w,h)=>drawCal(x,w,h,12,'NOVEMBER'));
  const cb=box(.27,.34,.02,0xcfc5b3); cb.position.set(1.35,1.45,BZ+.02); root.add(cb);
  K.calPage=new THREE.Mesh(new THREE.PlaneGeometry(.25,.31),new THREE.MeshStandardMaterial({map:K.calTex,roughness:.9,side:THREE.DoubleSide})); K.calPage.position.set(1.35,1.45,BZ+.033); root.add(K.calPage);
  K.calTex2=canvasTex(256,320,(x,w,h)=>drawCal(x,w,h,12,'NOVEMBER'));
  K.calFlip=new THREE.Group(); K.calFlip.position.set(1.35,1.605,BZ+.04); const fp=new THREE.Mesh(new THREE.PlaneGeometry(.25,.31),new THREE.MeshStandardMaterial({map:K.calTex2,roughness:.9})); fp.position.y=-.155; K.calFlip.add(fp); const fb=new THREE.Mesh(new THREE.PlaneGeometry(.25,.31),new THREE.MeshStandardMaterial({color:0xe8e0d0,roughness:.9,transparent:true})); fb.rotation.y=Math.PI; fb.position.y=-.155; K.calFlip.add(fb); K.calFlip.visible=false; root.add(K.calFlip);
  const pf=box(.26,.32,.025,0x5a463a); pf.position.set(1.78,1.45,BZ+.02); root.add(pf);
  const ph=new THREE.Mesh(new THREE.PlaneGeometry(.2,.25),new THREE.MeshStandardMaterial({map:photoTex(),roughness:.8})); ph.position.set(1.78,1.45,BZ+.034); root.add(ph);
  /* door (right part of back wall) */
  const dfr=box(.98,2.1,.08,0x3e3029); dfr.position.set(2.45,1.05,BZ+.0); root.add(dfr);
  K.doorOut=new THREE.Mesh(new THREE.PlaneGeometry(.86,2.0),new THREE.MeshBasicMaterial({color:0x1d2840})); K.doorOut.position.set(2.45,1.0,BZ+.045); root.add(K.doorOut);
  K.door=new THREE.Group(); K.door.position.set(2.02,0,BZ+.06); const dp=box(.86,2.0,.05,0x6a5244,{r:.7}); dp.position.set(.43,1.0,0); K.door.add(dp);
  for(const yy of [.55,1.45]){const pn=box(.62,.66,.02,0x5e4739); pn.position.set(.43,yy,.03); K.door.add(pn);} const kn=sph(.035,0xc9a86a,{r:.3}); kn.position.set(.78,1.0,.06); K.door.add(kn); root.add(K.door);
  K.doorLight=new THREE.PointLight(0x7f9fd8,0,4,2); K.doorLight.position.set(2.45,1.4,BZ-.3); root.add(K.doorLight);
  /* shelf with jars near door */
  const sh=box(.7,.03,.2,0x5a4636); sh.position.set(.3,1.95,BZ+.1); root.add(sh); for(let i=0;i<3;i++){const j=cyl(.05,.05,.12+i*.03,[0x8a7a68,0xb08a5e,0x6e7a6a][i]); j.position.set(.1+i*.2,2.03+i*.015,BZ+.1); root.add(j);}
  /* setters */
  K.state={season:'autumn',clock:3.97,date:12,month:'NOVEMBER'};
  K.set=(o,t)=>{ if(o.season&&(o.season!==K.state.season||true)){ redraw(K.outTex,(x,w,h)=>drawOutside(x,w,h,o.season,t)); K.state.season=o.season; }
    if(o.clock!=null){ redraw(K.clockTex,(x,w,h)=>drawClock(x,w,h,o.clock)); }
    if(o.date!=null&&(o.date!==K.state.date||o.month!==K.state.month)){ redraw(K.calTex,(x,w,h)=>drawCal(x,w,h,o.date,o.month||'NOVEMBER')); K.state.date=o.date; K.state.month=o.month; }
    const lamp=o.lamp??1; K.lampSpot.intensity=15*lamp; K.lampFill.intensity=4*lamp; K.bulb.material.color.setHex(lamp>.05?0xffe2b3:0x555555); K.lampGlow.material.opacity=.35*lamp;
    const day={autumn:[0xffc89a,1.5,.55],late:[0xd8b8a0,1.0,.45],winter:[0xc9d6ee,1.1,.5],night:[0x6f88c0,.45,.28],spring:[0xfff0d0,2.2,.7]}[o.season||K.state.season];
    K.sun.color.setHex(day[0]); K.sun.intensity=day[1]; K.hemi.intensity=day[2];
    K.door.rotation.y=-(o.door||0)*1.6; K.doorLight.intensity=(o.door||0)*3;
    K.uppers[3].userData.door.rotation.y=(o.cab||0)*1.7; K.cabL.intensity=(o.cab||0)*1.5; K.cabMugs[2].visible=!o.cabTaken;
    K.flame.visible=(o.flame||0)>.02; K.flame.children.forEach((f,i)=>f.scale.y=(o.flame||0)*(1+.3*Math.sin(t*25+i))); K.flameL.intensity=(o.flame||0)*.5;
    K.knob.rotation.x=(o.knob||0)*Math.PI/2;
    K.kSteam.update(t,o.kSteam??.4);
    K.cupG.visible=o.cupG!==false; K.cupB.visible=!!o.cupB; K.stG.update(t,o.cupG===false?0:(o.kG??1)); K.stB.update(t,o.cupB?(o.kB??1):0); K.stG.g.visible=o.cupG!==false; K.stB.g.visible=!!o.cupB;
    K.ring.material.opacity=o.ring||0;
  };
  return K;}

/* ---------- arm/hand insert for close-ups ---------- */
import {silMat} from './engine.js';
export function armInsert(rim=0xa9c4ff){ const mat=silMat(rim,.9); const g=new THREE.Group(); const inner=new THREE.Group(); g.add(inner);
  const capM=(r,l)=>{const m=new THREE.Mesh(new THREE.CapsuleGeometry(r,l,6,12),mat); m.castShadow=true; return m;};
  const fa=capM(.038,.5); fa.rotation.z=Math.PI/2; fa.position.x=-.27; inner.add(fa);
  const palm=new THREE.Mesh(new THREE.SphereGeometry(.05,18,12),mat); palm.scale.set(1.1,.45,.95); palm.position.x=.045; palm.castShadow=true; inner.add(palm);
  const fingers=[]; for(let i=0;i<4;i++){ const fg=new THREE.Group(); fg.position.set(.095,0,(i-1.5)*.022); const p1=capM(.011,.035); p1.rotation.z=Math.PI/2; p1.position.x=.02; fg.add(p1);
    const j=new THREE.Group(); j.position.x=.045; fg.add(j); const p2=capM(.01,.028); p2.rotation.z=Math.PI/2; p2.position.x=.016; j.add(p2); fg.userData.j=j; inner.add(fg); fingers.push(fg);}
  const th=new THREE.Group(); th.position.set(.04,0,.045); const tp=capM(.012,.04); tp.rotation.z=Math.PI/2; tp.position.x=.025; th.add(tp); th.rotation.y=-.7; inner.add(th);
  const api={g,set(pos,yaw,pitch=0,curl=.5,roll=0){ g.position.copy(pos); g.rotation.set(0,yaw*D,0); inner.rotation.set(roll*D,0,pitch*D);
    fingers.forEach((f,i)=>{ f.rotation.z=-curl*1.1; f.userData.j.rotation.z=-curl*1.3;}); th.rotation.z=-curl*.6; }};
  return api;}

/* ---------- BOY ROOM ---------- */
export function drawCity(x,w,h,eve,t){ const g=x.createLinearGradient(0,0,0,h); g.addColorStop(0,eve?'#10172a':'#7d8798'); g.addColorStop(1,eve?'#2a3350':'#bcc1ca'); x.fillStyle=g; x.fillRect(0,0,w,h);
  for(let i=0;i<9;i++){ const bx=i*w/8-20, bh=h*(.25+hash(i+20)*.45); x.fillStyle=eve?'#0b1020':'#5d6676'; x.fillRect(bx,h-bh,w/8-6,bh);
    if(eve) for(let j=0;j<8;j++) if(hash(i*7+j)>.5){x.fillStyle='#f0c57c'; x.fillRect(bx+10+(j%2)*26,h-bh+16+j*26,12,14);} }
  if(eve) for(let i=0;i<70;i++){ const py=((t*40+hash(i+3)*h*2)%(h+20))-10; x.fillStyle='rgba(255,255,255,.75)'; x.beginPath(); x.arc(hash(i+7)*w+Math.sin(t+i)*8,py,1.5+hash(i)*2,0,7); x.fill();}}
export function drawTV(x,w,h,t,paused){ x.fillStyle='#0e1a33'; x.fillRect(0,0,w,h);
  if(!paused){ for(let i=0;i<7;i++){ const gx=((t*140*(1+i*.3)+i*120)%(w+120))-60, gy=40+hash(i)*(h-120); x.fillStyle=['#3f6fd8','#e05a4a','#47b8a8','#f2c14e'][i%4]; x.globalAlpha=.8; x.fillRect(gx,gy,30+hash(i+3)*60,16+hash(i+5)*30);} x.globalAlpha=1;
    x.fillStyle='#1b2a52'; x.fillRect(0,h-50,w,50); x.fillStyle='#fff'; x.beginPath(); x.arc(w*.35+Math.sin(t*3)*60,h-80-Math.abs(Math.sin(t*5))*60,16,0,7); x.fill(); }
  else { x.fillStyle='rgba(0,0,0,.5)'; x.fillRect(0,0,w,h); x.fillStyle='#e8ecf5'; x.font='800 40px Inter, sans-serif'; x.textAlign='center'; x.fillText('PAUSED',w/2,h/2+14);} }
export function buildRoom(scene){ const R={}; const root=new THREE.Group(); scene.add(root);
  const fl=box(8,.04,6,0x2b3040,{r:.8}); fl.position.y=-.02; root.add(fl);
  const rug=box(2.6,.012,1.8,0x3a4256,{r:1}); rug.position.set(.4,.006,.1); root.add(rug);
  const BZ=-2.0, wallC=0x4a5268; const wl=(x0,x1,y0,y1)=>{const b=box(x1-x0,y1-y0,.1,wallC,{r:.95}); b.position.set((x0+x1)/2,(y0+y1)/2,BZ-.05); root.add(b);};
  wl(-4,-2.2,0,2.8); wl(-.6,4,0,2.8); wl(-2.2,-.6,0,.9); wl(-2.2,-.6,2.2,2.8);
  const lw=box(.1,2.8,6,0x434a5e); lw.position.set(-3.05,1.4,0); root.add(lw);
  const rw=box(.1,2.8,6,0x434a5e); rw.position.set(3.05,1.4,0); root.add(rw);
  const fr=M(0x2a3040); for(const [w,h,x,y] of [[1.7,.07,-1.4,2.2],[1.7,.07,-1.4,.9],[.07,1.35,-2.2,1.55],[.07,1.35,-.6,1.55],[.04,1.3,-1.4,1.55]]){const b=box(w,h,.08,0,{mat:fr}); b.position.set(x,y,BZ); root.add(b);}
  R.cityTex=canvasTex(512,420,(x,w,h)=>drawCity(x,w,h,0,0)); const city=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.3),new THREE.MeshBasicMaterial({map:R.cityTex})); city.position.set(-1.4,1.55,BZ-.15); root.add(city);
  /* poster, shelf */
  const po=box(.5,.7,.02,0x3b4763); po.position.set(.4,1.65,BZ+.01); root.add(po); const pc=new THREE.Mesh(new THREE.CircleGeometry(.12,32),M(0xc45a3c)); pc.position.set(.4,1.75,BZ+.025); root.add(pc);
  const sh=box(.9,.03,.22,0x2a3144); sh.position.set(1.5,1.5,BZ+.1); root.add(sh); for(let i=0;i<4;i++){const bk=box(.06,.2+hash(i)*.08,.16,[0x3a4560,0x58627c,0x6b4f4f,0x46566e][i]); bk.position.set(1.15+i*.09,1.62,BZ+.1); root.add(bk);}
  /* couch facing +x */
  const cm=M(0x39415a,{r:.95}), cm2=M(0x434c68,{r:.95}); const couch=new THREE.Group(); couch.position.set(-.5,0,.0);
  const base=box(.9,.32,2.0,0,{mat:cm}); base.position.set(0,.22,0); couch.add(base); const cush=box(.8,.12,1.9,0,{mat:cm2}); cush.position.set(.05,.44,0); couch.add(cush);
  const back=box(.22,.62,2.0,0,{mat:cm}); back.position.set(-.38,.6,0); couch.add(back); for(const z of [-1.0,1.0]){const a=box(.9,.5,.18,0,{mat:cm}); a.position.set(0,.36,z); couch.add(a);}
  root.add(couch); R.couch=couch; R.seat={x:-.47,y:.5};
  R.phone=box(.07,.01,.14,0x111318); R.phone.position.set(-.35,.505,.45); root.add(R.phone);
  R.phoneGlow=new THREE.Mesh(new THREE.PlaneGeometry(.062,.13),new THREE.MeshBasicMaterial({color:0xcfe4ff})); R.phoneGlow.rotation.x=-Math.PI/2; R.phoneGlow.position.set(-.35,.511,.45); root.add(R.phoneGlow);
  R.phoneL=new THREE.PointLight(0xcfe4ff,0,1.5,2); root.add(R.phoneL);
  R.held=new THREE.Group(); const hp=box(.075,.15,.01,0x111318); R.held.add(hp); const hs=new THREE.Mesh(new THREE.PlaneGeometry(.066,.138),new THREE.MeshBasicMaterial({color:0xcfe4ff})); hs.position.z=.006; R.held.add(hs); root.add(R.held); R.held.visible=false;
  R.ctrl=new THREE.Group(); const cb=box(.14,.035,.07,0x2a2e38); R.ctrl.add(cb); root.add(R.ctrl);
  /* TV on right */
  const stand=box(.5,.5,1.6,0x1f2433); stand.position.set(2.55,.25,0); root.add(stand);
  const tvb=box(.06,.8,1.4,0x0a0c12); tvb.position.set(2.55,1.05,0); root.add(tvb);
  R.tvTex=canvasTex(512,290,(x,w,h)=>drawTV(x,w,h,0,0)); const tvs=new THREE.Mesh(new THREE.PlaneGeometry(1.3,.72),new THREE.MeshBasicMaterial({map:R.tvTex})); tvs.rotation.y=-Math.PI/2; tvs.position.set(2.515,1.05,0); root.add(tvs);
  R.tvL=new THREE.PointLight(0x9fc0ff,3,6,1.4); R.tvL.position.set(2.1,1.1,0); root.add(R.tvL);
  R.sun=new THREE.DirectionalLight(0xc8d2e6,1.0); R.sun.position.set(-2,3.5,-6); R.sun.target.position.set(0,0,0); R.sun.castShadow=true; R.sun.shadow.mapSize.set(1024,1024); R.sun.shadow.camera.left=-4;R.sun.shadow.camera.right=4;R.sun.shadow.camera.top=4;R.sun.shadow.camera.bottom=-4; R.sun.shadow.radius=4; root.add(R.sun,R.sun.target);
  R.hemi=new THREE.HemisphereLight(0x8a9ac0,0x20242e,.6); root.add(R.hemi);
  const ce=box(8,.05,6,0x252a38,{cast:false}); ce.position.y=2.82; root.add(ce);
  R.set=(o,t)=>{ const eve=o.eve||0; redraw(R.cityTex,(x,w,h)=>drawCity(x,w,h,eve,t)); redraw(R.tvTex,(x,w,h)=>drawTV(x,w,h,t,o.paused));
    R.sun.intensity=eve?.25:1.0; R.sun.color.setHex(eve?0x5d74b0:0xc8d2e6); R.hemi.intensity=eve?.32:.6; R.tvL.intensity=(eve?4:2.5)*(o.paused?.6:1)*(.85+.15*Math.sin(t*7));
    R.phone.visible=!!o.phoneOnCouch; R.phoneGlow.visible=!!o.phoneOnCouch&&!!o.phoneLit; R.phone.position.x=-.35+(o.buzz?Math.sin(t*90)*.003:0);
    R.phoneL.intensity=0; if(o.phoneOnCouch&&o.phoneLit){R.phoneL.position.set(-.35,.6,.45); R.phoneL.intensity=1.2;} };
  return R;}

/* ---------- STREET (night snow) ---------- */
export function buildStreet(scene){ const S={}; const root=new THREE.Group(); scene.add(root);
  scene.fog=new THREE.Fog(0x1a2238,8,30);
  const snow=box(80,.04,30,0xc9d0de,{r:1}); snow.position.set(10,-.02,0); root.add(snow);
  const walk=box(80,.03,1.8,0xaeb6c6,{r:1}); walk.position.set(10,.0,.6); root.add(walk);
  const road=box(80,.02,4,0x2c3242,{r:.8}); road.position.set(10,.0,3.6); root.add(road);
  for(let i=0;i<12;i++){ const hx=-6+i*4.2+hash(i)*.8, hw=3.2, hh=2.6+hash(i+3)*1.2, hz=-3.5-hash(i+7)*.8; const hc=[0x4a5470,0x56506a,0x46506a][i%3];
    const hb=box(hw,hh,3,hc,{r:1}); hb.position.set(hx,hh/2,hz); root.add(hb);
    const rf=new THREE.Mesh(new THREE.ConeGeometry(hw*.78,1.2,4),M(0x1b1f2c)); rf.rotation.y=Math.PI/4; rf.scale.z=.7; rf.position.set(hx,hh+.6,hz); root.add(rf);
    const rs=new THREE.Mesh(new THREE.ConeGeometry(hw*.8,.25,4),M(0xe8edf4)); rs.rotation.y=Math.PI/4; rs.scale.z=.7; rs.position.set(hx,hh+1.05,hz); root.add(rs);
    for(let j=0;j<2;j++) if(hash(i*5+j)>.25){ const wn=new THREE.Mesh(new THREE.PlaneGeometry(.6,.7),new THREE.MeshBasicMaterial({color:0xf2c27a})); wn.position.set(hx-.7+j*1.4,hh*.55,hz+1.51); root.add(wn);}
    const fence=box(hw,.5,.05,0x1b1f2c); fence.position.set(hx,.25,-1.0); root.add(fence);}
  S.lamps=[]; for(let i=0;i<8;i++){ const lx=-3+i*6; const pole=cyl(.04,.05,3.2,0x0d1018); pole.position.set(lx,1.6,-.4); root.add(pole); const arm=box(.6,.04,.04,0x0d1018); arm.position.set(lx+.28,3.18,-.4); root.add(arm);
    const bulb=sph(.09,0xffd9a0,{basic:1,cast:false}); bulb.position.set(lx+.55,3.08,-.4); root.add(bulb); const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xffcf91,transparent:true,opacity:.55,depthWrite:false})); gl.scale.set(1.6,1.6,1); gl.position.copy(bulb.position); root.add(gl);
    S.lamps.push(lx+.55);}
  S.spots=[0,1,2].map(()=>{ const sp=new THREE.SpotLight(0xffc98a,30,9,Math.PI/4,.6,1.5); sp.castShadow=true; sp.shadow.mapSize.set(512,512); sp.shadow.radius=4; root.add(sp,sp.target); return sp;});
  S.moon=new THREE.DirectionalLight(0x8aa0d0,1.0); S.moon.position.set(-4,8,10); root.add(S.moon); S.hemi=new THREE.HemisphereLight(0x5068a0,0x30384c,.5); root.add(S.hemi);
  /* snow particles */
  const N=1400, pos=new Float32Array(N*3); const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  S.snow=new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:.035,transparent:true,opacity:.85,depthWrite:false})); root.add(S.snow);
  S.set=(o,t,cx)=>{ S.spots.forEach((sp,i)=>{ const base=Math.round((cx-6)/6)*6-3+.55; const lx=base+i*6; sp.position.set(lx,3.05,-.4); sp.target.position.set(lx+.3,0,.6);});
    for(let i=0;i<N;i++){ const x=cx-9+hash(i)*20, sp=.5+hash(i+1)*.6, y=4-((t*sp+hash(i+2)*4)%4.2), z=-2+hash(i+3)*7; pos[i*3]=x+Math.sin(t+i)*.1; pos[i*3+1]=y; pos[i*3+2]=z;} g.attributes.position.needsUpdate=true; };
  return S;}

/* ---------- FRONT DOOR (exterior night) ---------- */
export function buildFront(scene){ const F={}; const root=new THREE.Group(); scene.add(root);
  const snow=box(20,.04,10,0xc9d0de,{r:1}); snow.position.set(0,-.02,2); root.add(snow);
  const wc=0x5a5f78; const wl=(x0,x1,y0,y1)=>{const b=box(x1-x0,y1-y0,.2,wc,{r:1}); b.position.set((x0+x1)/2,(y0+y1)/2,-.1); root.add(b);};
  wl(-6,-.5,0,4); wl(.5,6,0,4); wl(-.5,.5,2.15,4);
  for(let i=0;i<16;i++){ const sd=box(12,.02,.01,0x30354a,{cast:false}); sd.position.set(0,.2+i*.24,.005); root.add(sd);}
  const step=box(1.6,.12,.6,0x5a5f6e); step.position.set(0,.06,.3); root.add(step); const stS=box(1.6,.03,.6,0xe8ecf3); stS.position.set(0,.135,.3); root.add(stS);
  const dfr=box(1.1,2.25,.12,0x2a2420); dfr.position.set(0,1.1,0); root.add(dfr);
  F.inside=new THREE.Mesh(new THREE.PlaneGeometry(.98,2.1),new THREE.MeshBasicMaterial({color:0xffcf91})); F.inside.position.set(0,1.07,-.12); root.add(F.inside);
  F.door=new THREE.Group(); F.door.position.set(-.48,0,-.02); const dp=box(.96,2.08,.06,0x5b3a2e,{r:.7}); dp.position.set(.48,1.06,0); F.door.add(dp);
  const win=new THREE.Mesh(new THREE.PlaneGeometry(.6,.4),new THREE.MeshBasicMaterial({color:0xf2c27a})); win.position.set(.48,1.7,.035); F.door.add(win); const kn=sph(.035,0xc9a86a); kn.position.set(.85,1.0,.05); F.door.add(kn); root.add(F.door);
  const lampB=box(.16,.24,.12,0xffd9a0,{basic:1,cast:false}); lampB.position.set(-.85,1.85,.1); root.add(lampB);
  const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xffcf91,transparent:true,opacity:.7,depthWrite:false})); gl.scale.set(2.4,2.4,1); gl.position.set(-.85,1.85,.15); root.add(gl);
  F.porch=new THREE.PointLight(0xffc98a,6,6,1.5); F.porch.position.set(-.85,1.8,.4); F.porch.castShadow=true; F.porch.shadow.mapSize.set(512,512); root.add(F.porch);
  F.spill=new THREE.SpotLight(0xffc98a,0,7,Math.PI/4,.5,1.2); F.spill.position.set(0,1.6,-.6); F.spill.target.position.set(0,0,2.5); root.add(F.spill,F.spill.target);
  const wn=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.0),new THREE.MeshBasicMaterial({color:0xf2c27a})); wn.position.set(1.9,1.5,.01); root.add(wn); const wf=box(1.2,.06,.1,0x2a2420); wf.position.set(1.9,1.0,.02); root.add(wf); const ws=box(1.2,.05,.14,0xe8ecf3); ws.position.set(1.9,1.03,.06); root.add(ws);
  F.moon=new THREE.DirectionalLight(0x8aa0d0,.8); F.moon.position.set(3,6,8); root.add(F.moon); F.hemi=new THREE.HemisphereLight(0x5068a0,0x30384c,.45); root.add(F.hemi);
  const N=900, pos=new Float32Array(N*3); const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  F.snow=new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:.03,transparent:true,opacity:.85,depthWrite:false})); root.add(F.snow);
  F.set=(o,t)=>{ const op=o.open||0; F.door.rotation.y=-op*1.5; F.spill.intensity=op*30;
    for(let i=0;i<N;i++){ const sp=.5+hash(i+1)*.6; pos[i*3]=-5+hash(i)*10+Math.sin(t+i)*.1; pos[i*3+1]=3.6-((t*sp+hash(i+2)*4)%3.8); pos[i*3+2]=.2+hash(i+3)*5;} g.attributes.position.needsUpdate=true;};
  return F;}
