"use strict";
const templateFunction = (answers) => {
    const useTypeChecking = answers.tools && answers.tools.indexOf("type checking") > -1;
    if (!useTypeChecking)
        return;
    const template = `
{
	"javascript.implicitProjectConfig.checkJs": true,
}
`;
    return template.trim();
};
templateFunction.customPath = ".vscode/settings.json";
module.exports = templateFunction;
