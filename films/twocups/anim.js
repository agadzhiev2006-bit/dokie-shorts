/* ===== keyframe animation engine for fig() characters =====
   KF([{t, ...props}, ...]) builds a track; each key inherits unspecified props from the previous key.
   sample(track,t) blends neighbouring keys with easing (default easeInOut), arrays elementwise,
   world arm targets (fW/bW) are converted to joint angles before blending so reaches never snap.
   pose(track,t) adds walk cycle (by distance, no foot sliding), breathing, head follow-through. */
const EZ={io:x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, o:x=>1-Math.pow(1-x,3), i:x=>x*x*x, lin:x=>x,
  back:x=>{const c1=1.4,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);}};
const POSE0={fR:null,bR:null,x:0,y:0,s:1,dir:1,lean:0,tilt:0,hunch:0,bob:0,f:[16,6],b:[-12,-4],lf:[4,-2],lb:[-4,2],brow:.3,walk:0,eyeY:0,fW:null,bW:null,fBend:-1,bBend:-1};
function KF(keys){const out=[]; let prev=Object.assign({},POSE0);
  for(const k of keys){const n=Object.assign({},prev,k); if(k.f) {n.fW=null;n.fR=null;} if(k.b) {n.bW=null;n.bR=null;} if(k.fW) n.fR=null; if(k.bW) n.bR=null; if(k.fR) n.fW=null; if(k.bR) n.bW=null; out.push(n); prev=n;} return out;}
function armAng(k,W,bend){const la=k.lean*D, S=[Math.sin(la)*96, -Math.cos(la)*96+k.bob];
  const loc=[(W[0]-k.x)/(k.s*k.dir),(W[1]-k.y)/k.s]; return ik(S,loc,68,64,bend);}
function resolve(k){const r=Object.assign({},k); if(k.fR) r.fW=[k.x+k.fR[0]*k.dir*k.s, k.y+k.fR[1]*k.s]; if(k.bR) r.bW=[k.x+k.bR[0]*k.dir*k.s, k.y+k.bR[1]*k.s]; k=r; if(k.fW) r.f=armAng(k,k.fW,k.fBend); if(k.bW) r.b=armAng(k,k.bW,k.bBend); return r;}
function mix(a,b,e){const r={}; for(const key in b){const A=a[key],B=b[key];
  if(typeof A==="number"&&typeof B==="number") r[key]=A+(B-A)*e;
  else if(Array.isArray(A)&&Array.isArray(B)) r[key]=A.map((v,i)=>v+(B[i]-v)*e);
  else r[key]=e<.5?A:B;} return r;}
function sample(tr,t){ if(t<=tr[0].t) return resolve(tr[0]);
  for(let i=1;i<tr.length;i++){ if(t<tr[i].t){const a=tr[i-1],b=tr[i]; const p=(t-a.t)/(b.t-a.t); const e=(EZ[b.ez||"io"])(Math.min(1,Math.max(0,p)));
      // dir flips are interpolated through a thin "turn" instead of snapping
      const r=mix(resolve(a),resolve(b),e); return r;} }
  return resolve(tr[tr.length-1]);}
function pose(tr,t,seed=0,o={}){
  const k=sample(tr,t), kl=sample(tr,t-0.09);           /* delayed sample for head follow-through */
  const P=Object.assign({},k);
  P.tilt=lerp(k.tilt,kl.tilt,.55); P.brow=k.brow;
  /* breathing */
  const br=Math.sin(t*2.1+seed); P.bob=(P.bob||0)+br*1.6*(1-k.walk); P.hunch=(P.hunch||0)+br*.8;
  /* walk cycle driven by distance travelled -> no foot sliding */
  if(k.walk>0.001){ const stride=96*k.s, ph=(k.x/stride)*Math.PI + seed, w=k.walk, sw=Math.sin(ph), cw=Math.cos(ph);
    const Lf=[sw*24,-Math.max(0,-sw)*38-6], Lb=[-sw*24,-Math.max(0,sw)*38-6];
    P.lf=P.lf.map((v,i)=>lerp(v,Lf[i],w)); P.lb=P.lb.map((v,i)=>lerp(v,Lb[i],w));
    if(!o.armsFixed){ if(!k.fHold) P.f=P.f.map((v,i)=>lerp(v,[-sw*22+6,-8-Math.max(0,-sw)*14][i],w)); if(!k.bHold) P.b=P.b.map((v,i)=>lerp(v,[sw*22-6,-8-Math.max(0,sw)*14][i],w)); }
    P.bob+= -Math.abs(cw)*7*w*k.s/k.s; P.lean+= 4*w; P.tilt+= Math.sin(ph*2)*1.2*w; }
  /* thin turn: keep |dir| from reaching 0 */
  if(Math.abs(P.dir)<.12) P.dir=P.dir<0?-.12:.12;
  P.blink=(((t+seed*1.7)%3.7)<.11)?1:0;
  delete P.fW; delete P.bW;
  return P;}
