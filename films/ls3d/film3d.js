import {THREE,renderer,camera,Person,KF,poseAt,sample,camKeys,toScreen,clamp,Pr,lerp,eio,eo,D,hash} from './engine.js';
import {buildKitchen,buildRoom,buildStreet,buildFront,armInsert,mug,drawCal} from './sets.js';
import {redraw} from './engine.js';

/* ---------- scenes ---------- */
const SK=new THREE.Scene(); SK.background=new THREE.Color(0x0d0b0a); const K=buildKitchen(SK);
const SR=new THREE.Scene(); SR.background=new THREE.Color(0x0b0d14); const R=buildRoom(SR);
const SS=new THREE.Scene(); SS.background=new THREE.Color(0x10162a); const ST=buildStreet(SS);
const SF=new THREE.Scene(); SF.background=new THREE.Color(0x10162a); const F=buildFront(SF);
const T=K.T, TY=K.tableY;
/* cast */
const WARM=0xffd3a1, COLD=0xa9c4ff;
const G=new Person({s:.9,bun:1,shawl:0xb9773a,rim:WARM,rimK:.75}); SK.add(G.root);
const BK=new Person({s:1.0,phones:1,rim:WARM,rimK:.6}); SK.add(BK.root);
const BR=new Person({s:1.0,phones:1,rim:COLD,rimK:.85}); SR.add(BR.root);
const BS=new Person({s:1.0,phones:1,rim:COLD,rimK:.8}); SS.add(BS.root);
const BF=new Person({s:1.0,phones:1,rim:WARM,rimK:.7}); SF.add(BF.root);
const handW=armInsert(WARM), handC=armInsert(COLD); SK.add(handW.g,handC.g);
const carry=mug(0x6f9fd6); SK.add(carry); carry.visible=false;
const carryG=mug(); SK.add(carryG); carryG.visible=false;

/* ---------- poses ---------- */
const GD=.25, BD=.3;
const SEATG={x:T.x-.86,z:T.z,yaw:90,drop:GD,lL:[86,86],lR:[86,86],lean:6,tilt:8,aL:[46,8,58],aR:[44,8,60],brow:.4,seed:0};
const SEATB={x:T.x+.88,z:T.z,yaw:-90,drop:BD,lL:[86,86],lR:[86,86],lean:6,tilt:6,aL:[42,8,60],aR:[40,8,62],brow:.4,seed:1};
const COUCH={x:R.seat.x,z:0,yaw:90,drop:BD,lL:[86,86],lR:[86,86],lean:10,tilt:12,aL:[48,6,70],aR:[46,6,72],brow:.3,seed:1};
const TR={};
TR.k1=KF([Object.assign({},{t:0,x:T.x+.48,z:T.z+.42,yaw:-148,lean:12,tilt:14,aR:[62,4,18],aL:[6,8,8],brow:.3,seed:0}),
  {t:1.0,aR:[58,4,14]},{t:1.6,lean:3,tilt:4,aR:[4,8,8]},{t:2.2},
  {t:2.5,walk:0},{t:2.9,walk:1,yaw:-110,ez:'i'},{t:3.9,x:T.x+.05,z:T.z+.82,yaw:-80,ez:'lin'},{t:5.0,x:T.x-.6,z:T.z+.6,yaw:-130,ez:'lin'},{t:5.8,x:T.x-.86,z:T.z+.12,yaw:-170,walk:0,ez:'o'},
  {t:6.4,yaw:90,z:T.z+.02},{t:7.4,z:T.z,drop:GD,lL:[86,86],lR:[86,86],lean:6,tilt:8},
  {t:8.0,aL:[46,8,58],aR:[44,8,60]},{t:8.8,hyaw:40,tilt:-14,lookY:1},{t:9.8},{t:10.5,hyaw:0,tilt:8,lookY:0,smile:.7,brow:.15},{t:13}]);
