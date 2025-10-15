import type { TemplateFunction } from "../../src/lib/createAdapter";

export = (answers => {
	const supportCustom = answers.adminFeatures && answers.adminFeatures.indexOf("custom") > -1;
	if (!supportCustom) {
		return;
	}

	const config = {
		i18n: true,
		type: "panel",
		items: {
			enabled: {
				type: "checkbox",
				label: "enabled",
				newLine: true,
			},
			interval: {
				type: "text",
				label: "period of time",
				newLine: true,
			},
			state: {
				type: "text",
				label: "new state",
				newLine: true,
			},
			setAck: {
				type: "checkbox",
				label: "ack",
				newLine: true,
			},
		},
	};
	return JSON.stringify(config, null, 4);
}) as TemplateFunction;
