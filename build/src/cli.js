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
    let answers = { cli: true };
    async function askQuestion(q) {
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
                    return process.exit(1);
                }
                // Apply an optional transformation
                if (typeof q.resultTransform === "function") {
                    const transformed = q.resultTransform(answer[q.name]);
                    answer[q.name] = transformed instanceof Promise ? await transformed : transformed;
                }
                // Test the result
                if (q.action != undefined) {
                    const testResult = await q.action(answer[q.name]);
                    if (typeof testResult === "string") {
                        tools_1.error(testResult);
                        continue;
                    }
                }
                // And remember it
                answers = Object.assign({}, answers, answer);
                break;
            }
        }
    }
    for (const entry of questions_1.questionsAndText) {
        if (typeof entry === "string") {
            // Headlines
            console.log(entry);
        }
        else if (questions_1.isQuestionGroup(entry)) {
            // only print the headline if any of the questions are necessary
            if (entry.questions.find(qq => createAdapter_1.testCondition(qq.condition, answers))) {
                console.log();
                console.log(ansi_colors_1.underline(entry.headline));
            }
            for (const qq of entry.questions) {
                await askQuestion(qq);
            }
        }
        else {
            // actual questions
            await askQuestion(entry);
        }
    }
    return answers;
}
let currentStep = 0;
let maxSteps = 1;
function logProgress(message) {
    console.log(ansi_colors_1.blueBright(`[${++currentStep}/${maxSteps}] ${message}...`));
}
/** Whether dependencies should be installed */
const installDependencies = !yargs.argv.noInstall || !!yargs.argv.install;
/** Whether an initial build should be performed */
let buildTypeScript;
/** Whether the initial commit should be performed automatically */
let gitCommit;
/** CLI-specific functionality for creating the adapter directory */
async function setupProject_CLI(answers, files) {
    const rootDirName = path.basename(rootDir);
    // make sure we are working in a directory called ioBroker.<adapterName>
    const targetDir = rootDirName.toLowerCase() === `iobroker.${answers.adapterName.toLowerCase()}`
        ? rootDir : path.join(rootDir, `ioBroker.${answers.adapterName}`);
    await createAdapter_1.writeFiles(targetDir, files);
    if (installDependencies) {
        logProgress("Installing dependencies");
        await tools_1.executeCommand(tools_1.isWindows ? "npm.cmd" : "npm", ["install", "--quiet"], { cwd: targetDir });
        if (buildTypeScript) {
            logProgress("Compiling TypeScript");
            await tools_1.executeCommand(tools_1.isWindows ? "npm.cmd" : "npm", ["run", "build"], { cwd: targetDir, stdout: "ignore" });
        }
    }
    if (gitCommit) {
        logProgress("Initializing git repo");
        // As described here: https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/
        const gitCommandArgs = [
            ["init"],
            ["add", "."],
            ["commit", "-m", `"Initial commit"`],
            ["remote", "add", "origin", `https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}`],
        ];
        for (const args of gitCommandArgs) {
            await tools_1.executeCommand("git", args, { cwd: targetDir, stdout: "ignore", stderr: "ignore" });
        }
    }
    console.log();
    console.log(ansi_colors_1.blueBright("All done! Have fun programming! ") + ansi_colors_1.red("♥"));
}
// Enable CI testing without stalling
if (process.env.TEST_STARTUP) {
    console.log(ansi_colors_1.green("Startup test succeeded - exiting..."));
    throw process.exit(0);
}
(async function main() {
    const answers = await ask();
    if (installDependencies) {
        maxSteps++;
        buildTypeScript = answers.language === "TypeScript";
        if (buildTypeScript)
            maxSteps++;
    }
    gitCommit = answers.gitCommit === "yes";
    if (gitCommit)
        maxSteps++;
    logProgress("Generating files");
    const files = await createAdapter_1.createFiles(answers);
    await setupProject_CLI(answers, files);
})();
process.on("exit", () => {
    if (fs.pathExistsSync("npm-debug.log"))
        fs.removeSync("npm-debug.log");
});
