import { readFile, TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useTypeScript = answers.language === "TypeScript";
	const useTypeChecking = answers.tools && answers.tools.indexOf("type checking") > -1;
	if (!useTypeScript && !useTypeChecking) return;

	return readFile("admin.raw.d.ts", __dirname);
};

templateFunction.customPath = answers => answers.adminReact === "yes" ? "admin/src/lib/admin.d.ts" : "admin/admin.d.ts";
export = templateFunction;