TR.k2=KF([Object.assign({t:0},SEATG,{smile:.4,brow:.2}),{t:1.2,hyaw:25,look:1,tilt:2},{t:2.6},{t:3.2,hyaw:40,tilt:-14,lookY:1,smile:0},{t:4.0},{t:4.6,hyaw:20,tilt:8,lookY:0,brow:.7},{t:6}]);
TR.k3=KF([Object.assign({t:0},SEATG,{brow:.7}),{t:1.5},{t:3.0,tilt:24,lean:10,brow:1.1},{t:5.5,aR:[70,0,22]},{t:7.0,aR:[62,2,30]},{t:9}]);
TR.k4=KF([Object.assign({t:0},SEATG,{brow:.9,tilt:14}),{t:2.0,hyaw:-10,look:-1,tilt:6},{t:3.5},{t:4.5,tilt:18,look:0},{t:7}]);
TR.k5g=KF([Object.assign({t:0},SEATG,{closed:1,tilt:30,lean:14,aL:[48,4,48],aR:[46,4,50],brow:.5}),{t:14}]);
TR.k5b=KF([{t:0,x:2.45,z:-2.7,yaw:180,brow:.8,seed:1,aL:[4,6,8],aR:[4,6,8]},{t:1.4},{t:1.5,walk:0},{t:1.8,walk:1,ez:'i'},{t:3.2,x:2.3,z:-1.5,yaw:-160,ez:'lin'},{t:4.6,x:1.9,z:-.95,yaw:-130,walk:0,ez:'o'},{t:5.4,tilt:16,brow:1.2},{t:14}]);
TR.k6b=KF([Object.assign({t:0},SEATB,{brow:1.1,tilt:14,aL:[20,6,30],aR:[20,6,30]}),{t:3.0,tilt:8},{t:6.0,brow:1.3,tilt:16},{t:9}]);
TR.k7g=KF([Object.assign({t:0},SEATG,{closed:1,tilt:30,lean:14,aL:[48,4,48],aR:[46,4,50],brow:.5}),
  {t:1.0},{t:1.5,closed:0,tilt:20},{t:2.4,tilt:4,lean:6,brow:-.2,look:1},{t:3.2,brow:.1,smile:.5},{t:5.0,aL:[46,8,58],aR:[44,8,60]},{t:7.5,smile:1},{t:8.0,tilt:12},{t:8.4,tilt:4},{t:11}]);
TR.k7b=KF([Object.assign({t:0},SEATB,{brow:.9,tilt:10}),{t:2.0,brow:.4},{t:3.4,brow:-.2,smile:.3},{t:6.0,tilt:2,smile:.8},{t:6.4,tilt:12},{t:6.8,tilt:3},{t:11}]);
TR.k8g=KF([Object.assign({t:0},SEATG,{smile:1,brow:-.1}),{t:9}]);
TR.k8b=KF([Object.assign({t:0},SEATB,{smile:.9,brow:-.1}),{t:9}]);
TR.r1=KF([Object.assign({t:0},COUCH),{t:2.0},{t:2.7,hyaw:-55,tilt:26,brow:.5},{t:3.6},{t:4.0,brow:.8},{t:4.4,aR:[34,30,8],lean:18},{t:5.2,aR:[64,8,112],lean:10,hyaw:0,tilt:18},{t:8}]);
TR.r2=KF([Object.assign({t:0},COUCH),{t:2.6},{t:3.2,hyaw:-55,tilt:26,brow:.6},{t:5.2},{t:5.8,brow:1.0},{t:6.2,aR:[34,30,8],lean:18},{t:7.0,aR:[64,8,112],lean:10,hyaw:0,tilt:18},{t:9}]);
TR.r3=KF([Object.assign({t:0},COUCH,{aR:[64,8,112],aL:[6,6,10],tilt:18,brow:1.1}),{t:.6},{t:1.1,drop:0,lL:[0,0],lR:[0,0],lean:2,tilt:6,x:R.seat.x+.25,aR:[30,6,70]},{t:1.5,yaw:-60},{t:1.7,walk:0},{t:2.0,walk:1,ez:'i'},{t:5,x:-2.6,z:1.6,ez:'lin'}]);
TR.st=KF([{t:0,x:0,z:.6,yaw:90,lean:6,tilt:10,brow:.9,walk:1,aL:[-4,10,24],aR:[-4,10,24],holdL:1,holdR:1,seed:1},{t:7,x:9.5,ez:'lin'}]);
TR.dr=KF([{t:0,x:-1.6,z:1.4,yaw:140,brow:.9,tilt:4,seed:1,aL:[4,6,8],aR:[4,6,8]},{t:.5,walk:0},{t:.8,walk:1,ez:'i'},{t:1.6,x:-.62,z:.78,yaw:165,walk:0,ez:'o'},
  {t:1.9,aR:[95,10,80]},{t:2.1,aR:[95,10,60],ez:'o'},{t:2.25,aR:[95,10,82]},{t:2.45,aR:[95,10,60],ez:'o'},{t:2.6,aR:[95,10,82]},{t:2.8,aR:[95,10,60],ez:'o'},{t:3.1,aR:[6,8,10]},
  {t:4.4,tilt:-4,brow:1.2},{t:4.9,aR:[58,4,20],tilt:4},{t:6.4,x:-.45,z:.55},{t:7}]);

