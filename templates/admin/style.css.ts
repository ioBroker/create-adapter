import type { TemplateFunction } from "../../src/lib/createAdapter";
import { readFile } from "../../src/lib/createAdapter";

export = (answers => {
	const isAdapter = answers.features.indexOf("adapter") > -1;
	const useJsonConfig = answers.adminUi === "json";
	const noConfig = answers.adminUi === "none";
	if (!isAdapter || useJsonConfig || noConfig) {
		return;
	}

	return readFile("style.raw.css", __dirname);
}) as TemplateFunction;
