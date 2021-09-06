import type { TemplateFunction } from "../../src/lib/createAdapter";
import { formatJsonString } from "../../src/lib/tools";
import { getTranslatedSettings } from "../../src/lib/translation";

export = (async answers => {

	const hasTab = answers.adminFeatures && answers.adminFeatures.indexOf("tab") > -1;
	const useAdminReact = answers.adminReact === "yes";
	const useTabReact = hasTab && answers.tabReact === "yes";
	const useReact = useAdminReact || useTabReact;

	// Only do the adapter-specific things when not using React
	const isAdapter = !useReact && answers.features.indexOf("adapter") > -1;
	const isWidget = answers.features.indexOf("vis") > -1;

	if (useAdminReact && (!hasTab || useTabReact) && !isWidget) return;

	let translatedSettingsJson = "";
	if (isAdapter) {
		// Automatically translate all settings
		const translatedSettings = await getTranslatedSettings(answers);
		translatedSettingsJson = Object.keys(translatedSettings)
			.map(key => {
				return `"${key}": ${JSON.stringify(translatedSettings[key], null, 4)}`;
			})
			.join(",\n") + ",";
	}

	const template = `
/*global systemDictionary:true */
'use strict';

systemDictionary = ${formatJsonString(`{
	${translatedSettingsJson}
	${isWidget ? (`
	"myColor": {
		"en": "myColor",
		"de": "meineColor",
		"ru": "Мой цвет",
		"pt": "minhaCor",
		"nl": "mijnKleur",
		"fr": "maCouleur",
		"it": "mioColore",
		"es": "miColor",
		"pl": "mójKolor",
		"zh-cn": "我的颜色"
	},
	"myColor_tooltip": {
		"en": "Description of\\x0AmyColor",
		"de": "Beschreibung von\\x0AmyColor",
		"ru": "Описание\\x0AmyColor",
		"pt": "Descrição de\\x0AmyColor",
		"nl": "Beschrijving van\\x0AmyColor",
		"fr": "Description de\\x0AmyColor",
		"it": "Descrizione di\\x0AmyColor",
		"es": "Descripción de\\x0AmyColor",
		"pl": "Opis\\x0AmyColor",
		"zh-cn": "\\x0AmyColor的描述"
	},
	"htmlText": {
		"en": "htmlText",
		"de": "htmlText",
		"ru": "htmlText",
		"pt": "htmlText",
		"nl": "htmlText",
		"fr": "htmlText",
		"it": "htmlText",
		"es": "htmlText",
		"pl": "htmlText",
		"zh-cn": "htmlText"
	},
	"group_extraMyset": {
		"en": "extraMyset",
		"de": "extraMyset",
		"ru": "extraMyset",
		"pt": "extraMyset",
		"nl": "extraMyset",
		"fr": "extraMyset",
		"it": "extraMyset",
		"es": "extraMyset",
		"pl": "extraMyset",
		"zh-cn": "extraMyset"
	},
	"extraAttr": {
		"en": "extraAttr",
		"de": "extraAttr",
		"ru": "extraAttr",
		"pt": "extraAttr",
		"nl": "extraAttr",
		"fr": "extraAttr",
		"it": "extraAttr",
		"es": "extraAttr",
		"pl": "extraAttr",
		"zh-cn": "extraAttr"
	},
	"Instance": {
		"en": "Instance",
		"de": "Instanz",
		"ru": "Инстанция",
		"pt": "Instância",
		"nl": "Instantie",
		"fr": "Instance",
		"it": "Esempio",
		"es": "Instancia",
		"pl": "Instancja",
		"zh-cn": "例"
	}
	`) : ""}
}`, answers.indentation || "Tab")};
`;
	return template.trim();
}) as TemplateFunction;
