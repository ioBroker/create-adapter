"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeguards_1 = require("alcalzone-shared/typeguards");
const ansi_colors_1 = require("ansi-colors");
const enquirer_1 = require("enquirer");
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const yargs = require("yargs");
const questions_1 = require("./lib/questions");
const tools_1 = require("./lib/tools");
/** Where the output should be written */
const rootDir = path.resolve(yargs.argv.target || process.cwd());
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
async function ask() {
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
                const answer = await enquirer_1.prompt(q);
                // Cancel the process if necessary
                if (answer[q.name] == undefined) {
                    tools_1.error("Adapter creation canceled");
                    process.exit(1);
                }
                // Apply an optional transformation
                if (typeof q.resultTransform === "function") {
                    const transformed = q.resultTransform(answer[q.name]);
                    answer[q.name] = transformed instanceof Promise ? await transformed : transformed;
                }
                // Test the result
                if (q.action != undefined) {
                    const testResult = await q.action(answer[q.name]);
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
}
async function createFiles(answers) {
    const templateDir = path.join(__dirname, "./templates");
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
async function writeFiles(targetDir, files) {
    // write the files and make sure the target dirs exist
    for (const file of files) {
        await fs.outputFile(path.join(targetDir, file.name), file.content, typeof file.content === "string" ? "utf8" : undefined);
    }
}
async function main() {
    const answers = await ask();
    const rootDirName = path.basename(rootDir);
    // make sure we are working in a directory called ioBroker.<adapterName>
    const targetDir = rootDirName.toLowerCase() === `iobroker.${answers.adapterName.toLowerCase()}`
        ? rootDir : path.join(rootDir, `ioBroker.${answers.adapterName}`);
    console.log(ansi_colors_1.blueBright("[1/2] creating files..."));
    const files = await createFiles(answers);
    await writeFiles(targetDir, files);
    if (!yargs.argv.noInstall || !!yargs.argv.install) {
        console.log(ansi_colors_1.blueBright("[2/2] installing dependencies..."));
        await tools_1.executeCommand(tools_1.isWindows ? "npx.cmd" : "npx", ["npm-check-updates", "-u", "-s"], { cwd: targetDir, stdout: "ignore", stderr: "ignore" });
        await tools_1.executeCommand(tools_1.isWindows ? "npm.cmd" : "npm", ["install", "--quiet"], { cwd: targetDir });
    }
    console.log(ansi_colors_1.blueBright("All done! Have fun programming! ") + ansi_colors_1.red("♥"));
}
main();
process.on("exit", () => {
    if (fs.pathExistsSync("npm-debug.log"))
        fs.removeSync("npm-debug.log");
});
