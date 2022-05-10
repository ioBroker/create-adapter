import { AdapterSettings, getDefaultAnswer } from "../../src/lib/core/questions";
import type { TemplateFunction } from "../../src/lib/createAdapter";

function generateSetting(settings: AdapterSettings): any {
	if (settings.inputType === "select") {
		return {
			type: "select",
			label: settings.label || settings.key,
			options: settings.options.map(o => ({ label: o.text, value: o.value })),
		};
	} else {
		return {
			type: settings.inputType,
			label: settings.label || settings.key,
		};
	}
}

export = (answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	const useJsonConfig = answers.adminUi === 'json';
	if (!isAdapter || !useJsonConfig) return;

	const adapterSettings: AdapterSettings[] = answers.adapterSettings ?? getDefaultAnswer("adapterSettings")!;
	const items = adapterSettings.reduce<Record<string, any>>(
		(old, setting) => ({... old, [setting.key]: generateSetting(setting)}), {})
	const config = {
		i18n: true,
		type: "panel",
		items
	};
	return JSON.stringify(config, null, 4);
}) as TemplateFunction;
