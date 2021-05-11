import { readFile, TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {
	
	const useDependabot = answers.dependabot === "yes";
	if (!useDependabot) return;

	return readFile("dependabot-auto-merge.raw.yml", __dirname);
};

templateFunction.customPath = ".github/workflows/dependabot-auto-merge.yml";
// Reformatting this would create mixed tabs and spaces
templateFunction.noReformat = true;
export = templateFunction;
