import * as THREE from 'three';
export { THREE };
export const D = Math.PI/180;
export const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)), Pr=(t,a,b)=>clamp((t-a)/(b-a)), lerp=(a,b,p)=>a+(b-a)*p;
export const eio=x=>{x=clamp(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}, eo=x=>1-Math.pow(1-clamp(x),3), ei=x=>clamp(x)**3;
export const hash=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};

/* ---------------- renderer ---------------- */
export const W=1920,H=1080;
export const renderer=new THREE.WebGLRenderer({antialias:!location.search.includes('noaa'),preserveDrawingBuffer:true});
renderer.setSize(W,H); renderer.setPixelRatio(1);
renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.0;
renderer.outputColorSpace=THREE.SRGBColorSpace;
document.getElementById('stage').appendChild(renderer.domElement);
export const camera=new THREE.PerspectiveCamera(32,W/H,.05,80);

/* ---------------- materials ---------------- */
const matCache={};
export function M(color,o={}){ const k=color+JSON.stringify(o); if(matCache[k]) return matCache[k];
  const m=o.basic?new THREE.MeshBasicMaterial({color,side:o.side||THREE.FrontSide,transparent:!!o.op,opacity:o.op??1})
    :(location.search.includes('pbr')?new THREE.MeshStandardMaterial({color,roughness:o.r??.92,metalness:0,emissive:o.em||0x000000,emissiveIntensity:o.ei??1,side:o.side||THREE.FrontSide,transparent:!!o.op,opacity:o.op??1}):new THREE.MeshLambertMaterial({color,emissive:o.em||0x000000,emissiveIntensity:o.ei??1,side:o.side||THREE.FrontSide,transparent:!!o.op,opacity:o.op??1}));
  return matCache[k]=m; }
/* silhouette material: near-black with fresnel rim (colour set per character) */
export function silMat(rim=0xffd3a1, strength=.9){
  return new THREE.ShaderMaterial({uniforms:{rim:{value:new THREE.Color(rim)},k:{value:strength},base:{value:new THREE.Color(0x0a0a0c)}},
    vertexShader:`varying vec3 vN; varying vec3 vV; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`,
    fragmentShader:`uniform vec3 rim; uniform float k; uniform vec3 base; varying vec3 vN; varying vec3 vV; void main(){ float f=1.-max(dot(normalize(vN),normalize(vV)),0.); f=pow(f,3.2)*k; vec3 c=base+rim*f; gl_FragColor=vec4(c,1.); }`});}

/* ---------------- geometry helpers ---------------- */
export function box(w,h,d,col,o={}){ const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),o.mat||M(col,o)); m.castShadow=o.cast??true; m.receiveShadow=o.recv??true; return m;}
export function cyl(rt,rb,h,col,o={}){ const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,o.seg||32,1,!!o.open),o.mat||M(col,o)); m.castShadow=o.cast??true; m.receiveShadow=o.recv??true; return m;}
export function sph(r,col,o={}){ const m=new THREE.Mesh(new THREE.SphereGeometry(r,o.seg||28,o.seg2||20),o.mat||M(col,o)); m.castShadow=o.cast??true; m.receiveShadow=o.recv??true; return m;}
export function cap(r,len,mat){ const m=new THREE.Mesh(new THREE.CapsuleGeometry(r,len,6,14),mat); m.castShadow=true; return m;}
export function at(o,x,y,z,ry=0){ o.position.set(x,y,z); o.rotation.y=ry; return o;}
export function grp(...ch){ const g=new THREE.Group(); ch.forEach(c=>c&&g.add(c)); return g;}

/* canvas texture */
export function canvasTex(w,h,draw){ const c=document.createElement('canvas'); c.width=w; c.height=h; const x=c.getContext('2d'); draw(x,w,h); const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; t.anisotropy=4; t._c=c; t._draw=draw; return t;}
export function redraw(t,draw){ const c=t._c, x=c.getContext('2d'); x.clearRect(0,0,c.width,c.height); draw(x,c.width,c.height); t.needsUpdate=true;}
const glowTexC=canvasTex(128,128,(x,w,h)=>{const g=x.createRadialGradient(64,64,0,64,64,64); g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(.4,'rgba(255,255,255,.45)'); g.addColorStop(1,'rgba(255,255,255,0)'); x.fillStyle=g; x.fillRect(0,0,w,h);});
export const glowTex=glowTexC;

