import type { TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useTypeScript = answers.language === "TypeScript";
	const useReact =
		answers.adminUi === "react" || answers.tabReact === "yes";
	if (useTypeScript || !useReact) return;

	const template = `
{
	"env": {
		"browser": true,
		"es6": true
	},
	"parserOptions": {
		"sourceType": "module",
		"project": "./tsconfig.json"
	},
	"rules": {
		"react/prop-types": "off"
	}
}
`;
	return template.trim();
};

templateFunction.customPath = "admin/.eslintrc.json";
export = templateFunction;
