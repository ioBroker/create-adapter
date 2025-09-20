import type { TemplateFunction } from "../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useESLint = answers.tools?.includes("ESLint")
	if (!useESLint) return;
	const useOfficialESLintConfig = answers.eslintConfig === "official";
	// Don't generate .eslintignore when using official config (ignores are in eslint.config.mjs)
	if (useOfficialESLintConfig) return;

	const useTypeScript = answers.language === "TypeScript";
	const useReact = answers.adminUi === "react" || answers.tabReact === "yes";
	const usePrettier = answers.tools?.includes("Prettier");

	const template = `
${useReact ? "admin/build/" : ""}
${useTypeScript ? "build/" : ""}
${usePrettier ? ".prettierrc.js" : ""}
**/.eslintrc.js
admin/words.js
`;
	return template.trim().replace(/\n+/g, "\n");
};

templateFunction.customPath = ".eslintignore";
export = templateFunction;
