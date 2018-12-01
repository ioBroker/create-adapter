"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_colors_1 = require("ansi-colors");
const enquirer_1 = require("enquirer");
const fs = require("fs-extra");
const path = require("path");
const yargs = require("yargs");
const questions_1 = require("./lib/questions");
const tools_1 = require("./lib/tools");
/** Where the output should be written */
const rootDir = path.resolve(yargs.argv.target || process.cwd());
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
                const value = answer[q.name];
                if (value == undefined) {
                    tools_1.error("Adapter creation canceled");
                    process.exit(1);
                }
                // Apply an optional transformation
                if (typeof q.resultTransform === "function") {
                    answer[q.name] = q.resultTransform(answer[q.name]);
                }
                // Test the result
                if (q.action != undefined) {
                    const testResult = await q.action(value);
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
        return {
            name: templateFunction.customPath || path.relative(templateDir, f).replace(/\.js$/i, ""),
            content: await templateFunction(answers),
        };
    }));
    const necessaryFiles = files.filter(f => f.content != undefined);
    return necessaryFiles;
}
async function writeFiles(targetDir, files) {
    // write the files and make sure the target dirs exist
    for (const file of files) {
        await fs.outputFile(path.join(targetDir, file.name), file.content, "utf8");
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
        if (await fs.pathExists("npm-debug.log"))
            await fs.remove("npm-debug.log");
    }
    console.log(ansi_colors_1.blueBright("All done! Have fun programming! ") + ansi_colors_1.red("♥"));
}
main();
