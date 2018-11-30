export = (params: {
	adapterName: string,
	authorName: string,
	authorEmail: string,
	authorGithub: string,
}) => {
	const template = `{
	"name": "iobroker.${params.adapterName}",
	"version": "0.0.1",
	"description": "ioBroker template Adapter for TypeScript",
	"author": {
		"name": "${params.authorName}",
		"email": "${params.authorEmail}"
	},
	"contributors": [
		{
			"name": "${params.authorName}",
			"email": "${params.authorEmail}"
		}
	],
	"homepage": "https://github.com/${params.authorGithub}/ioBroker.${params.adapterName}",
	"license": "MIT",
	"keywords": [
		"ioBroker",
		"template",
		"Smart Home",
		"home automation"
	],
	"repository": {
		"type": "git",
		"url": "https://github.com/${params.authorGithub}/ioBroker.${params.adapterName}"
	},
	"dependencies": {},
	"devDependencies": {
		"@types/chai": "^4.0.4",
		"@types/mocha": "^2.2.43",
		"@types/node": "^6.0.88",
		"chai": "^4.1.2",
		"gulp": "^3.9.1",
		"mocha": "^4.1.0",
		"nyc": "^11.2.1",
		"source-map-support": "^0.5.0",
		"ts-node": "^3.3.0",
		"tslint": "^5.7.0",
		"typescript": "^2.5.2"
	},
	"main": "build/main.js",
	"scripts": {
		"test_js": "node node_modules/mocha/bin/mocha test/*.js",
		"test_ts": "node node_modules/mocha/bin/mocha --compilers ts-node/register --require source-map-support/register src/**/*.test.ts",
		"test": "npm run test_ts && npm run test_js",
		"coverage": "node node_modules/nyc/bin/nyc npm run test_ts",
		"lint": "npm run tslint \"src/**/*.ts\"",
		"tslint": "tslint"
	},
	"nyc": {
		"include": [
			"src/**/*.ts"
		],
		"exclude": [
			"src/**/*.test.ts"
		],
		"extension": [
			".ts"
		],
		"require": [
			"ts-node/register"
		],
		"reporter": [
			"text-summary",
			"html"
		],
		"sourceMap": true,
		"instrument": true
	},
	"bugs": {
		"url": "https://github.com/${params.authorGithub}/ioBroker.${params.adapterName}/issues"
	},
	"readmeFilename": "README.md"
}`;
	return JSON.stringify(JSON.parse(template), null, 2);
};