/* ---------- helpers ---------- */
const stage=document.getElementById('stage'), W_=document.getElementById('w'), fadeL=document.getElementById('fadeL'), vig=document.getElementById('vig'), grain=document.getElementById('grain');
function sayAt(t,a,b,P,txt){ if(t<a||t>b) return ""; const h=P.headWorld(); h.y+=.34; const s=toScreen(h); return sayT(t,a,b,s[0],s[1],txt); }
function notif(t,a,b,x,y,who,txt){ if(t<a||t>b) return ""; const p=eob(Pr(t,a,a+.35)), op=Math.min(1,Pr(t,a,a+.2))*(1-Pr(t,b-.3,b));
  return `<g opacity="${op}" transform="translate(${x} ${y}) scale(${p})"><rect x="-10" y="-46" width="340" height="86" rx="20" fill="#1d2230" opacity=".92"/><rect x="6" y="-30" width="54" height="54" rx="14" fill="#3fc75a"/><path d="M20 -8 h26 a6 6 0 0 1 6 6 v10 a6 6 0 0 1 -6 6 h-14 l-8 7 v-7 h-4 a6 6 0 0 1 -6 -6 v-10 a6 6 0 0 1 6 -6 z" fill="#fff"/><text x="74" y="-8" font-family="${SANS}" font-weight="700" font-size="20" fill="#fff">${who}</text><text x="74" y="22" font-family="${SANS}" font-size="20" fill="#d6dae4">${txt}</text></g>`;}
const WIDE=[[0.5,1.45,4.6],[0.2,1.0,-.7],32];
const kset=(o,t)=>K.set(Object.assign({season:'autumn',clock:4,date:12,month:'NOVEMBER',cupB:1,lamp:1},o),t);
function posePerson(P,tr,t){ P.set(poseAt(tr,t),t); }
function hide(...ps){ [G,BK].forEach(p=>p.root.visible=!ps.includes(p)); }
function holdMug(m,P,side='R',dy=-.06){ const h=P.handWorld(side); m.position.set(h.x,h.y+dy,h.z); m.visible=true; }
function calFlip(t,p,d0,m0){ K.calFlip.visible=p>0&&p<1; if(!K.calFlip.visible) return; redraw(K.calFlip.children[0].material.map,(x,w,h)=>drawCal(x,w,h,d0,m0));
  const up=eio(Pr(p,0,.55)), fall=eio(Pr(p,.45,1)); K.calFlip.rotation.x=-up*2.4; K.calFlip.position.y=1.605-fall*.8; K.calFlip.position.z=-2.16+fall*.25; K.calFlip.children.forEach(c=>{c.material.transparent=true; c.material.opacity=1-fall;}); }

/* ---------- shots ---------- */
const SH=[]; let T0=0; const A=(dur,o)=>{o.a=T0;o.b=T0+dur;T0+=dur;SH.push(o);};
const card=(lines,out)=>({card:t=>cardText(t,{lines,out})});
const kWide=(fn,cam,o={})=>Object.assign({sc:'K',cam,fn},o);
A(5,card([{txt:"We always think there will be another Sunday.",at:1.0,it:1,sz:48,y:552}],4.3));
/* CH1 */
A(13,{sc:'K',fin:.9,cam:[[0,[0.5,1.45,4.6],[0.2,1.0,-.7],32],[13,[0.45,1.38,4.0],[0.2,1.0,-.7],32]],fn:t=>{ kset({season:'autumn',clock:3.96+t/3600*30,cupB:t>1.0,kSteam:.5,kB:Math.min(1,(t-1)*1.5)},t);
  BK.root.visible=false; posePerson(G,TR.k1,t); carry.visible=false; if(t<1.0){ G.root.updateMatrixWorld(true); holdMug(carry,G,'R'); } }});
