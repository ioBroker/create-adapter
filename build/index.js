"use strict";
// tslint:disable:no-var-requires
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:variable-name
const Enquirer = require("enquirer");
// @ts-ignore
const { prompt } = Enquirer;
function localize(question) {
    return Object.assign({}, question, { onRun() {
            this.isTrue = (input) => input === "j";
            this.isFalse = (input) => input === "n";
            this.default = question.initial ? "(J/n)" : "(j/N)";
        } });
}
const questions = [
    {
        type: "select",
        name: "language",
        message: "Mit welcher Sprache soll der Adapter programmiert werden?",
        choices: [
            "JavaScript",
            "TypeScript",
        ],
    },
    localize({
        type: "confirm",
        name: "really",
        message: "Wirklich?",
        initial: false,
        condition: { name: "language", value: "JavaScript" },
        action: (val) => {
            if (val) {
                console.log("Du bist unbelehrbar!");
            }
            else {
                console.log("gut so!");
            }
            return Promise.resolve(!val);
        },
    }),
];
const enquirer = new Enquirer();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let answers = {};
        for (const q of questions) {
            if (q.condition == undefined || answers[q.condition.name] === q.condition.value) {
                const answer = yield prompt([q]);
                if (q.action && !(yield q.action(answer[q.name]))) {
                    process.exit(1);
                }
                answers = Object.assign({}, answers, answer);
            }
        }
        console.dir(answers);
    });
}
main().catch(console.error);
//# sourceMappingURL=index.js.map