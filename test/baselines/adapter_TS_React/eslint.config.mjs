import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';

export default [
	js.configs.recommended,
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				project: ['./tsconfig.json', './admin/tsconfig.json'],
				ecmaFeatures: {
					jsx: true,
				},
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
			react,
		},
		rules: {
			...tseslint.configs.recommended.rules,
			...react.configs.recommended.rules,
			'react/react-in-jsx-scope': 'off',
			'indent': [
				'error',
				'tab',
				{
					'SwitchCase': 1
				}
			],
			'quotes': [
				'error',
				'single'
			],
			// Strict rules to match official @iobroker/eslint-config
			'prefer-template': 'error',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					'ignoreRestSiblings': true,
					'argsIgnorePattern': '^_',
					'varsIgnorePattern': '^_'
				}
			],
		},
		settings: {
			react: {
				version: 'detect',
			},
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