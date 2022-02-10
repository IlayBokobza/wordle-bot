"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const fs_1 = __importDefault(require("fs"));
class Log {
    static reset() {
        fs_1.default.writeFileSync(this.path, '');
    }
    static add(msg) {
        fs_1.default.writeFileSync(this.path, `${this.get()}${msg}\n`);
    }
    static get() {
        return fs_1.default.readFileSync(this.path).toString();
    }
}
exports.Log = Log;
Log.path = "logs.log";
//# sourceMappingURL=log.js.map