import type { TemplateFunction } from "../src/lib/createAdapter";
import { readFile } from "../src/lib/createAdapter";

export = (answers => {
	const useTypeChecking = answers.language === "JavaScript" && answers.tools?.includes("type checking");
	if (!useTypeChecking) {
		return;
	}

	return readFile("tsconfig.check.raw.json", __dirname);
}) as TemplateFunction;