/* ---------------- steam (deterministic particles) ---------------- */
export class Steam { constructor(n=26,scale=1){ this.g=new THREE.Group(); this.n=n; this.sc=scale; this.sp=[];
    for(let i=0;i<n;i++){ const m=new THREE.SpriteMaterial({map:glowTex,color:0xfff4e6,transparent:true,depthWrite:false,opacity:0}); const s=new THREE.Sprite(m); this.g.add(s); this.sp.push(s);} }
  update(t,k=1){ const life=2.6; this.sp.forEach((s,i)=>{ const ph=hash(i)*life, u=((t+ph)%life)/life, sd=hash(i+50);
      const y=u*.34*this.sc*(.5+.5*k), sw=Math.sin(u*5+t*1.6+sd*6)*.03*this.sc*u;
      s.position.set(sw+(sd-.5)*.02*this.sc, y, Math.cos(u*4+sd*5)*.02*this.sc*u);
      const sz=(.04+u*.12)*this.sc; s.scale.set(sz,sz*1.3,1);
      s.material.opacity=k*.22*Math.sin(Math.PI*u)*(1-u*.3);}); } }

/* ---------------- character ---------------- */
/* pose: {x,z,yaw,drop,lean,tilt,hyaw,aL:[pitch,roll,elbow],aR:[..],lL:[pitch,knee],lR:[..],brow,closed,smile,look,walk,bob,twist} */
export const POSE0={x:0,z:0,yaw:0,drop:0,lean:0,tilt:0,hyaw:0,aL:[4,8,6],aR:[4,8,6],lL:[0,0],lR:[0,0],brow:.3,closed:0,smile:0,look:0,lookY:0,walk:0,twist:0,side:0};
export class Person {
  constructor(o={}){ this.s=o.s||1; this.rim=o.rim??0xffd3a1; const mat=this.mat=silMat(this.rim,o.rimK??.9);
    const root=this.root=new THREE.Group(); const S=new THREE.Group(); S.scale.setScalar(this.s); root.add(S);
    const LEG=.37, hipH=LEG*2+.06; this.hipH=hipH;
    const hips=this.hips=new THREE.Group(); hips.position.y=hipH; S.add(hips);
    const torso=this.torso=new THREE.Group(); hips.add(torso);
    const tb=cap(.15,.34,mat); tb.position.y=.27; tb.scale.set(1,1,.8); torso.add(tb);
    if(o.belly){ const b=sph(.16,0,{mat}); b.position.set(0,.18,.04); b.scale.set(1,1,.9); torso.add(b);}
    const neck=this.neck=new THREE.Group(); neck.position.y=.58; torso.add(neck);
    const nk=cap(.055,.14,mat); nk.position.y=.07; neck.add(nk);
    const head=this.head=new THREE.Group(); head.position.y=.24; neck.add(head);
    const hd=sph(.2,0,{mat,seg:36,seg2:26}); head.add(hd);
    /* face */
    const eyeM=M(0xf3efe6,{basic:1}); this.eyes=[]; this.brows=[]; this.lids=[];
    for(const sx of [-1,1]){ const e=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),eyeM); e.scale.set(.032,.046,.012); e.position.set(sx*.068,.015,.192); head.add(e); this.eyes.push(e);
      const br=new THREE.Mesh(new THREE.BoxGeometry(.075,.012,.012),M(0xb9b4ab,{basic:1})); br.position.set(sx*.07,.085,.188); head.add(br); this.brows.push(br);}
    const sm=new THREE.Mesh(new THREE.TorusGeometry(.04,.006,6,16,Math.PI),M(0xf3efe6,{basic:1})); sm.rotation.z=Math.PI; sm.position.set(0,-.07,.19); head.add(sm); this.smileM=sm;
    if(o.bun){ const b=sph(.08,0xa9a39a,{r:.8}); b.position.set(0,.13,-.16); head.add(b);  }
    if(o.phones){ const hm=M(0x4d525c,{r:.6}); const band=new THREE.Mesh(new THREE.TorusGeometry(.1,.014,8,24,Math.PI*1.2),hm); band.rotation.x=Math.PI/2; band.rotation.z=Math.PI*1.4; band.position.set(0,.6,-.0); torso.add(band);
      for(const sx of [-1,1]){ const cup_=cyl(.034,.034,.025,0x5d636e); cup_.rotation.z=Math.PI/2; cup_.position.set(sx*.105,.6,.03); torso.add(cup_);} }
    if(o.shawl){ const sm=M(o.shawl,{side:THREE.DoubleSide,r:.95}); const sh=new THREE.Mesh(new THREE.SphereGeometry(.235,28,14,0,Math.PI*2,.35,1.05),sm); sh.position.y=.42; sh.scale.set(1.05,1.15,.95); sh.castShadow=true; torso.add(sh);
      const kn=sph(.035,o.shawl); kn.position.set(0,.36,.2); torso.add(kn); }
    if(o.hood){ const hd2=cap(.17,.30,M(o.hood,{r:.95})); hd2.position.y=.28; hd2.scale.set(1.04,1,.86); torso.add(hd2);}
    /* arms */
    const mkArm=(sx)=>{ const sh=new THREE.Group(); sh.position.set(sx*.165,.5,0); torso.add(sh);
      const up=cap(.042,.30,mat); up.position.y=-.15; sh.add(up);
      const el=new THREE.Group(); el.position.y=-.30; sh.add(el); const fo=cap(.038,.29,mat); fo.position.y=-.145; el.add(fo);
      const hand=new THREE.Group(); hand.position.y=-.29; el.add(hand); const hs=sph(.055,0,{mat}); hs.scale.set(.9,1.1,.8); hand.add(hs);
      if(o.sleeve){ const sl=cap(.05,.22,M(o.sleeve,{r:.95})); sl.position.y=-.14; sh.add(sl); }
      return {sh,el,hand}; };
    this.armL=mkArm(1); this.armR=mkArm(-1);
    const mkLeg=(sx)=>{ const hp=new THREE.Group(); hp.position.set(sx*.085,0,0); hips.add(hp);
      const th=cap(.058,LEG,mat); th.position.y=-LEG/2; hp.add(th);
      const kn=new THREE.Group(); kn.position.y=-LEG; hp.add(kn); const sn=cap(.052,LEG,mat); sn.position.y=-LEG/2; kn.add(sn);
      const ft=new THREE.Group(); ft.position.y=-LEG+.0; kn.add(ft); const fm=cap(.055,.10,mat); fm.rotation.x=Math.PI/2; fm.position.set(0,-.02,.06); ft.add(fm);
      return {hp,kn,ft}; };
    this.legL=mkLeg(1); this.legR=mkLeg(-1);
    root.traverse(m=>{ if(m.isMesh) m.castShadow=true; });
    if(o.skirt){ const sk=new THREE.Mesh(new THREE.CylinderGeometry(.15,.24,.42,24,1,true),M(o.skirt,{side:THREE.DoubleSide})); sk.position.y=-.2; sk.castShadow=true; hips.add(sk); this.skirt=sk;}
  }
  set(P,t=0){ const p=Object.assign({},POSE0,P); const s=this.s;
    let lL=p.lL.slice(), lR=p.lR.slice(), aL=p.aL.slice(), aR=p.aR.slice(), bob=p.bob||0, lean=p.lean;
    if(p.walk>0.001){ const ph=(p.dist??0)/(.62*s)*Math.PI, w=p.walk, sw=Math.sin(ph);
      lL[0]=lerp(lL[0],sw*26,w); lR[0]=lerp(lR[0],-sw*26,w); lL[1]=lerp(lL[1],Math.max(0,-Math.cos(ph))*38+4,w); lR[1]=lerp(lR[1],Math.max(0,Math.cos(ph))*38+4,w);
      if(!p.holdL) aL[0]=lerp(aL[0],-sw*20+4,w); if(!p.holdR) aR[0]=lerp(aR[0],sw*20+4,w);
      bob+=-Math.abs(Math.cos(ph))*.025*w; lean+=3*w; }
    const br=Math.sin(t*2.1+(p.seed||0)); bob+=br*.004*(1-(p.walk||0));
    this.root.position.set(p.x,0,p.z); this.root.rotation.y=p.yaw*D;
    this.hips.position.y=this.hipH-p.drop/s+bob/s;
    this.torso.rotation.set(lean*D,p.twist*D,p.side*D);
    this.neck.rotation.set((p.tilt*.4+br*.4)*D,p.hyaw*.4*D,0); this.head.rotation.set(p.tilt*.6*D,p.hyaw*.6*D,0);
    const arm=(A,a,sx)=>{A.sh.rotation.set(-a[0]*D,0,sx*a[1]*D); A.el.rotation.set(-a[2]*D,0,0);};
    arm(this.armL,aL,1); arm(this.armR,aR,-1);
    const leg=(L,l)=>{L.hp.rotation.set(-l[0]*D,0,0); L.kn.rotation.set(l[1]*D,0,0); L.ft.rotation.set((-l[1]+l[0])*D*0,0,0);};
    leg(this.legL,lL); leg(this.legR,lR);
    /* face */
    const bl=((t+(p.seed||0)*1.7)%3.9)<.12?1:0, cl=Math.max(p.closed,bl);
    this.eyes.forEach((e,i)=>{ e.scale.y=.046*(1-cl*.9); e.position.x=(i?.068:-.068)+p.look*.012; e.position.y=.015+p.lookY*.012; });
    this.brows.forEach((b,i)=>{ const sx=i?1:-1; b.position.y=.085+p.brow*.01; b.rotation.z=sx*p.brow*-.35; });
    this.smileM.visible=p.smile>.05; this.smileM.scale.set(1,p.smile,1);
  }
  handWorld(side='R'){ const v=new THREE.Vector3(); (side=='R'?this.armR:this.armL).hand.getWorldPosition(v); return v;}
  headWorld(){ const v=new THREE.Vector3(); this.head.getWorldPosition(v); return v;}
}

