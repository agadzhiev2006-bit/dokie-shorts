import numpy as np, json, wave
from scipy.signal import butter, sosfilt, fftconvolve
SR=44100
SH=json.load(open('shots.json')); DUR=SH[-1][1]+0.5; N=int(SR*DUR)
L=np.zeros(N); R=np.zeros(N); rng=np.random.default_rng(7)
def T(i,lt): return SH[i][0]+lt
def add(sig,t,pan=0.0,g=1.0,bus=None):
    i=int(t*SR); n=min(len(sig),N-i)
    if n<=0 or i<0: return
    l=np.cos((pan+1)*np.pi/4)*1.41; r=np.sin((pan+1)*np.pi/4)*1.41
    (bus or (L,R))[0][i:i+n]+=sig[:n]*g*l; (bus or (L,R))[1][i:i+n]+=sig[:n]*g*r
def bp(x,f0,f1,o=2): return sosfilt(butter(o,[f0,f1],'band',fs=SR,output='sos'),x)
def lp(x,f,o=2): return sosfilt(butter(o,f,'low',fs=SR,output='sos'),x)
def hp(x,f,o=2): return sosfilt(butter(o,f,'high',fs=SR,output='sos'),x)
def tt(d): return np.arange(int(d*SR))/SR
def noise(d): return rng.standard_normal(int(d*SR))
def fadeenv(n,a,b):
    e=np.ones(n); A=int(a*SR); B=int(b*SR)
    if A>0: e[:A]=np.linspace(0,1,A)
    if B>0: e[-B:]=np.minimum(e[-B:],np.linspace(1,0,B))
    return e

# ---------------- MUSIC: soft felt piano ----------------
ML=np.zeros(N); MR=np.zeros(N); MB=(ML,MR)
def piano(f,d=4.0,v=1.0):
    t=tt(d); s=np.zeros_like(t)
    for h,a in [(1,1),(2,.42),(3,.18),(4,.08),(5,.04)]:
        s+=a*np.sin(2*np.pi*f*h*t*(1+.0004*h*h))*np.exp(-t*(1.1+h*.7))
    s*= (1-np.exp(-t*400))
    s=lp(s,2600)
    return s*v*.32
NOTE=lambda n: 440*2**((n-69)/12)
def chord(t0,notes,d=4,v=1,arp=0.0,pan=0):
    for k,n in enumerate(notes): add(piano(NOTE(n),d+1.5,v*(.8 if k else 1)),t0+k*arp,pan+(k-1.5)*.15,1,MB)
Am=[45,57,60,64]; F=[41,53,57,60]; C=[48,55,60,64]; G=[43,55,59,62]; Em=[40,55,59,64]; Dm=[38,53,57,62]
prog1=[Am,F,C,G]; prog2=[F,C,G,Am]
def section(t0,t1,prog,bar=4.0,v=.8,arp=.35,mel=None):
    t=t0; k=0
    while t<t1-.5:
        ch=prog[k%len(prog)]; chord(t,ch,bar,v,arp)
        if mel:
            for (o,n,vv) in mel[k%len(mel)]:
                if t+o<t1: add(piano(NOTE(n),2.5,vv*v),t+o,.2,1,MB)
        t+=bar; k+=1
mel1=[[(0.0,72,.55),(1.5,71,.4),(2.5,69,.45)],[(0.0,69,.5),(2.0,72,.4)],[(0.0,67,.5),(1.5,72,.45),(3.0,71,.35)],[(0.0,71,.45),(2.0,74,.4)]]
mel2=[[(0.0,72,.5),(1.0,74,.4),(2.0,76,.55)],[(0.0,76,.5),(2.0,74,.4)],[(0.0,74,.5),(1.0,72,.4),(2.5,71,.4)],[(0.0,72,.55),(2.0,69,.4)]]
section(5.0,64.0,prog1,4.0,.75,.45,mel1)
section(70.7,105.0,prog1,3.2,.65,.3,mel1)
# dark ch3: sparse low notes
for k,tt0 in enumerate(np.arange(111.5,148.0,4.0)):
    add(piano(NOTE([45,41,43,40][k%4]),5,.7),tt0,0,1,MB); add(piano(NOTE([64,65,62,64][k%4]),4,.3),tt0+2,.2,1,MB)
