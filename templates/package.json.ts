import * as JSON5 from "json5";
import { licenses } from "../src/lib/core/licenses";
import { getDefaultAnswer } from "../src/lib/core/questions";
import type { TemplateFunction } from "../src/lib/createAdapter";
import { fetchPackageReferenceVersion, getPackageName } from "../src/lib/packageVersions";
import { RECOMMENDED_NODE_VERSION_FALLBACK } from "../src/lib/constants";

const templateFunction: TemplateFunction = async answers => {
	// Limit package version downloads to 10 simultaneous connections
	const pLimit = await import("p-limit");
	const downloadLimiter = pLimit.default(10);

	const isAdapter = answers.features.indexOf("adapter") > -1;
	const isWidget = answers.features.indexOf("vis") > -1;
	const useTypeScript = answers.language === "TypeScript";
	const useTypeChecking = useTypeScript || (answers.tools && answers.tools.indexOf("type checking") > -1);
	const useAdminReact = answers.adminUi === "react";
	const useTabReact = answers.tabReact === "yes";
	const useReact = useAdminReact || useTabReact;
	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
	const useOfficialESLintConfig = useESLint && answers.eslintConfig === "official";
	const usePrettier = answers.tools && answers.tools.indexOf("Prettier") > -1;
	const useNyc = answers.tools && answers.tools.indexOf("code coverage") > -1;
	const useReleaseScript = answers.releaseScript === "yes";

	const minNodeVersion = answers.nodeVersion ?? RECOMMENDED_NODE_VERSION_FALLBACK;

	const dependencyPromises = [...(isAdapter ? ["@iobroker/adapter-core"] : [])]
		.sort()
		.map(dep => async () => `"${dep}": "${await fetchPackageReferenceVersion(dep)}"`)
		.map(task => downloadLimiter(task));
	const dependencies = await Promise.all(dependencyPromises);

	const devDependencyPromises = [
		...[
			// testing and translations are always required
			"@iobroker/testing",
			"@iobroker/adapter-dev",
		],
		...(isAdapter
			? [
					// Testing dependencies are now included in @iobroker/testing 5.1.x
				]
			: []),
		...(isAdapter && useTypeChecking
			? [
					// Type definitions for testing dependencies are now included in @iobroker/testing 5.1.x
					// Recommended tsconfig for the minimum supported Node.js version
					`@tsconfig/node${minNodeVersion}`,
					// and NodeJS typings
					`@types/node@${minNodeVersion}`,
				]
			: []),
		...(useTypeChecking ? ["typescript@~5.9"] : []),
		...(useTypeScript
			? [
					// enhance testing through TS tools
					"source-map-support",
					"ts-node",
					// to clean the build dir
					"rimraf",
				]
			: []),
		...(useReact
			? [
					// React
					"react@17",
					"react-dom@17",
					// ioBroker react framework
					"@iobroker/adapter-react@2.0.22",
					// UI library
					"@material-ui/core",
				]
			: []),
		...(useTypeChecking && useReact
			? [
					// React's type definitions
					"@types/react@17",
					"@types/react-dom@17",
				]
			: []),
		...(useOfficialESLintConfig
			? [
					// Use the official ioBroker ESLint config
					"@iobroker/eslint-config",
				]
			: []),
		...(useESLint && !useOfficialESLintConfig
			? [
					// Upgrade to ESLint 9 for custom configuration
					"eslint@^9",
					"@eslint/js@^9",
				]
			: []),
		...(useESLint && !useOfficialESLintConfig && useTypeScript
			? ["@typescript-eslint/eslint-plugin@^8", "@typescript-eslint/parser@^8"]
			: []),
		...(useESLint && !useOfficialESLintConfig && useReact ? ["eslint-plugin-react"] : []),
		...(useESLint && !useOfficialESLintConfig && usePrettier
			? ["eslint-config-prettier", "eslint-plugin-prettier", "prettier"]
			: []),
		...(useNyc ? ["nyc"] : []),
		...(useReleaseScript
			? [
					"@alcalzone/release-script",
					"@alcalzone/release-script-plugin-iobroker",
					"@alcalzone/release-script-plugin-license",
					"@alcalzone/release-script-plugin-manual-review",
				]
			: []),
	]
		.sort()
		.map(dep => async () => `"${getPackageName(dep)}": "${await fetchPackageReferenceVersion(dep)}"`)
		.map(task => downloadLimiter(task));
	const devDependencies = await Promise.all(devDependencyPromises);

	// Add ioBroker types using npm alias to make IDE treat it like @types package
	if (isAdapter && useTypeChecking) {
		const iobrokerTypesVersion = await fetchPackageReferenceVersion("@iobroker/types");
		devDependencies.push(`"@types/iobroker": "npm:@iobroker/types@${iobrokerTypesVersion}"`);
	}

	// Sort dependencies alphabetically, with @-scoped packages first
	devDependencies.sort((a, b) => {
		const aName = a.match(/"([^"]+)":/)?.[1] || "";
		const bName = b.match(/"([^"]+)":/)?.[1] || "";
		const aIsScoped = aName.startsWith("@");
		const bIsScoped = bName.startsWith("@");

		if (aIsScoped && !bIsScoped) return -1;
		if (!aIsScoped && bIsScoped) return 1;
		return aName.localeCompare(bName);
	});

	const gitUrl =
		answers.gitRemoteProtocol === "HTTPS"
			? `https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}.git`
			: `git@github.com:${answers.authorGithub}/ioBroker.${answers.adapterName}.git`;

	// Generate whitelist for package files
	const packageFiles = [
		"LICENSE",
		"io-package.json",
		// We currently don't have web templates, but users might want to add them
		"www/",
		...(isAdapter ? (useTypeScript ? ["build/"] : ["main.js", "lib/"]) : []),
		...(isAdapter
			? [
					// Web files in the admin root and all subdirectories except src/
					"admin{,/!(src)/**}/*.{html,css,png,svg,jpg,js}",
					// JSON files, but not tsconfig.*.json or .eslintrc.json
					"admin{,/!(src)/**}/!(tsconfig|tsconfig.*|.eslintrc).{json,json5}",
				]
			: []),
		...(isAdapter && useReact ? ["admin/build/"] : []),
		...(isWidget
			? [
					// Web files in the widgets folder
					"widgets/**/*.{html,css,png,svg,jpg,js}",
					// JSON files, but not tsconfig.*.json or .eslintrc.json
					"widgets/**/!(tsconfig|tsconfig.*|.eslintrc).json",
				]
			: []),
	].sort((a, b) => {
		// Put directories on top
		const isDirA = a.includes("/");
		const isDirB = b.includes("/");
		if (isDirA && !isDirB) {
			return -1;
		}
		if (isDirB && !isDirA) {
			return 1;
		}
		return a.localeCompare(b);
	});

	const npmScripts: Record<string, string> = {};
	if (isAdapter) {
		if (useTypeScript && !useReact) {
			npmScripts.prebuild = `rimraf build`;
			npmScripts.build = "build-adapter ts";
			npmScripts.watch = "build-adapter ts --watch";
			npmScripts["prebuild:ts"] = `rimraf build`;
			npmScripts["build:ts"] = "build-adapter ts";
			npmScripts["watch:ts"] = "build-adapter ts --watch";
		} else if (useReact && !useTypeScript) {
			npmScripts.prebuild = `rimraf admin/build`;
			npmScripts.build = "build-adapter react";
			npmScripts.watch = "build-adapter react --watch";
			npmScripts["prebuild:react"] = `rimraf admin/build`;
			npmScripts["build:react"] = "build-adapter react";
			npmScripts["watch:react"] = "build-adapter react --watch";
		} else if (useReact && useTypeScript) {
			npmScripts.prebuild = `rimraf build admin/build`;
			npmScripts.build = "build-adapter all";
			npmScripts.watch = "build-adapter all --watch";
			npmScripts["prebuild:ts"] = `rimraf build`;
			npmScripts["build:ts"] = "build-adapter ts";
			npmScripts["watch:ts"] = "build-adapter ts --watch";
			npmScripts["prebuild:react"] = `rimraf admin/build`;
			npmScripts["build:react"] = "build-adapter react";
			npmScripts["watch:react"] = "build-adapter react --watch";
		}

		if (useTypeScript) {
			npmScripts["test:ts"] = "mocha --config test/mocharc.custom.json src/**/*.test.ts";
		} else {
			npmScripts["test:js"] =
				`mocha --config test/mocharc.custom.json "{!(node_modules|test)/**/*.test.js,*.test.js,test/**/test!(PackageFiles|Startup).js}"`;
		}
		npmScripts["test:package"] = "mocha test/package --exit";
		npmScripts["test:integration"] = "mocha test/integration --exit";
		npmScripts.test = `${useTypeScript ? "npm run test:ts" : "npm run test:js"} && npm run test:package`;

		if (useTypeChecking) {
			if (useReact) {
				npmScripts.check = `tsc --noEmit${useTypeScript ? " && tsc --noEmit -p admin/tsconfig.json" : " -p tsconfig.check.json"}`;
			} else {
				npmScripts.check = `tsc --noEmit${useTypeScript ? "" : " -p tsconfig.check.json"}`;
			}
		}
		if (useNyc) {
			npmScripts.coverage = "nyc npm run test:ts";
		}
		if (useESLint) {
			// Both official and custom configs now use ESLint 9 flat config format
			npmScripts.lint = "eslint -c eslint.config.mjs .";
		}
	} else if (isWidget) {
		npmScripts["test:package"] = "mocha test/package --exit";
		npmScripts.test = "npm run test:package";
	}
	npmScripts.translate = "translate-adapter";
	if (useReleaseScript) {
		npmScripts.release = "release-script";
	}

	// Always include contributors section as an array
	const allContributors = [];

	// Add contributors if specified
	if (answers.contributors && answers.contributors.length) {
		for (const contributorName of answers.contributors) {
			allContributors.push({ name: contributorName });
		}
	}

	const template = `
{
	"name": "iobroker.${answers.adapterName.toLowerCase()}",
	"version": "0.0.1",
	"description": "${answers.description || answers.adapterName}",
	"author": {
		"name": "${answers.authorName}",
		"email": "${answers.authorEmail}",
	},
	"contributors": ${JSON.stringify(allContributors)},
	"homepage": "https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}",
	"license": "${licenses[answers.license!].id}",
	"keywords": ${JSON.stringify(answers.keywords || getDefaultAnswer("keywords"))},
	"repository": {
		"type": "git",
		"url": "${gitUrl}",
	},
	"engines": {
		"node": ">= ${minNodeVersion}"
	},
	"dependencies": {${dependencies.join(",")}},
	"devDependencies": {${devDependencies.join(",")}},
	${
		isAdapter
			? `
		"main": "${useTypeScript ? "build/" : ""}main.js",
	`
			: isWidget
				? `
		"main": "widgets/${answers.adapterName}.html",
	`
				: ""
	}
	"files": ${JSON.stringify(packageFiles)},
	"scripts": ${JSON.stringify(npmScripts)},
	${
		useNyc
			? `"nyc": {
		"include": [
			"src/**/*.ts",
		],
		"exclude": [
			"src/**/*.test.ts",
		],
		"extension": [
			".ts",
		],
		"require": [
			"ts-node/register",
		],
		"reporter": [
			"text-summary",
			"html",
		],
		"sourceMap": true,
		"instrument": true,
	},`
			: ""
	}
	"bugs": {
		"url": "https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}/issues",
	},
	"readmeFilename": "README.md",
}`;
	return JSON.stringify(JSON5.parse(template), null, 2);
};

// package.json is always formatted with 2 spaces
templateFunction.noReformat = true;
export = templateFunction;
