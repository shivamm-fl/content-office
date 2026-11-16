# EXAMPLE, assumed video: 1 hour, 30 fps, 66 tokens per frame (Gemini docs, low media resolution)
T=66; secs=3600; fps=30
every=secs*fps; print("every frame", every, every*T, "x window", round(every*T/1_000_000,2))
samp=secs//5; print("1 per 5 s", samp, samp*T)
zoom=30*5; print("30 s zoom at 5 fps", zoom, zoom*T)
tot=samp*T+zoom*T; print("total", tot, "smaller by", round(every*T/tot,1))
