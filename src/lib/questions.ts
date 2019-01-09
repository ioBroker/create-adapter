import { isArray } from "alcalzone-shared/typeguards";
import { dim, gray, green, underline } from "ansi-colors";
import { prompt } from "enquirer";
import { checkAdapterName, checkAuthorName, checkEmail, checkMinSelections, CheckResult, checkTitle, transformAdapterName, transformDescription } from "./actionsAndTransformers";
import { testCondition } from "./createAdapter";
import { licenses } from "./licenses";

// Sadly, Enquirer does not export the PromptOptions type
// tslint:disable-next-line:ban-types
type PromptOptions = Exclude<Parameters<typeof prompt>[0], Function | any[]>;
type QuestionAction<T> = (value: T) => CheckResult | Promise<CheckResult>;
// tslint:disable-next-line:interface-over-type-literal
export type AnswerValue = string | boolean | number;
export type Condition = { name: string } & (
	| { value: AnswerValue | AnswerValue[] }
	| { contains: AnswerValue }
	| { doesNotContain: AnswerValue }
);

interface QuestionMeta {
	condition?: Condition | Condition[];
	resultTransform?: (val: AnswerValue | AnswerValue[]) => AnswerValue | AnswerValue[] | undefined | Promise<AnswerValue | AnswerValue[] | undefined>;
	action?: QuestionAction<AnswerValue | AnswerValue[]>;
	optional?: boolean;
}
export type Question = PromptOptions & QuestionMeta;
export interface QuestionGroup {
	headline: string;
	questions: Question[];
}
export function isQuestionGroup(val: any): val is QuestionGroup {
	if (val == undefined) return false;
	if (typeof val.headline !== "string") return false;
	if (!isArray(val.questions)) return false;
	// For now we don't need any more specific tests
	return true;
}

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
export const questionsAndText: (Question | QuestionGroup | string)[] = [
	"",
	green.bold("====================================================="),
	green.bold(`   Welcome to the ioBroker adapter creator v${ownVersion}!`),
	green.bold("====================================================="),
	"",
	gray(`You can cancel at any point by pressing Ctrl+C.`),
	{
		headline: "Let's get started with a few questions about your project!",
		questions: [
			{
				type: "input",
				name: "adapterName",
				message: "Please enter the name of your project:",
				resultTransform: transformAdapterName,
				action: checkAdapterName,
			},
			{
				type: "input",
				name: "title",
				message: "Which title should be shown in the admin UI?",
				action: checkTitle,
			},
			{
				type: "input",
				name: "description",
				message: "Please enter a short description:",
				hint: "(optional)",
				optional: true,
				resultTransform: transformDescription,
			},
		],
	},
	{
		headline: "Nice! Let's get technical...",
		questions: [
			styledMultiselect({
				name: "features",
				message: "Which features should your project contain?",
				initial: [0],
				choices: [
					{ message: "Adapter", value: "adapter" },
					{ message: "Visualization", value: "vis" },
				],
				action: checkMinSelections.bind(undefined, "feature", 1),
			}),
			{
				condition: { name: "features", contains: "adapter" },
				type: "select",
				name: "type",
				message: "Which category does your adapter fall into?",
				choices: [
					{ message: "Alarm / security         (Home, car, boat, ...)", value: "alarm" },
					{ message: "Calendars                (also schedules, etc. ...)", value: "date-and-time" },
					{ message: "Climate control          (A/C, Heaters, air filters, ...)", value: "climate-control" },
					{ message: "Communication protocols  (MQTT, ...)", value: "protocols" },
					{ message: "Data storage             (SQL/NoSQL, file storage, logging, ...)", value: "storage" },
					{ message: "Data transmission        (for other services via REST api, websockets, ...)", value: "communication" },
					{ message: "Garden                   (Mowers, watering, ...)", value: "garden" },
					{ message: "General purpose          (like admin, web, discovery, ...)", value: "general" },
					{ message: "Geo positioning          (transmission and receipt of position data)", value: "geoposition" },
					{ message: "Hardware                 (low-level, multi-purpose)", value: "hardware" },
					{ message: "Household devices        (Vacuums, kitchen, ...)", value: "household" },
					{ message: "Lighting control", value: "lighting" },
					{ message: "Logic                    (Scripts, rules, parsers, scenes, ...)", value: "logic" },
					{ message: "Messaging                (E-Mail, Telegram, WhatsApp, ...)", value: "messaging" },
					{ message: "Meters for energy, electricity, ...", value: "energy" },
					{ message: "Meters for water, gas, oil, ...", value: "metering" },
					{ message: "Miscellaneous data       (Import/export of contacts, gasoline prices, ...)", value: "misc-data" },
					{ message: "Miscellaneous utilities  (Data import/emport, backup, ...)", value: "utility" },
					{ message: "Multimedia               (TV, audio, remote controls, ...)", value: "multimedia" },
					{ message: "Network infrastructure   (Hardware, printers, phones, ...)", value: "infrastructure" },
					{ message: "Network utilities        (Ping, UPnP, network discovery, ...)", value: "network" },
					{ message: "Smart home systems       (3rd party, hardware and software)", value: "iot-systems" },
					{ message: "Visualizations           (VIS, MaterialUI, mobile views, ...)", value: "visualization" },
					{ message: "Weather                  (Forecast, air quality, statistics, ...)", value: "weather" },
				],
			},
			{
				condition: { name: "features", doesNotContain: "adapter" },
				type: "select",
				name: "type",
				message: "Which kind of visualization is this?",
				choices: [
					{ message: "Icons for VIS", value: "visualization-icons" },
					{ message: "VIS widgets", value: "visualization-widgets" },
				],
			},
			{
				condition: { name: "features", contains: "adapter" },
				type: "select",
				name: "startMode",
				message: "When should the adapter be started?",
				initial: "daemon",
				choices: [
					{ message: "always", hint: dim.gray("(recommended for most adapters)"), value: "daemon" },
					{ message: `when the ".alive" state is true`, value: "subscribe" },
					{ message: "depending on a schedule", value: "schedule" },
					{ message: "when the instance object changes", value: "once" },
					{ message: "never", value: "none" },
				],
			},
			{
				condition: { name: "features", contains: "adapter" },
				type: "select",
				name: "language",
				message: "Which language do you want to use to code the adapter?",
				choices: [
					"JavaScript",
					"TypeScript",
				],
			},
			{
				condition: { name: "language", value: "JavaScript" },
				type: "select",
				name: "ecmaVersion",
				message: `Do you need async functions or String.pad{Start,End}`,
				choices: [
					{ message: "yes", value: 8 },
					{ message: "no", value: 6 },
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
					{ message: "code coverage" },
				],
			}),

			// TODO: enable React (only TypeScript at the start)
			// {
			// 	condition: [
			// 		{ name: "features", contains: "adapter" },
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
			// 	condition: { name: "features", contains: "adapter" },
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
				condition: { name: "features", contains: "adapter" },
				type: "select",
				name: "indentation",
				message: "Do you prefer tab or space indentation?",
				initial: "Tab",
				choices: [
					"Tab",
					"Space (4)",
				],
			},
			{
				condition: { name: "features", contains: "adapter" },
				type: "select",
				name: "quotes",
				message: "Do you prefer double or single quotes?",
				initial: "double",
				choices: [
					"double",
					"single",
				],
			},
		],
	},
	{
		headline: "Almost done! Just a few administrative details...",
		questions: [
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
				condition: { name: "cli", value: true },
				type: "select",
				name: "gitCommit",
				message: "Initialize the GitHub repo automatically?",
				initial: "no",
				choices: ["yes", "no"],
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
				resultTransform: (value: string) => licenses[value] as any,
			},
		],
	},
	"",
	underline("That's it. Please wait a minute while I get this working..."),
];

/** Only the questions */
export const questions = (questionsAndText.filter(q => typeof q !== "string") as (Question | QuestionGroup)[])
	.map(q => isQuestionGroup(q) ? q.questions : [q])
	.reduce((arr, next) => arr.concat(...next), [])
;

export interface Answers {
	adapterName: string;
	description?: string;
	authorName: string;
	authorEmail: string;
	authorGithub: string;
	language?: "JavaScript" | "TypeScript";
	features: ("adapter" | "vis")[];
	tools?: ("ESLint" | "TSLint" | "type checking" | "code coverage")[];
	ecmaVersion?: 2015 | 2017;
	title?: string;
	license: { id: string, name: string, text: string };
	type: string;
	adminReact?: string;
	indentation?: "Tab" | "Space (4)";
	quotes?: "single" | "double";
	gitCommit?: "yes" | "no";
	startMode?: "daemon" | "schedule" | "subscribe" | "once" | "none";
}

export function checkAnswers(answers: Partial<Answers>): void {
	for (const q of questions) {
		const answer = (answers as any)[q.name as string];
		const conditionFulfilled = testCondition(q.condition, answers);
		if (!q.optional && conditionFulfilled && answer == undefined) {
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
