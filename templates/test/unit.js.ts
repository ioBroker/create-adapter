import { readFile, TemplateFunction } from "../../src/lib/createAdapter";

export = (answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	if (!isAdapter) return;

	return readFile("unit.raw.js", __dirname);
}) as TemplateFunction;
