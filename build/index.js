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
const puppeteer_1 = __importDefault(require("puppeteer"));
const find_1 = require("./find");
let words = JSON.parse(fs_1.default.readFileSync('./data.json').toString());
function typeWord(word, page) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < word.length; i++) {
            const letter = word[i];
            yield page.keyboard.press(letter);
        }
    });
}
function getDataFromGame(page, row) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield page.evaluate(() => {
            function parseEvaluation(str, i) {
                switch (str) {
                    case "present":
                        return "el" + i;
                    case "correct":
                        return "l" + i;
                    case "absent":
                        return "exclude";
                    default:
                        return "";
                }
            }
            const tilesNode = document.querySelector("body > game-app").shadowRoot.querySelector(`#board > game-row:nth-child(${1})`).shadowRoot.querySelectorAll("div > game-tile");
            const tiles = Array.from(tilesNode);
            const data = tiles.map((e, i) => {
                return {
                    letter: e.shadowRoot.querySelector('div').textContent,
                    value: parseEvaluation(e.getAttribute('evaluation'), i + 1)
                };
            });
            return data;
        });
    });
}
function sleep(t) {
    return new Promise(resolve => {
        setTimeout(resolve, t);
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const broswer = yield puppeteer_1.default.launch({ headless: false });
    const page = yield broswer.newPage();
    yield page.goto('https://wordle.berknation.com/');
    // await page.waitForSelector('#game')
    yield page.waitForTimeout(1000);
    yield page.click('body');
    yield typeWord('arise', page);
    yield page.keyboard.press('Enter');
    yield sleep(2250);
    let i = 1;
    while (i != -1) {
        const data = yield getDataFromGame(page, i);
        const options = {};
        data.forEach(e => {
            options[e.value] = e.letter;
        });
        console.log(options);
        words = (0, find_1.findWords)(options, words);
        const randomIndex = Math.floor(Math.random() * words.length);
        const word = words[randomIndex];
        yield typeWord(word, page);
        yield page.keyboard.press('Enter');
        yield sleep(2250);
        i++;
        //temp
        if (i == 4) {
            i = -1;
        }
    }
}))();
