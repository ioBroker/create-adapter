import * as JSON5 from "json5";
import type { TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
	const usePrettier = answers.tools && answers.tools.indexOf("Prettier") > -1;
	const useTypeScript = answers.language === "TypeScript";

	if (!useESLint && !usePrettier && !useTypeScript) return;

	const template = `
{
${useTypeScript ? `"typescript.tsdk": "node_modules/typescript/lib",` : ""}
${useESLint ? `"eslint.enable": true,` : ""}
${usePrettier ? (`
	"editor.formatOnSave": true,
	"editor.defaultFormatter": "esbenp.prettier-vscode",
	${useTypeScript ? (`
	"[typescript]": {
		"editor.codeActionsOnSave": {
			"source.organizeImports": true
		},
	},
	`) : ""}
`) : ""}
	"json.schemas": [
		{
			"fileMatch": ["io-package.json"],
			"url": "https://raw.githubusercontent.com/ioBroker/ioBroker.js-controller/master/schemas/io-package.json"
		},
		{
			"fileMatch": [
				"admin/jsonConfig.json",
				"admin/jsonCustom.json",
				"admin/jsonTab.json"
			],
			"url": "https://raw.githubusercontent.com/ioBroker/ioBroker.admin/master/packages/jsonConfig/schemas/jsonConfig.json"
		}
	],
}
`;
return JSON.stringify(JSON5.parse(template), null, 4);
};

templateFunction.customPath = ".vscode/settings.json";
export = templateFunction;
