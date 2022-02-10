"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const find_1 = require("./find");
const words = [
    'curvy', 'forum',
    'furor', 'humor',
    'juror', 'murky',
    'occur', 'ruddy',
    'rumor', 'thrum',
    'tumor', 'tutor'
];
const options = { exclude: ['r'], l2: 'u', l3: 'm', l4: 'o', l5: 'r' };
(() => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, find_1.findWords)(options, words);
    console.log(res);
}))();
//# sourceMappingURL=temp.js.map