// tslint:disable:no-var-requires

// tslint:disable-next-line:variable-name
import { dim, green } from "ansi-colors";
import { prompt } from "enquirer";
import { checkAdapterExistence, checkAuthorName, checkEmail, CheckResult } from "./lib/actions";

// Sadly, Enquirer does not export the PromptOptions type
// tslint:disable-next-line:ban-types
type PromptOptions = Exclude<Parameters<typeof prompt>[0], Function | any[]>;
type QuestionAction<T> = (value: T) => Promise<CheckResult>;
interface QuestionMeta {
	condition?: { name: string, value: string | boolean | number };
	action?: QuestionAction<string | boolean | number>;
}
type Question = PromptOptions & QuestionMeta;

function styleMultiselect<T extends Record<string, any>>(ms: T): T {
	return Object.assign({}, ms, {
		symbols: {
			indicator: {
				on: green("■"),
				off: dim.gray("□"),
			},
		},
	});
}

const questions: Question[] = [
	{
		type: "select",
		name: "language",
		message: "Which language do you want to use to code the adapter?",
		choices: [
			"JavaScript",
			"TypeScript",
		],
	},
	styleMultiselect({
		condition: { name: "language", value: "JavaScript" },
		type: "multiselect",
		name: "tools",
		message: "Which of the following tools do you want to use?",
		initial: [0, 1],
		choices: [
			{ message: "ESLint", hint: "(recommended)" },
			{ message: "type checking", hint: "(recommended)"  },
		],
	}),
	styleMultiselect({
		condition: { name: "language", value: "TypeScript" },
		type: "multiselect",
		name: "tools",
		message: "Which of the following tools do you want to use?",
		initial: [0],
		choices: [
			{ message: "TSLint", hint: "(recommended)" },
			{ message: "Code coverage" },
		],
	}),
	styleMultiselect({
		type: "multiselect",
		name: "language-features",
		message: "Which of the following language features do you need?",
		initial: [0, 1, 2, 3],
		choices: [
			"String.pad{Start,End}", // Requires Node 8
			"async/await", // Requires Node 8
			"Promise.finally", // Requires Node 10
			"String.trim{Start,End}", // Requires Node 10
			"bigint", // Requires Node 10.8
			"Array.flat[Map]", // Requires Node 11
		],
	}),
	{
		type: "select",
		name: "admin-react",
		message: "Use React for the Admin UI?",
		initial: "no",
		choices: [ "yes", "no" ],
	},
	{
		type: "select",
		name: "admin-tab",
		message: "Create a tab in the admin UI?",
		initial: "no",
		choices: [ "yes", "no" ],
	},
	{
		condition: { name: "admin-tab", value: "yes" },
		type: "select",
		name: "tab-react",
		message: "Use React for the tab?",
		initial: "no",
		choices: [ "yes", "no" ],
	},
	{
		type: "select",
		name: "widget",
		message: "Create a VIS widget?",
		initial: "no",
		choices: [ "yes", "no" ],
	},
];

async function main() {
	let answers: Record<string, any> = {};
	for (const q of questions) {
		if (q.condition == undefined || answers[q.condition.name] === q.condition.value) {
			while (true) {
				const answer: Record<string, any> = await prompt(q);
				const value = answer[q.name as string];
				if (value == undefined) {
					console.error("Adapter creation canceled");
					process.exit(1);
				} else if (q.action != undefined) {
					const testResult = await q.action(value);
					if (!testResult) process.exit(1);
					if (testResult === "retry") continue;
				}
				answers = { ...answers, ...answer };
				break;
			}
		}
	}
	console.dir(answers);
}
main().catch(console.error);
