import { readFile, TemplateFunction } from "../../src/lib/createAdapter";

export = (answers => {

	const useTypeScript = answers.language === "TypeScript";
	const useTypeChecking = answers.tools && answers.tools.indexOf("type checking") > -1;
	if (!useTypeScript && !useTypeChecking) return;

	return readFile("tsconfig.raw.json", __dirname);
}) as TemplateFunction;
