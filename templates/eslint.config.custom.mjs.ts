import type { TemplateFunction } from "../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	// This version is intended for use in TS projects
	if (answers.language !== "TypeScript") return;

	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
	if (!useESLint) return;
	const useOfficialESLintConfig = answers.eslintConfig === "official";
	// Only generate ESLint 9 config for custom config
	if (useOfficialESLintConfig) return;
	
	const usePrettier = answers.tools && answers.tools.indexOf("Prettier") > -1;
	const useReact = answers.adminUi === "react" || answers.tabReact === "yes";
	const isWidget = answers.features && answers.features.indexOf("vis") > -1;
	
	// Build base config
	let config = `import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';`;

	if (useReact) {
		config += `
import react from 'eslint-plugin-react';`;
	}

	config += `

export default [
	js.configs.recommended,
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				project: ${useReact ? `['./tsconfig.json', './admin/tsconfig.json']` : `'./tsconfig.json'`},${useReact ? `
				ecmaFeatures: {
					jsx: true,
				},` : ""}
			},
		},
		plugins: {
			'@typescript-eslint': tseslint,${useReact ? `
			react,` : ""}
		},
		rules: {
			...tseslint.configs.recommended.rules,${useReact ? `
			...react.configs.recommended.rules,
			'react/react-in-jsx-scope': 'off',` : ""}${!usePrettier ? `
			'indent': 'off',
			'@typescript-eslint/indent': [
				'error',
				${answers.indentation === "Tab" ? `'tab'` : "4"},
				{
					'SwitchCase': 1
				}
			],
			'quotes': [
				'error',
				${answers.quotes === "single" ? `'single'` : `'double'`}
			],` : ""}
		},${useReact ? `
		settings: {
			react: {
				version: 'detect',
			},
		},` : ""}
	},`;

	// Add widgets configuration if VIS is used
	if (isWidget) {
		config += `
	{
		files: ['widgets/**/*.js'],
		languageOptions: {
			ecmaVersion: 5,
			sourceType: 'script',
			globals: {
				'$': 'readonly',
				'jQuery': 'readonly',
				'vis': 'readonly',
			},
		},
		rules: {
			// Visualizations may run in very old browsers
			'no-var': 'off',
			'prefer-const': 'off',
			'prefer-arrow-callback': 'off',
			// The example code does not use some parameters
			'no-unused-vars': [
				'warn',
				{
					'ignoreRestSiblings': true,
					'argsIgnorePattern': '^_'
				}
			]
		}
	},`;
	}

	config += `
	{
		ignores: [
			'.dev-server/',
			'.vscode/',
			'*.test.js',
			'test/**/*.js',
			'*.config.mjs',
			'build/',
			'dist/',
			'admin/build/',
			'admin/words.js',
			'admin/admin.d.ts',
			'admin/blockly.js',
			'**/adapter-config.d.ts',
		],
	},
];
`;

	return config.trim();
};

templateFunction.customPath = "eslint.config.mjs";
export = templateFunction;