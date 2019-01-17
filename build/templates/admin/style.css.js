"use strict";
const createAdapter_1 = require("../../src/lib/createAdapter");
module.exports = (answers => {
    const isAdapter = answers.features.indexOf("adapter") > -1;
    if (!isAdapter)
        return;
    return createAdapter_1.readFile("style.raw.css", __dirname);
});
