import type { TemplateFunction } from "../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	// This version is intended for use in TS projects
	if (answers.language !== "TypeScript") return;

	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
	if (!useESLint) return;
	const usePrettier = answers.tools && answers.tools.indexOf("Prettier") > -1;
	const useReact =
		answers.adminReact === "yes" || answers.tabReact === "yes";

	const template = `
module.exports = {
	root: true, // Don't look outside this project for inherited configs
	parser: "@typescript-eslint/parser", // Specifies the ESLint parser
	parserOptions: {
		ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
		sourceType: "module", // Allows for the use of imports
		project: "./tsconfig.json",${useReact ? (`
		ecmaFeatures: {
			jsx: true,
		},`) : ""}
	},
	extends: [
		"plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
${usePrettier ? (`
		"plugin:prettier/recommended", // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
`) : ""}${useReact ? (`
		"plugin:react/recommended", // Supports React JSX
`) : ""}	],
	plugins: [${useReact ? `"react"` : ""}],${useReact ? (`
	settings: {
		react: {
			version: "detect",
		},
	},`): ""}
	rules: {${usePrettier ? "" : (`
		"indent": "off",
		"@typescript-eslint/indent": [
			"error",
			${answers.indentation === "Tab" ? `"tab"` : "4"},
			{
				"SwitchCase": 1
			}
		],
		"quotes": [
			"error",
			"${typeof answers.quotes === "string" ? answers.quotes : "double"}",
			{
				"avoidEscape": true,
				"allowTemplateLiterals": true
			}
		],`)}
		"@typescript-eslint/no-parameter-properties": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-use-before-define": [
			"error",
			{
				functions: false,
				typedefs: false,
				classes: false,
			},
		],
		"@typescript-eslint/no-unused-vars": [
			"error",
			{
				ignoreRestSiblings: true,
				argsIgnorePattern: "^_",
			},
		],
		"@typescript-eslint/explicit-function-return-type": [
			"warn",
			{
				allowExpressions: true,
				allowTypedFunctionExpressions: true,
			},
		],
		"@typescript-eslint/no-object-literal-type-assertion": "off",
		"@typescript-eslint/interface-name-prefix": "off",
		"@typescript-eslint/no-non-null-assertion": "off", // This is necessary for Map.has()/get()!
		"no-var": "error",
		"prefer-const": "error",
		"no-trailing-spaces": "error",
	},
	overrides: [
		{
			files: ["*.test.ts"${useReact ? `, "*.tsx"` : ""}],
			rules: {
				"@typescript-eslint/explicit-function-return-type": "off",
			},
		},
	],
};
`;
	return template.trim().replace(/(\r?\n)+/g, "\n");
};

templateFunction.customPath = ".eslintrc.js";
export = templateFunction;
