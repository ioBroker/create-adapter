import { TemplateFunction } from "../src/lib/createAdapter";
import { formatLicense } from "../src/lib/tools";

export = (answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	const useTypeScript = answers.language === "TypeScript";
	const useNyc = answers.tools?.includes("code coverage");
	const useESLint = answers.tools?.includes("ESLint");
	const autoInitGit = answers.gitCommit === "yes";
	const useTravis = answers.ci?.includes("travis");
	const useGithubActions = answers.ci?.includes("gh-actions");

	const adapterNameLowerCase = answers.adapterName.toLowerCase();
	const template = `
![Logo](admin/${answers.adapterName}.png)
# ioBroker.${answers.adapterName}

[![NPM version](http://img.shields.io/npm/v/iobroker.${adapterNameLowerCase}.svg)](https://www.npmjs.com/package/iobroker.${adapterNameLowerCase})
[![Downloads](https://img.shields.io/npm/dm/iobroker.${adapterNameLowerCase}.svg)](https://www.npmjs.com/package/iobroker.${adapterNameLowerCase})
![Number of Installations (latest)](http://iobroker.live/badges/${adapterNameLowerCase}-installed.svg)
![Number of Installations (stable)](http://iobroker.live/badges/${adapterNameLowerCase}-stable.svg)
[![Dependency Status](https://img.shields.io/david/${answers.authorGithub}/iobroker.${adapterNameLowerCase}.svg)](https://david-dm.org/${answers.authorGithub}/iobroker.${adapterNameLowerCase})
[![Known Vulnerabilities](https://snyk.io/test/github/${answers.authorGithub}/ioBroker.${answers.adapterName}/badge.svg)](https://snyk.io/test/github/${answers.authorGithub}/ioBroker.${answers.adapterName})

[![NPM](https://nodei.co/npm/iobroker.${adapterNameLowerCase}.png?downloads=true)](https://nodei.co/npm/iobroker.${adapterNameLowerCase}/)
${useTravis ? (`
**Tests:**: [![Travis-CI](http://img.shields.io/travis/${answers.authorGithub}/ioBroker.${answers.adapterName}/master.svg)](https://travis-ci.org/${answers.authorGithub}/ioBroker.${answers.adapterName})`) 
	: "" /* Github Actions has no badge right now */}

## ${answers.adapterName} adapter for ioBroker

${answers.description || "Describe your project here"}

## Developer manual
This section is intended for the developer. It can be deleted later

### Getting started

You are almost done, only a few steps left:
1. Create a new repository on GitHub with the name \`ioBroker.${answers.adapterName}\`
${autoInitGit ? "" : (
`1. Initialize the current folder as a new git repository:  
	\`\`\`bash
	git init
	git add .
	git commit -m "Initial commit"
	\`\`\`
1. Link your local repository with the one on GitHub:  
	\`\`\`bash
	git remote add origin https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}
	\`\`\`
`)}
1. Push all files to the GitHub repo${autoInitGit ? ". The creator has already set up the local repository for you" : ""}:  
	\`\`\`bash
	git push origin master
	\`\`\`
1. Head over to ${
	isAdapter ? (
		useTypeScript ? "[src/main.ts](src/main.ts)"
		: "[main.js](main.js)"
	) : `[widgets/${answers.adapterName}.html](widgets/${answers.adapterName}.html)`
} and start programming!

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

${isAdapter ? `### Writing tests
When done right, testing code is invaluable, because it gives you the 
confidence to change your code while knowing exactly if and when 
something breaks. A good read on the topic of test-driven development 
is https://hackernoon.com/introduction-to-test-driven-development-tdd-61a13bc92d92. 
Although writing tests before the code might seem strange at first, but it has very 
clear upsides.

The template provides you with basic tests for the adapter startup and package files.
It is recommended that you add your own tests into the mix.

` : ""}### Publishing the ${isAdapter ? "adapter" : "widget"}
${useGithubActions ? `Since you have chosen GitHub Actions as your CI service, you can 
enable automatic releases on npm whenever you push a new git tag that matches the form 
\`v<major>.<minor>.<patch>\`. The necessary steps are described in \`.github/workflows/test-and-release.yml\`.

`: ""}To get your ${isAdapter ? "adapter" : "widget"} released in ioBroker, please refer to the documentation 
of [ioBroker.repositories](https://github.com/ioBroker/ioBroker.repositories#requirements-for-adapter-to-get-added-to-the-latest-repository).


### Test the adapter manually on a local ioBroker installation
In order to install the adapter locally without publishing, the following steps are recommended:
1. Create a tarball from your dev directory:  
	\`\`\`bash
	npm pack
	\`\`\`
1. Upload the resulting file to your ioBroker host
1. Install it locally (The paths are different on Windows):
	\`\`\`bash
	cd /opt/iobroker
	npm i /path/to/tarball.tgz
	\`\`\`

For later updates, the above procedure is not necessary. Just do the following:
1. Overwrite the changed files in the adapter directory (\`/opt/iobroker/node_modules/iobroker.${adapterNameLowerCase}\`)
1. Execute \`iobroker upload ${adapterNameLowerCase}\` on the ioBroker host

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
