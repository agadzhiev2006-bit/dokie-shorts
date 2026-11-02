import numpy as np, wave
import os
SR=48000; DUR=float(os.environ.get('SFX_DUR','60.6')); N=int(SR*DUR)
L=np.zeros(N); R=np.zeros(N)
rng=np.random.default_rng(3)
def add(sig,t,pan=0.0,g=1.0):
    i=int(t*SR); n=min(len(sig),N-i)
    if n<=0: return
    l=np.cos((pan+1)*np.pi/4); r=np.sin((pan+1)*np.pi/4)
    L[i:i+n]+=sig[:n]*g*l*1.41; R[i:i+n]+=sig[:n]*g*r*1.41
def env(n,a,d):
    e=np.ones(n); A=int(a*n); e[:A]=np.linspace(0,1,A) if A>0 else 1
    e[A:]=np.exp(-np.linspace(0,d,n-A)); return e
def bp_noise(n,f0,f1,q=6):
    # jednoduchý pásmový šum: filtr 2. řádu s měnící se frekvencí
    x=rng.standard_normal(n); y=np.zeros(n); y1=y2=0.0; x1=x2=0.0
    fs=np.geomspace(f0,f1,n)
    for k in range(n):
        w=2*np.pi*fs[k]/SR; al=np.sin(w)/(2*q); c=np.cos(w)
        b0=al; a0=1+al; a1=-2*c; a2=1-al
        v=(b0*x[k]-b0*x2-a1*y1-a2*y2)/a0
        x2=x1; x1=x[k]; y2=y1; y1=v; y[k]=v
    return y/ (np.abs(y).max()+1e-9)
def whoosh(dur=0.55,f0=300,f1=3500,peak=.55):
    n=int(dur*SR); s=bp_noise(n,f0,f1,q=2.5)
    t=np.linspace(0,1,n); e=np.where(t<peak,(t/peak)**2,np.exp(-(t-peak)*9))
    return s*e
def tick(f=1800,dur=.05):
    n=int(dur*SR); t=np.arange(n)/SR
    return np.sin(2*np.pi*f*t)*np.exp(-t*90)
def pop(f=900,dur=.12):
    n=int(dur*SR); t=np.arange(n)/SR; fr=f*(1+1.2*np.exp(-t*60))
    return np.sin(2*np.pi*np.cumsum(fr)/SR)*np.exp(-t*30)
def thud(dur=.45):
    n=int(dur*SR); t=np.arange(n)/SR; fr=110*np.exp(-t*7)+42
    body=np.sin(2*np.pi*np.cumsum(fr)/SR)*np.exp(-t*9)
    click=rng.standard_normal(n)*np.exp(-t*120)*.35
    return body+click
def ding(f=1320,dur=.9):
    n=int(dur*SR); t=np.arange(n)/SR
    return (np.sin(2*np.pi*f*t)+.4*np.sin(2*np.pi*f*2.01*t)+.2*np.sin(2*np.pi*f*3.02*t))*np.exp(-t*5)
def riser(dur=2.9):
    n=int(dur*SR); t=np.arange(n)/SR; fr=180*np.exp(np.log(1200/180)*t/dur)
    s=np.sin(2*np.pi*np.cumsum(fr)/SR)*.6+bp_noise(n,400,6000,q=1.5)*.4
    return s*(t/dur)**2.2
def glitch(dur=.4):
    n=int(dur*SR); s=np.zeros(n); k=0
    while k<n:
        m=int(rng.uniform(.015,.05)*SR); seg=np.sign(rng.standard_normal(min(m,n-k)))*rng.uniform(.3,1)
        if rng.random()<.5: seg=np.sin(2*np.pi*rng.uniform(200,2000)*np.arange(len(seg))/SR)*np.sign(np.sin(np.arange(len(seg))/7))
        s[k:k+len(seg)]=seg*(rng.random()>.25); k+=m
    return s*np.linspace(1,.3,n)
def swish(dur=.25): return whoosh(dur,1500,6000,.35)


def glide(f0,f1,dur):
    n=int(dur*SR); t=np.arange(n)/SR; fr=np.geomspace(f0,f1,n)
    return np.sin(2*np.pi*np.cumsum(fr)/SR)*np.sin(np.linspace(0,np.pi,n))
def zap(dur=.25):
    n=int(dur*SR); t=np.arange(n)/SR
    return (rng.standard_normal(n)*.5+np.sign(np.sin(2*np.pi*90*t)))*np.exp(-t*14)

def save(path='sfx.wav'):
    mix=np.stack([L,R],1); mix=mix/max(1.0,np.abs(mix).max()/0.9)
    w=wave.open(path,'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix*32767).astype(np.int16).tobytes()); w.close()
