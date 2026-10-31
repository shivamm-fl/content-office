# Parameter count of one transformer layer, base model of Vaswani et al. 2017 (arXiv 1706.03762):
# d_model 512, d_ff 2048, 8 heads, 6 layers. Our count from the paper's sizes (weights + biases).
d, ff, L = 512, 2048, 6
attn = 4 * (d * d + d)            # Q, K, V and output projections
ffn = (d * ff + ff) + (ff * d + d)  # two linear layers
ln = 2 * (2 * d)                  # two layer norms (scale + shift)
layer = attn + ffn + ln
print(f"attention {attn:,}\nfeed-forward {ffn:,}\nlayer norm {ln:,}\none layer {layer:,}\n{L} layers {L*layer:,}")
print(f"attention {attn/layer*100:.1f} %  feed-forward {ffn/layer*100:.1f} %  norm {ln/layer*100:.2f} %")
print("10 blocks of 3 million:", 10*3, "million")
