import type { TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const isWidget = answers.features.indexOf("vis") > -1;
	if (!isWidget) return;

	// Widget ESLint config is now included in main eslint.config.mjs - no separate config needed
	return;

	const template = `
{
	"env": {
		"browser": true,
		"es6": false
	},
	"rules": {
		// Visualizations may run in very old browsers without \`let\` and \`const\`
		"no-var": "off",
		// The example code does not use some parameters. If unused variables should be
		// an error, delete the following rule
		"no-unused-vars": [
			"warn",
			{
				"ignoreRestSiblings": true,
				"argsIgnorePattern": "^_"
			}
		]
	}
}
`;
	return template.trim();
};

templateFunction.customPath = "widgets/.eslintrc.json";
export = templateFunction;
