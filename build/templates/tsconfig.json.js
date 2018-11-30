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
    const useTypeScript = answers.language === "TypeScript";
    if (!useTypeScript)
        return;
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
});
