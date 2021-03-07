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
import { ImportContext } from "./lib/importContext";
import {
	Answers,
	isQuestionGroup,
	Question,
	questionsAndText,
} from "./lib/questions";
import { error, executeCommand, isWindows } from "./lib/tools";

/** Define command line arguments */
const argv = yargs
	.env("CREATE_ADAPTER")
	.strict()
	.usage("ioBroker adapter creator\n\nUsage: $0 [options]")
	.alias("h", "help")
	.alias("v", "version")
	.options({
		target: {
			alias: "t",
			type: "string",
			desc:
				"Output directory for adapter files\n(default: current directory)",
		},
		skipAdapterExistenceCheck: {
			alias: "x",
			type: "boolean",
			default: false,
			desc:
				"Skip check if an adapter with the same name already exists on npm",
		},
		replay: {
			alias: "r",
			type: "string",
			desc: "Replay answers from the given .create-adapter.json file",
		},
		import: {
			alias: "i",
			type: "string",
			desc:
				"Import answers from an existing adapter directory (must be the base directory of an adapter where you find io-package.json)",
		},
		noInstall: {
			alias: "n",
			type: "boolean",
			default: false,
			desc: "Skip installation of dependencies",
		},
		install: {
			alias: "d",
			hidden: true,
			type: "boolean",
			default: false,
			desc: "Force installation of dependencies",
		},
	}).argv;

/** Where the output should be written */
const rootDir = path.resolve(argv.target || process.cwd());

const creatorOptions = {
	skipAdapterExistenceCheck:
		!!argv.skipAdapterExistenceCheck || !!argv.import,
};

/** Asks a series of questions on the CLI */
async function ask(): Promise<Answers> {
	let answers: Record<string, any> = { cli: true };
	let importContext: ImportContext | undefined = undefined;

	if (!!argv.replay) {
		const replayFile = path.resolve(argv.replay);
		const json = await fs.readFile(replayFile, "utf8");
		answers = JSON.parse(json);
		answers.replay = replayFile;
	}

	if (!!argv.import) {
		try {
			const importDirectory = path.resolve(argv.import);
			importContext = new ImportContext(importDirectory);
		} catch (error) {
			console.error(error);
			throw new Error(
				"Please ensure that --import points to a valid adapter directory",
			);
		}
		if (importContext.fileExists(".create-adapter.json")) {
			// it's just not worth trying to figure out things if the adapter was already created with create-adapter
			throw new Error(
				"Use --replay instead of --import for an adapter created with a recent version of create-adapter.",
			);
		}
	}

	async function askQuestion(q: Question): Promise<void> {
		if (testCondition(q.condition, answers)) {
			// Make properties dependent on previous answers
			if (typeof q.initial === "function") {
				q.initial = q.initial(answers);
			}
			if (importContext && q.import) {
				q.initial = q.import(importContext, answers, q);
			}
			while (true) {
				let answer: Record<string, any>;
				if (answers.hasOwnProperty(q.name as string)) {
					// answer was loaded using the "replay" feature
					answer = { [q.name as string]: answers[q.name as string] };
				} else {
					if (
						answers.expert !== "yes" &&
						q.expert &&
						q.initial !== undefined
					) {
						// In non-expert mode, prefill the default answer for expert questions
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
		} else if (typeof entry === "function") {
			// Conditional headlines
			const text = entry(answers);
			if (text !== undefined) {
				console.log(text);
			}
		} else if (isQuestionGroup(entry)) {
			// only print the headline if any of the questions are necessary
			if (
				entry.questions.find((qq) =>
					testCondition(qq.condition, answers),
				)
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
const installDependencies = !argv.noInstall || !!argv.install;
/** Whether an initial build should be performed */
let needsBuildStep: boolean;
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

		if (needsBuildStep) {
			logProgress("Compiling source files");
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
				? `https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}`
				: `git@github.com:${answers.authorGithub}/ioBroker.${answers.adapterName}.git`;
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
		needsBuildStep =
			answers.language === "TypeScript" ||
			answers.adminReact === "yes" ||
			answers.tabReact === "yes";
		if (needsBuildStep) maxSteps++;
	}
	gitCommit = answers.gitCommit === "yes";
	if (gitCommit) maxSteps++;

	logProgress("Generating files");
	const files = await createFiles(answers);

	await setupProject_CLI(answers, files);
})().catch((error) => console.error(error));

process.on("exit", () => {
	if (fs.pathExistsSync("npm-debug.log")) fs.removeSync("npm-debug.log");
});
