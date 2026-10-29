# a011: hand-set toy network (EXAMPLE, not trained). 2 inputs -> 2 ReLU neurons -> 1 output.
relu=lambda x:max(0,x)
W1=[(1,-1,0),(2,1,-4)]; W2=(1,1,0)
def run(a,b):
    h=[relu(w1*a+w2*b+bias) for w1,w2,bias in W1]
    return h, W2[0]*h[0]+W2[1]*h[1]+W2[2]
for x in [(2,3),(3,2),(1,1)]: print(x, run(*x))
print("params", 2*3+3)
