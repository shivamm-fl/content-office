"""Continue the owner-approved diagram cover family for b012-b021."""
import json,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];TEAM=ROOT/'teams/dsa'
sys.path.insert(0,str(TEAM/'scripts'))
import render_blind75_covers as C
C.DESIGNS.update({
12:(['COUNT','SET BITS'],'Clear the rightmost one','n AND (n − 1)'),
13:(['COUNTING','BITS'],'Reuse the smaller answer','SHIFT → LOOK UP → ADD LAST BIT'),
14:(['MISSING','NUMBER'],'Let equal values cancel','XOR THE RANGE AND THE ARRAY'),
15:(['REVERSE','BITS'],'All 32 positions matter','EXTRACT → SHIFT → APPEND'),
16:(['CLIMBING','STAIRS'],'Count the last move','KEEP THE PREVIOUS TWO COUNTS'),
17:(['COIN','CHANGE'],'The largest coin can lose','TRY EVERY POSSIBLE LAST COIN'),
18:(['INCREASING','SUBSEQUENCE'],'Keep the smallest endings','LOWER BOUND → REPLACE OR APPEND'),
19:(['COMMON','SUBSEQUENCE'],'Keep the order. Skip the gaps.','MATCH: DIAGONAL · ELSE: MAX'),
20:(['WORD','BREAK'],'Reach the entire string','VALID PREFIX + EXACT WORD'),
21:(['COMBINATION','SUM IV'],'Different order. Different way.','COUNT EVERY POSSIBLE LAST VALUE'),
})
def diagram(n):
    if n==12:return C.tx(540,880,'12 → 8 → 0',37,C.MUTED)+C.cells([1,1,0,0],945,selected=(0,1))+C.result('2 set bits',1230,76)
    if n==13:return C.tx(540,880,'COUNTS FOR 0 THROUGH 6',28,C.MUTED)+C.cells([0,1,1,2,1,2,2],945,selected=(6,))+C.result('count[6] = count[3] + 0',1230,49)
    if n==14:return C.tx(540,880,'RANGE: 0, 1, 2, 3, 4',29,C.MUTED)+C.cells([4,0,2,1],945)+C.result('missing = 3',1230,77)
    if n==15:return C.tx(540,880,'LOW FOUR INPUT BITS',29,C.MUTED)+C.cells([1,0,1,0],945,selected=(0,2))+C.result('32-bit reverse → 1342177280',1230,46)
    if n==16:return C.tx(540,880,'WAYS TO REACH EACH STAIR',28,C.MUTED)+C.cells([1,2,3,5,8],945,selected=(4,))+C.result('5 stairs → 8 ways',1230,67)
    if n==17:return C.tx(540,880,'COINS 1, 3, 4 · AMOUNT 6',28,C.MUTED)+C.cells([3,3],945,selected=(0,1))+C.result('2 coins beat 4 + 1 + 1',1230,57)
    if n==18:return C.tx(540,880,'INPUT: −4, 6, 2, 7, 3, 8',29,C.MUTED)+C.cells([-4,2,3,8],945,selected=(0,1,2,3))+C.result('length = 4',1230,77)
    if n==19:return C.tx(540,880,'AXBY  ·  ABY',42,C.MUTED)+C.cells(['a','b','y'],945,selected=(0,1,2))+C.result('common length = 3',1230,65)
    if n==20:return C.tx(540,880,'DICTIONARY: CAR, CA, RS',28,C.MUTED)+C.cells(['ca','rs'],945,selected=(0,1))+C.result('cars = ca | rs',1230,76)
    if n==21:
        return C.tx(540,880,'VALUES 1, 2 · TARGET 4',29,C.MUTED)+C.cells(['1+1+2','1+2+1','2+1+1'],945,selected=(0,1,2))+C.tx(540,1150,'also 1+1+1+1 and 2+2',40,C.MUTED)+C.result('5 ordered sequences',1290,65)
    raise ValueError(n)
C.diagram=diagram
if __name__=='__main__':
    numbers=list(map(int,sys.argv[1:] or range(12,22)))
    outputs=[C.build(n) for n in numbers]
    # A partial build retains the complete existing batch inventory.
    outputs=[]
    for n in range(12,22):
        p=TEAM/f'state/solutions/b{n:03}/lesson.json'
        if not p.exists():continue
        lesson=json.loads(p.read_text(encoding='utf-8'));cover=TEAM/'brand/covers'/f'{lesson["folder"]}.png'
        if cover.exists():outputs.append(dict(item=f'b{n:03}',folder=lesson['folder'],title=' '.join(C.DESIGNS[n][0]),hook=C.DESIGNS[n][1],cover=str(cover.relative_to(TEAM)).replace('\\','/')))
    (TEAM/'brand/covers/blind75-b012-b021-cover-manifest.json').write_text(json.dumps(outputs,indent=2),encoding='utf-8')