A(4.5,{sc:'K',cam:[[0,[T.x+.0,1.08,T.z+1.25],[T.x,.84,T.z],30],[4.5,[T.x+.0,1.05,T.z+1.08],[T.x,.84,T.z],30]],fn:t=>{kset({},t); BK.root.visible=false; G.set(SEATG,t);}});
A(3.2,{sc:'K',cam:[[0,[1.35,2.0,-1.3],[1.35,2.0,-2.2],22],[3.2,[1.35,2.0,-1.38],[1.35,2.0,-2.2],22]],fn:t=>{kset({clock:t<1.6?3+59/60+(50+t)/3600:4+(t-1.6)/3600},t); BK.root.visible=false; G.set(SEATG,t);}});
A(6,{sc:'K',cam:[[0,[T.x+.7,1.32,T.z+.85],[T.x-.85,1.02,T.z],30],[6,[T.x+.6,1.3,T.z+.75],[T.x-.85,1.02,T.z],30]],fn:t=>{kset({clock:4+2/60+t/3600*20},t); BK.root.visible=false; posePerson(G,TR.k2,t);}});
A(7.5,{sc:'R',cam:[[0,[1.3,1.55,4.0],[.3,.85,0],32],[7.5,[1.2,1.45,3.4],[.2,.85,0],32]],fn:t=>{ R.set({eve:0,phoneOnCouch:t<4.8,buzz:(t>2&&t<2.7)||(t>3.3&&t<3.8),phoneLit:t>2&&t<4.8},t); posePerson(BR,TR.r1,t); BR.root.updateMatrixWorld(true);
   const hl=BR.handWorld('L'), hr=BR.handWorld('R'); R.ctrl.visible=t<4.4; R.ctrl.position.set((hl.x+hr.x)/2,(hl.y+hr.y)/2,(hl.z+hr.z)/2); R.ctrl.rotation.y=Math.PI/2;
   R.held.visible=t>=4.8; if(R.held.visible){ R.held.position.set(hr.x+.02,hr.y+.06,hr.z); R.held.rotation.set(-.4,-Math.PI/2,0); R.phoneL.position.set(hr.x+.1,hr.y+.1,hr.z); R.phoneL.intensity=1.6; } },
  ov:t=>{ const p=toScreen(new THREE.Vector3(-.35,.75,.45)); return notif(t,2.1,5.2,p[0]+30,p[1]-60,"Grandma","Tea's ready ☕");}});
