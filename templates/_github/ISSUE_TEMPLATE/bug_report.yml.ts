import type { TemplateFunction } from "../../../src/lib/createAdapter";
import { readFile } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = _answers => {
	return readFile("bug_report.raw.yml", __dirname);
};

templateFunction.customPath = ".github/ISSUE_TEMPLATE/bug_report.yml";
// Reformatting this would create mixed tabs and spaces
templateFunction.noReformat = true;
export = templateFunction;
