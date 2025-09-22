import js from '@eslint/js';
import react from 'eslint-plugin-react';

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
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			react,
		},
		rules: {
			...js.configs.recommended.rules,
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
				'double'
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