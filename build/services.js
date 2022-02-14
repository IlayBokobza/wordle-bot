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
exports.Services = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs_1 = __importDefault(require("fs"));
class Services {
    static typeWord(word, page) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < word.length; i++) {
                const letter = word[i];
                yield page.keyboard.press(letter);
            }
        });
    }
    static getDataFromGame(page, r) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield page.evaluate((row) => {
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
                const tilesNode = document.querySelector("body > game-app").shadowRoot.querySelector(`#board > game-row:nth-child(${row})`).shadowRoot.querySelectorAll("div > game-tile");
                const tiles = Array.from(tilesNode);
                const data = tiles.map((e, i) => {
                    return {
                        letter: e.shadowRoot.querySelector('div').textContent,
                        value: parseEvaluation(e.getAttribute('evaluation'), i + 1)
                    };
                });
                return data;
            }, r);
        });
    }
    static nextWord(page, startingWith) {
        return __awaiter(this, void 0, void 0, function* () {
            yield page.evaluate(() => {
                var _a, _b;
                const btn = (_b = (_a = document === null || document === void 0 ? void 0 : document.querySelector("body > game-app")) === null || _a === void 0 ? void 0 : _a.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("#randomize");
                btn.click();
            });
            yield page.waitForTimeout(500);
            yield page.click('body');
            yield Services.typeWord(startingWith, page);
        });
    }
    static setup(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            const broswer = yield puppeteer_1.default.launch({ headless: false });
            const page = yield broswer.newPage();
            if (settings.daily) {
                yield page.goto('https://www.nytimes.com/games/wordle/index.html');
            }
            else {
                yield page.goto('https://wordle.berknation.com/');
            }
            yield page.waitForTimeout(1000);
            yield page.click('body');
            return [page, broswer];
        });
    }
    static sleep(t) {
        return new Promise(resolve => {
            setTimeout(resolve, t);
        });
    }
    static loadSettings() {
        const data = JSON.parse(fs_1.default.readFileSync('settings.json').toString());
        return data;
    }
}
exports.Services = Services;
//# sourceMappingURL=services.js.map