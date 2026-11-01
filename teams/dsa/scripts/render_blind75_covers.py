"""Shared diagram cover design for the eleven completed Blind75 lessons."""
import argparse, concurrent.futures, html, json, shutil, subprocess
from pathlib import Path

TEAM=Path(__file__).resolve().parent.parent
REPO=TEAM.parent.parent
CLI=Path('C:/Users/acer/AppData/Local/npm-cache/_npx/dda85f6428bfbdbf/node_modules/hyperframes/bin/hyperframes.mjs')
NAVY='#0B1220';IVORY='#F3EFE6';VIOLET='#A78BFA';GREEN='#6FD3A6';MUTED='#8FA0B8';PANEL='#131C2E'

def tx(x,y,value,size=42,color=IVORY,anchor='middle',weight=600):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-size="{size}" font-weight="{weight}" fill="{color}">{html.escape(str(value))}</text>'
def box(x,y,w,h,stroke=MUTED,fill=PANEL,rx=16):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="3"/>'
def cells(values,y=945,selected=(),width=840,color=GREEN):
    step=width/len(values);w=step-14;left=(1080-width)/2
    return ''.join(box(left+i*step,y,w,120,color if i in selected else '#35425B', '#16352F' if i in selected else PANEL)+tx(left+i*step+w/2,y+82,n,60 if len(str(n))<3 else 47,color if i in selected else IVORY) for i,n in enumerate(values))
def result(value,y=1210,size=74):return tx(540,y,value,size,GREEN)

def diagram(i):
    if i==1:return tx(540,890,'TARGET 14',31,MUTED)+cells([4,1,8,6],selected=(2,3))+result('8 + 6 = 14')
    if i==2:
        a=[8,3,6,2,7];xs=[160+k*190 for k in range(5)];out=''
        for k,n in enumerate(a):
            y=1130-n*27;col=GREEN if k in (3,4) else MUTED
            out+=f'<rect x="{xs[k]-27}" y="{y}" width="54" height="{1130-y}" rx="4" fill="{col}"/>'+tx(xs[k],y-22,n,42,col)
        return out+tx(xs[3],1185,'BUY',27,GREEN)+tx(xs[4],1185,'SELL',27,GREEN)+result('7 − 2 = 5',1300,65)
    if i==3:return tx(540,890,'SEEN BEFORE?',31,MUTED)+cells([5,2,9,2],selected=(1,3))+result('2 appears twice',1210,59)
    if i==4:return tx(540,880,'INPUT',28,MUTED)+cells([2,3,4,5],920)+tx(540,1105,'↓',48,VIOLET)+cells([60,40,30,24],1140,selected=(0,1,2,3))
    if i==5:return tx(540,890,'CONTIGUOUS SUBARRAY',29,MUTED)+cells([-3,4,-1,2,-6,3],selected=(1,2,3))+result('4 − 1 + 2 = 5',1210,66)
    if i==6:return tx(540,890,'NEGATIVE × NEGATIVE',29,MUTED)+cells([-2,3,-4],selected=(0,1,2))+result('(−2) × 3 × (−4) = 24',1210,58)
    if i==7:return tx(540,890,'ROTATED SORTED ARRAY',29,MUTED)+cells([7,9,1,3,5],selected=(2,))+result('minimum = 1',1210,68)
    if i==8:return tx(540,890,'TARGET 8',31,MUTED)+cells([6,8,2,4,5],selected=(1,))+result('index = 1',1210,68)
    if i==9:return tx(540,890,'THREE VALUES · SUM ZERO',29,MUTED)+cells([-2,-2,0,1,1,2],selected=(0,2,5))+result('−2 + 0 + 2 = 0',1210,65)
    if i==10:
        a=[1,6,2,5,4];xs=[160+k*190 for k in range(5)];base=1170;out=f'<rect x="{xs[1]}" y="{base-4*43}" width="{xs[4]-xs[1]}" height="172" fill="#153F4A"/>'
        out+=f'<line x1="{xs[1]}" y1="{base-172}" x2="{xs[4]}" y2="{base-172}" stroke="{GREEN}" stroke-width="3"/>'
        for k,n in enumerate(a):
            col=GREEN if k in(1,4) else MUTED
            out+=f'<line x1="{xs[k]}" y1="{base}" x2="{xs[k]}" y2="{base-n*43}" stroke="{col}" stroke-width="10"/>'+tx(xs[k],base-n*43-25,n,43,col)
        return out+result('4 × 3 = 12',1290,68)
    if i==11:
        out=tx(540,880,'SUM + CARRY',29,MUTED)
        for y,label,value,col in [(935,'5','0101',VIOLET),(1030,'3','0011',GREEN)]:
            out+=tx(175,y+48,label,44,col)
            for k,n in enumerate(value):out+=box(320+k*135,y,110,75,col if n=='1' else '#35425B')+tx(375+k*135,y+53,n,43,col if n=='1' else MUTED)
        return out+result('5 + 3 = 8',1245,76)
    raise ValueError(i)

