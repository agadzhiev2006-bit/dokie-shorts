#!/bin/bash
# usage: ./mux_with_voice.sh vo.mp3  -> final.mp4  (vo = ElevenLabs take 1, sped up 5% to match the animation)
ffmpeg -y -i nov_master.mp4 -i "$1" -filter_complex "[1]atempo=1.05[vo];[0:a]volume=1.0[s];[vo][s]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95,apad[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -movflags +faststart -shortest final.mp4
