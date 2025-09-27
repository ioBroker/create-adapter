import type { TemplateFunction } from "../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	// This version is intended for use in JS projects
	if (answers.language !== "JavaScript") return;

	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
	if (!useESLint) return;
	const useOfficialESLintConfig = answers.eslintConfig === "official";
	// Only generate ESLint 9 config for custom config
	if (useOfficialESLintConfig) return;

	const usePrettier = answers.tools && answers.tools.indexOf("Prettier") > -1;
	const useReact = answers.adminUi === "react" || answers.tabReact === "yes";
	const isWidget = answers.features && answers.features.indexOf("vis") > -1;
	
	// Build base config
	let config = `import js from '@eslint/js';`;

	if (useReact) {
		config += `
import react from 'eslint-plugin-react';`;
	}

	config += `

export default [
	js.configs.recommended,
	{
		files: ['**/*.js', '**/*.jsx'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				'process': 'readonly',
				'Buffer': 'readonly',
				'__dirname': 'readonly',
				'__filename': 'readonly',
				'module': 'readonly',
				'require': 'readonly',
				'exports': 'readonly',
				'global': 'readonly',
				'console': 'readonly',
				'setTimeout': 'readonly',
				'setInterval': 'readonly',
				'clearTimeout': 'readonly',
				'clearInterval': 'readonly',
				'document': 'readonly',
				'window': 'readonly',
				'describe': 'readonly',
				'it': 'readonly',
				'ioBroker': 'readonly',
			},${useReact ? `
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},` : ""}
		},
		plugins: {${useReact ? `
			react,` : ""}
		},
		rules: {
			...js.configs.recommended.rules,${useReact ? `
			...react.configs.recommended.rules,
			'react/react-in-jsx-scope': 'off',` : ""}${!usePrettier ? `
			'indent': [
				'error',
				${answers.indentation === "Space (4)" ? "4" : "'tab'"},
				{
					'SwitchCase': 1
				}
			],
			'quotes': [
				'error',
				${answers.quotes === "single" ? `'single'` : `'double'`}
			],` : ""}
			'no-unused-vars': [
				'warn',
				{
					'ignoreRestSiblings': true,
					'argsIgnorePattern': '^_',
					'varsIgnorePattern': '^_'
				}
			],
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
				'console': 'readonly',
				'setTimeout': 'readonly',
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
					'argsIgnorePattern': '^_',
					'varsIgnorePattern': '^_'
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