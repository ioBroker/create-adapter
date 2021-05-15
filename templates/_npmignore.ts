import { TemplateFunction } from "../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	const useNyc = answers.tools && answers.tools.indexOf("code coverage") > -1;
	const useTypeScript = answers.language === "TypeScript";
	const useTypeChecking = answers.tools && answers.tools.indexOf("type checking") > -1;
	const useReact =
		answers.adminReact === "yes" || answers.tabReact === "yes";

	const template = `
.*
node_modules/
nbproject/
*.code-workspace
Thumbs.db
${isAdapter ? `gulpfile.js` : ""}

# CI test files
test/
travis/
appveyor.yaml

${useReact ? `
# React sources for the Admin UI
admin/src/` : ""}

${useTypeScript ? `
# TypeScript sources and project configuration
src/
tsconfig.json
tsconfig.*.json`
: useTypeChecking ? `
# Type checking configuration
tsconfig.json
tsconfig.*.json` : ""}

# npm package files
iobroker.*.tgz
package-lock.json

${useNyc ? `
# NYC coverage files
coverage` : ""}
${useReact ? "" : `
# i18n intermediate files
admin/i18n
`}
# maintenance scripts
maintenance/**
`;
	return template.trim();
};

templateFunction.customPath = ".npmignore";
export = templateFunction;
