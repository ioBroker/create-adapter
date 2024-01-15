import * as JSON5 from "json5";
import type { TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useTypeScript = answers.language === "TypeScript";

	const template = `
{
	"require": [
		"test/mocha.setup.js",
${useTypeScript ? (`
		"ts-node/register",
		"source-map-support/register",
`) : ""}
	],
	"watch-files": [${
		// Setup the filter in a way that we only test user-defined test files,
		// not the ones for package and adapter tests
		useTypeScript ? `"src/**/*.test.ts"` : (`
			"!(node_modules|test)/**/*.test.js",
			"*.test.js",
			"test/**/test!(PackageFiles|Startup).js",
		`)
	}]
}`;
	return JSON.stringify(JSON5.parse(template), null, 4);
};

templateFunction.customPath = "test/mocharc.custom.json";
export = templateFunction;
