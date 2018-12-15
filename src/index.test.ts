// tslint:disable:object-literal-key-quotes

import * as fs from "fs-extra";
import * as path from "path";
import { createAdapter } from "./index";
import { loadLicense } from "./lib/actionsAndTransformers";
import { writeFiles } from "./lib/createAdapter";
import { Answers } from "./lib/questions";

const baselineDir = path.join(__dirname, "../test/baselines");

async function generateBaselines(testName: string, answers: Answers) {
	const files = await createAdapter(answers);

	const testDir = path.join(baselineDir, testName);
	await fs.emptyDir(testDir);
	await writeFiles(testDir, files);
}

// TODO: Mock network requests

async function expectSuccess(testName: string, answers: Answers) {
	await generateBaselines(testName, answers as Answers);
}

async function expectFail(testName: string, answers: Partial<Answers>, message: string) {
	await generateBaselines(testName, answers as Answers).should.be.rejectedWith(message);
	const testDir = path.join(baselineDir, testName);
	await fs.pathExists(testDir).should.become(false);
}

describe("adapter creation =>", () => {

	describe("incomplete answer sets should fail =>", () => {

		it("only name", () => {
			const answers = { adapterName: "foobar" };
			expectFail("incompleteAnswersOnlyName", answers, "Missing answer");
		});

	});

	describe("generate valid baselines =>", function() {
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

		it("Adapter, TypeScript, TSLint, Tabs, MIT License", async () => {
			const answers: Answers = {
				adapterName: "test-adapter",
				features: ["Adapter"],
				language: "TypeScript",
				tools: ["TSLint"],
				indentation: "Tab",
				authorName: "Al Calzone",
				authorGithub: "AlCalzone",
				authorEmail: "al@calzo.ne",
				license: "MIT License" as any,
			};
			await expectSuccess("adapter_TS_TSLint_Tabs_MIT", answers);
		});

		it("Adapter, JavaScript, ESLint, Spaces, LGPLv3", async () => {
			const answers: Answers = {
				adapterName: "test-adapter",
				features: ["Adapter"],
				language: "JavaScript",
				tools: ["ESLint", "type checking"],
				indentation: "Space (4)",
				authorName: "Al Calzone",
				authorGithub: "AlCalzone",
				authorEmail: "al@calzo.ne",
				license: "GNU LGPLv3" as any,
			};
			await expectSuccess("adapter_JS_ESLint_TypeChecking_Spaces_LGPLv3", answers);
		});

	});

});
