"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBestWords = void 0;
function socreLetters(words) {
    const scores = [{}, {}, {}, {}, {}];
    words.forEach(word => {
        for (let i = 0; i < word.length; i++) {
            const l = word[i]; //the letter
            scores[i][l] = (scores[i][l]) ? scores[i][l] + 1 : 1;
        }
    });
    return scores;
}
function countUniqueLetters(word) {
    const counts = {};
    for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        counts[letter] = true;
    }
    return Object.keys(counts).length;
}
function findBestWords(words, onlyUnique) {
    const scores = socreLetters(words);
    let lowest = Number.MAX_SAFE_INTEGER;
    let best = [];
    words.forEach((e) => {
        //skiping if word it doen't have 5 unique lettets
        if (onlyUnique && countUniqueLetters(e) != 5)
            return;
        //finding average
        let average = 0;
        for (let i = 0; i < e.length; i++) {
            const l = e[i];
            const value = scores[i][l];
            average += value;
        }
        average = average / e.length;
        if (average < lowest) {
            lowest = average;
            best = [e];
        }
        else if (average == lowest) {
            best.push(e);
        }
    });
    return best;
}
exports.findBestWords = findBestWords;
//# sourceMappingURL=bestword.js.map