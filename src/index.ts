import { blueBright, red } from "ansi-colors";
import { prompt } from "enquirer";
import * as fs from "fs-extra";
import * as path from "path";
import * as yargs from "yargs";
import { createFiles, File, testCondition } from "./lib/createAdapter";
import { Answers, questions } from "./lib/questions";
import { error, executeCommand, isWindows } from "./lib/tools";

/** Where the output should be written */
const rootDir = path.resolve(yargs.argv.target || process.cwd());
type Awaited<T> = T extends Promise<infer U> ? U
	: T extends PromiseLike<infer V> ? V
	: T;

/** Asks a series of questions on the CLI */
async function ask() {
	let answers: Record<string, any> = {};
	for (const q of questions) {
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
				const answer: Record<string, any> = await prompt(q);
				// Cancel the process if necessary
				if (answer[q.name as string] == undefined) {
					error("Adapter creation canceled");
					process.exit(1);
				}
				// Apply an optional transformation
				if (typeof q.resultTransform === "function") {
					const transformed = q.resultTransform(answer[q.name as string]);
					answer[q.name as string] = transformed instanceof Promise ? await transformed : transformed;
				}
				// Test the result
				if (q.action != undefined) {
					const testResult = await q.action(answer[q.name as string]);
					if (!testResult) process.exit(1);
					if (testResult === "retry") continue;
				}
				// And remember it
				answers = { ...answers, ...answer };
				break;
			}
		}
	}
	return answers as Answers;
}

async function writeFiles(targetDir: string, files: File[]) {
	// write the files and make sure the target dirs exist
	for (const file of files) {
		await fs.outputFile(path.join(targetDir, file.name), file.content, typeof file.content === "string" ? "utf8" : undefined);
	}
}

/** CLI-specific functionality for creating the adapter directory */
async function setupProject_CLI({ answers, files }: {
	answers: Awaited<ReturnType<typeof ask>>,
	files: Awaited<ReturnType<typeof createFiles>>,
}) {

	const rootDirName = path.basename(rootDir);
	// make sure we are working in a directory called ioBroker.<adapterName>
	const targetDir = rootDirName.toLowerCase() === `iobroker.${answers.adapterName.toLowerCase()}`
		? rootDir : path.join(rootDir, `ioBroker.${answers.adapterName}`)
		;
	await writeFiles(targetDir, files);

	if (!yargs.argv.noInstall || !!yargs.argv.install) {
		console.log(blueBright("[2/2] Installing dependencies..."));
		await executeCommand(isWindows ? "npm.cmd" : "npm", ["install", "--quiet"], { cwd: targetDir });
	}
	console.log(blueBright("All done! Have fun programming! ") + red("♥"));
}

ask()
	.then(async answers => {
		console.log(blueBright("[1/2] Generating files..."));
		return {
			answers,
			files: await createFiles(answers),
		};
	})
	.then(setupProject_CLI)
	;

process.on("exit", () => {
	if (fs.pathExistsSync("npm-debug.log")) fs.removeSync("npm-debug.log");
});
