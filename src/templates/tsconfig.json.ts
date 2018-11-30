import * as JSON5 from "json5";
import { Answers } from "../lib/questions";

export = async (answers: Answers) => {

	const useTypeScript = answers.language === "TypeScript";
	if (!useTypeScript) return;

	const template = `
{
	"compileOnSave": true,
	"compilerOptions": {
		"noEmit": true,
		"noEmitOnError": true,
		"module": "commonjs",
		"moduleResolution": "node",
		"outDir": "./build/",
		"removeComments": false,

		"strict": true,

		"sourceMap": false,
		"inlineSourceMap": false,
		"target": "es6",
		"watch": false
	},
	"include": [
		"**/*.ts"
	],
	"exclude": [
		"build/**",
		"node_modules/**"
	]
}`;
	return JSON5.stringify(JSON5.parse(template), { space: 4, quote: `"` });
};
