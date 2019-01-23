"use strict";
const createAdapter_1 = require("../../src/lib/createAdapter");
module.exports = (answers => {
    // This file is also used by gulpfile.js, so we need it in any case
    const useTypeScript = answers.language === "TypeScript";
    if (useTypeScript)
        return;
    // JS Version
    return createAdapter_1.readFile("tools.raw.js", __dirname);
});
