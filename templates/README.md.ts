import { getIconName } from "../src/lib/core/questions";
import type { TemplateFunction } from "../src/lib/createAdapter";
import { getFormattedLicense } from "../src/lib/tools";

export = (answers => {
	const isAdapter = answers.features.indexOf("adapter") > -1;
	const useTypeScript = answers.language === "TypeScript";
	const useTypeChecking = useTypeScript || answers.tools?.includes("type checking");
	const useNyc = answers.tools?.includes("code coverage");
	const useESLint = answers.tools?.includes("ESLint");
	const useReact = answers.adminUi === "react" || answers.tabReact === "yes";
	const autoInitGit = answers.gitCommit === "yes";
	const defaultBranch = answers.defaultBranch || "main";
	const useReleaseScript = answers.releaseScript === "yes";
	const useDevServer = answers.devServer === "yes";
	const useDependabot = answers.dependabot === "yes";
	const isGitHub = answers.target === "github";

	const npmScripts: Record<string, string> = {};
	if (useTypeScript && !useReact) {
		npmScripts.build = "Compile the TypeScript sources.";
		npmScripts.watch = "Compile the TypeScript sources and watch for changes.";
	} else if (useReact && !useTypeScript) {
		npmScripts.build = "Compile the React sources.";
		npmScripts.watch = "Compile the React sources and watch for changes.";
	} else if (useReact && useTypeScript) {
		npmScripts.build = "Compile the TypeScript and React sources.";
		npmScripts.watch = "Compile the TypeScript and React sources and watch for changes.";
		npmScripts["build:ts"] = "Compile the TypeScript sources.";
		npmScripts["watch:ts"] = "Compile the TypeScript sources and watch for changes.";
		npmScripts["build:react"] = "Compile the React sources.";
		npmScripts["watch:react"] = "Compile the React sources and watch for changes.";
	}

	if (isAdapter) {
		if (useTypeScript) {
			npmScripts["test:ts"] = "Executes the tests you defined in \`*.test.ts\` files.";
		} else {
			npmScripts["test:js"] = "Executes the tests you defined in \`*.test.js\` files.";
		}
	}
	npmScripts["test:package"] = "Ensures your \`package.json\` and \`io-package.json\` are valid.";
	if (isAdapter) {
		npmScripts["test:integration"] = "Tests the adapter startup with an actual instance of ioBroker.";
	}
	npmScripts.test = `Performs a minimal test run on package files${isAdapter ? " and your tests" : ""}.`;
	if (useTypeChecking) {
		npmScripts.check = "Performs a type-check on your code (without compiling anything).";
	}
	if (useNyc) {
		npmScripts.coverage = "Generates code coverage using your test files.";
	}
	if (useESLint) {
		npmScripts.lint = "Runs \`ESLint\` to check your code for formatting errors and potential bugs.";
	}
	npmScripts.translate =
		"Translates texts in your adapter to all required languages, see [`@iobroker/adapter-dev`](https://github.com/ioBroker/adapter-dev#manage-translations) for more details.";
	if (useReleaseScript) {
		npmScripts.release =
			"Creates a new release, see [`@alcalzone/release-script`](https://github.com/AlCalzone/release-script#usage) for more details.";
	}

	const adapterNameLowerCase = answers.adapterName.toLowerCase();
	const template = `
![Logo](admin/${getIconName(answers)})
# ioBroker.${answers.adapterName}

[![NPM version](https://img.shields.io/npm/v/iobroker.${adapterNameLowerCase}.svg)](https://www.npmjs.com/package/iobroker.${adapterNameLowerCase})
[![Downloads](https://img.shields.io/npm/dm/iobroker.${adapterNameLowerCase}.svg)](https://www.npmjs.com/package/iobroker.${adapterNameLowerCase})
![Number of Installations](https://iobroker.live/badges/${adapterNameLowerCase}-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/${adapterNameLowerCase}-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.${adapterNameLowerCase}.png?downloads=true)](https://nodei.co/npm/iobroker.${adapterNameLowerCase}/)

**Tests:** ![Test and Release](https://github.com/${answers.authorGithub}/ioBroker.${adapterNameLowerCase}/workflows/Test%20and%20Release/badge.svg)

## ${answers.adapterName} adapter for ioBroker

${answers.description || "Describe your project here"}

## Developer manual
This section is intended for the developer. It can be deleted later.

### DISCLAIMER

Please make sure that you consider copyrights and trademarks when you use names or logos of a company and add a disclaimer to your README.
You can check other adapters for examples or ask in the developer community. Using a name or logo of a company without permission may cause legal problems for you.

### Getting started

You are almost done, only a few steps left:
${
	isGitHub
		? `1. Clone the repository from GitHub to a directory on your PC:
	\`\`\`bash
	git clone https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}
	\`\`\`
`
		: `1. Create a new repository on GitHub with the name \`ioBroker.${answers.adapterName}\`
${
	autoInitGit
		? ""
		: `1. Initialize the current folder as a new git repository:  
	\`\`\`bash
	git init -b ${defaultBranch}
	git add .
	git commit -m "Initial commit"
	\`\`\`
1. Link your local repository with the one on GitHub:  
	\`\`\`bash
	git remote add origin https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}
	\`\`\`
`
}
1. Push all files to the GitHub repo${autoInitGit ? ". The creator has already set up the local repository for you" : ""}:  
	\`\`\`bash
	git push origin ${defaultBranch}
	\`\`\`
${
	useDependabot
		? `1. Add a new secret under https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}/settings/secrets. It must be named \`AUTO_MERGE_TOKEN\` and contain a personal access token with push access to the repository, e.g. yours. You can create a new token under https://github.com/settings/tokens.
`
		: ""
}
`
}
1. Head over to ${
		isAdapter
			? useTypeScript
				? "[src/main.ts](src/main.ts)"
				: "[main.js](main.js)"
			: `[widgets/${answers.adapterName}.html](widgets/${answers.adapterName}.html)`
	} and start programming!

### Best Practices
We've collected some [best practices](https://github.com/ioBroker/ioBroker.repositories#development-and-coding-best-practices) regarding ioBroker development and coding in general. If you're new to ioBroker or Node.js, you should
check them out. If you're already experienced, you should also take a look at them - you might learn something new :)

### State Roles
When creating state objects, it is important to use the correct role for the state. The role defines how the state should be interpreted by visualizations and other adapters. For a list of available roles and their meanings, please refer to the [state roles documentation](https://www.iobroker.net/#en/documentation/dev/stateroles.md).

**Important:** Do not invent your own custom role names. If you need a role that is not part of the official list, please contact the ioBroker developer community for guidance and discussion about adding new roles.

### Scripts in \`package.json\`
Several npm scripts are predefined for your convenience. You can run them using \`npm run <scriptname>\`
| Script name | Description |
|-------------|-------------|
${Object.entries(npmScripts)
	.map(([name, desc]) => `| \`${name}\` | ${desc} |`)
	.join("\n")}

