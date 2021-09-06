import { isArray } from "alcalzone-shared/typeguards";
import { dim, gray, green } from "ansi-colors";
import type { SpecificPromptOptions } from "enquirer";
import {
	checkAdapterName,
	checkAuthorName,
	checkEmail,
	checkMinSelections,
	CheckResult,
	checkTitle,
	checkTypeScriptTools,
	transformAdapterName,
	transformContributors,
	transformDescription,
	transformKeywords,
} from "./actionsAndTransformers";
import { licenses } from "./licenses";
import type { MigrationContextBase } from "./migrationContextBase";

// This is being used to simulate wrong options for conditions on the type level
const __misused: unique symbol = Symbol.for("__misused");

type QuestionAction<T> = (
	value: T,
	options?: unknown,
) => CheckResult | Promise<CheckResult>;
export type AnswerValue = string | boolean | number;
export type Condition = { name: string } & (
	| { value: AnswerValue | AnswerValue[] }
	| { contains: AnswerValue }
	| { doesNotContain: AnswerValue }
	| { [__misused]: undefined }
);

export function testCondition(
	condition: Condition | Condition[] | undefined,
	answers: Record<string, any>,
): boolean {
	if (condition == undefined) return true;

	function testSingleCondition(cond: Condition): boolean {
		if ("value" in cond) {
			return answers[cond.name] === cond.value;
		} else if ("contains" in cond) {
			return (
				answers[cond.name] &&
				(answers[cond.name] as AnswerValue[]).indexOf(cond.contains) >
					-1
			);
		} else if ("doesNotContain" in cond) {
			return (
				!answers[cond.name] ||
				(answers[cond.name] as AnswerValue[]).indexOf(
					cond.doesNotContain,
				) === -1
			);
		}
		return false;
	}

	if (isArray(condition)) {
		return condition.every((cond) => testSingleCondition(cond));
	} else {
		return testSingleCondition(condition);
	}
}

export type MigrateFunc = (
	context: MigrationContextBase,
	answers: Record<string, any>,
	question: Question,
) =>
	| Promise<AnswerValue | AnswerValue[] | undefined>
	| AnswerValue
	| AnswerValue[]
	| undefined;

export type TransformResult = (
	val: AnswerValue | AnswerValue[],
) =>
	| AnswerValue
	| AnswerValue[]
	| undefined
	| Promise<AnswerValue | AnswerValue[] | undefined>;

export interface QuestionMeta {
	label: string;
	/** One or more conditions that need(s) to be fulfilled for this question to be asked */
	condition?: Condition | Condition[];
	migrate?: MigrateFunc;
	resultTransform?: TransformResult;
	action?: QuestionAction<undefined | AnswerValue | AnswerValue[]>;
	/** Whether an answer for this question is optional */
	optional?: boolean;
	/**
	 * Whether this question should only be asked in expert mode.
	 * In non-expert mode, the initial answer will be used.
	 */
	expert?: true;
}

export type Question = SpecificPromptOptions & QuestionMeta;
export interface QuestionGroup {
	title: string;
	headline: string;
	questions: Question[];
}

function styledMultiselect<
	T extends Pick<Question, Exclude<keyof Question, "type">> & {
		choices: any[];
	}
>(ms: T): T & { type: "multiselect" } {
	return Object.assign({} as Question, ms, {
		type: "multiselect" as const,
		hint: gray("(<space> to select, <return> to submit)"),
		symbols: {
			indicator: {
				on: green("■"),
				off: dim.gray("□"),
			},
		},
	});
}

