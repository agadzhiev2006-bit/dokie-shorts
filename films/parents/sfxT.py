from sfx_lib import *
for t in [0.7,6.6,12.2]: add(thud(.25),t,.4,.25)      # door
for t in [2.4,8.3,14.5]: add(pop(420,.12),t,0,.3)      # "later"
add(thud(.2),4.2,0,.3); add(thud(.15),4.35,0,.15)       # ball drop
add(thud(.2),15.45,0,.3)
for t in [6.0,11.6,17.0]: add(whoosh(.6,1800,200,.4),t-.3,0,.35)
add(thud(.4),21.3,.5,.5)                               # door closes - he left
add(riser(2.5),24.5,0,.15)
add(ding(523,3.0),27.0,0,.25)
save('sfxT.wav')
