import type { TemplateFunction } from "../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
	const useOfficialESLintConfig = useESLint && answers.eslintConfig === "official";
	if (!useOfficialESLintConfig) return;

	const useReact = answers.adminUi === "react" || answers.tabReact === "yes";
	const useTypeScript = answers.language === "TypeScript";
	
	// Build the ignores array based on project structure
	let ignores = [
		"'.dev-server/'",
		"'.vscode/'",
		"'*.test.js'",
		"'test/**/*.js'",
		"'*.config.mjs'",
		"'build'",
		"'dist'",
		"'admin/words.js'",
		"'admin/admin.d.ts'",
		"'admin/blockly.js'",
		"'**/adapter-config.d.ts'",
	];

	if (useReact) {
		ignores.push("'admin/build'");
	}

	const template = `// ioBroker eslint template configuration file for js and ts files
// Please note that esm or react based modules need additional modules loaded.
import config from '@iobroker/eslint-config';

export default [
	...config,
	{
		// specify files to exclude from linting here
		ignores: [
			${ignores.join(",\n\t\t\t")}
		],
	},
	{
		// you may disable some 'jsdoc' warnings - but using jsdoc is highly recommended
		// as this improves maintainability. jsdoc warnings will not block build process.
		rules: {
			// 'jsdoc/require-jsdoc': 'off',
			// 'jsdoc/require-param': 'off',
			// 'jsdoc/require-param-description': 'off',
			// 'jsdoc/require-returns-description': 'off',
			// 'jsdoc/require-returns-check': 'off',
		},
	},
];
`;
	return template.trim();
};

templateFunction.customPath = "eslint.config.mjs";
export = templateFunction;