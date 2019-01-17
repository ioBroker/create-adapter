import { readFile, TemplateFunction } from "../../src/lib/createAdapter";

export = (answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	if (!isAdapter) return;

	return readFile("style.raw.css", __dirname);
}) as TemplateFunction;
