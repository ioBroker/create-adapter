"use strict";
const createAdapter_1 = require("../../src/lib/createAdapter");
module.exports = (answers => {
    const useJavaScript = answers.language === "JavaScript";
    if (!useJavaScript)
        return;
    return createAdapter_1.readFile("tools.raw.js", __dirname);
});
