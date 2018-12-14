"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_colors_1 = require("ansi-colors");
const enquirer_1 = require("enquirer");
const fs = require("fs-extra");
const path = require("path");
const yargs = require("yargs");
const createAdapter_1 = require("./lib/createAdapter");
const questions_1 = require("./lib/questions");
const tools_1 = require("./lib/tools");
/** Where the output should be written */
const rootDir = path.resolve(yargs.argv.target || process.cwd());
/** Asks a series of questions on the CLI */
async function ask() {
    let answers = {};
    for (const q of questions_1.questions) {
        // Headlines
        if (typeof q === "string") {
            console.log(q);
            continue;
        }
        // actual questions
        if (createAdapter_1.testCondition(q.condition, answers)) {
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
    return answers;
}
async function writeFiles(targetDir, files) {
    // write the files and make sure the target dirs exist
    for (const file of files) {
        await fs.outputFile(path.join(targetDir, file.name), file.content, typeof file.content === "string" ? "utf8" : undefined);
    }
}
/** CLI-specific functionality for creating the adapter directory */
async function setupProject_CLI({ answers, files }) {
    const rootDirName = path.basename(rootDir);
    // make sure we are working in a directory called ioBroker.<adapterName>
    const targetDir = rootDirName.toLowerCase() === `iobroker.${answers.adapterName.toLowerCase()}`
        ? rootDir : path.join(rootDir, `ioBroker.${answers.adapterName}`);
    await writeFiles(targetDir, files);
    if (!yargs.argv.noInstall || !!yargs.argv.install) {
        console.log(ansi_colors_1.blueBright("[2/2] Installing dependencies..."));
        await tools_1.executeCommand(tools_1.isWindows ? "npm.cmd" : "npm", ["install", "--quiet"], { cwd: targetDir });
    }
    console.log(ansi_colors_1.blueBright("All done! Have fun programming! ") + ansi_colors_1.red("♥"));
}
ask()
    .then(async (answers) => {
    console.log(ansi_colors_1.blueBright("[1/2] Generating files..."));
    return {
        answers,
        files: await createAdapter_1.createFiles(answers),
    };
})
    .then(setupProject_CLI);
process.on("exit", () => {
    if (fs.pathExistsSync("npm-debug.log"))
        fs.removeSync("npm-debug.log");
});
