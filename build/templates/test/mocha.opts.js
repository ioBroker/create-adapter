"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const os = require("os");
module.exports = (answers) => __awaiter(this, void 0, void 0, function* () {
    const useTypeScript = answers.language === "TypeScript";
    const template = [
        "--require test/mocha.setup.js",
        useTypeScript ? "--watch-extensions ts" : undefined,
        useTypeScript ? "--require ts-node/register" : undefined,
        useTypeScript ? "--require source-map-support/register" : undefined,
        useTypeScript ? "src/**/*.test.ts" : "{!(node_modules|test)/**/*.test.js,*.test.js,test/test*.js}",
    ].filter(line => !!line).join(os.EOL);
    return template.trim();
});
