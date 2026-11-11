"""Companion captions for the exact original lessons; never posts."""
import importlib.util,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];TEAM=ROOT/'teams/dsa';BASE=TEAM/'state/solutions'
spec=importlib.util.spec_from_file_location('caption_lint',TEAM/'.claude/skills/ig-caption/caption.py');lint=importlib.util.module_from_spec(spec);spec.loader.exec_module(lint)
COPY={
12:('12 -> 8 -> 0: har round exactly one set bit clear hota hai.','n & (n - 1) rightmost one ko hataata hai. Naive shift scan sahi hai, par zero positions bhi check karta hai. K set bits ke liye K rounds; actual fixed 31-bit domain mein constant time aur constant extra space.','Sparse bits par kaunsa scan kam work karega?'),
13:('Given integer: 6. Output: [0, 1, 1, 2, 1, 2, 2].','count[i] = count[i >> 1] + (i & 1). Last bit hataane par smaller answer pehle se ready hai. O(n) time, O(n) output storage aur output ko chhodkar O(1) auxiliary space.','N zero ho to output kya hoga?'),
14:('Given array: [4, 0, 2, 1]. Missing value: 3.','Full range 0..n aur present values XOR karo. Equal copies cancel hongi, missing value bachegi. One pass, O(n) time aur O(1) extra space; input mutate nahi hota. Distinct values ki guarantee zaroori hai.','Length n ko accumulator mein seed kyun kiya?'),
15:('Given integer: 10. Reverse all 32 bits -> 1342177280.','Result left shift, input ka low bit OR, phir input right shift. Input zero hone par bhi 32 rounds poore karo. Padded string baseline sahi hai; bit registers temporary string hataate hain. Fixed 32-bit domain: O(1) time aur O(1) extra space.','While n par rukne se kaunse positions kho jaayenge?'),
16:('Given integer: 5 stairs. One-step ya two-step moves -> 8 ways.','Last move ke disjoint cases: ways[i - 1] + ways[i - 2]. Zero stairs ka one empty route base hai. Previous two counts simultaneously update hote hain. O(n) time, O(1) extra space.','Dono counts ek saath update karna kyun zaroori hai?'),
17:('Given array: [1, 3, 4]. Amount 6 -> 2 coins: 3 + 3.','Greedy 4 + 1 + 1 mein 3 coins hain. DP har possible last coin c ke liye dp[total - c] + 1 check karke minimum leta hai. Unreachable answer amount se bada rahe to -1. A amount, M denominations: O(A*M) time, O(A) extra space.','Amount zero par answer zero kyun hai?'),
18:('Given array: [-4, 6, 2, 7, 3, 8]. Strictly increasing length: 4.','Tails har length ka smallest possible ending rakhta hai. Lower bound: first tail >= value replace karo, ya end par append. Tails ko hamesha actual subsequence mat samjho. O(n log n) time, O(n) extra space; input unchanged.','Equal values append kyun nahi karte?'),
19:('Given strings: axby and aby. Common subsequence aby -> length 3.','DP prefix pairs store karta hai. Match par diagonal + 1; mismatch par max(up, left). Gaps allowed hain, order badalna allowed nahi. Yeh actual code full table rakhta hai: O(m*n) time aur O(m*n) extra space.','Mismatch par dono characters ek saath chhodna kyun unsafe hai?'),
20:('Given string: cars. Dictionary: car, ca, rs. Valid split: ca | rs.','Longest prefix car greedy trap hai. reachable[end] true tabhi, jab reachable start se exact dictionary word us end tak match kare. N characters, M words, max word length L: O(N*M*L) time, O(N) extra space.','Sirf ek middle prefix ka true hona enough kyun nahi?'),
21:('Given array: [1, 2]. Target 4 -> 5 ordered sequences.','1111, 112, 121, 211, 22 alag ways hain. Last value ke disjoint cases sum karo: ways[t] += ways[t - v]. Total outer loop, values inner loop. Positive values smaller-state dependency dete hain. O(A*M) time, O(A) extra space.','Coin Change ka minimum yahan use kyun nahi kar sakte?'),
}
def main():
 for n in range(12,22):
    rid=f'b{n:03}';lesson=json.loads((BASE/rid/'lesson.json').read_text(encoding='utf-8'));a,b,q=COPY[n];folder=lesson['folder'];(TEAM/'social').mkdir(exist_ok=True)
    code=f'https://github.com/shivamm-fl/content-office/blob/main/teams/dsa/state/solutions/{rid}/solution.py'
    caption=f'Blind 75 {n}/75: {lesson["title"]}\n\n{a}\n\n{b}\n\n{q}\n\nProblem: {lesson["sources"][0]}\nAccepted Python code: {code}\n\n#Blind75 #DSA #Python'
    assert not re.search('[\u0900-\u097f]',caption)
    (TEAM/'social'/f'{folder}.hi.caption.txt').write_text(caption+'\n',encoding='utf-8')
    (TEAM/'social'/f'{folder}.youtube.txt').write_text(f'{lesson["title"]} | Blind 75 {n}/75\n\n{a}\n\n{b}\n\nProblem: {lesson["sources"][0]}\nOriginal Accepted Python: {code}\n',encoding='utf-8')
    report=lint.analyse(caption,keywords=[lesson['title'],'Python'])
    assert not any(x['status']=='FAIL' for x in report['checks']),report
    report['intentional_notes']=['Owner coding-track rule requires problem and full-code URLs despite nonclickable-caption warning.','Caption supports the worked example; no repeated spoken CTA padding.']
    r=TEAM/'reels'/folder
    (r/'qa-caption.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(rid,'caption checks pass',len(caption))
if __name__=='__main__':main()
