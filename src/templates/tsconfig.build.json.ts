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
	return template.trim();
};
