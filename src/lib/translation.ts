import { AdapterSettings, Answers, getDefaultAnswer } from "./core/questions";
import type { TemplateFunction } from "./createAdapter";
import { formatJsonString, translateText } from "./tools";

export type Languages =
	| "en"
	| "de"
	| "ru"
	| "pt"
	| "nl"
	| "fr"
	| "it"
	| "es"
	| "pl"
	| "zh-cn";

export type TranslatedTerm = { [lang in Languages]?: string };

const titles: Record<Languages, string> = {
	en: "Adapter settings for <adapterName>",
	de: "Adaptereinstellungen für <adapterName>",
	ru: "Настройки адаптера для <adapterName>",
	pt: "Configurações do adaptador para <adapterName>",
	nl: "Adapterinstellingen voor <adapterName>",
	fr: "Paramètres d'adaptateur pour <adapterName>",
	it: "Impostazioni dell'adattatore per <adapterName>",
	es: "Ajustes del adaptador para <adapterName>",
	pl: "Ustawienia adaptera dla <adapterName>",
	"zh-cn": "<adapterName>的适配器设置",
};

export async function getTranslatedSettingsForLanguage(
	language: Languages,
	answers: Answers,
): Promise<Record<string, string>> {
	const adapterSettings: AdapterSettings[] =
		answers.adapterSettings || getDefaultAnswer("adapterSettings")!;
	const translatedSettings: Record<string, string> = {};
	translatedSettings[`${answers.adapterName} adapter settings`] = titles[
		language
	].replace(/<adapterName>/gi, answers.adapterName);
	for (const setting of adapterSettings) {
		translatedSettings[setting.key] = await translateText(
			setting.label || setting.key,
			language,
		);
	}

	return translatedSettings;
}

/**
 * Translates all setting strings to all languages.
 * @param answers The answers provided by the user.
 */
export async function getTranslatedSettings(
	answers: Answers,
): Promise<Record<string, TranslatedTerm>> {
	const languages: Languages[] = [
		"en",
		"de",
		"ru",
		"pt",
		"nl",
		"fr",
		"it",
		"es",
		"pl",
		"zh-cn",
	];
	const allTranslations = await Promise.all(
		languages.map((lang) =>
			getTranslatedSettingsForLanguage(lang, answers),
		),
	);
	const translatedSettings: Record<string, TranslatedTerm> = {};
	for (let i = 0; i < allTranslations.length; i++) {
		const translations = allTranslations[i];
		const lang = languages[i];
		for (const key in translations) {
			if (translations.hasOwnProperty(key)) {
				const translation =
					translatedSettings[key] || (translatedSettings[key] = {});
				translation[lang] = translations[key];
			}
		}
	}

	return translatedSettings;
}

export function getI18nJsonTemplate(language: Languages): TemplateFunction {
	return async (answers) => {
		const isAdapter = answers.features.indexOf("adapter") > -1;
		const useReact =
			answers.adminReact === "yes" || answers.tabReact === "yes";
		if (!isAdapter || !useReact) return;

		const translatedSettings = await getTranslatedSettingsForLanguage(
			language,
			answers,
		);

		return formatJsonString(
			JSON.stringify(translatedSettings, null, 4),
			answers.indentation || "Tab",
		);
	};
}
