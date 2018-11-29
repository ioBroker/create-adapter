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
const ansi_colors_1 = require("ansi-colors");
const enquirer_1 = require("enquirer");
function styleMultiselect(ms) {
    return Object.assign({}, ms, {
        symbols: {
            indicator: {
                on: ansi_colors_1.green("■"),
                off: ansi_colors_1.dim.gray("□"),
            },
        },
    });
}
const questions = [
    {
        type: "select",
        name: "language",
        message: "Which language do you want to use to code the adapter?",
        choices: [
            "JavaScript",
            "TypeScript",
        ],
    },
    styleMultiselect({
        condition: { name: "language", value: "JavaScript" },
        type: "multiselect",
        name: "tools",
        message: "Which of the following tools do you want to use?",
        initial: [0, 1],
        choices: [
            { message: "ESLint", hint: "(recommended)" },
            { message: "type checking", hint: "(recommended)" },
        ],
    }),
    styleMultiselect({
        condition: { name: "language", value: "TypeScript" },
        type: "multiselect",
        name: "tools",
        message: "Which of the following tools do you want to use?",
        initial: [0],
        choices: [
            { message: "TSLint", hint: "(recommended)" },
            { message: "Code coverage" },
        ],
    }),
    styleMultiselect({
        type: "multiselect",
        name: "language-features",
        message: "Which of the following language features do you need?",
        initial: [0, 1, 2, 3],
        choices: [
            "String.pad{Start,End}",
            "async/await",
            "Promise.finally",
            "String.trim{Start,End}",
            "bigint",
            "Array.flat[Map]",
        ],
    }),
    {
        type: "select",
        name: "admin-react",
        message: "Use React for the Admin UI?",
        initial: "no",
        choices: ["yes", "no"],
    },
    {
        type: "select",
        name: "admin-tab",
        message: "Create a tab in the admin UI?",
        initial: "no",
        choices: ["yes", "no"],
    },
    {
        condition: { name: "admin-tab", value: "yes" },
        type: "select",
        name: "tab-react",
        message: "Use React for the tab?",
        initial: "no",
        choices: ["yes", "no"],
    },
    {
        type: "select",
        name: "widget",
        message: "Create a VIS widget?",
        initial: "no",
        choices: ["yes", "no"],
    },
];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let answers = {};
        for (const q of questions) {
            if (q.condition == undefined || answers[q.condition.name] === q.condition.value) {
                while (true) {
                    const answer = yield enquirer_1.prompt(q);
                    const value = answer[q.name];
                    if (value == undefined) {
                        console.error("Adapter creation canceled");
                        process.exit(1);
                    }
                    else if (q.action != undefined) {
                        const testResult = yield q.action(value);
                        if (!testResult)
                            process.exit(1);
                        if (testResult === "retry")
                            continue;
                    }
                    answers = Object.assign({}, answers, answer);
                    break;
                }
            }
        }
        console.dir(answers);
    });
}
main().catch(console.error);
//# sourceMappingURL=index.js.map