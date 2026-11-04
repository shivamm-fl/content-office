params=7_000_000_000
for name,bits in (("fp32",32),("fp16",16),("int8",8),("int4",4)):
    print("%s: %d bits = %.1f bytes/weight -> %.1f GB (decimal)"%(name,bits,bits/8,params*bits/8/1e9))
