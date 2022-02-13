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
function play(page, words, daily) {
    return __awaiter(this, void 0, void 0, function* () {
        log_1.Log.reset();
        if (daily) {
            yield page.click('body');
        }
        else {
            yield services_1.Services.nextWord(page);
        }
        yield services_1.Services.typeWord('arise', page);
        yield page.keyboard.press('Enter');
        yield services_1.Services.sleep(2250);
        let i = 1;
        let data = yield services_1.Services.getDataFromGame(page, i);
        while (i != -1) {
            const options = { exclude: [] };
            data.forEach(e => {
                if (e.value == 'exclude') {
                    options.exclude.push(e.letter);
                    return;
                }
                options[e.value] = e.letter;
            });
            words = (0, find_1.findWords)(options, words);
            const randomIndex = Math.floor(Math.random() * words.length);
            const word = words[randomIndex];
            // logs
            log_1.Log.add(JSON.stringify(words));
            log_1.Log.add(JSON.stringify(options));
            log_1.Log.add(JSON.stringify({ word, randomIndex, length: words.length }));
            log_1.Log.add("##############");
            //remove last word from list
            words.splice(randomIndex, 1);
            yield services_1.Services.typeWord(word, page);
            yield page.keyboard.press('Enter');
            yield services_1.Services.sleep(2250);
            i++;
            //gets new data from game
            data = yield services_1.Services.getDataFromGame(page, i);
            let isCorrect = true;
            data.forEach(e => {
                if (!/^l[1-5]/.test(e.value)) {
                    isCorrect = false;
                }
            });
            if (isCorrect || i == 6) {
                i = -1;
                if (isCorrect) {
                    console.log(`Done, The word was: ${word.toUpperCase()}`);
                    log_1.Log.add(`The words is: ${word}`);
                }
                else {
                    console.log('FAIL, Got unlucky');
                }
            }
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let words = JSON.parse(fs_1.default.readFileSync('./data.json').toString());
        let [p] = yield services_1.Services.setup();
        const page = p;
        const settings = services_1.Services.loadSettings();
        do {
            yield play(page, words, settings.daily);
        } while (settings.loop);
    });
}
main();
//# sourceMappingURL=index.js.map