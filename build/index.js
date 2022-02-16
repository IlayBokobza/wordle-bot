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
const services_1 = require("./services");
const find_1 = require("./find");
const log_1 = require("./log");
const bestword_1 = require("./bestword");
function play(page, words, settings) {
    return __awaiter(this, void 0, void 0, function* () {
        log_1.Log.reset();
        if (!settings.daily) {
            yield services_1.Services.nextWord(page, settings.startWith);
        }
        yield services_1.Services.typeWord(settings.startWith, page);
        yield page.keyboard.press('Enter');
        yield services_1.Services.sleep(2250);
        let data = yield services_1.Services.getDataFromGame(page, 1);
        let isCorrect = null;
        let secondWord = null;
        for (let i = 1; i <= 5; i++) {
            yield page.click('body');
            const options = { exclude: [] };
            data.forEach(e => {
                if (e.value == 'exclude') {
                    options.exclude.push(e.letter);
                    return;
                }
                options[e.value] = e.letter;
            });
            words = find_1.findWords(options, words);
            let word = "";
            if (words.length >= 20) {
                const bestwords = bestword_1.findBestWords(words);
                const randomIndex = Math.floor(Math.random() * bestwords.length);
                word = bestwords[randomIndex];
                console.log(`Too many options (${words.length}), using statistically better word: ${word}`);
            }
            else {
                const randomIndex = Math.floor(Math.random() * words.length);
                word = words[randomIndex];
            }
            // logs
            log_1.Log.add(JSON.stringify(words));
            log_1.Log.add(JSON.stringify(options));
            log_1.Log.add(JSON.stringify({ word, length: words.length }));
            log_1.Log.add("##############");
            yield services_1.Services.typeWord(word, page);
            yield page.keyboard.press('Enter');
            yield services_1.Services.sleep(2250);
            //gets new data from game
            data = yield services_1.Services.getDataFromGame(page, i + 1);
            isCorrect = true;
            data.forEach(e => {
                if (!/^l[1-5]/.test(e.value)) {
                    isCorrect = false;
                }
            });
            if (isCorrect) {
                console.log(`Done, The word was: ${word.toUpperCase()}`);
                log_1.Log.add(`The words is: ${word}`);
                break;
            }
        }
        if (!isCorrect) {
            console.log('FAIL, Got unlucky');
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let words = JSON.parse(fs_1.default.readFileSync('./data.json').toString());
        const settings = services_1.Services.loadSettings();
        let [p] = yield services_1.Services.setup(settings);
        const page = p;
        do {
            yield play(page, words, settings);
        } while (!settings.daily);
    });
}
main();
//# sourceMappingURL=index.js.map