import type { TemplateFunction } from "../src/lib/createAdapter";
import { readFile } from "../src/lib/createAdapter";

export = (answers => {
	const useTypeScript = answers.language === "TypeScript";
	if (!useTypeScript) {
		return;
	}

	return readFile("tsconfig.build.raw.json", __dirname);
}) as TemplateFunction;
