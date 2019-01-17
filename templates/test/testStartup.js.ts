import { readFile, TemplateFunction } from "../../src/lib/createAdapter";

export = (answers => {
	return readFile("testStartup.raw.js", __dirname);
}) as TemplateFunction;
