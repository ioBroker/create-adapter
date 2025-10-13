import { translateText } from "@iobroker/adapter-dev/build/translate";
import { composeObject } from "alcalzone-shared/objects";
import * as JSON5 from "json5";
import { licenses, type LicenseType } from "../src/lib/core/licenses";
import type { AdapterSettings } from "../src/lib/core/questions";
import { getDefaultAnswer, getIconName } from "../src/lib/core/questions";
import type { TemplateFunction } from "../src/lib/createAdapter";

export = (async answers => {
	const isAdapter = answers.features.indexOf("adapter") > -1;
	const isWidget = answers.features.indexOf("vis") > -1;
	const widgetIsMainFunction = answers.widgetIsMainFunction === "main";
	const useJsonConfig = answers.adminUi === "json";
	const useAdminReact = answers.adminUi === "react";
	const useTabReact = answers.tabReact === "yes";
	const useReact = useAdminReact || useTabReact;
	const supportCustom = answers.adminFeatures && answers.adminFeatures.indexOf("custom") > -1;
	const supportTab = answers.adminFeatures && answers.adminFeatures.indexOf("tab") > -1;
	const defaultBranch = answers.defaultBranch || "main";

	const languages = ["en", "de", "ru", "pt", "nl", "fr", "it", "es", "pl", "uk", "zh-cn"];

	const title: string = answers.title || answers.adapterName;
	const titleLang = JSON.stringify(
		composeObject(
			await Promise.all(
				languages.map(async lang => [lang, await translateText(title, lang)] as [string, string]),
			),
		),
	);

	const description: string = answers.description || answers.adapterName;
	const descriptionLang = JSON.stringify(
		composeObject(
			await Promise.all(
				languages.map(async lang => [lang, await translateText(description, lang)] as [string, string]),
			),
		),
	);

	const allSettings: AdapterSettings[] = answers.adapterSettings || getDefaultAnswer("adapterSettings")!;
	const adapterSettings: Record<string, any> = {};
	for (const setting of allSettings) {
		adapterSettings[setting.key] = setting.defaultValue;
	}

	// The "license" field is going to be replaced with "licenseInformation".
	// For now keep both to be compatible
	const licenseId = licenses[answers.license!].id as LicenseType;
	const licenseInformation = answers.licenseInformation || { type: "free" };
	licenseInformation.license = licenseId;

	let adminUiConfig: string;
	switch (answers.adminUi) {
		case "react":
		case "html":
			adminUiConfig = "materialize";
			break;
		case "json":
			adminUiConfig = "json";
			break;
		default:
			adminUiConfig = "none";
			break;
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
				"uk": "Початкова версія",
				"zh-cn": "首次出版"
			}
		},
		"titleLang": ${titleLang},
		"desc": ${descriptionLang},
		"authors": [
			"${answers.authorName} <${answers.authorEmail}>"
		],
		"keywords": ${JSON.stringify(answers.keywords || getDefaultAnswer("keywords"))},
		"licenseInformation": ${JSON.stringify(licenseInformation)},
		"platform": "Javascript/Node.js",
		"icon": "${getIconName(answers)}",
		"enabled": true,
		"extIcon": "https://raw.githubusercontent.com/${answers.authorGithub}/ioBroker.${answers.adapterName}/${defaultBranch}/admin/${getIconName(answers)}",
		"readme": "https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}/blob/${defaultBranch}/README.md",
		"loglevel": "info",
		"tier": 3,
		${
			isWidget && widgetIsMainFunction
				? `
			"restartAdapters": ["vis"],
		`
				: ""
		}
		${
			isAdapter
				? `
			"mode": "${answers.startMode || "daemon"}",
			${
				answers.scheduleStartOnChange === "yes"
					? `
				"allowInit": true,
			`
					: ""
			}
			"type": "${answers.type || "general"}",
			"compact": true,
			${
				answers.connectionType
					? `
				"connectionType": "${answers.connectionType}",
			`
					: ""
			}
			${
				answers.dataSource
					? `
				"dataSource": "${answers.dataSource}",
			`
					: ""
			}
		`
				: isWidget
					? `
			"onlyWWW": true,
			"noConfig": true,
			"singleton": true,
			"type": "${answers.type || "visualization-widgets"}",
			"mode": "once",
		`
					: ""
		}
		${
			isAdapter
				? `
		"adminUI": {
			"config": "${adminUiConfig}",
			${supportTab ? `"tab": "materialize",` : ""}
		},`
				: isWidget
					? `
		"adminUI": {
			"config": "none"
		},`
					: ""
		}
		${
			supportTab
				? `
		"adminTab": {
			"singleton": true,
			"name": ${titleLang},
			"link": "",
		},
		`
				: ""
		}
		${supportCustom ? `"supportCustoms": true,` : ""}
		${useReact ? `"eraseOnUpload": true,` : ""}
		"dependencies": [
			${isAdapter ? `{ "js-controller": ">=6.0.11" },` : ""}
			${isWidget && widgetIsMainFunction ? `"vis",` : ""}
		],
		"globalDependencies": [
			${isAdapter ? `{ "admin": ">=7.0.23" },` : ""}
		],
	},
	"native": ${JSON.stringify(adapterSettings)},
	"objects": [
	],
	"instanceObjects": [
		${
			answers.connectionIndicator === "yes"
				? `{
			"_id":  "info",
			"type": "channel",
			"common": {
				"name": "Information"
			},
			"native": {}
		},
		{
			"_id": "info.connection",
			"type": "state",
			"common": {
				"role": "indicator.connected",
				"name": "Device or service connected",
				"type": "boolean",
				"read": true,
				"write": false,
				"def": false
			},
			"native": {}
		},`
				: ""
		}
	],
}`;
	return JSON.stringify(JSON5.parse(template), null, 4);
}) as TemplateFunction;
