import { TemplateFunction } from "../../lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const isWidget = answers.features.indexOf("vis") > -1;
	if (!isWidget) return;

	const widgetName = answers.adapterName;
	const widgetNameCapitalized = widgetName[0].toUpperCase() + widgetName.slice(1);

	const template = `
/* Style your widget here */
.${widgetName}-class {
	font-style: italic;
}
`;
	return template.trim();
};

templateFunction.customPath = answers => `widgets/${answers.adapterName}/css/style.css`;
export = templateFunction;
