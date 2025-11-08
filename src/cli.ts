import { blueBright, bold, gray, green, red, reset, underline } from "ansi-colors";
import { prompt } from "enquirer";
import * as fs from "fs-extra";
import * as path from "path";
import * as semver from "semver";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import type { CheckResult } from "./lib/core/actionsAndTransformers";
import type { MigrationContextBase } from "./lib/core/migrationContextBase";
import type { Answers, Question, QuestionGroup } from "./lib/core/questions";
import { questionGroups, testCondition } from "./lib/core/questions";
import type { File } from "./lib/createAdapter";
import { createFiles, writeFiles } from "./lib/createAdapter";
import { LocalMigrationContext } from "./lib/localMigrationContext";
import { fetchPackageVersion } from "./lib/packageVersions";
import { error, executeCommand, executeNpmCommand, getOwnVersion, isWindows } from "./lib/tools";

export type ConditionalTitle = (answers: Record<string, any>) => string | undefined;

/** Define command line arguments */
const argv = yargs(hideBin(process.argv))
	.env("CREATE_ADAPTER")
	.strict()
	.usage("ioBroker adapter creator\n\nUsage: $0 [options]")
	.alias("h", "help")
	.alias("v", "version")
	.options({
		target: {
			alias: "t",
			type: "string",
			desc: "Output directory for adapter files\n(default: current directory)",
		},
		skipAdapterExistenceCheck: {
			alias: "x",
			type: "boolean",
			default: false,
			desc: "Skip check if an adapter with the same name already exists on npm",
		},
		replay: {
			alias: "r",
			type: "string",
			desc: "Replay answers from the given .create-adapter.json file",
		},
		migrate: {
			alias: "m",
			type: "string",
			desc: "Use answers from an existing adapter directory (must be the base directory of an adapter where you find io-package.json)",
		},
		noInstall: {
			alias: "n",
			type: "boolean",
			default: false,
			desc: "Skip installation of dependencies",
		},
		install: {
			alias: "i",
			hidden: true,
			type: "boolean",
			default: false,
			desc: "Force installation of dependencies",
		},
		ignoreOutdatedVersion: {
			type: "boolean",
			default: false,
			desc: "Skip check if this version is outdated",
		},
		nonInteractive: {
			type: "boolean",
			default: false,
			desc: "Run in non-interactive mode - error on missing answers instead of prompting",
		},
	})
	.parseSync();

/** Where the output should be written */
const rootDir = path.resolve(argv.target || process.cwd());

async function checkAdapterExistence(name: string): Promise<CheckResult> {
	try {
		await fetchPackageVersion(`iobroker.${name}`);
		return `The adapter ioBroker.${name} already exists!`;
	} catch {
		return true;
	}
}

const creatorOptions = {
	checkAdapterExistence: !argv.skipAdapterExistenceCheck && !argv.migrate ? checkAdapterExistence : undefined,
};

