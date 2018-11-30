import * as JSON5 from "json5";
import { Answers } from "../lib/questions";

export = async (answers: Answers) => {

	const useTypeScript = answers.language === "TypeScript";
	if (!useTypeScript) return;

	const template = `
{
	"extends": "./tsconfig.json",
	// Modified config to only compile .ts-files in the src dir
	"compilerOptions": {
		"noEmit": false,
		"declaration": false,
	},
	"include": [
		"src/**/*.ts"
	],
	"exclude": [
		"src/**/*.test.ts"
	]
}`;
	return JSON5.stringify(JSON5.parse(template), { space: 4, quote: `"` });
};
