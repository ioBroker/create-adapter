import { TemplateFunction } from "../../src/lib/createAdapter";
import { AdapterSettings, getDefaultAnswer } from "../../src/lib/questions";
import { formatJsonString, translateText } from "../../src/lib/tools";

export = (async answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	const isWidget = answers.features.indexOf("vis") > -1;
	const useReact = answers.adminReact === "yes";

	// Automatically translate all settings
	const adapterSettings: AdapterSettings[] = answers.adapterSettings || getDefaultAnswer("adapterSettings")!;
	const languages = ["en", "de", "ru", "pt", "nl", "fr", "it", "es", "pl", "zh-cn"];
	const translatedSettings: Record<string, Record<string, string>> = {};
	for (const setting of adapterSettings) {
		translatedSettings[setting.key] = {};
		for (const lang of languages) {
			translatedSettings[setting.key][lang] = await translateText(setting.label || setting.key, lang);
		}
	}
	const translatedSettingsJson = Object.keys(translatedSettings)
		.map(key => {
			return `"${key}": ${JSON.stringify(translatedSettings[key], null, 4)}`;
		})
		.join(",\n")
	;

	const template = `
/*global systemDictionary:true */
'use strict';

systemDictionary = ${formatJsonString(`{
	${isAdapter ? (`
	"${answers.adapterName} adapter settings": {
		"en": "Adapter settings for ${answers.adapterName}",
		"de": "Adaptereinstellungen für ${answers.adapterName}",
		"ru": "Настройки адаптера для ${answers.adapterName}",
		"pt": "Configurações do adaptador para ${answers.adapterName}",
		"nl": "Adapterinstellingen voor ${answers.adapterName}",
		"fr": "Paramètres d'adaptateur pour ${answers.adapterName}",
		"it": "Impostazioni dell'adattatore per ${answers.adapterName}",
		"es": "Ajustes del adaptador para ${answers.adapterName}",
		"pl": "Ustawienia adaptera dla ${answers.adapterName}",
		"zh-cn": "${answers.adapterName}的适配器设置"
	},
	${translatedSettingsJson},
	`) : ""}
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
