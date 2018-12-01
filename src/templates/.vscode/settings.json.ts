import { Answers } from "../../lib/questions";

export = async (answers: Answers) => {

	const useTypeChecking = answers.tools && answers.tools.indexOf("type checking") > -1;
	if (!useTypeChecking) return;

	const template = `
{
	"javascript.implicitProjectConfig.checkJs": true,
}
`;
	return template.trim();
};
