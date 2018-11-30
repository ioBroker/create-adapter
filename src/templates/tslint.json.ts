import * as JSON5 from "json5";
import { Answers } from "../lib/questions";

export = async (answers: Answers) => {

	const useTSLint = answers.tools && answers.tools.indexOf("TSLint") > -1;
	if (!useTSLint) return;

	const template = `
{
	"enable": true,
	"extends": [
		"tslint:recommended"
	],
	"rules": {
		"indent": [true, "tabs", 4],
		"object-literal-sort-keys": false,
		"object-literal-shorthand": false,
		"array-type": [true, "array"],
		"max-line-length": [false],
		"interface-name": [false],
		"variable-name": [
			true,
			"ban-keywords",
			"check-format", "allow-leading-underscore", "allow-trailing-underscore"
		],
		"member-ordering": [false],
		"curly": [true, "ignore-same-line"],
		"triple-equals": [true, "allow-undefined-check", "allow-null-check"],
		"arrow-parens": false,
		"no-bitwise": false,
		"max-classes-per-file": false,
		"quotemark": [true, "double", "avoid-escape"],
		"no-console": false
	}
}`;
	return JSON5.stringify(JSON5.parse(template), { space: 4, quote: `"` });
};
