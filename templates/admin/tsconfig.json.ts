import { readFile, TemplateFunction } from "../../src/lib/createAdapter";

export = (answers => {

	const useTypeScript = answers.language === "TypeScript";
	const useTypeChecking = answers.tools && answers.tools.indexOf("type checking") > -1;
	const useJsonConfig = answers.adminUi === 'json';
	const noConfig = answers.adminUi === 'none';
	if ((!useTypeScript && !useTypeChecking) || useJsonConfig || noConfig) return;

	const useReact =
		answers.adminUi === "react" || answers.tabReact === "yes";

	return readFile(
		useTypeScript && useReact
			? "tsconfig_TS-React.raw.json"
			: "tsconfig.raw.json",
		__dirname
	);
}) as TemplateFunction;
