import type { TemplateFunction } from "../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
	const useOfficialESLintConfig = useESLint && answers.eslintConfig === "official";
	if (!useOfficialESLintConfig) return;

	const quotes = answers.quotes || "double";
	const singleQuoteComment = quotes === "single" ? "" : "// ";
	const useTabs = answers.indentation === "Tab";

	const template = `// iobroker prettier configuration file
import prettierConfig from '@iobroker/eslint-config/prettier.config.mjs';

export default {
	...prettierConfig,${useTabs ? `
	useTabs: true,` : ""}${quotes === "single" ? `
	singleQuote: true,` : `
	singleQuote: false,`}
};
`;
	return template.trim();
};

templateFunction.customPath = "prettier.config.mjs";
export = templateFunction;