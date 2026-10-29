# Visual plan: a011 A neural network in one picture (weights and layers)

Idea in one line:
A neural network is only numbers: each neuron multiplies inputs by weights, adds a bias, applies ReLU; the model file is the list of those 9 numbers; training changes them.
The picture that explains it with the sound off: one tiny network (2 inputs, 2 ReLU neurons, 1 output) drawn once with its real weights, and the real numbers of the run (2,3 gives 3; 3,2 gives 5) flowing through it. No analogy.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | model file is only numbers, where is AI | A file card model.safetensors opens to a wall of 20 numbers; a gold ring says these numbers are the model; one cell links down to a dial whose arm sweeps up (more) then down (less) | model.safetensors, EXAMPLE, THE MODEL, WEIGHT, MORE, LESS | custom DOM, dial arm tween |
| B | tiny network, inputs 2 and 3, multiply, add, bias | Network skeleton drawn: two input circles holding 2 and 3, two hidden circles, one output circle, edges draw in; three pills pop on multiply, add, bias | TINY NETWORK, EXAMPLE, x WEIGHT, SUM, + BIAS | custom DOM + SVG lines |
| C | neuron 1: weights 1 and -1, bias 0, result -1 | Same network, neuron 1 ringed; weight pills x1 and x-1 and bias +0 appear; two dots travel along the edges; a calc card writes 1x2 + (-1)x3 + 0 then = -1 and the neuron shows -1 in red | NEURON 1, x1, x-1, +0, -1 | custom |
| D | ReLU: negative becomes zero, no ReLU = straight line | A graph: flat red line left of zero, green diagonal right of it; a dot at -1 slides up onto the flat part and reads 0; three layer chips then collapse to one straight line | RELU, -1, 0, 3 LAYERS, STRAIGHT LINE | custom SVG graph |
| E | neuron 2: weights 2 and 1, bias -4, result 3 | Same network, neuron 2 ringed (neuron 1 dimmed showing 0); weight pills x2, x1, bias -4; dots travel; calc card 2x2 + 1x3 - 4 = 3; neuron shows 3 in green and a RELU tag says same | NEURON 2, x2, x1, -4, SAME | custom |
| F | two neurons are layer 1, output neuron takes results 0 and 3, answer 3 | Dashed frame around the two hidden neurons labelled LAYER 1; dots carry 0 and 3 into the output neuron; calc card 1x0 + 1x3 = 3; the output circle shows 3 with a gold ring | LAYER 1, OUTPUT, ANSWER | custom |
| G | 9 numbers: 6 weights and 3 biases; the file is just that list | Network with all 6 weight pills and 3 bias pills ringed in gold, big counter counts to 9 with 6 WEIGHTS and 3 BIASES pills; then the file card lists the nine numbers and two red tags NO RULES, NO TEXT | 9, 6 WEIGHTS, 3 BIASES, PARAMETERS, model.safetensors, NO RULES, NO TEXT | custom |
| H | input 3 and 2, same weights: hidden 1 and 4, answer 5; training changes dials | Same network, inputs swap to 3 and 2, hidden shows 1 and 4, output 5; a SAME FILE chip underneath; then three dials rotate under a TRAINING pill | NEW INPUT, SAME FILE, 5, TRAINING | custom |
| I | input 1 and 1: what answer? comment, follow | Two input tiles 1 and 1 feed a box into a big question mark inside a comment card; a fake comment bar; a FOLLOW pill that presses on follow | COMMENT, ?, + FOLLOW | recipe 11 |
