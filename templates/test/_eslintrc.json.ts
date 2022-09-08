import * as JSON5 from "json5";
import type { TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	// This version is intended to make ESLint happy with the JS tests in TS adapters
	if (answers.language !== "TypeScript") return;
	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
	if (!useESLint) return;

	const template = `
{
	"root": true,
	"env": {
		"es6": true,
		"node": true,
		"mocha": true
	},
	"extends": [
		"eslint:recommended"
	],
	"rules": {
		"indent": [
			"error",
			${answers.indentation === "Tab" ? `"tab"` : "4"},
			{
				"SwitchCase": 1
			}
		],
		"no-console": "off",
		"no-unused-vars": [
			"error",
			{
				"ignoreRestSiblings": true,
				"argsIgnorePattern": "^_",
			}
		],
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
	}
}
`;
	return JSON.stringify(JSON5.parse(template), null, 4);
};

templateFunction.customPath = "test/.eslintrc.json";
export = templateFunction;
