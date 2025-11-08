import type { TemplateFunction } from "../../../src/lib/createAdapter";
import { readFile } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = _answers => {
	return readFile("feature_request.raw.yml", __dirname);
};

templateFunction.customPath = ".github/ISSUE_TEMPLATE/feature_request.yml";
// Reformatting this would create mixed tabs and spaces
templateFunction.noReformat = true;
export = templateFunction;
