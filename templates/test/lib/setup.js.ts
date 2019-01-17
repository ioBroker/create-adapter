import { readFile, TemplateFunction } from "../../../src/lib/createAdapter";

export = (answers => {
	return readFile("setup.raw.js", __dirname);
}) as TemplateFunction;
