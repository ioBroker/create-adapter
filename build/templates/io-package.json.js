"use strict";
const objects_1 = require("alcalzone-shared/objects");
const JSON5 = require("json5");
const tools_1 = require("../src/lib/tools");
module.exports = (async (answers) => {
    const isAdapter = answers.features.indexOf("adapter") > -1;
    const isWidget = answers.features.indexOf("vis") > -1;
    const useTypeScript = answers.language === "TypeScript";
    const supportCustom = answers.adminFeatures && answers.adminFeatures.indexOf("custom") > -1;
    const supportTab = answers.adminFeatures && answers.adminFeatures.indexOf("tab") > -1;
    const languages = ["en", "de", "ru", "pt", "nl", "fr", "it", "es", "pl", "zh-cn"];
    const title = answers.title || answers.adapterName;
    const titleLang = JSON.stringify(objects_1.composeObject(await Promise.all(languages.map(async (lang) => [lang, await tools_1.translateText(title, lang)]))));
    const description = answers.description || answers.adapterName;
    const descriptionLang = JSON.stringify(objects_1.composeObject(await Promise.all(languages.map(async (lang) => [lang, await tools_1.translateText(description, lang)]))));
    let native = "";
    // generate native parameters
    if (answers.parameters) {
        const params = {};
        answers.parameters.forEach(param => {
            if (param.type === "checkbox") {
                params[param.name] = !!param.def;
            }
            else if (param.type === "number") {
                params[param.name] = parseFloat(param.def);
            }
            else {
                params[param.name] = param.def;
            }
        });
        native = JSON.stringify(params, null, 2);
    }
    else {
        native = JSON.stringify({
            option1: true,
            option2: "42",
        }, null, 2);
    }
    let connection = "";
    if (answers.connection === "yes") {
        connection = `{
      	"_id":  "info",
      	"type": "channel",
      	"common": {
      	  "name": "Information"
      	},
      	"native": {}
    },
    {
      	"_id":  "info.connection",
      	"type": "state",
      	"common": {
      	  "role":  "indicator.connected",
      	  "name":  "If connected to device or service",
      	  "type":  "boolean",
      	  "read":  true,
      	  "write": false,
      	  "def":   false
      	},
      	"native": {}
    }
`;
    }
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
		"license": "${answers.license.id}",
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
			"compact": true,
		`) : isWidget ? (`
			"onlyWWW": true,
			"noConfig": true,
			"singleton": true,
			"type": "${answers.type || "visualization-widgets"}",
			"mode": "once",
		`) : ""}
		${isAdapter ? `"materialize": true,` : ""}
		${supportTab ? (`
		"materializeTab": true,
		"adminTab": {
			"singleton": true,
			"name": ${titleLang},
			"link": "",
			"fa-icon": "info",
		},
		`) : ""}
		${supportCustom ? `"supportCustoms": true,` : ""}
		"dependencies": [
			${isAdapter ? `{ "admin": ">=3.0.0" },` : ""}
			${isWidget ? `"vis",` : ""}
		],
	},
	"native": ${native},
	"objects": [
	],
	"instanceObjects": [
${connection}],
}`;
    return JSON.stringify(JSON5.parse(template), null, 4);
});
