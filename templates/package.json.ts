import pLimit from "@esm2cjs/p-limit";
import * as JSON5 from "json5";
import { licenses } from "../src/lib/core/licenses";
import { getDefaultAnswer } from "../src/lib/core/questions";
import type { TemplateFunction } from "../src/lib/createAdapter";
import { fetchPackageReferenceVersion, getPackageName } from "../src/lib/packageVersions";

// Limit package version downloads to 10 simultaneous connections
const downloadLimiter = pLimit(10);

const templateFunction: TemplateFunction = async answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	const isWidget = answers.features.indexOf("vis") > -1;
	const useTypeScript = answers.language === "TypeScript";
	const useTypeChecking = useTypeScript
		|| (answers.tools && answers.tools.indexOf("type checking") > -1);
	const useAdminReact = answers.adminUi === "react";
	const useTabReact = answers.tabReact === "yes";
	const useReact = useAdminReact || useTabReact;
	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
	const usePrettier = answers.tools && answers.tools.indexOf("Prettier") > -1;
	const useNyc = answers.tools && answers.tools.indexOf("code coverage") > -1;
	const useReleaseScript = answers.releaseScript === "yes";

	const minNodeVersion = answers.nodeVersion ?? "14";
	const mochaVersion = minNodeVersion === "14" ? "@9" : "";
	const sinonVersion = minNodeVersion === "14" ? "@13" : "";

	const dependencyPromises = [
		...(isAdapter ? ["@iobroker/adapter-core"] : [])
	]
		.sort()
		.map((dep) => (async () => `"${dep}": "${await fetchPackageReferenceVersion(dep)}"`))
		.map(task => downloadLimiter(task))
		;
	const dependencies = await Promise.all(dependencyPromises);

	const devDependencyPromises = [
		...([
			// testing and translations are always required
			"@iobroker/testing",
			"@iobroker/adapter-dev",
		]),
		...(isAdapter ? [
			// support adapter testing by default
			"chai",
			"chai-as-promised",
			`mocha${mochaVersion}`,
			`sinon${sinonVersion}`,
			"sinon-chai",
			"proxyquire",
		] : []),
		...(isAdapter && useTypeChecking ? [
			"@types/chai",
			"@types/chai-as-promised",
			"@types/mocha",
			"@types/sinon",
			"@types/sinon-chai",
			"@types/proxyquire",
			// Recommended tsconfig for the minimum supported Node.js version
			`@tsconfig/node${minNodeVersion}`,
			// and NodeJS typings
			`@types/node@${minNodeVersion}`,
		] : []),
		...(useTypeChecking ? [
			"typescript@~4.6",
		] : []),
		...(useTypeScript ? [
			// enhance testing through TS tools
			"source-map-support",
			"ts-node",
			// to clean the build dir
			"rimraf",
		] : []),
		...(useReact ? [
			// React
			"react@17",
			"react-dom@17",
			// ioBroker react framework
			"@iobroker/adapter-react@2.0.22",
			// UI library
			"@material-ui/core",
		] : []),
		...(useTypeChecking && useReact ? [
			// React's type definitions
			"@types/react@17",
			"@types/react-dom@17",
		] : []),
		...(useESLint ? [
			"eslint"
		] : []),
		...((useESLint && useTypeScript) ? [
			"@typescript-eslint/eslint-plugin",
			"@typescript-eslint/parser",
		] : []),
		...((useESLint && useReact) ? [
			"eslint-plugin-react",
		] : []),
		...((useESLint && usePrettier) ? [
			"eslint-config-prettier",
			"eslint-plugin-prettier",
			"prettier",
		] : []),
		...(useNyc ? ["nyc"] : []),
		...(useReleaseScript ? ["@alcalzone/release-script@2"] : [])
	]
		.sort()
		.map((dep) => (async () => `"${getPackageName(dep)}": "${await fetchPackageReferenceVersion(dep)}"`))
		.map(task => downloadLimiter(task))
		;
	const devDependencies = await Promise.all(devDependencyPromises);

	const gitUrl = answers.gitRemoteProtocol === "HTTPS"
		? `https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}.git`
		: `git@github.com:${answers.authorGithub}/ioBroker.${answers.adapterName}.git`;

	// Generate whitelist for package files
	const packageFiles = [
		"LICENSE",
		"io-package.json",
		// We currently don't have web templates, but users might want to add them
		"www/",
		...(isAdapter ? (
			useTypeScript
				? ["build/"]
				: ["main.js", "lib/"]
		) : []),
		...(isAdapter ? [
			// Web files in the admin root and all subdirectories except src/
			"admin{,/!(src)/**}/*.{html,css,png,svg,jpg,js}",
			// JSON files, but not tsconfig.*.json or .eslintrc.json
			"admin{,/!(src)/**}/!(tsconfig|tsconfig.*|.eslintrc).json"
		] : []),
		...(isAdapter && useReact ? ["admin/build/"] : []),
		...(isWidget ? [
			// Web files in the widgets folder
			"widgets/**/*.{html,css,png,svg,jpg,js}",
			// JSON files, but not tsconfig.*.json or .eslintrc.json
			"widgets/**/!(tsconfig|tsconfig.*|.eslintrc).json"
		] : [])
	].sort((a, b) => {
		// Put directories on top
		const isDirA = a.includes("/");
		const isDirB = b.includes("/");
		if (isDirA && !isDirB) return -1;
		if (isDirB && !isDirA) return 1;
		return a.localeCompare(b);
	});


	const npmScripts: Record<string, string> = {};
	if (isAdapter) {
		if (useTypeScript && !useReact) {
			npmScripts["prebuild"] = `rimraf build`;
			npmScripts["build"] = "build-adapter ts";
			npmScripts["watch"] = "build-adapter ts --watch";
			npmScripts["prebuild:ts"] = `rimraf build`;
			npmScripts["build:ts"] = "build-adapter ts";
			npmScripts["watch:ts"] = "build-adapter ts --watch";
		} else if (useReact && !useTypeScript) {
			npmScripts["prebuild"] = `rimraf admin/build`;
			npmScripts["build"] = "build-adapter react";
			npmScripts["watch"] = "build-adapter react --watch";
			npmScripts["prebuild:react"] = `rimraf admin/build`;
			npmScripts["build:react"] = "build-adapter react";
			npmScripts["watch:react"] = "build-adapter react --watch";
		} else if (useReact && useTypeScript) {
			npmScripts["prebuild"] = `rimraf build admin/build`;
			npmScripts["build"] = "build-adapter all";
			npmScripts["watch"] = "build-adapter all --watch";
			npmScripts["prebuild:ts"] = `rimraf build`;
			npmScripts["build:ts"] = "build-adapter ts";
			npmScripts["watch:ts"] = "build-adapter ts --watch";
			npmScripts["prebuild:react"] = `rimraf admin/build`;
			npmScripts["build:react"] = "build-adapter react";
			npmScripts["watch:react"] = "build-adapter react --watch";
		}

		if (useTypeScript) {
			npmScripts["test:ts"] = "mocha --config test/mocharc.custom.json src/**/*.test.ts"
		} else {
			npmScripts["test:js"] = `mocha --config test/mocharc.custom.json "{!(node_modules|test)/**/*.test.js,*.test.js,test/**/test!(PackageFiles|Startup).js}"`
		}
		npmScripts["test:package"] = "mocha test/package --exit";
		npmScripts["test:integration"] = "mocha test/integration --exit";
		npmScripts["test"] = `${useTypeScript ? "npm run test:ts" : "npm run test:js"} && npm run test:package`;

		if (useTypeChecking) {
			if (useReact) {
				npmScripts["check"] = `tsc --noEmit${useTypeScript ? " && tsc --noEmit -p admin/tsconfig.json" : " -p tsconfig.check.json"}`;
			} else {
				npmScripts["check"] = `tsc --noEmit${useTypeScript ? "" : " -p tsconfig.check.json"}`;
			}
		}
		if (useNyc) {
			npmScripts["coverage"] = "nyc npm run test:ts";
		}
		if (useESLint) {
			if (useTypeScript) {
				npmScripts["lint"] = `eslint --ext .ts${useReact ? ",.tsx" : ""} src/${useReact ? " admin/src/" : ""}`;
			} else {
				npmScripts["lint"] = `eslint${useReact ? " --ext .js,.jsx" : ""} .`;
			}
		}
	} else if (isWidget) {
		npmScripts["test:package"] = "mocha test/package --exit";
		npmScripts["test"] = "npm run test:package";
	}
	npmScripts["translate"] = "translate-adapter";
	if (useReleaseScript) {
		npmScripts["release"] = "release-script";
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
	${answers.contributors && answers.contributors.length ? (`
		"contributors": ${JSON.stringify(
		answers.contributors.map(name => ({ name }))
	)},
	`) : ""}
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
	${isAdapter ? (`
		"main": "${useTypeScript ? "build/" : ""}main.js",
	`) : isWidget ? (`
		"main": "widgets/${answers.adapterName}.html",
	`) : ""}
	"files": ${JSON.stringify(packageFiles)},
	"scripts": ${JSON.stringify(npmScripts)},
	${useNyc ? `"nyc": {
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
	},` : ""}
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
