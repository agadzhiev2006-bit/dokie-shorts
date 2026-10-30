from sfx_lib import *
import numpy as np
def ks(f,dur=1.6,damp=.996):
    n=int(dur*SR); p=int(SR/f); buf=rng.uniform(-1,1,p); out=np.zeros(n)
    for i in range(n):
        out[i]=buf[i%p]; buf[i%p]=damp*.5*(buf[i%p]+buf[(i+1)%p])
    return out
def chord(fs,spread=.018,dur=1.8):
    n=int(dur*SR); s=np.zeros(n)
    for j,f in enumerate(fs):
        k=ks(f,dur); o=int(j*spread*SR); s[o:]+=k[:n-o]
    return s/len(fs)*2.2
C=chord([130.8,164.8,196,261.6,329.6]); G=chord([98,123.5,146.8,196,246.9,392]); Am=chord([110,164.8,220,261.6,329.6]); F=chord([87.3,130.8,174.6,220,261.6,349.2])
BAD=chord([130.8,171,196,251,329.6,355],spread=.03)
def buzz(dur=.5):
    n=int(dur*SR); t=np.arange(n)/SR; return np.sign(np.sin(2*np.pi*150*t))*.4*np.sin(2*np.pi*t*8)**2
def beep(f=2200,dur=.12):
    n=int(dur*SR); t=np.arange(n)/SR; return np.sign(np.sin(2*np.pi*f*t))*.25*np.minimum(1,(dur-t)*80)
def ring(dur=.8):
    n=int(dur*SR); t=np.arange(n)/SR; return (np.sin(2*np.pi*880*t)+np.sin(2*np.pi*1100*t))*.25*(np.sin(2*np.pi*t*12)>0)
def slap(): return bp_noise(int(.08*SR),1500,600,q=1.2)*np.exp(-np.arange(int(.08*SR))/SR*60)
def key(): return tick(2600+rng.uniform(-400,400),.03)*.6+bp_noise(int(.03*SR),3000,2000,q=2)*.2
def snap():
    n=int(.9*SR); t=np.arange(n)/SR; fr=900*np.exp(-t*4)+120
    return np.sin(2*np.pi*np.cumsum(fr)/SR)*np.exp(-t*4)*.8
# hook
add(thud(),0,g=.9); add(ding(330,2.5),0.05,g=.25)
# rewinds
for a,b in [(6.6,9.6),(101.8,103.0)]:
    add(glide(1400,200,b-a),a,g=.35)
    for x in np.arange(a,b,.35): add(glitch(.3),x,g=.25)
add(whoosh(),9.5,g=.5)
for x in np.arange(10.6,17.4,.28): add(swish(.12),x,pan=.3,g=.12)
add(whoosh(),18.9,g=.4)
for x in np.arange(19.5,29,1.0): add(tick(1200,.04),x,pan=-.4,g=.12)
for x in np.arange(21.4,23.6,.6): add(buzz(.4),x,pan=.3,g=.5)
add(pop(700),24.8,g=.4); add(slap(),27,g=.8)
# alarm
for k in range(3):
    c=29.3+k*2.2
    for x in np.arange(c,c+1.5,.25): add(beep(),x,g=.35)
    add(tick(900,.06),c+1.5,g=.6)
add(ding(220,1.2),35.9,g=.45)
# montage 1
for x in np.arange(37,52,1/3.2): add(swish(.1),x,g=.08)
for x in np.arange(37,52,1/1.6): add(slap(),x,pan=.2,g=.35)
# dad
for x in np.arange(52,56.3,1.2): add(ring(.8),x,g=.45)
add(tick(900,.06),56.3,g=.6); add(glide(600,250,.35),56.4,g=.4)
for i in range(6): add(pop(500),57.5+i*.66,g=.3)
# years
for x in np.arange(62,76,1/6): add(swish(.06),x,g=.05)
for x in np.arange(62,76,.25): add(slap(),x,pan=.3,g=.18)
add(riser(4),71.5,g=.3)
# guitar snap
add(whoosh(),75.9,g=.4); add(snap(),83,g=.9); add(zap(),83,g=.3); add(thud(),84.2,g=.6)
# typing
for a,b,n in [(88.6,91.4,21),(93,96.4,29),(153.4,156,36)]:
    for i in range(n): add(key(),a+(b-a)*i/n,g=.5)
add(ding(660,1.5),96.6,g=.3)
add(riser(1.8),100.2,g=.35); add(ding(990,1.2),102.6,g=.35)
# choice
add(thud(.25),107.5,g=.5); add(whoosh(.4),109.2,g=.35)
add(BAD,110.7,g=.7); add(snap()[:int(.3*SR)]*.4,111.2,g=.5)
for i,x in enumerate([113,113.8,114.6]): add([C,G,Am][i],x,g=.5)
add(bp_noise(int(.35*SR),3000,800,q=1),115.6,g=.5); add(pop(1100),116.6,g=.5); add(ding(1320,1.5),117.4,g=.35)
# run
add(whoosh(),119.9,g=.4)
for x in np.arange(120,127,np.pi/9): add(thud(.15),x,g=.25)
# call dad
for x in np.arange(127.1,129.3,1.1): add(ring(.8),x,g=.45)
add(tick(900,.06),129.3,g=.6); add(ding(880,1.5),129.45,g=.35)
for i in range(6): add(pop(1200+i*80),129.6+i*.5,g=.2)
# playing well
prog=[C,G,Am,F]
for i,x in enumerate(np.arange(135.2,145,.8)): add(prog[i%4],x,pan=-.1,g=.55)
for i,x in enumerate(np.arange(145.1,153,1.0)): add(prog[i%4],x,g=.45)
add(ding(660,2),157,g=.35); add(ding(990,2),161.2,g=.25)
save('sfx.wav')
