import sys,os
sys.path.insert(0,'/home/claude/agadzhiev2006-bit/dokie-shorts/films/engine')
os.environ['SFX_DUR']='52.3'
from sfx_lib import *
import numpy as np
HAND=[7.3,8.1,8.9,9.7,10.5];ROCK=[16.6];FR=[22.9,24.1]
STEAMH=list(np.arange(25.4,30.4,.9));SH=[37.9,39.3,40.0,40.7]
for h in HAND: add(thud(.3),h,0,.6); add(tick(700,.04),h,0,.3)
for h in ROCK+FR: add(thud(.6),h,0,.9); add(whoosh(.35,2000,400,.6),h-.3,0,.2)
for h in STEAMH: add(thud(.4),h,0,.55); add(whoosh(.3,600,2400,.3),h-.2,-.4,.12)
for h in SH: add(thud(.8),h,0,1.0); add(ding(420,.6),h,0,.35); add(zap(.15),h,0,.25)
add(pop(500,.12),0.3,0,.3)
add(glide(300,120,1.6),3.0,.3,.25)
add(whoosh(.6,300,2000,.5),6.1,0,.3)
add(riser(1.0),13.0,0,.12)
for t in [21.7,22.0,22.3]: add(pop(700,.1),t,-.5,.3)
add(whoosh(.6,200,1500,.5),24.4,-.4,.35)
add(glitch(.3),30.6,0,.2); add(tick(300,.05),31.2,0,.4)
add(whoosh(.6,300,2500,.5),32.8,0,.35)
add(riser(2.0),43.0,0,.3); add(whoosh(.8,200,3000,.5),45.0,0,.5); add(ding(1320,1.4),45.4,0,.35); add(ding(1760,1.4),45.6,0,.28)
add(pop(900,.12),48.7,0,.3)
save('/home/claude/builder/sfx_pile.wav')
