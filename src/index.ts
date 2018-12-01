import { prompt } from "enquirer";
import * as fs from "fs-extra";
import * as path from "path";
import * as yargs from "yargs";
import { AnswerValue, Condition, questions } from "./lib/questions";
import { enumFilesRecursiveSync } from "./lib/tools";

/** Where the output should be written */
const rootDir = path.resolve(yargs.argv.target || process.cwd());

function testCondition(condition: Condition | undefined, answers: Record<string, any>): boolean {
	if (condition == undefined) return true;
	if ("value" in condition) {
		return answers[condition.name] === condition.value;
	} else if ("contains" in condition) {
		return (answers[condition.name] as AnswerValue[]).indexOf(condition.contains) > -1;
	}
	return false;
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
				const value = answer[q.name as string];
				if (value == undefined) {
					console.error("Adapter creation canceled");
					process.exit(1);
				}
				// Apply an optional transformation
				if (typeof q.resultTransform === "function") {
					answer[q.name as string] = q.resultTransform(answer[q.name as string]);
				}
				// Test the result
				if (q.action != undefined) {
					const testResult = await q.action(value);
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
	content: string | undefined;
}

async function createFiles(answers: Record<string, any>): Promise<File[]> {
	const templateDir = path.join(__dirname, "./templates");
	const files = await Promise.all(
		enumFilesRecursiveSync(
			templateDir,
			name => /\.js$/.test(name),
		).map(async (f) => ({
			name: path.relative(templateDir, f).replace(/\.js$/i, ""),
			content: await require(f)(answers) as string,
		})),
	);
	const necessaryFiles = files.filter(f => f.content != undefined);
	for (const file of necessaryFiles) {
		console.log(file.name);
		console.log(file.content);
		console.log();
	}
	return necessaryFiles;
}

async function writeFiles(adapterName: string, files: File[]) {
	const rootDirName = path.basename(rootDir);
	// make sure we are working in a directory called ioBroker.<adapterName>
	const targetDir = rootDirName.toLowerCase() === `iobroker.${adapterName.toLowerCase()}`
		? rootDir : path.join(rootDir, `ioBroker.${adapterName}`)
		;

	// make sure the garget dir exists
	if (!await fs.pathExists(targetDir)) await fs.ensureDir(targetDir);

	for (const file of files) {
		await fs.writeFile(path.join(targetDir, file.name), file.content, "utf8");
	}
}

async function main() {
	const answers = await ask();
	const files = await createFiles(answers);
	await writeFiles(answers.adapterName, files);
}
main();
