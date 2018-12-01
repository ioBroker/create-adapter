import { composeObject } from "alcalzone-shared/objects";
import * as JSON5 from "json5";
import { Answers } from "../lib/questions";
import { translateText } from "../lib/tools";

export = async (answers: Answers) => {

	const isAdapter = answers.features.indexOf("Adapter") > -1;
	const isWidget = answers.features.indexOf("Adapter") > -1;
	const useTypeScript = answers.language === "TypeScript";
	const useTSLint = answers.tools && answers.tools.indexOf("TSLint") > -1;
	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
	const useNyc = answers.tools && answers.tools.indexOf("Code coverage") > -1;

	const languages = ["en", "de", "ru", "pt", "nl", "fr", "it", "es", "pl"];

	const title: string = answers.title || answers.adapterName;
	const titleLang = JSON.stringify(
		composeObject(await Promise.all(
			languages.map(async lang => [lang, await translateText(title, lang)] as [string, string]),
		)),
	);

	const description: string = answers.description || answers.adapterName;
	const descriptionLang = JSON.stringify(
		composeObject(await Promise.all(
			languages.map(async lang => [lang, await translateText(description, lang)] as [string, string]),
		)),
	);

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
		"platform": "Javascript/Node.js",
		"mode": "daemon",
		"main": "${useTypeScript ? "build/" : ""}main.js",
		"icon": "template.png",
		"enabled": true,
		"extIcon": "https://raw.githubusercontent.com/${answers.authorGithub}/ioBroker.${answers.adapterName}/master/admin/template.png",
		"readme": "https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}/blob/master/README.md",
		"loglevel": "info",
		"type": "general",
		"keywords": [
			"ioBroker",
			"template",
			"Smart Home",
			"home automation",
		],
		"materialize": true,
		${isWidget ? `"restartAdapters": ["vis"],` : ""}
		"dependencies": [
			{
				"admin": ">=3.0.0"
			}
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
