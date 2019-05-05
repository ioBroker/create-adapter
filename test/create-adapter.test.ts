// Disable API requests while testing
process.env.TESTING = "true";

import * as fs from "fs-extra";
import * as path from "path";
import { createAdapter } from "../src/index";
import { File, writeFiles } from "../src/lib/createAdapter";
import { Answers } from "../src/lib/questions";

const baselineDir = path.join(__dirname, "../test/baselines");

async function generateBaselines(
	testName: string,
	answers: Answers,
	filterFilesPredicate?: (file: File) => boolean,
) {
	const files = await createAdapter(answers);

	const testDir = path.join(baselineDir, testName);
	await fs.emptyDir(testDir);
	await writeFiles(
		testDir,
		typeof filterFilesPredicate === "function"
			? files.filter(filterFilesPredicate)
			: files,
	);
}

// TODO: Mock network requests

async function expectSuccess(
	testName: string,
	answers: Answers,
	filterFilesPredicate?: (file: File) => boolean,
) {
	await generateBaselines(testName, answers, filterFilesPredicate);
}

async function expectFail(
	testName: string,
	answers: Partial<Answers>,
	message: string,
) {
	await generateBaselines(
		testName,
		answers as Answers,
	).should.be.rejectedWith(message);
	const testDir = path.join(baselineDir, testName);
	await fs.pathExists(testDir).should.become(false);
}

const baseAnswers: Answers = {
	adapterName: "test-adapter",
	title: "Is used to test the creator",
	startMode: "daemon",
	features: ["adapter"],
	connectionIndicator: "no",
	adminFeatures: [],
	type: "general",
	language: "TypeScript",
	tools: ["ESLint"],
	indentation: "Tab",
	quotes: "double",
	es6class: "no",
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
			expectFail(
				"incompleteAnswersEmptyTitle",
				answers,
				"Please enter a title",
			);
		});

		it("empty title 2", () => {
			const answers: Answers = {
				...baseAnswers,
				title: "   ",
			};
			expectFail(
				"incompleteAnswersEmptyTitle",
				answers,
				"Please enter a title",
			);
		});

		it("invalid title 1", () => {
			const answers: Answers = {
				...baseAnswers,
				title: "Adapter for ioBroker",
			};
			expectFail(
				"incompleteAnswersEmptyTitle",
				answers,
				"must not contain the words",
			);
		});
	});

	describe("generate baselines =>", function() {
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
			it("Adapter (w/ custom and tab), TypeScript, ESLint, Tabs, Double quotes, MIT License", async () => {
				const answers: Answers = {
					...baseAnswers,
					adminFeatures: ["custom", "tab"],
				};
				await expectSuccess(
					"adapter_TS_ESLint_Tabs_DoubleQuotes_MIT",
					answers,
				);
			});

			it("Adapter, TypeScript (ES6 class), ESLint, Tabs, Double quotes, MIT License", async () => {
				const answers: Answers = {
					...baseAnswers,
					es6class: "yes",
				};
				await expectSuccess(
					"adapter_TS_ES6Class_ESLint_Tabs_DoubleQuotes_MIT",
					answers,
				);
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
				await expectSuccess(
					"adapter_JS_ESLint_TypeChecking_Spaces_SingleQuotes_LGPLv3",
					answers,
				);
			});

			it("Adapter, JavaScript (ES6 class), ESLint, Spaces, Single quotes, LGPLv3", async () => {
				const answers: Answers = {
					...baseAnswers,
					language: "JavaScript",
					tools: ["ESLint", "type checking"],
					indentation: "Space (4)",
					quotes: "single",
					es6class: "yes",
					license: "GNU LGPLv3" as any,
				};
				await expectSuccess(
					"adapter_JS_ES6Class_ESLint_TypeChecking_Spaces_SingleQuotes_LGPLv3",
					answers,
				);
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
				await expectSuccess("TS_SingleQuotes", answers, file => {
					return (
						(file.name.endsWith(".ts") &&
							!file.name.endsWith(".d.ts")) ||
						file.name === "eslint.json"
					);
				});
			});

			it(`Connection indicator`, async () => {
				const answers: Answers = {
					...baseAnswers,
					connectionIndicator: "yes",
				};
				await expectSuccess(
					"connectionIndicator_yes",
					answers,
					file =>
						file.name.endsWith("main.ts") ||
						file.name.endsWith("main.js") ||
						file.name === "io-package.json",
				);
			});

			it(`Custom adapter settings`, async () => {
				const answers: Answers = {
					...baseAnswers,
					adapterSettings: [
						{
							key: "prop1",
							inputType: "number",
							label: "Property 1",
							defaultValue: 5,
						},
						{
							key: "prop2",
							inputType: "checkbox",
							label: "Property 2",
							defaultValue: true,
						},
					],
				};
				await expectSuccess(
					"customAdapterSettings",
					answers,
					file =>
						file.name.endsWith("main.ts") ||
						file.name.endsWith("main.js") ||
						file.name === "io-package.json" ||
						file.name.endsWith("index_m.html"),
				);
			});

			it(`Different keywords`, async () => {
				const answers: Answers = {
					...baseAnswers,
					keywords: "this, adapter,uses,   different , keywords" as any,
				};
				await expectSuccess("keywords", answers, file =>
					file.name.endsWith("package.json"),
				);
			});
		});
	});
});
