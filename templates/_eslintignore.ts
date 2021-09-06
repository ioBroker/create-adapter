import type { TemplateFunction } from "../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useESLint = answers.tools?.includes("ESLint")
	if (!useESLint) return;

	const useTypeScript = answers.language === "TypeScript";
	const useReact = answers.adminReact === "yes" || answers.tabReact === "yes";
	const usePrettier = answers.tools?.includes("Prettier");

	const template = `
${useReact ? "admin/build/" : ""}
${useTypeScript ? "build/" : ""}
${usePrettier ? ".prettierrc.js" : ""}
**/.eslintrc.js
`;
	return template.trim().replace(/\n+/g, "\n");
};

templateFunction.customPath = ".eslintignore";
export = templateFunction;
