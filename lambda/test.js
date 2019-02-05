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
	"license": {
		"id": "MIT",
		"name": "MIT License",
		"text":
			"MIT License\n\nCopyright (c) [year] [fullname]\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FORA PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n"
	}
};

console.log(JSON.stringify(answers));

const result = handler({body: JSON.stringify(answers)});

console.log(JSON.stringify(result));
