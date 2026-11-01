import json,math
W=json.load(open('words.json'))
# phrases: (word count, styled text)
P=[(4,"~Coffee~ or a ^nap?^"),(4,"*Science* picked a *winner.*"),(6,"And it's *not* who you think."),
(2,"Team ~Coffee:~"),(3,"~caffeine~ *blocks* adenosine,"),(6,"the chemical that makes you *sleepy.*"),
(9,"But it takes about ~twenty~ ~minutes~ to kick in."),(2,"Team ^Nap:^"),(5,"sleep actually *clears* adenosine ^out.^"),
(5,"But sleep past ^twenty^ ^minutes,^"),(5,"and you wake up *groggy.*"),(5,"So in a *driving* study,"),
(6,"researchers pitted them *against* each other."),(3,"~Coffee~ alone? *Better.*"),(3,"^Nap^ alone? *Better.*"),
(4,"But the *winner* was..."),(1,"%both.%"),(3,"Drink the ~coffee.~"),(4,"Then ^nap^ *fifteen* *minutes.*"),
(7,"You wake up right as it *hits.*"),(6,"So... still ~coffee~ or a ^nap?^")]
assert sum(p[0] for p in P)==len(W),(sum(p[0] for p in P),len(W))
seg=[];i=0
for n,txt in P:
  ws=W[i:i+n]; assert len(txt.split())==n,txt
  seg.append([ws[0][1],ws[-1][2],txt,[w[1] for w in ws]]); i+=n
# synthetic amp at 30fps from word spans
dur=38.9;N=int(dur*30)+2;amp=[0.0]*N
for w,a,b in W:
  for f in range(int(a*30),int(math.ceil(b*30))):
    t=f/30; x=(t-a)/max(.05,b-a)
    amp[f]=max(amp[f],round(.35+.45*abs(math.sin(x*math.pi*max(1,(b-a)/.16))),2))
open('seg.js','w').write("window.SEG="+json.dumps(seg)+";\nwindow.AMP="+json.dumps(amp)+";\n")
print(len(seg),"ok")
