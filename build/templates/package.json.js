"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const tools_1 = require("../lib/tools");
function getDependencyVersion(dependency) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield tools_1.executeCommand(tools_1.isWindows ? "npm.cmd" : "npm", ["view", `${dependency}@latest`, "version"], { stdout: "pipe", stderr: "ignore" });
        if (result.exitCode === 0
            || typeof result.stdout !== "string") {
            tools_1.error(`Could not resolve version of ${dependency}!`);
            process.exit(2);
        }
        const version = result.stdout.trim();
        if (version.length === 0) {
            tools_1.error(`Could not resolve version of ${dependency}!`);
            process.exit(2);
        }
        return version;
    });
}
module.exports = (params) => __awaiter(this, void 0, void 0, function* () {
    const isAdapter = params.features.indexOf("Adapter") > -1;
    const isWidget = params.features.indexOf("Adapter") > -1;
    const useTypeScript = params.language === "TypeScript";
    const useTSLint = params.tools && params.tools.indexOf("TSLint") > -1;
    const useESLint = params.tools && params.tools.indexOf("ESLint") > -1;
    const useNyc = params.tools && params.tools.indexOf("Code coverage") > -1;
    const devDependencies = yield Promise.all([]
        .concat(isAdapter ? [
        // support adapter testing by default
        "@types/chai",
        "chai",
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
        .concat(useNyc ? ["nyc"] : [])
        // convert deps into the correct lines
        .map((dep) => __awaiter(this, void 0, void 0, function* () { return `"${dep}": "${yield getDependencyVersion(dep)}"`; })));
    const template = `{
	"name": "iobroker.${params.adapterName}"
	,"version": "0.0.1"
	,"description": "${params.description || params.adapterName}"
	,"author": {
		"name": "${params.authorName}"
		,"email": "${params.authorEmail}"
	}
	,"contributors": [
		{
			"name": "${params.authorName}"
			,"email": "${params.authorEmail}"
		}
	]
	,"homepage": "https://github.com/${params.authorGithub}/ioBroker.${params.adapterName}"
	,"license": "MIT"
	,"keywords": [
		"ioBroker"
		,"template"
		,"Smart Home"
		,"home automation"
	]
	,"repository": {
		"type": "git"
		,"url": "https://github.com/${params.authorGithub}/ioBroker.${params.adapterName}"
	}
	,"dependencies": {}
	,"devDependencies": {${devDependencies.join(",")}}
	,"main": "${useTypeScript ? "build/" : ""}main.js"
	,"scripts": {
		${useTypeScript ? (`
			"prebuild": "rimraf ./build",
			"build:ts": "tsc -p src/tsconfig.json",
			"build": "npm run build:ts",
			"watch:ts": "tsc -p src/tsconfig.json --watch",
			"watch": "npm run watch:ts",
			"test:ts": "mocha --opts test/mocha.typescript.opts",
		`) : ""}
		"test:package": "mocha test/testPackageFiles.js --exit"
		,"test:iobroker": "mocha test/testAdapter.js --exit"
		,"test": "${useTypeScript ? "npm run test:ts && " : ""}npm run test:package && npm run test:iobroker"
		${useNyc ? `,"coverage": "node node_modules/nyc/bin/nyc npm run test_ts"` : ""}
		${useTSLint ? (`
			,"lint": "npm run lint:ts \"src/**/*.ts\""
			,"lint:ts": "tslint"`) : useESLint ? (`
			,"lint": "npm run lint:js"
			,"lint:js": "eslint"`) : ""}
	}
	${useNyc ? `,"nyc": {
		"include": [
			"src/**/*.ts"
		]
		,"exclude": [
			"src/**/*.test.ts"
		]
		,"extension": [
			".ts"
		]
		,"require": [
			"ts-node/register"
		]
		,"reporter": [
			"text-summary"
			,"html"
		]
		,"sourceMap": true
		,"instrument": true
	}` : ""}
	,"bugs": {
		"url": "https://github.com/${params.authorGithub}/ioBroker.${params.adapterName}/issues"
	}
	,"readmeFilename": "README.md"
}`;
    return JSON.stringify(JSON.parse(template), null, 2);
});
//# sourceMappingURL=package.json.js.map