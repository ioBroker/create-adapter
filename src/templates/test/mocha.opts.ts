import * as os from "os";
import { Answers } from "../../lib/questions";

export = async (answers: Answers) => {

	const useTypeScript = answers.language === "TypeScript";

	const template = [
		"--require test/mocha.setup.js",
		useTypeScript ? "--watch-extensions ts" : undefined,
		useTypeScript ? "--require ts-node/register" : undefined,
		useTypeScript ? "--require source-map-support/register" : undefined,
		// Setup the filter in a way that we only test user-defined test files,
		// not the ones for package and adapter tests
		useTypeScript ? "src/**/*.test.ts" : "{!(node_modules|test)/**/*.test.js,*.test.js,test/test*.js}",
	].filter(line => !!line).join(os.EOL);

	return template.trim();
};
