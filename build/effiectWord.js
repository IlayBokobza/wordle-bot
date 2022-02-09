"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMostUniqeWords = void 0;
function countWord(word) {
    const counts = {};
    for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        counts[letter] = true;
    }
    return Object.keys(counts).length;
}
function findMostUniqeWords(words) {
    let out = [];
    let mostUniqeLetters = 0;
    words.forEach((i) => {
        const length = countWord(i);
        if (length > mostUniqeLetters) {
            mostUniqeLetters = length;
            out = [i];
        }
        else if (length == mostUniqeLetters) {
            out.push(i);
        }
    });
    return out;
}
exports.findMostUniqeWords = findMostUniqeWords;
//# sourceMappingURL=effiectWord.js.map