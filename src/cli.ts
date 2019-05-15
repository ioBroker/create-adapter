import { blueBright, green, red, underline } from "ansi-colors";
import { prompt } from "enquirer";
import * as fs from "fs-extra";
import * as path from "path";
import * as yargs from "yargs";
import {
	createFiles,
	File,
	testCondition,
	writeFiles,
} from "./lib/createAdapter";
import {
	Answers,
	isQuestionGroup,
	Question,
	questionsAndText,
} from "./lib/questions";
import { error, executeCommand, isWindows } from "./lib/tools";

/** Where the output should be written */
const rootDir = path.resolve((yargs.argv.target as string) || process.cwd());

const creatorOptions = {
	skipAdapterExistenceCheck: !!yargs.argv.skipAdapterExistenceCheck,
};

/** Asks a series of questions on the CLI */
async function ask(): Promise<Answers> {
	let answers: Record<string, any> = { cli: true };

	async function askQuestion(q: Question): Promise<void> {
		if (testCondition(q.condition, answers)) {
			// Make properties dependent on previous answers
			if (typeof q.initial === "function") {
				q.initial = q.initial(answers);
			}
			while (true) {
				let answer: Record<string, any>;
				if (
					answers.expert === "yes" &&
					q.expert &&
					q.initial !== undefined
				) {
					// In expert mode, prefill the default answer for expert questions
					answer = { [q.name as string]: q.initial };
				} else {
					// Ask the user for an answer
					try {
						answer = await prompt(q);
						// Cancel the process if necessary
						if (answer[q.name as string] == undefined)
							throw new Error();
					} catch (e) {
						error(e.message || "Adapter creation canceled!");
						return process.exit(1);
					}
				}
				// Apply an optional transformation
				if (typeof q.resultTransform === "function") {
					const transformed = q.resultTransform(
						answer[q.name as string],
					);
					answer[q.name as string] =
						transformed instanceof Promise
							? await transformed
							: transformed;
				}
				// Test the result
				if (q.action != undefined) {
					const testResult = await q.action(
						answer[q.name as string],
						creatorOptions,
					);
					if (typeof testResult === "string") {
						error(testResult);
						continue;
					}
				}
				// And remember it
				answers = { ...answers, ...answer };
				break;
			}
		}
	}

	for (const entry of questionsAndText) {
		if (typeof entry === "string") {
			// Headlines
			console.log(entry);
		} else if (isQuestionGroup(entry)) {
			// only print the headline if any of the questions are necessary
			if (
				entry.questions.find(qq => testCondition(qq.condition, answers))
			) {
				console.log();
				console.log(underline(entry.headline));
			}
			for (const qq of entry.questions) {
				await askQuestion(qq);
			}
		} else {
			// actual questions
			await askQuestion(entry);
		}
	}
	return answers as Answers;
}

let currentStep = 0;
let maxSteps = 1;
function logProgress(message: string): void {
	console.log(blueBright(`[${++currentStep}/${maxSteps}] ${message}...`));
}

/** Whether dependencies should be installed */
const installDependencies = !yargs.argv.noInstall || !!yargs.argv.install;
/** Whether an initial build should be performed */
let buildTypeScript: boolean;
/** Whether the initial commit should be performed automatically */
let gitCommit: boolean;

/** CLI-specific functionality for creating the adapter directory */
// eslint-disable-next-line @typescript-eslint/camelcase
async function setupProject_CLI(
	answers: Answers,
	files: File[],
): Promise<void> {
	const rootDirName = path.basename(rootDir);
	// make sure we are working in a directory called ioBroker.<adapterName>
	const targetDir =
		rootDirName.toLowerCase() ===
		`iobroker.${answers.adapterName.toLowerCase()}`
			? rootDir
			: path.join(rootDir, `ioBroker.${answers.adapterName}`);
	await writeFiles(targetDir, files);

	if (installDependencies) {
		logProgress("Installing dependencies");
		await executeCommand(
			isWindows ? "npm.cmd" : "npm",
			["install", "--quiet"],
			{ cwd: targetDir },
		);

		if (buildTypeScript) {
			logProgress("Compiling TypeScript");
			await executeCommand(
				isWindows ? "npm.cmd" : "npm",
				["run", "build"],
				{ cwd: targetDir, stdout: "ignore" },
			);
		}
	}

	if (gitCommit) {
		logProgress("Initializing git repo");
		// As described here: https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/
		const gitUrl =
			answers.gitRemoteProtocol === "HTTPS"
				? `https://github.com/${answers.authorGithub}/ioBroker.${
						answers.adapterName
				  }`
				: `git@github.com:${answers.authorGithub}/ioBroker.${
						answers.adapterName
				  }.git`;
		const gitCommandArgs = [
			["init"],
			["add", "."],
			["commit", "-m", "Initial commit"],
			["remote", "add", "origin", gitUrl],
		];
		for (const args of gitCommandArgs) {
			await executeCommand("git", args, {
				cwd: targetDir,
				stdout: "ignore",
				stderr: "ignore",
			});
		}
	}

	console.log();
	console.log(blueBright("All done! Have fun programming! ") + red("♥"));
}

// Enable CI testing without stalling
if (process.env.TEST_STARTUP) {
	console.log(green("Startup test succeeded - exiting..."));
	throw process.exit(0);
}

(async function main() {
	const answers = await ask();

	if (installDependencies) {
		maxSteps++;
		buildTypeScript = answers.language === "TypeScript";
		if (buildTypeScript) maxSteps++;
	}
	gitCommit = answers.gitCommit === "yes";
	if (gitCommit) maxSteps++;

	logProgress("Generating files");
	const files = await createFiles(answers);

	await setupProject_CLI(answers, files);
})();

process.on("exit", () => {
	if (fs.pathExistsSync("npm-debug.log")) fs.removeSync("npm-debug.log");
});
