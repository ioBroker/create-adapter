import { readFile, TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useTypeScript = answers.language === "TypeScript";
	const useReact = answers.adminReact === "yes";
	if (!useReact) return;

	return readFile(useTypeScript ? "app.raw.tsx" : "app.raw.jsx", __dirname);
};

templateFunction.customPath = (answers) => {
	const useTypeScript = answers.language === "TypeScript";
	return useTypeScript ? "admin/src/app.tsx" : "admin/src/app.jsx";
}
export = templateFunction;
