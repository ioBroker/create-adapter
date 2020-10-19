import { readFile, TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useTypeScript = answers.language === "TypeScript";
	const useReact = answers.adminReact === "yes";
	if (!(useTypeScript && useReact)) return;

	return readFile("app.raw.tsx", __dirname);
};

export = templateFunction;
