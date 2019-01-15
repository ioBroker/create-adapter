"use strict";
const async_1 = require("alcalzone-shared/async");
const JSON5 = require("json5");
const fetchVersions_1 = require("../lib/fetchVersions");
const templateFunction = async (answers) => {
    const isAdapter = answers.features.indexOf("adapter") > -1;
    const isWidget = answers.features.indexOf("vis") > -1;
    const useTypeScript = answers.language === "TypeScript";
    const useTSLint = answers.tools && answers.tools.indexOf("TSLint") > -1;
    const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
    const useNyc = answers.tools && answers.tools.indexOf("code coverage") > -1;
    const dependencyPromises = []
        .concat(isAdapter ? ["@iobroker/adapter-core"] : [])
        .sort()
        .map((dep) => (async () => `"${dep}": "^${await fetchVersions_1.fetchPackageVersion(dep)}"`));
    const dependencies = await async_1.promiseSequence(dependencyPromises);
    const devDependencyPromises = []
        .concat([
        // gulp is required for repo maintenance
        "@types/gulp",
        "gulp",
        "@vitalets/google-translate-api",
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
        "sinon",
        "@types/sinon-chai",
        "sinon-chai",
        "@types/proxyquire",
        "proxyquire",
        // and NodeJS typings
        "@types/node",
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
        .concat(useTSLint ? ["tslint"] : [])
        .concat(useESLint ? ["eslint"] : [])
        .concat(useNyc ? ["nyc"] : [])
        .sort()
        .map((dep) => (async () => `"${dep}": "^${await fetchVersions_1.fetchPackageVersion(dep)}"`));
    const devDependencies = await async_1.promiseSequence(devDependencyPromises);
    const template = `
{
	"name": "iobroker.${answers.adapterName.toLowerCase()}",
	"version": "0.0.1",
	"description": "${answers.description || answers.adapterName}",
	"author": {
		"name": "${answers.authorName}",
		"email": "${answers.authorEmail}",
	},
	"homepage": "https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}",
	"license": "${answers.license.id}",
	"keywords": [
		"ioBroker",
		"template",
		"Smart Home",
		"home automation",
	],
	"repository": {
		"type": "git",
		"url": "https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}",
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
			"test:package": "mocha test/testPackageFiles.js --exit",
			"test:iobroker": "mocha test/testStartup.js --exit",
			"test": "${useTypeScript ? "npm run test:ts" : "npm run test:js"} && npm run test:package",
			${useNyc ? `"coverage": "nyc npm run test:ts",` : ""}
			${useTSLint ? (`
				"lint": "npm run lint:ts \\\"src/**/*.ts\\\"",
				"lint:ts": "tslint",
			`) : useESLint ? (`
				"lint": "npm run lint:js",
				"lint:js": "eslint",
			`) : ""}
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
module.exports = templateFunction;
