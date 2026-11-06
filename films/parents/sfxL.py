from sfx_lib import *
for t in [1.4,2.2,3.0,3.8,6.0,6.8,7.6,12.2,12.8,13.4,14.0,14.6,15.2]: add(tick(900,.05),t,0,.25)
add(thud(.4),4.65,0,.6); add(glitch(.3),4.65,0,.2)
add(whoosh(1.0,200,1200,.5),6.8,-.5,.5)   # car arrives
add(ding(1320,1.2),9.0,.3,.25)          # keys sparkle
add(whoosh(1.0,1200,200,.5),11.4,-.5,.5)  # car leaves
add(riser(1.6),15.6,0,.35)
add(whoosh(.7,300,2500,.5),17.1,0,.7); add(thud(.5),17.85,0,.6); add(ding(880,2.0),17.9,0,.35)
add(pop(400,.12),19.1,-.4,.25); add(pop(500,.12),19.9,.4,.25); add(pop(350,.12),20.7,-.6,.25)
save('sfxL.wav')
