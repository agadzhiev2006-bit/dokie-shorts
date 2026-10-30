import os, sys
os.environ['SFX_DUR']='300'
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tomorrow'))
from sfx_lib import *
import numpy as np

def ks(f,dur=2.4,damp=.997):
    n=int(dur*SR); p=int(SR/f); buf=rng.uniform(-1,1,p); out=np.zeros(n)
    for i in range(n):
        out[i]=buf[i%p]; buf[i%p]=damp*.5*(buf[i%p]+buf[(i+1)%p])
    return out
def chord(fs,spread=.04,dur=2.6):
    n=int(dur*SR); s=np.zeros(n)
    for j,f in enumerate(fs):
        k=ks(f,dur); o=int(j*spread*SR); s[o:]+=k[:n-o]
    return s/len(fs)*2.0
def beep(f=2400,dur=.11):
    n=int(dur*SR); t=np.arange(n)/SR; return np.sign(np.sin(2*np.pi*f*t))*.22*np.minimum(1,(dur-t)*80)
def slap(): n=int(.08*SR); return bp_noise(n,1500,600,q=1.2)*np.exp(-np.arange(n)/SR*60)
def step(g=1.0): n=int(.09*SR); t=np.arange(n)/SR; return (np.sin(2*np.pi*90*t)*.8+rng.standard_normal(n)*.25)*np.exp(-t*45)*g
def key(): return tick(2600+rng.uniform(-400,400),.03)*.6
def boom(dur=2.2):
    n=int(dur*SR); t=np.arange(n)/SR; fr=60*np.exp(-t*.8)+28
    return np.sin(2*np.pi*np.cumsum(fr)/SR)*np.exp(-t*1.8)+rng.standard_normal(n)*np.exp(-t*30)*.2
def heart(): return thud(.3)*.8
def breath(dur=.6): n=int(dur*SR); return bp_noise(n,600,1400,q=1.2)*np.sin(np.linspace(0,np.pi,n))**2
def clockt(hi=1): return tick(3400 if hi else 2900,.025)*.9

Am=chord([110,164.8,220,261.6,329.6]); F=chord([87.3,130.8,174.6,220,261.6]); C=chord([130.8,164.8,196,261.6,329.6]); G=chord([98,123.5,146.8,196,246.9])
Em=chord([82.4,123.5,164.8,196,246.9]); Dm=chord([73.4,110,146.8,174.6,220])
def alarm(a,b,g=.4):
    x=a
    while x<b:
        for k in range(4): add(beep(),x+k*.13,g=g)
        x+=.9

