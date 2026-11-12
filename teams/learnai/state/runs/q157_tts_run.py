# EXAMPLE numbers (assumed, not measured): why streaming matters for a voice bot.
words = 120; words_per_s = 2.5
speech_s = words / words_per_s
whole_file_wait = 6.0      # assumed: wait until the whole reply is generated
first_chunk_wait = 0.8     # assumed: wait until the first chunk is ready
print("reply words:", words, "speech length s:", speech_s)
print("silence before sound, whole file:", whole_file_wait, "s")
print("silence before sound, streaming:", first_chunk_wait, "s")
print("silence saved:", round(whole_file_wait - first_chunk_wait, 1), "s")
