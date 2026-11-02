from sfx_lib import *
o=-0.3
TIMES=[4.0,6.8,7.7,8.5,9.2,9.8,10.35,10.85,11.3,11.75,12.2]
pl=lambda i:6.35 if i==0 else TIMES[i]+.78
add(thud(.9),0.0,0,.9); add(riser(2.0),0.0,0,.15)
add(glitch(.7),2.0,0,.35); add(whoosh(.7,4000,200,.3),2.0,0,.5); add(thud(.5),2.7,0,.6)
for i,t in enumerate(TIMES):
    add(swish(.3),t+o-.05,-.5,.5)
    if i==0: add(thud(.35),4.6+o,.3,.55); add(tick(700,.06),4.75+o,.3,.3)
    else: add(pop(500,.1),t+.55+o,.4,.35)
    add(thud(.4),pl(i)+o,.3,.7); add(tick(1200,.05),pl(i)+o,.3,.2)
add(riser(1.4),12.6+o,-.3,.35)
add(whoosh(.8,200,2000,.5),13.6+o,-.3,.7)
add(thud(.6),14.45+o,.3,.9)
add(thud(1.0),15.15+o,0,1.0); add(zap(.3),15.15+o,0,.3); add(ding(660,1.6),15.2+o,0,.35)
add(swish(.25),17.4+o,0,.4); add(swish(.25),19.1+o,0,.4)
add(ding(990,1.5),20.1+o,0,.3)
save('sfx.wav')
