import * as JSON5 from "json5";
import type { TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {
	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
	const usePrettier = answers.tools && answers.tools.indexOf("Prettier") > -1;
	const useOfficialESLintConfig = useESLint && answers.eslintConfig === "official";
	const useTypeScript = answers.language === "TypeScript";

	// Include prettier-vscode for TypeScript when using official ESLint config
	const includePrettierExtension = usePrettier || (useOfficialESLintConfig && useTypeScript);

	if (!useESLint && !includePrettierExtension) {
		return;
	}

	const template = `
{
	"recommendations": [
		${useESLint ? `"dbaeumer.vscode-eslint",` : ""}
		${includePrettierExtension ? `"esbenp.prettier-vscode",` : ""}
	]
}
`;
	return JSON.stringify(JSON5.parse(template), null, 4);
};

templateFunction.customPath = ".vscode/extensions.json";
export = templateFunction;