const PH=(dur,scn,camk,cfg,o={})=>A(dur,Object.assign({sc:scn,blur:1,cam:camk,fn:o.fn||(t=>{}),ov:t=>phoneShot(t,Object.assign({bg:()=>"",dim:0},cfg))},o));
const roomBG=[[0,[.2,1.2,2.4],[1.6,1.0,-.5],34]], kitBG=[[0,[0.6,1.3,2.6],[0.2,1.0,-1.2],34]];
PH(8,'R',roomBG,{dark:1,name:"Grandma",initial:"G",avatar:"#b9773a",msgs:[{side:"in",text:"Sunday tea? ☕",at:-9,time:"Sat 6:12 PM"},{side:"out",text:"maybe!",at:-8},{side:"in",text:"Tea's ready ☕",at:-1,time:"Today 4:05 PM"}],typing:{text:"Can't today, next week 🙏",t0:2.2,cps:11,send:5.0},thumb:thumbType(2.2,4.7,11)},{fn:t=>{R.set({eve:0},t); BR.set(COUCH,t);}});
PH(8,'K',kitBG,{dark:0,big:1,rot:2,rim:"rimW",name:"Sammy ❤️",initial:"S",avatar:"#6f9fd6",msgs:[{side:"out",text:"Sunday tea? ☕",at:-9,time:"Sat 6:12 PM"},{side:"in",text:"maybe!",at:-8},{side:"out",text:"Tea's ready ☕",at:-7,time:"Today 4:05 PM"},{side:"in",text:"Can't today, next week 🙏",at:.6}],typing:{text:"Okay sweetheart ❤️",t0:2.6,cps:5,send:6.7},thumb:thumbType(2.6,6.2,5),read:{at:7.2,label:"Delivered"}},{fn:t=>{kset({clock:4.1},t); BK.root.visible=false; G.set(SEATG,t);}});
A(9,{sc:'K',fout:1.0,cam:[[0,[T.x+.7,1.35,T.z+1.1],[T.x-.8,1.0,T.z],30],[9,[0.5,1.45,4.6],[0.2,1.0,-.7],32]],fn:t=>{kset({clock:4.15+t/9*1.2,kSteam:0,kB:Math.max(0,.9-t/6.5)},t); BK.root.visible=false; posePerson(G,TR.k3,t);}});
A(6.5,card([{txt:"Do not act as if you had ten thousand years to live.",at:.5,sz:46,y:530},{txt:"— MARCUS AURELIUS",at:1.3,sz:20,ls:4,c:"#8f8a82",y:600}],5.8));
/* CH2 montage */
const calCam=[[0,[.75,1.3,.25],[.55,1.52,-2.2],34],[2.6,[.77,1.3,.1],[.57,1.52,-2.2],34]];
const CAL=(d0,m0,d1,m1,season,fin=0)=>A(2.6,{sc:'K',fin,cam:calCam,fn:t=>{kset({season,date:d1,month:m1,clock:4+t/3600},t); BK.root.visible=false; G.set(SEATG,t); calFlip(t,Pr(t,.7,1.5),d0,m0);}});
const cupsCam=[[0,[T.x+.0,1.08,T.z+1.25],[T.x,.84,T.z],30],[2.6,[T.x+.0,1.05,T.z+1.08],[T.x,.84,T.z],30]];
CAL(12,"NOVEMBER",19,"NOVEMBER","late",.6);
A(2.6,{sc:'K',cam:cupsCam,fn:t=>{kset({season:'late',date:19,kB:.5},t); BK.root.visible=false; G.set(SEATG,t);}});
PH(3.6,'R',roomBG,{dark:1,name:"Grandma",initial:"G",avatar:"#b9773a",rot:-5,dx:-40,msgs:[{side:"in",text:"Tea's ready ☕",at:-9,time:"Sun 4:05 PM"},{side:"out",text:"Can't today, next week 🙏",at:-8},{side:"in",text:"Okay sweetheart ❤️",at:-7},{side:"in",text:"Sunday? ☕",at:-1,time:"Today 4:02 PM"}],typing:{text:"busy, sorry",t0:1.0,cps:12,send:2.3},thumb:thumbType(1.0,2.0,12)},{fn:t=>{R.set({eve:.5},t); BR.set(COUCH,t);}});
PH(2.6,'K',kitBG,{dark:0,big:1,rot:3,dx:40,rim:"rimW",name:"Sammy ❤️",initial:"S",avatar:"#6f9fd6",msgs:[{side:"out",text:"Sunday? ☕",at:-9,time:"Today 4:02 PM"},{side:"in",text:"busy, sorry",at:-1}],typing:{text:"Ok ❤️",t0:.7,cps:4,send:2.1},thumb:thumbType(.7,1.9,4)},{fn:t=>{kset({season:'late',date:19},t); BK.root.visible=false; G.set(SEATG,t);}});
CAL(19,"NOVEMBER",26,"NOVEMBER","late");
A(3.4,{sc:'K',cam:[[0,[T.x+.0,1.08,T.z+1.25],[T.x,.84,T.z],30],[3.4,[T.x+.0,1.05,T.z+1.08],[T.x,.84,T.z],30]],fn:t=>{ const rc=eio(Pr(t,.4,1.3)), tk=eio(Pr(t,1.5,2.9));
  kset({season:'late',date:26,cupB:false},t); BK.root.visible=false; G.set(SEATG,t);
  const cp=new THREE.Vector3(T.x+.22-tk*.5,TY+tk*.28,T.z+.05+tk*.15); carry.visible=true; carry.position.copy(cp); carry.rotation.y=Math.PI;
  const hp=new THREE.Vector3(lerp(T.x-.35,cp.x-.09,rc),lerp(1.05,cp.y+.05,rc),lerp(T.z+.35,cp.z,rc)); handW.g.visible=true; handW.set(hp,0,-15,lerp(.3,.75,rc));}});
