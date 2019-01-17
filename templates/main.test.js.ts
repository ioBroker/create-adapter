import { readFile, TemplateFunction } from "../src/lib/createAdapter";

export = (answers => {

	const useJavaScript = answers.language === "JavaScript";
	if (!useJavaScript) return;

	return readFile("main.test.raw.js", __dirname);
}) as TemplateFunction;
