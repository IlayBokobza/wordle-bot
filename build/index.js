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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const pageHelpers_1 = require("./pageHelpers");
const find_1 = require("./find");
(() => __awaiter(void 0, void 0, void 0, function* () {
    let words = JSON.parse(fs_1.default.readFileSync('./data.json').toString());
    let [p, b] = yield pageHelpers_1.PageHelper.setup();
    const page = p;
    const broswer = b;
    yield pageHelpers_1.PageHelper.nextWord(page);
    yield pageHelpers_1.PageHelper.typeWord('arise', page);
    yield page.keyboard.press('Enter');
    yield pageHelpers_1.PageHelper.sleep(2250);
    let i = 1;
    let data = yield pageHelpers_1.PageHelper.getDataFromGame(page, i);
    while (i != -1) {
        const options = { exclude: [] };
        data.forEach(e => {
            if (e.value == 'exclude') {
                options.exclude.push(e.letter);
                return;
            }
            options[e.value] = e.letter;
        });
        words = find_1.findWords(options, words);
        const randomIndex = Math.floor(Math.random() * words.length);
        const word = words[randomIndex];
        // console.log(words)
        // console.log(options)
        // console.log({word,randomIndex,length:words.length});
        // console.log('//////////')
        //remove last word from list
        words.splice(randomIndex, 1);
        yield pageHelpers_1.PageHelper.typeWord(word, page);
        yield page.keyboard.press('Enter');
        yield pageHelpers_1.PageHelper.sleep(2250);
        i++;
        //gets new data from game
        data = yield pageHelpers_1.PageHelper.getDataFromGame(page, i);
        let isCorrect = true;
        data.forEach(e => {
            if (!/^l[1-5]/.test(e.value)) {
                isCorrect = false;
            }
        });
        if (isCorrect || i == 7) {
            i = -1;
            console.log('DONE');
            yield pageHelpers_1.PageHelper.sleep(3000);
            yield broswer.close();
        }
    }
}))();
//# sourceMappingURL=index.js.map