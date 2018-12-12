import { isArray } from "alcalzone-shared/typeguards";
import { blueBright, red } from "ansi-colors";
import { prompt } from "enquirer";
import * as fs from "fs-extra";
import * as os from "os";
import * as path from "path";
import * as yargs from "yargs";
import { AnswerValue, Condition, questions } from "./lib/questions";
import { enumFilesRecursiveSync, error, executeCommand, indentWithSpaces, indentWithTabs, isWindows } from "./lib/tools";

/** Where the output should be written */
const rootDir = path.resolve(yargs.argv.target || process.cwd());
type Awaited<T> = T extends Promise<infer U> ? U
	: T extends PromiseLike<infer V> ? V
	: T;

function testCondition(condition: Condition | Condition[] | undefined, answers: Record<string, any>): boolean {
	if (condition == undefined) return true;

	function testSingleCondition(cond: Condition) {
		if ("value" in cond) {
			return answers[cond.name] === cond.value;
		} else if ("contains" in cond) {
			return (answers[cond.name] as AnswerValue[]).indexOf(cond.contains) > -1;
		}
		return false;
	}

	if (isArray(condition)) {
		return condition.every(cond => testSingleCondition(cond));
	} else {
		return testSingleCondition(condition);
	}

}

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
	// console.dir(answers);
	return answers;
}

interface File {
	name: string;
	content: string | Buffer;
	noReformat: boolean;
}

async function createFiles(answers: Record<string, any>): Promise<File[]> {
	const templateDir = path.join(__dirname, "./templates");
	const files = await Promise.all(
		enumFilesRecursiveSync(
			templateDir,
			(name, parentDir) => {
				const fullName = path.join(parentDir, name);
				const isDirectory = fs.statSync(fullName).isDirectory();
				return isDirectory || /\.js$/.test(name);
			},
		).map(async (f) => {
			const templateFunction = require(f);
			const customPath = typeof templateFunction.customPath === "function" ? templateFunction.customPath(answers)
				: typeof templateFunction.customPath === "string" ? templateFunction.customPath
				: path.relative(templateDir, f).replace(/\.js$/i, "")
			;
			const templateResult = templateFunction(answers) as string | Buffer | undefined | Promise<string | Buffer | undefined>;
			return {
				name: customPath,
				content: templateResult instanceof Promise ? await templateResult : templateResult,
				noReformat: templateFunction.noReformat === true,
			};
		}),
	);
	const necessaryFiles = files.filter(f => f.content != undefined) as File[];
	return formatFiles(answers, necessaryFiles);
}

/** Formats files that are not explicitly forbidden to be formatted */
function formatFiles(answers: Record<string, any>, files: File[]): File[] {
	// Normalize indentation considering user preference
	const indentation = answers.indentation === "Tab" ? indentWithTabs : indentWithSpaces;
	// Remove multiple subsequent empty lines (can happen during template creation).
	const emptyLines = (text: string) => {
		return text && text
			.replace(/\r\n/g, "\n")
			.replace(/^(\s*\n){2,}/gm, "\n")
			.replace(/\n/g, os.EOL)
		;
	};
	const formatter = (text: string) => emptyLines(indentation(text));
	return files.map(f => (f.noReformat || typeof f.content !== "string") ? f
		: {...f, content: formatter(f.content)},
	);
}

async function writeFiles(targetDir: string, files: File[]) {
	// write the files and make sure the target dirs exist
	for (const file of files) {
		await fs.outputFile(path.join(targetDir, file.name), file.content, typeof file.content === "string" ? "utf8" : undefined);
	}
}

(async function main() {
	const answers = await ask();
	const files = await createFiles(answers);

	const rootDirName = path.basename(rootDir);
	// make sure we are working in a directory called ioBroker.<adapterName>
	const targetDir = rootDirName.toLowerCase() === `iobroker.${answers.adapterName.toLowerCase()}`
		? rootDir : path.join(rootDir, `ioBroker.${answers.adapterName}`)
		;
	await writeFiles(targetDir, files);

	if (!yargs.argv.noInstall || !!yargs.argv.install) {
		console.log(blueBright("Installing dependencies, please wait..."));
		await executeCommand(isWindows ? "npm.cmd" : "npm", ["install", "--quiet"], { cwd: targetDir });
	}
	console.log(blueBright("All done! Have fun programming! ") + red("♥"));
})();

process.on("exit", () => {
	if (fs.pathExistsSync("npm-debug.log")) fs.removeSync("npm-debug.log");
});
