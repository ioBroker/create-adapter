// ioBroker eslint configuration file for create-adapter
import iobrokerConfig from "@iobroker/eslint-config";

export default [
	...iobrokerConfig,

	// Specify files to exclude from linting
	{
		ignores: [
			"build/",
			"test/baselines/",
			".eslintrc.js",
			".prettierrc.js",
		],
	},

	// Custom rules for this project
	{
		rules: {
			// Allow require() imports where needed (e.g., conditional requires in tools)
			"@typescript-eslint/no-require-imports": "off",

			// TypeScript handles function overloads properly
			"no-redeclare": "off",

			// Relax some strict rules for this project
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/require-await": "off",
			"jsdoc/no-blank-blocks": "off",
			"jsdoc/require-param-description": "off",

			// Allow import() type annotations in specific cases
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{
					disallowTypeAnnotations: false,
				},
			],
		},
	},
];


