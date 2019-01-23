import { readFile, TemplateFunction } from "../../src/lib/createAdapter";

export = (answers => {

	// This file is also used by gulpfile.js, so we need it in any case
	const useTypeScript = answers.language === "TypeScript";
	if (useTypeScript) return;

	// JS Version
	return readFile("tools.raw.js", __dirname);
}) as TemplateFunction;
