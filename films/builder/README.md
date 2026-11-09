# Builder channel engine ("You just invented ..." shorts)

Low-poly 3D builder (orange hard hat, curly hair, beard, grey tee, black cargo pants, orange-sole boots), three.js, rendered frame-by-frame.

- `builder.js` — the character: `makeBuilder(THREE)` + `poseBuilder(b,{la,ra,head,walk,ph,crouch,lean,brow,point,jump})`, arm presets in `ARMS`.
- `pile.html` — pilot "You just invented the pile driver": ground cross-section (mud / hard ground), labels, camera keys, timeline `T` synced to the VO pauses. `?nolabel` hides labels (for covers).
- `preview.html` — character turnaround/poses sheet (`?close` = face close-up).
- `sfx_pile.py` — synthesized SFX (uses films/engine/sfx_lib.py).

Render: serve repo root over http, then `VW=1080 VH=1920 node render.js films/builder/pile.html 52.3 out 2` (needs window.render(t) + window.ready).
Workflow: script -> user's VO (ElevenLabs Nathan) -> silencedetect for sentence starts -> set `T` + hit arrays -> render -> mux VO + SFX.

## Channel look (approved Nov 9 2026)
Every Fixalabs video is finished with the colour grade in `grade.txt` (ffmpeg -vf), the equivalent of CapCut:
contrast +10, saturation +12, warmth +8, highlights -10, shadows +8, sharpen +15, vignette +10..15, grain +5.
Edit style baked into pile.html: no intro (punchy opening move), word captions (keyword orange), punch-zoom on keywords,
3D whip transition (orbit + blur + flash) on each scene change, @FIXALABS watermark.
