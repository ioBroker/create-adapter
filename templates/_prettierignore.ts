import type { TemplateFunction } from "../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const usePrettier = answers.tools && answers.tools.indexOf("Prettier") > -1;
	if (!usePrettier) return;
	const useTypeScript = answers.language === "TypeScript";

	const template = `
package.json
package-lock.json
${useTypeScript ? "build/" : ""}
`;
	return template.trim();
};

templateFunction.customPath = ".prettierignore";
export = templateFunction;
