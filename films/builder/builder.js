// Low-poly builder character — rigged, flat-shaded. Usage: const b=makeBuilder(THREE); scene.add(b.root); poseBuilder(b,{...})
export const COL={helmet:0xf07a1e,tee:0x5d5c60,pants:0x232224,skin:0xe8a473,hair:0x5b3a24,beard:0x553621,boot:0x6c6c70,dark:0x1b1b1d,orange:0xf2711c};
export function makeBuilder(THREE){
 const M=c=>new THREE.MeshStandardMaterial({color:c,roughness:.78,metalness:0,flatShading:true});
 const mat={};for(const k in COL)mat[k]=M(COL[k]);mat.helmet.roughness=.5;mat.eye=new THREE.MeshBasicMaterial({color:0x101010});
 const mesh=(g,m,p=[0,0,0],r=[0,0,0],s=[1,1,1])=>{const o=new THREE.Mesh(g,m);o.position.set(...p);o.rotation.set(...r);o.scale.set(...s);o.castShadow=o.receiveShadow=true;return o};
 const G=()=>new THREE.Group();
 const cyl=(a,b,h,n=8)=>new THREE.CylinderGeometry(a,b,h,n,1);
 const box=(x,y,z)=>new THREE.BoxGeometry(x,y,z);
 const root=G(),body=G();root.add(body);
 const hips=G();hips.position.y=.98;body.add(hips);
 // pelvis + belt area
 hips.add(mesh(cyl(.2,.2,.18,8),mat.pants,[0,.02,0],[0,0,0],[1,1,.68]));
 // torso (t-shirt)
 const chest=G();chest.position.y=.1;hips.add(chest);
 chest.add(mesh(cyl(.27,.215,.56,8),mat.tee,[0,.28,0],[0,Math.PI/8,0],[1,1,.62]));
 chest.add(mesh(cyl(.22,.27,.08,8),mat.tee,[0,.6,0],[0,Math.PI/8,0],[1,1,.62]));
 chest.add(mesh(cyl(.075,.085,.1,7),mat.skin,[0,.68,0]));                    // neck
 chest.add(mesh(cyl(.09,.105,.025,10),mat.tee,[0,.635,.005],[0,0,0],[1,1,.85])); // collar
 // head
 const neck=G();neck.position.y=.72;chest.add(neck);
 const head=G();head.position.y=.13;neck.add(head);
 head.add(mesh(new THREE.SphereGeometry(.15,7,6),mat.skin,[0,0,0],[0,0,0],[.95,1.15,1.02]));
 // beard: lower front shell
 head.add(mesh(new THREE.SphereGeometry(.157,8,5,Math.PI*.12,Math.PI*.76,Math.PI*.6,Math.PI*.34),mat.beard,[0,-.005,.0],[0,0,0],[.99,1.17,1.07]));
 head.add(mesh(box(.13,.032,.035),mat.beard,[0,-.04,.145]));                     // moustache
 head.add(mesh(box(.045,.011,.01),mat.dark,[0,-.082,.162]));                     // mouth
 head.add(mesh(box(.035,.055,.04),mat.skin,[0,.0,.16],[-.25,0,0]));             // nose
 const eyes=[],brows=[];
 for(const s of[-1,1]){
  const e=mesh(box(.03,.04,.012),mat.eye,[s*.053,.05,.148]);head.add(e);eyes.push(e);
  const b=mesh(box(.07,.02,.022),mat.hair,[s*.055,.098,.145],[0,0,-s*.08]);head.add(b);brows.push(b);
  head.add(mesh(box(.035,.065,.045),mat.skin,[s*.145,.01,0]));
  head.add(mesh(box(.03,.11,.07),mat.beard,[s*.138,-.01,.055],[0,s*.25,0]));                       // ears
 }
 // curly hair: clumps around sides/back under helmet
 const hairG=new THREE.IcosahedronGeometry(.045,0);
 for(let i=0;i<22;i++){const a=Math.PI*.38+i/22*Math.PI*1.24, y=.02+((i*7)%5)*.012;
  const r=.142+((i*3)%4)*.006;head.add(mesh(hairG,mat.hair,[Math.sin(a)*r,y,Math.cos(a)*r*1.02],[i,i*2,i*3],[1,1.1,1]));}
 for(let i=0;i<9;i++){const a=Math.PI*.6+i/9*Math.PI*.8;head.add(mesh(hairG,mat.hair,[Math.sin(a)*.135,-.015,Math.cos(a)*.135],[i,i,i],[.9,1,.9]));}
 // fringe curls at forehead sides
 for(const s of[-1,1])for(let i=0;i<2;i++)head.add(mesh(hairG,mat.hair,[s*(.115+i*.025),.085,.09-i*.035],[i,s,0],[.8,.8,.8]));
 // hard hat
 const hat=G();hat.position.y=.125;head.add(hat);
 hat.add(mesh(new THREE.SphereGeometry(.185,8,5,0,Math.PI*2,0,Math.PI/2),mat.helmet,[0,0,0],[0,Math.PI/8,0],[1,1.12,1.1]));
 hat.add(mesh(box(.07,.05,.26),mat.helmet,[0,.2,0],[0,0,0]));                 // ridge
 hat.add(mesh(cyl(.215,.225,.026,8),mat.helmet,[0,.0,.035],[0,Math.PI/8,0],[1,1,1.2]));   // brim
 hat.add(mesh(cyl(.188,.188,.03,8),mat.dark,[0,-.02,0],[0,Math.PI/8,0],[1,1,1.08]));        // band
 // arms
 const L={};
 for(const s of[-1,1]){
  const sh=G();sh.position.set(s*.27,.53,0);chest.add(sh);
  sh.add(mesh(cyl(.105,.1,.2,7),mat.tee,[0,-.06,0]));                          // sleeve
  sh.add(mesh(cyl(.075,.066,.3,7),mat.skin,[0,-.16,0]));
  const el=G();el.position.y=-.31;sh.add(el);
  el.add(mesh(new THREE.SphereGeometry(.068,6,4),mat.skin));
  el.add(mesh(cyl(.066,.052,.26,7),mat.skin,[0,-.13,0]));
  const hand=G();hand.position.y=-.27;el.add(hand);
  hand.add(mesh(box(.095,.11,.05),mat.skin,[0,-.05,0]));
  hand.add(mesh(box(.03,.06,.03),mat.skin,[-s*-.0,-.02,.035],[.4,0,0]));          // thumb
  const finger=mesh(box(.026,.085,.026),mat.skin,[s*.0,-.125,.0]);hand.add(finger);finger.visible=false; // pointing finger
  // legs
  const hp=G();hp.position.set(s*.105,0,0);hips.add(hp);
  hp.add(mesh(cyl(.125,.11,.48,7),mat.pants,[0,-.22,0]));
  hp.add(mesh(box(.07,.15,.12),mat.pants,[s*.115,-.3,0]));                         // cargo pocket
  hp.add(mesh(box(.012,.03,.025),mat.orange,[s*.152,-.25,.0]));                     // orange tab
  const kn=G();kn.position.y=-.45;hp.add(kn);
  kn.add(mesh(cyl(.11,.115,.44,7),mat.pants,[0,-.2,0]));
  kn.add(mesh(cyl(.118,.118,.06,7),mat.pants,[0,-.39,0]));                          // cuff
  const ft=G();ft.position.y=-.44;kn.add(ft);
  ft.add(mesh(box(.15,.13,.27),mat.boot,[0,-.03,.04]));
  ft.add(mesh(box(.155,.085,.11),mat.dark,[0,-.055,.13]));                          // toe cap
  ft.add(mesh(box(.16,.07,.12),mat.dark,[0,.02,-.06]));                             // ankle collar
  ft.add(mesh(box(.162,.03,.3),mat.orange,[0,-.1,.04]));                            // orange midsole
  ft.add(mesh(box(.162,.03,.3),mat.dark,[0,-.13,.04]));                             // outsole
  for(let i=0;i<3;i++)ft.add(mesh(box(.1,.012,.015),mat.orange,[0,.04-i*.012,.06+i*.035],[-.6,0,0])); // laces
  L[s]={sh,el,hand,finger,hp,kn,ft};
 }
 hat.traverse(o=>{if(o.isMesh)o.castShadow=false});
 return {root,body,hips,chest,neck,head,hat,L,eyes,brows,mat};
}
// pose: angles in radians. arms: [shX(fwd -), shZ(out +), elX(bend -)]. legs handled by walk/crouch.
export const ARMS={idle:[.05,.08,-.12],point:[-1.45,.15,0],hip:[.2,.55,-1.6],head:[-2.5,.5,-2.1],up:[-2.9,.25,-.1],think:[-.4,.05,-2.2],wave:[-2.6,.5,-.5],out:[-.6,.9,-.3]};
export function poseBuilder(b,{la=ARMS.idle,ra=ARMS.idle,head=[0,0,0],walk=0,ph=0,crouch=0,lean=0,brow=0,point=false,jump=0}={}){
 for(const s of[-1,1]){const a=s<0?ra:la,l=b.L[s];
  const q=ph+(s<0?Math.PI:0),sw=Math.sin(q);
  const armSwing=walk*.45*Math.sin(q+Math.PI);
  l.sh.rotation.set(a[0]+armSwing*(a===ARMS.idle?1:.15),0,s*a[1]);l.el.rotation.x=a[2]-(walk?.25*walk:0);
  l.hp.rotation.x=-.55*sw*walk-1.3*crouch;l.kn.rotation.x=Math.max(0,Math.sin(q-1.1))*1.1*walk+2.2*crouch;l.ft.rotation.x=-.9*crouch;
 }
 b.L[1].finger.visible=point==='L';b.L[-1].finger.visible=point===true||point==='R';
 b.hips.position.y=.98+Math.abs(Math.cos(ph))*.035*walk-.48*crouch+jump;
 b.chest.rotation.x=lean+.06*walk+.3*crouch;b.chest.rotation.y=Math.sin(ph)*.08*walk;
 b.neck.rotation.set(head[0],head[1],head[2]);
 b.brows.forEach((o,i)=>{o.position.y=.088+brow*.018;o.rotation.z=(i?-1:1)*(.08-brow*.25)});
}
