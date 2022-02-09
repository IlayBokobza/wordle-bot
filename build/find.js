"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findWords = void 0;
function findWords(req, words) {
    return words.filter(i => {
        i = i.toLocaleLowerCase();
        // checks letters
        const r1 = i[0] == req.l1 || !req.l1;
        const r2 = i[1] == req.l2 || !req.l2;
        const r3 = i[2] == req.l3 || !req.l3;
        const r4 = i[3] == req.l4 || !req.l4;
        const r5 = i[4] == req.l5 || !req.l5;
        if (!r1 || !r2 || !r3 || !r4 || !r5) {
            return false;
        }
        //checks excluded letters
        const er1 = i[0] != req.el1 || !req.el1;
        const er2 = i[1] != req.el2 || !req.el2;
        const er3 = i[2] != req.el3 || !req.el3;
        const er4 = i[3] != req.el4 || !req.el4;
        const er5 = i[4] != req.el5 || !req.el5;
        if (!er1 || !er2 || !er3 || !er4 || !er5) {
            return false;
        }
        // check for include
        const include = [req.el1, req.el2, req.el3, req.el4, req.el5].filter(i => i);
        for (let j = 0; j < include.length; j++) {
            const letter = include[j];
            if (!i.includes(letter)) {
                return false;
            }
        }
        // check for exclude
        for (let j = 0; j < req.exclude.length; j++) {
            const letter = req.exclude[j];
            if (i.includes(letter)) {
                return false;
            }
        }
        return true;
    });
}
exports.findWords = findWords;
