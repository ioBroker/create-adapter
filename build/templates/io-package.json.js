"use strict";
const objects_1 = require("alcalzone-shared/objects");
const JSON5 = require("json5");
const tools_1 = require("../lib/tools");
module.exports = async (answers) => {
    const isAdapter = answers.features.indexOf("Adapter") > -1;
    const isWidget = answers.features.indexOf("Adapter") > -1;
    const useTypeScript = answers.language === "TypeScript";
    const useTSLint = answers.tools && answers.tools.indexOf("TSLint") > -1;
    const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
    const useNyc = answers.tools && answers.tools.indexOf("Code coverage") > -1;
    const languages = ["en", "de", "ru", "pt", "nl", "fr", "it", "es", "pl"];
    const title = answers.title || answers.adapterName;
    const titleLang = JSON.stringify(objects_1.composeObject(await Promise.all(languages.map(async (lang) => [lang, await tools_1.translateText(title, lang)]))));
    const description = answers.description || answers.adapterName;
    const descriptionLang = JSON.stringify(objects_1.composeObject(await Promise.all(languages.map(async (lang) => [lang, await tools_1.translateText(description, lang)]))));
    const template = `
{
	"common": {
		"name": "${answers.adapterName}",
		"version": "0.0.1",
		"news": {
			"0.0.1": {
				"en": "initial release",
				"de": "Erstveröffentlichung",
				"ru": "Начальная версия",
				"pt": "lançamento inicial",
				"nl": "Eerste uitgave",
				"fr": "Première version",
				"it": "Versione iniziale",
				"es": "Versión inicial",
				"pl": "Pierwsze wydanie"
			}
		},
		"title": "${answers.title || answers.adapterName}",
		"titleLang": ${titleLang},
		"desc": ${descriptionLang},
		"authors": [
			"${answers.authorName} <${answers.authorEmail}>"
		],
		"keywords": [
			"ioBroker",
			"template",
			"Smart Home",
			"home automation",
		],
		"platform": "Javascript/Node.js",
		"main": "${useTypeScript ? "build/" : ""}main.js",
		"icon": "icon.png",
		"enabled": true,
		"extIcon": "https://raw.githubusercontent.com/${answers.authorGithub}/ioBroker.${answers.adapterName}/master/admin/icon.png",
		"readme": "https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}/blob/master/README.md",
		"loglevel": "info",
		${isWidget ? (`
			"restartAdapters": ["vis"],
			"localLink": "%web_protocol%://%ip%:%web_port%/vis/edit.html",
		`) : ""}
		${isAdapter ? (`
			"mode": "daemon",
			"type": "${answers.type || "general"}",
		`) : isWidget ? (`
			"onlyWWW": true,
			"noConfig": true,
			"singleton": true,
			"type": "visualization-widgets",
			"mode": "once",
		`) : ""}
		${isAdapter ? `"materialize": true,` : ""}
		"dependencies": [
			${isAdapter ? `{ "admin": ">=3.0.0" },` : ""}
			${isWidget ? `"vis",` : ""}
		],
	},
	"native": {
		"option1": true,
		"option2": 42
	},
	"objects": [
	],
	"instanceObjects": [
	],
}`;
    return JSON.stringify(JSON5.parse(template), null, 4);
};
