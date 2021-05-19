import { blue, green, red } from "ansi-colors";
import { execSync, ExecSyncOptions } from "child_process";
import * as fs from "fs-extra";
import * as path from "path";
import { createAdapter } from "../src";
import { Answers } from "../src/lib/core/questions";
import { writeFiles } from "../src/lib/createAdapter";

const outDir = path.join(process.cwd(), "ioBroker.template");

function getTemplateDir(templateName: string) {
	return path.join(outDir, templateName);
}

async function generateTemplates(
	templateName: string,
	answers: Answers,
): Promise<void> {
	const files = await createAdapter(answers, ["adapterName", "title"]);

	const templateDir = getTemplateDir(templateName);
	await fs.emptyDir(templateDir);
	await writeFiles(templateDir, files);
}

/* Define the desired templates here */

const baseAnswers = {
	adapterName: "template",
	description: "Template for adapter development",
	authorName: "Author",
	authorGithub: "Author",
	authorEmail: "author@mail.com",
	gitRemoteProtocol: "HTTPS",
	ci: "gh-actions",
	dependabot: "yes",
	license: "MIT License" as any,
	releaseScript: "yes",
} as Answers;

const adapterAnswers: Answers = {
	...baseAnswers,
	startMode: "daemon",
	features: ["adapter"],
	connectionIndicator: "no",
	es6class: "yes",
	type: "general",
	adminFeatures: ["custom", "tab"],
	adminReact: "no",
	tabReact: "no",
};

const templates: Record<string, Answers> = {
	JavaScript: {
		...adapterAnswers,
		language: "JavaScript",
		title: "Template (JavaScript)",
		tools: ["ESLint", "type checking"],
		indentation: "Space (4)",
		quotes: "single",
	},
	JavaScriptReact: {
		...adapterAnswers,
		language: "JavaScript",
		title: "Template (JavaScript)",
		tools: ["ESLint", "type checking"],
		indentation: "Space (4)",
		quotes: "single",
		adminReact: "yes",
		tabReact: "yes",
	},
	TypeScript: {
		...adapterAnswers,
		language: "TypeScript",
		title: "Template (TypeScript)",
		tools: ["ESLint", "code coverage"],
		indentation: "Tab",
		quotes: "double",
	},
	TypeScriptReact: {
		...adapterAnswers,
		language: "TypeScript",
		title: "Template (TypeScript with React)",
		tools: ["ESLint", "code coverage"],
		indentation: "Tab",
		quotes: "double",
		adminReact: "yes",
		tabReact: "yes",
	},
	JavaScriptVIS: {
		...adapterAnswers,
		features: ["adapter", "vis"],
		language: "JavaScript",
		title: "Template (JavaScript with VIS)",
		tools: ["ESLint", "type checking"],
		indentation: "Space (4)",
		quotes: "single",
	},
	TypeScriptVIS: {
		...adapterAnswers,
		features: ["adapter", "vis"],
		language: "TypeScript",
		title: "Template (TypeScript with VIS)",
		tools: ["ESLint", "code coverage"],
		indentation: "Tab",
		quotes: "double",
	},
	VIS: {
		...baseAnswers,
		features: ["vis"],
		title: "Template (VIS only)",
		type: "visualization-widgets",
	},
};

(async () => {
	console.log();
	console.log(green("Removing old templates"));
	console.log(green("======================"));
	const directories = (await fs.readdir(outDir))
		.filter((entry) => !/^\./.test(entry)) // Don't delete dotfiles/dotdirs
		.map((entry) => path.join(outDir, entry))
		.filter((entry) => fs.statSync(entry).isDirectory());
	await Promise.all(directories.map((dir) => fs.remove(dir)));

	console.log();
	console.log(green("Creating templates"));
	console.log(green("======================"));
	const keys = Object.keys(templates);
	for (let i = 0; i < keys.length; i++) {
		const tplName = keys[i];
		console.log();
		console.log(blue(`[${i + 1}/${keys.length}] `) + tplName);
		await generateTemplates(tplName, templates[tplName]);
	}

	if (process.env.TESTING) {
		let hadError = false;
		console.log();
		console.log(green("Type-Check and Lint templates"));
		console.log(green("============================="));
		for (let i = 0; i < keys.length; i++) {
			const tplName = keys[i];
			console.log();
			console.log(blue(`[${i + 1}/${keys.length}] `) + tplName);
			const template = templates[tplName];
			const typecheck = template.tools?.includes("type checking");
			const lint = template.tools?.includes("ESLint");
			if (!typecheck && !lint) {
				console.log("nothing to do, skipping this template...");
				continue;
			}
			const templateDir = getTemplateDir(tplName);
			const cmdOpts: ExecSyncOptions = {
				cwd: templateDir,
				stdio: "inherit",
			};
			console.log("installing dependencies...");
			execSync(`npm install --loglevel error --no-audit`, cmdOpts);
			if (lint) {
				console.log("executing ESLint...");
				try {
					execSync(`npm run lint`, cmdOpts);
				} catch (e) {
					hadError = true;
				}
			}
			if (typecheck) {
				console.log("performing a type-check...");
				try {
					execSync(`npm run check`, cmdOpts);
				} catch (e) {
					hadError = true;
				}
			}
		}
		if (hadError) {
			console.error(
				red("At least one template had lint or check errors!"),
			);
			process.exit(1);
		}
	}
})();

// Make sure errors fail the build
process.on("unhandledRejection", (e) => {
	throw e;
});
