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
				'AdminWord': 'readonly',
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
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					'ignoreRestSiblings': true,
					'argsIgnorePattern': '^_',
					'varsIgnorePattern': '^_'
				}
			],
		},
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