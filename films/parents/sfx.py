from sfx_lib import *
for t in [0.0,5.0,8.4,11.8]: add(tick(1500,.06),t,0,.5); add(tick(1100,.06),t+.12,0,.35)
for t in [0.4,2.4,3.9,9.3,10.6,11.9,13.5,15.6]: add(pop(700,.1),t,0,.35)
add(thud(.4),4.3,-.3,.5)            # strict door shut
add(whoosh(.5,300,2000,.5),6.4,-.4,.4) # window
add(whoosh(.4,2000,300,.5),11.9,-.4,.35)
add(zap(.15),13.0,0,.3); add(thud(.5),13.0,0,.5)  # light on
add(thud(.3),4.7,.3,.3); add(thud(.3),8.7,.3,.3)  # chill door
add(ding(880,1.4),17.4,0,.3)
save('sfx.wav')
