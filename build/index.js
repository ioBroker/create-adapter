"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const enquirer_1 = require("enquirer");
const path = require("path");
const questions_1 = require("./lib/questions");
const tools_1 = require("./lib/tools");
function testCondition(condition, answers) {
    if (condition == undefined)
        return true;
    if ("value" in condition) {
        return answers[condition.name] === condition.value;
    }
    else if ("contains" in condition) {
        return answers[condition.name].indexOf(condition.contains) > -1;
    }
    return false;
}
function ask() {
    return __awaiter(this, void 0, void 0, function* () {
        let answers = {};
        for (const q of questions_1.questions) {
            // Headlines
            if (typeof q === "string") {
                console.log(q);
                continue;
            }
            // actual questions
            if (testCondition(q.condition, answers)) {
                // Make properties dependent on previous answers
                if (typeof q.initial === "function") {
                    q.initial = q.initial(answers);
                }
                while (true) {
                    // Ask the user for an answer
                    const answer = yield enquirer_1.prompt(q);
                    // Cancel the process if necessary
                    const value = answer[q.name];
                    if (value == undefined) {
                        console.error("Adapter creation canceled");
                        process.exit(1);
                    }
                    // Apply an optional transformation
                    if (typeof q.resultTransform === "function") {
                        answer[q.name] = q.resultTransform(answer[q.name]);
                    }
                    // Test the result
                    if (q.action != undefined) {
                        const testResult = yield q.action(value);
                        if (!testResult)
                            process.exit(1);
                        if (testResult === "retry")
                            continue;
                    }
                    // And remember it
                    answers = Object.assign({}, answers, answer);
                    break;
                }
            }
        }
        // console.dir(answers);
        return answers;
    });
}
function work(answers) {
    return __awaiter(this, void 0, void 0, function* () {
        const templateDir = "./build/templates";
        const files = yield Promise.all(tools_1.enumFilesRecursiveSync(templateDir, name => /\.js$/.test(name)).map(f => require(path.join("..", f))(answers)));
        console.log(files[0]);
    });
}
ask().then(work).catch(console.error);
//# sourceMappingURL=index.js.map