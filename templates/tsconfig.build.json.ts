import type { TemplateFunction } from "../src/lib/createAdapter";
import { readFile } from "../src/lib/createAdapter";

export = (answers => {
	const useTypeScript = answers.language === "TypeScript";
	const useTSWithoutBuild = answers.language === "TypeScript (without build)";
	if (!useTypeScript || useTSWithoutBuild) {
		return;
	}

	return readFile("tsconfig.build.raw.json", __dirname);
}) as TemplateFunction;