DESIGNS={
 1:(['TWO SUM'],'Find the missing partner','BRUTE FORCE → HASH MAP'),
 2:(['STOCK','PROFIT'],'Buy low. Sell high.','ONE PASS · TRACK THE MINIMUM'),
 3:(['CONTAINS','DUPLICATE'],'Seen this number before?','BRUTE FORCE → HASH SET'),
 4:(['PRODUCT','EXCEPT SELF'],'No division needed','PREFIX × SUFFIX'),
 5:(['MAXIMUM','SUBARRAY'],'Keep it or restart?','KADANE’S ALGORITHM'),
 6:(['MAXIMUM','PRODUCT'],'Track both extremes','KEEP THE MAX AND MIN'),
 7:(['ROTATED','MINIMUM'],'Which half stays?','BINARY SEARCH'),
 8:(['ROTATED','SEARCH'],'Find the sorted half','BINARY SEARCH'),
 9:(['THREE SUM'],'One anchor. Two pointers.','SORT → TWO POINTERS'),
 10:(['MOST','WATER'],'Move the shorter side','TWO POINTERS'),
 11:(['SUM WITHOUT','PLUS'],'Follow the carry','XOR · AND · SHIFT'),
}

def build(i):
    reel=next(p for p in (TEAM/'reels').glob(f'b{i:03}_*') if p.is_dir())
    title,hook,method=DESIGNS[i];dest=TEAM/'brand/covers'/reel.name;dest.mkdir(parents=True,exist_ok=True)
    (dest/'fonts').mkdir(exist_ok=True)
    shutil.copy2(TEAM/'brand/fonts/SpaceGrotesk.ttf',dest/'fonts/SpaceGrotesk.ttf')
    (dest/'assets').mkdir(exist_ok=True)
    shutil.copy2(REPO/'company/brand/learnvora-logo/mark-dsa.svg',dest/'assets/mark.svg')
    shutil.copy2(TEAM/'brand/covers/_template/hyperframes.json',dest/'hyperframes.json')
    size=160 if len(title)==1 else 136
    if i==11:size=119
    headline=''.join(f'<div style="color:{IVORY if k==0 else VIOLET}">{html.escape(row)}</div>' for k,row in enumerate(title))
    heading_top=495 if len(title)==1 else 450
    out=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=1080,height=1920"><title>Blind 75 {i:02}: {html.escape(' '.join(title))}</title><style>
@font-face{{font-family:Space;src:url('fonts/SpaceGrotesk.ttf');font-weight:300 700}}
*{{box-sizing:border-box}}html,body{{margin:0;width:1080px;height:1920px;overflow:hidden;background:{NAVY}}}
#root{{position:relative;width:1080px;height:1920px;background:{NAVY};color:{IVORY};font-family:Space,sans-serif}}
#topline{{position:absolute;left:90px;top:280px;width:900px;height:4px;background:#2B354A}}
#topline:before{{content:'';display:block;width:80px;height:4px;background:{VIOLET}}}
#pill{{position:absolute;left:90px;top:335px;padding:13px 25px;background:{VIOLET};border-radius:30px;color:{NAVY};font-size:28px;font-weight:700;letter-spacing:3px}}
#counter{{position:absolute;right:90px;top:346px;color:{MUTED};font-size:31px;font-weight:600;letter-spacing:2px}}#counter b{{color:{VIOLET}}}
#headline{{position:absolute;left:90px;top:{heading_top}px;font-size:{size}px;font-weight:700;letter-spacing:-6px;line-height:1.04}}
#hook{{position:absolute;left:90px;top:780px;font-size:43px;font-weight:500;color:{MUTED};letter-spacing:-1px}}
#diagram{{position:absolute;inset:0;font-family:Space,sans-serif}}
#method{{position:absolute;left:90px;right:90px;top:1370px;font-size:29px;font-weight:600;letter-spacing:2px;color:{VIOLET}}}
#progress{{position:absolute;left:90px;top:1450px;width:900px;height:5px;background:#29334A}}#progress div{{height:5px;width:{900*i/75:.2f}px;background:{VIOLET}}}
#footer{{position:absolute;left:90px;top:1535px;display:flex;align-items:center;gap:18px;color:{IVORY};font-size:32px;font-weight:500}}#footer img{{width:42px;height:42px}}
</style></head><body><main id="root" data-composition-id="cover" data-start="0" data-duration="1" data-width="1080" data-height="1920">
<div id="topline"></div><div id="pill">DSA</div><div id="counter">BLIND 75 &nbsp; <b>{i:02}</b> / 75</div>
<div id="headline">{headline}</div><div id="hook">{html.escape(hook)}</div>
<svg id="diagram" viewBox="0 0 1080 1920" width="1080" height="1920" role="img" aria-label="Worked example from the actual lesson">{diagram(i)}</svg>
<div id="method">{html.escape(method)}</div><div id="progress"><div></div></div><div id="footer"><img src="assets/mark.svg" alt="Learnvora">@dsa.learnvora</div>
</main></body></html>'''
    (dest/'index.html').write_text(out,encoding='utf-8')
    log=subprocess.run(['node',str(CLI),'snapshot',str(dest),'--at','0','--no-end','--describe','false'],cwd=TEAM,capture_output=True,text=True,encoding='utf-8',errors='replace')
    (dest/'render-cover.log').write_text(log.stdout+log.stderr,encoding='utf-8')
    frames=list((dest/'snapshots').glob('frame-*.png'))
    if log.returncode or not frames:raise RuntimeError(f'Cover {i}: {log.stderr[-250:]}')
    target=dest.with_suffix('.png');shutil.copy2(frames[0],target)
    return dict(item=f'b{i:03}',folder=reel.name,title=' '.join(title),hook=hook,cover=str(target.relative_to(TEAM)).replace('\\','/'))

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--only',type=int);args=ap.parse_args()
    ids=[args.only] if args.only else list(range(1,12))
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:results=list(pool.map(build,ids))
    (TEAM/'brand/covers/blind75-cover-manifest.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
    print(f'Rendered {len(results)} cover(s), 1080x1920.')
