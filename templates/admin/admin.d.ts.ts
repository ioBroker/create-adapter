import { readFile, TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useTypeScript = answers.language === "TypeScript";
	const useHtml = answers.adminUi === "html";
	const useTypeChecking = answers.tools && answers.tools.indexOf("type checking") > -1;
	if (!useHtml || (!useTypeScript && !useTypeChecking)) return;

	return readFile("admin.raw.d.ts", __dirname);
};

export = templateFunction;
