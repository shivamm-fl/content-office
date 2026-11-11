"""Original teaching scripts for the owner-requested second Blind75 batch."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];BASE=ROOT/'teams/dsa/state/solutions'
ROAD=json.loads((ROOT/'teams/dsa/roadmap/blind75.json').read_text(encoding='utf-8'))['problems']
LESSONS={}
def add(n,number,folder,copy,teaching,descriptions):
    p=ROAD[n-1];rid=p['id']
    LESSONS[rid]=dict(id=rid,slug=p['slug'],number=str(number),folder=folder,title=p['title'],difficulty='Easy' if n<=16 else 'Medium',sources=[p['url'],'https://docs.python.org/3/library/stdtypes.html#bitwise-operations-on-integer-types'],copy=dict(zip('ABCDEFG',copy)),teaching=dict(zip(['problem','brute_force','bottleneck','optimization','dry_run','complexity'],teaching)),teaching_scenes=dict(problem=['A'],brute_force=['B'],bottleneck=['C'],optimization=['D'],dry_run=['E','F'],complexity=['G']),descriptions=dict(zip('ABCDEFG',descriptions)),cues=[['click','B',0,0],['err','C',0,0],['ok','E',0,0]],narration_numbers='All inputs, signs, indices and computed counts in English; technical Hinglish; owner tempo 0.9. Complete Accepted method body on screen.')

add(12,191,'b012_number_one_bits',[
'@hook हर bit को check करना ज़रूरी नहीं। | Given integer: twelve. Binary one one zero zero में two set bits हैं। Set bit मतलब जिस position पर one हो। हमें वही count लौटाना है।',
'Brute force: हर round में last bit check करो, फिर number को right shift करो। | Twelve से six, फिर three, फिर one। Four positions check हुए, जबकि ones सिर्फ two थे।',
'ये answer सही देता है। Problem extra checks हैं: बीच के zero bits भी scan होते हैं। | Binary one zero zero zero zero में सिर्फ one set bit है, फिर भी five positions देखनी पड़ती हैं।',
'Observation: n minus one, rightmost one को zero और उसके बाद के zeroes को ones बनाता है। | इसलिए n AND n minus one करने पर सिर्फ वही rightmost set bit मिटता है। बाकी set bits बचते हैं। | हर round exactly one मिटाओ और count बढ़ाओ।',
'Dry run उसी twelve पर। One one zero zero AND one zero one one देता है one zero zero zero, यानी eight। Count one। | Eight AND seven देता है zero। Count two। Number zero, loop stop, answer two।',
'ये actual Accepted Python है। Count zero से शुरू। While n के अंदर n AND n minus one assign होता है, फिर count one बढ़ता है। | Count बढ़ाना मत भूलना; बदला हुआ n answer नहीं है। Original number को preserve करना ज़रूरी नहीं।',
'K set bits हों तो K rounds, O of K time और O of one extra space। | इस problem का integer at most thirty one bits है, इसलिए fixed domain में दोनों constant हैं। Speedup sparse ones पर है; naive algorithm गलत नहीं था।'
],[
'Count the one bits of a positive integer; original input twelve has binary 1100 and returns two.',
'Scan each bit using bitwise AND one and right shifts until the remaining number is zero.',
'The correct baseline still examines every bit position including zeroes; sixteen needs five scans for one set bit.',
'Subtracting one flips the least significant one and all trailing zeroes. AND with the old number clears exactly that one while preserving the higher bits; count one removal per round.',
'For twelve, 1100 AND 1011 gives 1000 with count one; 1000 AND 0111 gives zero with count two, then return two.',
'With k set bits there are k rounds and constant scalar extra space under fixed-width arithmetic. The actual positive 31-bit domain makes worst-case time and space constant.'
],[
'Binary cells 1100 with two selected ones and requested count two',
'Shift scan visits twelve, six, three and one, including zero low bits',
'Binary10000 highlights four zero checks beside a single set bit',
'Bit-aligned n and n-minus-one show rightmost-one removal, preserving higher bits',
'Two chronological AND transitions:12 to8 to0; separate count0 to1 to2',
'Complete Accepted source with loop, clear operation and counter highlights',
'Source return highlight plus k removals, constant registers and fixed31-bit qualification'
])

add(13,338,'b013_counting_bits',[
'@hook Bits की counting में पिछले answers reuse करो। | Given integer: six. Zero से six तक हर number के set bits चाहिए। Output: zero, one, one, two, one, two, two।',
'Naive approach: हर number को अलग binary में बदलो और उसके ones गिनो। | Three का binary one one है। Six का one one zero। दोनों को अलग scan करते हो।',
'यही repeated work है: six को right shift करो तो three मिलता है, जिसकी counting पहले ही निकाली थी। | हर number का पूरा binary दोबारा scan करने से total O of n log n work होता है।',
'Right shift last bit हटाता है। इसलिए count of i बराबर count of i shifted right, plus i AND one। | हटाई हुई last bit zero हो तो कुछ नहीं जोड़ो; one हो तो one जोड़ो। | आधे number का index हमेशा छोटा है, इसलिए उसका answer पहले ready होगा।',
'Dry run: count zero is zero। One के लिए zero plus one, answer one। | Two के लिए count one plus zero, answer one। Three के लिए count one plus one, answer two। | Four, five, six के answers one, two, two। Output ready।',
'Accepted code counts array को n plus one zeroes देता है। Loop one से n तक चलता है। | हर cell में exactly वही recurrence लिखी है: smaller index का stored answer, plus last bit। Return पूरा counts array, सिर्फ आखिरी cell नहीं।',
'हर output के लिए constant work: O of n time। Result array O of n space लेता है; उसे छोड़कर O of one auxiliary space। | N zero होने पर loop नहीं चलता और output सिर्फ zero है। पुराना answer reuse करना ही optimization है।'
],[
'For input six return counts for every integer from zero through six: [0,1,1,2,1,2,2].',
'Independently scan the binary representation of each integer and count all its one bits.',
'Scanning six repeats the prefix already counted for three; independently scanning all bit positions costs O(n log n) in the variable-width counting model.',
'Removing the low bit leaves value shifted right, an already solved smaller index. The answer is counts[value >> 1] plus value AND one, computed in ascending order.',
'Initialize count zero as zero; indices one,two,three,four,five,six become one,one,two,one,two,two through the smaller-index dependency.',
'One constant-width recurrence per result gives O(n) time, O(n) output storage and O(1) auxiliary storage excluding the returned array; n zero returns [0].'
],[
'Scalar6 points to output cells0,1,1,2,1,2,2 indexed0 to6',
'Separate binary scans for3 and6 reveal shared11 prefix',
'Arrow from binary110 back to already counted11',
'Dependency graph i to i>>1 with the detached last-bit contribution',
'Ascending recurrence fills each of seven cells without jumping ahead',
'All Accepted method lines highlighted for allocation, recurrence and array return',
'One dependency per cell; output storage explicitly distinguished from auxiliary scalars'
])

add(14,268,'b014_missing_number',[
'@hook Missing number को XOR से निकालो। | Given array: four, zero, two, one. Four elements हैं, इसलिए allowed numbers zero से four तक हैं। Missing value three है। Array में duplicates नहीं हैं।',
'Brute force: zero से four तक हर candidate लो, और पूरे array में ढूँढो। | Zero मिलता है, one मिलता है, two मिलता है, three नहीं मिलता। Answer सही है।',
'लेकिन हर candidate के लिए फिर से array scan होता है। N candidates और हर scan में up to N values: quadratic work। | Sorting करने पर भी extra ordering work चाहिए; हमें सिर्फ absent value चाहिए।',
'XOR की properties: x XOR x is zero, और x XOR zero is x। Order बदलने से result नहीं बदलता। | इसलिए full range और array को XOR कर दो। मौजूद numbers two copies में cancel होंगे। सिर्फ missing number की one copy बचेगी।',
'Code missing को length four से initialize करता है। | Index zero, value four से accumulator zero। Index one, value zero से one। | Index two, value two cancel: accumulator one। Index three, value one से three। सभी pairs process हुए, return three।',
'ये पूरा Accepted code है। Length वाला initialization range का last number शामिल करता है। Loop के indices zero से n minus one तक बाकी range देते हैं। | हर round index और actual value दोनों XOR होते हैं। Input array बदला नहीं जाता।',
'One pass: O of n time, O of one extra space। | Missing zero या missing n भी इसी तरह बचेगा। Duplicates allowed हों तो cancellation proof टूटेगा; यहाँ distinct values problem की guarantee है।'
],[
'Find the unique absent value from zero through n for distinct nums of length n. Original [4,0,2,1] returns three.',
'For each range candidate scan the entire array until it is found or identified as missing.',
'Repeated candidate searches can inspect a quadratic number of array values; sorting also performs unnecessary ordering work for this task.',
'XOR cancels two equal values and has zero identity, independent of order. XOR of complete range zero through n with all present values leaves exactly the absent value.',
'Initialize accumulator4; process (index,value) pairs (0,4),(1,0),(2,2),(3,1), giving accumulators0,1,1,3 and return3.',
'One pass with scalar state costs O(n) time and O(1) auxiliary space, without input mutation. Distinctness and the zero-through-n domain are required for cancellation proof.'
],[
'Input4,0,2,1 below complete range0 through4 with3 visibly absent',
'Candidate3 scans each cell and fails membership',
'Repeated candidate-to-array edges expose quadratic scans',
'Matched range and input values pair off; unpaired3 remains',
'Accumulator4 to0 to1 to1 to3 synchronized with index,value pairs',
'Complete Accepted source with length seed, enumerate and XOR highlights',
'Unmatched zero and n boundary diagrams; O(n) pass and scalar state'
])

add(15,190,'b015_reverse_bits',[
'@hook Bit reversal में leading zeroes भी गिनो। | Given integer: ten. इसका thirty two bit pattern reverse करना है। ये decimal digits उलटना नहीं है। | Low four bits one zero one zero हैं; बाकी twenty eight bits zero हैं।',
'Naive approach: number को thirty two character binary string बनाओ, फिर string reverse करके integer में convert करो। | Padding ज़रूरी है। सिर्फ one zero one zero reverse करोगे तो five मिलेगा, जो wrong width है।',
'String वाला padded approach सही है, लेकिन temporary string रखता है। | Optimization में वही bits directly move करेंगे। Target faster asymptotic time नहीं; extra representation हटाना है, और exact width बचानी है।',
'हर round result को left shift करो, ताकि नया bit डालने की जगह बने। N AND one से input का last bit लो और OR से result में जोड़ो। | फिर n right shift करके consumed bit हटाओ। Exactly thirty two rounds।',
'Ten पर dry run: result zero, input ten। Last bits क्रम से zero, one, zero, one। | Result zero, फिर one, फिर two, फिर five। | अब input zero है, लेकिन रुकना नहीं। Twenty eight remaining zeroes append होंगे। Final pattern zero one zero one, फिर twenty eight zeroes।',
'ये Accepted Python है। Range thirty two width enforce करता है। Result shift और input का last bit combine होते हैं, फिर input shift होता है। | While n लिखकर जल्दी रुकोगे तो leading zeroes खो जाएँगे। इसीलिए fixed loop ज़रूरी है।',
'Result one billion, three hundred forty two million, one hundred seventy seven thousand, two hundred eighty। | W bits के लिए O of W time और constant registers। यहाँ W thirty two fixed है: O of one time, O of one extra space।'
],[
'Reverse the entire 32-bit pattern of legal even nonnegative input ten, yielding0101 followed by28 zeroes, integer1342177280.',
'Pad a binary string to32 characters, reverse the characters and convert that result to an integer.',
'The padded string baseline is correct but stores a width-sized representation; reversing only1010 incorrectly produces5 because the other28 positions were omitted.',
'Maintain the reverse of the consumed low bits in a scalar result. Shift result left, append the old input low bit using OR, then shift input right. Execute32 rounds so zero padding remains significant.',
'For10, low bits0,1,0,1 produce result0,1,2,5. Input reaches0 but28 remaining zero appends shift5 into the high nibble, yielding1342177280.',
'For generalized width W there are W fixed-width bit rounds and scalar registers; in this actual32-bit domain time and extra space are O(1). No claim of asymptotic speedup over the padded-string baseline.'
],[
'Ten shown as00000000 00000000 00000000 00001010 with32-position reversal target',
'Correct padded string reversal contrasted with invalid four-bit-only1010 to0101',
'Temporary32-character buffer contrasted with two scalar registers',
'Low-bit extraction arrow and shift-append invariant',
'Chronological result0,1,2,5 then28 zero appends ending0x50000000',
'Complete Accepted32-round loop; input zero never truncates loop',
'Full result1342177280 and fixed32-round time/space qualification'
])

add(16,70,'b016_climbing_stairs',[
'@hook Stairs की recursion में repeated work बचाओ। | Given integer: five. हर move में one या two stairs चढ़ सकते हो। Total eight distinct sequences हैं। हमें count चाहिए, shortest route नहीं।',
'Brute force: हर position से one-step और two-step branches बनाओ। Top पर पहुँचो तो one valid way; आगे निकलो तो zero। | Five stairs से branches four और three remaining stairs solve करती हैं।',
'Four वाला branch फिर three और two को solve करता है। Three वाला subtree दोबारा बना। | यही overlapping subproblems हैं। Recursion tree बढ़ता रहता है; वही remaining-stairs question बार बार solve होता है।',
'Last move देखो। Stair i पर आने का आखिरी move या one है, या two। | First case के सारे routes stair i minus one से आते हैं, second case के stair i minus two से। Cases overlap नहीं करते, इसलिए counts जोड़ते हैं। | Current answer के लिए सिर्फ पिछले two counts चाहिए।',
'Base: zero stairs के लिए one empty sequence, one stair के लिए one way। | Two पर one plus one is two। Three पर one plus two is three। | Four पर two plus three is five। Five पर three plus five is eight। यही answer है।',
'Accepted code previous और current दोनों one रखता है। Loop two से n तक चलता है। | Simultaneous assignment में old current नया previous बनता है; old previous plus old current नया current। | पहले previous बदलकर फिर sum निकालोगे तो wrong state use हो सकती है।',
'Every stair once: O of n time। सिर्फ two running counts: O of one extra space। | N one पर loop skip होता है और one लौटता है। Full recursion tree या पूरा DP array रखने की ज़रूरत नहीं।'
],[
'Count ordered one-step and two-step routes to five stairs; original example returns eight distinct routes.',
'Recursively branch on taking one or two stairs, counting one at the exact top and zero on overshooting.',
'The remaining-three-stairs subtree is reached directly and through remaining-four, so recursive expansion repeats identical smaller questions exponentially.',
'Partition routes by their last move: one-step arrivals come from i-1 and two-step arrivals from i-2. Disjoint exhaustive cases allow addition, and only the previous two counts are needed.',
'Start ways0=1 and ways1=1. Compute ways2=2, ways3=3, ways4=5 and ways5=8, updating the two previous counts simultaneously.',
'Each stair is computed once for O(n) time and two fixed scalar counts use O(1) extra space within the legal domain. n one skips the loop and returns one.'
],[
'Five-step staircase with one/two move arcs and required route count8',
'Branch tree remaining5 to4/3 and4 to3/2',
'Duplicate remaining3 subtree marked in both branches',
'Last-edge partition into i-minus-one and i-minus-two routes, disjoint sum',
'Two-register timeline1,1 to1,2 to2,3 to3,5 to5,8',
'Full Accepted source highlights simultaneous state update using old values',
'Single-stair boundary and n iterations versus two scalar storage cells'
])

add(17,322,'b017_coin_change',[
'@hook Coin change में largest coin हमेशा सही नहीं। | Given array: one, three, four. Amount six। Unlimited coins हैं; minimum count चाहिए। Three plus three से answer two है।',
'Brute force हर possible next coin चुनकर remaining amount recursively solve करता है। | Six में one लो तो five बचता है, three लो तो three, four लो तो two। सभी valid paths में सबसे छोटा coin count रखते हैं।',
'Different paths वही remaining amounts दोबारा solve करते हैं। ये repeated branching बढ़ती जाती है। | Greedy shortcut भी fail होता है: four, one, one में three coins हैं; three, three में सिर्फ two।',
'DP total का मतलब उस total के लिए minimum coins। Last coin c हो तो उससे पहले total minus c बनना चाहिए। | उसका minimum answer पहले ready है। One coin जोड़कर हर possible last coin का candidate लो, फिर minimum चुनो। | Zero total को zero coins; unreachable totals को amount plus one sentinel।',
'Dry run: totals zero से six के minimum counts: zero, one, two, one, one, two, two। | Total six पर last coin one देता है three coins; three देता है two; four देता है three। Minimum two, यानी three plus three।',
'Accepted code छोटे totals पहले solve करता है। Coin current total से बड़ा हो तो skip। | Otherwise dp total को पुराने answer और dp total minus coin plus one के minimum से update करो। | Impossible predecessor sentinel रहता है, valid answer को खराब नहीं करता।',
'Final answer amount से बड़ा हो तो minus one लौटाओ। Amount zero पर zero लौटेगा। | A amount और M denominations हों: O of A times M time, O of A extra space। सारे last coins check करना greedy failure रोकता है।'
],[
'With unlimited coins [1,3,4] and amount6 return minimum coin count2, obtained by3+3; unreachable amounts return minus one.',
'Recursively try each valid next denomination and take the smallest count among all paths reaching exactly zero remaining amount.',
'Different paths repeat the same remaining amount. Greedy4+1+1 needs3 coins while3+3 needs2, so largest-first is incorrect for arbitrary denominations.',
'Define dp[t] as minimum coins for total t. Any optimal nonempty solution has a last coin c and an optimal predecessor t-c; enumerate all last coins and minimize dp[t-c]+1. Seed dp[0]=0 and sentinel amount+1.',
'Totals0 through6 have values0,1,2,1,1,2,2. At6, last denominations1,3,4 propose3,2,3 coins respectively, so retain2.',
'For amount A and M denominations the nested total/coin loops take O(A M) time and O(A) extra space. Check unreachable sentinel at return; amount zero returns zero.'
],[
'Coins1,3,4 and amount6 show two3 coins forming the optimal answer',
'Recursive remaining6 branches to5,3,2 with repeated smaller amounts',
'Greedy4+1+1 marked3 coins;3+3 marked2 coins',
'DP predecessor arrows total-minus-coin to total, selecting minimum candidate',
'Chronological dp0 throughdp6 then three candidate comparisons at6',
'First source chunk shows sentinel, zero base, nested loops and candidate transition',
'Remaining exact source returns minus one for sentinel; A by M operations, A-state storage'
])

add(18,300,'b018_increasing_subsequence',[
'@hook Longest subsequence के लिए smallest tails रखो। | Given array: minus four, six, two, seven, three, eight. Order बचाना है, adjacent होना ज़रूरी नहीं। | Strictly increasing subsequence minus four, two, three, eight की length four है।',
'Brute force हर element को लो या छोड़ो: two to the n candidate subsequences। | फिर check करो कि चुने हुए values strictly increasing हैं या नहीं। Small input पर सही, लेकिन choices exponential हैं।',
'DP में हर index के लिए सारे earlier smaller values देख सकते हैं; ये quadratic है। | Optimization के लिए पूछो: same length के subsequence में smaller last value बेहतर क्यों? क्योंकि आगे उसे extend करना आसान होगा।',
'Tails at index k, length k plus one वाले subsequences का smallest possible ending है। | New value के लिए binary search से first tail greater than or equal ढूँढो। मिले तो replace; न मिले तो append। | Replacement length नहीं बढ़ाता, लेकिन future extension का मौका बचाता है।',
'Dry run: minus four से tails minus four। Six append। Two, six को replace करता है। | Seven append। Three, seven को replace करता है। Eight append। | Final tails minus four, two, three, eight; length four।',
'Accepted Python bisect left use करता है: first greater than or equal position। Position length के बराबर हो तो append; otherwise उस tail को replace करो। | Equal values replace होते हैं, append नहीं; तभी strictly increasing condition बचती है।',
'Return tails की length। Tails को हमेशा original subsequence समझना गलत है; ये best endings का summary है। | N binary searches: O of n log n time, O of n extra space। Input array modify नहीं होता।'
],[
'Return longest strictly increasing subsequence length for [-4,6,2,7,3,8], preserving order but allowing gaps; answer4.',
'Enumerate take-or-skip choices for every element and verify each candidate subsequence is strictly increasing.',
'Exponential subsets are expensive; quadratic endpoint DP still scans all earlier candidates. For equal lengths a smaller ending leaves at least as many valid future extensions.',
'tails[k] stores the minimum ending among increasing subsequences of length k+1 in the processed prefix. Replace the first tail greater than or equal to x, or append if x exceeds all tails. Lower bound prevents equals from increasing length.',
'The original input creates tails[-4],[-4,6],[-4,2],[-4,2,7],[-4,2,3],[-4,2,3,8], yielding length4.',
'At most n binary searches over at most n tails give O(n log n) time and O(n) extra space without input mutation. Tails need not itself be a subsequence of the original array.'
],[
'Original six cells with indices0,2,4,5 selected to form length4',
'Take/skip branch diagram showing exponential candidate choice',
'Equal-length endings6 versus2 show which can accept a future3',
'Sorted tail slots represent minimum possible ending for each length, not fixed chosen indices',
'Six exact tail-array states, replacement keeps count and append grows count',
'Source import and lower-bound branch; equal value uses replacement',
'Remaining source returns length; tails summary warning and O(n log n),O(n)'
])

add(19,1143,'b019_common_subsequence',[
'@hook Common subsequence में mismatches को सही handle करो। | Given strings: a x b y, और a b y। Relative order रखना है; characters skip कर सकते हो। | Common subsequence a b y की length three है।',
'Brute force first string की हर subsequence generate करता है, फिर second string में order से check करता है। | हर character लो या छोड़ो। Four characters पर sixteen choices; लंबाई बढ़ने पर choices exponential होती हैं।',
'Recursive matching में भी वही prefix pairs दोबारा solve होते हैं। | सिर्फ matching characters गिनना काफी नहीं: order भी बचना चाहिए। इसलिए state में दोनों strings के consumed prefixes चाहिए।',
'DP i j मतलब first i और first j characters का best common length। | Last characters equal हों तो shorter prefixes के answer में one जोड़ो: diagonal plus one। | Mismatch पर या first का last छोड़ो, या second का। दोनों options का maximum लो। Empty prefix का answer zero।',
'Dry run में columns a, b, y हैं। A वाली row: one, one, one। | X वाली row unchanged: one, one, one। | B वाली row: one, two, two। Y वाली row: one, two, three। Bottom right three हमारा answer।',
'Accepted code zero border वाली table बनाता है। Rows और columns one से शुरू होते हैं। | Equal branch diagonal plus one है। Else branch ऊपर और left का maximum है। | Mismatch पर दोनों को साथ छोड़ना longest answer खो सकता है।',
'Return bottom-right cell। M और N string lengths पर O of M times N time और O of M times N extra space। | इस code में full table है; one-row memory optimization claim नहीं कर रहे। Subsequence में gaps allowed हैं, substring में नहीं।'
],[
'Compute longest common subsequence length for original strings axby and aby; preserving character order while allowing skips gives aby of length3.',
'Generate every subsequence of the first string and check whether it appears in the second string in order.',
'Take/skip choices grow exponentially; recursive prefix matching also revisits identical prefix-pair states. Counting shared letters without respecting order is invalid.',
'dp[i][j] stores the LCS length of prefixes text1[:i] and text2[:j]. Equal last characters give diagonal+1; unequal last characters require skipping one side or the other and taking maximum. Empty-prefix borders are zero.',
'For columns a,b,y, process rows a:[1,1,1], x:[1,1,1], b:[1,2,2], y:[1,2,3]. Final bottom-right value3 matches aby.',
'The shown full table processes every pair of prefix lengths: O(m n) time and O(m n) auxiliary space. Do not claim rolling-row memory for this actual implementation.'
],[
'Strings axby and aby aligned with a,b,y links crossing a skipped x only',
'Take/skip tree for4 letters produces16 candidate subsets',
'Prefix pair state grid prevents repeated recursive pair work',
'Grid diagonal-plus-one for match, upper/left maximum for mismatch',
'Four exact DP rows reveal1,1,1 then1,1,1 then1,2,2 then1,2,3',
'First exact source chunk shows table and nested prefix loops',
'Remaining equal/mismatch/return code with full-table memory accounting'
])

add(20,139,'b020_word_break',[
'@hook Word Break में longest prefix greedily मत चुनो। | Given string: cars. Dictionary: car, ca, rs। Ca plus rs से पूरा string बनता है, इसलिए answer true है। Words reuse भी कर सकते हो।',
'Brute force हर matching first word चुनता है, फिर remaining suffix recursively solve करता है। | Cars पर car चुनो तो s बचता है और fail। Ca चुनो तो rs मिलता है और success। सभी choices try करनी पड़ती हैं।',
'Longest word वाला greedy choice car पर अटक गया, जबकि valid split था। | Backtracking सही है, लेकिन कई paths वही suffix दोबारा solve करते हैं। Repeated questions को stored prefix answers से बदलेंगे।',
'Reachable end का मतलब: end से पहले का पूरा prefix dictionary से बन सकता है। Empty prefix true है। | हर word के लिए start बराबर end minus word length। | Start reachable हो और यही word start से end तक match करे, तभी end true करो। इससे कोई gap या invalid piece बीच में नहीं आता।',
'Dry run: zero reachable। End one पर c नहीं बनता, false। | End two पर ca मिलता है और start zero true है: true। End three पर car से true। | End four पर rs का start two है, जो true है। इसलिए cars true।',
'Accepted code हर end पर dictionary words check करता है। Negative start skip होता है। | Reachable start और exact word match मिलने पर true set करके break। | Final reachable last return होता है। सिर्फ किसी बीच वाले prefix का true होना पूरे string का answer नहीं।',
'N string length, M words, L maximum word length: O of N times M times L time, क्योंकि match भी characters check करता है। | Reachable array O of N extra space। String slices नहीं बनाते; starts with से bounded match करते हैं।'
],[
'Determine if cars can be fully segmented with dictionary car,ca,rs; ca followed by rs succeeds and words may be reused.',
'Recursively try every matching first word and continue on the remaining suffix until empty or no dictionary word matches.',
'Greedy longest-prefix car leaves invalid s, while ca then rs works. Exhaustive backtracking revisits identical suffix questions through different prefix choices.',
'reachable[end] is true iff the entire prefix ending at end is segmentable. Seed the empty prefix true; a dictionary word of length l can end there only from reachable[end-l] with an exact bounded character match.',
'For cars, reachable indices0..4 are true,false,true,true,true. ca reaches2 from0; car reaches3 from0; rs reaches4 from2, so final result true.',
'For n characters, m dictionary words and maximum length L, bounded startswith checks give O(n m L) worst-case time; reachable uses O(n) auxiliary space and no new substring slices.'
],[
'cars split ca|rs, dictionary car,ca,rs and whole-string true',
'Branch car|s fails while ca|rs reaches the end',
'Longest-prefix path dead end and repeated suffix-state pattern',
'Edges from reachable start to end exist only for exact dictionary-word spans',
'Prefix cells0,1,2,3,4 fill true,false,true,true,true in order',
'First source chunk initializes empty prefix and computes start for each word',
'Remaining condition/early-break/final-return code with character-comparison complexity'
])

add(21,377,'b021_combination_sum_four',[
'@hook यहाँ order बदलने से नया answer बनता है। | Given array: one, two. Target four। Values unlimited बार use कर सकते हो। | One, one, two और two, one, one अलग sequences हैं। Total five sequences हैं।',
'Brute force हर position पर one या two choose करता है। Target से आगे गए तो discard; exactly target मिला तो one sequence count करो। | One वाले branch से remaining three, two वाले से remaining two solve होते हैं।',
'Remaining two, दूसरे रास्तों से भी आता है। वही sequence counts बार बार निकालते हैं। | Coin Change का minimum यहाँ काम नहीं करेगा: हमें सभी ordered sequences का count चाहिए। सिर्फ unordered combinations गिनना भी गलत है।',
'Ways total का मतलब total बनाने वाली ordered sequences का count। Last value v fix करो। | उससे पहले total minus v की कोई भी valid sequence हो सकती है। हर ऐसी sequence में v append करने से unique नई sequence बनती है। | Last value के cases अलग हैं, इसलिए उनके counts add करते हैं। Ways zero is one: empty sequence।',
'Dry run: ways one, ways zero से one। | Ways two बराबर ways one plus ways zero: two। Ways three बराबर ways two plus ways one: three। | Ways four बराबर ways three plus ways two: five।',
'Accepted code में total outer loop है, values inner loop। Value total से बड़ी हो तो skip; otherwise predecessor count add करो। | छोटे totals पहले ready हैं। Coins outer loop करके unordered combinations गिनने वाला pattern यहाँ मत लगाना।',
'Return ways target। A target और M values पर O of A times M time, O of A extra space। | कोई sequence न हो तो zero। All values positive हैं, इसलिए dependencies छोटे totals पर जाती हैं; zero या negatives allowed हों तो ये proof टूटेगा।'
],[
'Count ordered sequences from distinct positive values [1,2] summing to target4; return5 and count112,121,211 as different sequences.',
'Recursively choose each next value until the running sum reaches target or overshoots, counting every exact path.',
'Different recursive paths repeat the same remaining-total count. Minimum-coin optimization and unordered-combination counting solve different tasks and cannot replace ordered sequence counting.',
'ways[t] counts ordered sequences totaling t. Partition by last value v; append v to each sequence counted in ways[t-v]. Positive inputs ensure smaller predecessors; disjoint last values allow summing their counts. Seed ways[0]=1 for the empty sequence.',
'With values1,2, compute ways0=1, ways1=1, ways2=2, ways3=3 and ways4=5, enumerating1111,112,121,211,22 as a cross-check.',
'For target A and M values, total-outer/value-inner loops cost O(A M) time and O(A) auxiliary space under the bounded-answer model. No valid sequence returns zero; positivity is essential for this recurrence.'
],[
'Five ordered sequences1111,112,121,211,22 grouped under target4',
'Recursive target4 branches to remaining3 and2',
'Repeated remaining2 marked and ordered112 versus211 visibly distinct',
'Disjoint last-value groups append1 or2 to predecessor sequences',
'Ways array1,1,2,3,5 fills ascending; target4 adds3 and2',
'First exact source chunk seeds empty sequence and orders total before value',
'Remaining guarded accumulation/return and positivity/space qualification'
])

if __name__=='__main__':
    for rid,lesson in LESSONS.items():
        dest=BASE/rid;dest.mkdir(exist_ok=True,parents=True)
        (dest/'lesson.json').write_text(json.dumps(lesson,ensure_ascii=False,indent=2),encoding='utf-8')
        print(rid,lesson['folder'],sum(len(s) for s in lesson['copy'].values()))
