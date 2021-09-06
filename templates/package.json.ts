import * as JSON5 from "json5";
import pLimit from "p-limit";
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
	const useAdminReact = answers.adminReact === "yes";
	const useTabReact = answers.tabReact === "yes";
	const useReact = useAdminReact || useTabReact;
	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
	const usePrettier = answers.tools && answers.tools.indexOf("Prettier") > -1;
	const useNyc = answers.tools && answers.tools.indexOf("code coverage") > -1;
	const useReleaseScript = answers.releaseScript === "yes";
	const useDevcontainer = !!answers.tools?.includes("devcontainer");

	const dependencyPromises = ([] as string[])
		.concat(isAdapter ? ["@iobroker/adapter-core"] : [])
		.sort()
		.map((dep) => (async () => `"${dep}": "${await fetchPackageReferenceVersion(dep)}"`))
		.map(task => downloadLimiter(task))
		;
	const dependencies = await Promise.all(dependencyPromises);

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
			"chai",
			"chai-as-promised",
			"mocha",
			"sinon",
			"sinon-chai",
			"proxyquire",
		] : [])
		.concat(isAdapter && useTypeChecking ? [
			"@types/chai",
			"@types/chai-as-promised",
			"@types/mocha",
			"@types/sinon",
			"@types/sinon-chai",
			"@types/proxyquire",
			// and NodeJS typings
			"@types/node@14",
		] : [])
		.concat(useTypeChecking ? [
			"typescript@~4.4",
		] : [])
		.concat(useTypeScript ? [
			// enhance testing through TS tools
			"source-map-support",
			"ts-node",
			// to clean the build dir
			"rimraf",
		] : [])
		.concat(useReact ? [
			// We use parcel as the bundler
			"parcel-bundler",
			// React
			"react@16", // Pinned to v16 for now, don't forget to update @types/react[-dom] aswell
			"react-dom@16",
			// ioBroker react framework
			"@iobroker/adapter-react@1.6.15",
			// UI library
			"@material-ui/core",
			// This is needed by parcel to compile JSX/TSX
			"@babel/cli",
			"@babel/core",
		]: [])
		.concat(useTypeChecking && useReact ? [
			// React's type definitions
			"@types/react@16",
			"@types/react-dom@16",
		]: [])
		.concat(useTypeScript && useReact ? [
			// We need this for parcel to support some TypeScript features
			"@babel/plugin-proposal-decorators",
			"@babel/preset-env",
			"@babel/preset-typescript",
		]: [])
		.concat(useESLint ? ["eslint"] : [])
		.concat((useESLint && useTypeScript) ? [
			"@typescript-eslint/eslint-plugin",
			"@typescript-eslint/parser",
		] : [])
		.concat((useESLint && useReact) ? [
			"eslint-plugin-react",
		] : [])
		.concat((useESLint && usePrettier) ? [
			"eslint-config-prettier",
			"eslint-plugin-prettier",
			"prettier",
		] : [])
		.concat(useNyc ? ["nyc"] : [])
		.concat(useReleaseScript ? ["@alcalzone/release-script"] : [])
		.sort()
		.map((dep) => (async () => `"${getPackageName(dep)}": "${await fetchPackageReferenceVersion(dep)}"`))
		.map(task => downloadLimiter(task))
		;
	const devDependencies = await Promise.all(devDependencyPromises);

	const gitUrl = answers.gitRemoteProtocol === "HTTPS"
		? `https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}`
		: `git@github.com:${answers.authorGithub}/ioBroker.${answers.adapterName}.git`;
	const parcelFiles = `${useAdminReact ? "admin/src/index.tsx" : ""} ${useTabReact ? "admin/src/tab.tsx" : ""}`.trim();

	// Generate whitelist for package files
	const packageFiles = [
		"LICENSE",
		"io-package.json",
		// We currently don't have web templates, but users might want to add them
		"www/",
		...(useTypeScript ? ["build/"] : [
			"main.js",
			"lib/"
		]),
		...(isAdapter ? [
			// Web files in the admin root and all subdirectories except src
			"admin{,/!(src)/**}/*.{html,css,png,svg,jpg,js}",
		] : []),
		...(isAdapter && useReact ? ["admin/build/"] : []),
		...(isWidget ? ["widgets/"] : [])
	].sort((a, b) => {
		// Put directories on top
		const isDirA = a.includes("/");
		const isDirB = b.includes("/");
		if (isDirA && !isDirB) return -1;
		if (isDirB && !isDirA) return 1;
		return a.localeCompare(b);
	});

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
	"dependencies": {${dependencies.join(",")}},
	"devDependencies": {${devDependencies.join(",")}},
	${isAdapter ? (`
		"main": "${useTypeScript ? "build/" : ""}main.js",
	`) : isWidget ? (`
		"main": "widgets/${answers.adapterName}.html",
	`) : ""}
	"files": ${JSON.stringify(packageFiles)},
	"scripts": {
		${isAdapter ? (`
			${useTypeScript ? (`
				"prebuild": "rimraf ./build",
				${useReact ? `"build:parcel": "parcel build ${parcelFiles} -d admin/build",` : ""}
				"build:ts": "tsc -p tsconfig.build.json",
				"build": "npm run build:ts${useReact ? " && npm run build:parcel" : ""}",
				${useReact ? `"watch:parcel": "parcel ${parcelFiles} -d admin/build${useDevcontainer ? ` --hmr-port 1235` : ""}",` : ""}
				"watch:ts": "tsc -p tsconfig.build.json --watch",
				"watch": "npm run watch:ts",
				"test:ts": "mocha --config test/mocharc.custom.json src/**/*.test.ts",
			`) : (`
				${useReact ? `"watch:parcel": "parcel ${parcelFiles.replace('tsx', 'jsx')} -d admin/build${useDevcontainer ? ` --hmr-port 1235` : ""}",
				"build:parcel": "parcel build ${parcelFiles.replace('tsx', 'jsx')} -d admin/build",
				"build": "npm run build:parcel",` : ""}
				"test:js": "mocha --config test/mocharc.custom.json \\"{!(node_modules|test)/**/*.test.js,*.test.js,test/**/test!(PackageFiles|Startup).js}\\"",
			`)}
			"test:package": "mocha test/package --exit",
			"test:unit": "mocha test/unit --exit",
			"test:integration": "mocha test/integration --exit",
			"test": "${useTypeScript ? "npm run test:ts" : "npm run test:js"} && npm run test:package",
			${useTypeChecking ? `"check": "tsc --noEmit${useTypeScript ? "" : " -p tsconfig.check.json"}",` : ""}
			${useNyc ? `"coverage": "nyc npm run test:ts",` : ""}
			${useESLint && useTypeScript ? (`
				"lint": "eslint --ext .ts${useReact ? ",.tsx" : ""} src/${useReact ? " admin/src/" : ""}",
			`) : ""}
			${useESLint && !useTypeScript ? (`
				"lint": "eslint${useReact ? " --ext .js,.jsx" : ""}",
			`) : ""}
		`) : isWidget ? (`
			"test:package": "mocha test/package --exit",
			"test": "npm run test:package",
		`) : ""}
		${useReleaseScript ? `
			"release": "release-script",` : ""}
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