/** All questions and the corresponding text lines */
export const questionGroups: QuestionGroup[] = [
	{
		title: "Basics",
		headline: "Let's get started with a few questions about your project!",
		questions: [
			{
				type: "input",
				name: "adapterName",
				label: "Adapter Name",
				message: "Please enter the name of your project:",
				resultTransform: transformAdapterName,
				action: checkAdapterName,
				migrate: (ctx) => ctx.ioPackageJson.common?.name,
			},
			{
				type: "input",
				name: "title",
				label: "Title",
				message: "Which title should be shown in the admin UI?",
				action: checkTitle,
				migrate: (ctx) =>
					ctx.ioPackageJson.common?.titleLang?.en ||
					ctx.ioPackageJson.common?.title,
			},
			{
				type: "input",
				name: "description",
				label: "Description",
				message: "Please enter a short description:",
				hint: "(optional)",
				optional: true,
				resultTransform: transformDescription,
				migrate: (ctx) =>
					ctx.ioPackageJson.common?.desc?.en ||
					ctx.ioPackageJson.common?.desc,
			},
			{
				type: "input",
				name: "keywords",
				label: "Keywords",
				message:
					"Enter some keywords (separated by commas) to describe your project:",
				hint: "(optional)",
				optional: true,
				resultTransform: transformKeywords,
				migrate: (ctx) =>
					(
						ctx.ioPackageJson.common?.keywords ||
						ctx.packageJson.common?.keywords ||
						[]
					).join(","),
			},
			{
				type: "input",
				name: "contributors",
				label: "Contributors",
				message:
					"If you have any contributors, please enter their names (seperated by commas):",
				hint: "(optional)",
				optional: true,
				resultTransform: transformContributors,
				migrate: (ctx) =>
					(ctx.packageJson.contributors || [])
						.map((c: Record<string, string>) => c.name)
						.filter((name: string) => !!name)
						.join(","),
			},
			{
				condition: { name: "cli", value: false },
				type: "web_upload" as any,
				name: "icon",
				label: "Adapter Icon",
				message: "Upload your adapter icon",
				hint: "(optional)",
				optional: true,
			},
		],
	},
	{
		title: "Technical",
		headline: "Nice! Let's get technical...",
		questions: [
			{
				type: "select",
				name: "expert",
				label: "Expert Mode",
				message: "How detailed do you want to configure your project?",
				choices: [
					{
						message: "Just ask me the most important stuff!",
						value: "no",
					},
					{ message: "I want to specify everything!", value: "yes" },
				],
				optional: true,
				migrate: () => "yes", // always force expert mode for migrate
			},
			styledMultiselect({
				name: "features",
				label: "Features",
				message: "Which features should your project contain?",
				initial: [0],
				choices: [
					{ message: "Adapter", value: "adapter" },
					{ message: "Visualization", value: "vis" },
				],
				action: checkMinSelections.bind(undefined, "feature", 1),
				migrate: async (ctx) =>
					[
						(await ctx.directoryExists("admin")) ? "adapter" : null,
						(await ctx.directoryExists("widgets")) ? "vis" : null,
					].filter((f) => !!f) as string[],
			}),
			styledMultiselect({
				condition: { name: "features", contains: "adapter" },
				name: "adminFeatures",
				label: "Admin Features",
				expert: true,
				message:
					"Which additional features should be available in the admin?",
				hint: "(optional)",
				initial: [],
				choices: [
					{ message: "An extra tab", value: "tab" },
					{ message: "Custom options for states", value: "custom" },
				],
				migrate: async (ctx) =>
					[
						(await ctx.fileExists("admin/tab.html")) ||
						(await ctx.fileExists("admin/tab_m.html"))
							? "tab"
							: null,
						(await ctx.fileExists("admin/custom.html")) ||
						(await ctx.fileExists("admin/custom_m.html"))
							? "custom"
							: null,
					].filter((f) => !!f) as string[],
			}),
			{
				condition: { name: "features", contains: "adapter" },
				type: "select",
				name: "type",
				label: "Adapter Type",
				message: "Which category does your adapter fall into?",
				choices: [
					{
						message:
							"Alarm / security         (Home, car, boat, ...)",
						value: "alarm",
					},
					{
						message:
							"Calendars                (also schedules, etc., ...)",
						value: "date-and-time",
					},
					{
						message:
							"Cars / Vehicles          (trip information, vehicle status, aux. heating, ...)",
						value: "vehicle",
					},
					{
						message:
							"Climate control          (A/C, Heaters, air filters, ...)",
						value: "climate-control",
					},
					{
						message: "Communication protocols  (MQTT, ...)",
						value: "protocols",
					},
					{
						message:
							"Data storage             (SQL/NoSQL, file storage, logging, ...)",
						value: "storage",
					},
					{
						message:
							"Data transmission        (for other services via REST api, websockets, ...)",
						value: "communication",
					},
					{
						message:
							"Garden                   (Mowers, watering, ...)",
						value: "garden",
					},
					{
						message:
							"General purpose          (like admin, web, discovery, ...)",
						value: "general",
					},
					{
						message:
							"Geo positioning          (transmission and receipt of position data)",
						value: "geoposition",
					},
					{
						message:
							"Hardware                 (low-level, multi-purpose)",
						value: "hardware",
					},
					{
						message:
							"Health                   (Fitness sensors, weight, pulse, ...)",
						value: "health",
					},
					{
						message:
							"Household devices        (Vacuums, kitchen, ...)",
						value: "household",
					},
					{ message: "Lighting control", value: "lighting" },
					{
						message:
							"Logic                    (Scripts, rules, parsers, scenes, ...)",
						value: "logic",
					},
					{
						message:
							"Messaging                (E-Mail, Telegram, WhatsApp, ...)",
						value: "messaging",
					},
					{
						message: "Meters for energy, electricity, ...",
						value: "energy",
					},
					{
						message: "Meters for water, gas, oil, ...",
						value: "metering",
					},
					{
						message:
							"Miscellaneous data       (Import/export of contacts, gasoline prices, ...)",
						value: "misc-data",
					},
					{
						message:
							"Miscellaneous utilities  (Data import/emport, backup, ...)",
						value: "utility",
					},
					{
						message:
							"Multimedia               (TV, audio, remote controls, ...)",
						value: "multimedia",
					},
					{
						message:
							"Network infrastructure   (Hardware, printers, phones, ...)",
						value: "infrastructure",
					},
					{
						message:
							"Network utilities        (Ping, UPnP, network discovery, ...)",
						value: "network",
					},
					{
						message:
							"Smart home systems       (3rd party, hardware and software)",
						value: "iot-systems",
					},
					{
						message:
							"Visualizations           (VIS, MaterialUI, mobile views, ...)",
						value: "visualization",
					},
					// visualization-icons and visualization-widgets are a separate question for
					// VIS projects
					{
						message:
							"Weather                  (Forecast, air quality, statistics, ...)",
						value: "weather",
					},
				],
				migrate: (ctx) => ctx.ioPackageJson.common?.type,
			},
			{
				condition: { name: "features", contains: "vis" },
				type: "select",
				name: "type",
				label: "VIS Type",
				message: "Which kind of visualization is this?",
				choices: [
					{ message: "Icons for VIS", value: "visualization-icons" },
					{ message: "VIS widgets", value: "visualization-widgets" },
				],
				migrate: (ctx) => ctx.ioPackageJson.common?.type,
			},
			{
				condition: { name: "features", contains: "adapter" },
				type: "select",
				name: "startMode",
				label: "Start Mode",
				expert: true,
				message: "When should the adapter be started?",
				initial: "daemon",
				choices: [
					{
						message: "always",
						hint: dim.gray("(recommended for most adapters)"),
						value: "daemon",
					},
					{
						message: `when the ".alive" state is true`,
						value: "subscribe",
					},
					{ message: "depending on a schedule", value: "schedule" },
					{
						message: "when the instance object changes",
						value: "once",
					},
					{ message: "never", value: "none" },
				],
				migrate: (ctx) => ctx.ioPackageJson.common?.mode,
			},
			{
				condition: { name: "startMode", value: "schedule" },
				type: "select",
				name: "scheduleStartOnChange",
				label: "Schedule",
				expert: true,
				message:
					"Should the adapter also be started when the configuration is changed?",
				initial: "no",
				choices: ["yes", "no"],
				migrate: (ctx) =>
					ctx.ioPackageJson.common?.allowInit ? "yes" : "no",
			},
			{
				condition: { name: "features", contains: "adapter" },
				type: "select",
				name: "connectionType",
				label: "Connection Type",
				optional: true, // We cannot assume this when creating templates
				message: `From where will the adapter get its data?`,
				choices: [
					{ message: "Website or cloud service", value: "cloud" },
					{
						message: "Local network or wireless",
						value: "local",
					},
				],
				migrate: (ctx) => ctx.ioPackageJson.common?.connectionType,
			},
			{
				condition: { name: "features", contains: "adapter" },
				type: "select",
				name: "dataSource",
				label: "Data Source",
				optional: true, // We cannot assume this when creating templates
				message: `How will the adapter receive its data?`,
				choices: [
					{
						message:
							"Request it regularly from the service or device",
						value: "poll",
					},
					{
						message:
							"The service or device actively sends new data",
						value: "push",
					},
					{
						message: "Assumption or educated guess",
						hint: "(e.g. when receiving incomplete events)",
						value: "assumption",
					},
				],
				migrate: (ctx) => ctx.ioPackageJson.common?.dataSource,
			},
			{
				condition: { name: "features", contains: "adapter" },
				type: "select",
				name: "connectionIndicator",
				label: "Show Connection Indicator",
				expert: true,
				message: `Do you want to indicate the connection state?`,
				hint: "(To some device or some service)",
				initial: "no",
				choices: ["yes", "no"],
				migrate: (ctx) =>
					ctx.ioPackageJson.instanceObjects?.some(
						(o: any) => o._id === "info.connection",
					)
						? "yes"
						: "no",
			},
		],
	},
	{
		title: "Settings",
		headline: "Define the settings for the adapter",
		questions: [
			{
				condition: [
					{ name: "features", contains: "adapter" },
					{ name: "cli", value: false },
				],
				type: "web_unknown" as any, // TODO: give this a good type
				name: "adapterSettings",
				label: "Adapter Settings",
				message: "Define the settings for the adapter",
				hint: "(optional)",
				optional: true,
			},
		],
	},
	{
		title: "Code",
		headline: "Some more questions about the source code...",
		questions: [
			{
				condition: { name: "features", contains: "adapter" },
				type: "select",
				name: "language",
				label: "Programming Language",
				message:
					"Which language do you want to use to code the adapter?",
				choices: ["JavaScript", "TypeScript"],
				migrate: async (ctx) =>
					(await ctx.hasFilesWithExtension(
						"src",
						".ts",
						(f) => !f.endsWith(".d.ts"),
					))
						? "TypeScript"
						: "JavaScript",
			},
			{
				condition: [{ name: "features", contains: "adapter" }],
				type: "select",
				name: "adminReact",
				label: "Admin with React",
				message: "Use React for the Admin UI?",
				initial: "no",
				choices: ["yes", "no"],
				migrate: async (ctx) =>
					(await ctx.hasFilesWithExtension(
						"admin/src",
						".jsx",
						(f) => !f.endsWith("tab.jsx"),
					)) ||
					(await ctx.hasFilesWithExtension(
						"admin/src",
						".tsx",
						(f) => !f.endsWith("tab.tsx"),
					))
						? "yes"
						: "no",
			},
			{
				condition: [{ name: "adminFeatures", contains: "tab" }],
				type: "select",
				name: "tabReact",
				label: "Tab with React",
				message: "Use React for the tab UI?",
				initial: "no",
				choices: ["yes", "no"],
				migrate: async (ctx) =>
					(await ctx.fileExists("admin/src/tab.jsx")) ||
					(await ctx.fileExists("admin/src/tab.tsx"))
						? "yes"
						: "no",
			},
			styledMultiselect({
				condition: { name: "language", value: "JavaScript" },
				name: "tools",
				label: "Tools",
				message: "Which of the following tools do you want to use?",
				initial: [0, 1],
				choices: [
					{ message: "ESLint", hint: "(recommended)" },
					{ message: "type checking", hint: "(recommended)" },
					{
						message: "devcontainer",
						hint:
							"(Requires VSCode and Docker, starts a fresh ioBroker in a Docker container with only your adapter installed)",
					},
				],
				migrate: async (ctx) =>
					[
						ctx.hasDevDependency("eslint") ? "ESLint" : null,
						ctx.hasDevDependency("typescript")
							? "type checking"
							: null,
						(await ctx.directoryExists(".devcontainer"))
							? "devcontainer"
							: null,
					].filter((f) => !!f) as string[],
			}),
			styledMultiselect({
				condition: { name: "language", value: "TypeScript" },
				name: "tools",
				label: "Tools",
				message: "Which of the following tools do you want to use?",
				initial: [0],
				choices: [
					{ message: "ESLint", hint: "(recommended)" },
					{
						message: "Prettier",
						hint:
							"(requires ESLint, enables automatic code formatting in VSCode)",
					},
					{ message: "code coverage" },
					{
						message: "devcontainer",
						hint:
							"(Requires VSCode and Docker, starts a fresh ioBroker in a Docker container with only your adapter installed)",
					},
				],
				action: checkTypeScriptTools,
				migrate: async (ctx) =>
					[
						ctx.hasDevDependency("eslint") ? "ESLint" : null,
						ctx.hasDevDependency("prettier") ? "Prettier" : null,
						ctx.hasDevDependency("nyc") ? "code coverage" : null,
						(await ctx.directoryExists(".devcontainer"))
							? "devcontainer"
							: null,
					].filter((f) => !!f) as string[],
			}),
			{
				type: "select",
				name: "releaseScript",
				label: "Release Script",
				message:
					"Would you like to automate new releases with one simple command?",
				initial: "yes",
				choices: ["yes", "no"],
				migrate: async (ctx) =>
					ctx.hasDevDependency("@alcalzone/release-script")
						? "yes"
						: "no",
			},
			{
				condition: [
					{ name: "features", contains: "adapter" },
					{ name: "cli", value: true },
				],
				type: "select",
				name: "devServer",
				label: "ioBroker dev-server",
				optional: true,
				message:
					"Would you like to use dev-server to develop and test your code with a simple command line tool?",
				initial: "yes",
				choices: ["yes", "no"],
				migrate: () => "yes",
			},
			{
				condition: { name: "devServer", contains: "yes" },
				type: "numeral",
				name: "devServerPort",
				label: "dev-server Admin Port",
				message:
					"Please choose the port number on which dev-server should present the admin web interface:",
				initial: 8081,
				min: 1024,
				max: 0xffff,
				migrate: () => 8081,
			},
			{
				condition: { name: "features", contains: "adapter" },
				type: "select",
				name: "indentation",
				label: "Indentation",
				message: "Do you prefer tab or space indentation?",
				initial: "Tab",
				choices: ["Tab", "Space (4)"],
				migrate: async (ctx) =>
					(await ctx.analyzeCode("\t", "  ")) ? "Tab" : "Space (4)",
			},
			{
				condition: { name: "features", contains: "adapter" },
				type: "select",
				name: "quotes",
				label: "Quotes",
				message: "Do you prefer double or single quotes?",
				initial: "double",
				choices: ["double", "single"],
				migrate: async (ctx) =>
					(await ctx.analyzeCode('"', "'")) ? "double" : "single",
			},
			{
				condition: { name: "features", contains: "adapter" },
				type: "select",
				name: "es6class",
				label: "ES6 Class",
				expert: true,
				message: "How should the main adapter file be structured?",
				initial: "yes",
				choices: [
					{
						message: "As an ES6 class",
						hint: "(recommended)",
						value: "yes",
					},
					{
						message: "With some methods",
						hint: "(like legacy code)",
						value: "no",
					},
				],
				migrate: async (ctx) =>
					(await ctx.getMainFileContent()).match(/^[ \t]*class/gm)
						? "yes"
						: "no",
			},
		],
	},
	{
		title: "Administrative",
		headline: "Almost done! Just a few administrative details...",
		questions: [
			{
				type: "input",
				name: "authorName",
				label: "Author Name",
				message: "Please enter your name (or nickname):",
				action: checkAuthorName,
				migrate: (ctx) => ctx.packageJson.author?.name,
			},
			{
				type: "input",
				name: "authorGithub",
				label: "GitHub Name",
				message: "What's your name/org on GitHub?",
				initial: ((answers: Answers) => answers.authorName) as any,
				action: checkAuthorName,
				migrate: (ctx) =>
					ctx.ioPackageJson.common?.extIcon?.replace(
						/^\w+:\/\/[^\/]+\.com\/([^\/]+)\/.+$/,
						"$1",
					),
			},
			{
				type: "input",
				name: "authorEmail",
				label: "Adapter E-Mail",
				message: "What's your email address?",
				action: checkEmail,
				migrate: (ctx) => ctx.packageJson.author?.email,
			},
			{
				type: "select",
				name: "gitRemoteProtocol",
				label: "GIT Protocol",
				message: "Which protocol should be used for the repo URL?",
				expert: true,
				initial: "HTTPS",
				choices: [
					{
						message: "HTTPS",
					},
					{
						message: "SSH",
						hint: "(requires you to setup SSH keys)",
					},
				],
				migrate: (ctx) =>
					ctx.packageJson.repository?.url?.match(/^git@/)
						? "SSH"
						: "HTTPS",
			},
			{
				condition: { name: "cli", value: true },
				type: "select",
				name: "gitCommit",
				label: "Git Commit",
				expert: true,
				message: "Initialize the GitHub repo automatically?",
				initial: "no",
				choices: ["yes", "no"],
				migrate: () => "no",
			},
			{
				type: "select",
				name: "license",
				label: "License",
				message: "Which license should be used for your project?",
				initial: 5,
				choices: [
					// TODO: automate (GH#1)
					"GNU AGPLv3",
					"GNU GPLv3",
					"GNU LGPLv3",
					"Mozilla Public License 2.0",
					"Apache License 2.0",
					"MIT License",
					"The Unlicense",
				],
				migrate: (ctx) =>
					Object.keys(licenses).find(
						(k) => licenses[k].id === ctx.packageJson.license,
					),
			},
			{
				type: "select",
				name: "dependabot",
				label: "Dependabot",
				expert: true,
				message:
					"Do you want to receive regular dependency updates through Pull Requests?",
				hint: "(recommended)",
				initial: "no",
				choices: ["yes", "no"],
				migrate: async (ctx) =>
					(await ctx.fileExists(".github/dependabot.yml"))
						? "yes"
						: "no",
			},
		],
	},
];

