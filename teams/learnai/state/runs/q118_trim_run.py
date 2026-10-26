# EXAMPLE chat (invented). Budget counted in words (toy stand-in for tokens).
chat = [
 ("user","Mera order id 4471 hai, aur mujhe peanut se allergy hai."),
 ("bot","Note kar liya. Kaise madad karu?"),
 ("user","Delivery kab tak aayegi?"),
 ("bot","Aaj shaam 6 baje tak, tracking link bhej diya."),
 ("user","Thik hai, aur payment kaise hua tha?"),
 ("bot","UPI se, Rs 480 ka payment success tha."),
 ("user","Invoice mil sakta hai?"),
 ("bot","Haan, email par bhej diya."),
 ("user","Ek item badalna hai, kaise karu?"),
 ("bot","App mein Orders kholo aur Change item dabao."),
 ("user","Dessert mein kya options hain?"),
 ("bot","Brownie, kheer aur ice cream."),
]
n=lambda m:len(m[1].split())
total=sum(map(n,chat)); print("total words",total,"messages",len(chat))
budget=60
kept=[];used=0
for m in reversed(chat):
    if used+n(m)>budget: break
    kept.insert(0,m);used+=n(m)
print("TRUNCATE budget",budget,"kept messages",len(kept),"words",used)
print("first message kept?",kept[0]==chat[0])
print("allergy fact kept?",any("allergy" in m[1] for m in kept))
summary="User: order 4471, peanut allergy. Delivery 6 pm, UPI Rs 480 paid, invoice emailed."
last=chat[-4:]
w=len(summary.split())+sum(map(n,last))
print("SUMMARISE: summary words",len(summary.split()),"+ last 4 messages =",w,"words; allergy kept?","allergy" in summary)
