import { readFile, TemplateFunction } from "../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	const useNyc = answers.tools && answers.tools.indexOf("code coverage") > -1;
	const useTypeScript = answers.language === "TypeScript";
	const useTSLint = answers.tools && answers.tools.indexOf("TSLint") > -1;
	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;

	const template = `
.git
.idea
node_modules/
nbproject/
.vs*/
Thumbs.db
${isAdapter ? `gulpfile.js` : ""}

test/
travis/
.travis.yml
appveyor.yml
.travis.yaml
appveyor.yaml

${useTypeScript ? `
src/
tsconfig.json
tsconfig.*.json` : ""}
${useTSLint ? "tslint.json" : ""}
${useESLint ? ".eslintrc.json" : ""}

${useTypeScript ? (`
# Sourcemaps
maps/
`) : ""}

# npm package files
iobroker.*.tgz
package-lock.json

${useNyc ? `
# NYC coverage files
coverage
.nyc*` : ""}

# i18n intermediate files
admin/i18n

# maintenance scripts
maintenance/**
`;
	return template.trim();
};

templateFunction.customPath = ".npmignore";
export = templateFunction;
