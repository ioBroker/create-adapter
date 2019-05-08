import { TemplateFunction } from "../src/lib/createAdapter";
import { formatLicense } from "../src/lib/tools";

export = (answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	const useTypeScript = answers.language === "TypeScript";
	const useNyc = answers.tools && answers.tools.indexOf("code coverage");
	const useESLint = answers.tools && answers.tools.indexOf("ESLint");

	const adapterNameLowerCase = answers.adapterName.toLowerCase();
	const template = `
![Logo](admin/${answers.adapterName}.png)
# ioBroker.${answers.adapterName}

[![NPM version](http://img.shields.io/npm/v/iobroker.${adapterNameLowerCase}.svg)](https://www.npmjs.com/package/iobroker.${adapterNameLowerCase})
[![Downloads](https://img.shields.io/npm/dm/iobroker.${adapterNameLowerCase}.svg)](https://www.npmjs.com/package/iobroker.${adapterNameLowerCase})
[![Dependency Status](https://img.shields.io/david/${answers.authorGithub}/iobroker.${adapterNameLowerCase}.svg)](https://david-dm.org/${answers.authorGithub}/iobroker.${adapterNameLowerCase})
[![Known Vulnerabilities](https://snyk.io/test/github/${answers.authorGithub}/ioBroker.${answers.adapterName}/badge.svg)](https://snyk.io/test/github/${answers.authorGithub}/ioBroker.${answers.adapterName})

[![NPM](https://nodei.co/npm/iobroker.${adapterNameLowerCase}.png?downloads=true)](https://nodei.co/npm/iobroker.${adapterNameLowerCase}/)

**Tests:**: [![Travis-CI](http://img.shields.io/travis/${answers.authorGithub}/ioBroker.${answers.adapterName}/master.svg)](https://travis-ci.org/${answers.authorGithub}/ioBroker.${answers.adapterName})

## ${answers.adapterName} adapter for ioBroker

${answers.description || "Describe your project here"}

## Developer manual

### Scripts in \`package.json\`
Several npm scripts are predefined for your convenience. You can run them using \`npm run <scriptname>\`
| Script name | Description                                              |
|-------------|----------------------------------------------------------|
${isAdapter && useTypeScript ? (
`| \`build\`    | Re-compile the TypeScript sources.                       |
| \`watch\`     | Re-compile the TypeScript sources and watch for changes. |
| \`test:ts\`   | Executes the tests you defined in \`*.test.ts\` files.     |
`) : ""}${isAdapter && !useTypeScript ? (
`| \`test:js\`   | Executes the tests you defined in \`*.test.js\` files.     |
`) : ""}| \`test:package\`    | Ensures your \`package.json\` and \`io-package.json\` are valid. |
${isAdapter && useTypeScript ? (
`| \`test:unit\`       | Tests the adapter startup with unit tests (fast, but might require module mocks to work). |
| \`test:integration\`| Tests the adapter startup with an actual instance of ioBroker. |
`) : ""}| \`test\` | Performs a minimal test run on package files${isAdapter ? " and your tests" : ""}. |
${useNyc ? (
`| \`coverage\` | Generates code coverage using your test files. |
`) : ""}${useESLint ? (
`| \`lint\` | Runs \`ESLint\` to check your code for formatting errors and potential bugs. |
`) : ""}

## Changelog

### 0.0.1
* (${answers.authorName}) initial release

## License
${answers.license
	&& answers.license.text
	&& formatLicense(answers.license.text, answers)
	|| "TODO: enter license text here"}
`;
	return template.trim();
}) as TemplateFunction;
