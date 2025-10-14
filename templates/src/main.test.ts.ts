import type { TemplateFunction } from "../../src/lib/createAdapter";
import { readFile } from "../../src/lib/createAdapter";

export = (answers => {
	const useTypeScript = answers.language === "TypeScript";
	const useTSWithoutBuild = answers.language === "TypeScript (without build)";
	if (!useTypeScript && !useTSWithoutBuild) {
		return;
	}

	return readFile("main.test.raw.ts", __dirname);
}) as TemplateFunction;
