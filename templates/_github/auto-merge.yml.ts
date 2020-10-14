import { readFile, TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {
	
	const useDependabot = answers.dependabot === "yes";
	if (!useDependabot) return;

	return readFile("auto-merge.raw.yml", __dirname);
};

templateFunction.customPath = ".github/auto-merge.yml";
export = templateFunction;