PH(3.6,'K',kitBG,{dark:0,big:1,rot:2,rim:"rimW",name:"Sammy ❤️",initial:"S",avatar:"#6f9fd6",msgs:[{side:"out",text:"Sunday? ☕",at:-9,time:"Sun 4:02 PM"},{side:"in",text:"busy, sorry",at:-9},{side:"out",text:"Ok ❤️",at:-9},{side:"out",text:"Sunday? ☕",at:-1,time:"Today 4:01 PM"}],read:{at:1.1,label:"Read 4:01 PM"}},{fn:t=>{kset({season:'late',date:26,cupB:false},t); BK.root.visible=false; G.set(SEATG,t);}});
CAL(26,"NOVEMBER",3,"DECEMBER","winter");
A(6.2,{sc:'K',cam:[[0,[0.5,1.45,4.6],[0.2,1.0,-.7],32],[6.2,[0.3,1.35,3.6],[0.1,1.0,-.7],32]],fn:t=>{kset({season:'winter',date:3,month:'DECEMBER',cupB:false,ring:.8,clock:4.05+t/3600*40},t); BK.root.visible=false; posePerson(G,TR.k4,t);}});
A(5,{sc:'K',fout:1.0,cam:[[0,[T.x+.05,1.1,T.z+1.3],[T.x,.84,T.z],30],[5,[T.x+.05,1.04,T.z+1.0],[T.x,.84,T.z],30]],fn:t=>{kset({season:'winter',date:3,month:'DECEMBER',cupB:false,ring:1},t); BK.root.visible=false; G.set(SEATG,t);}});
A(6,card([{txt:"The days are long, but the years are short.",at:.5,sz:46,y:530},{txt:"— GRETCHEN RUBIN",at:1.3,sz:20,ls:4,c:"#8f8a82",y:600}],5.3));
/* CH3 */
A(8.5,{sc:'R',fin:.7,cam:[[0,[1.3,1.55,4.0],[.3,.85,0],32],[8.5,[1.0,1.35,3.0],[.1,.85,0],32]],fn:t=>{ R.set({eve:1,paused:t>5.6,phoneOnCouch:t<6.9,phoneLit:t>3.3&&t<4.3},t); posePerson(BR,TR.r2,t); BR.root.updateMatrixWorld(true);
   const hl=BR.handWorld('L'), hr=BR.handWorld('R'); R.ctrl.visible=t<6.2; R.ctrl.position.set((hl.x+hr.x)/2,(hl.y+hr.y)/2,(hl.z+hr.z)/2); R.ctrl.rotation.y=Math.PI/2;
   R.held.visible=t>=6.9; if(R.held.visible){ R.held.position.set(hr.x+.02,hr.y+.06,hr.z); R.held.rotation.set(-.4,-Math.PI/2,0); R.phoneL.position.set(hr.x+.1,hr.y+.1,hr.z); R.phoneL.intensity=1.6;} }});
PH(10,'R',roomBG,{dark:1,name:"Grandma",initial:"G",avatar:"#b9773a",lock:{until:2.0,time:"4:12",date:"Sunday, December 17"},
  msgs:[{side:"in",text:"Tea's ready ☕",at:-9,time:"Nov 12, 4:05 PM"},{side:"out",text:"Can't today, next week 🙏",at:-9},{side:"in",text:"Okay sweetheart ❤️",at:-9},{side:"in",text:"Sunday? ☕",at:-9,time:"Nov 19, 4:02 PM"},{side:"out",text:"busy, sorry",at:-9},{side:"in",text:"Ok ❤️",at:-9},{side:"in",text:"Sunday? ☕",at:-9,time:"Nov 26, 4:01 PM"}],
  scroll:t=>-(1-eio(Pr(t,2.4,5.0)))*360,read:{at:-1,label:""}},{fn:t=>{R.set({eve:1,paused:1},t); BR.set(COUCH,t);}});
