import { readFile, TemplateFunction } from "../../src/lib/createAdapter";

export = (_answers => {
	return readFile("package.raw.js", __dirname);
}) as TemplateFunction;
