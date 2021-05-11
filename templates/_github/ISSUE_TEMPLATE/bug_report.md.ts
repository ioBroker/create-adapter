import { readFile, TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = _answers => {
	return readFile("bug_report.raw.md", __dirname);
};

templateFunction.customPath = ".github/ISSUE_TEMPLATE/bug_report.md";
// Reformatting this would create mixed tabs and spaces
templateFunction.noReformat = true;
export = templateFunction;