${
	useTypeScript || useReact
		? `### Configuring the compilation
The adapter template uses [esbuild](https://esbuild.github.io/) to compile TypeScript and/or React code. You can configure many compilation settings 
either in \`tsconfig.json\` or by changing options for the build tasks. These options are described in detail in the
[\`@iobroker/adapter-dev\` documentation](https://github.com/ioBroker/adapter-dev#compile-adapter-files).`
		: ""
}

${
	isAdapter
		? `### Writing tests
When done right, testing code is invaluable, because it gives you the 
confidence to change your code while knowing exactly if and when 
something breaks. A good read on the topic of test-driven development 
is https://hackernoon.com/introduction-to-test-driven-development-tdd-61a13bc92d92. 
Although writing tests before the code might seem strange at first, but it has very 
clear upsides.

The template provides you with basic tests for the adapter startup and package files.
It is recommended that you add your own tests into the mix.

`
		: ""
}### Publishing the ${isAdapter ? "adapter" : "widget"}
Using GitHub Actions, you can enable automatic releases on npm whenever you push a new git tag that matches the form 
\`v<major>.<minor>.<patch>\`. We **strongly recommend** that you do. The necessary steps are described in \`.github/workflows/test-and-release.yml\`.

${
	useReleaseScript
		? `Since you installed the release script, you can create a new
release simply by calling:
\`\`\`bash
npm run release
\`\`\`
Additional command line options for the release script are explained in the
[release-script documentation](https://github.com/AlCalzone/release-script#command-line).

`
		: ""
}To get your ${isAdapter ? "adapter" : "widget"} released in ioBroker, please refer to the documentation 
of [ioBroker.repositories](https://github.com/ioBroker/ioBroker.repositories#requirements-for-adapter-to-get-added-to-the-latest-repository).

${
	useDevServer
		? `
### Test the adapter manually with dev-server
Since you set up \`dev-server\`, you can use it to run, test and debug your adapter.

You may start \`dev-server\` by calling from your dev directory:
\`\`\`bash
dev-server watch
\`\`\`

The ioBroker.admin interface will then be available at http://localhost:${answers.devServerPort}/

Please refer to the [\`dev-server\` documentation](https://github.com/ioBroker/dev-server#command-line) for more details.
`
		: isGitHub
			? `
### Test the adapter manually with dev-server
Please use \`dev-server\` to test and debug your adapter.

You may install and start \`dev-server\` by calling from your dev directory:
\`\`\`bash
npm install --global @iobroker/dev-server
dev-server setup
dev-server watch
\`\`\`

Please refer to the [\`dev-server\` documentation](https://github.com/ioBroker/dev-server#readme) for more details.
`
			: `
### Test the adapter manually on a local ioBroker installation
In order to install the adapter locally without publishing, the following steps are recommended:
1. Create a GitHub repository for your adapter if you haven't already
1. Push your code to the GitHub repository
1. Use the ioBroker Admin interface or command line to install the adapter from GitHub:
	* **Via Admin UI**: Go to the "Adapters" tab, click on "Custom Install" (GitHub icon), and enter your repository URL:
		\`\`\`
		https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}
		\`\`\`
		You can also install from a specific branch by adding \`#branchname\` at the end:
		\`\`\`
		https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}#dev
		\`\`\`
	* **Via Command Line**: Install using the \`iob\` command:
		\`\`\`bash
		iob url https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}
		\`\`\`
		Or from a specific branch:
		\`\`\`bash
		iob url https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}#dev
		\`\`\`

For later updates:
1. Push your changes to GitHub
1. Repeat the installation steps above (via Admin UI or \`iob url\` command) to update the adapter
`
}
## Changelog
${
	useReleaseScript
		? `<!--
    Placeholder for the next version (at the beginning of the line):
    ### **WORK IN PROGRESS**
-->
`
		: ""
}
### ${useReleaseScript ? "**WORK IN PROGRESS**" : "0.0.1"}
* (${answers.authorName}) initial release

## License
${getFormattedLicense(answers)}
`;
	return template.trim();
}) as TemplateFunction;
