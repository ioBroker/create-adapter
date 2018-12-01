"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = (answers) => __awaiter(this, void 0, void 0, function* () {
    const useTypeScript = answers.language === "TypeScript";
    const template = (useTypeScript ? `
// Makes ts-node ignore warnings, so mocha --watch does work
process.env.TS_NODE_IGNORE_WARNINGS = "TRUE";
// Sets the correct tsconfig for testing
process.env.TS_NODE_PROJECT = "tsconfig.json";

` : "") + `// Don't silently swallow unhandled rejections
process.on("unhandledRejection", (e) => {
	throw e;
})

// enable the should interface with sinon
// and load chai-as-promised and sinon-chai by default
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
const { should, use } = require("chai");

should();
use(sinonChai);
use(chaiAsPromised);
`;
    return template.trim();
});
