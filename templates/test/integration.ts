import { readFile, TemplateFunction } from "../../src/lib/createAdapter";

export = (answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	if (!isAdapter) return;

	return readFile("integration.raw.js", __dirname);
}) as TemplateFunction;