/** Only the questions */
export const questions = questionGroups
	.map((q) => q.questions)
	.reduce((arr, next) => arr.concat(...next), []);

export interface BaseAdapterSettings<T> {
	key: string;
	label?: string;
	defaultValue?: T;
}
export interface StringAdapterSettings extends BaseAdapterSettings<string> {
	inputType: "text";
}
export interface NumberAdapterSettings extends BaseAdapterSettings<number> {
	inputType: "number";
}
export interface BooleanAdapterSettings extends BaseAdapterSettings<boolean> {
	inputType: "checkbox";
}

export interface AdapterSelectOption {
	value: string;
	text: string;
}

export interface SelectAdapterSettings extends BaseAdapterSettings<string> {
	inputType: "select";
	options: AdapterSelectOption[];
}
export type AdapterSettings =
	| StringAdapterSettings
	| NumberAdapterSettings
	| BooleanAdapterSettings
	| SelectAdapterSettings;

/**
 * An icon in binary or base64-encoded format.
 */
export interface UploadedIcon {
	/** The data icon in binary or base64-encoded format. */
	data: string | Buffer;
	/** The file extension to use with the icon. */
	extension: string;
}

export interface Answers {
	adapterName: string;
	description?: string;
	keywords?: string[];
	expert?: "yes" | "no";
	authorName: string;
	authorEmail: string;
	authorGithub: string;
	contributors?: string[];
	language?: "JavaScript" | "TypeScript";
	features: ("adapter" | "vis")[];
	adminFeatures?: ("tab" | "custom")[];
	tools?: (
		| "ESLint"
		| "Prettier"
		| "type checking"
		| "code coverage"
		| "devcontainer"
	)[];
	ecmaVersion?: 2015 | 2016 | 2017 | 2018 | 2019 | 2020;
	title?: string;
	license?: string;
	type: string;
	adminReact?: "yes" | "no";
	tabReact?: "yes" | "no";
	releaseScript?: "yes" | "no";
	devServer?: "yes" | "no";
	devServerPort?: number;
	indentation?: "Tab" | "Space (4)";
	quotes?: "single" | "double";
	es6class?: "yes" | "no";
	gitRemoteProtocol: "HTTPS" | "SSH";
	gitCommit?: "yes" | "no";
	dependabot?: "yes" | "no";
	startMode?: "daemon" | "schedule" | "subscribe" | "once" | "none";
	scheduleStartOnChange?: "yes" | "no";
	connectionIndicator?: "yes" | "no";
	connectionType?: "cloud" | "local";
	dataSource?: "poll" | "push" | "assumption";
	icon?: UploadedIcon;
	/** An array of predefined adapter options */
	adapterSettings?: AdapterSettings[];
}

