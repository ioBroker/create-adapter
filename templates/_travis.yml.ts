import { readFile, TemplateFunction } from "../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	if (!isAdapter) return;

	return readFile("_travis.raw.yml", __dirname);
};

templateFunction.customPath = ".travis.yml";
// .travis.yml is always formatted with 2 spaces
templateFunction.noReformat = true;
export = templateFunction;
