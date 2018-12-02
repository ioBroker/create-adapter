import { Answers } from "../../lib/questions";

const templateFunction = (answers: Answers) => {

	const isWidget = answers.features.indexOf("VIS widget") > -1;
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

templateFunction.customPath = (answers: Answers) => `widgets/${answers.adapterName}/style.css`;
export = templateFunction;
