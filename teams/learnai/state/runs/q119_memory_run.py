# EXAMPLE (invented): a chatbot with no memory design resends the whole history each turn.
turn_words=25   # assumed words per user+bot turn
facts=["name Riya","vegetarian","prefers Hindi"]  # what is worth remembering
sent=0
for t in range(1,31):
    sent+=turn_words*t   # turn t resends t turns
    if t in (1,10,20,30): print("turn",t,"words sent this turn",turn_words*t,"cumulative",sent)
mem_words=sum(len(f.split()) for f in facts)
print("with memory: facts",len(facts),"=",mem_words,"words + last 2 turns",2*turn_words,"=",mem_words+2*turn_words,"words per turn at any turn")
