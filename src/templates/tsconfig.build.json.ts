import { TemplateFunction } from "../lib/createAdapter";
import { Answers } from "../lib/questions";

export = (answers => {

	const useTypeScript = answers.language === "TypeScript";
	if (!useTypeScript) return;

	const template = `
{
	"extends": "./tsconfig.json",
	// Modified config to only compile .ts-files in the src dir
	"compilerOptions": {
		"allowJs": false,
		"noEmit": false,
		"declaration": false
	},
	"include": [
		"src/**/*.ts"
	],
	"exclude": [
		"src/**/*.test.ts"
	]
}`;
	return template.trim();
}) as TemplateFunction;
