const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');

// TODO: prettier

const config = [
	{
		ignores: [
			'build/**',
			'test/baselines/**'
		],
	},

	// ts specific overrides
	// https://typescript-eslint.io/rules/
	{
		files: ['**/*.{ts,mts,cts,tsx}'],

		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				project: true
			}
		},
		plugins: {
			'@typescript-eslint': typescriptPlugin
		},
		rules: {
			...typescriptPlugin.configs['recommended'].rules,

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
			"@typescript-eslint/no-inferrable-types": [
				"error",
				{
					ignoreParameters: true,
					ignoreProperties: true,
				},
			],
		}
	},

	{
		files: ["**/*.test.ts"],
		rules: {
			"@typescript-eslint/explicit-function-return-type": "off",
		},
	}
];

module.exports = config;
