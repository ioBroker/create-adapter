import { Answers } from "../lib/questions";

export = (answers: Answers) => {

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
	return template.trim();
};
