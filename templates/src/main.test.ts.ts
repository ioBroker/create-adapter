import { readFile, TemplateFunction } from "../../src/lib/createAdapter";

export = (answers => {

	const useTypeScript = answers.language === "TypeScript";
	if (!useTypeScript) return;

	return readFile("main.test.raw.ts", __dirname);
}) as TemplateFunction;
