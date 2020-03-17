import { promiseSequence } from "alcalzone-shared/async";
import * as JSON5 from "json5";
import { TemplateFunction } from "../src/lib/createAdapter";
import { fetchPackageVersion, getPackageName } from "../src/lib/packageVersions";
import { getDefaultAnswer } from "../src/lib/questions";

const templateFunction: TemplateFunction = async answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	const isWidget = answers.features.indexOf("vis") > -1;
	const useTypeScript = answers.language === "TypeScript";
	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
	const usePrettier = answers.tools && answers.tools.indexOf("Prettier") > -1;
	const useNyc = answers.tools && answers.tools.indexOf("code coverage") > -1;

	const dependencyPromises = ([] as string[])
		.concat(isAdapter ? ["@iobroker/adapter-core"] : [])
		.sort()
		.map((dep) => (async () => `"${dep}": "^${await fetchPackageVersion(dep, "0.0.0")}"`))
		;
	const dependencies = await promiseSequence<string>(dependencyPromises);

	const devDependencyPromises = ([] as string[])
		.concat([
			// gulp is required for repo maintenance
			"@types/gulp",
			"gulp",
			"axios",
			// testing is always required
			"@iobroker/testing",
		])
		.concat(isAdapter ? [
			// support adapter testing by default
			"@types/chai",
			"chai",
			"@types/chai-as-promised",
			"chai-as-promised",
			"@types/mocha",
			"mocha",
			"@types/sinon",
			"sinon@8", // pinned until we drop Node 8 support
			"@types/sinon-chai",
			"sinon-chai",
			"@types/proxyquire",
			"proxyquire",
			// and NodeJS typings
			"@types/node@12",
		] : [])
		.concat(useTypeScript ? [
			// enhance testing through TS tools
			"source-map-support",
			"ts-node",
			// of course we need this
			"typescript",
			// to clean the build dir
			"rimraf",
		] : [])
		.concat(useESLint ? ["eslint"] : [])
		.concat((useESLint && useTypeScript) ? [
			"@typescript-eslint/eslint-plugin",
			"@typescript-eslint/parser",
		] : [])
		.concat((useESLint && usePrettier) ? [
			"eslint-config-prettier",
			"eslint-plugin-prettier",
			"prettier",
		] : [])
		.concat(useNyc ? ["nyc"] : [])
		.sort()
		.map((dep) => (async () => `"${getPackageName(dep)}": "^${await fetchPackageVersion(dep, "0.0.0")}"`))
		;
	const devDependencies = await promiseSequence<string>(devDependencyPromises);

	const gitUrl = answers.gitRemoteProtocol === "HTTPS"
		? `https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}`
		: `git@github.com:${answers.authorGithub}/ioBroker.${answers.adapterName}.git`;

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
	"license": "${answers.license!.id}",
	"keywords": ${JSON.stringify(answers.keywords || getDefaultAnswer("keywords"))},
	"repository": {
		"type": "git",
		"url": "${gitUrl}",
	},
	"dependencies": {${dependencies.join(",")}},
	"devDependencies": {${devDependencies.join(",")}},
	${isAdapter ? (`
		"main": "${useTypeScript ? "build/" : ""}main.js",
	`) : isWidget ? (`
		"main": "widgets/${answers.adapterName}.html",
	`) : ""}
	"scripts": {
		${isAdapter ? (`
			${useTypeScript ? (`
				"prebuild": "rimraf ./build",
				"build:ts": "tsc -p tsconfig.build.json",
				"build": "npm run build:ts",
				"watch:ts": "tsc -p tsconfig.build.json --watch",
				"watch": "npm run watch:ts",
				"test:ts": "mocha --opts test/mocha.custom.opts",
			`) : (`
				"test:js": "mocha --opts test/mocha.custom.opts",
			`)}
			"test:package": "mocha test/package --exit",
			"test:unit": "mocha test/unit --exit",
			"test:integration": "mocha test/integration --exit",
			"test": "${useTypeScript ? "npm run test:ts" : "npm run test:js"} && npm run test:package",
			${useNyc ? `"coverage": "nyc npm run test:ts",` : ""}
			${useESLint ? (`
				"lint": "eslint${useTypeScript ? " --ext .ts src" : ""}",
			`) : ""}
		`) : isWidget ? (`
			"test:package": "mocha test/package --exit",
			"test": "npm run test:package",
		`) : ""}
	},
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
