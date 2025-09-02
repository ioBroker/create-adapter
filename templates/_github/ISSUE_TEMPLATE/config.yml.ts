import { readFile, TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = _answers => {
	return readFile("config.raw.yml", __dirname);
};

templateFunction.customPath = ".github/ISSUE_TEMPLATE/config.yml";
// Reformatting this would create mixed tabs and spaces
templateFunction.noReformat = true;
export = templateFunction;