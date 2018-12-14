"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeguards_1 = require("alcalzone-shared/typeguards");
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const tools_1 = require("./tools");
const templateDir = path.join(__dirname, "../templates");
function testCondition(condition, answers) {
    if (condition == undefined)
        return true;
    function testSingleCondition(cond) {
        if ("value" in cond) {
            return answers[cond.name] === cond.value;
        }
        else if ("contains" in cond) {
            return answers[cond.name].indexOf(cond.contains) > -1;
        }
        return false;
    }
    if (typeguards_1.isArray(condition)) {
        return condition.every(cond => testSingleCondition(cond));
    }
    else {
        return testSingleCondition(condition);
    }
}
exports.testCondition = testCondition;
async function createFiles(answers) {
    const files = await Promise.all(tools_1.enumFilesRecursiveSync(templateDir, (name, parentDir) => {
        const fullName = path.join(parentDir, name);
        const isDirectory = fs.statSync(fullName).isDirectory();
        return isDirectory || /\.js$/.test(name);
    }).map(async (f) => {
        const templateFunction = require(f);
        const customPath = typeof templateFunction.customPath === "function" ? templateFunction.customPath(answers)
            : typeof templateFunction.customPath === "string" ? templateFunction.customPath
                : path.relative(templateDir, f).replace(/\.js$/i, "");
        const templateResult = templateFunction(answers);
        return {
            name: customPath,
            content: templateResult instanceof Promise ? await templateResult : templateResult,
            noReformat: templateFunction.noReformat === true,
        };
    }));
    const necessaryFiles = files.filter(f => f.content != undefined);
    return formatFiles(answers, necessaryFiles);
}
exports.createFiles = createFiles;
/** Formats files that are not explicitly forbidden to be formatted */
function formatFiles(answers, files) {
    // Normalize indentation considering user preference
    const indentation = answers.indentation === "Tab" ? tools_1.indentWithTabs : tools_1.indentWithSpaces;
    // Remove multiple subsequent empty lines (can happen during template creation).
    const emptyLines = (text) => {
        return text && text
            .replace(/\r\n/g, "\n")
            .replace(/^(\s*\n){2,}/gm, "\n")
            .replace(/\n/g, os.EOL);
    };
    const formatter = (text) => emptyLines(indentation(text));
    return files.map(f => (f.noReformat || typeof f.content !== "string") ? f
        : Object.assign({}, f, { content: formatter(f.content) }));
}
