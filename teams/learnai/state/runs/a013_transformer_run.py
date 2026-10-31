# Parameter count of one encoder layer of the base Transformer (Vaswani et al. 2017): d_model=512, d_ff=2048, h=8, N=6.
d, ff, h, N = 512, 2048, 8, 6
attn = 4 * (d * d + d)                 # W_q, W_k, W_v, W_o, each d x d plus bias (all heads together)
ffn = (d * ff + ff) + (ff * d + d)     # two linear layers
norm = 2 * (2 * d)                     # two LayerNorms, scale + shift
layer = attn + ffn + norm
print("heads", h, "head size", d // h)
print("attention", attn); print("feed-forward", ffn); print("layernorm", norm)
print("one encoder layer", layer)
print("stack of", N, "encoder layers", N * layer)
print("share attention %.1f%%  feed-forward %.1f%%" % (100 * attn / layer, 100 * ffn / layer))
