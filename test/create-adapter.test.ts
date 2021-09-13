// Disable API requests while testing
process.env.TESTING = "true";

import axios from "axios";
import * as execa from "execa";
import * as fs from "fs-extra";
import { validate as validateJSON } from "jsonschema";
import * as path from "path";
import { createAdapter } from "../src/index";
import type { Answers } from "../src/lib/core/questions";
import { File, writeFiles } from "../src/lib/createAdapter";

const baselineDir = path.join(__dirname, "../test/baselines");
let ioPackageSchema: unknown;

async function generateBaselines(
	testName: string,
	answers: Answers,
	filterFilesPredicate?: (file: File) => boolean,
) {
	const files = await createAdapter(answers);

	const ioPackage = files.find((f) => f.name.endsWith("io-package.json"));
	if (ioPackage) {
		// Download JSON schema for validation
		if (!ioPackageSchema) {
			ioPackageSchema = (
				await axios({
					url: "https://json.schemastore.org/io-package",
				})
			).data;
		}
		// Validate io-package.json
		const result = validateJSON(
			JSON.parse(ioPackage.content as string),
			ioPackageSchema,
		);
		if (result.errors.length) {
			throw new Error(
				`io-package.json had errors:\n${result.errors
					.map((e) => e.message)
					.join("\n")}`,
			);
		}
	}

	const testDir = path.join(baselineDir, testName);
	await fs.emptyDir(testDir);
	await writeFiles(
		testDir,
		typeof filterFilesPredicate === "function"
			? files.filter(filterFilesPredicate)
			: files,
	);

	// Include the npm package content in the baselines (only for full adapter tests)
	if (!filterFilesPredicate && files.some((f) => f.name === "package.json")) {
		const packageContent = JSON.parse(
			execa.sync("npm", ["pack", "--dry-run", "--json"], {
				cwd: testDir,
				encoding: "utf8",
			}).stdout,
		);
		const packageFiles = packageContent[0].files
			.map((f: any) => f.path)
			.sort((a: string, b: string) => {
				// Put directories on top
				const isDirA = a.includes("/");
				const isDirB = b.includes("/");
				if (isDirA && !isDirB) return -1;
				if (isDirB && !isDirA) return 1;
				return a.localeCompare(b);
			});
		await fs.ensureDir(path.join(testDir, "__meta__"));
		await fs.writeFile(
			path.join(testDir, "__meta__/npm_package_files.txt"),
			packageFiles.join("\n"),
		);
	}
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
	cli: true,
	target: "directory",
	adapterName: "test-adapter",
	title: "Is used to test the creator",
	startMode: "daemon",
	features: ["adapter"],
	connectionIndicator: "no",
	connectionType: "local",
	dataSource: "push",
	adminFeatures: [],
	type: "general",
	language: "TypeScript",
	adminReact: "no",
	tabReact: "no",
	releaseScript: "no",
	tools: ["ESLint"],
	indentation: "Tab",
	quotes: "double",
	es6class: "no",
	authorName: "Al Calzone",
	authorGithub: "AlCalzone",
	authorEmail: "al@calzo.ne",
	gitRemoteProtocol: "HTTPS",
	dependabot: "yes",
	gitCommit: "no",
	defaultBranch: "main",
	license: "MIT License",
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

		it("selecting Prettier without ESLint", () => {
			const answers: Answers = {
				...baseAnswers,
				tools: ["Prettier"],
			};
			expectFail(
				"invalidAnswersPrettierWithoutESLint",
				answers,
				"ESLint must be selected",
			);
		});
	});

	describe("generate baselines =>", function () {
		this.timeout(60000);

		before(async () => {
			// Clear the baselines dir, except for the README.md
			await fs.mkdirp(baselineDir);
			const files = await fs.readdir(baselineDir);
			await Promise.all(
				files
					.filter((file) => file !== "README.md")
					.map((file) => fs.remove(path.join(baselineDir, file))),
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

			it("Adapter, TypeScript React", async () => {
				const answers: Answers = {
					...baseAnswers,
					es6class: "yes",
					adminReact: "yes",
				};
				await expectSuccess("adapter_TS_React", answers);
			});

			it("Adapter, JavaScript React", async () => {
				const answers: Answers = {
					...baseAnswers,
					language: "JavaScript",
					es6class: "yes",
					adminReact: "yes",
				};
				await expectSuccess("adapter_JS_React", answers);
			});

			it("Adapter, JavaScript, ESLint, Spaces, Single quotes, Apache License", async () => {
				const answers: Answers = {
					...baseAnswers,
					language: "JavaScript",
					tools: ["ESLint", "type checking"],
					indentation: "Space (4)",
					quotes: "single",
					license: "Apache License 2.0",
				};
				await expectSuccess(
					"adapter_JS_ESLint_TypeChecking_Spaces_SingleQuotes_Apache-2.0",
					answers,
				);
			});

			it("Adapter, JavaScript (ES6 class), ESLint, Spaces, Single quotes, Apache License", async () => {
				const answers: Answers = {
					...baseAnswers,
					language: "JavaScript",
					tools: ["ESLint", "type checking"],
					indentation: "Space (4)",
					quotes: "single",
					es6class: "yes",
					license: "Apache License 2.0",
				};
				await expectSuccess(
					"adapter_JS_ES6Class_ESLint_TypeChecking_Spaces_SingleQuotes_Apache-2.0",
					answers,
				);
			});

			it("Widget", async () => {
				const answers: Answers = {
					cli: true,
					target: "directory",
					adapterName: "test-widget",
					title: "Is used to test the creator",
					features: ["vis"],
					type: "visualization-widgets",
					releaseScript: "no",
					indentation: "Tab",
					quotes: "double",
					authorName: "Al Calzone",
					authorGithub: "AlCalzone",
					authorEmail: "al@calzo.ne",
					gitRemoteProtocol: "HTTPS",
					dependabot: "yes",
					gitCommit: "no",
					defaultBranch: "main",
					license: "MIT License",
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
					(file) => file.name === "io-package.json",
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
					(file) => file.name === "io-package.json",
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
					(file) => file.name === "io-package.json",
				);
			});

			it(`Start mode "schedule"`, async () => {
				const answers: Answers = {
					...baseAnswers,
					startMode: "schedule",
					scheduleStartOnChange: "yes",
				};
				await expectSuccess(
					"startMode_schedule",
					answers,
					(file) => file.name === "io-package.json",
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
					(file) => file.name === "io-package.json",
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
					(file) => file.name === "io-package.json",
				);
			});

			it(`JS with ES2015`, async () => {
				const answers: Answers = {
					...baseAnswers,
					language: "JavaScript",
					ecmaVersion: 2015,
					tools: ["ESLint", "type checking"],
				};
				await expectSuccess(
					"JS_ES2015",
					answers,
					(file) => file.name === ".eslintrc.json",
				);
			});

			it(`TS(X) with single quotes`, async () => {
				const answers: Answers = {
					...baseAnswers,
					quotes: "single",
					adminReact: "yes",
				};
				await expectSuccess("TS_SingleQuotes", answers, (file) => {
					return (
						(file.name.endsWith(".ts") &&
							!file.name.endsWith(".d.ts")) ||
						file.name.endsWith(".tsx") ||
						file.name.startsWith(".eslint")
					);
				});
			});

			it(`TS with Prettier`, async () => {
				const answers: Answers = {
					...baseAnswers,
					tools: ["ESLint", "Prettier"],
				};
				await expectSuccess("TS_Prettier", answers, (file) => {
					return (
						file.name.startsWith(".vscode/") ||
						file.name.startsWith(".eslint") ||
						file.name.startsWith(".prettier") ||
						file.name === "package.json"
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
					(file) =>
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
					(file) =>
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
				await expectSuccess("keywords", answers, (file) =>
					file.name.endsWith("package.json"),
				);
			});

			it(`Contributors`, async () => {
				const answers: Answers = {
					...baseAnswers,
					contributors: `Bill Gates, "Malformed JSON, ,,` as any,
				};
				await expectSuccess(
					"contributors",
					answers,
					(file) => file.name === "package.json",
				);
			});

			it(`SSH protocol for git`, async () => {
				const answers: Answers = {
					...baseAnswers,
					gitRemoteProtocol: "SSH",
				};
				await expectSuccess(
					"git_SSH",
					answers,
					(file) => file.name === "package.json",
				);
			});

			it(`Data Source and Connection Type`, async () => {
				const answers: Answers = {
					...baseAnswers,
					connectionType: "cloud",
					dataSource: "assumption",
				};
				await expectSuccess(
					"connectionType",
					answers,
					(file) => file.name === "io-package.json",
				);
			});

			it(`VSCode devcontainer`, async () => {
				const answers: Answers = {
					...baseAnswers,
					tools: [...(baseAnswers.tools ?? []), "devcontainer"],
				};
				await expectSuccess("devcontainer", answers, (file) =>
					file.name.startsWith(".devcontainer/"),
				);
			});

			it("TabReact AdminReact TS", async () => {
				const answers: Answers = {
					...baseAnswers,
					adminFeatures: ["tab"],
					es6class: "yes",
					adminReact: "yes",
					tabReact: "yes",
				};
				await expectSuccess("tabReact_adminReact_TS", answers, (file) =>
					file.name.startsWith("admin/"),
				);
			});

			it("TabReact AdminHtml JS", async () => {
				const answers: Answers = {
					...baseAnswers,
					adminFeatures: ["tab"],
					tabReact: "yes",
					language: "JavaScript",
					ecmaVersion: 2015,
				};
				await expectSuccess("tabReact_adminHtml_JS", answers, (file) =>
					file.name.startsWith("admin/"),
				);
			});

			it("Release Script", async () => {
				const answers: Answers = {
					...baseAnswers,
					releaseScript: "yes",
				};
				await expectSuccess(
					"releaseScript",
					answers,
					(file) =>
						file.name === "package.json" ||
						file.name === "README.md",
				);
			});

			it("dev-server", async () => {
				const answers: Answers = {
					...baseAnswers,
					devServer: "yes",
					devServerPort: 9003,
				};
				await expectSuccess(
					"dev-server",
					answers,
					(file) => file.name === "README.md",
				);
			});

			it("Start mode: schedule", async () => {
				const answers: Answers = {
					...baseAnswers,
					startMode: "schedule",
					scheduleStartOnChange: "yes",
				};
				await expectSuccess(
					"schedule",
					answers,
					(file) => file.name === "test/integration.js",
				);
			});

			it("Portal w/ GitHub", async () => {
				const answers: Answers = {
					...baseAnswers,
					cli: false,
					target: "github",
					releaseScript: "yes",
				};
				await expectSuccess(
					"portal-github",
					answers,
					(file) =>
						file.name === "README.md" ||
						file.name.endsWith("test-and-release.yml"),
				);
			});
		});
	});
});