SH[SH.length-1].ov2=t=>typeEcho(t,5.6,9.8,960,1000,"She stopped asking.",{cps:13});
A(5,{sc:'R',cam:[[0,[1.8,1.6,4.8],[-.6,.9,.2],32],[5,[1.6,1.6,4.8],[-1.1,.9,.5],32]],fn:t=>{R.set({eve:1,paused:1},t); posePerson(BR,TR.r3,t); BR.root.updateMatrixWorld(true); const hr=BR.handWorld('R'); R.held.visible=true; R.held.position.set(hr.x,hr.y+.05,hr.z); R.ctrl.visible=false;}});
A(6.5,{sc:'S',fn:t=>{ const p=poseAt(TR.st,t); BS.set(p,t); ST.set({},t,p.x); camKeys([[0,[p.x+3.2,1.9,7.8],[p.x+1.1,1.1,0],34]],t);}});
A(7,{sc:'F',cam:[[0,[2.6,1.7,6.6],[-.3,1.1,0],30],[7,[2.2,1.6,5.6],[-.3,1.1,0],30]],fn:t=>{ F.set({open:eio(Pr(t,5.3,6.6))},t); posePerson(BF,TR.dr,t);}});
A(14,{sc:'K',cam:[[0,[0.5,1.45,4.6],[0.4,1.0,-.9],32],[6,[0.6,1.4,4.2],[0.5,1.0,-.9],32],[14,[0.5,1.25,2.6],[0.3,.95,-.8],32]],fn:t=>{ kset({season:'night',date:17,month:'DECEMBER',cupB:false,ring:1,kG:0,lamp:.75,door:eio(Pr(t,.4,1.6)),clock:4+12/60+t/3600*20},t);
  BK.root.visible=true; BK.mat.uniforms.rim.value.setHex(COLD); posePerson(BK,TR.k5b,t); posePerson(G,TR.k5g,t);}});
A(4.5,{sc:'K',cam:[[0,[T.x-.05,1.08,T.z+1.15],[T.x-.1,.84,T.z],30],[4.5,[T.x-.08,1.04,T.z+.95],[T.x-.12,.84,T.z],30]],fn:t=>{ const tk=eio(Pr(t,.6,2.0));
  kset({season:'night',date:17,month:'DECEMBER',cupB:false,ring:1,kG:0,lamp:.75},t); BK.root.visible=false; posePerson(G,TR.k5g,t);
  handC.g.visible=true; handC.set(new THREE.Vector3(lerp(T.x+.45,T.x-.15,tk),lerp(1.0,TY+.05,tk),lerp(T.z+.3,T.z+.06,tk)),180,-10,.55);}});
A(9,{sc:'K',cam:[[0,[T.x,1.4,T.z+2.9],[T.x,1.0,T.z],30],[9,[T.x,1.35,T.z+2.5],[T.x,1.0,T.z],30]],fn:t=>{ kset({season:'night',date:17,month:'DECEMBER',cupB:false,ring:1,kG:0,lamp:.75,clock:4.3},t);
  BK.root.visible=true; BK.mat.uniforms.rim.value.setHex(COLD); posePerson(BK,TR.k6b,t); posePerson(G,TR.k5g,t+3);}, ov:t=>typeEcho(t,2.0,8.6,960,150,"But she never stopped waiting.",{cps:13})});
/* CH4 */
A(5,{sc:'K',cam:[[0,[-1.35,1.4,-.25],[-2.55,1.0,-1.3],32],[5,[-1.45,1.35,-.4],[-2.55,1.0,-1.3],30]],fn:t=>{ const rc=eio(Pr(t,.2,.8)), kn=eio(Pr(t,.9,1.4));
  kset({season:'night',date:17,month:'DECEMBER',knob:kn,flame:Pr(t,1.3,1.6),kSteam:Pr(t,2.2,4.8)},t); BK.root.visible=false; G.root.visible=false;
  handC.g.visible=true; handC.set(new THREE.Vector3(lerp(-1.9,-2.27,rc),lerp(.7,.82,rc),lerp(-1.05,-1.35,rc)),180,0,.6,kn*-60);}});
A(3.6,{sc:'K',cam:[[0,[-1.25,1.72,1.05],[-2.62,1.85,.22],34],[3.6,[-1.32,1.72,.95],[-2.62,1.85,.22],34]],fn:t=>{ const op=eio(Pr(t,.2,.9)), rc=eio(Pr(t,1.0,1.8)), tk=eio(Pr(t,2.0,3.2)); const gone=t>2.0;
  kset({season:'night',date:17,month:'DECEMBER',cab:op,cabTaken:gone},t); BK.root.visible=false; G.root.visible=false;
  const mp=new THREE.Vector3(lerp(-2.72,-2.0,tk),lerp(1.63,1.45,tk),lerp(.37,.7,tk)); if(gone){carry.visible=true; carry.position.copy(mp); carry.rotation.y=-Math.PI/2;}
  const hp=gone?new THREE.Vector3(mp.x+.0,mp.y+.06,mp.z+.08):new THREE.Vector3(lerp(-1.9,-2.66,rc),lerp(1.5,1.7,rc),lerp(.8,.45,rc));
  handC.g.visible=t>.7; handC.set(hp,200,-5,rc>.9?.75:.3);}});
