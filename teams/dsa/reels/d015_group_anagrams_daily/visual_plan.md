# Visual plan · 4 November 2026

| Scene | Spoken beat | Picture | Labels | Built with |
|---|---|---|---|---|
| A | Group the matching words | Six outlined array cells hold the actual six input words and preserve their original order. | Given array, eat tea tan ate nat bat, Lowercase a–z | Custom SVG and phrase-aligned GSAP |
| B | Same letters, same counts | Three count-signature nodes connect through arrows to the matching grouped word lists. | eat / tea / ate, tan / nat, bat | Custom SVG and phrase-aligned GSAP |
| C | A signature per word | Three horizontal arrow paths map eat tea and ate into the same sorted signature aet. | eat → aet, tea → aet, signature → bucket | Custom SVG and phrase-aligned GSAP |
| D | Count instead of sort | Aligned alphabet columns a b e n t have count cells one zero one zero one directly beneath. | 26 counts, a:1 e:1 t:1, Others: 0 | Custom SVG and phrase-aligned GSAP |
| E | Build the buckets | Three dictionary-key nodes feed separate bucket lists while the currently narrated group changes highlight. | a/e/t → eat tea ate, a/n/t → tan nat, a/b/t → bat | Custom SVG and phrase-aligned GSAP |
| F | Why not a set? | Two letter-multiplicity examples share the same unique-letter set but show unequal frequency counts underneath. | aab: a2 b1, abb: a1 b2, Counts differ | Custom SVG and phrase-aligned GSAP |
| G | Actual Python | A complete readable Python panel highlights the actual count loop then tuple key append and return lines. | CODE | Custom SVG and phrase-aligned GSAP |
| H | Executed and checked | Executed test-result panels switch to empty-string zero keys and duplicate-preserving output list examples. | 5,000 random cases, Empty string → zero key, Keep duplicates | Custom SVG and phrase-aligned GSAP |
| I | Time and space | Formula panels distinguish total characters C and word count n then show the derived time and storage costs. | Time: O(C + 26n), Fixed alphabet: O(C+n), Extra space: O(n) | Custom SVG and phrase-aligned GSAP |
| J | Quick check | Two input cells aab and abb have separate frequency summaries underneath for the audience comparison. | Same counts → same key, aab / abb → ?, Follow for daily DSA | Custom SVG and phrase-aligned GSAP |