export function checkAnswers(answers: Partial<Answers>): void {
	for (const q of questions) {
		// We don't use dynamic question names
		const questionName = q.name as string;
		const answer = (answers as any)[questionName];
		const conditionFulfilled = testCondition(q.condition, answers);
		if (!q.optional && conditionFulfilled && answer == undefined) {
			// A required answer was not given
			throw new Error(`Missing answer "${questionName}"!`);
		} else if (!conditionFulfilled && answer != undefined) {
			// TODO: Find a fool-proof way to check for extraneous answers
			if (
				questions.filter((qq) => (qq.name as string) === questionName)
					.length > 0
			) {
				// For now, don't enforce conditions for questions with multiple branches
				continue;
			}
			// An extraneous answer was given
			throw new Error(`Extraneous answer "${questionName}" given!`);
		}
	}
}

export async function formatAnswers(
	answers: Record<string, any>,
): Promise<Record<string, any>> {
	for (const q of questions) {
		const conditionFulfilled = testCondition(q.condition, answers);
		if (!conditionFulfilled) continue;

		// Apply an optional transformation
		if (
			answers[q.name as string] != undefined &&
			typeof q.resultTransform === "function"
		) {
			const transformed = q.resultTransform(answers[q.name as string]);
			answers[q.name as string] =
				transformed instanceof Promise
					? await transformed
					: transformed;
		}
	}
	return answers;
}

