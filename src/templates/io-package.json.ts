import { composeObject } from "alcalzone-shared/objects";
import * as JSON5 from "json5";
import { TemplateFunction } from "../lib/createAdapter";
import { translateText } from "../lib/tools";

export = (async answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	const isWidget = answers.features.indexOf("vis") > -1;
	const useTypeScript = answers.language === "TypeScript";

	const languages = ["en", "de", "ru", "pt", "nl", "fr", "it", "es", "pl", "zh-cn"];

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
				"pl": "Pierwsze wydanie",
                                "zh-cn": "首次出版"
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
		"icon": "${answers.adapterName}.png",
		"enabled": true,
		"extIcon": "https://raw.githubusercontent.com/${answers.authorGithub}/ioBroker.${answers.adapterName}/master/admin/${answers.adapterName}.png",
		"readme": "https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}/blob/master/README.md",
		"loglevel": "info",
		${isWidget ? (`
			"restartAdapters": ["vis"],
			"localLink": "%web_protocol%://%ip%:%web_port%/vis/edit.html",
		`) : ""}
		${isAdapter ? (`
			"mode": "${answers.startMode || "daemon"}",
			"type": "${answers.type || "general"}",
		`) : isWidget ? (`
			"onlyWWW": true,
			"noConfig": true,
			"singleton": true,
			"type": "${answers.type || "visualization-widgets"}",
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
		"option2": "42"
	},
	"objects": [
	],
	"instanceObjects": [
	],
}`;
	return JSON.stringify(JSON5.parse(template), null, 4);
}) as TemplateFunction;
