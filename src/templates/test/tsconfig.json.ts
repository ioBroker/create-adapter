import { TemplateFunction } from "../../lib/createAdapter";

export = (answers => {

	const useTypeScript = answers.language === "TypeScript";
	const useTypeChecking = answers.tools && answers.tools.indexOf("type checking") > -1;
	if (!useTypeScript && !useTypeChecking) return;

	const template = `
{
	"extends": "../tsconfig.json",
	"compilerOptions": {
		"noImplicitAny": false
	},
	"include": [
		"./**/*.js"
	]
}`;
	return template.trim();
}) as TemplateFunction;
