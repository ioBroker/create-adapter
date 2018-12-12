import { isArray } from "alcalzone-shared/typeguards";
import * as fs from "fs-extra";
import * as os from "os";
import * as path from "path";
import { AnswerValue, Condition } from "./questions";
import { enumFilesRecursiveSync, indentWithSpaces, indentWithTabs } from "./tools";

const templateDir = path.join(__dirname, "../templates");

export interface File {
	name: string;
	content: string | Buffer;
	noReformat: boolean;
}

export function testCondition(condition: Condition | Condition[] | undefined, answers: Record<string, any>): boolean {
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

export async function createFiles(answers: Record<string, any>): Promise<File[]> {
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