# pad drone for ch3
pd=tt(36.0); pad=(np.sin(2*np.pi*NOTE(45)*pd)+.5*np.sin(2*np.pi*NOTE(52)*pd)+.3*np.sin(2*np.pi*NOTE(57)*pd*1.002))*.05*fadeenv(len(pd),4,6)
add(pad,111.5,0,1,MB)
section(167.0,176.0,[Am,F],4.5,.55,.6,None)
section(184.6,215.0,prog2,4.0,.85,.3,mel2)
chord(215.1,[48,55,60,64,67],7,.8,.25); chord(220.6,[41,53,57,60,64],7,.7,.35)
# reverb on music
ir_t=tt(2.6); ir=noise(2.6)*np.exp(-ir_t*2.4); ir=lp(ir,5000); ir/=np.abs(ir).sum()**.5*8
ML=ML+fftconvolve(ML,ir)[:N]*.9; MR=MR+fftconvolve(MR,ir[::-1].copy())[:N]*.9
# music ducking/dropouts: silence in discovery
mg=np.ones(N)
def mute(a,b,fa=1.0,fb=1.5):
    i0=int((a-fa)*SR); i1=int(a*SR); i2=int(b*SR); i3=int((b+fb)*SR)
    mg[i0:i1]=np.minimum(mg[i0:i1],np.linspace(1,0,i1-i0)); mg[i1:i2]=0; mg[i2:i3]=np.minimum(mg[i2:i3],np.linspace(0,1,i3-i2))
mute(149.5,166.0,1.5,1.0)
L+=ML*mg*.9; R+=MR*mg*.9

# ---------------- SFX ----------------
def clockTicks(a,b,g=.05,pan=.6):
    t=a
    while t<b:
        s=hp(noise(.03),2500)*np.exp(-tt(.03)*200); add(s,t,pan,g); t+=1.0
def roomTone(a,b,g=.015,warm=1):
    s=lp(noise(b-a),300 if warm else 600)*fadeenv(int((b-a)*SR),.3,.3); add(s,a,0,g*8)
def buzz(t0,d=.6,g=.18):
    t=tt(d); s=np.sin(2*np.pi*170*t)*(np.sin(2*np.pi*22*t)>0)*np.exp(-0*t); s=lp(s,500)*fadeenv(len(t),.01,.05); add(s,t0,.3,g)
def keyTap(t0,g=.06): s=hp(noise(.025),1800)*np.exp(-tt(.025)*260); add(s,t0,.1,g)
def typing(t0,t1,cps):
    k=0
    while t0+k/cps<t1: keyTap(t0+k/cps+rng.uniform(-.01,.01),.05+rng.uniform(0,.02)); k+=1
def sendSwoosh(t0,g=.12):
    t=tt(.35); f=600+2200*t/.35; s=np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*t/.35)**2; add(lp(s,3000),t0,.2,g)
def recvDing(t0,g=.12):
    t=tt(.8); s=(np.sin(2*np.pi*1046*t)*np.exp(-t*6)+.7*np.sin(2*np.pi*1318*t)*np.exp(-(t)*6)*(t>.12)); add(s,t0,0,g)
def paperFlip(t0,g=.12): s=bp(noise(.35),1500,7000)*np.sin(np.pi*tt(.35)/.35)**1.5; add(s,t0,.2,g)
def knock(t0,g=.5): t=tt(.25); s=np.sin(2*np.pi*(90+60*np.exp(-t*30))*t)*np.exp(-t*22)+lp(noise(.25),900)*np.exp(-t*60)*.5; add(s,t0,.1,g)
def creak(t0,d=1.2,g=.10): t=tt(d); f=180+60*np.sin(t*7)+t*40; s=np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*.4; s=bp(s,300,1800)*np.sin(np.pi*t/d); add(s,t0,.3,g)
def step(t0,snow=0,g=.12):
    if snow: s=bp(noise(.18),600,4000)*np.exp(-tt(.18)*18)
    else: s=lp(noise(.12),700)*np.exp(-tt(.12)*35)
    add(s,t0,rng.uniform(-.2,.2),g)
