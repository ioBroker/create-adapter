'use strict';

const handler = require('./index').handler;

// expected JSON
const answers = {
	"cli": true,
	"adapterName": "adaptername",
	"title": "My Tests",
	"description": "User tries to test adapter creator",
	"features": [
		"adapter"
	],
	"adminFeatures": [],
	"type": "date-and-time",
	"startMode": "daemon",
	"language": "JavaScript",
	"tools": [
		"ESLint",
		"type checking"
	],
	"indentation": "Space (4)",
	"quotes": "single",
	"es6class": "no",
	"authorName": "Bluefox",
	"authorGithub": "GermanBluefox",
	"authorEmail": "dogafox@gmail.com",
	"gitCommit": "no",
	"license": "MIT License"
};

console.log(JSON.stringify(answers));

const result = handler({body: JSON.stringify(answers)});

console.log(JSON.stringify(result));
