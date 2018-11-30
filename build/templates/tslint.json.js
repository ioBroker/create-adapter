"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const JSON5 = require("json5");
module.exports = (answers) => __awaiter(this, void 0, void 0, function* () {
    const useTSLint = answers.tools && answers.tools.indexOf("TSLint") > -1;
    if (!useTSLint)
        return;
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
});