A(4.5,{sc:'K',cam:[[0,[T.x+.0,1.08,T.z+1.25],[T.x,.84,T.z],30],[4.5,[T.x+.0,1.05,T.z+1.08],[T.x,.84,T.z],30]],fn:t=>{kset({season:'night',date:17,month:'DECEMBER',kB:Math.min(1,.2+t*.4),clock:4.5},t); BK.root.visible=false; posePerson(G,TR.k5g,t);}});
A(11,{sc:'K',cam:[[0,[T.x,1.4,T.z+2.9],[T.x,1.0,T.z],30],[11,[T.x,1.32,T.z+2.3],[T.x,1.0,T.z],30]],fn:t=>{ kset({season:'night',date:17,month:'DECEMBER',clock:4.6},t);
  BK.root.visible=true; BK.mat.uniforms.rim.value.setHex(WARM); posePerson(BK,TR.k7b,t); posePerson(G,TR.k7g,t);}, ov:t=>sayAt(t,3.0,5.9,G,"You came.")+sayAt(t,5.9,9.2,BK,"Every Sunday.")});
PH(6,'K',kitBG,{dark:1,name:"",rim:"rimW",cal:{title:"Grandma ☕",t0:.6,rep:2.6,add:4.2},tap:t=>t<.2?null:t<1.6?[-60,-250+(t>.4&&t<.55?8:0)]:t<3.0?[100,-20+(t>2.45&&t<2.6?8:0)]:t<4.7?[150,-310+(t>4.05&&t<4.2?8:0)]:null},{fn:t=>{kset({season:'night',date:17,month:'DECEMBER'},t); BK.root.visible=true; BK.set(SEATB,t); G.set(SEATG,t);}});
A(9,{sc:'K',fout:1.4,cam:[[0,[T.x,1.35,T.z+2.4],[T.x,1.0,T.z],30],[9,[0.5,1.45,4.6],[0.2,1.0,-.7],32]],fn:t=>{ kset({season:'spring',date:14,month:'APRIL',clock:4.1,lamp:.8},t);
  BK.root.visible=true; BK.mat.uniforms.rim.value.setHex(WARM); const lg=Pr(t,2,2.4)*(1-Pr(t,3.8,4.3)); const pg=poseAt(TR.k8g,t); pg.tilt+=Math.sin(t*9)*3*lg; pg.lean+=Math.abs(Math.sin(t*9))*3*lg; G.set(pg,t); posePerson(BK,TR.k8b,t);},
  ov:t=>sayAt(t,.8,3.2,BK,"Same time next week?")+sayAt(t,3.4,6.0,G,"Always.")});
A(5,card([{txt:"They won't ask forever.",at:.6,it:1,sz:50,y:552}],4.4));
A(7,card([{txt:"TWO CUPS",at:.8,fi:1.6,sz:96,ls:22,y:540,w:500},{txt:"Show up while the tea is still warm.",at:1.8,fi:1.2,sz:30,it:1,c:"#bdb7ad",y:610}],6.4));
window.DUR=T0; window.SHOTS=SH.map(s=>[s.a,s.b]);

const SCN={K:SK,R:SR,S:SS,F:SF};
window.render=(t)=>{ const S=SH.find(s=>t>=s.a&&t<s.b)||SH[SH.length-1]; const lt=t-S.a;
  handW.g.visible=false; handC.g.visible=false; carry.visible=false; G.root.visible=true; BK.root.visible=true;
  let ov="";
  if(S.card){ stage.style.visibility='hidden'; ov=S.card(lt); vig.style.opacity=0; }
  else { stage.style.visibility='visible'; vig.style.opacity=1; S.fn(lt); if(S.cam) camKeys(S.cam,lt); stage.style.filter=S.blur?'blur(18px) brightness(.62)':'none';
    renderer.render(SCN[S.sc],camera); if(S.ov) ov+=S.ov(lt); if(S.ov2) ov+=S.ov2(lt); }
  W_.innerHTML=ov;
  let fo=0; if(S.fin) fo=Math.max(fo,1-Pr(lt,0,S.fin)); if(S.fout) fo=Math.max(fo,Pr(lt,S.b-S.a-S.fout,S.b-S.a)); fadeL.style.opacity=fo;
  window.READY=1; };
window.render(0.01);
