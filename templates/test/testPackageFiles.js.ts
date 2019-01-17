import { readFile, TemplateFunction } from "../../src/lib/createAdapter";

export = (answers => {
	return readFile("testPackageFiles.raw.js", __dirname);
}) as TemplateFunction;
