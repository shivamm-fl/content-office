# EXAMPLE (invented sizes): one lead agent researches 3 topics. Words stand in for tokens.
topics={"pricing":3000,"reviews":4000,"rivals":5000}   # pages read per topic
summary=200                                            # each subagent returns a short note
shared=sum(topics.values())
print("ONE SHARED CONTEXT: lead carries everything =",shared,"words")
for t,n in topics.items(): print(f"SUBAGENT {t}: own context {n} words, returns {summary}")
print("LEAD with separate contexts: sees",summary*len(topics),"words")
print("total work done (sum of all contexts + lead):",shared+summary*len(topics),"words (more than shared:",shared,")")
