import { bold, dim, gray, green, underline } from "ansi-colors";
import { prompt } from "enquirer";
import { checkAdapterName, checkAuthorName, checkEmail, checkMinSelections, CheckResult, loadLicense, transformAdapterName } from "./actionsAndTransformers";
import { testCondition } from "./createAdapter";

// Sadly, Enquirer does not export the PromptOptions type
// tslint:disable-next-line:ban-types
type PromptOptions = Exclude<Parameters<typeof prompt>[0], Function | any[]>;
type QuestionAction<T> = (value: T) => Promise<CheckResult>;
// tslint:disable-next-line:interface-over-type-literal
export type AnswerValue = string | boolean | number;
export type Condition = { name: string } & (
	| { value: AnswerValue | AnswerValue[] }
	| { contains: AnswerValue }
);

interface QuestionMeta {
	condition?: Condition | Condition[];
	resultTransform?: (val: AnswerValue | AnswerValue[]) => AnswerValue | AnswerValue[] | Promise<AnswerValue | AnswerValue[]>;
	action?: QuestionAction<AnswerValue | AnswerValue[]>;
}
type Question = PromptOptions & QuestionMeta;

function styledMultiselect<T extends Pick<Question, Exclude<keyof Question, "type">>>(ms: T): T & { type: string } {
	return Object.assign({}, ms, {
		type: "multiselect",
		hint: gray("(<space> to select, <return> to submit)"),
		symbols: {
			indicator: {
				on: green("■"),
				off: dim.gray("□"),
			},
		},
	});
}

// tslint:disable-next-line:no-var-requires
const ownVersion = require("../../package.json").version;

/** All questions and the corresponding text lines */
export const questionsAndText: (Question | string)[] = [
	"",
	green.bold("====================================================="),
	green.bold(`   Welcome to the ioBroker adapter creator v${ownVersion}!`),
	green.bold("====================================================="),
	"",
	gray(`You can cancel at any point by pressing Ctrl+C.`),
	"",
	underline("Let's get started with a few questions about your project!"),
	{
		type: "input",
		name: "adapterName",
		message: "Please enter the name of your project:",
		resultTransform: transformAdapterName,
		action: checkAdapterName,
	},
	styledMultiselect({
		name: "features",
		message: "Which features should your project contain?",
		initial: [0],
		choices: [
			"Adapter",
			"VIS widget",
		],
		action: checkMinSelections.bind(undefined, "feature", 1),
	}),
	{
		condition: { name: "features", contains: "Adapter" },
		type: "select",
		name: "language",
		message: "Which language do you want to use to code the adapter?",
		choices: [
			"JavaScript",
			"TypeScript",
		],
	},
	styledMultiselect({
		condition: { name: "language", value: "JavaScript" },
		name: "tools",
		message: "Which of the following tools do you want to use?",
		initial: [0, 1],
		choices: [
			{ message: "ESLint", hint: "(recommended)" },
			{ message: "type checking", hint: "(recommended)" },
		],
	}),
	styledMultiselect({
		condition: { name: "language", value: "TypeScript" },
		name: "tools",
		message: "Which of the following tools do you want to use?",
		initial: [0],
		choices: [
			{ message: "TSLint", hint: "(recommended)" },
			{ message: "Code coverage" },
		],
	}),

	// TODO: enable React (only TypeScript at the start)
	// {
	// 	condition: [
	// 		{ name: "features", contains: "Adapter" },
	// 		{ name: "language", value: "TypeScript" }, // TODO: enable React for JS through Babel
	// 	],
	// 	type: "select",
	// 	name: "adminReact",
	// 	message: "Use React for the Admin UI?",
	// 	initial: "no",
	// 	choices: ["yes", "no"],
	// },

	// TODO: support admin tab
	// {
	// 	condition: { name: "features", contains: "Adapter" },
	// 	type: "select",
	// 	name: "adminTab",
	// 	message: "Create a tab in the admin UI?",
	// 	initial: "no",
	// 	choices: ["yes", "no"],
	// },
	// {
	// 	condition: { name: "adminTab", value: "yes" },
	// 	type: "select",
	// 	name: "tabReact",
	// 	message: "Use React for the tab?",
	// 	initial: "no",
	// 	choices: ["yes", "no"],
	// },
	{
		condition: { name: "features", contains: "Adapter" },
		type: "select",
		name: "indentation",
		message: "Do you prefer tab or space indentation?",
		initial: "Tab",
		choices: [
			"Tab",
			"Space (4)",
		],
	},
	"",
	underline("Almost done! Just a few administrative details..."),
	{
		type: "input",
		name: "authorName",
		message: "Please enter your name (or nickname):",
		action: checkAuthorName,
	},
	{
		type: "input",
		name: "authorGithub",
		message: "What's your name/org on GitHub?",
		initial: (answers: Answers) => answers.authorName,
		action: checkAuthorName,
	},
	{
		type: "input",
		name: "authorEmail",
		message: "What's your email address?",
		action: checkEmail,
	},
	{
		type: "select",
		name: "license",
		message: "Which license should be used for your project?",
		initial: 5,
		choices: [ // TODO: automate (GH#1)
			"GNU AGPLv3",
			"GNU GPLv3",
			"GNU LGPLv3",
			"Mozilla Public License 2.0",
			"Apache License 2.0",
			"MIT License",
			"The Unlicense",
		],
		resultTransform: loadLicense as any,
	},
	"",
	underline("That's it. Please wait a minute while I get this working..."),
];

/** Only the questions */
export const questions = questionsAndText.filter(q => typeof q !== "string") as Question[];

export interface Answers {
	adapterName: string;
	authorName: string;
	authorEmail: string;
	authorGithub: string;
	description?: string;
	language?: string;
	tools?: string[];
	features: string[];
	title?: string;
	license: { id: string, name: string, text: string };
	type?: string;
	adminReact?: string;
	indentation?: string;
}

export function checkAnswers(answers: Partial<Answers>): void {
	for (const q of questions) {
		const answer = (answers as any)[q.name as string];
		const conditionFulfilled = testCondition(q.condition, answers);
		if (conditionFulfilled && answer == undefined) {
			// A required answer was not given
			throw new Error(`Missing answer "${q.name}"!`);
		} else if (!conditionFulfilled && answer != undefined) {
			// TODO: Find a fool-proof way to check for extraneous answers
			if (questions.filter(qq => qq.name as string === q.name).length > 0) {
				// For now, don't enforce conditions for questions with multiple branches
				continue;
			}
			// An extraneous answer was given
			throw new Error(`Extraneous answer "${q.name}" given!`);
		}
	}
}

export async function formatAnswers(answers: Record<string, any>): Promise<Record<string, any>> {
	for (const q of questions) {
		const conditionFulfilled = testCondition(q.condition, answers);
		if (!conditionFulfilled) continue;

		// Apply an optional transformation
		if (answers[q.name as string] != undefined && typeof q.resultTransform === "function") {
			const transformed = q.resultTransform(answers[q.name as string]);
			answers[q.name as string] = transformed instanceof Promise ? await transformed : transformed;
		}
	}
	return answers;
}

export async function validateAnswers(answers: Answers): Promise<void> {
	for (const q of questions) {
		const conditionFulfilled = testCondition(q.condition, answers);
		if (!conditionFulfilled) continue;
		if (q.action == undefined) continue;

		const testResult = await q.action(answers[q.name as keyof Answers] as any);
		if (typeof testResult === "string") {
			throw new Error(testResult);
		}
	}
}
