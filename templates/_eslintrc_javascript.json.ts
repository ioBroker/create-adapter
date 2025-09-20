import * as JSON5 from "json5";
import type { TemplateFunction } from "../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	// This version is intended for use in JS projects
	if (answers.language !== "JavaScript") return;
	const useReact =
		answers.adminUi === "react" || answers.tabReact === "yes";

	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
	if (!useESLint) return;
	const useOfficialESLintConfig = answers.eslintConfig === "official";

	// If using official config, create a simple extends config
	if (useOfficialESLintConfig) {
		const extends_array = ["@iobroker"];
		if (useReact) extends_array.push("@iobroker/react");
		
		const template = `
{
	"extends": [${extends_array.map(ext => `"${ext}"`).join(", ")}]
}
`;
		return JSON.stringify(JSON5.parse(template), null, 4);
	}

	// Original custom ESLint configuration
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
	},
	"parserOptions": {
		ecmaVersion: "latest", // Allows for the parsing of modern ECMAScript features
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
