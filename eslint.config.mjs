import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier/recommended";

export default [
	// Base JS recommended rules
	js.configs.recommended,

	// Global ignores
	{
		ignores: [
			"build/",
			"test/baselines/",
			".eslintrc.js",
			".prettierrc.js",
		],
	},

	// TypeScript files configuration
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				project: "./tsconfig.json",
			},
			globals: {
				// Node.js globals
				process: "readonly",
				Buffer: "readonly",
				__dirname: "readonly",
				__filename: "readonly",
				module: "readonly",
				require: "readonly",
				exports: "readonly",
				global: "readonly",
				console: "readonly",
				setTimeout: "readonly",
				setInterval: "readonly",
				clearTimeout: "readonly",
				clearInterval: "readonly",
				setImmediate: "readonly",
				clearImmediate: "readonly",
				NodeJS: "readonly",
			},
		},
		plugins: {
			"@typescript-eslint": tsPlugin,
		},
		rules: {
			// Recommended TypeScript rules
			...tsPlugin.configs.recommended.rules,

			// Custom rules
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
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
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
			"@typescript-eslint/no-non-null-assertion": "off",
			"@typescript-eslint/no-inferrable-types": [
				"error",
				{
					ignoreParameters: true,
					ignoreProperties: true,
				},
			],
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{
					disallowTypeAnnotations: false,
				},
			],
			// Allow require() imports where needed (e.g., conditional requires)
			"@typescript-eslint/no-require-imports": "off",
			// TypeScript handles function overloads, no need for no-redeclare
			"no-redeclare": "off",
		},
	},

	// Test files - relax explicit return types and add mocha globals
	{
		files: ["**/*.test.ts", "test/**/*.ts"],
		languageOptions: {
			globals: {
				describe: "readonly",
				it: "readonly",
				before: "readonly",
				after: "readonly",
				beforeEach: "readonly",
				afterEach: "readonly",
			},
		},
		rules: {
			"@typescript-eslint/explicit-function-return-type": "off",
			// Allow chai assertions like .should
			"@typescript-eslint/no-unused-expressions": "off",
		},
	},

	// Prettier (must be last)
	prettier,
];