/** Asks a series of questions on the CLI */
async function ask(): Promise<Answers> {
	let answers: Record<string, any> = { cli: true, target: "directory" };
	let migrationContext: MigrationContextBase | undefined;
	const missingFields: Array<{ question: Question; allowedValues?: string }> = [];

	if (argv.replay) {
		const replayFile = path.resolve(argv.replay);
		const json = await fs.readFile(replayFile, "utf8");
		answers = JSON.parse(json);
		answers.replay = replayFile;
	}

	if (argv.migrate) {
		try {
			const migrationDir = path.resolve(argv.migrate);
			const ctx = new LocalMigrationContext(migrationDir);
			console.log(`Migrating from ${migrationDir}`);
			await ctx.load();
			migrationContext = ctx;
		} catch (error) {
			console.error(error);
			throw new Error("Please ensure that --migrate points to a valid adapter directory");
		}
		if (await migrationContext.fileExists(".create-adapter.json")) {
			// it's just not worth trying to figure out things if the adapter was already created with create-adapter
			throw new Error(
				"Use --replay instead of --migrate for an adapter created with a recent version of create-adapter.",
			);
		}
	}

	async function askQuestion(q: Question): Promise<void> {
		if (testCondition(q.condition, answers)) {
			if (q.replay) {
				q.replay(answers);
			}
			// Make properties dependent on previous answers
			if (typeof q.initial === "function") {
				q.initial = q.initial(answers);
			}
			if (migrationContext && q.migrate) {
				let migrated = q.migrate(migrationContext, answers, q);
				if (migrated instanceof Promise) {
					migrated = await migrated;
				}
				q.initial = migrated;
			}
			while (true) {
				let answer: Record<string, any>;
				if (Object.prototype.hasOwnProperty.call(answers, q.name as string)) {
					// answer was loaded using the "replay" feature
					answer = { [q.name as string]: answers[q.name as string] };
				} else {
					if (answers.expert !== "yes" && q.expert && q.initial !== undefined) {
						// In non-expert mode, prefill the default answer for expert questions
						answer = { [q.name as string]: q.initial };
					} else if (argv.nonInteractive) {
						// In non-interactive mode, error on missing required fields
						if (q.optional || q.initial !== undefined) {
							// Use initial/default value for optional fields or fields with defaults
							answer = { [q.name as string]: q.initial };
						} else {
							// Collect information about missing required field
							let allowedValues: string | undefined;
							if ("choices" in q && q.choices && Array.isArray(q.choices)) {
								const choiceValues = q.choices
									.map((choice: any) => {
										if (typeof choice === "string") {
											return choice;
										} else if (choice && typeof choice === "object" && "value" in choice) {
											return choice.value;
										}
										return null;
									})
									.filter((v: any) => v !== null);
								if (choiceValues.length > 0) {
									allowedValues = choiceValues.join(", ");
								}
							}
							missingFields.push({ question: q, allowedValues });
							// Use undefined as placeholder to continue processing
							answer = { [q.name as string]: undefined };
						}
					} else {
						// Ask the user for an answer
						try {
							answer = await prompt(q);
							// Cancel the process if necessary
							if (answer[q.name as string] == undefined) {
								throw new Error();
							}
						} catch (e) {
							error((e as Error).message || "Adapter creation canceled!");
							return process.exit(1);
						}
					}
					// Apply an optional transformation (skip if answer is undefined in non-interactive mode)
					if (
						typeof q.resultTransform === "function" &&
						!(argv.nonInteractive && answer[q.name as string] === undefined)
					) {
						const transformed = q.resultTransform(answer[q.name as string]);
						answer[q.name as string] = transformed instanceof Promise ? await transformed : transformed;
					}
					// Test the result (skip if answer is undefined in non-interactive mode)
					if (q.action != undefined && !(argv.nonInteractive && answer[q.name as string] === undefined)) {
						const testResult = await q.action(answer[q.name as string], creatorOptions);
						if (typeof testResult === "string") {
							if (argv.nonInteractive) {
								// In non-interactive mode, collect the validation error
								missingFields.push({
									question: q,
									allowedValues: testResult,
								});
								answer = { [q.name as string]: undefined };
							} else {
								error(testResult);
								continue;
							}
						}
					}
				}
				// And remember it
				answers = { ...answers, ...answer };
				break;
			}
		}
	}

	const questionsAndText: (QuestionGroup | string | ConditionalTitle)[] = [
		...(argv.nonInteractive
			? []
			: [
					"",
					green.bold("====================================================="),
					green.bold(`   Welcome to the ioBroker adapter creator v${getOwnVersion()}!`),
					green.bold("====================================================="),
					"",
					gray(`You can cancel at any point by pressing Ctrl+C.`),
					(answers: Record<string, any>) => (answers.replay ? green(`Replaying file`) : undefined),
					(answers: Record<string, any>) => (answers.replay ? green(answers.replay) : undefined),
			  ]),
		...questionGroups,
		...(argv.nonInteractive ? [] : ["", underline("That's it. Please wait a minute while I get this working...")]),
	];

	for (const entry of questionsAndText) {
		if (typeof entry === "string") {
			// Headlines
			if (!argv.nonInteractive) {
				console.log(entry);
			}
		} else if (typeof entry === "function") {
			// Conditional headlines
			const text = entry(answers);
			if (text !== undefined && !argv.nonInteractive) {
				console.log(text);
			}
		} else {
			// only print the headline if any of the questions are necessary
			if (entry.questions.find(qq => testCondition(qq.condition, answers))) {
				if (!argv.nonInteractive) {
					console.log();
					console.log(underline(entry.headline));
				}
			}
			for (const qq of entry.questions) {
				await askQuestion(qq);
			}
		}
	}

	// In non-interactive mode, report all missing required fields and exit
	if (argv.nonInteractive && missingFields.length > 0) {
		console.log();
		console.log(red.bold("ERROR: Missing required fields in non-interactive mode"));
		console.log();
		console.log("The following required fields are missing or invalid:");
		console.log();
		for (const { question, allowedValues } of missingFields) {
			console.log(red(`  ✗ ${question.label} (${question.name as string})`));
			if (question.message) {
				console.log(gray(`    ${question.message}`));
			}
			if (allowedValues) {
				console.log(gray(`    Allowed values: ${allowedValues}`));
			}
			if ("hint" in question && question.hint) {
				console.log(gray(`    Hint: ${question.hint}`));
			}
		}
		console.log();
		console.log(
			gray(
				"Please provide all required fields in your .create-adapter.json file or remove the --non-interactive flag.",
			),
		);
		process.exit(1);
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
/** Whether dev-server should be installed */
let devServer: boolean;

/**
 * CLI-specific functionality for creating the adapter directory
 *
 * @param answers
 * @param files
 */
async function setupProject_CLI(answers: Answers, files: File[]): Promise<void> {
	const rootDirName = path.basename(rootDir);
	// make sure we are working in a directory called ioBroker.<adapterName>
	const targetDir =
		rootDirName.toLowerCase() === `iobroker.${answers.adapterName.toLowerCase()}`
			? rootDir
			: path.join(rootDir, `ioBroker.${answers.adapterName}`);
	await writeFiles(targetDir, files);

	if (installDependencies) {
		logProgress("Installing dependencies");
		await executeNpmCommand(["install"], { cwd: targetDir });

		if (needsBuildStep) {
			logProgress("Compiling source files");
			await executeNpmCommand(["run", "build"], {
				cwd: targetDir,
				stdout: "ignore",
			});
		}
	}

	if (devServer) {
		if (answers.devServer === "global") {
			logProgress("Installing dev-server globally");
			await executeNpmCommand(["install", "--global", "@iobroker/dev-server"], { cwd: targetDir });
			await executeCommand(
				isWindows ? "iobroker-dev-server.cmd" : "iobroker-dev-server",
				["setup", "--adminPort", `${answers.devServerPort}`],
				{ cwd: targetDir },
			);
		} else if (answers.devServer === "local") {
			logProgress("Configuring dev-server as local dependency");
			// For local installation, dev-server is added to devDependencies in package.json
			// and a npm script is added - no additional installation needed here
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
			["init", "-b", answers.defaultBranch || "main"],
			["config", "--local", "user.name", answers.authorName],
			["config", "--local", "user.email", answers.authorEmail],
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
	console.log();
	console.log(blueBright("All done! Have fun programming! ") + red("♥"));
	console.log(blueBright(`Just open `) + bold(reset(targetDir)) + blueBright(` in your favorite editor.`));
	console.log();
	console.log(gray("Hint: try CTRL-clicking the path if you have the editor open already."));
}

/**
 * Checks if the current version is outdated and warns the user
 */
async function checkVersion(): Promise<void> {
	if (argv.ignoreOutdatedVersion) {
		return;
	}

	// Skip version check in CI environments
	if (process.env.CI || process.env.GITHUB_ACTIONS || process.env.TRAVIS || process.env.CIRCLECI) {
		return;
	}

	try {
		const packageName = "@iobroker/create-adapter";
		const localVersion = getOwnVersion();
		const latestVersion = await fetchPackageVersion(packageName);

		if (localVersion !== "unknown" && latestVersion && localVersion !== latestVersion) {
			if (semver.gt(latestVersion, localVersion)) {
				console.log();
				console.log(red("═".repeat(60)));
				console.log(red("  WARNING: You are using an outdated version!"));
				console.log();
				console.log(`  Current version:  ${bold(localVersion)}`);
				console.log(`  Latest version:   ${bold(green(latestVersion))}`);
				console.log();
				console.log("  Please update by running:");
				console.log(bold(`    npx ${packageName}@latest`));
				console.log();
				console.log(gray("  To skip this check, use --ignore-outdated-version"));
				console.log(red("═".repeat(60)));
				console.log();
				process.exit(1);
			}
		}
	} catch (e) {
		// Silently ignore version check errors
	}
}

// Enable CI testing without stalling
if (process.env.TEST_STARTUP) {
	console.log(green("Startup test succeeded - exiting..."));
	throw process.exit(0);
}

(async function main() {
	await checkVersion();
	const answers = await ask();

	if (installDependencies) {
		maxSteps++;
		needsBuildStep = answers.language === "TypeScript" || answers.adminUi === "react" || answers.tabReact === "yes";
		if (needsBuildStep) {
			maxSteps++;
		}
	}
	devServer = answers.devServer === "global" || answers.devServer === "local";
	if (devServer) {
		maxSteps++;
	}
	gitCommit = answers.gitCommit === "yes";
	if (gitCommit) {
		maxSteps++;
	}

	logProgress("Generating files");
	const files = await createFiles(answers);

	await setupProject_CLI(answers, files);
})().catch(error => console.error(error));

process.on("exit", () => {
	if (fs.pathExistsSync("npm-debug.log")) {
		fs.removeSync("npm-debug.log");
	}
});
