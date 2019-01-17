// tslint:disable:object-literal-key-quotes

// Disable API requests while testing
process.env.TESTING = "true";

import * as fs from "fs-extra";
import * as path from "path";
import { createAdapter } from "./index";
import { File, writeFiles } from "./lib/createAdapter";
import { Answers } from "./lib/questions";

const baselineDir = path.join(__dirname, "../test/baselines");

async function generateBaselines(testName: string, answers: Answers, filterFilesPredicate?: (file: File) => boolean) {
	const files = await createAdapter(answers);

	const testDir = path.join(baselineDir, testName);
	await fs.emptyDir(testDir);
	await writeFiles(
		testDir,
		typeof filterFilesPredicate === "function" ? files.filter(filterFilesPredicate) : files,
	);
}

// TODO: Mock network requests

async function expectSuccess(testName: string, answers: Answers, filterFilesPredicate?: (file: File) => boolean) {
	await generateBaselines(testName, answers, filterFilesPredicate);
}

async function expectFail(testName: string, answers: Partial<Answers>, message: string) {
	await generateBaselines(testName, answers as Answers).should.be.rejectedWith(message);
	const testDir = path.join(baselineDir, testName);
	await fs.pathExists(testDir).should.become(false);
}

const baseAnswers: Answers = {
	adapterName: "test-adapter",
	title: "Is used to test the creator",
	startMode: "daemon",
	features: ["adapter"],
	adminFeatures: [],
	type: "general",
	language: "TypeScript",
	tools: ["TSLint"],
	indentation: "Tab",
	quotes: "double",
	authorName: "Al Calzone",
	authorGithub: "AlCalzone",
	authorEmail: "al@calzo.ne",
	license: "MIT License" as any,
};

describe("adapter creation =>", () => {

	describe("incomplete answer sets should fail =>", () => {

		it("only name", () => {
			const answers = { adapterName: "foobar" };
			expectFail("incompleteAnswersOnlyName", answers, "Missing answer");
		});

		it("no title", () => {
			const { title, ...noTitle } = baseAnswers;
			expectFail("incompleteAnswersNoTitle", noTitle, "Missing answer");
		});

		it("no type", () => {
			const { type, ...noType } = baseAnswers;
			expectFail("incompleteAnswersNoType", noType, "Missing answer");
		});

		it("empty title 1", () => {
			const answers: Answers = {
				...baseAnswers,
				title: "",
			};
			expectFail("incompleteAnswersEmptyTitle", answers, "Please enter a title");
		});

		it("empty title 2", () => {
			const answers: Answers = {
				...baseAnswers,
				title: "   ",
			};
			expectFail("incompleteAnswersEmptyTitle", answers, "Please enter a title");
		});

		it("invalid title 1", () => {
			const answers: Answers = {
				...baseAnswers,
				title: "Adapter for ioBroker",
			};
			expectFail("incompleteAnswersEmptyTitle", answers, "must not contain the words");
		});

	});

	// tslint:disable-next-line:space-before-function-paren
	describe("generate baselines =>", function () {
		this.timeout(60000);

		before(async () => {
			// Clear the baselines dir, except for the README.md
			await fs.mkdirp(baselineDir);
			const files = await fs.readdir(baselineDir);
			await Promise.all(
				files
					.filter(file => file !== "README.md")
					.map(file => fs.remove(path.join(baselineDir, file))),
			);
		});

		describe("full adapter dir =>", () => {
			it("Adapter (w/ custom), TypeScript, TSLint, Tabs, Double quotes, MIT License", async () => {
				const answers: Answers = {
					...baseAnswers,
					adminFeatures: ["custom"],
				};
				await expectSuccess("adapter_TS_TSLint_Tabs_DoubleQuotes_MIT", answers);
			});

			it("Adapter, JavaScript, ESLint, Spaces, Single quotes, LGPLv3", async () => {
				const answers: Answers = {
					...baseAnswers,
					language: "JavaScript",
					tools: ["ESLint", "type checking"],
					indentation: "Space (4)",
					quotes: "single",
					license: "GNU LGPLv3" as any,
				};
				await expectSuccess("adapter_JS_ESLint_TypeChecking_Spaces_SingleQuotes_LGPLv3", answers);
			});

			it("Widget", async () => {
				const answers: Answers = {
					adapterName: "test-widget",
					title: "Is used to test the creator",
					features: ["vis"],
					type: "visualization-widgets",
					indentation: "Tab",
					quotes: "double",
					authorName: "Al Calzone",
					authorGithub: "AlCalzone",
					authorEmail: "al@calzo.ne",
					license: "MIT License" as any,
				};
				await expectSuccess("vis_Widget", answers);
			});
		});

		describe("Single-file component tests =>", () => {
			it("Valid description", async () => {
				const answers: Answers = {
					...baseAnswers,
					description: "This is a short description",
				};
				await expectSuccess(
					"description_valid",
					answers,
					file => file.name === "io-package.json",
				);
			});

			it("Empty description 1", async () => {
				const answers: Answers = {
					...baseAnswers,
					description: "",
				};
				await expectSuccess(
					"description_empty_1",
					answers,
					file => file.name === "io-package.json",
				);
			});

			it("Empty description 2", async () => {
				const answers: Answers = {
					...baseAnswers,
					description: "   ",
				};
				await expectSuccess(
					"description_empty_2",
					answers,
					file => file.name === "io-package.json",
				);
			});

			it(`Start mode "schedule"`, async () => {
				const answers: Answers = {
					...baseAnswers,
					startMode: "schedule",
				};
				await expectSuccess(
					"startMode_schedule",
					answers,
					file => file.name === "io-package.json",
				);
			});

			it(`Adapter with type "storage"`, async () => {
				const answers: Answers = {
					...baseAnswers,
					features: ["adapter"],
					type: "storage",
				};
				await expectSuccess(
					"type_storage",
					answers,
					file => file.name === "io-package.json",
				);
			});

			it(`VIS with type "visualization-icons"`, async () => {
				const answers: Answers = {
					...baseAnswers,
					features: ["vis"],
					type: "visualization-icons",
				};
				await expectSuccess(
					"type_visualization-icons",
					answers,
					file => file.name === "io-package.json",
				);
			});

			it(`JS with ES2018`, async () => {
				const answers: Answers = {
					...baseAnswers,
					language: "JavaScript",
					ecmaVersion: 2018,
					tools: ["ESLint", "type checking"],
				};
				await expectSuccess(
					"JS_ES2018",
					answers,
					file => file.name === ".eslintrc.json",
				);
			});

			it(`TS with single quotes`, async () => {
				const answers: Answers = {
					...baseAnswers,
					quotes: "single",
				};
				await expectSuccess(
					"TS_SingleQuotes",
					answers,
					file => {
						return (
							file.name.endsWith(".ts")
							&& !file.name.endsWith(".d.ts")
						) || file.name === "tslint.json";
					},
				);
			});
		});

	});

});
