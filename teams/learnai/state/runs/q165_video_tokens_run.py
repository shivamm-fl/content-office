# Token counts for a 1 hour video. Per-frame and audio token figures are Gemini API docs figures
# (https://aistudio.google.com/docs/video-understanding): 66 tokens/frame at low media resolution,
# 258 tokens/frame otherwise, audio 32 tokens/s, default sampling 1 frame per second.
# The 30 fps camera rate, the 1 hour length, the 1 frame per 5 s sample and the 30 s zoom at 5 fps are our ASSUMED example.
secs = 3600
cam_fps = 30
low, high, audio = 66, 258, 32
all_frames = secs * cam_fps
print("frames if every frame is sent (30 fps):", all_frames)
print("tokens, every frame at 66/frame:", all_frames * low)
print("tokens, every frame at 258/frame:", all_frames * high)
one_fps = secs * 1
print("frames at 1 fps:", one_fps, "tokens (66/frame) + audio:", one_fps * low + secs * audio, "frames only:", one_fps * low)
every5 = secs // 5
print("sampled 1 frame per 5 s: frames", every5, "tokens (66/frame):", every5 * low)
zoom_frames = 30 * 5
print("zoom 30 s at 5 fps: frames", zoom_frames, "tokens (66/frame):", zoom_frames * low)
print("sampled + zoom total tokens:", every5 * low + zoom_frames * low)
print("every-frame vs sampled+zoom, times bigger (66/frame):", round(all_frames * low / (every5 * low + zoom_frames * low)))
print("1M window, every frame at 66/frame fits:", all_frames * low <= 1_000_000)
print("1M window, sampled+zoom fits:", every5 * low + zoom_frames * low <= 1_000_000)
