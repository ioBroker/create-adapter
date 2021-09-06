import * as JSON5 from "json5";
import type { TemplateFunction } from "../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	// This version is intended for use in JS projects
	if (answers.language !== "JavaScript") return;
	const useReact =
		answers.adminReact === "yes" || answers.tabReact === "yes";

	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
	if (!useESLint) return;

	let ecmaVersion = answers.ecmaVersion || 2018;
	const useES6Class = answers.es6class === "yes";
	if (useES6Class) ecmaVersion = Math.max(ecmaVersion, 2018) as any;

	const template = `
{
	"root": true,
	"env": {
		"es6": true,
		"node": true,
		"mocha": true
	},
	"extends": [
		"eslint:recommended",
		${useReact ? (`"plugin:react/recommended",`) : ""}
	],
	plugins: [${useReact ? `"react"` : ""}],
	${useReact ? (`
	settings: {
		react: {
			version: "detect",
		},
	},`): ""}
	"rules": {
		"indent": [
			"error",
			${answers.indentation === "Tab" ? `"tab"` : "4"},
			{
				"SwitchCase": 1
			}
		],
		"no-console": "off",
		"no-var": "error",
		"no-trailing-spaces": "error",
		"prefer-const": "error",
		"quotes": [
			"error",
			"${typeof answers.quotes === "string" ? answers.quotes : "double"}",
			{
				"avoidEscape": true,
				"allowTemplateLiterals": true
			}
		],
		"semi": [
			"error",
			"always"
		]
	},
	"parserOptions": {
		${ecmaVersion > 2015 ? (`"ecmaVersion": ${ecmaVersion},`) : ""}
		${useReact ? (`ecmaFeatures: {
			jsx: true,
		},`) : ""}
	}
}
`;
	return JSON.stringify(JSON5.parse(template), null, 4);
};

templateFunction.customPath = ".eslintrc.json";
export = templateFunction;