def clink(t0,g=.12): t=tt(.6); s=(np.sin(2*np.pi*2200*t)+.6*np.sin(2*np.pi*3410*t))*np.exp(-t*12); add(s,t0,0,g)
def mugSet(t0,g=.2): t=tt(.2); s=lp(noise(.2),1400)*np.exp(-t*40)+np.sin(2*np.pi*700*t)*np.exp(-t*30)*.3; add(s,t0,0,g)
def wind(a,b,g=.06): s=bp(noise(b-a),200,1200)*(0.6+0.4*np.sin(2*np.pi*.15*tt(b-a)))*fadeenv(int((b-a)*SR),.6,.6); add(s,a,0,g*4)
def gameBleeps(a,b,g=.02):
    t=a
    while t<b:
        f=rng.choice([440,523,659,784,880]); d=.09; s=np.sign(np.sin(2*np.pi*f*tt(d)))*fadeenv(int(d*SR),.005,.03); add(lp(s,1200),t,.6,g); t+=rng.uniform(.12,.4)

# ch1
roomTone(5,64.2,.012); clockTicks(5.3,18,.05)
mugSet(T(1,1.0),.22)
for k in range(9): step(T(1,2.9+k*.33),0,.06)
clockTicks(18,22.5,.03); clockTicks(T(3,0.2),T(3,3.2),.16,0)   # clock close loud
clockTicks(T(4,0.1),T(4,6),.06)
roomTone(T(5,0),T(5,7.5),.01,0); gameBleeps(T(5,0),T(5,4.6),.025)
buzz(T(5,2.0)); buzz(T(5,3.3),.5)
roomTone(T(6,0),T(6,8),.008,0); typing(T(6,2.2),T(6,4.7),11); sendSwoosh(T(6,5.0))
recvDing(T(7,.6)); typing(T(7,2.6),T(7,6.2),5); sendSwoosh(T(7,6.7))
clockTicks(T(8,0),T(8,8.5),.06)
# montage
paperFlip(T(10,.75)); mugSet(T(11,.1),.12)
typing(T(12,1.0),T(12,2.0),12); sendSwoosh(T(12,2.3))
typing(T(13,.7),T(13,1.9),4); sendSwoosh(T(13,2.1))
paperFlip(T(14,.75)); mugSet(T(15,1.5),.12)
recvDing(T(16,-.2),.08)
paperFlip(T(17,.75))
clockTicks(T(18,0),T(19,5),.07)
# ch3
roomTone(T(21,0),T(23,5),.01,0); gameBleeps(T(21,0),T(21,5.6),.025)
pause=np.sin(2*np.pi*660*tt(.12))*np.exp(-tt(.12)*20); add(pause,T(21,5.6),.6,.08)
add(lp(noise(.05),800)*np.exp(-tt(.05)*80),T(22,2.0),0,.08)  # unlock
for k in range(9): step(T(23,2.0+k*.33),0,.08)
wind(T(24,0),T(25,7),.05)
for k in range(17): step(T(24,.15+k*.37),1,.10)
for k in range(3): step(T(25,.8+k*.33),1,.08)
for k,kt in enumerate([2.1,2.45,2.8]): knock(T(25,kt),.45)
creak(T(25,5.3),1.3,.08)
creak(T(26,.8),1.4,.06); wind(T(26,.8),T(26,4.0),.03)
for k in range(7): step(T(26,3.9+k*.32),0,.06)
roomTone(T(26,0),T(28,9),.012); clockTicks(T(26,0),T(28,9),.08)
# ch4
gas=np.concatenate([hp(noise(.02),2000)*.8 for _ in range(1)]);
for k in range(4): add(hp(noise(.02),2500)*np.exp(-tt(.02)*150),T(29,.95+k*.09),-.2,.25)
fl=lp(noise(3.8),900)*np.minimum(1,tt(3.8)*3); add(fl,T(29,1.3),-.2,.05)
bo=bp(noise(2.8),200,1800)*(tt(2.8)/2.8)**2; add(bo,T(29,2.2),-.2,.12)
creak(T(30,.2),.7,.06); clink(T(30,2.0),.10)
mugSet(T(31,.1),.15)
clockTicks(T(32,0),T(32,11),.05)
for k,tp in enumerate([.45,2.5,4.1]): keyTap(T(33,tp),.08)
recvDing(T(33,4.2),.10)
roomTone(T(34,0),T(34,9),.01)
# master
mix=np.stack([L,R],1)
mix=mix/max(1e-9,np.abs(mix).max())*.85
w=wave.open('twocups.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype(np.int16).tobytes()); w.close()
print('ok',DUR)
