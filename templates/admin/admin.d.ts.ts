import { readFile, TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useTypeScript = answers.language === "TypeScript";
	const hasTab = answers.adminFeatures && answers.adminFeatures.indexOf("tab") > -1;
	const useAdminHtml = answers.adminUi === "html";
	const useTabReact = hasTab && answers.tabReact === "yes";
	const useTypeChecking = answers.tools && answers.tools.indexOf("type checking") > -1;
	const hasHtml = useAdminHtml || (hasTab && !useTabReact);
	if (!hasHtml || (!useTypeScript && !useTypeChecking)) return;

	return readFile("admin.raw.d.ts", __dirname);
};

export = templateFunction;
