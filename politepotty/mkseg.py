import json,math
W=json.load(open('words.json'))
P=[(5,"^Polite^ ^guy^ versus ~potty~ ~mouth.~"),(4,"*Science* picked a *winner.*"),(4,"You *won't* guess it."),
(6,"Test one: hand in *freezing* *water.*"),(7,"Hold it as *long* as you can."),(5,"One says a ^normal^ ^word.^"),
(4,"The other one ~swears.~"),(3,"Test two: *push-ups.*"),(4,"Hold your *body* *weight.*"),(2,"Same *pain.*"),
(4,"Only the *word* changes."),(7,"~Swearing~ flips a *switch* in your brain."),(4,"You stop *holding* *back.*"),
(4,"So who lasted *longer?*"),(3,"%The% %potty% %mouth.%"),(6,"Nearly ~two~ ~minutes~ in ice water,"),
(3,"versus ^seventy-five^ ^seconds.^"),(1,"*Catch:*"),(7,"swear *all* *day,* and it *stops* working."),
(3,"So *save* it."),(4,"Which one are you,"),(5,"^polite^ ^guy,^ or ~potty~ ~mouth?~")]
assert sum(p[0] for p in P)==len(W),(sum(p[0] for p in P),len(W))
seg=[];i=0
for n,txt in P:
  ws=W[i:i+n]; assert len(txt.split())==n,txt
  for a,b in zip(txt.split(),ws): assert a.strip('*~^%').lower()==b[0].lower(),(a,b)
  seg.append([ws[0][1],ws[-1][2],txt,[w[1] for w in ws]]); i+=n
seg[0][0]=0
dur=38.4;N=int(dur*30)+2;amp=[0.0]*N
for w,a,b in W:
  for f in range(int(a*30),int(math.ceil(b*30))):
    t=f/30; x=(t-a)/max(.05,b-a)
    amp[f]=max(amp[f],round(.35+.45*abs(math.sin(x*math.pi*max(1,(b-a)/.16))),2))
open('seg.js','w').write("window.SEG="+json.dumps(seg)+";\nwindow.AMP="+json.dumps(amp)+";\n")
print(len(seg),"ok")
