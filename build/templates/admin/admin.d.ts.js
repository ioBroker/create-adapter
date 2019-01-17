"use strict";
const createAdapter_1 = require("../../src/lib/createAdapter");
module.exports = (answers => {
    const useTypeScript = answers.language === "TypeScript";
    const useTypeChecking = answers.tools && answers.tools.indexOf("type checking") > -1;
    if (!useTypeScript && !useTypeChecking)
        return;
    return createAdapter_1.readFile("admin.raw.d.ts", __dirname);
});
