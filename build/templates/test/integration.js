"use strict";
const createAdapter_1 = require("../../src/lib/createAdapter");
module.exports = (answers => {
    const isAdapter = answers.features.indexOf("adapter") > -1;
    if (!isAdapter)
        return;
    return createAdapter_1.readFile("integration.raw.js", __dirname);
});
