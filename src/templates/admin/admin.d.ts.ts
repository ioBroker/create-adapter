import { Answers } from "../../lib/questions";

export = (answers: Answers) => {

	const useTypeScript = answers.language === "TypeScript";
	const useTypeChecking = answers.tools && answers.tools.indexOf("type checking") > -1;
	if (!useTypeScript && !useTypeChecking) return;

	const template = `
declare let systemDictionary: Record<string, Record<string, string>>;
`;
	return template.trim();
};
