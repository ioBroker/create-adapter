import type { TemplateFunction } from "../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {
	const useReleaseScript = answers.releaseScript === "yes";
	if (!useReleaseScript) return;

	const useTypeScript = answers.language === "TypeScript";
	const useAdminReact = answers.adminUi === "react";
	const useTabReact = answers.tabReact === "yes";
	const useReact = useAdminReact || useTabReact;

	const template: Record<string, any> = {
		plugins: ["iobroker", "license", "manual-review"],
	};
	if (useTypeScript || useReact) {
		template.exec = {
			before_commit: "npm run build",
		}
	}


	return JSON.stringify(template, undefined, '\t');
};

templateFunction.customPath = ".releaseconfig.json";
export = templateFunction;
