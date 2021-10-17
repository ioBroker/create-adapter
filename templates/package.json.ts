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
			"mocha",
			"sinon",
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
			// and NodeJS typings
			"@types/node@14",
		] : []),
		...(useTypeChecking ? [
			"typescript@~4.4",
		] : []),
		...((useTypeScript || useReact) ? [
			// If we need to compile anything, do it with ESBuild/Estrella
			"estrella@1",
			// TODO: when https://github.com/rsms/estrella/pull/47/files is merged,
			// add esbuild as a devDependency
			"tiny-glob",
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
			"react@16", // Pinned to v16 for now, don't forget to update @types/react[-dom] aswell
			"react-dom@16",
			// ioBroker react framework
			"@iobroker/adapter-react@2.0.13",
			// UI library
			"@material-ui/core",
		] : []),
		...(useTypeChecking && useReact ? [
			// React's type definitions
			"@types/react@16",
			"@types/react-dom@16",
		] : []),
		...(useESLint ? [
			// The downstream packages like typescript-eslint don't support ESLint 8 yet.
			// Until they do, pin the version
			"eslint@7"
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
		? `https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}`
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
			// Web files in the admin root and all subdirectories except src
			"admin{,/!(src)/**}/*.{html,css,png,svg,jpg,js}",
			// JSON files, but not tsconfig.*.json
			"admin{,/!(src)/**}/!(tsconfig|tsconfig.*).json"
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
			${(useTypeScript || useReact) ? (`
				"prebuild": "rimraf${useTypeScript ? " build" : ""}${useReact ? " admin/build" : ""}",
				"build": "node .build.js${useTypeScript ? " -typescript" : ""}${useReact ? " -react" : ""}",
				"watch": "npm run build -- --watch",
			`) : ""}
			${useTypeScript ? (`
				"build:ts": "node .build.js -typescript",
				"watch:ts": "npm run build:ts -- --watch",
			`) : ""}
			${useReact ? (`
				"build:react": "node .build.js -react",
				"watch:react": "npm run build:react -- --watch",
			`) : ""}
			${useTypeScript ? (`
				"test:ts": "mocha --config test/mocharc.custom.json src/**/*.test.ts",
			`) : (`
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
			"translate": "translate-adapter",
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
