# Tiny model y = w*x + b learned from 5 points by gradient descent (training), then used (inference).
xs=[1,2,3,4,5]; ys=[3,5,7,9,11]   # hidden rule: y = 2x + 1
w=b=0.0; lr=0.02
for step in range(1,501):
    gw=sum(2*(w*x+b-y)*x for x,y in zip(xs,ys))/len(xs)
    gb=sum(2*(w*x+b-y) for x,y in zip(xs,ys))/len(xs)
    w-=lr*gw; b-=lr*gb
    if step in (1,10,100,500):
        loss=sum((w*x+b-y)**2 for x,y in zip(xs,ys))/len(xs)
        print(f"TRAIN step {step:3d}: w={w:.2f} b={b:.2f} loss={loss:.4f}")
print("INFERENCE (weights fixed, 1 multiply+1 add each):")
before=(round(w,6),round(b,6))
for x in (10,20,100): print(f"  x={x}: predict {w*x+b:.1f}")
print("weights unchanged after inference:", before==(round(w,6),round(b,6)))
