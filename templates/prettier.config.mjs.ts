import type { TemplateFunction } from "../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
	const useOfficialESLintConfig = useESLint && answers.eslintConfig === "official";
	if (!useOfficialESLintConfig) return;

	const quotes = answers.quotes || "double";
	const singleQuoteComment = quotes === "single" ? "" : "// ";

	const template = `// iobroker prettier configuration file
import prettierConfig from '@iobroker/eslint-config/prettier.config.mjs';

export default {
	...prettierConfig,
	${singleQuoteComment}// uncomment next line if you prefer single quotes
	${singleQuoteComment}singleQuote: true,
};
`;
	return template.trim();
};

templateFunction.customPath = "prettier.config.mjs";
export = templateFunction;