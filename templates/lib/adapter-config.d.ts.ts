import { AdapterSettings, getDefaultAnswer } from "../../src/lib/core/questions";
import type { TemplateFunction } from "../../src/lib/createAdapter";

function generateSettingsProperty(settings: AdapterSettings): string {
	if (settings.inputType === "select" && settings.options) {
		return `
			${settings.key}: (${settings.options.map((opt) => `"${opt.value}"`).join(" | ")});`;
	} else if (settings.inputType === "checkbox") {
		return `
			${settings.key}: boolean;`;
	} else if (settings.inputType === "number") {
		return `
			${settings.key}: number;`;
	} else {
		return `
			${settings.key}: string;`;
	}
}

const templateFunction: TemplateFunction = answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	if (!isAdapter) return;

	const useTypeScript = answers.language === "TypeScript";
	const useTypeChecking = answers.tools && answers.tools.indexOf("type checking") > -1;
	let template: string;
	if (useTypeScript && !useTypeChecking) {
		const adapterSettings: AdapterSettings[] = answers.adapterSettings ?? getDefaultAnswer("adapterSettings")!;
		
		template = `
// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
	namespace ioBroker {
		interface AdapterConfig {${adapterSettings.map(generateSettingsProperty).join("")}
		}
	}
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};
`;
	} else {
		template = `
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

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};
`;
	}

	return template.trim();
};

templateFunction.customPath = answers => (answers.language === "TypeScript" ? "src/" : "") + "lib/adapter-config.d.ts";
export = templateFunction;
