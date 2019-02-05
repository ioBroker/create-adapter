import { readFile, TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {
	return readFile("bug_report.raw.md", __dirname);
};

templateFunction.customPath = ".github/ISSUE_TEMPLATE/bug_report.md";
export = templateFunction;