/* ---------------- keyframes ---------------- */
export function KF(keys){ const out=[]; let prev=Object.assign({},POSE0); for(const k of keys){ const n=Object.assign({},prev,k); out.push(n); prev=n;}
  /* cumulative walk distance */
  return out;}
const mixv=(a,b,e)=>{ if(typeof a==='number'&&typeof b==='number') return a+(b-a)*e; if(Array.isArray(a)&&Array.isArray(b)) return a.map((v,i)=>v+(b[i]-v)*e); return e<.5?a:b; };
export function sample(tr,t){ if(t<=tr[0].t) return Object.assign({},tr[0]);
  for(let i=1;i<tr.length;i++) if(t<tr[i].t){ const a=tr[i-1],b=tr[i]; const p=Pr(t,a.t,b.t); const e=({io:eio,o:eo,i:ei,lin:x=>x})[b.ez||'io'](p); const r={}; for(const k in b) r[k]=mixv(a[k],b[k],e); return r;}
  return Object.assign({},tr[tr.length-1]); }
/* pose with walk distance: integrate |dx,dz| over samples */
export function poseAt(tr,t){ const k=sample(tr,t); let d=0,px=null,pz=null; for(let u=0;u<=t;u+=1/60){const q=sample(tr,u); if(px!==null) d+=Math.hypot(q.x-px,q.z-pz); px=q.x;pz=q.z;} k.dist=d; return k;}

/* ---------------- camera helper ---------------- */
export function camKeys(keys,t){ /* keys: [t,[px,py,pz],[tx,ty,tz],fov] */
  let a=keys[0],b=keys[0],e=0; if(t>=keys[keys.length-1][0]) a=b=keys[keys.length-1]; else for(let i=1;i<keys.length;i++) if(t<keys[i][0]){a=keys[i-1];b=keys[i];e=eio(Pr(t,a[0],b[0]));break;}
  const P=a[1].map((v,i)=>lerp(v,b[1][i],e)), T=a[2].map((v,i)=>lerp(v,b[2][i],e)); const f=lerp(a[3]||32,b[3]||32,e);
  const sh=.004; camera.position.set(P[0]+Math.sin(t*.7)*sh,P[1]+Math.sin(t*.53)*sh,P[2]); camera.fov=f; camera.updateProjectionMatrix(); camera.lookAt(T[0],T[1],T[2]); }
export function toScreen(v){ const p=v.clone().project(camera); return [(p.x*.5+.5)*W,(-p.y*.5+.5)*H, p.z]; }
