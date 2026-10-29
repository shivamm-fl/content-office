# Tiny network: 2 inputs -> 2 hidden neurons (ReLU) -> 1 output. Weights are hand-set EXAMPLE numbers.
x=[2,3]
W1=[[1,-1],[2,1]]; b1=[0,-4]      # layer 1: one row of weights per neuron
W2=[1,1]; b2=0                    # layer 2: output neuron
relu=lambda v:max(0,v)
h=[]
for j,(w,b) in enumerate(zip(W1,b1)):
    z=sum(wi*xi for wi,xi in zip(w,x))+b
    h.append(relu(z)); print(f"hidden{j+1}: {w[0]}*{x[0]} + {w[1]}*{x[1]} + ({b}) = {z} -> relu {relu(z)}")
y=sum(wi*hi for wi,hi in zip(W2,h))+b2
print(f"output: {W2[0]}*{h[0]} + {W2[1]}*{h[1]} + {b2} = {y}")
n=sum(len(w) for w in W1)+len(b1)+len(W2)+1
print("weights+biases (parameters):",n)
x2=[3,2]; h2=[relu(sum(wi*xi for wi,xi in zip(w,x2))+b) for w,b in zip(W1,b1)]
print("different input",x2,"-> hidden",h2,"output",sum(wi*hi for wi,hi in zip(W2,h2)))
