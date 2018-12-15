"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeguards_1 = require("alcalzone-shared/typeguards");
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const templateFiles = require("../templates");
const tools_1 = require("./tools");
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
    const files = await Promise.all(templateFiles.map(async ({ name, templateFunction }) => {
        const customPath = typeof templateFunction.customPath === "function" ? templateFunction.customPath(answers)
            : typeof templateFunction.customPath === "string" ? templateFunction.customPath
                : name.replace(/\.ts$/i, "");
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
    const removeEmptyLines = (text) => {
        return text && text
            .replace(/\r\n/g, "\n")
            .replace(/^(\s*\n){2,}/gm, "\n")
            .replace(/\n/g, os.EOL);
    };
    const trimWhitespaceLines = (text) => text && text.replace(/^[ \t]+$/gm, "");
    const formatter = (text) => trimWhitespaceLines(removeEmptyLines(indentation(text)));
    return files.map(f => {
        if (f.noReformat || typeof f.content !== "string")
            return f;
        // 1st step: Apply formatters that are valid for all files
        f.content = formatter(f.content);
        // 2nd step: Apply more specialized formatters
        if (f.name.endsWith(".js") && answers.quotes != undefined) {
            f.content = tools_1.jsFixQuotes(f.content, answers.quotes);
        }
        return f;
    });
}
async function writeFiles(targetDir, files) {
    // write the files and make sure the target dirs exist
    for (const file of files) {
        await fs.outputFile(path.join(targetDir, file.name), file.content, typeof file.content === "string" ? "utf8" : undefined);
    }
}
exports.writeFiles = writeFiles;
