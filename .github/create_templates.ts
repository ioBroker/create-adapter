import { blue, green } from "ansi-colors";
import * as fs from "fs-extra";
import * as path from "path";
import { createAdapter } from "../src";
import { writeFiles } from "../src/lib/createAdapter";
import { Answers } from "../src/lib/questions";

const outDir = path.join(process.cwd(), "ioBroker.template");

async function generateTemplates(
	templateName: string,
	answers: Answers,
): Promise<void> {
	const files = await createAdapter(answers, ["adapterName", "title"]);

	const templateDir = path.join(outDir, templateName);
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
	ci: ["travis"],
	dependabot: "yes",
	license: "MIT License" as any,
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
})();

// Make sure errors fail the build
process.on("unhandledRejection", (e) => {
	throw e;
});