# ===== HOOK 0-10.6 =====
alarm(0,1.0,.45); add(slap(),1.05,g=.9); add(thud(.25),1.05,g=.4)
add(swish(),2.0,g=.4); add(pop(600),2.6,g=.35)
add(whoosh(.3),4.0,g=.35); add(glitch(.25),4.6,g=.35); add(glitch(.25),5.3,g=.35)
for i,x in enumerate(np.arange(6,8,1/7)): add(swish(.08),x,pan=(-1)**i*.3,g=.18); add(clockt(),x,g=.3+.3*(x-6)/2)
for x in [6,6.5,7,7.5]: add(thud(.3),x,g=.55)
add(riser(1.9),6.05,g=.25)
for i in range(29): add(key(),8.1+.8*i/29,g=.5)
add(boom(),9.4,g=.9); add(ding(220,2.5),9.45,g=.2)
# ===== 1 MORNING =====
alarm(10.8,13.1,.35); add(slap(),13.1,g=.8)
for x in np.arange(13.6,16,1): add(clockt(),x,g=.15)
add(beep(2400,.3),16.1,g=.25); add(slap(),17.5,g=.8); add(beep(2400,.3),18.1,g=.25); add(slap(),19.5,g=.8)
add(glitch(.3),20,g=.35); add(boom(1.6),20,g=.6); add(chord([130.8,138.6,196,277.2]),20.05,g=.35)
for x in np.arange(20.4,24,.5): add(heart(),x,g=.4)
add(thud(),24.6,g=.7); add(whoosh(.4),24.5,g=.4)
for x in np.arange(24.8,31.8,.24): add(step(),x,pan=np.sin(x)*.5,g=.35)
add(whoosh(),31.9,g=.45)
for x in np.arange(32.1,40,.36): add(step(),x,g=.3)
for x in np.arange(40.2,50,.7): add(step(.8),x,g=.25)
add(Am,42,g=.25)
# ===== 2 DAY =====
for x in np.arange(50,58,1): add(clockt(int(x)%2),x,g=.2)
add(pop(500),59.1,g=.35)
for i,x in enumerate(np.arange(60,66,.5)):
    for j in range(1+i//3): add(clockt(),x+j*.08,g=.18)
for i,x in enumerate(np.arange(66.4,75,1.15)): add(swish(.15),x,g=.25); add(pop(1000+i*30,.08),x+.3,g=.12)
add(thud(.3),75.2,g=.2)
for x in np.arange(79,80.6,.4): add(step(),x,g=.3)
add(thud(),80.9,g=.6); add(pop(700),82,g=.2)
for x in np.arange(84,95,1): add(clockt(int(x)%2),x,g=.18)
add(bp_noise(int(.5*SR),3000,900,q=1)*np.linspace(1,0,int(.5*SR)),86.5,g=.25)
add(whoosh(.8,800,200),90.5,g=.2); add(tick(500,.08),92.5,g=.5)
# ===== 3 NIGHT =====
add(Am,95.2,g=.2)
for x in np.arange(95,108,1): add(clockt(int(x)%2),x,g=.22)
for x in [99,101.3,103.1,105.6]: add(tick(2200,.02),x,g=.15)
for x in [108,110.5,113]: add(glitch(.3),x,g=.4); add(boom(1.4),x,g=.45)
add(ding(880,1.2),119.6,g=.35); add(swish(.2),123.4,g=.4)
for x in np.arange(126,134,1): add(clockt(int(x)%2),x,g=.28)
add(F,128,g=.22)
add(ding(330,2.5),134.6,g=.2)
# ===== 4 LOOP =====
sp=lambda t:1.2-(t-140)/22*.7
x=140
while x<161.5: add(swish(.1),x,g=.22); add(thud(.2),x,g=.25); x+=sp(x)
for x in np.arange(140,162,.5): add(clockt(),x,g=.18+.2*(x-140)/22)
for i,x in enumerate([140.5,148,155]): add([Am,F,Em][i],x,g=.3)
add(pop(900),163,g=.45)
for x in np.arange(165.5,168.4,.18): add(key(),x,g=.25)
for x in np.arange(170,175,1): add(clockt(int(x)%2),x,g=.5)
for x in np.arange(170.3,175,.85): add(heart(),x,g=.4)
# ===== 5 OLD MAN =====
for x in np.arange(175.3,180.6,.55): add(step(.7),x,g=.25)
add(thud(.3),181,g=.4)
for i,x in enumerate(np.arange(184,213,3.0)): add([Am,F,C,G][i%4],x,pan=-.1,g=.32)
add(boom(3),199.6,g=.25)
add(thud(.25),214.2,g=.3)
for x in np.arange(215.3,219.6,.7): add(step(.6),x,g=.2); add(tick(1100,.04),x+.35,g=.2)
add(tick(1500,.05),218.2,g=.6); add(whoosh(1.0,200,1200),219.2,g=.3)
# ===== 6 CHANGE =====
for i,x in enumerate(np.arange(220,270,2.0)): add([C,G,Am,F][i%4],x,pan=.1,g=.4)
for x in np.arange(220.2,225.6,.3): add(step(),x,g=.3)
for x in np.arange(225.7,228,.75): add(breath(),x,g=.35)
for x in np.arange(228.1,230,.3): add(step(),x,g=.3)
for x in np.arange(230,231.4,.35): add(step(),x,g=.25)
add(tick(1200,.05),231.9,g=.4); add(thud(),234.5,g=.7)
add(pop(800),238.6,g=.45)
for x in np.arange(242.4,247.4,1/6): add(clockt(),x,g=.22)
add(ding(1320,1.8),247.4,g=.5); add(ding(1980,1.4),247.45,g=.25)
for x in np.arange(247.6,252,.11): add(key(),x,g=.35)
for x in [252,255.34,258.68]: add(whoosh(.45),x-.2,g=.4)
for x in np.arange(252.2,255.3,.28): add(step(),x,g=.3)
add(riser(2.8),255.6,g=.25); add(ding(1568,1.6),258.95,g=.5); add(ding(2093,1.2),259.1,g=.3)
for x in np.arange(262,263.6,.4): add(step(.8),x,g=.25)
# ===== 7 FINAL =====
alarm(270.2,280.4,.33)
for x in np.arange(276,279.2,.8): add(heart(),x,g=.45)
add(riser(2.2),279.8,g=.35); add(thud(),281.2,g=.5)
add(C,281.5,g=.55); add(chord([196,261.6,329.6,392,523.3]),282.6,g=.5)
add(boom(3),285,g=.8); add(ding(523.3,3),285.05,g=.25)
for i in range(29): add(key(),292.5+2.5*i/29,g=.5)
add(chord([130.8,196,261.6,329.6,392]),295.5,g=.4)
save(sys.argv[1] if len(sys.argv)>1 else 'sfx.wav')
