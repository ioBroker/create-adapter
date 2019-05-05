import { TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	if (!isAdapter) return;

	const useTypeScript = answers.language === "TypeScript";
	const useTypeChecking = answers.tools && answers.tools.indexOf("type checking") > -1;
	if (useTypeScript && !useTypeChecking) return; // Don't do the copy/delete stuff in the first version... We'll add this later

	const template = `
// This file extends the AdapterConfig type from "@types/iobroker"
// using the actual properties present in io-package.json
// in order to provide typings for adapter.config properties

import { native } from "${useTypeScript ? "../" : ""}../io-package.json";

type _AdapterConfig = typeof native;

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
	namespace ioBroker {
		interface AdapterConfig extends _AdapterConfig {
			// Do not enter anything here!
		}
	}
}
`;
	return template.trim();
};

templateFunction.customPath = answers => (answers.language === "TypeScript" ? "src/" : "") + "lib/adapter-config.d.ts";
export = templateFunction;
