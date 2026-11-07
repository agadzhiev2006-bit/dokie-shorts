import sys,glob
from PIL import Image, ImageDraw
fs=sorted(glob.glob(sys.argv[1]+'/*.jpg')); out=sys.argv[2]; n=12
for k in range(0,len(fs),n):
    g=Image.new('RGB',(1920,1080)); d=ImageDraw.Draw(g)
    for i,f in enumerate(fs[k:k+n]):
        im=Image.open(f).resize((640,360)); g.paste(im,((i%3)*640,(i//3)*270 if False else (i//3)*270))
    # use 4 rows of 270 -> crop images
    g=Image.new('RGB',(1920,1440)); d=ImageDraw.Draw(g)
    for i,f in enumerate(fs[k:k+n]):
        im=Image.open(f).resize((640,360)); g.paste(im,((i%3)*640,(i//3)*360)); d.text(((i%3)*640+6,(i//3)*360+4),f.split('/')[-1],fill=(255,255,0))
    g.save(f'{out}_{k//n}.jpg',quality=80)