export async function validateAnswers(
	answers: Answers,
	disableValidation: (keyof Answers)[] = [],
): Promise<void> {
	for (const q of questions) {
		const conditionFulfilled = testCondition(q.condition, answers);
		if (!conditionFulfilled) continue;
		if (q.action == undefined) continue;
		if (disableValidation.indexOf(q.name as keyof Answers) > -1) continue;

		const testResult = await q.action(
			answers[q.name as keyof Answers] as any,
		);
		if (typeof testResult === "string") {
			throw new Error(testResult);
		}
	}
}

export function getDefaultAnswer<T extends keyof Answers>(
	key: T,
): Answers[T] | undefined {
	// Apparently, it is not possible to make the return type depend on the
	// given object key: https://github.com/microsoft/TypeScript/issues/31672
	// So we cast to `any` until a solution emerges
	if (key === "adapterSettings") {
		return [
			{
				key: "option1",
				defaultValue: true,
				inputType: "checkbox",
			},
			{
				key: "option2",
				defaultValue: "42",
				inputType: "text",
			},
		] as any;
	} else if (key === "keywords") {
		return ["ioBroker", "template", "Smart Home", "home automation"] as any;
	}
}

export function getIconName(answers: Answers): string {
	return `${answers.adapterName}.${answers.icon?.extension || "png"}`;
}
