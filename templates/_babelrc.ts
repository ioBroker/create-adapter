import type { TemplateFunction } from "../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {


	const useTypeScript = answers.language === "TypeScript";
	const useReact =
		answers.adminReact === "yes" || answers.tabReact === "yes";

	// This is only required for TypeScript React
	if (!(useTypeScript && useReact)) return;

	const template = `
{
	"presets": [
		"@babel/preset-typescript",
		["@babel/preset-env", { "targets": { "node": "current" } }]
	],
	"plugins": [
		["@babel/plugin-transform-typescript", { "allowDeclareFields": true }],
		["@babel/plugin-proposal-decorators", { "legacy": true }]
	]
}
`;
	return template.trim();
};

templateFunction.customPath = ".babelrc";
export = templateFunction;
