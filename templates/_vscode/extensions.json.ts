import * as JSON5 from "json5";
import type { TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
	const usePrettier = answers.tools && answers.tools.indexOf("Prettier") > -1;

	if (!useESLint && !usePrettier) return;

	const template = `
{
	"recommendations": [
		${useESLint ? `"dbaeumer.vscode-eslint",` : ""}
		${usePrettier ? `"esbenp.prettier-vscode",` : ""}
	]
}
`;
return JSON.stringify(JSON5.parse(template), null, 4);
};

templateFunction.customPath = ".vscode/extensions.json";
export = templateFunction;
