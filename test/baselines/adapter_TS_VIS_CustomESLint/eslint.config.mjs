import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
	js.configs.recommended,
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				project: './tsconfig.json',
			},
		},
		plugins: {
			'@typescript-eslint': tseslint,
		},
		rules: {
			...tseslint.configs.recommended.rules,
			'indent': [
				'error',
				'tab',
				{
					'SwitchCase': 1
				}
			],
			'quotes': [
				'error',
				'double'
			],
		},
	},
	{
		files: ['widgets/**/*.js'],
		languageOptions: {
			ecmaVersion: 5,
			sourceType: 'script',
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
	},
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