import type { TemplateFunction } from "../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	return JSON.stringify(answers, undefined, '\t');
};

templateFunction.customPath = ".create-adapter.json";
export = templateFunction;
