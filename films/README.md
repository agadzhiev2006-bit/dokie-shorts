# Films & shorts engine

## films/tomorrow — "There Is No Tomorrow" mini-film (Last Soul style)
- film.html: 1920x1080 page, layers #cam > svg#sv (g#w), #vig, #grain, svg#ov (text), svg#vhs, #fade, #flash; loads man.js, rig.js, props.js, scenes.js
- scenes.js: SC=[a,b,fn,[cx,cy,z0,z1]] scenes, DUR, camera clamp cx=clamp(c0,960/z,1920-960/z); room(), seated(), standing(), guitar(), phoneBig(), note(), ageFX(), cap() (window.NOCAP), typeT(), hud(); VHS rewind windows REW
- render16.js: Playwright frames fr/%05d.jpg, 3 workers; sfx.py (Karplus-Strong chords, alarm, keys) -> sfx.wav
- mux: ffmpeg frames + sfx + watermark overlay top-right
- thumb2.js / teaser.js: thumbnail and 9:16 teaser

## films/engine — Dokie shorts (colour style)
- pay.html: "Same paycheck" short (colour bg, Dokie via man.js manSVG, captions bottom, BEATS punch zoom/shake, whip transitions)
- ai2.html + sc_ai.js: "Is it easy to get rich with AI" short (same helpers, scenes in sc_ai.js)
- render.js: `NODE_PATH=$(npm root -g) node render.js /abs/page.html <dur> /abs/frames` (1080x1920, 30fps)
- sfx_lib.py: `SFX_DUR=<s> python3 x.py`, whoosh/tick/pop/thud/ding/riser/glitch/glide/zap/swish, save()
- wm.png / wm_light.png: @DokieExplains watermark (full-frame overlay)
